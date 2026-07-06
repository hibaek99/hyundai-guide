/* ── 탭 전환 ── */
document.querySelectorAll('.tab').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.tab-section').forEach(s => s.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById('tab-' + btn.dataset.tab).classList.add('active');
    adjustPadding();
  });
});

/* ── 선발 절차 스테퍼 ── */
const STEPS = [
  {
    label: 'STEP 1', title: '간편 신청', meta: '홈페이지 구글 폼을 통한 간편 신청',
    desc: '홈페이지 내 구글 폼을 통해 간편 신청을 진행해 주세요.\n간편 신청 후 1~2일 이내 담당 매니저가 유선으로 연락드릴 예정입니다:)\n<em style="color:var(--purple-600)">(☎️ 02-6235-5089)</em>'
  },
  {
    label: 'STEP 2', title: '1:1 상담', meta: '담당 매니저와의 지원 절차 안내',
    desc: '간편 신청 후 담당 매니저와의 1:1 상담을 통해 지원 절차를 자세히 안내드립니다.',
    notice: '💬 유선 상담에 동의하지 않으실 경우 <strong>카카오톡 채널 상담</strong>으로 진행됩니다.<br>원활한 상담을 위해 카카오톡 채널 <strong>@ai부트캠프</strong> 추가가 필요해요.',
    checks: [
      { yes: true,  main: '유선 상담 동의', sub: '→ 담당 매니저가 안내된 번호로 연락드려요' },
      { yes: false, main: '유선 상담 미동의', sub: '→ 카카오톡 채널 @ai부트캠프로 상담이 진행돼요' }
    ]
  },
  {
    label: 'STEP 3', title: '서류 전형', meta: '트랙별 서류 작성 및 제출',
    desc: '상담 후 서류 전형 링크를 안내드립니다.\n지원하시는 트랙(MD / 라이브커머스)에 맞춰 빠짐없이 꼼꼼하게 작성해 주세요.',
    notice: '<strong>서류 제출 후 안내 방식</strong><br>✅ 작성 완료 → 합격 여부 및 다음 절차를 <strong>문자(SMS)</strong>로 안내<br>❎ 미작성 → 담당 매니저가 <strong>유선으로 연락</strong>',
    checks: [
      { yes: true,  main: '서류 작성 완료', sub: '→ 제출하신 지원서를 바탕으로 서류 심사가 진행돼요' },
      { yes: false, main: '서류 미작성',   sub: '→ 담당 매니저가 유선으로 연락드려요' }
    ]
  },
  {
    label: 'STEP 4', title: '면접 전형', meta: '직무 적합성 및 참여 의지 확인',
    desc: '직무 적합성과 교육 참여 의지를 확인하는 단계입니다.'
  },
  {
    label: 'STEP 5', title: 'CDSE 진단', meta: '면접 완료자 대상 직무 적합도 진단',
    desc: '면접 완료자 대상으로 직무 적합도를 진단합니다.\n일정은 개별 문자로 안내드립니다.',
    notice: '⚠️ 기한 내 <strong>CDSE 진단을 완료하셔야</strong> 최종 입과가 가능합니다.'
  },
  {
    label: 'STEP 6', title: '최종 합격', meta: '8월 마지막주 예정',
    isResult: true
  },
  {
    label: 'STEP 7', title: '최종 합류', meta: '개강일 확정 후 개별 안내',
    desc: '<strong style="color:var(--purple-600)">합류를 위한 모든 절차가 끝났어요!</strong> 🎉\n개강일 및 OT 일정은 담당 매니저가 개별 안내드립니다:)'
  }
];

let current = 0;

function renderDots() {
  const wrap = document.getElementById('dots');
  wrap.innerHTML = STEPS.map((_, i) => {
    const cls = i === current ? 'active' : (i < current ? 'done' : '');
    return `<button class="dot-btn ${cls}" aria-label="STEP ${i+1}" onclick="goTo(${i})"></button>`;
  }).join('');
}

