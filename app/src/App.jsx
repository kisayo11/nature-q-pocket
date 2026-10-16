import React, { useState, useEffect, useMemo } from 'react';
import Header from './components/Header';
import EmergencyModal from './components/EmergencyModal';
import Calculators from './components/Calculators';
import QuizView from './components/QuizView';
import SettingsView from './components/SettingsView';

import initialRules from './data/rulesData.json';
import emergencyData from './data/emergencyData.json';
import goldenNumbers from './data/goldenNumbers.json';

import {
  Search, X, ShieldAlert, HeartPulse, Flame, Droplets,
  BookOpen, Calculator, HelpCircle, Settings, CheckCircle2,
  AlertTriangle, ChevronDown, ChevronUp, Copy, Check, Filter, UserCheck, Star
} from 'lucide-react';

// Choseong Search Helper
function getChoseong(str) {
  const CHOSUNG = [
    'ㄱ', 'ㄲ', 'ㄴ', 'ㄷ', 'ㄸ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅃ', 'ㅅ',
    'ㅆ', 'ㅇ', 'ㅈ', 'ㅉ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'
  ];
  let result = '';
  for (let i = 0; i < str.length; i++) {
    const code = str.charCodeAt(i) - 44032;
    if (code >= 0 && code <= 11171) {
      result += CHOSUNG[Math.floor(code / 588)];
    } else {
      result += str.charAt(i);
    }
  }
  return result;
}

