import React, { useState, useEffect } from 'react';
import {
  ShieldCheck, Sparkles, Flame, MessageSquare, Zap,
  Users, ArrowRight, ShieldAlert, CheckCircle2
} from 'lucide-react';

import DefenseCommonView from './defense/DefenseCommonView';
import DefenseBrigadeView from './defense/DefenseBrigadeView';
import DefenseQuickView from './defense/DefenseQuickView';
import DefenseTracerView from './defense/DefenseTracerView';

import fireBrigadeData from '../data/fireBrigadeData.json';
import { DEPARTMENT_QUICK_ANSWERS } from '../utils/deptUtils';

export default function InspectionDefenseView({
  selectedDept = '간호부',
  onOpenRule,
  initialSubTab = 'common'
}) {
  // 4 Main SubTabs: 'common' | 'brigade' | 'quick' | 'tracer'
  const [activeSubTab, setActiveSubTab] = useState(initialSubTab || 'common');
  const [userDept, setUserDept] = useState(selectedDept || '간호부');

  useEffect(() => {
    if (initialSubTab) setActiveSubTab(initialSubTab);
  }, [initialSubTab]);

  useEffect(() => {
    if (selectedDept) setUserDept(selectedDept);
  }, [selectedDept]);

  // Dept Fast Pass quick summary
  const brigadeInfo = fireBrigadeData.deptLookup[userDept] || fireBrigadeData.deptLookup['간호부'];
  const quickCount = (DEPARTMENT_QUICK_ANSWERS[userDept] || []).length;

  return (
    <div className="inspection-view-wrap" style={{ display: 'flex', flexDirection: 'column', gap: '14px', maxWidth: '1060px', margin: '0 auto', width: '100%' }}>
      {/* 1. Header & Department Fast Pass Banner */}
      <div
        style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)',
          padding: '14px 16px',
          boxShadow: 'var(--shadow-xs)',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
          <div>
            <h1 style={{ fontSize: '17px', fontWeight: 900, color: 'var(--text-main)', letterSpacing: '-0.3px', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShieldCheck size={21} color="var(--primary)" />
              <span>현장 실사 완벽 대응 (말하기 & 행동하기)</span>
            </h1>
            <p style={{ fontSize: '11.5px', color: 'var(--text-muted)', margin: '3px 0 0' }}>
              전직원 17대 필수 수칙, 자위소방대 편성(규정 10.6), 부서별 3초 즉답 및 6대 돌발상황 대비 허브
            </p>
          </div>
          <span style={{
            fontSize: '11px',
            fontWeight: 800,
            background: 'var(--primary-light)',
            color: 'var(--primary)',
            padding: '3px 10px',
            borderRadius: '16px',
            border: '1px solid hsla(168, 80%, 28%, 0.15)'
          }}>
            실사 방어 전용 허브
          </span>
        </div>

        {/* My Department Fast Pass Mini Ribbon */}
        <div
          style={{
            background: 'var(--surface-raised)',
            border: '1px solid var(--border)',
            borderRadius: '10px',
            padding: '8px 12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '8px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px' }}>
            <span style={{ fontWeight: 800, color: 'var(--text-main)' }}>내 부서: <strong>[{userDept}]</strong></span>
            <span style={{ color: 'var(--border)' }}>|</span>
            <span style={{ color: '#dc2626', fontWeight: 800 }}>🚒 소방: {brigadeInfo.teamName}</span>
            <span style={{ color: 'var(--border)' }}>|</span>
            <span style={{ color: 'var(--primary)', fontWeight: 800 }}>💬 3초 즉답: {quickCount}개</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <button
              onClick={() => setActiveSubTab('brigade')}
              style={{
                fontSize: '11px',
                fontWeight: 800,
                color: '#dc2626',
                background: '#fff',
                border: '1px solid #fca5a5',
                padding: '3px 8px',
                borderRadius: '6px',
                cursor: 'pointer'
              }}
            >
              내 소방역할 보기 ➔
            </button>
            <button
              onClick={() => setActiveSubTab('quick')}
              style={{
                fontSize: '11px',
                fontWeight: 800,
                color: 'var(--primary)',
                background: '#fff',
                border: '1px solid var(--primary-light)',
                padding: '3px 8px',
                borderRadius: '6px',
                cursor: 'pointer'
              }}
            >
              내 즉답 보기 ➔
            </button>
          </div>
        </div>

        {/* 4-Way Segmented Control */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
            gap: '6px',
            background: 'var(--surface-raised)',
            padding: '4px',
            borderRadius: '12px',
            border: '1px solid var(--border)'
          }}
        >
          <button
            onClick={() => setActiveSubTab('common')}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              padding: '9px 10px',
              borderRadius: '9px',
              border: 'none',
              background: activeSubTab === 'common' ? 'var(--surface)' : 'transparent',
              color: activeSubTab === 'common' ? 'var(--primary)' : 'var(--text-muted)',
              fontSize: '12.5px',
              fontWeight: activeSubTab === 'common' ? 900 : 600,
              cursor: 'pointer',
              boxShadow: activeSubTab === 'common' ? 'var(--shadow-sm)' : 'none',
              transition: 'all 0.15s ease'
            }}
          >
            <Sparkles size={15} />
            <span>전직원 공통 (17대)</span>
          </button>

          <button
            onClick={() => setActiveSubTab('brigade')}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              padding: '9px 10px',
              borderRadius: '9px',
              border: 'none',
              background: activeSubTab === 'brigade' ? 'var(--surface)' : 'transparent',
              color: activeSubTab === 'brigade' ? '#e11d48' : 'var(--text-muted)',
              fontSize: '12.5px',
              fontWeight: activeSubTab === 'brigade' ? 900 : 600,
              cursor: 'pointer',
              boxShadow: activeSubTab === 'brigade' ? 'var(--shadow-sm)' : 'none',
              transition: 'all 0.15s ease'
            }}
          >
            <Flame size={15} />
            <span>내 자위소방대 역할</span>
          </button>

          <button
            onClick={() => setActiveSubTab('quick')}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              padding: '9px 10px',
              borderRadius: '9px',
              border: 'none',
              background: activeSubTab === 'quick' ? 'var(--surface)' : 'transparent',
              color: activeSubTab === 'quick' ? 'var(--primary)' : 'var(--text-muted)',
              fontSize: '12.5px',
              fontWeight: activeSubTab === 'quick' ? 800 : 600,
              cursor: 'pointer',
              boxShadow: activeSubTab === 'quick' ? 'var(--shadow-sm)' : 'none',
              transition: 'all 0.15s ease'
            }}
          >
            <MessageSquare size={15} />
            <span>부서별 3초 즉답</span>
          </button>

          <button
            onClick={() => setActiveSubTab('tracer')}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              padding: '9px 10px',
              borderRadius: '9px',
              border: 'none',
              background: activeSubTab === 'tracer' ? 'var(--surface)' : 'transparent',
              color: activeSubTab === 'tracer' ? 'var(--primary)' : 'var(--text-muted)',
              fontSize: '12.5px',
              fontWeight: activeSubTab === 'tracer' ? 800 : 600,
              cursor: 'pointer',
              boxShadow: activeSubTab === 'tracer' ? 'var(--shadow-sm)' : 'none',
              transition: 'all 0.15s ease'
            }}
          >
            <Zap size={15} />
            <span>돌발 추적조사 (6대)</span>
          </button>
        </div>
      </div>

      {/* 2. SubTab Views Container */}
      {activeSubTab === 'common' && (
        <DefenseCommonView onOpenRule={onOpenRule} />
      )}

      {activeSubTab === 'brigade' && (
        <DefenseBrigadeView selectedDept={userDept} onOpenRule={onOpenRule} />
      )}

      {activeSubTab === 'quick' && (
        <DefenseQuickView selectedDept={userDept} onOpenRule={onOpenRule} />
      )}

      {activeSubTab === 'tracer' && (
        <DefenseTracerView onOpenRule={onOpenRule} />
      )}
    </div>
  );
}
