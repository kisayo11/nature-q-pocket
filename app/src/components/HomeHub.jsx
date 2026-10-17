import React from 'react';
import { CHAPTERS } from '../data/chaptersData';
import {
  ShieldAlert, HeartPulse, Flame, Droplets, BookOpen,
  ArrowRight, CheckCircle2, AlertTriangle, Clock,
  ChevronRight, ShieldCheck, Stethoscope
} from 'lucide-react';

export default function HomeHub({
  rules = [],
  checkedMustPass = {},
  selectedDept = '간호부',
  onSelectDept,
  onNavigateTab,
  onOpenRule,
  onOpenChapter,
  onOpenEmergency
}) {
  const mustPassRules = rules.filter((r) => r.isMustPass);
  const mustPassTotal = mustPassRules.length || 8;
  const mustPassCheckedCount = mustPassRules.filter((r) => checkedMustPass[r.code]).length;
  const masteryRate = Math.round((mustPassCheckedCount / mustPassTotal) * 100);

  // 3-Second Essential Answers (3초 구두 답변 요약)
  const quickAnswerList = [
    { code: '1.1', title: '환자 확인', answer: '이름과 생년월일(2가지 지표)을 개방형 질문으로 확인합니다.', color: 'emerald' },
    { code: '1.2', title: '낙상 고위험', answer: 'Morse 51점 이상 환자는 침상과 전산에 빨간 스티커를 부착합니다.', color: 'amber' },
    { code: '3.2.3', title: '신체보호대', answer: '의사 1일 1회 처방 후 2시간마다 관찰 기록, 10~30분 일시 해제합니다.', color: 'purple' },
    { code: '4.2', title: '약품 냉장보관', answer: '냉장고 2~8℃ 유지(1일 2회 점검), 인슐린 개봉 후 28일간 사용합니다.', color: 'blue' },
    { code: '10.6', title: '화재 비상통보', answer: '원무과(내선 900)에 즉시 통보하고 C급(독립) ➔ B급(부축) ➔ A급(침상) 대피합니다.', color: 'rose' },
    { code: '3.2.1', title: '심폐소생술(CPR)', answer: '내선 900번으로 "CPR + 발생장소" 순으로 2회 원내 방송을 요청합니다.', color: 'teal' },
  ];

  // Official Departments (정규 직고용 6개 부서)
  const departments = [
    { name: '간호부', label: '간호부', count: '28개 규정', icon: '🩺' },
    { name: '진료부', label: '진료부', count: '16개 규정', icon: '👨‍⚕️' },
    { name: '원무과', label: '원무·행정', count: '12개 규정', icon: '📋' },
    { name: '영양팀', label: '영양·위생', count: '8개 규정', icon: '🥗' },
    { name: '시설팀', label: '시설·방재', count: '14개 규정', icon: '🔧' },
    { name: '약제과', label: '약제관리', count: '6개 규정', icon: '💊' },
  ];

  return (
    <div className="home-hub-wrap">
      {/* 1. Clean Top Status Card */}
      <section className="hub-status-card">
        <div className="status-top-row">
          <div className="status-dept-badge">
            <span className="dot-indicator" />
            <span>{selectedDept} 인증 규정</span>
          </div>
        </div>

        <h1 className="status-main-title">
          네이처 요양병원 실무 규정집
        </h1>
        <p className="status-sub-desc">
          보건복지부 4주기 인증 기준 및 원내 최신 개정 규정 준수
        </p>

        {/* Must-Pass Checklist Progress */}
        <div className="status-progress-box">
          <div className="progress-header">
            <span className="progress-title">
              <ShieldCheck size={16} color="var(--primary)" />
              <span>{mustPassTotal}개 필수 조사항목 숙지 현황</span>
            </span>
            <span className="progress-value">
              <strong>{mustPassCheckedCount}</strong> / {mustPassTotal}항목 ({masteryRate}%)
            </span>
          </div>
          <div className="progress-bar-track">
            <div
              className="progress-bar-fill"
              style={{ width: `${Math.min(masteryRate, 100)}%` }}
            />
          </div>
          <p className="progress-caption">
            *필수 항목 중 1개라도 '불인증' 판정 시 인증에서 탈락하므로 전 직원 필수 숙지 바랍니다.
          </p>
        </div>
      </section>

      {/* Official Printed Handbook Quick Access Banner */}
      <a
        href="/nature_handbook_print.pdf"
        target="_blank"
        rel="noopener noreferrer"
        className="handbook-print-banner"
      >
        <div className="hp-banner-left">
          <div className="hp-banner-icon">
            <BookOpen size={20} color="var(--primary)" />
          </div>
          <div className="hp-banner-info">
            <div className="hp-banner-badge">원내 실물 배포본 전자책</div>
            <strong className="hp-banner-title">인증 요약 핸드북 소책자 (74P 전체본)</strong>
            <span className="hp-banner-sub">휴대용 실물 책자 전체 페이지 열람 및 인쇄</span>
          </div>
        </div>
        <div className="hp-banner-arrow">
          <ChevronRight size={18} />
        </div>
      </a>

      {/* 2. Emergency 1-Tap Fast Contact (비상 대응 4종) */}
      <section className="hub-clean-section">
        <div className="section-head-bar">
          <h2 className="section-title-clean">
            <ShieldAlert size={18} color="var(--danger)" />
            <span>원내 비상대응 연락망</span>
          </h2>
          <span className="section-sub-tag">원터치 확인</span>
        </div>

        <div className="emergency-contact-grid">
          <button
            className="emer-contact-box fire"
            onClick={() => onOpenEmergency('fire')}
          >
            <Flame size={20} className="emer-box-icon" />
            <div className="emer-box-texts">
              <span className="emer-box-title">화재 발생</span>
              <span className="emer-box-num">내선 900</span>
            </div>
          </button>

          <button
            className="emer-contact-box cpr"
            onClick={() => onOpenEmergency('cpr')}
          >
            <HeartPulse size={20} className="emer-box-icon" />
            <div className="emer-box-texts">
              <span className="emer-box-title">심폐소생술</span>
              <span className="emer-box-num">내선 900</span>
            </div>
          </button>

          <button
            className="emer-contact-box spill"
            onClick={() => onOpenEmergency('spill')}
          >
            <Droplets size={20} className="emer-box-icon" />
            <div className="emer-box-texts">
              <span className="emer-box-title">유출 사고</span>
              <span className="emer-box-num">스필키트</span>
            </div>
          </button>

          <button
            className="emer-contact-box security"
            onClick={() => onOpenEmergency('security')}
          >
            <ShieldAlert size={20} className="emer-box-icon" />
            <div className="emer-box-texts">
              <span className="emer-box-title">보안·이탈</span>
              <span className="emer-box-num">내선 901</span>
            </div>
          </button>
        </div>
      </section>

      {/* 3. Essential 3-Second Answers (3초 구두 답변 요약) */}
      <section className="hub-clean-section">
        <div className="section-head-bar">
          <h2 className="section-title-clean">
            <CheckCircle2 size={18} color="var(--primary)" />
            <span>조사위원 질문 시 3초 구두 답변</span>
          </h2>
          <button
            className="section-link-btn"
            onClick={() => onNavigateTab('golden')}
          >
            기준 수치 전체 <ChevronRight size={14} />
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

      {/* 4. Department Filter Buttons (부서별 주요 규정) */}
      <section className="hub-clean-section">
        <div className="section-head-bar">
          <h2 className="section-title-clean">
            <Stethoscope size={18} color="var(--primary)" />
            <span>부서별 주요 규정 바로가기</span>
          </h2>
        </div>

        <div className="dept-buttons-grid">
          {departments.map((dept, idx) => (
            <button
              key={idx}
              className={`dept-nav-card ${selectedDept === dept.name ? 'active' : ''}`}
              onClick={() => {
                onSelectDept(dept.name);
                onNavigateTab('handbook');
              }}
            >
              <span className="dept-icon">{dept.icon}</span>
              <div className="dept-labels">
                <span className="dept-title">{dept.name}</span>
                <span className="dept-sub">{dept.count}</span>
              </div>
              <ChevronRight size={16} className="dept-chevron" />
            </button>
          ))}
        </div>
      </section>

      {/* 5. 12 Chapters Table of Contents (12대 챕터 정규 목차) */}
      <section className="hub-clean-section" style={{ marginBottom: 20 }}>
        <div className="section-head-bar">
          <h2 className="section-title-clean">
            <BookOpen size={18} color="var(--primary)" />
            <span>인증기준 12대 챕터 목차</span>
          </h2>
          <button
            className="section-link-btn"
            onClick={() => onNavigateTab('handbook')}
          >
            전체 58개 목록 <ChevronRight size={14} />
          </button>
        </div>

        <div className="chapters-list-clean">
          {CHAPTERS.map((ch) => {
            const chRules = rules.filter(
              (r) => r.code.startsWith(`${ch.id}.`) || (ch.id === 1 && r.code.startsWith('1.'))
            );
            return (
              <div
                key={ch.id}
                className="chapter-clean-item"
                onClick={() => onOpenChapter(ch.id)}
              >
                <span className="ch-index-badge">{ch.badge}</span>
                <div className="ch-item-content">
                  <div className="ch-item-title-row">
                    <span className="ch-item-title">{ch.title}</span>
                    {ch.mustPassCount > 0 && (
                      <span className="ch-item-must-tag">필수 {ch.mustPassCount}</span>
                    )}
                  </div>
                  <span className="ch-item-desc">{ch.subtitle}</span>
                </div>
                <div className="ch-item-tail">
                  <span className="ch-item-count">{chRules.length}개</span>
                  <ChevronRight size={16} color="var(--border)" />
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
