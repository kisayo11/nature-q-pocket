import React, { useState } from 'react';
import {
  Zap, CheckCircle2, AlertTriangle, Droplets, HeartPulse,
  Flame, ShieldCheck, Stethoscope, Users, BookOpen, ArrowRight
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

export default function DefenseTracerView({ onOpenRule }) {
  const [activeScenarioId, setActiveScenarioId] = useState('fall');

  const activeScenario = tracerScenarios.find((s) => s.id === activeScenarioId) || tracerScenarios[0];
  const IconComponent = ICON_MAP[activeScenario.icon] || AlertTriangle;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      {/* Scenario Selector Tabs */}
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
                padding: '7px 12px',
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

      {/* Active Scenario Detail Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          gap: '14px',
          alignItems: 'start'
        }}
      >
        {/* Left: Banner & Timeline Steps */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div
            style={{
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-lg)',
              padding: '16px',
              boxShadow: 'var(--shadow-xs)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '10px',
                  background: 'var(--primary-light)',
                  color: 'var(--primary)',
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
                      fontWeight: 800,
                      color: '#fff',
                      background: 'var(--primary)',
                      padding: '1px 6px',
                      borderRadius: '4px'
                    }}
                  >
                    {activeScenario.badge}
                  </span>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>
                    규정 {activeScenario.relatedRule} 연계
                  </span>
                </div>
                <h2 style={{ fontSize: '15px', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
                  {activeScenario.title}
                </h2>
              </div>
            </div>
          </div>

          {/* Action Steps Timeline */}
          <div
            style={{
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-lg)',
              padding: '16px',
              boxShadow: 'var(--shadow-xs)'
            }}
          >
            <div
              style={{
                fontSize: '13px',
                fontWeight: 800,
                color: 'var(--text-main)',
                marginBottom: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <CheckCircle2 size={16} color="var(--primary)" />
              <span>실사 행동 단계별 타임라인 (Action Steps)</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {activeScenario.steps.map((st, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '10px',
                    padding: '10px 12px',
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--surface-raised)',
                    border: '1px solid var(--border-light)'
                  }}
                >
                  <div
                    style={{
                      width: '22px',
                      height: '22px',
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
                    {st.step}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '12.5px', fontWeight: 800, color: 'var(--text-main)', marginBottom: '2px' }}>
                      {st.action}
                    </div>
                    <div style={{ fontSize: '11.5px', color: 'var(--text-sub)', lineHeight: 1.45 }}>
                      {st.detail}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Department Roles & Surveyor Traps */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div
            style={{
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-lg)',
              padding: '16px',
              boxShadow: 'var(--shadow-xs)'
            }}
          >
            <div
              style={{
                fontSize: '13px',
                fontWeight: 800,
                color: 'var(--text-main)',
                marginBottom: '10px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Users size={16} color="var(--primary)" />
              <span>부서별 즉각 행동 분담 (누가 무엇을 하는가)</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {Object.entries(activeScenario.deptRoles).map(([deptKey, roleText], idx) => (
                <div
                  key={idx}
                  style={{
                    padding: '8px 10px',
                    borderRadius: 'var(--radius-sm)',
                    background: 'var(--surface-raised)',
                    border: '1px solid var(--border-light)',
                    fontSize: '12px'
                  }}
                >
                  <strong style={{ color: 'var(--primary)', marginRight: '6px' }}>
                    [{deptKey}]
                  </strong>
                  <span style={{ color: 'var(--text-main)', fontWeight: 600 }}>
                    {roleText}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Surveyor Traps */}
          <div
            style={{
              background: '#fff1f2',
              border: '1px solid #fecdd3',
              borderRadius: 'var(--radius-lg)',
              padding: '16px',
              boxShadow: 'var(--shadow-xs)'
            }}
          >
            <div
              style={{
                fontSize: '13px',
                fontWeight: 800,
                color: '#9f1239',
                marginBottom: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <AlertTriangle size={16} color="#e11d48" />
              <span>조사위원 감점 함정 & 금기 행동</span>
            </div>

            <div style={{ fontSize: '12px', color: '#881337', lineHeight: 1.55, fontWeight: 600 }}>
              {activeScenario.surveyorTraps}
            </div>
          </div>

          {/* Related Rule Button */}
          {activeScenario.relatedRule && (
            <button
              onClick={() => onOpenRule && onOpenRule(activeScenario.relatedRule)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                padding: '11px 16px',
                borderRadius: 'var(--radius-md)',
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                color: 'var(--primary)',
                fontSize: '12.5px',
                fontWeight: 800,
                cursor: 'pointer',
                boxShadow: 'var(--shadow-xs)',
                transition: 'all 0.15s ease'
              }}
            >
              <BookOpen size={15} />
              <span>관련 규정 [{activeScenario.relatedRule}] 전문 열람하기</span>
              <ArrowRight size={14} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
