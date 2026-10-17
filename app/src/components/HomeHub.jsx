import React from 'react';
import {
  ShieldAlert, HeartPulse, Flame, Droplets, BookOpen,
  ArrowRight, CheckCircle2, Clock, ChevronRight,
  ShieldCheck, Stethoscope, HelpCircle, FileText
} from 'lucide-react';

export default function HomeHub({
  rules = [],
  checkedMustPass = {},
  selectedDept = '간호부',
  onSelectDept,
  onNavigateTab,
  onOpenRule,
  onOpenEmergency
}) {
  const mustPassRules = rules.filter((r) => r.isMustPass);
  const mustPassTotal = mustPassRules.length || 8;
  const mustPassCheckedCount = mustPassRules.filter((r) => checkedMustPass[r.code]).length;
  const masteryRate = Math.round((mustPassCheckedCount / mustPassTotal) * 100);

  // 3-Second Spoken Answers
  const quickAnswerList = [
    { code: '1.1', title: '환자 확인', answer: '이름과 생년월일(2가지 지표)을 개방형 질문으로 확인합니다.', color: 'emerald' },
    { code: '1.2', title: '낙상 고위험', answer: 'Morse 51점 이상 환자는 침상과 전산에 빨간 스티커를 부착합니다.', color: 'amber' },
    { code: '3.2.3', title: '신체보호대', answer: '의사 1일 1회 처방 후 2시간마다 관찰 기록, 10~30분 일시 해제합니다.', color: 'purple' },
    { code: '4.2', title: '약품 냉장보관', answer: '냉장고 2~8℃ 유지(1일 2회 점검), 인슐린 개봉 후 28일간 사용합니다.', color: 'blue' },
    { code: '10.6', title: '화재 비상통보', answer: '원무과(내선 900)에 즉시 통보하고 C급(독립) ➔ B급(부축) ➔ A급(침상) 대피합니다.', color: 'rose' },
    { code: '3.2.1', title: '심폐소생술(CPR)', answer: '내선 900번으로 "CPR + 발생장소" 순으로 2회 원내 방송을 요청합니다.', color: 'teal' },
  ];

  // Official Departments
  const departments = [
    { name: '간호부', icon: '🩺', count: '28개' },
    { name: '진료부', icon: '👨‍⚕️', count: '16개' },
    { name: '원무과', icon: '📋', count: '12개' },
    { name: '영양팀', icon: '🥗', count: '8개' },
    { name: '시설팀', icon: '🔧', count: '14개' },
    { name: '약제과', icon: '💊', count: '6개' },
  ];

  return (
    <div className="home-hub-clean-wrap">
      {/* 1. Integrated Hero Card (필수 숙지율 + 인쇄용 핸드북) */}
      <section className="hub-hero-card">
        <div className="hero-top-row">
          <span className="hero-dept-tag">
            <span className="hero-dept-dot" />
            <span>{selectedDept} 인증 규정</span>
          </span>
          <span className="hero-status-pill">
            4주기 인증 기준
          </span>
        </div>

        <h1 className="hero-main-title">
          네이처 요양병원 실무 규정집
        </h1>

        {/* Must-Pass Checklist Progress */}
        <div className="hero-progress-wrap">
          <div className="hero-progress-head">
            <span className="hp-title">
              <ShieldCheck size={15} color="var(--primary)" />
              <span>★ 8대 필수 조사항목 숙지</span>
            </span>
            <span className="hp-score">
              <strong>{mustPassCheckedCount}</strong> / {mustPassTotal}항목 ({masteryRate}%)
            </span>
          </div>
          <div className="hero-progress-track">
            <div
              className="hero-progress-fill"
              style={{ width: `${Math.min(masteryRate, 100)}%` }}
            />
          </div>
        </div>

        {/* Integrated Printed Handbook Link Button */}
        <a
          href="/nature_handbook_print.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="hero-handbook-link"
        >
          <div className="hhl-left">
            <BookOpen size={17} className="hhl-icon" />
            <div className="hhl-text">
              <span className="hhl-title">인쇄용 요약 핸드북 소책자 (74P)</span>
              <span className="hhl-sub">원내 실물 배포본 전자책 전체 페이지 열람</span>
            </div>
          </div>
          <ChevronRight size={17} className="hhl-arrow" />
        </a>
      </section>

      {/* 2. Emergency 1-Tap Fast Contact (시원한 2x2 그리드) */}
      <section className="hub-section-block">
        <div className="hub-sec-header">
          <div className="hub-sec-title">
            <ShieldAlert size={17} color="var(--danger)" />
            <span>원내 비상대응 연락망</span>
          </div>
          <span className="hub-sec-hint">원터치 확인</span>
        </div>

        <div className="emer-grid-2x2">
          <button
            className="emer-card-item fire"
            onClick={() => onOpenEmergency('fire')}
          >
            <div className="eci-icon-wrap fire">
              <Flame size={20} />
            </div>
            <div className="eci-info">
              <strong className="eci-title">화재 비상</strong>
              <span className="eci-sub">내선 900</span>
            </div>
          </button>

          <button
            className="emer-card-item cpr"
            onClick={() => onOpenEmergency('cpr')}
          >
            <div className="eci-icon-wrap cpr">
              <HeartPulse size={20} />
            </div>
            <div className="eci-info">
              <strong className="eci-title">심폐소생술</strong>
              <span className="eci-sub">내선 900</span>
            </div>
          </button>

          <button
            className="emer-card-item spill"
            onClick={() => onOpenEmergency('spill')}
          >
            <div className="eci-icon-wrap spill">
              <Droplets size={20} />
            </div>
            <div className="eci-info">
              <strong className="eci-title">유출 사고</strong>
              <span className="eci-sub">스필키트</span>
            </div>
          </button>

          <button
            className="emer-card-item security"
            onClick={() => onOpenEmergency('security')}
          >
            <div className="eci-icon-wrap security">
              <ShieldAlert size={20} />
            </div>
            <div className="eci-info">
              <strong className="eci-title">보안·이탈</strong>
              <span className="eci-sub">내선 901</span>
            </div>
          </button>
        </div>
      </section>

      {/* 3. Essential 3-Second Oral Answers (스와이프 카드) */}
      <section className="hub-section-block">
        <div className="hub-sec-header">
          <div className="hub-sec-title">
            <CheckCircle2 size={17} color="var(--primary)" />
            <span>조사위원 질문 시 3초 구두 답변</span>
          </div>
          <button
            className="hub-sec-link"
            onClick={() => onNavigateTab('golden')}
          >
            기준 수치 <ChevronRight size={13} />
          </button>
        </div>

        <div className="quick-answers-scroll">
          {quickAnswerList.map((item, idx) => (
            <div
              key={idx}
              className={`quick-answer-card border-${item.color}`}
              onClick={() => onOpenRule(item.code)}
            >
              <div className="qac-top">
                <span className="qac-code">규정 {item.code}</span>
                <span className="qac-tag">구두 답변</span>
              </div>
              <h3 className="qac-title">{item.title}</h3>
              <p className="qac-text">"{item.answer}"</p>
              <div className="qac-footer">
                <span>상세 규정 열람</span>
                <ArrowRight size={12} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Department Filter Chips (컴팩트 2열 칩) */}
      <section className="hub-section-block">
        <div className="hub-sec-header">
          <div className="hub-sec-title">
            <Stethoscope size={17} color="var(--primary)" />
            <span>부서별 주요 규정 바로가기</span>
          </div>
        </div>

        <div className="dept-chips-grid">
          {departments.map((dept, idx) => (
            <button
              key={idx}
              className={`dept-chip-btn ${selectedDept === dept.name ? 'active' : ''}`}
              onClick={() => {
                onSelectDept(dept.name);
                onNavigateTab('handbook');
              }}
            >
              <span className="dcb-icon">{dept.icon}</span>
              <span className="dcb-name">{dept.name}</span>
              <span className="dcb-count">{dept.count}</span>
            </button>
          ))}
        </div>
      </section>

      {/* 5. Mobile Clean Navigation Actions (모의 퀴즈 도전 & 규정집 이동) */}
      <section className="hub-section-block" style={{ marginBottom: 12 }}>
        <div className="hub-action-banners">
          {/* Quiz Action Banner */}
          <div
            className="action-card quiz"
            onClick={() => onNavigateTab('quiz')}
          >
            <div className="ac-left">
              <div className="ac-icon-badge quiz">🎯</div>
              <div className="ac-texts">
                <strong className="ac-title">실전 모의 퀴즈 & 암기카드</strong>
                <span className="ac-desc">45문항 랜덤 출제 · 오답노트 복습</span>
              </div>
            </div>
            <ChevronRight size={17} className="ac-arrow" />
          </div>

          {/* Handbook Browser Banner */}
          <div
            className="action-card handbook"
            onClick={() => onNavigateTab('handbook')}
          >
            <div className="ac-left">
              <div className="ac-icon-badge handbook">📚</div>
              <div className="ac-texts">
                <strong className="ac-title">인증기준 12대 챕터 전체 열람</strong>
                <span className="ac-desc">총 58개 공식 규정집 원문 및 서식 확인</span>
              </div>
            </div>
            <ChevronRight size={17} className="ac-arrow" />
          </div>
        </div>
      </section>
    </div>
  );
}
