import React, { useState, useMemo } from 'react';
import {
  Sparkles, Check, ChevronDown, ChevronUp, ArrowRight,
  Zap, Search, Eye, EyeOff, HelpCircle
} from 'lucide-react';
import allStaffChecklist from '../../data/allStaffChecklist.json';

const DOMAIN_FILTERS = [
  '전체',
  '화재·재난',
  '환자안전',
  '감염관리',
  '직원안전',
  '환자인권',
  '질향상·의무기록'
];

export default function DefenseCommonView({ onOpenRule }) {
  const [selectedDomain, setSelectedDomain] = useState('전체');
  const [searchQuery, setSearchQuery] = useState('');
  const [isBlindMode, setIsBlindMode] = useState(false);
  const [expandedCards, setExpandedCards] = useState({});
  const [revealedAnswers, setRevealedAnswers] = useState({});

  // Memorized state from localStorage
  const [memorizedItems, setMemorizedItems] = useState(() => {
    try {
      const saved = localStorage.getItem('nature_common_memorized');
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      return {};
    }
  });

  const toggleMemorize = (id, e) => {
    if (e && e.stopPropagation) e.stopPropagation();
    setMemorizedItems((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      localStorage.setItem('nature_common_memorized', JSON.stringify(next));
      return next;
    });
  };

  const toggleExpand = (id) => {
    setExpandedCards((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleReveal = (id, e) => {
    if (e && e.stopPropagation) e.stopPropagation();
    setRevealedAnswers((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Filtered & Searched List
  const filteredList = useMemo(() => {
    return allStaffChecklist.filter((item) => {
      const matchDomain = selectedDomain === '전체' || item.domain === selectedDomain;
      if (!matchDomain) return false;

      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      const inQuestion = item.question.toLowerCase().includes(q);
      const inAnswer = item.quickAnswer.toLowerCase().includes(q);
      const inAction = item.keyAction.toLowerCase().includes(q);
      const inRule = item.rule.toLowerCase().includes(q);
      const inBadge = item.badge.toLowerCase().includes(q);
      return inQuestion || inAnswer || inAction || inRule || inBadge;
    });
  }, [selectedDomain, searchQuery]);

  const memorizedCount = Object.values(memorizedItems).filter(Boolean).length;
  const totalCount = allStaffChecklist.length;
  const memorizeRate = Math.round((memorizedCount / totalCount) * 100);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      {/* 1. Control & Filter Panel */}
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
        {/* Top Progress & Title */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '20px' }}>⭐</span>
            <div>
              <h2 style={{ fontSize: '15px', fontWeight: 900, color: 'var(--text-main)', margin: 0 }}>
                조사위원이 병원 누구에게나 묻는 전직원 17대 마스터 수칙
              </h2>
              <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: '2px 0 0' }}>
                행정, 간호, 조무사, 보호사, 치료, 영양, 시설 전원 공통 숙지 리스트
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {/* Blind Mode Toggle Button */}
            <button
              onClick={() => setIsBlindMode((prev) => !prev)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                padding: '6px 11px',
                borderRadius: '8px',
                fontSize: '11.5px',
                fontWeight: 800,
                cursor: 'pointer',
                border: '1px solid',
                borderColor: isBlindMode ? '#8b5cf6' : 'var(--border)',
                background: isBlindMode ? '#f5f3ff' : 'var(--surface-raised)',
                color: isBlindMode ? '#7c3aed' : 'var(--text-sub)',
                transition: 'all 0.15s ease'
              }}
              title="정답을 가려 스스로 암기 테스트를 진행합니다"
            >
              {isBlindMode ? <EyeOff size={14} /> : <Eye size={14} />}
              <span>{isBlindMode ? '답 가리기 ON' : '자가 퀴즈 모드'}</span>
            </button>

            {/* Progress Indicator */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '3px' }}>
              <span style={{ fontSize: '11.5px', fontWeight: 800, color: 'var(--primary)' }}>
                암기 완료: <strong>{memorizedCount}</strong> / {totalCount} ({memorizeRate}%)
              </span>
              <div style={{ width: '85px', height: '7px', background: 'var(--border)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: `${memorizeRate}%`, height: '100%', background: 'var(--primary)', transition: 'width 0.3s ease' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div style={{ position: 'relative', width: '100%' }}>
          <Search size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="수칙 검색 (예: 손위생, 소방, 신체보호대, 낙상, MSDS, 10.3...)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '9px 12px 9px 34px',
              borderRadius: '10px',
              border: '1px solid var(--border)',
              background: 'var(--surface-raised)',
              fontSize: '12.5px',
              color: 'var(--text-main)',
              outline: 'none',
              boxSizing: 'border-box'
            }}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              style={{
                position: 'absolute',
                right: '10px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'transparent',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                fontSize: '12px',
                fontWeight: 800
              }}
            >
              ✕
            </button>
          )}
        </div>

        {/* Domain Filter Pills */}
        <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '2px', scrollbarWidth: 'none' }}>
          {DOMAIN_FILTERS.map((domain) => {
            const count = domain === '전체' ? allStaffChecklist.length : allStaffChecklist.filter(c => c.domain === domain).length;
            const isSelected = selectedDomain === domain;
            return (
              <button
                key={domain}
                onClick={() => setSelectedDomain(domain)}
                style={{
                  padding: '5px 11px',
                  borderRadius: '16px',
                  fontSize: '11.5px',
                  fontWeight: isSelected ? 800 : 600,
                  background: isSelected ? 'var(--primary)' : 'var(--surface-raised)',
                  color: isSelected ? '#fff' : 'var(--text-sub)',
                  border: '1px solid',
                  borderColor: isSelected ? 'var(--primary)' : 'var(--border)',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.15s ease'
                }}
              >
                {domain} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Checklist Cards List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {filteredList.length === 0 ? (
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '30px', textAlign: 'center', color: 'var(--text-muted)' }}>
            검색 결과가 없습니다. 다른 검색어를 입력해보세요.
          </div>
        ) : (
          filteredList.map((item) => {
            const isMemorized = !!memorizedItems[item.id];
            const isExpanded = !!expandedCards[item.id];
            const isAnswerHidden = isBlindMode && !revealedAnswers[item.id];

            return (
              <div
                key={item.id}
                style={{
                  background: 'var(--surface)',
                  border: `1.5px solid ${isMemorized ? 'var(--primary)' : 'var(--border)'}`,
                  borderRadius: 'var(--radius-lg)',
                  padding: '14px 16px',
                  boxShadow: 'var(--shadow-xs)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                  transition: 'all 0.15s ease'
                }}
              >
                {/* Top: Badges & Memorized Toggle */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                    <span style={{
                      fontSize: '10px',
                      fontWeight: 900,
                      background: item.isMustPass ? '#e11d48' : '#059669',
                      color: '#fff',
                      padding: '2px 6px',
                      borderRadius: '4px'
                    }}>
                      {item.badge}
                    </span>
                    <span style={{
                      fontSize: '11px',
                      fontWeight: 700,
                      background: 'var(--surface-raised)',
                      color: 'var(--text-sub)',
                      padding: '2px 8px',
                      borderRadius: '4px',
                      border: '1px solid var(--border)'
                    }}>
                      {item.domain}
                    </span>
                    <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--primary)' }}>
                      규정 {item.rule}
                    </span>
                  </div>

                  <button
                    onClick={(e) => toggleMemorize(item.id, e)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontSize: '11px',
                      fontWeight: 800,
                      padding: '4px 9px',
                      borderRadius: '16px',
                      border: '1px solid',
                      borderColor: isMemorized ? 'var(--primary)' : 'var(--border)',
                      background: isMemorized ? 'var(--primary-light)' : 'transparent',
                      color: isMemorized ? 'var(--primary)' : 'var(--text-muted)',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <Check size={13} strokeWidth={isMemorized ? 3 : 2} />
                    <span>{isMemorized ? '암기 완료' : '외우기 체크'}</span>
                  </button>
                </div>

                {/* Question */}
                <div style={{ fontSize: '14px', fontWeight: 800, color: 'var(--text-main)', lineHeight: 1.4 }}>
                  Q. {item.question}
                </div>

                {/* 1초 모범 답변 (Prominent Box with Blind Mode Support) */}
                <div
                  onClick={(e) => isBlindMode && toggleReveal(item.id, e)}
                  style={{
                    background: isAnswerHidden ? '#f8fafc' : 'linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%)',
                    border: `1px solid ${isAnswerHidden ? 'var(--border)' : '#a7f3d0'}`,
                    borderRadius: '10px',
                    padding: '11px 13px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px',
                    cursor: isBlindMode ? 'pointer' : 'default',
                    position: 'relative',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div style={{ fontSize: '11px', fontWeight: 900, color: isAnswerHidden ? 'var(--text-muted)' : '#047857', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Zap size={13} color={isAnswerHidden ? 'var(--text-muted)' : '#059669'} />
                      <span>1초 구두 모범 답변 (입으로 소리내어 말하기)</span>
                    </div>
                    {isBlindMode && (
                      <span style={{ fontSize: '10.5px', color: '#7c3aed', fontWeight: 800 }}>
                        {isAnswerHidden ? '👉 탭하여 답변 확인' : '👁️ 가리기'}
                      </span>
                    )}
                  </div>

                  {isAnswerHidden ? (
                    <div style={{ fontSize: '13px', color: 'var(--text-muted)', fontStyle: 'italic', padding: '6px 0' }}>
                      답변이 가려져 있습니다. 속으로 먼저 답을 말해본 뒤 클릭하세요!
                    </div>
                  ) : (
                    <div style={{ fontSize: '13px', fontWeight: 800, color: '#064e3b', lineHeight: 1.5 }}>
                      "{item.quickAnswer}"
                    </div>
                  )}
                </div>

                {/* Key Action & Golden Tip */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '12px', color: 'var(--text-sub)' }}>
                  <div>
                    <strong style={{ color: 'var(--text-main)' }}>• 필수 행동: </strong>
                    {item.keyAction}
                  </div>
                  <div style={{ color: '#b45309', background: '#fffbeb', padding: '6px 10px', borderRadius: '6px', border: '1px solid #fde68a' }}>
                    <strong>💡 조사관 대응 꿀팁: </strong>
                    {item.goldenTip}
                  </div>
                </div>

                {/* Sub Questions (Accordion) */}
                {item.subQuestions && item.subQuestions.length > 0 && (
                  <div>
                    <button
                      onClick={() => toggleExpand(item.id)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        fontSize: '11.5px',
                        fontWeight: 700,
                        color: 'var(--primary)',
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        padding: '4px 0'
                      }}
                    >
                      <span>연계 꼬리 질문 ({item.subQuestions.length}개)</span>
                      {isExpanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                    </button>

                    {isExpanded && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '6px', paddingLeft: '8px', borderLeft: '2px solid var(--primary-light)' }}>
                        {item.subQuestions.map((sq, sIdx) => (
                          <div key={sIdx} style={{ fontSize: '12px' }}>
                            <div style={{ fontWeight: 800, color: 'var(--text-main)' }}>Q. {sq.q}</div>
                            <div style={{ color: 'var(--primary)', fontWeight: 700, marginTop: '2px' }}>A. "{sq.a}"</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Footer link to full regulation */}
                <div style={{ marginTop: '2px', display: 'flex', justifyContent: 'flex-end' }}>
                  <button
                    onClick={() => onOpenRule && onOpenRule(item.rule)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontSize: '11px',
                      fontWeight: 700,
                      color: 'var(--text-muted)',
                      background: 'transparent',
                      border: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    <span>규정 {item.rule} 전문 열람</span>
                    <ArrowRight size={11} />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
