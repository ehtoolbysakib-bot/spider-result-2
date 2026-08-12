import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Copy, 
  Check, 
  ExternalLink, 
  Download, 
  Code, 
  Terminal, 
  AlertCircle, 
  CheckCircle2, 
  RefreshCw, 
  ShieldCheck, 
  BookOpen, 
  User, 
  GraduationCap, 
  Calendar,
  Globe,
  FileType,
  BookMarked,
  Play
} from 'lucide-react';
import { DocsPage } from './components/DocsPage';

const Spider = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 3a3 3 0 0 0-3 3v2a3 3 0 0 0 6 0V6a3 3 0 0 0-3-3z" />
    <path d="M12 11a5 5 0 0 0-5 5v3a5 5 0 0 0 10 0v-3a5 5 0 0 0-5-5z" />
    <path d="M4 6c3 1 5 3 5 5" />
    <path d="M20 6c-3 1-5 3-5 5" />
    <path d="M2 12c3 0 6 1 7 4" />
    <path d="M22 12c-3 0-6 1-7 4" />
    <path d="M4 20c2-1 5-2 8-2s6 1 8 2" />
  </svg>
);

const BOARDS = [
  { id: 'rajshahi', name: 'Rajshahi' },
  { id: 'dhaka', name: 'Dhaka' },
  { id: 'comilla', name: 'Comilla' },
  { id: 'chittagong', name: 'Chittagong' },
  { id: 'barisal', name: 'Barisal' },
  { id: 'sylhet', name: 'Sylhet' },
  { id: 'jessore', name: 'Jessore' },
  { id: 'dinajpur', name: 'Dinajpur' },
  { id: 'mymensingh', name: 'Mymensingh' },
  { id: 'technical', name: 'Technical' },
  { id: 'madrasah', name: 'Madrasah' }
];

const EXAMS = [
  { id: 'ssc', name: 'SSC / Dakhil / Equivalent' },
  { id: 'hsc', name: 'HSC / Alim / Equivalent' },
  { id: 'jsc', name: 'JSC / JDC' }
];