function renderStage() {
  const s = STEPS[current];
  let bodyHTML;

  if (s.isResult) {
    bodyHTML = `<div class="result-banner">
      <div class="emoji">🎓</div>
      <div class="title">최종 결과 개별 안내 예정</div>
      <div class="sub">${s.meta} · 일정은 변동될 수 있습니다</div>
    </div>`;
  } else {
    const noticeHTML = s.notice ? `<div class="notice">${s.notice}</div>` : '';
    const checksHTML = s.checks
      ? `<div class="checks">${s.checks.map(c => `
          <div class="check-row ${c.yes ? 'yes' : 'no'}">
            <span class="check-icon">${c.yes ? '✓' : '✕'}</span>
            <div>
              <div class="check-main">${c.main}</div>
              <div class="check-sub">${c.sub}</div>
            </div>
          </div>`).join('')}</div>`
      : '';
    bodyHTML = `<p class="stage-desc">${s.desc}</p>${noticeHTML}${checksHTML}`;
  }

  document.getElementById('stageFrame').innerHTML = `
    <div class="stage">
      <div class="stage-top">
        <div class="stage-num">${current + 1}</div>
        <div class="stage-label">${s.label}</div>
      </div>
      <h3>${s.title}</h3>
      <div class="stage-meta">${s.meta}</div>
      ${bodyHTML}
    </div>
    <div class="nav-row">
      <button class="nav-btn" onclick="prevStep()" ${current === 0 ? 'disabled' : ''}>이전</button>
      <button class="nav-btn primary" onclick="nextStep()" ${current === STEPS.length - 1 ? 'disabled' : ''}>다음</button>
    </div>
  `;
}

function renderProgress() {
  const pct = Math.round(((current + 1) / STEPS.length) * 100);
  document.getElementById('progressFill').style.width = pct + '%';
  document.getElementById('progressLabel').textContent = (current + 1) + ' / ' + STEPS.length;
}

function render() { renderDots(); renderStage(); renderProgress(); }
function goTo(i) { current = i; render(); }
function nextStep() { if (current < STEPS.length - 1) { current++; render(); } }
function prevStep() { if (current > 0) { current--; render(); } }

render();

/* ── FAQ ── */
const FAQS = [
  {
    q: '선발 기준은 어떻게 되나요?',
    a: '학력·스펙보다 학습 의지 & 과정 적합도를 중심으로 평가됩니다.'
  },
  {
    q: '수강료가 있나요?',
    a: '본 과정의 <strong>수강료는 전액 무료</strong>이고, <strong>내일배움카드가 필요하지 않습니다.</strong>'
  },
  {
    q: '비전공자도 지원 가능한가요?',
    a: '네, 가능합니다. <br> 가장 중요한 건 학습 의지와 참여도입니다🔥'
  },
  {
    q: '재직자도 참여 가능한가요?',
    a: '재직자의 경우 참여가 불가능하며, 교육 시작 전 퇴사 시 참여가 가능합니다.'
  },
  {
    q: '교육 방식과 시간은 어떻게 되나요?',
    a: '본 과정은 <strong>평일(월~금) 09:00-18:00 전일제 풀타임</strong> 과정입니다. <br> <strong>100% 오프라인이며, 대전 서구 소재의 강의장</strong>에서 진행됩니다.'
  },
  {
    q: '노트북 대여가 가능한가요?',
    a: '가능합니다. 훈련 기간 동안 학습용 노트북을 무료로 대여해드립니다.'
  },
  {
    q: '훈련장려금은 무엇인가요?',
    a: '훈련생에게 지급되는 정부 지원금으로, 출석률 80% 이상 시 <mark>월 최대 50만원까지 지급됩니다.</mark> <br> <em>* 금액은 개인별로 상이할 수 있습니다.</em>'
  }
];

const faqList = document.getElementById('faqList');

FAQS.forEach((f, i) => {
  const el = document.createElement('div');
  el.className = 'faq-item';
  el.innerHTML = `
    <button class="faq-q" aria-expanded="false">
      <span>${f.q}</span>
      <span class="faq-chevron">▼</span>
    </button>
    <div class="faq-a">
      <div class="faq-a-inner">${f.a}</div>
    </div>
  `;
  const btn = el.querySelector('.faq-q');
  const body = el.querySelector('.faq-a');
  const inner = el.querySelector('.faq-a-inner');

  btn.addEventListener('click', () => {
    const isOpen = el.classList.contains('open');
    document.querySelectorAll('.faq-item.open').forEach(item => {
      item.classList.remove('open');
      item.querySelector('.faq-a').style.maxHeight = '0';
      item.querySelector('.faq-q').setAttribute('aria-expanded', 'false');
    });
    if (!isOpen) {
      el.classList.add('open');
      body.style.maxHeight = inner.scrollHeight + 'px';
      btn.setAttribute('aria-expanded', 'true');
    }
    setTimeout(adjustPadding, 320); // 트랜지션 후 재계산
  });

  faqList.appendChild(el);
});

/* ── 배너 높이만큼 main 하단 패딩 동적 적용 ── */
function adjustPadding() {
  const banner = document.querySelector('.footer-cta');
  const main   = document.querySelector('main');
  if (!banner || !main) return;
  // 배너 실제 높이 + 여유 16px
  main.style.paddingBottom = (banner.offsetHeight + 16) + 'px';
}

// 초기 실행 + 리사이즈 대응
adjustPadding();
window.addEventListener('resize', adjustPadding);