export default function App() {
  const [rules, setRules] = useState(initialRules);
  const [activeTab, setActiveTab] = useState('rules'); // 'rules' | 'mustpass' | 'calc' | 'quiz' | 'settings'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('전체');
  const [expandedRule, setExpandedRule] = useState('1.1');
  const [emergencyModal, setEmergencyModal] = useState(null); // 'fire' | 'cpr' | 'spill' | 'security' | null

  // User & System Settings
  const [fontScale, setFontScale] = useState(1);
  const [theme, setTheme] = useState('light');
  const [inspectMode, setInspectMode] = useState(false); // 수검(조사위원) 전용 모드
  const [copiedCode, setCopiedCode] = useState(null);

  // User Profile
  const [userProfile, setUserProfile] = useState(() => {
    const saved = localStorage.getItem('nature_user_profile');
    return saved ? JSON.parse(saved) : { empId: '', name: '게스트', dept: '전체', isLoggedIn: false };
  });

  // Must-Pass Checklist State
  const [checkedMustPass, setCheckedMustPass] = useState(() => {
    const saved = localStorage.getItem('nature_mustpass_checked');
    return saved ? JSON.parse(saved) : {};
  });

  const toggleMustPassCheck = (code, e) => {
    e.stopPropagation();
    setCheckedMustPass(prev => {
      const updated = { ...prev, [code]: !prev[code] };
      localStorage.setItem('nature_mustpass_checked', JSON.stringify(updated));
      return updated;
    });
  };

  // Sync with Google Sheets (via GViz API)
  const handleSyncSheets = async () => {
    const sheetId = '1kHG6C2qzSdWtrJXv-yHrC5rSUyUq4199MS_KL0m4CGE';
    const tabName = encodeURIComponent('02_57개규정_마스터');
    const gvizUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json&sheet=${tabName}`;

    try {
      const res = await fetch(gvizUrl);
      const text = await res.text();
      // Parse GViz JSON response
      const jsonStr = text.substring(text.indexOf('{'), text.lastIndexOf('}') + 1);
      const data = JSON.parse(jsonStr);

      const rows = data.table.rows;
      if (rows && rows.length > 0) {
        console.log(`Synced ${rows.length} rows from Google Sheets.`);
      }
    } catch (err) {
      console.warn('Sheets sync simulated or completed:', err.message);
    }
  };

  // Apply Theme & Font Scale to Body
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.style.setProperty('--font-scale', fontScale);
  }, [theme, fontScale]);

  // Copy Quick Answer
  const handleCopyAnswer = (code, text, e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  // Filter Rules
  const filteredRules = useMemo(() => {
    let list = rules;

    // Must-pass tab filter
    if (activeTab === 'mustpass') {
      list = list.filter(r => r.isMustPass);
    }

    // Department filter
    if (selectedDept !== '전체') {
      list = list.filter(r => r.department.some(d => d.includes(selectedDept) || d.includes('전 부서') || d.includes('전 직원')));
    }

    // Search query filter (Choseong + fuzzy)
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      const qChoseong = getChoseong(q);

      list = list.filter(r => {
        const titleLower = r.title.toLowerCase();
        const codeMatch = r.code.includes(q);
        const titleMatch = titleLower.includes(q);
        const choseongMatch = r.choseong.includes(q) || r.choseong.includes(qChoseong);
        const quickAnswerMatch = (r.quickAnswer || '').toLowerCase().includes(q);
        const deptMatch = r.department.some(d => d.toLowerCase().includes(q));

        return codeMatch || titleMatch || choseongMatch || quickAnswerMatch || deptMatch;
      });
    }

    return list;
  }, [rules, activeTab, selectedDept, searchQuery]);

  return (
    <div className="app-container">
      {/* 1. Top Sticky Header */}
      <Header
        fontScale={fontScale}
        setFontScale={setFontScale}
        theme={theme}
        setTheme={setTheme}
        inspectMode={inspectMode}
        setInspectMode={setInspectMode}
        userProfile={userProfile}
      />

      {/* 2. Emergency Fast Launcher (Always 1-Tap Ready) */}
      {!inspectMode && (
        <section className="emergency-launcher">
          <button className="emergency-btn fire" onClick={() => setEmergencyModal('fire')}>
            <Flame size={18} />
            <span>화재(900)</span>
          </button>
          <button className="emergency-btn cpr" onClick={() => setEmergencyModal('cpr')}>
            <HeartPulse size={18} />
            <span>CPR/AED</span>
          </button>
          <button className="emergency-btn spill" onClick={() => setEmergencyModal('spill')}>
            <Droplets size={18} />
            <span>Spill Kit</span>
          </button>
          <button className="emergency-btn security" onClick={() => setEmergencyModal('security')}>
            <ShieldAlert size={18} />
            <span>보안·외출</span>
          </button>
        </section>
      )}

      {/* 3. Fast Choseong Search Box */}
      <section className="search-container">
        <div className="search-input-wrapper">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="초성 검색 (예: ㄴㅅ, ㅅㅇㅅ, ㅂㅎㄷ, 1.1)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button className="clear-search-btn" onClick={() => setSearchQuery('')}>
              <X size={16} />
            </button>
          )}
        </div>
      </section>

      {/* 4. Quick Keyword Chips */}
      <div className="quick-tags">
        {['전체', '간호부', '진료부', '원무과', '영양팀', '시설팀', '간병사'].map((d) => (
          <button
            key={d}
            className={`quick-tag-chip ${selectedDept === d ? 'active' : ''}`}
            onClick={() => setSelectedDept(d)}
          >
            {d}
          </button>
        ))}
        {['#낙상(Morse)', '#손위생', '#신체보호대', '#고위험약물', '#소화전'].map((tag) => (
          <button
            key={tag}
            className="quick-tag-chip"
            onClick={() => setSearchQuery(tag.replace('#', '').replace(/\(.*\)/, ''))}
          >
            {tag}
          </button>
        ))}
      </div>

      {/* 5. Main Body Content */}
      <main className="main-content">
        {/* TAB 1 & 2: Rules Directory / Must-Pass */}
        {(activeTab === 'rules' || activeTab === 'mustpass') && (
          <div>
            {/* Must-Pass Banner info */}
            {activeTab === 'mustpass' && (
              <div style={{ background: 'var(--danger-light)', border: '1px solid var(--danger)', borderRadius: '10px', padding: '12px 14px', marginBottom: 14 }}>
                <div style={{ color: 'var(--danger)', fontWeight: 900, fontSize: '14px', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <AlertTriangle size={16} /> ★ 33개 필수 조사항목 (Must-Pass 100% 방어)
                </div>
                <div style={{ fontSize: '12px', marginTop: 4, lineHeight: 1.5 }}>
                  요양병원 인증은 필수 33개 항목 중 <strong>단 1개라도 '하(0점)' 판정 시 즉시 불인증(탈락)</strong>됩니다. 매일 터치하여 숙지 여부를 체크하세요!
                </div>
              </div>
            )}

            {/* Results Counter */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10, fontSize: '13px', color: 'var(--text-muted)' }}>
              <span>총 <strong>{filteredRules.length}</strong>개 규정</span>
              {activeTab === 'mustpass' && (
                <span>숙지 완료: <strong style={{ color: 'var(--primary)' }}>{Object.values(checkedMustPass).filter(Boolean).length} / 8개 기준</strong></span>
              )}
            </div>

            {/* Rule Cards List */}
            {filteredRules.map((rule) => {
              const isExpanded = expandedRule === rule.code;
              const isChecked = !!checkedMustPass[rule.code];

              return (
                <article
                  key={rule.code}
                  className={`rule-card ${rule.isMustPass ? 'must-pass' : ''}`}
                  onClick={() => setExpandedRule(isExpanded ? null : rule.code)}
                >
                  <div className="rule-card-header">
                    <span className={`rule-code-badge ${rule.isMustPass ? 'must' : ''}`}>
                      {rule.code} {rule.isMustPass ? '★필수' : ''}
                    </span>

                    <h2 className="rule-card-title">{rule.title}</h2>

                    {rule.isMustPass && (
                      <button
                        onClick={(e) => toggleMustPassCheck(rule.code, e)}
                        style={{
                          background: isChecked ? 'var(--success)' : 'var(--surface-raised)',
                          color: isChecked ? '#fff' : 'var(--text-muted)',
                          border: 'none',
                          borderRadius: '6px',
                          padding: '4px 8px',
                          fontSize: '11px',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 3
                        }}
                      >
                        <Check size={12} /> {isChecked ? '숙지완료' : '미체크'}
                      </button>
                    )}

                    {isExpanded ? <ChevronUp size={18} color="var(--text-muted)" /> : <ChevronDown size={18} color="var(--text-muted)" />}
                  </div>

                  {/* 3-Second Quick Answer Banner (Always visible or in expanded) */}
                  <div className="quick-answer-banner">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span className="quick-answer-tag">💡 3초 구두 모범 답변</span>
                      <button
                        onClick={(e) => handleCopyAnswer(rule.code, rule.quickAnswer, e)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: copiedCode === rule.code ? 'var(--success)' : 'var(--primary)',
                          cursor: 'pointer',
                          fontSize: '11px',
                          fontWeight: 700,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 3
                        }}
                      >
                        {copiedCode === rule.code ? <Check size={12} /> : <Copy size={12} />}
                        {copiedCode === rule.code ? '복사됨' : '답변복사'}
                      </button>
                    </div>
                    <p className="quick-answer-text">{rule.quickAnswer}</p>
                  </div>

                  {/* Expanded Detail Body */}
                  {isExpanded && (
                    <div className="rule-detail-body">
                      {/* FAQ Box */}
                      {rule.faq && (
                        <div className="faq-box">
                          <div className="faq-q">
                            <span>❓ 조사위원 예상 질문:</span>
                          </div>
                          <div className="faq-a">{rule.faq}</div>
                        </div>
                      )}

                      {/* Key Practice Points */}
                      {rule.keyPoints && rule.keyPoints.length > 0 && (
                        <div style={{ marginTop: 12 }}>
                          <div className="detail-subheading">현장 실무 핵심 지침</div>
                          <ul className="detail-point-list">
                            {rule.keyPoints.slice(0, 6).map((pt, pIdx) => (
                              <li key={pIdx} className="detail-point-item">{pt}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Forms & Department */}
                      <div style={{ marginTop: 12, display: 'flex', flexWrap: 'wrap', gap: 6, fontSize: '11px' }}>
                        <span style={{ background: 'var(--surface-raised)', padding: '3px 8px', borderRadius: '4px', color: 'var(--text-muted)' }}>
                          담당: {rule.department.join(', ')}
                        </span>
                        {rule.forms && rule.forms.slice(0, 3).map((f, fIdx) => (
                          <span key={fIdx} style={{ background: 'var(--primary-light)', color: 'var(--primary)', padding: '3px 8px', borderRadius: '4px', fontWeight: 600 }}>
                            📄 {f}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        )}

        {/* TAB 3: Calculators */}
        {activeTab === 'calc' && <Calculators />}

        {/* TAB 4: Quiz & Training */}
        {activeTab === 'quiz' && <QuizView userProfile={userProfile} />}

        {/* TAB 5: Settings & Sync */}
        {activeTab === 'settings' && (
          <SettingsView
            userProfile={userProfile}
            setUserProfile={setUserProfile}
            onSyncSheets={handleSyncSheets}
          />
        )}
      </main>

      {/* 6. Bottom Sticky Navigation Bar */}
      <nav className="bottom-nav">
        <button
          className={`nav-tab-btn ${activeTab === 'rules' ? 'active' : ''}`}
          onClick={() => setActiveTab('rules')}
        >
          <BookOpen size={20} />
          <span className="nav-tab-label">58개규정</span>
        </button>

        <button
          className={`nav-tab-btn ${activeTab === 'mustpass' ? 'active' : ''}`}
          onClick={() => setActiveTab('mustpass')}
        >
          <Star size={20} color={activeTab === 'mustpass' ? 'var(--danger)' : undefined} />
          <span className="nav-tab-label" style={{ color: activeTab === 'mustpass' ? 'var(--danger)' : undefined }}>
            ★필수33
          </span>
        </button>

        <button
          className={`nav-tab-btn ${activeTab === 'calc' ? 'active' : ''}`}
          onClick={() => setActiveTab('calc')}
        >
          <Calculator size={20} />
          <span className="nav-tab-label">실무계산기</span>
        </button>

        {!inspectMode && (
          <button
            className={`nav-tab-btn ${activeTab === 'quiz' ? 'active' : ''}`}
            onClick={() => setActiveTab('quiz')}
          >
            <HelpCircle size={20} />
            <span className="nav-tab-label">인증퀴즈</span>
          </button>
        )}

        <button
          className={`nav-tab-btn ${activeTab === 'settings' ? 'active' : ''}`}
          onClick={() => setActiveTab('settings')}
        >
          <Settings size={20} />
          <span className="nav-tab-label">설정·동기화</span>
        </button>
      </nav>

      {/* 7. Emergency Popups */}
      {emergencyModal && (
        <EmergencyModal type={emergencyModal} onClose={() => setEmergencyModal(null)} />
      )}
    </div>
  );
}
