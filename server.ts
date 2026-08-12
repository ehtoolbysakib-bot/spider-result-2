import express, { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import puppeteerCore, { Browser } from 'puppeteer-core';
import puppeteer from 'puppeteer';
import chromium from '@sparticuz/chromium';
import { generateHTML, ResultData } from './src/template';

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// Enable CORS for API consumers
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'GET, OPTIONS');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Helper to recursively find chrome binary in directory
function findBinaryInDir(dirPath: string, targetName: string): string | null {
  if (!fs.existsSync(dirPath)) return null;
  try {
    const entries = fs.readdirSync(dirPath, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dirPath, entry.name);
      if (entry.isDirectory()) {
        const found = findBinaryInDir(fullPath, targetName);
        if (found) return found;
      } else if (entry.isFile() && (entry.name === targetName || entry.name === targetName + '.exe')) {
        return fullPath;
      }
    }
  } catch (e) {
    // ignore
  }
  return null;
}

// Helper to locate Chrome executable on Windows, Linux, or Puppeteer cache
function findChromeExecutable(): string | null {
  if (process.env.CHROME_PATH && fs.existsSync(process.env.CHROME_PATH)) {
    return process.env.CHROME_PATH;
  }

  const standardPaths = [
    // Windows 64-bit Chrome path
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
    process.env.LOCALAPPDATA + '\\Google\\Chrome\\Application\\chrome.exe',
    // Linux paths
    '/usr/bin/google-chrome',
    '/usr/bin/google-chrome-stable',
    '/usr/bin/chromium',
    '/usr/bin/chromium-browser',
    '/snap/bin/chromium'
  ];

  for (const p of standardPaths) {
    if (p && fs.existsSync(p)) {
      return p;
    }
  }

  // Check puppeteer.executablePath()
  try {
    const pPath = puppeteer.executablePath();
    if (typeof pPath === 'string' && fs.existsSync(pPath)) {
      return pPath;
    }
  } catch (e) {
    // ignore
  }

  // Recursively search in local and cloud cache directories
  const searchDirs = [
    path.join(process.cwd(), '.cache'),
    path.join(process.cwd(), '.cache', 'puppeteer'),
    '/opt/render/.cache',
    '/opt/render/.cache/puppeteer',
    '/root/.cache',
    '/root/.cache/puppeteer'
  ];

  const targetName = process.platform === 'win32' ? 'chrome.exe' : 'chrome';
  for (const cacheDir of searchDirs) {
    const found = findBinaryInDir(cacheDir, targetName);
    if (found) {
      console.log(`[Puppeteer] Found Chrome in cache dir: ${found}`);
      return found;
    }
  }

  return null;
}

// Helper to launch browser instance
async function launchBrowser(): Promise<Browser> {
  const executablePath = findChromeExecutable();

  const launchArgs = [
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--disable-gpu',
    '--disable-dev-shm-usage',
    '--disable-software-rasterizer',
    '--no-first-run',
    '--no-zygote',
    '--single-process'
  ];

  if (executablePath) {
    console.log(`[Puppeteer] Launching browser with detected executable: ${executablePath}`);
    return await puppeteerCore.launch({
      executablePath,
      headless: true,
      args: launchArgs
    }) as unknown as Browser;
  }

  // Fallback to @sparticuz/chromium for Render / Linux Cloud Services
  try {
    console.log(`[Puppeteer] Launching browser with @sparticuz/chromium...`);
    const sparticuzPath = await chromium.executablePath();
    console.log(`[Puppeteer] @sparticuz/chromium path: ${sparticuzPath}`);
    const sparticuzChromium = chromium as any;

    return await puppeteerCore.launch({
      args: sparticuzChromium.args || launchArgs,
      defaultViewport: sparticuzChromium.defaultViewport || { width: 1080, height: 1920 },
      executablePath: sparticuzPath,
      headless: sparticuzChromium.headless ?? true
    }) as unknown as Browser;
  } catch (sparticuzError: any) {
    console.warn(`[Puppeteer] @sparticuz/chromium launch error, falling back to puppeteer standard launch:`, sparticuzError?.message || sparticuzError);
    return await puppeteer.launch({
      headless: true,
      args: launchArgs
    }) as unknown as Browser;
  }
}

// Health Check Endpoint
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'Spider Result Card Generator API',
    chromePath: findChromeExecutable() ? 'Detected' : 'Not Found'
  });
});

/**
 * Main GET /result & GET /api/result endpoint
 */
