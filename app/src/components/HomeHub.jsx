import React, { useState, useEffect } from 'react';
import {
  ShieldAlert, HeartPulse, Flame, Droplets, BookOpen,
  ArrowRight, CheckCircle2, Clock, ChevronRight,
  ShieldCheck, Stethoscope, HelpCircle, FileText
} from 'lucide-react';
import {
  DEPARTMENTS,
  DEPARTMENT_QUICK_ANSWERS,
  getRulesByDept
} from '../utils/deptUtils';
import TracerScenariosCard from './TracerScenariosCard';

export default function HomeHub({
  rules = [],
  checkedMustPass = {},
  selectedDept = '간호부',
  onSelectDept,
  onNavigateTab,
  onOpenRule,
  onOpenEmergency,
  onOpenMustPass
}) {
  const mustPassRules = rules.filter((r) => r.isMustPass);
  const mustPassTotal = mustPassRules.length || 8;
  const mustPassCheckedCount = mustPassRules.filter((r) => checkedMustPass[r.code]).length;
  const masteryRate = Math.round((mustPassCheckedCount / mustPassTotal) * 100);

  // Active Department for 3-Second Quick Answers (기본값: 내 소속 부서)
  const [activeAnswerDept, setActiveAnswerDept] = useState(selectedDept || '간호부');

  useEffect(() => {
    if (selectedDept) {
      setActiveAnswerDept(selectedDept);
    }
  }, [selectedDept]);

  const currentQuickAnswers = DEPARTMENT_QUICK_ANSWERS[activeAnswerDept] || DEPARTMENT_QUICK_ANSWERS['간호부'];

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
              <span>★ 10대 탈락방지 필수 규정 (Must-Pass)</span>
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

      {/* P1: 🚨 10대 필수 탈락방지 규정 핫라인 배너 */}
      <section className="hub-section-block" style={{ marginTop: '8px', marginBottom: '8px' }}>
        <div
          style={{
            background: 'linear-gradient(135deg, #fff1f2 0%, #ffe4e6 100%)',
            border: '1.5px solid #fda4af',
            borderRadius: '14px',
            padding: '13px 15px',
            boxShadow: '0 2px 8px rgba(225, 29, 72, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 12,
            cursor: 'pointer',
            transition: 'transform 0.15s ease'
          }}
          onClick={() => {
            if (onOpenMustPass) onOpenMustPass();
            else onNavigateTab('handbook');
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 38,
              height: 38,
              borderRadius: '10px',
              background: '#e11d48',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '19px',
              flexShrink: 0,
              boxShadow: '0 2px 6px rgba(225,29,72,0.3)'
            }}>
              🚨
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: '10.5px', fontWeight: 800, color: '#fff', background: '#e11d48', padding: '1px 6px', borderRadius: '4px' }}>
                  탈락 방지
                </span>
                <span style={{ fontSize: '13.5px', fontWeight: 800, color: '#9f1239' }}>
                  10대 필수 규정 100% 합격 핫라인
                </span>
              </div>
              <div style={{ fontSize: '11px', color: '#881337', marginTop: 2 }}>
                환자안전·화재·CPR·보호대 등 불인증 직결 10개 핵심 규정 집중 점검
              </div>
            </div>
          </div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 3,
            background: '#fff',
            color: '#e11d48',
            padding: '5px 9px',
            borderRadius: '8px',
            fontSize: '11px',
            fontWeight: 800,
            border: '1px solid #fecdd3',
            flexShrink: 0
          }}>
            <span>원클릭</span>
            <ChevronRight size={13} />
          </div>
        </div>
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

      {/* 3. Essential 3-Second Oral Answers (부서별 맞춤 스와이프 카드) */}
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

        {/* 6대 부서 구두 답변 탭 스위처 */}
        <div style={{ display: 'flex', gap: 6, overflowX: 'auto', padding: '0 0 10px', scrollbarWidth: 'none' }}>
          {DEPARTMENTS.map((dept) => {
            const isActive = activeAnswerDept === dept.name;
            return (
              <button
                key={dept.id}
                onClick={() => setActiveAnswerDept(dept.name)}
                style={{
                  padding: '6px 11px',
                  borderRadius: '16px',
                  fontSize: '11.5px',
                  fontWeight: isActive ? 800 : 600,
                  background: isActive ? 'var(--primary)' : 'var(--surface-raised)',
                  color: isActive ? '#fff' : 'var(--text-muted)',
                  border: '1px solid',
                  borderColor: isActive ? 'var(--primary)' : 'var(--border)',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                  transition: 'all 0.15s ease'
                }}
              >
                <span>{dept.icon}</span>
                <span>{dept.name}</span>
                {selectedDept === dept.name && (
                  <span style={{ fontSize: '9px', padding: '1px 4px', borderRadius: '4px', background: isActive ? 'rgba(255,255,255,0.25)' : 'var(--border)', color: isActive ? '#fff' : 'var(--text-muted)' }}>내부서</span>
                )}
              </button>
            );
          })}
        </div>

        <div className="quick-answers-scroll">
          {currentQuickAnswers.map((item, idx) => (
            <div
              key={idx}
              className={`quick-answer-card border-${item.color}`}
              onClick={() => onOpenRule(item.code)}
            >
              <div className="qac-top">
                <span className="qac-code">규정 {item.code}</span>
                <span className="qac-tag">{activeAnswerDept} 답변</span>
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

      {/* P0: 5대(6대) 돌발 상황별 Tracer(추적조사) 현장 행동시나리오 인터랙티브 카드 */}
      <TracerScenariosCard onOpenRule={onOpenRule} />

      {/* 4. Department Filter Chips (실제 규정 개수 실시간 연동) */}
      <section className="hub-section-block">
        <div className="hub-sec-header">
          <div className="hub-sec-title">
            <Stethoscope size={17} color="var(--primary)" />
            <span>부서별 주요 규정 바로가기</span>
          </div>
        </div>

        <div className="dept-chips-grid">
          {DEPARTMENTS.map((dept, idx) => {
            const ruleCount = getRulesByDept(rules, dept.name).length;
            const isSelected = selectedDept === dept.name;

            return (
              <button
                key={idx}
                className={`dept-chip-btn ${isSelected ? 'active' : ''}`}
                onClick={() => {
                  onSelectDept(dept.name);
                  onNavigateTab('handbook');
                }}
              >
                <span className="dcb-icon">{dept.icon}</span>
                <span className="dcb-name">{dept.name}</span>
                <span className="dcb-count">{ruleCount}개</span>
              </button>
            );
          })}
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
