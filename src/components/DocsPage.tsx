import React, { useState } from 'react';
import { 
  Code, 
  Terminal, 
  Check, 
  Copy, 
  ExternalLink, 
  Zap, 
  Globe, 
  ShieldCheck, 
  BookOpen, 
  AlertCircle, 
  CheckCircle2, 
  Bot, 
  Layers, 
  FileCode, 
  ArrowRight,
  Server
} from 'lucide-react';

interface DocsPageProps {
  baseUrl: string;
}

export function DocsPage({ baseUrl }: DocsPageProps) {
  const [copiedIndex, setCopiedIndex] = useState<string | null>(null);
  const [activeLang, setActiveLang] = useState<'html' | 'node' | 'python' | 'php' | 'telegram'>('html');

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(id);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const sampleUrl = `${baseUrl}/result?roll=242372&board=rajshahi&year=2026&reg=2310845068&exam=ssc`;

  const codeSnippets = {
    html: `<!-- Direct HTML <img> Tag Usage -->
<img 
  src="${baseUrl}/result?roll=242372&board=rajshahi&year=2026" 
  alt="Student Result Card" 
  style="max-width: 100%; border-radius: 12px; shadow: 0 10px 30px rgba(0,0,0,0.5);"
/>`,

    node: `// Node.js (Axios or Fetch)
const fs = require('fs');
const axios = require('axios');

async function downloadResultCard() {
  const url = '${baseUrl}/result';
  const params = {
    roll: '242372',
    board: 'rajshahi',
    year: '2026',
    reg: '2310845068',
    exam: 'ssc'
  };

  try {
    const response = await axios.get(url, {
      params,
      responseType: 'arraybuffer'
    });

    fs.writeFileSync('result_card.png', response.data);
    console.log('Result card PNG saved successfully as result_card.png');
  } catch (error) {
    if (error.response) {
      console.error('API Error:', error.response.status, error.response.data.toString());
    } else {
      console.error('Request Error:', error.message);
    }
  }
}

downloadResultCard();`,

    python: `# Python (requests)
import requests

url = "${baseUrl}/result"
params = {
    "roll": "242372",
    "board": "rajshahi",
    "year": "2026",
    "reg": "2310845068",
    "exam": "ssc"
}

response = requests.get(url, params=params)

if response.status_code == 200:
    with open("spider_result.png", "wb") as f:
        f.write(response.content)
    print("Result card saved as spider_result.png")
else:
    print(f"Error {response.status_code}: {response.json()}")`,

    php: `<?php
// PHP cURL Example
$baseUrl = "${baseUrl}/result";
$queryParams = http_build_query([
    'roll'  => '242372',
    'board' => 'rajshahi',
    'year'  => '2026',
    'reg'   => '2310845068',
    'exam'  => 'ssc'
]);

$apiUrl = $baseUrl . '?' . $queryParams;

$imageData = file_get_contents($apiUrl);

if ($imageData !== false) {
    file_put_contents('spider_result.png', $imageData);
    echo "Image saved as spider_result.png";
} else {
    echo "Failed to fetch result image";
}
?>`,

    telegram: `# Telegram Bot Example (python-telegram-bot / pyTelegramBotAPI)
import telebot

bot = telebot.TeleBot("YOUR_TELEGRAM_BOT_TOKEN")

@bot.message_handler(commands=['result'])
def send_result(message):
    # Example command format: /result 242372 rajshahi 2026
    try:
        args = message.text.split()[1:]
        roll, board, year = args[0], args[1], args[2]
        
        image_url = f"${baseUrl}/result?roll={roll}&board={board}&year={year}"
        
        bot.send_photo(
            chat_id=message.chat.id, 
            photo=image_url, 
            caption=f"🕷️ **Spider Result Card**\\nRoll: {roll} | Board: {board.upper()} | Year: {year}",
            parse_mode="Markdown"
        )
    except Exception as e:
        bot.reply_to(message, "❌ Format: /result <roll> <board> <year>")

bot.polling()`
  };

  return (
    <div className="space-y-10 text-slate-200">
      {/* Hero / Quick Intro Section */}
      <div className="bg-gradient-to-br from-slate-900/90 via-slate-900/60 to-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-2xl">
        <div className="absolute -top-24 -right-24 w-80 h-80 bg-[#00f5d4]/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-[#e63946]/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00f5d4]/10 border border-[#00f5d4]/30 text-[#00f5d4] text-xs font-bold font-mono">
            <Zap className="w-3.5 h-3.5" /> DEVELOPER DOCUMENTATION
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Spider Result Card REST API
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            The Spider Result API fetches authentic student exam result data from Bangladesh Education Board servers and dynamically renders a high-definition Cyberpunk PNG card via headless chromium.
          </p>

          <div className="pt-2 flex flex-wrap gap-4 text-xs font-mono">
            <div className="bg-slate-950 border border-slate-800 px-3.5 py-2 rounded-xl flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <span className="text-slate-400">Response Type:</span>
              <span className="text-emerald-400 font-bold">image/png</span>
            </div>
            <div className="bg-slate-950 border border-slate-800 px-3.5 py-2 rounded-xl flex items-center gap-2">
              <span className="text-slate-400">CORS:</span>
              <span className="text-[#00f5d4] font-bold">Enabled (*)</span>
            </div>
            <div className="bg-slate-950 border border-slate-800 px-3.5 py-2 rounded-xl flex items-center gap-2">
              <span className="text-slate-400">Auth:</span>
              <span className="text-amber-400 font-bold">Public (No Key Required)</span>
            </div>
          </div>
        </div>
      </div>

      {/* API Endpoint Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Server className="w-5 h-5 text-[#e63946]" /> Endpoint Definition
        </h3>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-950 p-3.5 rounded-xl border border-slate-800 font-mono text-xs">
            <div className="flex items-center gap-3">
              <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30">
                GET
              </span>
              <span className="text-slate-200 font-bold">{baseUrl}/result</span>
            </div>
            <button
              onClick={() => copyToClipboard(`${baseUrl}/result`, 'endpoint')}
              className="text-xs text-[#00f5d4] hover:underline flex items-center gap-1 font-mono"
            >
              {copiedIndex === 'endpoint' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {copiedIndex === 'endpoint' ? 'Copied' : 'Copy Endpoint'}
            </button>
          </div>
          <p className="text-xs text-slate-400">
            Returns the dynamic PNG image stream directly. Can be placed directly into an <code className="text-cyan-300 font-mono">&lt;img src="..." /&gt;</code> tag or used in Telegram/Discord bots.
          </p>
        </div>
      </div>

      {/* Query Parameters Table */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Layers className="w-5 h-5 text-[#00f5d4]" /> Request Parameters
        </h3>

        <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 uppercase font-bold border-b border-slate-800">
              <tr>
                <th className="p-4">Parameter</th>
                <th className="p-4">Type</th>
                <th className="p-4">Required</th>
                <th className="p-4">Example</th>
                <th className="p-4">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 font-mono">
              <tr className="hover:bg-slate-800/40 transition-colors">
                <td className="p-4 text-[#00f5d4] font-bold">roll</td>
                <td className="p-4 text-slate-400">string</td>
                <td className="p-4">
                  <span className="px-2 py-0.5 rounded bg-red-500/20 text-red-400 font-bold border border-red-500/30">Yes</span>
                </td>
                <td className="p-4 text-amber-300">242372</td>
                <td className="p-4 text-slate-300 font-sans">Roll number of the student.</td>
              </tr>
              <tr className="hover:bg-slate-800/40 transition-colors">
                <td className="p-4 text-[#00f5d4] font-bold">board</td>
                <td className="p-4 text-slate-400">string</td>
                <td className="p-4">
                  <span className="px-2 py-0.5 rounded bg-red-500/20 text-red-400 font-bold border border-red-500/30">Yes</span>
                </td>
                <td className="p-4 text-amber-300">rajshahi</td>
                <td className="p-4 text-slate-300 font-sans">
                  Board name: <code className="text-cyan-300">dhaka</code>, <code className="text-cyan-300">rajshahi</code>, <code className="text-cyan-300">comilla</code>, <code className="text-cyan-300">chittagong</code>, <code className="text-cyan-300">barisal</code>, <code className="text-cyan-300">sylhet</code>, <code className="text-cyan-300">jessore</code>, <code className="text-cyan-300">dinajpur</code>, <code className="text-cyan-300">mymensingh</code>, <code className="text-cyan-300">technical</code>, <code className="text-cyan-300">madrasah</code>.
                </td>
              </tr>
              <tr className="hover:bg-slate-800/40 transition-colors">
                <td className="p-4 text-[#00f5d4] font-bold">year</td>
                <td className="p-4 text-slate-400">string</td>
                <td className="p-4">
                  <span className="px-2 py-0.5 rounded bg-red-500/20 text-red-400 font-bold border border-red-500/30">Yes</span>
                </td>
                <td className="p-4 text-amber-300">2026</td>
                <td className="p-4 text-slate-300 font-sans">Examination year (e.g., 2026, 2025).</td>
              </tr>
              <tr className="hover:bg-slate-800/40 transition-colors">
                <td className="p-4 text-purple-400 font-bold">reg</td>
                <td className="p-4 text-slate-400">string</td>
                <td className="p-4">
                  <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">Optional</span>
                </td>
                <td className="p-4 text-amber-300">2310845068</td>
                <td className="p-4 text-slate-300 font-sans">Student registration number. Required by some boards for detailed marksheet.</td>
              </tr>
              <tr className="hover:bg-slate-800/40 transition-colors">
                <td className="p-4 text-purple-400 font-bold">exam</td>
                <td className="p-4 text-slate-400">string</td>
                <td className="p-4">
                  <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">Optional</span>
                </td>
                <td className="p-4 text-amber-300">ssc</td>
                <td className="p-4 text-slate-300 font-sans">
                  Exam type: <code className="text-cyan-300">ssc</code> (default), <code className="text-cyan-300">hsc</code>, or <code className="text-cyan-300">jsc</code>.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Code Examples Tabs */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <FileCode className="w-5 h-5 text-amber-400" /> Integration Code Examples
          </h3>

          <div className="flex flex-wrap gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
            {(['html', 'node', 'python', 'php', 'telegram'] as const).map((lang) => (
              <button
                key={lang}
                onClick={() => setActiveLang(lang)}
                className={`px-3 py-1.5 rounded-lg font-mono font-bold uppercase transition-all ${
                  activeLang === lang
                    ? 'bg-[#e63946] text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {lang === 'node' ? 'Node.js' : lang === 'telegram' ? 'Telegram Bot' : lang.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        <div className="relative bg-slate-950 border border-slate-800 rounded-2xl p-5 font-mono text-xs text-slate-200 shadow-xl overflow-x-auto">
          <button
            onClick={() => copyToClipboard(codeSnippets[activeLang], activeLang)}
            className="absolute top-4 right-4 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-[#00f5d4] text-xs text-[#00f5d4] font-mono transition-all flex items-center gap-1.5"
          >
            {copiedIndex === activeLang ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            {copiedIndex === activeLang ? 'Copied!' : 'Copy Code'}
          </button>
          <pre className="pr-20 whitespace-pre leading-relaxed">{codeSnippets[activeLang]}</pre>
        </div>
      </div>

      {/* HTTP Status Codes & Error Handling */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-400" /> Response Status & Error Handling
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-2">
            <div className="flex items-center gap-2 text-emerald-400 font-bold font-mono text-xs">
              <CheckCircle2 className="w-4 h-4" /> 200 OK
            </div>
            <p className="text-xs text-slate-400">
              Result found and PNG image stream generated successfully.
            </p>
            <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 font-mono text-[11px] text-slate-300">
              Content-Type: image/png
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-2">
            <div className="flex items-center gap-2 text-amber-400 font-bold font-mono text-xs">
              <AlertCircle className="w-4 h-4" /> 400 Bad Request
            </div>
            <p className="text-xs text-slate-400">
              Missing required parameters (<code className="text-amber-300">roll</code>, <code className="text-amber-300">board</code>, or <code className="text-amber-300">year</code>).
            </p>
            <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 font-mono text-[11px] text-slate-300">
              {`{"error": true, "message": "Missing required..."}`}
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-2">
            <div className="flex items-center gap-2 text-red-400 font-bold font-mono text-xs">
              <AlertCircle className="w-4 h-4" /> 404 Not Found
            </div>
            <p className="text-xs text-slate-400">
              Result not found for given details or student name missing.
            </p>
            <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 font-mono text-[11px] text-slate-300">
              {`{"error": true, "message": "Result not found..."}`}
            </div>
          </div>
        </div>
      </div>

      {/* Render Deployment Guide */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Server className="w-5 h-5 text-[#00f5d4]" /> Render Web Service Deployment Guide
        </h3>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1">
              <span className="text-slate-400 font-bold block text-[11px] uppercase tracking-wider">Build Command</span>
              <code className="text-[#00f5d4] font-mono font-bold">npm install && npm run build</code>
            </div>
            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1">
              <span className="text-slate-400 font-bold block text-[11px] uppercase tracking-wider">Start Command</span>
              <code className="text-[#00f5d4] font-mono font-bold">npm start</code>
            </div>
            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1">
              <span className="text-slate-400 font-bold block text-[11px] uppercase tracking-wider">Environment Variable</span>
              <code className="text-amber-300 font-mono font-bold">PUPPETEER_CACHE_DIR=./.cache/puppeteer</code>
            </div>
            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1">
              <span className="text-slate-400 font-bold block text-[11px] uppercase tracking-wider">Auto Config File</span>
              <code className="text-purple-300 font-mono font-bold">render.yaml included in repository</code>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-gradient-to-r from-[#e63946]/20 via-slate-900 to-[#00f5d4]/20 border border-slate-800 rounded-2xl p-6 text-center space-y-3">
        <h4 className="text-base font-bold text-white">Ready to test the API in real time?</h4>
        <p className="text-xs text-slate-400 max-w-lg mx-auto">
          Use the interactive API Tester to generate sample cards and copy live URL strings for your application.
        </p>
        <div className="pt-1">
          <a
            href={sampleUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#00f5d4] hover:bg-teal-300 text-slate-950 font-black text-xs uppercase tracking-wider transition-all shadow-lg shadow-[#00f5d4]/20"
          >
            <Globe className="w-4 h-4" /> Test Live Endpoint
          </a>
        </div>
      </div>
    </div>
  );
}
