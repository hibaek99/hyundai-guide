/* ===========================
   Oracle AI Campus · Data Track
   선발 절차 데이터 & 렌더링
   =========================== */

/* ── 콘텐츠 데이터 ──────────────────────────────────────
   내용 수정은 이 부분만 편집
   각 스텝 객체의 필드:
     label     : 상단 표시 레이블 (예: "STEP 1")
     title     : 카드 제목
     meta      : 카드 부제 (날짜·조건 요약)
     desc      : 본문 설명 (\n 으로 줄바꿈)
     link      : CTA 버튼 { label, url }
     howPath   : 경로 안내 배열 (마지막 항목은 강조 표시)
     dates     : 날짜 목록 배열
     notice    : 유의사항 박스 (HTML 가능)
     extra     : 추가 안내 박스
     checks    : 체크리스트 배열 { yes, main, sub }
     isResult  : true 이면 결과 발표 배너로 렌더링
   ──────────────────────────────────────────────────── */
const STEPS = [
  {
    label: "STEP 1",
    title: "간편 신청",
    meta: "홈페이지 구글 폼을 통한 간편 신청",
    desc: "홈페이지 내 구글 폼을 통해 간편 신청을 진행해 주세요.\n간편 신청 후 1~2일 이내 담당 매니저가 유선으로 연락드릴 예정입니다:) \n<em style='color: var(--purple-600)'>(☎️ 02-6235-5089)</em>"
  },
  {
    label: "STEP 2",
    title: "1:1 상담",
    meta: "담당 매니저와의 지원 절차 안내",
    desc: "간편 신청 후 담당 매니저와의 1:1 상담을 통해 지원 절차를 자세히 안내드립니다.",
    notice: "💬 유선 상담에 동의하지 않으실 경우 <strong>카카오톡 채널 상담</strong>으로 진행됩니다.<br>원활한 상담을 위해 카카오톡 채널 <strong>@ai부트캠프</strong> 추가가 필요해요.",
    checks: [
      { yes: true,  main: "유선 상담 동의", sub: "→ 담당 매니저가 안내된 번호로 연락드려요" },
      { yes: false, main: "유선 상담 미동의", sub: "→ 카카오톡 채널 <mark>@ai부트캠프</mark>로 상담이 진행돼요" }
    ]
  },
  {
    label: "STEP 3",
    title: "서류 전형",
    meta: "트랙별 서류 작성 및 제출",
    desc: "상담 후 서류 전형 링크를 안내드립니다.\n지원하시는 트랙(MD / 라이브커머스)에 맞춰 빠짐없이 꼼꼼하게 작성해 주세요.",
    notice: "<strong>서류 제출 후 안내 방식</strong><br>✅ 작성 완료 → 합격 여부 및 다음 절차를 <strong>문자(SMS)</strong>로 안내<br>❎ 미작성 → 담당 매니저가 <strong>유선으로 연락</strong>",
    checks: [
      { yes: true,  main: "서류 작성 완료", sub: "→ 제출하신 지원서를 바탕으로 서류 심사가 진행돼요" },
      { yes: false, main: "서류 미작성",   sub: "→ 담당 매니저가 유선으로 연락드려요" }
    ]
  },
  {
    label: "STEP 4",
    title: "CDSE 진단",
    meta: "서류 합격자 대상 직무 적합도 진단",
    desc: "서류 합격자를 대상으로 직무 적합도를 진단합니다.\n일정은 개별 문자로 안내드립니다.",
    notice: "⚠️ 기한 내 CDSE 진단을 <strong>완료한 분에 한해</strong> 면접 전형이 진행됩니다."
  },
  {
    label: "STEP 5",
    title: "면접 전형",
    meta: "직무 적합성 및 참여 의지 확인",
    desc: "직무 적합성과 교육 참여 의지를 확인하는 단계입니다."
  },
  {
    label: "STEP 6",
    title: "최종 합격",
    meta: "8월 마지막주 예정",
    isResult: true
  },
  {
    label: "STEP 7",
    title: "최종 합류",
    meta: "개강일 확정 후 개별 안내",
    desc: "<strong style='color: var(--purple-600)'>합류를 위한 모든 절차가 끝났어요!</strong> 🎉\n개강일 및 OT 일정은 담당 매니저가 개별 안내드립니다:)"
  }
];

