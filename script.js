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
    label: 'STEP 2', title: '면접 일정 확정', meta: '1:1 상담을 통한 면접 일정 확정',
    desc: '간편 신청 후 담당 매니저와의 1:1 상담을 통해 면접 일정을 확정합니다.',
    notice: '💬 유선 상담에 동의하지 않으실 경우 <strong>카카오톡 채널 상담</strong>으로 진행됩니다.<br>원활한 상담을 위해 카카오톡 채널 <strong>@ai부트캠프</strong> 추가를 추가해 주세요.',
    checks: [
      { yes: true,  main: '유선 상담 동의', sub: '→ 담당 매니저가 안내된 번호로 연락드려요' },
      { yes: false, main: '유선 상담 미동의', sub: '→ 카카오톡 채널 @ai부트캠프로 상담이 진행돼요' }
    ]
  },
  {
    label: 'STEP 3', title: '서류 전형', meta: '트랙별 서류 작성 및 제출',
    desc: '면접 일정 확정 후 서류를 제출해주세요!\n지원하시는 트랙(MD&바잉 / 라이브커머스)에 맞춰 빠짐없이 꼼꼼하게 작성해 주세요.',
    notice: '<strong>서류 제출 안내</strong><br>✅ 작성 완료 → 면접 일정에 맞춰 <strong>면접 진행</strong><br>❎ 미작성 → 담당 매니저가 <strong>연락</strong><br>원활한 면접 진행을 위해 <strong>면접 전까지 서류 제출을 완료해</strong> 주세요!',
    checks: [
      { yes: true,  main: '서류 작성 완료', sub: '→ 제출하신 지원서를 바탕으로 면접이 진행돼요' },
      { yes: false, main: '서류 미작성',   sub: '→ 담당 매니저가 연락드려요' }
    ]
  },
  {
    label: 'STEP 4', title: '면접 전형', meta: '직무 적합성 및 참여 의지 확인',
    desc: '직무 적합성과 교육 참여 의지를 확인하는 단계입니다. \n 면접은 비대면으로 진행됩니다.'
  },
  {
    label: 'STEP 5', title: '역량 테스트&CDSE 진단', meta: '트랙별 역량 테스트 및 CDSE 진단',
    desc: '면접 진행자에 한해 역량 테스트와 CDSE 진단을 진행합니다.',
    notice: '<strong>⚠️ 유의사항</strong><br>기한 내 미응시할 경우 자동으로 선발 취소되니 기한 내 꼭 응시해주세요!',
  },
  {
    label: 'STEP 6', title: '최종 합격', meta: '합격자 개별 안내',
    isResult: true
  },
  {
    label: 'STEP 7', title: '최종 합류', meta: '최종 입과자 개강 안내',
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
      <div class="sub">${s.meta} · 최종 입과 여부를 회신해 주세요!</div>
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

/* ── 상세 커리큘럼 ── */
const CURRICULUM = {
  md: {
    icon: '🛍️',
    name: 'MD(상품기획) & 바잉 실무과정',
    tagline: '상품 발굴부터 소싱·기획까지 — 현대홈쇼핑 커머스 현장의 핵심 직무 실전 양성',
    target: '유통·경영·마케팅·소비자학 졸업자 / MD·바이어·상품기획 직무 희망 미취업 청년',
    jobs: 'MD 어시스턴트, 바이어, 상품기획자, 카테고리 매니저, 이커머스 MD',
    totalHours: 600,
    totalDays: 75,
    composition: [
      { label: '직무분야', hours: 496, pct: 82.7 },
      { label: '자율기획', hours: 104, pct: 17.3 }
    ],
    modules: [
      { tag: 'OT',     name: 'Kick-off Day',           hours: 8,   days: '1',    pct: 1 },
      { tag: '이론',   name: '직무 기초 (80H)',         hours: 80,  days: '10',   pct: 13 },
      { tag: '현장',   name: '기업탐방',                hours: 8,   days: '1',    pct: 1 },
      { tag: '실습',   name: '직무 실습 (160H)',        hours: 160, days: '20',   pct: 27 },
      { tag: '특강',   name: '창업특강 & 셀러 실습',    hours: 16,  days: '2',    pct: 3 },
      { tag: '심화',   name: '직무 심화 (136H)',        hours: 136, days: '17',   pct: 23 },
      { tag: '프로젝트', name: '팀 프로젝트 (120H)',     hours: 120, days: '15',   pct: 20 },
      { tag: '발표',   name: '성과발표',                hours: 8,   days: '1',    pct: 1 },
      { tag: '취업연계', name: 'Career Boost Track',    hours: 64,  days: '8',    pct: 11 }
    ],
    stages: [
      {
        no: 1, title: 'Kick-off Day (OT)', hours: 8, days: 1,
        items: [
          { title: '과정 오리엔테이션', meta: '8h · 1일 · 1%', points: [
            '과정 안내 및 학습 로드맵 제시: 전체 600시간 여정 안내 및 그라운드 룰 설정',
            '아이스브레이킹 및 성향 분석: 팀 빌딩을 위한 참여자 네트워킹'
          ]}
        ]
      },
      {
        no: 2, title: '직무 기초 (이론)', hours: 80, days: 10,
        items: [
          { title: '①현대 유통 산업 트렌드 & 채널의 이해', meta: '16h · 2일 · 3%', points: [
            '홈쇼핑·이커머스·오프라인·D2C 채널 비교, 유통 Value Chain 전체 이해',
            '옴니채널, 라이브 커머스, 미디어 커머스 시장 동향',
            '현대홈쇼핑 채널 구조(TV, 모바일 라이브, 종합몰 쇼핑엔티 등) 분석'
          ]},
          { title: '②MD 업무 프로세스 & 카테고리 매니지먼트', meta: '16h · 2일 · 3%', points: [
            'MD의 연간/시즌별 업무 사이클 및 상품 수명 주기[PLC] 관리',
            '패션, 뷰티, 리빙, 식품 등 카테고리별 MD 직무 특성 비교',
            '매출과 수익성을 고려한 상품 포트폴리오(카테고리 믹스) 구성법'
          ]},
          { title: '③상품 소싱 및 서플라이 체인[SCM] 기초', meta: '16h · 2일 · 3%', points: [
            '국내 제조사 탐색, OEM/ODM 소싱 방식 및 해외 직소싱 기초',
            '홈쇼핑/이커머스 물류 시스템 및 풀필먼트 이해',
            '협력사(벤더) 발굴, 평가 및 커뮤니케이션 스킬'
          ]},
          { title: '④MD를 위한 원가 분석 및 손익 관리', meta: '20h · 2.5일 · 3%', points: [
            '[MD 머천다이징 매스] 매입률, 마크업, 영업이익률 계산',
            '홈쇼핑 수수료 구조(정률/정액), 이커머스 수수료 구조 분석',
            '손익분기점[BEP] 분석 및 가격 책정(Pricing) 시뮬레이션'
          ]},
          { title: '⑤소비자 행동 분석 & 상품 비주얼 기획', meta: '12h · 1.5일 · 2%', points: [
            '타깃 고객 세분화 및 페르소나 설정, USP(셀링 포인트) 도출',
            '방송 및 모바일 화면에 맞는 상품 구성(패키징) 및 온라인 전시 기초',
            '고객 리뷰[VOC] 분석 및 피드백 반영 프로세스'
          ]}
        ]
      },
      {
        no: 3, title: '기업탐방 (현장)', hours: 8, days: 1,
        items: [
          { title: '현대홈쇼핑 본사/스튜디오 견학', meta: '8h · 1일 · 1%', points: [
            'TV 홈쇼핑 방송 송출 및 라이브 커머스 현장 참관',
            'MD가 일하는 환경과 물류/방송 시스템의 유기적 연결 확인'
          ]}
        ]
      },
      {
        no: 4, title: '직무 실습 (실습)', hours: 160, days: 20,
        items: [
          { title: '①시장 조사 및 아이템 발굴 실습', meta: '40h · 5일 · 7%', points: [
            '카테고리별 시장·경쟁사·소비자 조사 보고서 작성',
            '국내외 박람회, 도매 플랫폼, 트렌드 분석 툴을 활용한 아이템 발굴',
            '발굴 아이템의 시장성 검증 및 1차 상품 제안서 작성'
          ]},
          { title: '②벤더 서치 및 협상·계약 실습', meta: '40h · 5일 · 7%', points: [
            '가상 제조사/브랜드 대상 소싱 프레젠테이션 및 롤플레잉',
            '공급률, 최소주문수량[MOQ], 독점권 등 핵심 조건 협상 시뮬레이션',
            '유통 거래 계약서 작성 및 공정거래 관련 리스크 체크 리스트 작성'
          ]},
          { title: '③상품 큐레이션 및 매체별 구성 실습', meta: '40h · 5일 · 7%', points: [
            '단품 상품을 홈쇼핑 세트 상품(1+1, 패키지 구성 등)으로 재기획',
            'TV 홈쇼핑용 방송 기술서(큐시트 기초) 작성 및 쇼호스트 커뮤니케이션 가이드라인 수립',
            '모바일/이커머스 상세페이지 기획 및 카피라이팅 실습'
          ]},
          { title: '④런칭 프로모션 및 재고 관리 실습', meta: '40h · 5일 · 7%', points: [
            '런칭 기념 판촉 행사(쿠폰, 사은품, 타임세일) 기획 및 마케팅 예산 수립',
            '판매 예측 모델에 기반한 초기 초도 물량 발주[PO] 실습',
            '판매 부진 상품의 할인율 설계 및 재고 소진 전략 수립'
          ]}
        ]
      },
      {
        no: 5, title: '창업특강 & 이커머스 셀러 창업 실습 (특강)', hours: 16, days: 2,
        items: [
          { title: '1인 셀러 창업 실습', meta: '16h · 2일 · 3%', points: [
            '창업 특강: 1인 셀러/스마트스토어 성공 창업자 초청 노하우 공유',
            '이커머스 창업 실습: 스마트스토어/쿠팡 윙 입점, 상품 등록, 키워드 광고 세팅',
            'MD가 직접 셀러가 되어봄으로써 플랫폼 생태계와 정산 프로세스 이해'
          ]}
        ]
      },
      {
        no: 6, title: '직무 심화 (심화)', hours: 136, days: 17,
        items: [
          { title: '①커머스 데이터 리터러시 & 통계 기초', meta: '32h · 4일 · 5%', points: [
            'MD 핵심 지표[KPI] 정의: PV, UV, CTR, CVR, 객단가, 재구매율 등',
            '데이터 분석을 위한 엑셀(Excel) 실무: VLOOKUP, 피벗테이블, 통계 함수',
            '공공 데이터 및 소셜 빅데이터 툴(네이버 데이터랩 등) 활용법'
          ]},
          { title: '②현대홈쇼핑 채널 데이터 분석', meta: '40h · 5일 · 7%', points: [
            '홈쇼핑 데이터: 방송 분당 매출, 시청률, 주문 유입 곡선 해석법',
            '이커머스 데이터: 현대Hmall 유입 경로, 장바구니 이탈률, 검색어 데이터 분석',
            '데이터 기반의 방송/전시 구좌 효율성 평가 및 개선점 도출'
          ]},
          { title: '③디지털 마케팅 지표 분석 및 성과 최적화', meta: '32h · 4일 · 5%', points: [
            '퍼포먼스 마케팅 데이터(ROAS, CAC, LTV)의 이해',
            'GA4(구글 애널리틱스) 및 자사몰 대시보드 데이터 해석 실습',
            'A/B 테스트를 통한 상품 썸네일/상세페이지 전환율 개선 실습'
          ]},
          { title: '④트렌드 리딩 및 수요 예측 실무', meta: '32h · 4일 · 5%', points: [
            '텍스트 마이닝 툴을 활용한 소셜 미디어 버즈량 분석 및 신규 트렌드 예측',
            '계절성, 외부 요인(날씨, 이벤트)을 반영한 수요 예측 모델링',
            '데이터 기반 연간 상품 운영 계획서[MD Calendar] 수립'
          ]}
        ]
      },
      {
        no: 7, title: '팀 프로젝트 (프로젝트)', hours: 120, days: 15,
        items: [
          { title: '현대홈쇼핑 제안용 신상품 기획 및 소싱 전략', meta: '120h · 15일 · 20%', points: [
            '1단계 (30h): 팀 빌딩 및 카테고리 선정, 시장/데이터 분석',
            '2단계 (30h): 가상 소싱처 확보 및 원가 구조 산정, 손익 시뮬레이션',
            '3단계 (30h): 마케팅/프로모션 및 유통 채널 운영 전략 수립',
            '4단계 (30h): 최종 상품 기획서[PT] 작성 및 현직자 중간 멘토링'
          ]}
        ]
      },
      {
        no: 8, title: '성과발표 (발표)', hours: 8, days: 1,
        items: [
          { title: '성과 발표회 및 수료식', meta: '8h · 1일 · 1%', points: [
            '현대홈쇼핑 실무진 및 인사담당자 심사위원 초청 피칭',
            '우수 기획안 시상 및 피드백 수렴',
            '교육 과정 마무리 및 수료증 수여'
          ]}
        ]
      },
      {
        no: 9, title: 'Career Boost Track (취업연계)', hours: 64, days: 8,
        items: [
          { title: '①이력서·포트폴리오 특강 & 실습', meta: '24h · 3일 · 4%', points: [
            '특강(8h): MD 직무 맞춤형 역량 중심 자기소개서 작성법, 포트폴리오 시각화 전략',
            '실습(16h): 상품 기획·데이터 분석 결과물을 직무 포트폴리오로 자산화하는 개인별 클리닉'
          ]},
          { title: '②입사지원 실습 & 전형 트래킹 (1:1 컨설팅)', meta: '16h · 2일 · 3%', points: [
            '현대홈쇼핑 및 유통/이커머스 기업 채용 공고 기반 실전 지원 실습',
            '전문 커리어 컨설턴트와의 1:1 매칭을 통한 자기소개서 첨삭 및 진로 상담',
            '서류-필기-면접 전형별 실시간 모니터링 및 개인 피드백 제공'
          ]},
          { title: '③모의면접 & 기업-참여자 매칭데이', meta: '8h · 1일 · 1%', points: [
            '실전 모의면접(4h): MD 직무 면접(PT면접, 구조화면접, 인성면접) 시뮬레이션',
            '매칭데이(4h): 협력사·이커머스 유관 기업 채용 담당자 초청 현장 면접 및 채용 연계 상담회'
          ]},
          { title: '④직무 세미나 (현직자 특강)', meta: '16h · 2일 · 3%', points: [
            '현대홈쇼핑 현직 카테고리별 MD(패션/식품/리빙 등) 초청 세미나',
            '라이브 커머스 PD/쇼호스트/조직장 특강을 통한 커머스 협업 생태계 이해'
          ]}
        ]
      }
    ]
  },
  live: {
    icon: '📹',
    name: '라이브커머스 전문가과정 (숏폼 크리에이터)',
    tagline: '기획·진행·숏폼 제작·영상편집 올인원 — 라이브커머스 전문가부터 1인 크리에이터까지',
    target: '유통·경영·미디어·영상·콘텐츠 계열 졸업자 / 라이브커머스 기획·운영·1인 크리에이터 직무 희망 미취업 청년',
    jobs: '라이브커머스 기획자, 커머스 PD, 라이브 운영 매니저, 숏폼 크리에이터, 커머스 영상 편집자, 1인 셀링 크리에이터',
    totalHours: 600,
    totalDays: 75,
    composition: [
      { label: '직무분야', hours: 356, pct: 59.3 },
      { label: '자율기획', hours: 244, pct: 40.7 }
    ],
    modules: [
      { tag: 'OT',     name: 'Kick-off Day',           hours: 8,   days: '1',    pct: 1 },
      { tag: '이론',   name: '직무 기초 (88H)',         hours: 88,  days: '11',   pct: 15 },
      { tag: '현장',   name: '기업탐방',                hours: 8,   days: '1',    pct: 1 },
      { tag: '실습',   name: '직무 실습 (168H)',        hours: 168, days: '21',   pct: 28 },
      { tag: '특강',   name: '창업특강 & 셀러 실습',    hours: 16,  days: '2',    pct: 3 },
      { tag: '심화',   name: '직무 심화 (100H)',        hours: 100, days: '12.5', pct: 17 },
      { tag: '프로젝트', name: '팀 프로젝트 (140H)',     hours: 140, days: '17.5', pct: 23 },
      { tag: '발표',   name: '성과발표',                hours: 8,   days: '1',    pct: 1 },
      { tag: '취업연계', name: 'Career Boost Track',    hours: 64,  days: '8',    pct: 11 }
    ],
    stages: [
      {
        no: 1, title: 'Kick-off Day (OT)', hours: 8, days: 1,
        items: [
          { title: '과정 오리엔테이션', meta: '8h · 1일 · 1%', points: [
            '과정 안내 및 학습 로드맵 제시: 전체 600시간 운영안 및 평가 기준 안내',
            '팀 빌딩 및 아이스브레이킹: 참여자 네트워킹 및 초기 조 구성'
          ]}
        ]
      },
      {
        no: 2, title: '직무 기초 (이론)', hours: 88, days: 11,
        items: [
          { title: '①미디어 커머스 생태계 및 채널의 이해', meta: '20h · 2.5일 · 3%', points: [
            'TV 홈쇼핑, 모바일 라이브, T커머스 등 채널별 비즈니스 모델 비교',
            '네이버 쇼핑라이브, 쿠팡, 카카오, 배민 등 주요 플랫폼별 특성 및 알고리즘',
            '현대홈쇼핑(Hmall, 모바일 라이브)의 타깃 고객 분석 및 성공 사례 스터디'
          ]},
          { title: '②라이브커머스 심의 및 법적 규제', meta: '20h · 2.5일 · 3%', points: [
            '[필수 법규] 과장 광고 예방을 위한 표시광고법, 제조물책임법[PL법]',
            '식품, 뷰티, 건강기능식품 등 카테고리별 금지 표현 및 심의 가이드라인',
            '저작권, 폰트, 초상권 및 상표권 리스크 관리'
          ]},
          { title: '③마케팅 기획 및 소비자 행동 이해', meta: '24h · 3일 · 4%', points: [
            '타깃 페르소나 설정 및 소비자 구매 여정(AARRR, AISAS) 분석',
            '상품 조사론: 카테고리별 상품 트렌드 분석 및 USP 도출법',
            '시청자의 지갑을 열게 하는 미디어 커머스 특화 행동경제학 트리거 이론'
          ]},
          { title: '④디지털 마케팅 및 지표[KPI]의 기초', meta: '24h · 3일 · 4%', points: [
            '라이브커머스 주요 지표 이해 (PV, UV, CTR, CVR, 동접자수, 객단가 등)',
            '유입 마케팅 기초: 사전 홍보를 위한 미디어 믹스 전략 및 UTM 파라미터 이해',
            '엑셀을 활용한 기초 커머스 수학(마진율, 수수료, 할인율 계산) 실습'
          ]}
        ]
      },
      {
        no: 3, title: '기업탐방 (현장)', hours: 8, days: 1,
        items: [
          { title: '현대홈쇼핑 본사 및 모바일 라이브 스튜디오 투어', meta: '8h · 1일 · 1%', points: [
            '실제 방송 현장 시스템 참관',
            '현직 스태프 인터뷰: 방송 주조정실, 부조정실 및 MD·PD 워크플로우 확인'
          ]}
        ]
      },
      {
        no: 4, title: '직무 실습 (실습)', hours: 168, days: 21,
        items: [
          { title: '①라이브커머스 구성안 및 큐시트 기획', meta: '40h · 5일 · 7%', points: [
            '시간별 멘트, 자막, 화면 전환, 데모가 담긴 큐시트 작성 실습',
            '오프닝(3초 후킹), 바디(상품 설명 및 혜택), 클로징(구매 독려) 스크립트 설계',
            '소통 퀴즈, 선착순 구매 등 라이브 특화 프로모션 기획안 작성'
          ]},
          { title: '②카메라 스피치 및 방송 진행 실습', meta: '40h · 5일 · 7%', points: [
            '보이스트레이닝(호흡, 발성, 딕션) 및 카메라 시선 처리, 제스처 교정',
            '[시연 실습] 식품(먹방), 패션(핏·소재 설명), 뷰티(비포&애프터 데모) 기법',
            '실시간 채팅 반응, 악플 및 시스템 오류 발생 시 돌발 상황 대처 훈련'
          ]},
          { title: '③라이브 송출 시스템 및 하드웨어 운용', meta: '40h · 5일 · 7%', points: [
            'OBS Studio, 프리즘 라이브 스튜디오 등 방송 송출 소프트웨어 마스터',
            '스마트폰, 미러리스 카메라를 활용한 멀티캠(Multi-Cam) 세팅 및 화면 전환',
            '무선 마이크, 오디오 믹서 조절 및 카테고리별 조명 세팅 실습'
          ]},
          { title: '④커머스 영상 촬영 및 편집 실습', meta: '48h · 6일 · 8%', points: [
            '프리미어 프로 및 캡컷(CapCut) PC 버전을 활용한 원스톱 영상 편집 실습',
            '제품 상세 페이지용 GIF(움짤) 제작 및 방송 백그라운드 소스 디자인',
            '인트로 타이틀, 자막 바, 효과음, BGM 삽입을 통한 커머스 영상 고도화'
          ]}
        ]
      },
      {
        no: 5, title: '창업특강 & 이커머스 셀러 창업 실습 (특강)', hours: 16, days: 2,
        items: [
          { title: '1인 미디어 셀러 창업 실습', meta: '16h · 2일 · 3%', points: [
            '창업 특강: 1인 미디어 셀러 및 자체 브랜드 운영 크리에이터 초청 특강',
            '스토어 개설: 스마트스토어/쿠팡 윙 입점, 사업자등록 및 통신판매업 신고 가이드',
            '1인 셀러의 사입, 사후 정산 및 세무 회계 기초 원리'
          ]}
        ]
      },
      {
        no: 6, title: '직무 심화 (심화)', hours: 100, days: 12.5,
        items: [
          { title: '①숏폼 크리에이터 메커니즘 및 기획', meta: '30h · 3.75일 · 5%', points: [
            '유튜브 쇼츠, 인스타그램 릴스, 틱톡 채널별 알고리즘 및 유저 성향 분석',
            '숏폼 전용 3초 후킹 대본 기획 및 스마트폰 초간편 촬영 기법',
            '트렌드 음원 활용법, 챌린지 기획 및 오가닉 도달률 극대화 전략'
          ]},
          { title: '②커머스 숏폼 제작 및 채널 빌딩', meta: '30h · 3.75일 · 5%', points: [
            "라이브 예고 숏폼 및 방송 하이라이트 '팝콘 영상' 편집",
            '스마트폰 편집 앱(비타, 캡컷 모바일)을 활용한 현장 고속 편집 실습',
            '브랜드 계정 톤앤매너 정립 및 Vimeo·Notion 포트폴리오 사이트 구성'
          ]},
          { title: '③라이브커머스 성과 데이터 분석 실무', meta: '16h · 2일 · 3%', points: [
            '방송 종료 후 대시보드 데이터 해석: 최고 동접자 수, 평균 체류시간, 구매 전환율',
            '실시간 매출 유입 곡선 분석을 통한 방송 내 소구점 타당성 검증',
            '경쟁사 라이브 방송 모니터링 및 벤치마킹 분석 보고서 작성'
          ]},
          { title: '④데이터 기반 방송 성과 최적화[CRO]', meta: '24h · 3일 · 4%', points: [
            '분석 데이터를 바탕으로 한 썸네일 개선, 상세페이지 UI 변경 실습',
            'A/B 테스트 기법을 활용한 가상 마케팅 예산 효율 최적화',
            '차기 방송 런칭을 위한 데이터 기반 피드백 리포트[PD 리포트] 작성법'
          ]}
        ]
      },
      {
        no: 7, title: '팀 프로젝트 (프로젝트)', hours: 140, days: 17.5,
        items: [
          // { title: '실전 라이브커머스 운영 (기업협력 가능 시 · A안)', meta: '140h · 17.5일 · 23%', points: [
          //   '사전 준비(35h): 팀 빌딩, 상품 선정, 시장 조사 및 채널 개설, 마케팅 계획 수립',
          //   '콘텐츠 빌드(35h): 사전 유입용 홍보 숏폼 시리즈 제작(5편 이상) 및 채널 업로드',
          //   '실전 런칭(35h): 리허설 진행, 실제 모바일 플랫폼 라이브 방송 송출',
          //   '사후 정산(35h): 방송 데이터 취합, 매출 및 정산 분석, 최종 성과 포트폴리오 북 제작'
          // ]},
          { title: '실전 라이브커머스 운영', meta: '140h · 17.5일 · 23%', points: [
            '브랜드 배정 & 전략 기획: 팀별 협력/가상 브랜드 배정 → 라이브+숏폼 통합 전략 수립',
            '멀티 플랫폼 라이브 방송 5회: 네이버·쿠팡·인스타 중 2개 이상 동시 운영',
            '숏폼 채널 운영(개인): 개인 실계정 채널 개설 → 6주 숏폼 20편 이상 업로드·성과 측정',
            '최종 발표회: 라이브 운영 성과 + 숏폼 채널 성과 + 영상 포트폴리오 종합 발표'
          ]}
        ]
      },
      {
        no: 8, title: '성과발표 (발표)', hours: 8, days: 1,
        items: [
          { title: '성과 발표회 및 수료식', meta: '8h · 1일 · 1%', points: [
            '현대홈쇼핑 모바일 라이브 사업부 실무진 및 MCN 에이전시 심사위원 배석',
            '우수 팀 시상 및 취업 포트폴리오 연계를 위한 전문가 총평 피드백',
            '교육 과정 마무리 및 수료증 수여'
          ]}
        ]
      },
      {
        no: 9, title: 'Career Boost Track (취업연계)', hours: 64, days: 8,
        items: [
          { title: '①이력서·포트폴리오 특강 & 실습', meta: '24h · 3일 · 4%', points: [
            '특강(8h): 기획서/콘텐츠 링크 중심의 포트폴리오 시각화, 영상 쇼릴(Showreel) 제작 기법',
            '실습(16h): 영상 결과물과 라이브 데이터 지표를 자산화한 노션(Notion) 포트폴리오 구축 1:1 클리닉'
          ]},
          { title: '②입사지원 실습 & 전형 트래킹 (1:1 컨설팅)', meta: '16h · 2일 · 3%', points: [
            '타깃 직무별(인하우스 커머스팀, 라이브 대행사, 방송 프로덕션) 공고 매칭 및 실전 서류 접수',
            '전문 커리어 컨설턴트 밀착 배정을 통한 자기소개서 첨삭 및 진로 카운셀링',
            '개인별 입사 지원 현황 트래킹 및 면접 전형 실시간 컨설팅'
          ]},
          { title: '③모의면접 & 기업-참여자 매칭데이', meta: '8h · 1일 · 1%', points: [
            '실전 모의면접(4h): 커머스 PD용 방송 기획 PT 면접, 진행자용 즉석 큐시트 리딩 면접 시뮬레이션',
            '매칭데이(4h): 현대홈쇼핑 벤더사, 라이브커머스 전문 에이전시 채용 담당자 초청 네트워킹 매칭회'
          ]},
          { title: '④직무 세미나 (현직자 특강)', meta: '16h · 2일 · 3%', points: [
            '현대홈쇼핑 전속 모바일 라이브 PD, 탑티어 쇼호스트, 전문 MCN 기획자 릴레이 특강',
            '[프리랜서 생태계] 출연료 요율 정산, 프리랜서 셀프 브랜딩 가이드'
          ]}
        ]
      }
    ]
  }
};

let currentTrack = 'md';
let openStageIndex = null; // 커리큘럼 탭 내 아코디언 오픈 상태

function renderCurriculum() {
  const t = CURRICULUM[currentTrack];
  const body = document.getElementById('curriculumBody');
  if (!body) return;

  const compHTML = t.composition.map(c => `
    <div class="curr-comp-row">
      <span class="curr-comp-label">${c.label}</span>
      <div class="curr-comp-track"><div class="curr-comp-fill" style="width:${c.pct}%"></div></div>
      <span class="curr-comp-pct">${c.hours}h · ${c.pct}%</span>
    </div>`).join('');

  const moduleHTML = t.modules.map(m => `
    <div class="module-row">
      <span class="module-tag">${m.tag}</span>
      <span class="module-name">${m.name}</span>
      <span class="module-meta">${m.days}일</span>
      <span class="module-pct">${m.pct}%</span>
    </div>`).join('');

  const stageHTML = t.stages.map((s, i) => {
    const open = openStageIndex === i;
    const itemsHTML = s.items.map(it => `
      <div class="sub-item">
        <div class="sub-item-top">
          <span class="sub-item-title">${it.title}</span>
          <span class="sub-item-meta">${it.meta}</span>
        </div>
        <ul class="sub-item-list">
          ${it.points.map(p => `<li>${p}</li>`).join('')}
        </ul>
      </div>`).join('');

    return `
      <div class="stage-acc-item ${open ? 'open' : ''}">
        <button class="stage-acc-header" data-stage="${i}">
          <span class="stage-acc-num">${s.no}</span>
          <span class="stage-acc-title">${s.title}</span>
          <span class="stage-acc-meta">${s.hours}h · ${s.days}일</span>
          <span class="stage-acc-chevron">▼</span>
        </button>
        <div class="stage-acc-body">
          <div class="stage-acc-body-inner">${itemsHTML}</div>
        </div>
      </div>`;
  }).join('');

  body.innerHTML = `
    <div class="curr-summary">
      <div class="curr-summary-head">
        <span class="curr-icon">${t.icon}</span>
        <div>
          <div class="curr-name">${t.name}</div>
          <div class="curr-tagline">"${t.tagline}"</div>
        </div>
      </div>
      <div class="curr-info-grid">
        <div class="curr-info-row"><span>훈련 대상</span><p>${t.target}</p></div>
        <div class="curr-info-row"><span>취업 직무</span><p>${t.jobs}</p></div>
        <div class="curr-info-row"><span>총 교육시간</span><p>${t.totalHours}시간 (${t.totalDays}일)</p></div>
      </div>
      <div class="curr-comp-wrap">${compHTML}</div>
    </div>

    <div class="section-sub-header"><h3>모듈별 구성</h3></div>
    <div class="module-table">${moduleHTML}</div>

    <div class="section-sub-header"><h3>단계별 세부 과목</h3></div>
    <div class="stage-acc" id="stageAcc">${stageHTML}</div>
  `;

  body.querySelectorAll('.stage-acc-header').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = Number(btn.dataset.stage);
      const item = btn.closest('.stage-acc-item');
      const wasOpen = item.classList.contains('open');

      // 다른 열려있는 아코디언 닫기
      body.querySelectorAll('.stage-acc-item.open').forEach(el => {
        el.classList.remove('open');
        el.querySelector('.stage-acc-body').style.maxHeight = '0';
      });

      if (!wasOpen) {
        item.classList.add('open');
        const inner = item.querySelector('.stage-acc-body-inner');
        item.querySelector('.stage-acc-body').style.maxHeight = inner.scrollHeight + 'px';
        openStageIndex = idx;
      } else {
        openStageIndex = null;
      }
      setTimeout(adjustPadding, 320);
    });
  });

  adjustPadding();
}

document.querySelectorAll('.track-toggle-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.track-toggle-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentTrack = btn.dataset.track;
    openStageIndex = null;
    renderCurriculum();
  });
});

renderCurriculum();

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