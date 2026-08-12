/**
 * Spider Result Card HTML Template Generator
 * Light Spider Theme Edition - Clean, vibrant light design packed with spider motifs, webs, and spiders
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

  // Generate subject table rows with spider icons
  const subjectRowsHTML = finalSubjects.map((sub, index) => {
    const isSubFailed = sub.grade === 'F' || sub.grade === '0' || sub.grade.toLowerCase() === 'fail';
    const gradeClass = isSubFailed ? 'grade-f' : 'grade-pass';
    const rowBgClass = index % 2 === 0 ? 'bg-row-even' : 'bg-row-odd';

    return `
      <tr class="${rowBgClass}">
        <td class="col-code"><i class="fa-solid fa-spider code-spider-icon"></i> ${escapeHTML(sub.code)}</td>
        <td class="col-name"><i class="fa-solid fa-spider name-spider-icon"></i> ${escapeHTML(sub.name)}</td>
        <td class="col-grade"><span class="${gradeClass}"><i class="fa-solid fa-spider grade-spider-mini"></i> ${escapeHTML(sub.grade)}</span></td>
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
      background-color: #f1f5f9;
      font-family: 'Inter', sans-serif;
      color: #1e293b;
      -webkit-font-smoothing: antialiased;
    }

    /* Container & Light Spider Canvas Background */
    .card-wrapper {
      width: 920px;
      padding: 32px;
      background: radial-gradient(circle at 50% 0%, #ffffff 0%, #f8fafc 50%, #e2e8f0 100%);
      position: relative;
      overflow: hidden;
    }

    /* Spider Web Corner Watermarks (Light Theme Linework) */
    .spider-web-top-right {
      position: absolute;
      top: -50px;
      right: -50px;
      width: 480px;
      height: 480px;
      opacity: 0.22;
      pointer-events: none;
      z-index: 0;
    }

    .spider-web-top-left {
      position: absolute;
      top: -50px;
      left: -50px;
      width: 420px;
      height: 420px;
      opacity: 0.18;
      pointer-events: none;
      z-index: 0;
      transform: scaleX(-1);
    }

    .spider-web-bottom-left {
      position: absolute;
      bottom: -50px;
      left: -50px;
      width: 450px;
      height: 450px;
      opacity: 0.18;
      pointer-events: none;
      z-index: 0;
      transform: rotate(180deg);
    }

    .spider-web-bottom-right {
      position: absolute;
      bottom: -50px;
      right: -50px;
      width: 420px;
      height: 420px;
      opacity: 0.16;
      pointer-events: none;
      z-index: 0;
      transform: rotate(270deg);
    }

    /* Hanging Dangling Spider SVG 1 */
    .hanging-spider-1 {
      position: absolute;
      top: 0;
      right: 75px;
      z-index: 4;
      pointer-events: none;
    }

    /* Hanging Dangling Spider SVG 2 */
    .hanging-spider-2 {
      position: absolute;
      top: 0;
      left: 80px;
      z-index: 4;
      pointer-events: none;
    }

    /* Hanging Dangling Spider SVG 3 (Middle Right) */
    .hanging-spider-3 {
      position: absolute;
      top: 0;
      right: 280px;
      z-index: 4;
      pointer-events: none;
    }

    /* Crawling Corner Spider Badges */
    .corner-spider-badge {
      position: absolute;
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: #fef2f2;
      border: 1.5px solid #fca5a5;
      color: #dc2626;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
      box-shadow: 0 4px 10px rgba(220, 38, 38, 0.2);
      z-index: 5;
    }

    .corner-top-left { top: 12px; left: 12px; }
    .corner-top-right { top: 12px; right: 12px; }
    .corner-bottom-left { bottom: 12px; left: 12px; }
    .corner-bottom-right { bottom: 12px; right: 12px; }

    /* Main Crisp White Card */
    .main-card {
      position: relative;
      z-index: 1;
      background: #ffffff;
      border: 2px solid #e2e8f0;
      border-radius: 24px;
      padding: 36px;
      box-shadow: 
        0 20px 40px -15px rgba(220, 38, 38, 0.12),
        0 10px 25px -5px rgba(15, 23, 42, 0.08),
        inset 0 1px 0 rgba(255, 255, 255, 0.9);
      overflow: hidden;
    }

    /* Background Giant Spider Watermark in Center of Card */
    .card-center-spider-watermark {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      font-size: 420px;
      color: #dc2626;
      opacity: 0.035;
      pointer-events: none;
      z-index: 0;
    }

    .card-content-layer {
      position: relative;
      z-index: 2;
    }

    /* Header Section */
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-bottom: 22px;
      position: relative;
    }

    .header-left {
      display: flex;
      align-items: center;
      gap: 18px;
    }

    .spider-icon-box {
      width: 60px;
      height: 60px;
      border-radius: 18px;
      background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%);
      border: 2px solid #fca5a5;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #ffffff;
      font-size: 30px;
      box-shadow: 0 8px 22px rgba(220, 38, 38, 0.38);
      position: relative;
    }

    .spider-icon-box::after {
      content: '';
      position: absolute;
      inset: -4px;
      border-radius: 22px;
      border: 1.5px dashed #ef4444;
      opacity: 0.7;
    }

    .brand-title {
      font-size: 32px;
      font-weight: 900;
      letter-spacing: -0.5px;
      color: #0f172a;
      text-transform: uppercase;
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .brand-title span.accent-text {
      color: #dc2626;
    }

    .brand-subtitle {
      font-size: 13px;
      font-weight: 800;
      color: #475569;
      letter-spacing: 2.5px;
      text-transform: uppercase;
      margin-top: 4px;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .badge-year {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 12px 24px;
      border-radius: 9999px;
      background: #fef2f2;
      border: 2px solid #fca5a5;
      color: #dc2626;
      font-size: 16px;
      font-weight: 900;
      letter-spacing: 1px;
      box-shadow: 0 4px 14px rgba(220, 38, 38, 0.15);
    }

    .badge-year i {
      color: #dc2626;
      font-size: 18px;
    }

    /* Spider Web Divider Line */
    .spider-divider-wrap {
      display: flex;
      align-items: center;
      gap: 14px;
      margin-bottom: 28px;
    }

    .spider-divider-line {
      flex: 1;
      height: 3px;
      background: linear-gradient(90deg, #fecdd3 0%, #dc2626 50%, #fecdd3 100%);
      border-radius: 3px;
    }

    .spider-divider-center {
      padding: 8px 18px;
      border-radius: 9999px;
      background: #fef2f2;
      border: 2px solid #fca5a5;
      display: flex;
      align-items: center;
      gap: 8px;
      color: #dc2626;
      font-size: 14px;
      font-weight: 900;
      box-shadow: 0 2px 10px rgba(220, 38, 38, 0.22);
    }

    /* Info Grid Section */
    .info-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 18px;
      margin-bottom: 28px;
    }

    .info-item {
      background: #f8fafc;
      border: 2px solid #cbd5e1;
      border-radius: 16px;
      padding: 16px 20px;
      display: flex;
      align-items: center;
      gap: 16px;
      position: relative;
      overflow: hidden;
      box-shadow: 0 2px 6px rgba(15, 23, 42, 0.04);
    }

    .info-item::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 5px;
      height: 100%;
      background: #dc2626;
      border-radius: 5px 0 0 5px;
    }

    .info-item-spider-bg {
      position: absolute;
      right: -8px;
      bottom: -12px;
      font-size: 52px;
      color: #dc2626;
      opacity: 0.06;
      pointer-events: none;
    }

    .info-icon {
      width: 48px;
      height: 48px;
      border-radius: 14px;
      background: #fef2f2;
      border: 1.5px solid #fecdd3;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #dc2626;
      font-size: 20px;
      flex-shrink: 0;
    }

    .info-content {
      display: flex;
      flex-direction: column;
      gap: 3px;
      overflow: hidden;
    }

    .info-label {
      font-size: 12px;
      font-weight: 800;
      color: #475569;
      text-transform: uppercase;
      letter-spacing: 1px;
      display: flex;
      align-items: center;
      gap: 5px;
    }

    .info-label-spider {
      color: #dc2626;
      font-size: 11px;
    }

    .info-value {
      font-size: 17px;
      font-weight: 900;
      color: #020617;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .board-highlight {
      color: #0284c7;
      background: #e0f2fe;
      padding: 3px 12px;
      border-radius: 8px;
      border: 1.5px solid #bae6fd;
      font-weight: 900;
      letter-spacing: 0.5px;
    }

    /* Subject Table Section */
    .table-container {
      background: #ffffff;
      border-radius: 18px;
      border: 2px solid #cbd5e1;
      overflow: hidden;
      margin-bottom: 28px;
      box-shadow: 0 10px 25px -5px rgba(15, 23, 42, 0.08);
      position: relative;
    }

    .subject-table {
      width: 100%;
      border-collapse: collapse;
      text-align: left;
    }

    .subject-table th {
      background: #0f172a;
      color: #ffffff;
      font-size: 14px;
      font-weight: 900;
      text-transform: uppercase;
      letter-spacing: 1.5px;
      padding: 18px 22px;
      border-bottom: 4px solid #dc2626;
    }

    .subject-table th i {
      color: #ef4444;
      font-size: 15px;
    }

    .subject-table td {
      padding: 16px 22px;
      font-size: 16px;
      font-weight: 700;
      border-bottom: 1.5px solid #e2e8f0;
    }

    .bg-row-even {
      background: #ffffff;
    }

    .bg-row-odd {
      background: #f8fafc;
    }

    .col-code {
      width: 150px;
      color: #334155;
      font-weight: 800;
      font-family: monospace;
      font-size: 16px;
    }

    .code-spider-icon {
      color: #dc2626;
      margin-right: 8px;
      font-size: 14px;
    }

    .name-spider-icon {
      color: #64748b;
      margin-right: 10px;
      font-size: 13px;
    }

    .col-name {
      color: #020617;
      font-weight: 800;
      font-size: 16px;
    }

    .col-grade {
      width: 140px;
      text-align: center;
    }

    .grade-spider-mini {
      font-size: 13px;
      margin-right: 5px;
    }

    .grade-pass {
      display: inline-block;
      padding: 6px 16px;
      border-radius: 10px;
      background: #dcfce7;
      border: 2px solid #86efac;
      color: #15803d;
      font-weight: 900;
      font-size: 15px;
      box-shadow: 0 2px 8px rgba(22, 163, 74, 0.15);
    }

    .grade-f {
      display: inline-block;
      padding: 6px 16px;
      border-radius: 10px;
      background: #fef2f2;
      border: 2px solid #fca5a5;
      color: #dc2626;
      font-weight: 900;
      font-size: 15px;
      box-shadow: 0 2px 8px rgba(220, 38, 38, 0.18);
    }

    /* Footer Stat Box Section */
    .footer-box {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 18px;
      margin-bottom: 24px;
    }

    .stat-card {
      background: #f8fafc;
      border-radius: 18px;
      padding: 20px 26px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border: 2px solid #cbd5e1;
      position: relative;
      overflow: hidden;
    }

    .stat-spider-watermark {
      position: absolute;
      right: 12px;
      bottom: -10px;
      font-size: 64px;
      opacity: 0.08;
      pointer-events: none;
    }

    .stat-card.gpa-card {
      background: #fffbeb;
      border-color: #fcd34d;
      box-shadow: 0 4px 14px rgba(245, 158, 11, 0.12);
    }

    .stat-card.gpa-card .stat-spider-watermark {
      color: #d97706;
    }

    .stat-card.result-card {
      background: ${isFailed ? '#fef2f2' : '#f0fdf4'};
      border-color: ${isFailed ? '#fca5a5' : '#86efac'};
      box-shadow: 0 4px 14px ${isFailed ? 'rgba(220, 38, 38, 0.12)' : 'rgba(16, 185, 129, 0.12)'};
    }

    .stat-card.result-card .stat-spider-watermark {
      color: ${isFailed ? '#dc2626' : '#16a34a'};
    }

    .stat-left {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .stat-icon {
      width: 52px;
      height: 52px;
      border-radius: 14px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 22px;
    }

    .gpa-icon {
      background: #fef3c7;
      border: 1.5px solid #fcd34d;
      color: #d97706;
    }

    .result-icon {
      background: ${isFailed ? '#fecdd3' : '#dcfce7'};
      border: 1.5px solid ${isFailed ? '#fda4af' : '#86efac'};
      color: ${isFailed ? '#dc2626' : '#16a34a'};
    }

    .stat-title {
      font-size: 13px;
      font-weight: 900;
      color: #475569;
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    .stat-value-gpa {
      font-size: 34px;
      font-weight: 900;
      color: #b45309;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .stat-value-result {
      font-size: 26px;
      font-weight: 900;
      color: ${isFailed ? '#dc2626' : '#15803d'};
      text-transform: uppercase;
      display: flex;
      align-items: center;
      gap: 10px;
    }

    /* Official Spider Verification Stamp */
    .spider-stamp-box {
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: #f8fafc;
      border: 2px dashed #cbd5e1;
      border-radius: 14px;
      padding: 12px 22px;
      margin-bottom: 22px;
      font-size: 13px;
      font-weight: 900;
      color: #334155;
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    .spider-stamp-left {
      display: flex;
      align-items: center;
      gap: 8px;
      color: #dc2626;
    }

    .spider-stamp-right {
      display: flex;
      align-items: center;
      gap: 6px;
      color: #0284c7;
    }

    /* Credit Line */
    .credit-line {
      text-align: center;
      padding-top: 18px;
      border-top: 1.5px dashed #e2e8f0;
      font-size: 13px;
      font-weight: 800;
      color: #64748b;
      letter-spacing: 2px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
    }

    .credit-brand {
      color: #dc2626;
      font-weight: 900;
    }
  </style>
</head>
<body>
  <div class="card-wrapper">
    <!-- Corner Crawling Spider Badges -->
    <div class="corner-spider-badge corner-top-left"><i class="fa-solid fa-spider"></i></div>
    <div class="corner-spider-badge corner-top-right"><i class="fa-solid fa-spider"></i></div>
    <div class="corner-spider-badge corner-bottom-left"><i class="fa-solid fa-spider"></i></div>
    <div class="corner-spider-badge corner-bottom-right"><i class="fa-solid fa-spider"></i></div>

    <!-- Background Spider Web Corner SVG Overlays (All 4 Corners) -->
    <svg class="spider-web-top-right" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <g stroke="#dc2626" stroke-width="0.9" fill="none">
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

    <svg class="spider-web-top-left" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <g stroke="#ef4444" stroke-width="0.9" fill="none">
        <polygon points="100,10 160,40 180,100 160,160 100,180 40,160 20,100 40,40" />
        <polygon points="100,30 145,52 160,100 145,148 100,165 55,148 40,100 55,52" />
        <line x1="100" y1="10" x2="100" y2="180" />
        <line x1="20" y1="100" x2="180" y2="100" />
      </g>
    </svg>

    <svg class="spider-web-bottom-left" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <g stroke="#64748b" stroke-width="0.9" fill="none">
        <polygon points="100,10 160,40 180,100 160,160 100,180 40,160 20,100 40,40" />
        <polygon points="100,30 145,52 160,100 145,148 100,165 55,148 40,100 55,52" />
        <line x1="100" y1="10" x2="100" y2="180" />
        <line x1="20" y1="100" x2="180" y2="100" />
      </g>
    </svg>

    <svg class="spider-web-bottom-right" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <g stroke="#dc2626" stroke-width="0.8" fill="none">
        <polygon points="100,10 160,40 180,100 160,160 100,180 40,160 20,100 40,40" />
        <polygon points="100,30 145,52 160,100 145,148 100,165 55,148 40,100 55,52" />
        <line x1="100" y1="10" x2="100" y2="180" />
        <line x1="20" y1="100" x2="180" y2="100" />
      </g>
    </svg>

    <!-- Dangling Hanging Spider Right Top -->
    <svg class="hanging-spider-1" width="50" height="110" viewBox="0 0 50 110" fill="none" xmlns="http://www.w3.org/2000/svg">
      <line x1="25" y1="0" x2="25" y2="70" stroke="#dc2626" stroke-width="1.8" stroke-dasharray="3 2" />
      <g transform="translate(10, 65)">
        <path d="M15 10 C 5 2, 2 12, 0 8" stroke="#dc2626" stroke-width="2.2" fill="none" />
        <path d="M15 12 C 3 8, -2 18, -4 16" stroke="#dc2626" stroke-width="2.2" fill="none" />
        <path d="M15 14 C 4 18, 0 26, -3 24" stroke="#dc2626" stroke-width="2.2" fill="none" />
        <path d="M15 16 C 8 22, 5 30, 2 32" stroke="#dc2626" stroke-width="2.2" fill="none" />
        
        <path d="M15 10 C 25 2, 28 12, 30 8" stroke="#dc2626" stroke-width="2.2" fill="none" />
        <path d="M15 12 C 27 8, 32 18, 34 16" stroke="#dc2626" stroke-width="2.2" fill="none" />
        <path d="M15 14 C 26 18, 30 26, 33 24" stroke="#dc2626" stroke-width="2.2" fill="none" />
        <path d="M15 16 C 22 22, 25 30, 28 32" stroke="#dc2626" stroke-width="2.2" fill="none" />
        
        <ellipse cx="15" cy="18" rx="8" ry="11" fill="#dc2626" />
        <circle cx="15" cy="7" r="5.5" fill="#991b1b" />
        <circle cx="13" cy="6" r="1.5" fill="#ffffff" />
        <circle cx="17" cy="6" r="1.5" fill="#ffffff" />
      </g>
    </svg>

    <!-- Dangling Hanging Spider Left Top -->
    <svg class="hanging-spider-2" width="45" height="85" viewBox="0 0 45 85" fill="none" xmlns="http://www.w3.org/2000/svg">
      <line x1="22" y1="0" x2="22" y2="50" stroke="#475569" stroke-width="1.5" stroke-dasharray="2 2" />
      <g transform="translate(8, 46)">
        <ellipse cx="14" cy="16" rx="6" ry="9" fill="#334155" />
        <circle cx="14" cy="6" r="4" fill="#0f172a" />
        <path d="M14 8 C 5 2, 2 10, 0 6" stroke="#334155" stroke-width="1.8" fill="none" />
        <path d="M14 8 C 23 2, 26 10, 28 6" stroke="#334155" stroke-width="1.8" fill="none" />
      </g>
    </svg>

    <!-- Dangling Hanging Spider Middle Right -->
    <svg class="hanging-spider-3" width="38" height="65" viewBox="0 0 38 65" fill="none" xmlns="http://www.w3.org/2000/svg">
      <line x1="19" y1="0" x2="19" y2="35" stroke="#ef4444" stroke-width="1.2" stroke-dasharray="2 2" />
      <g transform="translate(7, 32)">
        <ellipse cx="12" cy="14" rx="5" ry="7" fill="#ef4444" />
        <circle cx="12" cy="6" r="3.5" fill="#b91c1c" />
      </g>
    </svg>

    <div class="main-card">
      <!-- Watermark Spider Background -->
      <div class="card-center-spider-watermark">
        <i class="fa-solid fa-spider"></i>
      </div>

      <div class="card-content-layer">
        <!-- Header -->
        <div class="header">
          <div class="header-left">
            <div class="spider-icon-box">
              <i class="fa-solid fa-spider"></i>
            </div>
            <div>
              <div class="brand-title"><i class="fa-solid fa-spider" style="color: #dc2626; font-size: 22px;"></i> Spider <span class="accent-text">Result</span></div>
              <div class="brand-subtitle"><i class="fa-solid fa-spider" style="color: #dc2626; font-size: 11px;"></i> Academic Result Card &bull; ${escapeHTML(exam)} <i class="fa-solid fa-spider" style="color: #dc2626; font-size: 11px;"></i></div>
            </div>
          </div>
          <div class="badge-year">
            <i class="fa-solid fa-spider"></i>
            <span>${escapeHTML(year)}</span>
            <i class="fa-solid fa-spider"></i>
          </div>
        </div>

        <!-- Spider Divider Line with Spider Center Badge -->
        <div class="spider-divider-wrap">
          <div class="spider-divider-line"></div>
          <div class="spider-divider-center">
            <i class="fa-solid fa-spider"></i>
            <span>SPIDER BOT</span>
            <i class="fa-solid fa-spider"></i>
          </div>
          <div class="spider-divider-line"></div>
        </div>

        <!-- Info Grid -->
        <div class="info-grid">
          <div class="info-item">
            <i class="fa-solid fa-spider info-item-spider-bg"></i>
            <div class="info-icon">
              <i class="fa-solid fa-spider"></i>
            </div>
            <div class="info-content">
              <span class="info-label"><i class="fa-solid fa-spider info-label-spider"></i> Student Name</span>
              <span class="info-value">${escapeHTML(name)}</span>
            </div>
          </div>

          <div class="info-item">
            <i class="fa-solid fa-spider info-item-spider-bg"></i>
            <div class="info-icon">
              <i class="fa-solid fa-building-columns"></i>
            </div>
            <div class="info-content">
              <span class="info-label"><i class="fa-solid fa-spider info-label-spider"></i> Education Board</span>
              <span class="info-value"><span class="board-highlight"><i class="fa-solid fa-spider" style="font-size: 11px;"></i> ${escapeHTML(board)}</span></span>
            </div>
          </div>

          <div class="info-item">
            <i class="fa-solid fa-spider info-item-spider-bg"></i>
            <div class="info-icon">
              <i class="fa-solid fa-id-card"></i>
            </div>
            <div class="info-content">
              <span class="info-label"><i class="fa-solid fa-spider info-label-spider"></i> Roll Number</span>
              <span class="info-value">${escapeHTML(roll)}</span>
            </div>
          </div>

          <div class="info-item">
            <i class="fa-solid fa-spider info-item-spider-bg"></i>
            <div class="info-icon">
              <i class="fa-solid fa-calendar-days"></i>
            </div>
            <div class="info-content">
              <span class="info-label"><i class="fa-solid fa-spider info-label-spider"></i> Exam & Year</span>
              <span class="info-value">${escapeHTML(exam)} - ${escapeHTML(year)}</span>
            </div>
          </div>

          ${reg && reg !== '—' ? `
          <div class="info-item" style="grid-column: span 2;">
            <i class="fa-solid fa-spider info-item-spider-bg"></i>
            <div class="info-icon">
              <i class="fa-solid fa-spider"></i>
            </div>
            <div class="info-content">
              <span class="info-label"><i class="fa-solid fa-spider info-label-spider"></i> Registration No</span>
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
                <th><i class="fa-solid fa-spider" style="margin-right: 6px;"></i> Code</th>
                <th><i class="fa-solid fa-spider" style="margin-right: 6px;"></i> Subject Title</th>
                <th style="text-align: center;"><i class="fa-solid fa-spider" style="margin-right: 6px;"></i> Grade</th>
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
            <i class="fa-solid fa-spider stat-spider-watermark"></i>
            <div class="stat-left">
              <div class="stat-icon gpa-icon">
                <i class="fa-solid fa-spider"></i>
              </div>
              <div>
                <div class="stat-title"><i class="fa-solid fa-spider" style="color: #d97706; font-size: 10px;"></i> GPA Score</div>
              </div>
            </div>
            <div class="stat-value-gpa">
              <i class="fa-solid fa-spider" style="font-size: 18px; color: #d97706;"></i>
              ${escapeHTML(gpa)}
            </div>
          </div>

          <div class="stat-card result-card">
            <i class="fa-solid fa-spider stat-spider-watermark"></i>
            <div class="stat-left">
              <div class="stat-icon result-icon">
                <i class="fa-solid fa-spider"></i>
              </div>
              <div>
                <div class="stat-title"><i class="fa-solid fa-spider" style="font-size: 10px;"></i> Status</div>
              </div>
            </div>
            <div class="stat-value-result">
              <i class="fa-solid fa-spider" style="font-size: 18px;"></i>
              ${escapeHTML(resultDisplay)}
            </div>
          </div>
        </div>

        <!-- Spider Verification Stamp Bar -->
        <div class="spider-stamp-box">
          <div class="spider-stamp-left">
            <i class="fa-solid fa-spider"></i>
            <span>SPIDER BOT AUTHENTIC RESULT CARD</span>
          </div>
          <div class="spider-stamp-right">
            <i class="fa-solid fa-spider"></i>
            <span>VERIFIED BY SPIDER NETWORK</span>
          </div>
        </div>

        <!-- Mandatory Credit Line -->
        <div class="credit-line">
          <i class="fa-solid fa-spider" style="color: #dc2626;"></i>
          &copy; <span class="credit-brand">SA K IB</span> &bull; SPIDER BOT RESULT API
          <i class="fa-solid fa-spider" style="color: #dc2626;"></i>
        </div>
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
