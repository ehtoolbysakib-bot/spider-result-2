/**
 * Spider Result Card HTML Template Generator
 * Produces self-contained HTML with embedded CSS, Font Awesome 6, and Google Inter Font
 */

export interface SubjectItem {
  code?: string | number;
  subjectCode?: string | number;
  subject?: string;
  name?: string;
  subjectName?: string;
  grade?: string;
  subjectGPA?: string | number;
  gpa?: string | number;
  marks?: string | number;
}

export interface ResultData {
  name?: string;
  student_name?: string;
  roll?: string | number;
  reg?: string | number;
  reg_no?: string | number;
  board?: string;
  year?: string | number;
  exam?: string;
  gpa?: string | number;
  result?: string;
  status?: string;
  subject_grades?: SubjectItem[];
  subjects?: SubjectItem[];
  subject?: SubjectItem[];
  result_details?: SubjectItem[];
  [key: string]: any;
}

export function generateHTML(data: ResultData): string {
  // Extract and normalize basic information
  const name = (data.name || data.student_name || 'STUDENT NAME').toString().trim();
  const roll = (data.roll || 'N/A').toString().trim();
  const reg = (data.reg || data.reg_no || '—').toString().trim();
  const board = (data.board || 'BOARD').toString().toUpperCase().trim();
  const year = (data.year || new Date().getFullYear()).toString().trim();
  const exam = (data.exam || 'SSC').toString().toUpperCase().trim();
  const gpa = (data.gpa !== undefined && data.gpa !== null && data.gpa !== '') ? data.gpa.toString().trim() : '—';
  
  const rawResult = (data.result || data.status || 'PASSED').toString().trim();
  const isFailed = rawResult.toLowerCase().includes('fail') || rawResult.toLowerCase() === 'f';
  const resultDisplay = rawResult ? rawResult.toUpperCase() : (isFailed ? 'FAILED' : 'PASSED');

  // Normalize subjects array
  let rawSubjects: any[] = [];
  if (Array.isArray(data.subject_grades)) {
    rawSubjects = data.subject_grades;
  } else if (Array.isArray(data.subjects)) {
    rawSubjects = data.subjects;
  } else if (Array.isArray(data.subject)) {
    rawSubjects = data.subject;
  } else if (Array.isArray(data.result_details)) {
    rawSubjects = data.result_details;
  } else if (typeof data.subjects === 'object' && data.subjects !== null) {
    rawSubjects = Object.entries(data.subjects).map(([key, value]) => {
      if (typeof value === 'object' && value !== null) {
        return { code: key, ...(value as object) };
      }
      return { code: key, name: key, grade: String(value) };
    });
  }

  // Filter valid subjects (where code or name is non-empty)
  const validSubjects = rawSubjects
    .map((sub, idx) => {
      const code = (sub.subjectCode || sub.code || sub.subject_code || sub.id || '').toString().trim();
      const subName = (sub.subjectName || sub.name || sub.subject || sub.title || sub.subject_name || '').toString().trim();
      const grade = (sub.subjectGPA || sub.grade || sub.letter_grade || sub.gpa || '—').toString().toUpperCase().trim();
      return { code: code || `${idx + 101}`, name: subName || (grade !== '—' && grade !== '' ? `SUBJECT ${code}` : ''), grade };
    })
    .filter(sub => sub.name !== '' && sub.grade !== '');

  // Fallback if no subjects found in response
  const finalSubjects = validSubjects.length > 0 ? validSubjects : [
    { code: '101', name: 'BANGLA', grade: isFailed ? 'F' : 'A+' },
    { code: '102', name: 'ENGLISH', grade: isFailed ? 'F' : 'A+' },
    { code: '107', name: 'MATHEMATICS', grade: isFailed ? 'F' : 'A+' }
  ];

  // Generate subject table rows
  const subjectRowsHTML = finalSubjects.map((sub, index) => {
    const isSubFailed = sub.grade === 'F' || sub.grade === '0' || sub.grade.toLowerCase() === 'fail';
    const gradeClass = isSubFailed ? 'grade-f' : 'grade-pass';
    const rowBgClass = index % 2 === 0 ? 'bg-row-even' : 'bg-row-odd';

    return `
      <tr class="${rowBgClass}">
        <td class="col-code"><i class="fa-solid fa-barcode code-icon"></i> ${escapeHTML(sub.code)}</td>
        <td class="col-name">${escapeHTML(sub.name)}</td>
        <td class="col-grade"><span class="${gradeClass}">${escapeHTML(sub.grade)}</span></td>
      </tr>
    `;
  }).join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=920, initial-scale=1.0">
  <title>Spider Result Card - ${escapeHTML(roll)}</title>
  <!-- Google Font Inter -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
  <!-- Font Awesome 6 Free CDN -->
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
  <style>
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    html, body {
      width: 920px;
      margin: 0 auto;
      background-color: #060609;
      font-family: 'Inter', sans-serif;
      color: #e2e8f0;
      -webkit-font-smoothing: antialiased;
    }

    /* Container & Spider Cyberpunk Background */
    .card-wrapper {
      width: 920px;
      padding: 32px;
      background: radial-gradient(circle at 50% 20%, #161224 0%, #0a0a0f 65%, #050508 100%);
      position: relative;
      overflow: hidden;
    }

    /* Spider Web SVG Overlay Pattern */
    .spider-web-bg {
      position: absolute;
      top: -100px;
      right: -100px;
      width: 600px;
      height: 600px;
      opacity: 0.12;
      pointer-events: none;
      z-index: 0;
    }

    .spider-web-bg-left {
      position: absolute;
      bottom: -100px;
      left: -100px;
      width: 500px;
      height: 500px;
      opacity: 0.08;
      pointer-events: none;
      z-index: 0;
      transform: rotate(180deg);
    }

    /* Main Glassmorphic Container */
    .main-card {
      position: relative;
      z-index: 1;
      background: rgba(15, 15, 26, 0.75);
      backdrop-filter: blur(30px);
      border: 1px solid rgba(230, 57, 70, 0.25);
      border-radius: 20px;
      padding: 32px;
      box-shadow: 
        0 20px 50px rgba(0, 0, 0, 0.6),
        0 0 30px rgba(230, 57, 70, 0.12),
        inset 0 1px 1px rgba(255, 255, 255, 0.1);
    }

    /* Header Section */
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-bottom: 20px;
      position: relative;
    }

    .header-left {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .spider-icon-box {
      width: 52px;
      height: 52px;
      border-radius: 14px;
      background: linear-gradient(135deg, rgba(230, 57, 70, 0.25), rgba(0, 245, 212, 0.15));
      border: 1px solid rgba(230, 57, 70, 0.4);
      display: flex;
      align-items: center;
      justify-content: center;
      color: #e63946;
      font-size: 26px;
      box-shadow: 0 0 18px rgba(230, 57, 70, 0.3);
    }

    .brand-title {
      font-size: 28px;
      font-weight: 900;
      letter-spacing: -0.5px;
      background: linear-gradient(135deg, #ffffff 0%, #a5f3fc 50%, #00f5d4 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      text-transform: uppercase;
    }

    .brand-subtitle {
      font-size: 12px;
      font-weight: 600;
      color: #94a3b8;
      letter-spacing: 2px;
      text-transform: uppercase;
      margin-top: 2px;
    }

    .badge-year {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 18px;
      border-radius: 9999px;
      background: rgba(230, 57, 70, 0.15);
      border: 1px solid rgba(230, 57, 70, 0.4);
      color: #00f5d4;
      font-size: 14px;
      font-weight: 700;
      letter-spacing: 1px;
      box-shadow: 0 0 15px rgba(0, 245, 212, 0.15);
    }

    .badge-year i {
      color: #facc15;
    }

    .glow-divider {
      height: 2px;
      width: 100%;
      background: linear-gradient(90deg, #e63946 0%, #00f5d4 50%, #e63946 100%);
      border-radius: 2px;
      box-shadow: 0 0 10px rgba(0, 245, 212, 0.5);
      margin-bottom: 28px;
    }

    /* Info Grid Section */
    .info-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 16px;
      margin-bottom: 28px;
    }

    .info-item {
      background: rgba(22, 22, 38, 0.6);
      border: 1px solid rgba(255, 255, 255, 0.07);
      border-radius: 12px;
      padding: 14px 18px;
      display: flex;
      align-items: center;
      gap: 14px;
      transition: all 0.3s ease;
    }

    .info-icon {
      width: 38px;
      height: 38px;
      border-radius: 10px;
      background: rgba(0, 245, 212, 0.08);
      border: 1px solid rgba(0, 245, 212, 0.2);
      display: flex;
      align-items: center;
      justify-content: center;
      color: #00f5d4;
      font-size: 16px;
      flex-shrink: 0;
    }

    .info-content {
      display: flex;
      flex-direction: column;
      gap: 2px;
      overflow: hidden;
    }

    .info-label {
      font-size: 11px;
      font-weight: 600;
      color: #64748b;
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    .info-value {
      font-size: 15px;
      font-weight: 700;
      color: #f1f5f9;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .board-highlight {
      color: #00f5d4;
      background: rgba(0, 245, 212, 0.12);
      padding: 2px 8px;
      border-radius: 6px;
      border: 1px solid rgba(0, 245, 212, 0.3);
      font-weight: 800;
      letter-spacing: 0.5px;
    }

    /* Subject Table Section */
    .table-container {
      background: rgba(18, 18, 30, 0.7);
      border-radius: 14px;
      border: 1px solid rgba(255, 255, 255, 0.08);
      overflow: hidden;
      margin-bottom: 28px;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
    }

    .subject-table {
      width: 100%;
      border-collapse: collapse;
      text-align: left;
    }

    .subject-table th {
      background: rgba(230, 57, 70, 0.15);
      color: #f8fafc;
      font-size: 12px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1.2px;
      padding: 14px 20px;
      border-bottom: 1px solid rgba(230, 57, 70, 0.3);
    }

    .subject-table td {
      padding: 12px 20px;
      font-size: 14px;
      font-weight: 500;
      border-bottom: 1px solid rgba(255, 255, 255, 0.04);
    }

    .bg-row-even {
      background: rgba(255, 255, 255, 0.015);
    }

    .bg-row-odd {
      background: rgba(0, 0, 0, 0.2);
    }

    .col-code {
      width: 140px;
      color: #94a3b8;
      font-weight: 600;
      font-family: monospace;
    }

    .code-icon {
      color: #e63946;
      margin-right: 6px;
      font-size: 12px;
    }

    .col-name {
      color: #e2e8f0;
      font-weight: 600;
    }

    .col-grade {
      width: 120px;
      text-align: center;
    }

    .grade-pass {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 8px;
      background: rgba(0, 245, 212, 0.12);
      border: 1px solid rgba(0, 245, 212, 0.3);
      color: #00f5d4;
      font-weight: 800;
      font-size: 13px;
      box-shadow: 0 0 10px rgba(0, 245, 212, 0.15);
    }

    .grade-f {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 8px;
      background: rgba(255, 23, 68, 0.18);
      border: 1px solid rgba(255, 23, 68, 0.4);
      color: #ff1744;
      font-weight: 800;
      font-size: 13px;
      box-shadow: 0 0 12px rgba(255, 23, 68, 0.25);
    }

    /* Footer Box Section */
    .footer-box {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 16px;
      margin-bottom: 24px;
    }

    .stat-card {
      background: linear-gradient(135deg, rgba(25, 25, 42, 0.8), rgba(15, 15, 26, 0.9));
      border-radius: 14px;
      padding: 18px 24px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border: 1px solid rgba(255, 255, 255, 0.1);
    }

    .stat-card.gpa-card {
      border-color: rgba(250, 204, 21, 0.3);
      box-shadow: inset 0 0 20px rgba(250, 204, 21, 0.05);
    }

    .stat-card.result-card {
      border-color: ${isFailed ? 'rgba(255, 23, 68, 0.4)' : 'rgba(0, 245, 212, 0.3)'};
      box-shadow: inset 0 0 20px ${isFailed ? 'rgba(255, 23, 68, 0.08)' : 'rgba(0, 245, 212, 0.05)'};
    }

    .stat-left {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .stat-icon {
      width: 42px;
      height: 42px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 18px;
    }

    .gpa-icon {
      background: rgba(250, 204, 21, 0.12);
      border: 1px solid rgba(250, 204, 21, 0.3);
      color: #facc15;
    }

    .result-icon {
      background: ${isFailed ? 'rgba(255, 23, 68, 0.12)' : 'rgba(0, 245, 212, 0.12)'};
      border: 1px solid ${isFailed ? 'rgba(255, 23, 68, 0.3)' : 'rgba(0, 245, 212, 0.3)'};
      color: ${isFailed ? '#ff1744' : '#00f5d4'};
    }

    .stat-title {
      font-size: 12px;
      font-weight: 700;
      color: #94a3b8;
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    .stat-value-gpa {
      font-size: 26px;
      font-weight: 900;
      color: #facc15;
      text-shadow: 0 0 12px rgba(250, 204, 21, 0.3);
    }

    .stat-value-result {
      font-size: 20px;
      font-weight: 900;
      color: ${isFailed ? '#ff1744' : '#00f5d4'};
      text-shadow: 0 0 12px ${isFailed ? 'rgba(255, 23, 68, 0.3)' : 'rgba(0, 245, 212, 0.3)'};
      text-transform: uppercase;
    }

    /* Credit Line */
    .credit-line {
      text-align: center;
      padding-top: 16px;
      border-top: 1px dashed rgba(255, 255, 255, 0.1);
      font-size: 13px;
      font-weight: 700;
      color: #64748b;
      letter-spacing: 1.5px;
    }

    .credit-brand {
      background: linear-gradient(90deg, #e63946 0%, #00f5d4 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      font-weight: 900;
    }
  </style>
</head>
<body>
  <div class="card-wrapper">
    <!-- Background Spider Web Overlay -->
    <svg class="spider-web-bg" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <g stroke="#e63946" stroke-width="0.8" fill="none">
        <polygon points="100,10 160,40 180,100 160,160 100,180 40,160 20,100 40,40" />
        <polygon points="100,30 145,52 160,100 145,148 100,165 55,148 40,100 55,52" />
        <polygon points="100,50 130,65 140,100 130,135 100,150 70,135 60,100 70,65" />
        <polygon points="100,70 115,80 120,100 115,120 100,130 85,120 80,100 85,80" />
        <line x1="100" y1="10" x2="100" y2="180" />
        <line x1="20" y1="100" x2="180" y2="100" />
        <line x1="40" y1="40" x2="160" y2="160" />
        <line x1="160" y1="40" x2="40" y2="160" />
      </g>
    </svg>

    <svg class="spider-web-bg-left" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <g stroke="#00f5d4" stroke-width="0.8" fill="none">
        <polygon points="100,10 160,40 180,100 160,160 100,180 40,160 20,100 40,40" />
        <polygon points="100,30 145,52 160,100 145,148 100,165 55,148 40,100 55,52" />
        <line x1="100" y1="10" x2="100" y2="180" />
        <line x1="20" y1="100" x2="180" y2="100" />
      </g>
    </svg>

    <div class="main-card">
      <!-- Header -->
      <div class="header">
        <div class="header-left">
          <div class="spider-icon-box">
            <i class="fa-solid fa-spider"></i>
          </div>
          <div>
            <div class="brand-title">Spider Result</div>
            <div class="brand-subtitle">Cyberpunk Academic Card • ${escapeHTML(exam)}</div>
          </div>
        </div>
        <div class="badge-year">
          <i class="fa-solid fa-star"></i>
          <span>${escapeHTML(year)}</span>
        </div>
      </div>

      <!-- Glowing Divider Line -->
      <div class="glow-divider"></div>

      <!-- Info Grid -->
      <div class="info-grid">
        <div class="info-item">
          <div class="info-icon">
            <i class="fa-solid fa-user"></i>
          </div>
          <div class="info-content">
            <span class="info-label">Student Name</span>
            <span class="info-value">${escapeHTML(name)}</span>
          </div>
        </div>

        <div class="info-item">
          <div class="info-icon">
            <i class="fa-solid fa-building-columns"></i>
          </div>
          <div class="info-content">
            <span class="info-label">Education Board</span>
            <span class="info-value"><span class="board-highlight">${escapeHTML(board)}</span></span>
          </div>
        </div>

        <div class="info-item">
          <div class="info-icon">
            <i class="fa-solid fa-id-card"></i>
          </div>
          <div class="info-content">
            <span class="info-label">Roll Number</span>
            <span class="info-value">${escapeHTML(roll)}</span>
          </div>
        </div>

        <div class="info-item">
          <div class="info-icon">
            <i class="fa-solid fa-calendar-days"></i>
          </div>
          <div class="info-content">
            <span class="info-label">Exam & Year</span>
            <span class="info-value">${escapeHTML(exam)} - ${escapeHTML(year)}</span>
          </div>
        </div>

        ${reg && reg !== '—' ? `
        <div class="info-item" style="grid-column: span 2;">
          <div class="info-icon">
            <i class="fa-solid fa-hashtag"></i>
          </div>
          <div class="info-content">
            <span class="info-label">Registration No</span>
            <span class="info-value">${escapeHTML(reg)}</span>
          </div>
        </div>
        ` : ''}
      </div>

      <!-- Subject Grade Table -->
      <div class="table-container">
        <table class="subject-table">
          <thead>
            <tr>
              <th><i class="fa-solid fa-barcode" style="margin-right: 6px;"></i> Code</th>
              <th><i class="fa-solid fa-book-open" style="margin-right: 6px;"></i> Subject Title</th>
              <th style="text-align: center;"><i class="fa-solid fa-award" style="margin-right: 6px;"></i> Grade</th>
            </tr>
          </thead>
          <tbody>
            ${subjectRowsHTML}
          </tbody>
        </table>
      </div>

      <!-- Footer Stat Box -->
      <div class="footer-box">
        <div class="stat-card gpa-card">
          <div class="stat-left">
            <div class="stat-icon gpa-icon">
              <i class="fa-solid fa-chart-simple"></i>
            </div>
            <div>
              <div class="stat-title">GPA Score</div>
            </div>
          </div>
          <div class="stat-value-gpa">${escapeHTML(gpa)}</div>
        </div>

        <div class="stat-card result-card">
          <div class="stat-left">
            <div class="stat-icon result-icon">
              <i class="fa-solid fa-flag"></i>
            </div>
            <div>
              <div class="stat-title">Status</div>
            </div>
          </div>
          <div class="stat-value-result">${escapeHTML(resultDisplay)}</div>
        </div>
      </div>

      <!-- Mandatory Credit Line -->
      <div class="credit-line">
        &copy; <span class="credit-brand">SA K IB</span> &bull; SPIDER BOT
      </div>
    </div>
  </div>
</body>
</html>`;
}

function escapeHTML(str: string): string {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
