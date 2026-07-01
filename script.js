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
    label: 'STEP 4', title: 'CDSE 진단', meta: '서류 합격자 대상 직무 적합도 진단',
    desc: '서류 합격자를 대상으로 직무 적합도를 진단합니다.\n일정은 개별 문자로 안내드립니다.',
    notice: '⚠️ 기한 내 CDSE 진단을 <strong>완료한 분에 한해</strong> 면접 전형이 진행됩니다.'
  },
  {
    label: 'STEP 5', title: '면접 전형', meta: '직무 적합성 및 참여 의지 확인',
    desc: '직무 적합성과 교육 참여 의지를 확인하는 단계입니다.'
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
    q: '지원 자격이 어떻게 되나요?',
    a: '만 18세 이상 34세 이하의 미취업 청년 중 커머스·유통·라이브커머스·디지털마케팅 분야에 관심이 있고 취업 또는 직무 전환을 희망하는 분이라면 누구나 지원 가능합니다. 학력 및 전공 제한은 없으며, 과정별 운영 일정에 따라 대면 교육 참여가 가능해야 합니다.'
  },
  {
    q: '수강료가 있나요?',
    a: '<strong>수강료는 전액 무료</strong>입니다. 내일배움카드(국민내일배움카드)를 통해 훈련비가 지원되며, 카드가 없는 분은 고용24(www.work24.go.kr)에서 먼저 발급받으신 후 지원해 주세요. 아직 카드가 없으시면 담당 매니저에게 문의해주시면 안내드립니다.'
  },
  {
    q: '내일배움카드가 없는데 지원할 수 있나요?',
    a: '네, 지원은 가능하지만 <strong>입과 전까지 내일배움카드를 발급</strong>받아야 수강신청이 완료됩니다. 카드 발급에 1~2주가 소요될 수 있으니 빠르게 신청해 두시는 것을 권장드립니다. 발급 방법이 어려우시면 담당 매니저가 도와드립니다.'
  },
  {
    q: '트랙은 어떻게 선택하나요?',
    a: '현재 운영 중인 트랙은 <strong>MD(상품기획) & 바잉 실무과정</strong>, <strong>커머스 특화 디지털 마케팅과정</strong>, <strong>라이브커머스 전문가과정</strong> 총 3개입니다. 간편 신청 시 관심 트랙을 선택하면 되며, 1:1 상담 단계에서 매니저와 함께 적합한 트랙을 상담 후 결정하실 수 있습니다.'
  },
  {
    q: '교육장소는 어디인가요?',
    a: '서울 성동구에 위치한 하이테커 전용 교육장에서 진행됩니다. 대전·충청권 지역인재를 대상으로 비수도권 운영도 검토 중이며, 자세한 위치와 교통편은 합격 후 개별 안내드립니다.'
  },
  {
    q: '교육 일정은 어떻게 되나요?',
    a: '1기는 <strong>2026년 9월 ~ 12월(4개월)</strong>, 2기는 <strong>2026년 11월 ~ 2027년 2월</strong>로 운영됩니다. 총 600시간, 75일 과정이며 전일제 대면 교육입니다. 정확한 개강일은 합격 후 담당 매니저가 개별 안내드립니다.'
  },
  {
    q: 'CDSE 진단이 무엇인가요?',
    a: 'CDSE(Career Development Skills Evaluation)는 직무 적합도를 진단하는 검사입니다. 서류 합격자를 대상으로 진행되며, <strong>기한 내에 완료하지 않으면 면접 전형에 참여할 수 없습니다.</strong> 일정은 서류 합격 통보와 함께 개별 문자로 안내드립니다.'
  },
  {
    q: '취업 연계도 되나요?',
    a: '네, 수료 후 적극적인 취업 연계를 지원합니다. 현대홈쇼핑 협력사·파트너사 채용 연계, 이커머스·커머스MD 분야 기업 채용 담당자와의 매칭데이 운영, Career Boost Track(이력서·포트폴리오 클리닉 + 모의면접 등) 등 수료 후 6개월까지 사후관리를 제공합니다.'
  },
  {
    q: '재직자도 지원 가능한가요?',
    a: '본 과정은 <strong>미취업 청년을 대상</strong>으로 하며, 고용보험 가입 중인 재직자는 참여가 제한됩니다. 단, 사업자등록증 소지자나 특수형태근로 종사자 등 일부 예외가 있을 수 있으니 담당 매니저에게 개별 문의해 주세요.'
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