/* ── 렌더링 ──────────────────────────────────────────── */
let openIndex = 0;

function renderStep(s, i) {
  const isOpen = i === openIndex;

  const linkHTML = s.link
    ? `<a class="cta-link" href="${s.link.url}" target="_blank">${s.link.label} →</a>`
    : '';

  const howHTML = s.howPath
    ? `<div class="how-path">
        ${s.howPath.map((p, pi) => {
          const isLast = pi === s.howPath.length - 1;
          return (pi > 0 ? '<span class="arrow">›</span>' : '')
               + (isLast ? `<span class="kw">${p}</span>` : `<span>${p}</span>`);
        }).join('')}
       </div>`
    : '';

  const datesHTML = s.dates
    ? `<div class="date-list">
        ${s.dates.map(d => `<div class="date-row">${d}</div>`).join('')}
       </div>`
    : '';

  const noticeHTML = s.notice ? `<div class="notice">${s.notice}</div>` : '';
  const extraHTML  = s.extra  ? `<div class="notice">${s.extra}</div>`  : '';

  const checksHTML = s.checks
    ? `<div class="check-section">
        ${s.checks.map(c => `
          <div class="check-item ${c.yes ? 'yes' : 'no'}">
            <span class="check-icon">${c.yes ? '✅' : '❎'}</span>
            <div>
              <div class="check-main">${c.main}</div>
              <div class="check-sub">${c.sub}</div>
              ${c.link ? `<a class="cta-link" href="${c.link.url}" target="_blank" style="margin-top:8px;">${c.link.label} →</a>` : ''}
              ${c.links ? `<div class="cta-links">${c.links.map(l => `<a class="cta-link" href="${l.url}" target="_blank">${l.label} →</a>`).join('')}</div>` : ''}
            </div>
          </div>
        `).join('')}
       </div>`
    : '';

  const bodyContent = s.isResult
    ? `<div class="result-banner">
        <div class="emoji">🎓</div>
        <div class="title">최종 결과 개별 안내 예정</div>
        <div class="sub">8월 마지막주 예정 · 일정은 변동될 수 있습니다</div>
       </div>`
    : `${s.desc ? `<p class="desc">${s.desc}</p>` : ''}
       ${linkHTML}${howHTML}${datesHTML}${noticeHTML}${extraHTML}${checksHTML}`;

  return `
    <div class="step${isOpen ? ' active' : ''}" id="step-${i}">
      <div class="step-header" onclick="toggle(${i})">
        <div class="step-num">${i + 1}</div>
        <div class="step-info">
          <div class="step-label">${s.label}</div>
          <div class="step-title">${s.title}</div>
          ${s.meta ? `<div class="step-meta">${s.meta}</div>` : ''}
        </div>
        <div class="step-chevron">▼</div>
      </div>
      <div class="step-body">
        <div class="step-content">${bodyContent}</div>
      </div>
    </div>`;
}

function render() {
  document.getElementById('stepsContainer').innerHTML =
    STEPS.map((s, i) => renderStep(s, i)).join('');
}

function updateProgress() {
  const current = openIndex >= 0 ? openIndex + 1 : 0;
  const pct = Math.round((current / STEPS.length) * 100);
  document.getElementById('progressFill').style.width = pct + '%';
  document.getElementById('progressLabel').textContent = current + ' / ' + STEPS.length;
}

function toggle(i) {
  openIndex = openIndex === i ? -1 : i;
  render();
  updateProgress();
}

/* ── 초기화 ── */
render();
updateProgress();