async function handleResultRequest(req: Request, res: Response) {
  const { roll, board, year, reg, exam = 'ssc' } = req.query;

  console.log(`[API Request] GET /result - roll: ${roll}, board: ${board}, year: ${year}, reg: ${reg}, exam: ${exam}`);

  // 1. Parameter Validation
  if (!roll || !board || !year) {
    console.error(`[Validation Error] Missing required params. Roll: ${roll}, Board: ${board}, Year: ${year}`);
    return res.status(400).json({
      error: true,
      message: "Missing required query parameters: 'roll', 'board', and 'year' are required."
    });
  }

  let resultData: ResultData | null = null;
  let externalErrorMessage: string | null = null;

  // 2. Fetch external result API
  const regParam = reg ? String(reg) : '';
  const apiUrl = `https://noobs-api.top/dipto/result?exam=${encodeURIComponent(String(exam))}&board=${encodeURIComponent(String(board))}&roll=${encodeURIComponent(String(roll))}&reg=${encodeURIComponent(regParam)}&year=${encodeURIComponent(String(year))}`;

  console.log(`[External Fetch] Calling API: ${apiUrl}`);

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

    const apiResponse = await fetch(apiUrl, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'SpiderResultBot/1.0',
        'Accept': 'application/json'
      }
    });
    clearTimeout(timeoutId);

    const json = await apiResponse.json().catch(() => null);
    console.log(`[External Response] Data received:`, JSON.stringify(json)?.slice(0, 200));

    if (json) {
      if (json.name || json.student_name) {
        resultData = json;
      } else if (json.message || json.status) {
        externalErrorMessage = json.message || json.status;
      }
    }
  } catch (fetchErr: any) {
    console.error(`[Fetch Error] Failed to fetch external API:`, fetchErr.message);
    externalErrorMessage = fetchErr.message;
  }

  // 3. Return 404 if data missing or name invalid
  if (!resultData || (!resultData.name && !resultData.student_name)) {
    const errorMsg = externalErrorMessage 
      ? `External API Message: ${externalErrorMessage}` 
      : "Result not found or student name missing for provided details. Check your Roll, Board, Year, and Registration number.";

    return res.status(404).json({
      error: true,
      message: errorMsg
    });
  }

  // 4. Generate HTML and render PNG via Puppeteer
  let browser: Browser | null = null;
  try {
    const htmlContent = generateHTML(resultData);

    browser = await launchBrowser();
    const page = await browser.newPage();

    // Step 1: Set initial viewport
    await page.setViewport({
      width: 1080,
      height: 1920,
      deviceScaleFactor: 2 // Retina quality
    });

    // Step 2: Set HTML content and wait until network is idle
    await page.setContent(htmlContent, {
      waitUntil: 'networkidle0' as any,
      timeout: 15000
    });

    // Step 3: Wait for web fonts (Inter & Font Awesome)
    try {
      await page.evaluateHandle(() => document.fonts.ready);
    } catch (e) {
      console.warn('[Puppeteer] Font load wait timeout, proceeding...');
    }

    // Step 4: Measure document body height dynamically
    const bodyHeight = await page.evaluate(() => {
      const cardEl = document.querySelector('.card-wrapper');
      if (cardEl) {
        return Math.max(cardEl.getBoundingClientRect().height, document.body.scrollHeight);
      }
      return document.body.scrollHeight;
    });

    const targetHeight = Math.ceil(bodyHeight) || 800;
    console.log(`[Puppeteer] Dynamic height measured: ${targetHeight}px`);

    // Step 5: Resize viewport to exact height
    await page.setViewport({
      width: 920,
      height: targetHeight,
      deviceScaleFactor: 2
    });

    // Step 6: Capture screenshot as PNG
    const imageBuffer = await page.screenshot({
      type: 'png',
      fullPage: false,
      omitBackground: false
    });

    // Step 7: Send inline PNG response
    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Content-Disposition', `inline; filename="spider_result_${roll}.png"`);
    res.setHeader('Cache-Control', 'public, max-age=3600');
    return res.send(Buffer.from(imageBuffer));

  } catch (renderError: any) {
    console.error(`[Puppeteer Rendering Error]:`, renderError);
    return res.status(500).json({
      error: true,
      message: "Failed to generate result card image.",
      details: renderError.message
    });
  } finally {
    if (browser) {
      try {
        await browser.close();
        console.log(`[Puppeteer] Browser closed successfully`);
      } catch (e) {
        console.error(`[Puppeteer] Error closing browser:`, e);
      }
    }
  }
}

// Register route handlers
app.get('/result', handleResultRequest);
app.get('/api/result', handleResultRequest);

// Start Express server and attach Vite middleware
async function startServer() {
  // Vite middleware in dev mode
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    if (fs.existsSync(distPath)) {
      app.use(express.static(distPath));
      app.get('*', (req, res) => {
        res.sendFile(path.join(distPath, 'index.html'));
      });
    }
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Spider Result API Server running at http://0.0.0.0:${PORT}`);
    console.log(`📌 API Endpoint: http://localhost:${PORT}/result?roll=123456&board=rajshahi&year=2026`);
  });
}

startServer();
