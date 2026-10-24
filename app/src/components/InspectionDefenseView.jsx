import React, { useState, useEffect, useMemo } from 'react';
import {
  MessageSquare, Zap, CheckCircle2, ArrowRight,
  ShieldAlert, Sparkles, BookOpen, Clock, HelpCircle,
  AlertTriangle, Droplets, HeartPulse, Flame, ShieldCheck, Stethoscope,
  Users, Check, ChevronDown, ChevronUp, Bell, PhoneCall, Shield
} from 'lucide-react';
import {
  DEPARTMENTS,
  DEPARTMENT_QUICK_ANSWERS
} from '../utils/deptUtils';
import tracerScenarios from '../data/tracerScenarios.json';
import allStaffChecklist from '../data/allStaffChecklist.json';
import fireBrigadeData from '../data/fireBrigadeData.json';

const ICON_MAP = {
  AlertTriangle,
  Droplets,
  HeartPulse,
  Flame,
  ShieldCheck,
  Stethoscope
};

const DOMAIN_FILTERS = [
  '전체',
  '화재·재난',
  '환자안전',
  '감염관리',
  '직원안전',
  '환자인권',
  '질향상·의무기록'
];

export default function InspectionDefenseView({
  selectedDept = '간호부',
  onOpenRule,
  initialSubTab = 'common'
}) {
  // 4 Tabs: 'common' | 'brigade' | 'quick' | 'tracer'
  const [activeSubTab, setActiveSubTab] = useState(initialSubTab || 'common');
  const [activeDept, setActiveDept] = useState(selectedDept || '간호부');
  const [activeScenarioId, setActiveScenarioId] = useState('fall');

  // Common Checklist Filter & Memorize State
  const [selectedDomain, setSelectedDomain] = useState('전체');
  const [memorizedItems, setMemorizedItems] = useState(() => {
    try {
      const saved = localStorage.getItem('nature_common_memorized');
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      return {};
    }
  });
  const [expandedCards, setExpandedCards] = useState({});

  // Brigade selected department
  const [brigadeDept, setBrigadeDept] = useState(selectedDept || '간호부');

  useEffect(() => {
    if (initialSubTab) setActiveSubTab(initialSubTab);
  }, [initialSubTab]);

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

  // Filtered Common Checklist
  const filteredChecklist = useMemo(() => {
    if (selectedDomain === '전체') return allStaffChecklist;
    return allStaffChecklist.filter((item) => item.domain === selectedDomain);
  }, [selectedDomain]);

  const memorizedCount = Object.values(memorizedItems).filter(Boolean).length;
  const totalCount = allStaffChecklist.length;
  const memorizeRate = Math.round((memorizedCount / totalCount) * 100);

  const currentQuickAnswers = DEPARTMENT_QUICK_ANSWERS[activeDept] || DEPARTMENT_QUICK_ANSWERS['간호부'];
  const activeScenario = tracerScenarios.find((s) => s.id === activeScenarioId) || tracerScenarios[0];
  const IconComponent = ICON_MAP[activeScenario.icon] || AlertTriangle;

  // Brigade lookup info
  const activeBrigadeInfo = fireBrigadeData.deptLookup[brigadeDept] || fireBrigadeData.deptLookup['간호부'];
  const matchingTeam = fireBrigadeData.teams.find((t) => t.id === activeBrigadeInfo.teamId) || fireBrigadeData.teams[2];

  return (
    <div className="inspection-view-wrap" style={{ display: 'flex', flexDirection: 'column', gap: '14px', maxWidth: '1060px', margin: '0 auto', width: '100%' }}>
      {/* 1. Header Segmented Control (4 Tabs: 전직원 공통 / 자위소방대 / 3초 구두답변 / 돌발 Tracer) */}
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
              <ShieldCheck size={20} color="var(--primary)" />
              <span>현장 실사 완벽 대응 (말하기 & 행동하기)</span>
            </h1>
            <p style={{ fontSize: '11.5px', color: 'var(--text-muted)', margin: '3px 0 0' }}>
              전 직원 15대 필수 수칙, 자위소방대 역할, 부서별 3초 답변 및 6대 돌발상황을 완벽 대비합니다.
            </p>
          </div>
          <span style={{
            fontSize: '11px',
            fontWeight: 800,
            background: 'var(--primary-light)',
            color: 'var(--primary)',
            padding: '3px 9px',
            borderRadius: '16px',
            border: '1px solid hsla(168, 80%, 28%, 0.15)'
          }}>
            실사 방어 전용 허브
          </span>
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
            <span>전직원 공통 (15대)</span>
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

      {/* =========================================================================
          SUB-TAB 1: 전직원 공통 필수 15대 수칙
         ========================================================================= */}
      {activeSubTab === 'common' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {/* Progress & Domain Filter Header */}
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
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '18px' }}>⭐</span>
                <div>
                  <h2 style={{ fontSize: '15px', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
                    조사위원이 병원 누구에게나 묻는 15대 필수 질문
                  </h2>
                  <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: '2px 0 0' }}>
                    행정, 간호, 치료, 영양, 시설, 조무사 전원 공통 숙지 리스트입니다.
                  </p>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '12px', fontWeight: 800, color: 'var(--primary)' }}>
                  암기 달성률: <strong>{memorizedCount}</strong> / {totalCount} ({memorizeRate}%)
                </span>
                <div style={{ width: '80px', height: '8px', background: 'var(--border)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: `${memorizeRate}%`, height: '100%', background: 'var(--primary)', transition: 'width 0.3s ease' }} />
                </div>
              </div>
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

          {/* Checklist Cards List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {filteredChecklist.map((item) => {
              const isMemorized = !!memorizedItems[item.id];
              const isExpanded = !!expandedCards[item.id];

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
                  {/* Card Top: Badges & Memorized Toggle */}
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

                  {/* 1초 모범 답변 (Prominent Box) */}
                  <div
                    style={{
                      background: 'linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%)',
                      border: '1px solid #a7f3d0',
                      borderRadius: '10px',
                      padding: '11px 13px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '4px'
                    }}
                  >
                    <div style={{ fontSize: '11px', fontWeight: 900, color: '#047857', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Zap size={13} color="#059669" />
                      <span>1초 구두 모범 답변 (입으로 소리내어 말하기)</span>
                    </div>
                    <div style={{ fontSize: '13px', fontWeight: 800, color: '#064e3b', lineHeight: 1.5 }}>
                      "{item.quickAnswer}"
                    </div>
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
            })}
          </div>
        </div>
      )}

      {/* =========================================================================
          SUB-TAB 2: 내 자위소방대 역할 (부서별 찾기 & 야간 비상체계)
         ========================================================================= */}
      {activeSubTab === 'brigade' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {/* Top Banner: Emergency Hotline & Commander */}
          <div
            style={{
              background: 'linear-gradient(135deg, #fff1f2 0%, #ffe4e6 100%)',
              border: '1.5px solid #fecdd3',
              borderRadius: 'var(--radius-lg)',
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '20px' }}>🚨</span>
                <div>
                  <h2 style={{ fontSize: '15px', fontWeight: 900, color: '#9f1239', margin: 0 }}>
                    네이처요양병원 자위소방대 비상 대응 체계
                  </h2>
                  <p style={{ fontSize: '11px', color: '#be123c', margin: '2px 0 0' }}>
                    비상방송: 내선 900번에 <strong>"코드레드(Code Red) O병동 O호실 2회"</strong> 방송 요청!
                  </p>
                </div>
              </div>
              <div style={{ fontSize: '11px', fontWeight: 800, color: '#9f1239', background: '#fff', padding: '4px 10px', borderRadius: '16px', border: '1px solid #fda4af' }}>
                대장: 병원장 | 부대장: 시설팀장 | 보조자: 원무과장
              </div>
            </div>
          </div>

          {/* Department Picker for My Brigade Role */}
          <div
            style={{
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-lg)',
              padding: '14px 16px',
              boxShadow: 'var(--shadow-xs)',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ fontSize: '13px', fontWeight: 800, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Users size={16} color="var(--primary)" />
                <span>나의 소속 부서를 선택하세요</span>
              </div>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>부서 클릭 시 내 역할 즉시 표시</span>
            </div>

            <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '4px', scrollbarWidth: 'none' }}>
              {Object.keys(fireBrigadeData.deptLookup).map((dName) => {
                const isSelected = brigadeDept === dName;
                return (
                  <button
                    key={dName}
                    onClick={() => setBrigadeDept(dName)}
                    style={{
                      padding: '7px 13px',
                      borderRadius: '18px',
                      fontSize: '12px',
                      fontWeight: isSelected ? 900 : 600,
                      background: isSelected ? '#e11d48' : 'var(--surface-raised)',
                      color: isSelected ? '#fff' : 'var(--text-main)',
                      border: '1px solid',
                      borderColor: isSelected ? '#e11d48' : 'var(--border)',
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                      boxShadow: isSelected ? 'var(--shadow-xs)' : 'none',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    {dName}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Department Spotlight Card */}
          <div
            style={{
              background: 'var(--surface)',
              border: `2px solid ${matchingTeam.color}`,
              borderRadius: 'var(--radius-lg)',
              padding: '16px',
              boxShadow: 'var(--shadow-sm)',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
              <div>
                <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--text-muted)' }}>
                  선택 부서: <strong>{brigadeDept}</strong>
                </span>
                <div style={{ fontSize: '17px', fontWeight: 900, color: matchingTeam.color, display: 'flex', alignItems: 'center', gap: '8px', marginTop: '2px' }}>
                  <span>주간 소속: 【{activeBrigadeInfo.teamName}】</span>
                  <span style={{ fontSize: '11px', fontWeight: 700, background: matchingTeam.bg, color: matchingTeam.color, padding: '2px 8px', borderRadius: '4px' }}>
                    팀장: {matchingTeam.leader}
                  </span>
                </div>
              </div>

              <div style={{
                fontSize: '11.5px',
                fontWeight: 800,
                background: '#fef2f2',
                color: '#dc2626',
                padding: '4px 10px',
                borderRadius: '8px',
                border: '1px solid #fecaca'
              }}>
                1초 즉답 가능
              </div>
            </div>

            {/* Daytime Key Duties */}
            <div style={{ background: 'var(--surface-raised)', padding: '12px 14px', borderRadius: '10px', border: '1px solid var(--border)' }}>
              <div style={{ fontSize: '12.5px', fontWeight: 900, color: 'var(--text-main)', marginBottom: '4px' }}>
                ☀️ [주간] {brigadeDept} 직원이 즉각 수행해야 할 임무:
              </div>
              <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-main)', lineHeight: 1.5 }}>
                {activeBrigadeInfo.keyRole}
              </div>
              <ul style={{ margin: '8px 0 0', paddingLeft: '18px', fontSize: '12px', color: 'var(--text-sub)', lineHeight: 1.6 }}>
                {matchingTeam.steps.map((step, sIdx) => (
                  <li key={sIdx}>{step}</li>
                ))}
              </ul>
            </div>

            {/* Nighttime Transition Duties */}
            <div style={{ background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)', color: '#fff', padding: '12px 14px', borderRadius: '10px' }}>
              <div style={{ fontSize: '12px', fontWeight: 900, color: '#a5b4fc', marginBottom: '3px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span>🌙 [야간 및 휴일] 소수 인원 비상 전환 시 나의 역할:</span>
              </div>
              <div style={{ fontSize: '13px', fontWeight: 800, color: '#f8fafc', lineHeight: 1.5 }}>
                {activeBrigadeInfo.nightRole}
              </div>
            </div>
          </div>

          {/* All 5 Teams Overview Grid */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <h3 style={{ fontSize: '14px', fontWeight: 800, color: 'var(--text-main)', margin: '4px 0 0' }}>
              📋 자위소방대 5개 팀 전체 편성표 (규정 10.6 부록 3)
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '10px' }}>
              {fireBrigadeData.teams.map((t) => (
                <div
                  key={t.id}
                  style={{
                    background: 'var(--surface)',
                    border: `1.5px solid ${t.id === activeBrigadeInfo.teamId ? t.color : 'var(--border)'}`,
                    borderRadius: 'var(--radius-md)',
                    padding: '12px 14px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <strong style={{ fontSize: '13.5px', color: t.color, fontWeight: 900 }}>
                      {t.name}
                    </strong>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 700 }}>
                      팀장: {t.leader}
                    </span>
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-sub)', fontWeight: 600 }}>
                    <strong>구성 부서:</strong> {t.departments.join(', ')}
                  </div>
                  <div style={{ fontSize: '11.5px', color: 'var(--text-main)', background: t.bg, padding: '6px 8px', borderRadius: '6px', fontWeight: 700, marginTop: '2px' }}>
                    {t.actionSummary}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Nightshift 2-Pillar System Special Card */}
          <div
            style={{
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-lg)',
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '18px' }}>🌙</span>
              <div>
                <h3 style={{ fontSize: '14px', fontWeight: 900, color: 'var(--text-main)', margin: 0 }}>
                  {fireBrigadeData.nightShift.title}
                </h3>
                <span style={{ fontSize: '11px', color: 'var(--primary)', fontWeight: 800 }}>
                  지휘: {fireBrigadeData.nightShift.commander}
                </span>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '10px' }}>
              {fireBrigadeData.nightShift.groups.map((grp, gIdx) => (
                <div key={gIdx} style={{ background: 'var(--surface-raised)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border)' }}>
                  <div style={{ fontSize: '13px', fontWeight: 900, color: 'var(--primary)', marginBottom: '3px' }}>
                    {grp.name}
                  </div>
                  <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '8px' }}>
                    담당: {grp.members}
                  </div>
                  <ul style={{ margin: 0, paddingLeft: '16px', fontSize: '11.5px', color: 'var(--text-main)', lineHeight: 1.6 }}>
                    {grp.tasks.map((task, tIdx) => (
                      <li key={tIdx}>{task}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          SUB-TAB 3: 3초 구두 답변 (부서별 실사 기습질문 즉답)
         ========================================================================= */}
      {activeSubTab === 'quick' && (
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
      )}

      {/* =========================================================================
          SUB-TAB 4: 돌발 추적조사 (Tracer 6대 현장시나리오)
         ========================================================================= */}
      {activeSubTab === 'tracer' && (
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
      )}
    </div>
  );
}
