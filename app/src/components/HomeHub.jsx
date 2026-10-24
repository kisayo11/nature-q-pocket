import React from 'react';
import {
  BookOpen, ChevronRight, ShieldCheck, Stethoscope,
  ShieldAlert, Zap, Clock, Award, Calculator
} from 'lucide-react';
import {
  DEPARTMENTS,
  getRulesByDept
} from '../utils/deptUtils';

export default function HomeHub({
  rules = [],
  checkedMustPass = {},
  selectedDept = '간호부',
  onSelectDept,
  onNavigateTab,
  onOpenRule,
  onOpenMustPass
}) {
  const mustPassRules = rules.filter((r) => r.isMustPass);
  const mustPassTotal = mustPassRules.length || 10;
  const mustPassCheckedCount = mustPassRules.filter((r) => checkedMustPass[r.code]).length;
  const masteryRate = Math.round((mustPassCheckedCount / mustPassTotal) * 100);

  return (
    <div className="home-hub-clean-wrap" style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '880px', margin: '0 auto', width: '100%' }}>
      {/* 1. Integrated Hero Card (소속 부서 + 10대 필수 달성도 + 인쇄본 링크) */}
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

        {/* Direct Must-Pass Hotline Banner Button */}
        <button
          onClick={() => {
            if (onOpenMustPass) onOpenMustPass();
            else onNavigateTab('handbook');
          }}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '11px 14px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #fff1f2 0%, #ffe4e6 100%)',
            border: '1.5px solid #fecdd3',
            cursor: 'pointer',
            color: '#9f1239',
            transition: 'all 0.15s ease'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '18px' }}>🚨</span>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '13px', fontWeight: 800, color: '#e11d48' }}>
                10대 필수 규정 핫라인 (원클릭 모드)
              </div>
              <div style={{ fontSize: '11px', color: '#9f1239', marginTop: '1px' }}>
                불인증 직결 핵심 10대 규정만 모아서 보기
              </div>
            </div>
          </div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '3px',
            fontSize: '11px',
            fontWeight: 800,
            background: '#fff',
            color: '#e11d48',
            padding: '4px 8px',
            borderRadius: '6px',
            border: '1px solid #fda4af'
          }}>
            <span>열람</span>
            <ChevronRight size={13} />
          </div>
        </button>

        {/* Essential Shortcuts Grid (전직원 공통 15대 + 자위소방대) */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
          <button
            onClick={() => onNavigateTab('common')}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '10px 12px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%)',
              border: '1.5px solid #a7f3d0',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'all 0.15s ease'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '16px' }}>⭐</span>
              <div>
                <div style={{ fontSize: '12px', fontWeight: 900, color: '#047857' }}>
                  전직원 15대 필수 수칙
                </div>
                <div style={{ fontSize: '10px', color: '#065f46', marginTop: '1px' }}>
                  조사관 질문 1초 즉답
                </div>
              </div>
            </div>
            <ChevronRight size={13} color="#047857" />
          </button>

          <button
            onClick={() => onNavigateTab('brigade')}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '10px 12px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%)',
              border: '1.5px solid #fed7aa',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'all 0.15s ease'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '16px' }}>🚒</span>
              <div>
                <div style={{ fontSize: '12px', fontWeight: 900, color: '#c2410c' }}>
                  내 자위소방대 역할
                </div>
                <div style={{ fontSize: '10px', color: '#9a3412', marginTop: '1px' }}>
                  주간 5대팀 & 야간 2대축
                </div>
              </div>
            </div>
            <ChevronRight size={13} color="#c2410c" />
          </button>
        </div>

        {/* Integrated Printed Handbook Link Button */}
        <a
          href="/nature_handbook_print.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="hero-handbook-link"
        >
          <div className="hhl-left">
            <BookOpen size={16} className="hhl-icon" />
            <div className="hhl-text">
              <span className="hhl-title">인쇄용 요약 핸드북 소책자 (74P)</span>
              <span className="hhl-sub">원내 실물 배포본 전자책 전체 페이지 열람</span>
            </div>
          </div>
          <ChevronRight size={16} className="hhl-arrow" />
        </a>
      </section>

      {/* 2. 4-Grid Core Action Shortcuts (핵심 4대 기능 런처) */}
      <section className="hub-core-actions-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '10px' }}>
        <div
          className="hub-core-card"
          onClick={() => onNavigateTab('inspection')}
          style={{ cursor: 'pointer', padding: '13px 14px' }}
        >
          <div className="hcc-icon" style={{ background: '#ecfdf5', color: '#059669', width: '38px', height: '38px' }}>
            <Zap size={22} />
          </div>
          <div className="hcc-info">
            <strong className="hcc-title" style={{ fontSize: '13.5px' }}>실사 조사대응</strong>
            <span className="hcc-sub" style={{ fontSize: '11px' }}>3초 구두답변 & Tracer</span>
          </div>
        </div>

        <div
          className="hub-core-card"
          onClick={() => onNavigateTab('golden')}
          style={{ cursor: 'pointer', padding: '13px 14px' }}
        >
          <div className="hcc-icon" style={{ background: '#eff6ff', color: '#2563eb', width: '38px', height: '38px' }}>
            <Clock size={22} />
          </div>
          <div className="hcc-info">
            <strong className="hcc-title" style={{ fontSize: '13.5px' }}>기준수치·계산기</strong>
            <span className="hcc-sub" style={{ fontSize: '11px' }}>골든넘버 & 낙상·욕창</span>
          </div>
        </div>

        <div
          className="hub-core-card"
          onClick={() => onNavigateTab('quiz')}
          style={{ cursor: 'pointer', padding: '13px 14px' }}
        >
          <div className="hcc-icon" style={{ background: '#fffbeb', color: '#d97706', width: '38px', height: '38px' }}>
            <Award size={22} />
          </div>
          <div className="hcc-info">
            <strong className="hcc-title" style={{ fontSize: '13.5px' }}>실전 모의퀴즈</strong>
            <span className="hcc-sub" style={{ fontSize: '11px' }}>60문항 암기카드 & 복습</span>
          </div>
        </div>

        <div
          className="hub-core-card"
          onClick={() => onNavigateTab('handbook')}
          style={{ cursor: 'pointer', padding: '13px 14px' }}
        >
          <div className="hcc-icon" style={{ background: '#fdf4ff', color: '#9333ea', width: '38px', height: '38px' }}>
            <BookOpen size={22} />
          </div>
          <div className="hcc-info">
            <strong className="hcc-title" style={{ fontSize: '13.5px' }}>규정집 전체</strong>
            <span className="hcc-sub" style={{ fontSize: '11px' }}>12개 챕터 58규정 원문</span>
          </div>
        </div>
      </section>

      {/* 3. Department Filter Chips (부서별 주요 규정 바로가기) */}
      <section className="hub-section-block">
        <div className="hub-sec-header" style={{ marginBottom: '10px' }}>
          <div className="hub-sec-title">
            <Stethoscope size={17} color="var(--primary)" />
            <span>부서별 주요 규정 바로가기</span>
          </div>
          <span className="hub-sec-hint">선택 시 해당 부서 규정만 필터링</span>
        </div>

        <div className="dept-chips-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: 8 }}>
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
                style={{ padding: '11px 8px' }}
              >
                <span className="dcb-icon">{dept.icon}</span>
                <span className="dcb-name">{dept.name}</span>
                <span className="dcb-count">{ruleCount}개</span>
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
}
