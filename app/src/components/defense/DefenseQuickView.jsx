import React, { useState } from 'react';
import { MessageSquare, ArrowRight } from 'lucide-react';
import {
  DEPARTMENTS,
  DEPARTMENT_QUICK_ANSWERS
} from '../../utils/deptUtils';

export default function DefenseQuickView({ selectedDept = '간호부', onOpenRule }) {
  const [activeDept, setActiveDept] = useState(selectedDept || '간호부');

  const currentQuickAnswers = DEPARTMENT_QUICK_ANSWERS[activeDept] || DEPARTMENT_QUICK_ANSWERS['간호부'];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      {/* Department switcher chips */}
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
        {DEPARTMENTS.map((dept) => {
          const isActive = activeDept === dept.name;
          return (
            <button
              key={dept.id}
              onClick={() => setActiveDept(dept.name)}
              style={{
                padding: '7px 12px',
                borderRadius: '18px',
                fontSize: '12px',
                fontWeight: isActive ? 800 : 600,
                background: isActive ? 'var(--primary)' : 'var(--surface)',
                color: isActive ? '#fff' : 'var(--text-sub)',
                border: '1px solid',
                borderColor: isActive ? 'var(--primary)' : 'var(--border)',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                display: 'flex',
                alignItems: 'center',
                gap: 5,
                boxShadow: isActive ? 'var(--shadow-xs)' : 'none',
                transition: 'all 0.15s ease'
              }}
            >
              <span>{dept.icon}</span>
              <span>{dept.name}</span>
              {selectedDept === dept.name && (
                <span style={{
                  fontSize: '9px',
                  padding: '1px 5px',
                  borderRadius: '4px',
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
          gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))',
          gap: '12px'
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
              padding: '14px',
              border: '1px solid var(--border)',
              boxShadow: 'var(--shadow-xs)',
              display: 'flex',
              flexDirection: 'column',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--primary)' }}>
                규정 {item.code}
              </span>
              <span style={{ fontSize: '10.5px', color: 'var(--text-muted)', fontWeight: 600 }}>
                {activeDept} 즉답
              </span>
            </div>
            <h3 style={{ fontSize: '14px', fontWeight: 800, color: 'var(--text-main)', margin: '0 0 6px' }}>
              {item.title}
            </h3>
            <div style={{
              background: 'var(--surface-raised)',
              padding: '10px 12px',
              borderRadius: 'var(--radius-sm)',
              fontSize: '12.5px',
              color: 'var(--text-main)',
              fontWeight: 600,
              lineHeight: 1.5,
              marginBottom: '10px'
            }}>
              "{item.answer}"
            </div>
            <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '11.5px', fontWeight: 700, color: 'var(--primary)' }}>
              <span>상세 규정 전문 열람</span>
              <ArrowRight size={13} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
