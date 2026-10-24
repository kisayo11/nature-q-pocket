import React, { useState } from 'react';
import {
  Zap, CheckCircle2, AlertTriangle, Droplets, HeartPulse,
  Flame, ShieldCheck, Stethoscope, Clock, BookOpen, ArrowRight, UserCheck
} from 'lucide-react';
import tracerScenarios from '../../data/tracerScenarios.json';

const ICON_MAP = {
  AlertTriangle,
  Droplets,
  HeartPulse,
  Flame,
  ShieldCheck,
  Stethoscope
};

const COLOR_MAP = {
  amber: { bg: '#fffbeb', border: '#fde68a', text: '#b45309', badge: '#d97706' },
  blue: { bg: '#eff6ff', border: '#bfdbfe', text: '#1d4ed8', badge: '#2563eb' },
  rose: { bg: '#fff1f2', border: '#fecdd3', text: '#be123c', badge: '#e11d48' },
  red: { bg: '#fef2f2', border: '#fecaca', text: '#b91c1c', badge: '#dc2626' },
  teal: { bg: '#f0fdfa', border: '#99f6e4', text: '#0f766e', badge: '#0d9488' },
  indigo: { bg: '#eef2ff', border: '#c7d2fe', text: '#4338ca', badge: '#4f46e5' }
};

export default function DefenseTracerView({ onOpenRule }) {
  const [activeScenarioId, setActiveScenarioId] = useState('fall');

  const activeScenario = tracerScenarios.find((s) => s.id === activeScenarioId) || tracerScenarios[0];
  const IconComponent = ICON_MAP[activeScenario.icon] || AlertTriangle;
  const theme = COLOR_MAP[activeScenario.color] || COLOR_MAP.amber;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      {/* 1. Scenario Selector Chips */}
      <div
        style={{
          display: 'flex',
          gap: 6,
          overflowX: 'auto',
          padding: '2px 0 6px',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none'
        }}
      >
        {tracerScenarios.map((s) => {
          const TabIcon = ICON_MAP[s.icon] || AlertTriangle;
          const isActive = s.id === activeScenarioId;
          return (
            <button
              key={s.id}
              onClick={() => setActiveScenarioId(s.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 13px',
                borderRadius: '20px',
                border: '1px solid',
                borderColor: isActive ? 'var(--primary)' : 'var(--border)',
                background: isActive ? 'var(--primary)' : 'var(--surface)',
                color: isActive ? '#fff' : 'var(--text-sub)',
                fontSize: '12px',
                fontWeight: isActive ? 800 : 600,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                boxShadow: isActive ? 'var(--shadow-xs)' : 'none',
                transition: 'all 0.15s ease'
              }}
            >
              <TabIcon size={14} color={isActive ? '#fff' : 'var(--text-muted)'} />
              <span>{s.title}</span>
            </button>
          );
        })}
      </div>

      {/* 2. Top Scenario Overview Card */}
      <div
        style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)',
          padding: '16px',
          boxShadow: 'var(--shadow-xs)',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '10px',
              background: theme.bg,
              border: `1px solid ${theme.border}`,
              color: theme.text,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}
          >
            <IconComponent size={22} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
              <span
                style={{
                  fontSize: '10.5px',
                  fontWeight: 900,
                  color: '#fff',
                  background: theme.badge,
                  padding: '2px 7px',
                  borderRadius: '4px'
                }}
              >
                {activeScenario.badge}
              </span>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 700 }}>
                규정 {activeScenario.relatedRule} 연계
              </span>
            </div>
            <h2 style={{ fontSize: '16px', fontWeight: 900, color: 'var(--text-main)', margin: 0 }}>
              {activeScenario.title}
            </h2>
          </div>
        </div>

        {/* Surveyor Sudden Question Box */}
        {activeScenario.surveyorQuestion && (
          <div
            style={{
              background: 'linear-gradient(135deg, #fef2f2 0%, #fff1f2 100%)',
              border: '1px solid #fecdd3',
              borderRadius: '10px',
              padding: '12px 14px',
              display: 'flex',
              flexDirection: 'column',
              gap: '4px'
            }}
          >
            <div style={{ fontSize: '11px', fontWeight: 900, color: '#be123c', display: 'flex', alignItems: 'center', gap: '5px' }}>
              <AlertTriangle size={13} color="#e11d48" />
              <span>조사위원 돌발 현장 질문 (상황 부여)</span>
            </div>
            <div style={{ fontSize: '13px', fontWeight: 800, color: '#881337', lineHeight: 1.5 }}>
              "{activeScenario.surveyorQuestion}"
            </div>
          </div>
        )}
      </div>

      {/* 3. Action Steps Timeline Card */}
      <div
        style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)',
          padding: '16px',
          boxShadow: 'var(--shadow-xs)',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}
      >
        <div
          style={{
            fontSize: '13.5px',
            fontWeight: 800,
            color: 'var(--text-main)',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <CheckCircle2 size={16} color="var(--primary)" />
          <span>실사 행동 단계별 타임라인 (Action Steps)</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {activeScenario.steps && activeScenario.steps.map((st, idx) => (
            <div
              key={idx}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
                padding: '11px 13px',
                borderRadius: 'var(--radius-md)',
                background: 'var(--surface-raised)',
                border: '1px solid var(--border-light)'
              }}
            >
              <div
                style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  background: 'var(--primary)',
                  color: '#fff',
                  fontSize: '11px',
                  fontWeight: 900,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  marginTop: '1px'
                }}
              >
                {idx + 1}
              </div>

              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '3px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '6px' }}>
                  <div style={{ fontSize: '11.5px', fontWeight: 900, color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Clock size={12} />
                    <span>{st.time}</span>
                  </div>
                  <div style={{ fontSize: '11px', fontWeight: 800, background: 'var(--surface)', padding: '2px 7px', borderRadius: '4px', border: '1px solid var(--border)', color: 'var(--text-main)' }}>
                    담당: {st.actor}
                  </div>
                </div>

                <div style={{ fontSize: '12.5px', fontWeight: 700, color: 'var(--text-main)', lineHeight: 1.5, marginTop: '2px' }}>
                  {st.action}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Golden Key Tip Card */}
      {activeScenario.keyTip && (
        <div
          style={{
            background: '#fffbeb',
            border: '1px solid #fde68a',
            borderRadius: 'var(--radius-lg)',
            padding: '14px 16px',
            boxShadow: 'var(--shadow-xs)',
            display: 'flex',
            flexDirection: 'column',
            gap: '6px'
          }}
        >
          <div style={{ fontSize: '12.5px', fontWeight: 900, color: '#92400e', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Zap size={14} color="#d97706" />
            <span>조사위원 감점 방지 꿀팁 (합격 포인트)</span>
          </div>
          <div style={{ fontSize: '12.5px', color: '#78350f', lineHeight: 1.55, fontWeight: 700 }}>
            {activeScenario.keyTip}
          </div>
        </div>
      )}

      {/* 5. Related Rule Link */}
      {activeScenario.relatedRule && (
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button
            onClick={() => onOpenRule && onOpenRule(activeScenario.relatedRule)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '10px 14px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              color: 'var(--primary)',
              fontSize: '12px',
              fontWeight: 800,
              cursor: 'pointer',
              boxShadow: 'var(--shadow-xs)',
              transition: 'all 0.15s ease'
            }}
          >
            <BookOpen size={14} />
            <span>관련 규정 [{activeScenario.relatedRule}] 전문 열람하기</span>
            <ArrowRight size={13} />
          </button>
        </div>
      )}
    </div>
  );
}
