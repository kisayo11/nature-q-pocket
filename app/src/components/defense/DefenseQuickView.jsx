import React, { useState } from 'react';
import { MessageSquare, ArrowRight, Zap } from 'lucide-react';
import {
  DEPARTMENTS,
  DEPARTMENT_QUICK_ANSWERS
} from '../../utils/deptUtils';

export default function DefenseQuickView({ selectedDept = '간호부', onOpenRule }) {
  const [activeDept, setActiveDept] = useState(selectedDept || '간호부');

  const currentQuickAnswers = DEPARTMENT_QUICK_ANSWERS[activeDept] || DEPARTMENT_QUICK_ANSWERS['간호부'];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {/* Department switcher chips */}
      <div
        style={{
          display: 'flex',
          gap: 5,
          overflowX: 'auto',
          padding: '2px 0 4px',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none'
        }}
      >
        {DEPARTMENTS.map((dept) => {
          const isActive = activeDept === dept.name;
          return (
            <button
              key={dept.id}
              onClick={() => setActiveDept(dept.name)}
              style={{
                padding: '6px 11px',
                borderRadius: '16px',
                fontSize: '11.5px',
                fontWeight: isActive ? 800 : 600,
                background: isActive ? 'var(--primary)' : 'var(--surface)',
                color: isActive ? '#fff' : 'var(--text-sub)',
                border: '1px solid',
                borderColor: isActive ? 'var(--primary)' : 'var(--border)',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                boxShadow: isActive ? 'var(--shadow-xs)' : 'none',
                transition: 'all 0.15s ease'
              }}
            >
              <span>{dept.icon}</span>
              <span>{dept.name}</span>
              {selectedDept === dept.name && (
                <span style={{
                  fontSize: '9px',
                  padding: '1px 4px',
                  borderRadius: '3px',
                  background: isActive ? 'rgba(255,255,255,0.25)' : 'var(--border)',
                  color: isActive ? '#fff' : 'var(--text-muted)'
                }}>
                  내부서
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Quick Answer Cards Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '10px'
        }}
      >
        {currentQuickAnswers.map((item, idx) => (
          <div
            key={idx}
            className={`quick-answer-card border-${item.color}`}
            onClick={() => onOpenRule && onOpenRule(item.code)}
            style={{
              minWidth: 0,
              maxWidth: 'none',
              background: 'var(--surface)',
              borderRadius: 'var(--radius-md)',
              padding: '12px 14px',
              border: '1px solid var(--border)',
              boxShadow: 'var(--shadow-xs)',
              display: 'flex',
              flexDirection: 'column',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
              <span style={{ fontSize: '10.5px', fontWeight: 800, color: 'var(--primary)' }}>
                규정 {item.code}
              </span>
              <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 600 }}>
                {activeDept} 즉답 #{idx + 1}
              </span>
            </div>

            <h3 style={{ fontSize: '13.5px', fontWeight: 800, color: 'var(--text-main)', margin: '0 0 6px', lineHeight: 1.35 }}>
              Q. {item.title}
            </h3>

            <div style={{
              background: 'linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%)',
              border: '1px solid #a7f3d0',
              padding: '9px 11px',
              borderRadius: '8px',
              fontSize: '12.5px',
              color: '#064e3b',
              fontWeight: 700,
              lineHeight: 1.5,
              marginBottom: '8px'
            }}>
              "{item.answer}"
            </div>

            <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '3px', fontSize: '10.5px', fontWeight: 700, color: 'var(--primary)' }}>
              <span>규정 전문 보기</span>
              <ArrowRight size={11} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
