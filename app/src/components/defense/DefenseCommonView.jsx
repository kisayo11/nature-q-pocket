import React, { useState, useMemo } from 'react';
import {
  Sparkles, Check, ChevronDown, ChevronUp, ArrowRight,
  Zap, Search, Eye, EyeOff, Layers, BookOpen, HelpCircle
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

// Highlight core spoken keywords in quick answer
const KEYWORDS = [
  '불이야', '내선 900번', '코드레드', '발신기', '코드블루', '30:2',
  '개방형 질문', '사이드레일', '바퀴 항상 잠그기', '1일 1회 처방',
  '2시간마다', 'Braden', '에어매트리스', '40~60초', '20~30초',
  '병실 안에서 탈의', '락스 1ml+물 99ml', '락스 10ml+물 90ml',
  '흐르는 물과 비누', '72시간 이내', '시설팀과 영양팀', '112', '1577-1389',
  '7일 이내', '14일 이내', '자발적 무벌 보고', '화면 잠금', 'C급', 'B급', 'A급', '방화문',
  '정문 좌측 30m', '실외흡연구역'
];

function renderHighlightedAnswer(text) {
  if (!text) return null;
  // Simple regex highlighting for key phrases
  const regex = new RegExp(`(${KEYWORDS.map(k => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`, 'g');
  const parts = text.split(regex);

  return parts.map((part, i) => {
    if (KEYWORDS.includes(part)) {
      return (
        <span
          key={i}
          style={{
            background: '#fef08a',
            color: '#854d0e',
            padding: '1px 4px',
            borderRadius: '4px',
            fontWeight: 900
          }}
        >
          {part}
        </span>
      );
    }
    return part;
  });
}

export default function DefenseCommonView({ onOpenRule }) {
  const [selectedDomain, setSelectedDomain] = useState('전체');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('compact'); // 'compact' (1초 벼락치기) vs 'detailed' (전체 상세)
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

  const toggleCardExpand = (id) => {
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {/* 1. Header & Controls Panel */}
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
        {/* Title & Progress */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
          <div>
            <h2 style={{ fontSize: '15.5px', fontWeight: 900, color: 'var(--text-main)', margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span>⭐</span>
              <span>전직원 17대 필수 질문 (1초 즉답 훈련)</span>
            </h2>
            <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: '2px 0 0' }}>
              조사위원이 다가왔을 때 입 밖으로 뱉을 '첫 한 문장'을 완벽하게 마스터하세요.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '11.5px', fontWeight: 800, color: 'var(--primary)' }}>
              암기 달성: <strong>{memorizedCount}</strong> / {totalCount} ({memorizeRate}%)
            </span>
            <div style={{ width: '70px', height: '6px', background: 'var(--border)', borderRadius: '3px', overflow: 'hidden' }}>
              <div style={{ width: `${memorizeRate}%`, height: '100%', background: 'var(--primary)', transition: 'width 0.3s ease' }} />
            </div>
          </div>
        </div>

        {/* View Mode & Blind Mode Action Bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px', paddingTop: '4px', borderTop: '1px solid var(--border-light)' }}>
          {/* View Mode Segmented Pill */}
          <div style={{ display: 'flex', background: 'var(--surface-raised)', padding: '2px', borderRadius: '8px', border: '1px solid var(--border)' }}>
            <button
              onClick={() => setViewMode('compact')}
              style={{
                padding: '5px 10px',
                borderRadius: '6px',
                fontSize: '11px',
                fontWeight: viewMode === 'compact' ? 900 : 600,
                background: viewMode === 'compact' ? 'var(--surface)' : 'transparent',
                color: viewMode === 'compact' ? 'var(--primary)' : 'var(--text-muted)',
                boxShadow: viewMode === 'compact' ? 'var(--shadow-xs)' : 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <Zap size={12} />
              <span>⚡ 1초 벼락치기 (요약)</span>
            </button>
            <button
              onClick={() => setViewMode('detailed')}
              style={{
                padding: '5px 10px',
                borderRadius: '6px',
                fontSize: '11px',
                fontWeight: viewMode === 'detailed' ? 900 : 600,
                background: viewMode === 'detailed' ? 'var(--surface)' : 'transparent',
                color: viewMode === 'detailed' ? 'var(--primary)' : 'var(--text-muted)',
                boxShadow: viewMode === 'detailed' ? 'var(--shadow-xs)' : 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <Layers size={12} />
              <span>📖 전체 상세 보기</span>
            </button>
          </div>

          {/* Flashcard Blind Mode Toggle */}
          <button
            onClick={() => setIsBlindMode((prev) => !prev)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              padding: '5px 10px',
              borderRadius: '8px',
              fontSize: '11px',
              fontWeight: 800,
              cursor: 'pointer',
              border: '1px solid',
              borderColor: isBlindMode ? '#8b5cf6' : 'var(--border)',
              background: isBlindMode ? '#f5f3ff' : 'var(--surface-raised)',
              color: isBlindMode ? '#7c3aed' : 'var(--text-sub)',
              transition: 'all 0.15s ease'
            }}
          >
            {isBlindMode ? <EyeOff size={13} /> : <Eye size={13} />}
            <span>{isBlindMode ? '답 가리기 ON' : '자가 퀴즈 모드'}</span>
          </button>
        </div>

        {/* Realtime Search Bar */}
        <div style={{ position: 'relative', width: '100%' }}>
          <Search size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="수칙 검색 (예: 손위생, 소방, 신체보호대, 낙상, 10.3...)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '8px 12px 8px 32px',
              borderRadius: '8px',
              border: '1px solid var(--border)',
              background: 'var(--surface-raised)',
              fontSize: '12px',
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
                  padding: '4px 10px',
                  borderRadius: '14px',
                  fontSize: '11px',
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

      {/* 2. Checklist Cards List (Progressive Disclosure) */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {filteredList.length === 0 ? (
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '30px', textAlign: 'center', color: 'var(--text-muted)' }}>
            검색 결과가 없습니다. 다른 검색어를 입력해보세요.
          </div>
        ) : (
          filteredList.map((item) => {
            const isMemorized = !!memorizedItems[item.id];
            const isManuallyExpanded = !!expandedCards[item.id];
            // In detailed mode, all cards are expanded; in compact mode, only if manually clicked
            const isDetailsOpen = viewMode === 'detailed' || isManuallyExpanded;
            const isAnswerHidden = isBlindMode && !revealedAnswers[item.id];

            return (
              <div
                key={item.id}
                style={{
                  background: 'var(--surface)',
                  border: `1.5px solid ${isMemorized ? 'var(--primary)' : 'var(--border)'}`,
                  borderRadius: 'var(--radius-md)',
                  padding: '12px 14px',
                  boxShadow: 'var(--shadow-xs)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                  transition: 'all 0.15s ease'
                }}
              >
                {/* Card Top: Badges & Memorized Toggle */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '6px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px', flexWrap: 'wrap' }}>
                    <span style={{
                      fontSize: '9.5px',
                      fontWeight: 900,
                      background: item.isMustPass ? '#e11d48' : '#059669',
                      color: '#fff',
                      padding: '2px 5px',
                      borderRadius: '4px'
                    }}>
                      {item.badge}
                    </span>
                    <span style={{
                      fontSize: '10.5px',
                      fontWeight: 700,
                      background: 'var(--surface-raised)',
                      color: 'var(--text-sub)',
                      padding: '1px 6px',
                      borderRadius: '4px',
                      border: '1px solid var(--border)'
                    }}>
                      {item.domain}
                    </span>
                    <span style={{ fontSize: '10.5px', fontWeight: 800, color: 'var(--primary)' }}>
                      규정 {item.rule}
                    </span>
                  </div>

                  <button
                    onClick={(e) => toggleMemorize(item.id, e)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontSize: '10.5px',
                      fontWeight: 800,
                      padding: '3px 8px',
                      borderRadius: '14px',
                      border: '1px solid',
                      borderColor: isMemorized ? 'var(--primary)' : 'var(--border)',
                      background: isMemorized ? 'var(--primary-light)' : 'transparent',
                      color: isMemorized ? 'var(--primary)' : 'var(--text-muted)',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <Check size={12} strokeWidth={isMemorized ? 3 : 2} />
                    <span>{isMemorized ? '암기완료' : '외우기'}</span>
                  </button>
                </div>

                {/* Question */}
                <div style={{ fontSize: '13.5px', fontWeight: 800, color: 'var(--text-main)', lineHeight: 1.4 }}>
                  Q. {item.question}
                </div>

                {/* 1초 모범 답변 (Prominent Focus Box) */}
                <div
                  onClick={(e) => isBlindMode && toggleReveal(item.id, e)}
                  style={{
                    background: isAnswerHidden ? '#f8fafc' : 'linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%)',
                    border: `1px solid ${isAnswerHidden ? 'var(--border)' : '#a7f3d0'}`,
                    borderRadius: '8px',
                    padding: '9px 11px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '3px',
                    cursor: isBlindMode ? 'pointer' : 'default',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div style={{ fontSize: '10.5px', fontWeight: 900, color: isAnswerHidden ? 'var(--text-muted)' : '#047857', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Zap size={12} color={isAnswerHidden ? 'var(--text-muted)' : '#059669'} />
                      <span>1초 구두 답변 (입으로 소리내어 말하기)</span>
                    </div>
                    {isBlindMode && (
                      <span style={{ fontSize: '10px', color: '#7c3aed', fontWeight: 800 }}>
                        {isAnswerHidden ? '👉 탭하여 답변 확인' : '👁️ 가리기'}
                      </span>
                    )}
                  </div>

                  {isAnswerHidden ? (
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontStyle: 'italic', padding: '4px 0' }}>
                      답변이 가려져 있습니다. 속으로 먼저 답을 말해본 뒤 클릭하세요!
                    </div>
                  ) : (
                    <div style={{ fontSize: '12.5px', fontWeight: 700, color: '#064e3b', lineHeight: 1.5 }}>
                      "{renderHighlightedAnswer(item.quickAnswer)}"
                    </div>
                  )}
                </div>

                {/* Expand Toggle Button (in Compact Mode) */}
                {viewMode === 'compact' && (
                  <button
                    onClick={() => toggleCardExpand(item.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '4px',
                      padding: '4px',
                      borderRadius: '6px',
                      background: isManuallyExpanded ? 'var(--surface-raised)' : 'transparent',
                      color: isManuallyExpanded ? 'var(--primary)' : 'var(--text-muted)',
                      fontSize: '11px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      border: 'none',
                      marginTop: '2px'
                    }}
                  >
                    <span>{isManuallyExpanded ? '상세 행동 & 꿀팁 접기' : '상세 행동 & 조사관 꿀팁 보기'}</span>
                    {isManuallyExpanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                  </button>
                )}

                {/* Progressive Disclosure Section (Hidden by default in Compact Mode) */}
                {isDetailsOpen && (
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px',
                    fontSize: '11.5px',
                    color: 'var(--text-sub)',
                    paddingTop: '6px',
                    borderTop: '1px dashed var(--border)'
                  }}>
                    <div>
                      <strong style={{ color: 'var(--text-main)' }}>• 필수 행동: </strong>
                      {item.keyAction}
                    </div>

                    <div style={{ color: '#92400e', background: '#fffbeb', padding: '6px 9px', borderRadius: '6px', border: '1px solid #fde68a' }}>
                      <strong>💡 조사관 대응 꿀팁: </strong>
                      {item.goldenTip}
                    </div>

                    {/* Sub Questions */}
                    {item.subQuestions && item.subQuestions.length > 0 && (
                      <div style={{ marginTop: '2px', paddingLeft: '8px', borderLeft: '2px solid var(--primary-light)' }}>
                        <div style={{ fontSize: '10.5px', fontWeight: 800, color: 'var(--primary)', marginBottom: '3px' }}>
                          연계 꼬리 질문 ({item.subQuestions.length}개):
                        </div>
                        {item.subQuestions.map((sq, sIdx) => (
                          <div key={sIdx} style={{ fontSize: '11.5px', marginBottom: '3px' }}>
                            <div style={{ fontWeight: 800, color: 'var(--text-main)' }}>Q. {sq.q}</div>
                            <div style={{ color: 'var(--primary)', fontWeight: 700 }}>A. "{sq.a}"</div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Footer Regulation Link */}
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '2px' }}>
                      <button
                        onClick={() => onOpenRule && onOpenRule(item.rule)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '3px',
                          fontSize: '10.5px',
                          fontWeight: 700,
                          color: 'var(--text-muted)',
                          background: 'transparent',
                          border: 'none',
                          cursor: 'pointer'
                        }}
                      >
                        <span>규정 {item.rule} 전문 열람</span>
                        <ArrowRight size={10} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