export default function App() {
  const [exam, setExam] = useState('ssc');
  const [board, setBoard] = useState('rajshahi');
  const [year, setYear] = useState('2026');
  const [roll, setRoll] = useState('');
  const [reg, setReg] = useState('');

  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'preview' | 'docs' | 'curl'>('preview');
  const [viewMode, setViewMode] = useState<'tester' | 'docs'>('docs');

  // Build full API URL based on current origin
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
  const queryParams = new URLSearchParams({
    roll: roll.trim(),
    board: board.trim(),
    year: year.trim(),
    ...(reg.trim() ? { reg: reg.trim() } : {}),
    ...(exam !== 'ssc' ? { exam } : {})
  });

  const apiUrl = `${baseUrl}/result?${queryParams.toString()}`;

  // Handle generation
  const handleGenerate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!roll || !board || !year) {
      setErrorMsg('Please fill in Roll, Board, and Year.');
      return;
    }

    setLoading(true);
    setErrorMsg(null);
    setImageUrl(null);

    try {
      // Fetch result PNG from server API
      const res = await fetch(apiUrl);

      if (!res.ok) {
        let errorData: any = {};
        try {
          errorData = await res.json();
        } catch (_) {}
        
        const mainMessage = errorData.message || `API Error: HTTP ${res.status}`;
        const detailMessage = errorData.details ? ` Details: ${errorData.details}` : '';
        throw new Error(`${mainMessage}${detailMessage}`);
      }

      const blob = await res.blob();
      const objectUrl = URL.createObjectURL(blob);
      setImageUrl(objectUrl);
    } catch (err: any) {
      console.error('Generation error:', err);
      setErrorMsg(err.message || 'Failed to generate result image. Please verify your details.');
    } finally {
      setLoading(false);
    }
  };

  // Copy API link
  const handleCopy = () => {
    navigator.clipboard.writeText(apiUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Download image
  const handleDownload = () => {
    if (!imageUrl) return;
    const a = document.createElement('a');
    a.href = imageUrl;
    a.download = `spider_result_${roll || 'card'}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // Initial load preview
  useEffect(() => {
    if (roll && board && year) {
      handleGenerate();
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#07070b] text-slate-100 font-sans selection:bg-[#e63946] selection:text-white">
      {/* Background Cyberpunk Spider Webs */}
      <div className="fixed inset-0 pointer-events-none opacity-20 overflow-hidden z-0">
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-gradient-to-br from-[#e63946]/30 to-[#00f5d4]/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-gradient-to-tr from-[#00f5d4]/20 to-[#e63946]/20 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Header Section */}
        <header className="mb-10 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6 border-b border-slate-800/80 pb-8">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#e63946]/30 to-[#00f5d4]/20 border border-[#e63946]/40 flex items-center justify-center text-[#e63946] shadow-[0_0_25px_rgba(230,57,70,0.3)]">
              <Spider className="w-8 h-8 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-200 to-[#00f5d4]">
                  SPIDER RESULT CARD API
                </h1>
                <span className="hidden md:inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#e63946]/20 text-[#e63946] border border-[#e63946]/40">
                  v1.0
                </span>
              </div>
              <p className="text-sm text-slate-400 mt-1">
                Dynamic Cyberpunk PNG Result Card Generator for BD Exam Results
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-slate-900 p-1.5 rounded-2xl border border-slate-800">
            <button
              onClick={() => setViewMode('docs')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                viewMode === 'docs'
                  ? 'bg-gradient-to-r from-[#e63946] to-rose-600 text-white shadow-lg shadow-[#e63946]/20'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <BookMarked className="w-4 h-4 text-[#00f5d4]" />
              Developer Docs
            </button>
            <button
              onClick={() => setViewMode('tester')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                viewMode === 'tester'
                  ? 'bg-gradient-to-r from-[#e63946] to-rose-600 text-white shadow-lg shadow-[#e63946]/20'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Play className="w-4 h-4 text-emerald-400" />
              API Tester
            </button>
            <a
              href={apiUrl}
              target="_blank"
              rel="noreferrer"
              className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 transition-all flex items-center gap-2 hidden sm:flex"
            >
              <Globe className="w-4 h-4" />
              GET Endpoint
            </a>
          </div>
        </header>

        {/* Content Body */}
        {viewMode === 'docs' ? (
          <DocsPage baseUrl={baseUrl} />
        ) : (
        /* Main Grid: Form Left, Preview/Docs Right */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Form Controls */}
          <div className="lg:col-span-5 bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#e63946] via-[#00f5d4] to-[#e63946]"></div>

            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Search className="w-5 h-5 text-[#00f5d4]" />
                Result Query Parameters
              </h2>
              <span className="text-xs text-slate-500 font-mono">GET /result</span>
            </div>

            <form onSubmit={handleGenerate} className="space-y-4">
              {/* Exam Selection */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-2">
                  <GraduationCap className="w-3.5 h-3.5 text-[#e63946]" /> Exam Type
                </label>
                <select
                  value={exam}
                  onChange={(e) => setExam(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-[#00f5d4] focus:ring-1 focus:ring-[#00f5d4] transition-all"
                >
                  {EXAMS.map((e) => (
                    <option key={e.id} value={e.id}>{e.name}</option>
                  ))}
                </select>
              </div>

              {/* Board & Year Row */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-2">
                    <BookOpen className="w-3.5 h-3.5 text-[#00f5d4]" /> Board
                  </label>
                  <select
                    value={board}
                    onChange={(e) => setBoard(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-[#00f5d4] focus:ring-1 focus:ring-[#00f5d4] transition-all"
                  >
                    {BOARDS.map((b) => (
                      <option key={b.id} value={b.id}>{b.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-amber-400" /> Year
                  </label>
                  <input
                    type="number"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    placeholder="2026"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-[#00f5d4] focus:ring-1 focus:ring-[#00f5d4] transition-all"
                  />
                </div>
              </div>

              {/* Roll Number */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-2">
                  <User className="w-3.5 h-3.5 text-cyan-400" /> Roll Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={roll}
                  onChange={(e) => setRoll(e.target.value)}
                  placeholder="e.g. 123456"
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-200 font-mono focus:outline-none focus:border-[#00f5d4] focus:ring-1 focus:ring-[#00f5d4] transition-all"
                />
              </div>

              {/* Registration Number */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-purple-400" /> Registration No (Optional)
                </label>
                <input
                  type="text"
                  value={reg}
                  onChange={(e) => setReg(e.target.value)}
                  placeholder="e.g. 1812345678"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-200 font-mono focus:outline-none focus:border-[#00f5d4] focus:ring-1 focus:ring-[#00f5d4] transition-all"
                />
              </div>

              {/* Generate Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full mt-4 py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#e63946] via-rose-600 to-[#00f5d4] hover:opacity-95 text-white font-black text-sm tracking-wide uppercase transition-all shadow-lg shadow-[#e63946]/20 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Generating Spider Card...
                  </>
                ) : (
                  <>
                    <Spider className="w-4 h-4" />
                    Generate PNG Result Card
                  </>
                )}
              </button>
            </form>

            {/* Generated API URL Box */}
            <div className="mt-6 pt-6 border-t border-slate-800">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center justify-between">
                <span>Direct API Request URL</span>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="text-xs text-[#00f5d4] hover:underline flex items-center gap-1 font-mono"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'Copied!' : 'Copy Link'}
                </button>
              </label>
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 font-mono text-xs text-slate-300 break-all select-all">
                {apiUrl}
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Preview & Documentation */}
          <div className="lg:col-span-7 space-y-6">
            {/* Tab Controls */}
            <div className="flex items-center gap-2 bg-slate-900 p-1.5 rounded-2xl border border-slate-800">
              <button
                onClick={() => setActiveTab('preview')}
                className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                  activeTab === 'preview'
                    ? 'bg-gradient-to-r from-[#e63946] to-rose-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <FileType className="w-4 h-4" /> Result Card Preview
              </button>
              <button
                onClick={() => setActiveTab('docs')}
                className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                  activeTab === 'docs'
                    ? 'bg-gradient-to-r from-[#e63946] to-rose-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Code className="w-4 h-4" /> API Specification
              </button>
              <button
                onClick={() => setActiveTab('curl')}
                className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                  activeTab === 'curl'
                    ? 'bg-gradient-to-r from-[#e63946] to-rose-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Terminal className="w-4 h-4" /> cURL Example
              </button>
            </div>

            {/* Tab 1: Image Preview */}
            {activeTab === 'preview' && (
              <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 min-h-[500px] flex flex-col justify-between items-center relative overflow-hidden">
                {errorMsg && (
                  <div className="w-full mb-4 p-4 rounded-xl bg-red-950/50 border border-red-500/40 text-red-200 text-xs flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold block mb-1">Result Generation Error:</span>
                      {errorMsg}
                    </div>
                  </div>
                )}

                {loading ? (
                  <div className="my-auto text-center space-y-4 py-16">
                    <div className="relative w-16 h-16 mx-auto">
                      <div className="absolute inset-0 rounded-full border-4 border-slate-800 border-t-[#e63946] border-r-[#00f5d4] animate-spin"></div>
                      <Spider className="w-8 h-8 text-[#e63946] absolute inset-0 m-auto" />
                    </div>
                    <p className="text-sm font-semibold text-slate-300">Rendering Spider Cyberpunk Result Card...</p>
                    <p className="text-xs text-slate-500 max-w-xs mx-auto">
                      Headless Puppeteer is calculating dynamic content height and rendering Retina PNG image.
                    </p>
                  </div>
                ) : imageUrl ? (
                  <div className="w-full space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                      <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
                        <CheckCircle2 className="w-4 h-4" /> 200 OK • PNG Image Rendered
                      </div>
                      <div className="flex items-center gap-2">
                        <a
                          href={imageUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 flex items-center gap-1.5 transition-all"
                        >
                          <ExternalLink className="w-3.5 h-3.5" /> Open Inline
                        </a>
                        <button
                          onClick={handleDownload}
                          className="px-3 py-1.5 rounded-lg bg-[#00f5d4] hover:bg-teal-300 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow-md shadow-[#00f5d4]/20"
                        >
                          <Download className="w-3.5 h-3.5" /> Download PNG
                        </button>
                      </div>
                    </div>

                    <div className="rounded-xl border border-slate-800 overflow-hidden bg-[#050508] p-2 flex justify-center shadow-inner">
                      <img
                        src={imageUrl}
                        alt="Spider Result Card"
                        className="max-w-full h-auto rounded-lg shadow-2xl transition-all duration-300"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="my-auto text-center space-y-3 py-16 text-slate-500">
                    <Spider className="w-12 h-12 mx-auto text-slate-700 opacity-50" />
                    <p className="text-sm font-medium">Click "Generate PNG Result Card" to preview output.</p>
                  </div>
                )}
              </div>
            )}

            {/* Tab 2: API Specification */}
            {activeTab === 'docs' && (
              <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 space-y-6 text-xs text-slate-300">
                <div>
                  <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                    <Code className="w-4 h-4 text-[#00f5d4]" /> Query Parameters
                  </h3>
                  <div className="overflow-x-auto rounded-xl border border-slate-800">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-950 text-slate-400 uppercase font-bold border-b border-slate-800">
                        <tr>
                          <th className="p-3">Parameter</th>
                          <th className="p-3">Type</th>
                          <th className="p-3">Status</th>
                          <th className="p-3">Description</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60 font-mono">
                        <tr>
                          <td className="p-3 text-[#00f5d4] font-bold">roll</td>
                          <td className="p-3 text-slate-400">string</td>
                          <td className="p-3 text-red-400 font-bold">Required</td>
                          <td className="p-3 text-slate-300 font-sans">Roll number of the student.</td>
                        </tr>
                        <tr>
                          <td className="p-3 text-[#00f5d4] font-bold">board</td>
                          <td className="p-3 text-slate-400">string</td>
                          <td className="p-3 text-red-400 font-bold">Required</td>
                          <td className="p-3 text-slate-300 font-sans">Board name (e.g., rajshahi, dhaka).</td>
                        </tr>
                        <tr>
                          <td className="p-3 text-[#00f5d4] font-bold">year</td>
                          <td className="p-3 text-slate-400">string</td>
                          <td className="p-3 text-red-400 font-bold">Required</td>
                          <td className="p-3 text-slate-300 font-sans">Exam year (e.g., 2026).</td>
                        </tr>
                        <tr>
                          <td className="p-3 text-amber-400 font-bold">reg</td>
                          <td className="p-3 text-slate-400">string</td>
                          <td className="p-3 text-slate-500">Optional</td>
                          <td className="p-3 text-slate-300 font-sans">Registration number.</td>
                        </tr>
                        <tr>
                          <td className="p-3 text-amber-400 font-bold">exam</td>
                          <td className="p-3 text-slate-400">string</td>
                          <td className="p-3 text-slate-500">Optional</td>
                          <td className="p-3 text-slate-300 font-sans">Exam type (default: "ssc").</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-[#e63946]" /> Response Headers & Error Codes
                  </h3>
                  <div className="space-y-2 bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono">
                    <p className="text-emerald-400">200 OK: Content-Type: image/png (Inline image buffer)</p>
                    <p className="text-amber-400">400 Bad Request: Missing roll, board, or year parameters.</p>
                    <p className="text-red-400">404 Not Found: Student name not found or API down.</p>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 3: cURL Example */}
            {activeTab === 'curl' && (
              <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 space-y-4">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-amber-400" /> Terminal / Shell Command
                </h3>
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-xs text-slate-300 relative">
                  <pre className="whitespace-pre-wrap">
{`# Download result image directly via cURL
curl -s "${apiUrl}" --output spider_result_${roll}.png

# Or view headers
curl -I "${apiUrl}"`}
                  </pre>
                  <button
                    onClick={handleCopy}
                    className="absolute top-3 right-3 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-[11px] text-[#00f5d4]"
                  >
                    {copied ? 'Copied' : 'Copy'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
        )}

        {/* Footer Credit */}
        <footer className="mt-16 pt-8 border-t border-slate-800/80 text-center text-xs text-slate-500">
          <p>
            &copy; <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#e63946] to-[#00f5d4]">SA K IB</span> &bull; SPIDER BOT RESULT CARD GENERATOR API
          </p>
        </footer>
      </div>
    </div>
  );
}
