import React, { useState, useEffect, useMemo, lazy, Suspense } from 'react';
import Header from './components/Header';
import HomeHub from './components/HomeHub';

// Code Splitting with React.lazy for instant initial page loads
const HandbookBrowser = lazy(() => import('./components/HandbookBrowser'));
const PocketCardReader = lazy(() => import('./components/PocketCardReader'));
const GoldenNumbersView = lazy(() => import('./components/GoldenNumbersView'));
const EmergencyModal = lazy(() => import('./components/EmergencyModal'));
const QuizView = lazy(() => import('./components/QuizView'));
const SettingsView = lazy(() => import('./components/SettingsView'));
const InspectionDefenseView = lazy(() => import('./components/InspectionDefenseView'));
const FeedbackModal = lazy(() => import('./components/FeedbackModal'));

// Loading Fallback Component
function TabLoadingFallback() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 20px', color: 'var(--text-muted)', gap: 12 }}>
      <div style={{ width: 28, height: 28, border: '3px solid var(--border)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <span style={{ fontSize: '13px', fontWeight: 600 }}>화면 로딩 중...</span>
    </div>
  );
}

import initialRules from './data/rulesData.json';
import initialGoldenNumbers from './data/goldenNumbers.json';
import initialQuizList from './data/quizData.json';
import initialSpillKitData from './data/spillKitData';
import { autoSyncWithGoogleSheets } from './utils/googleSheetsSync';

import {
  Home, BookOpen, Clock, Calculator, Settings, HelpCircle, ShieldCheck, Zap
} from 'lucide-react';

export default function App() {
  const [rules, setRules] = useState(initialRules);
  const [goldenNumbers, setGoldenNumbers] = useState(initialGoldenNumbers);
  const [quizList, setQuizList] = useState(initialQuizList);
  const [spillKitData, setSpillKitData] = useState(initialSpillKitData);
  const [activeTab, setActiveTab] = useState('home'); // 'home' | 'handbook' | 'inspection' | 'golden' | 'quiz' | 'settings'

  // Selected Department (기본값: 간호부)
  const [selectedDept, setSelectedDept] = useState(() => {
    return localStorage.getItem('nature_user_dept') || '간호부';
  });

  const handleSelectDept = (dept) => {
    setSelectedDept(dept);
    localStorage.setItem('nature_user_dept', dept);
  };

  // Chapter filter for handbook
  const [chapterFilter, setChapterFilter] = useState(null);
  const [mustPassFilter, setMustPassFilter] = useState(false);

  // Active Reading Rule Modal
  const [activeRuleCode, setActiveRuleCode] = useState(null);

  // Emergency Modal
  const [emergencyModal, setEmergencyModal] = useState(null);

  // Feedback & Bug Report Modal
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [feedbackTargetRule, setFeedbackTargetRule] = useState('');

  const handleOpenFeedback = (target = '') => {
    setFeedbackTargetRule(target);
    setIsFeedbackOpen(true);
  };

  // System Settings with LocalStorage Persistence
  const [fontScale, setFontScale] = useState(() => {
    const saved = localStorage.getItem('nature_font_scale');
    return saved ? parseFloat(saved) : 1;
  });
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('nature_theme') || 'light';
  });
  const [inspectMode, setInspectMode] = useState(() => {
    return localStorage.getItem('nature_inspect_mode') === 'true';
  });

  const handleUpdateTheme = (newTheme) => {
    setTheme(newTheme);
    localStorage.setItem('nature_theme', newTheme);
  };

  const handleUpdateFontScale = (newScale) => {
    setFontScale(newScale);
    localStorage.setItem('nature_font_scale', String(newScale));
  };

  const handleUpdateInspectMode = (newMode) => {
    setInspectMode(newMode);
    localStorage.setItem('nature_inspect_mode', String(newMode));
  };

  // Reset All Learning & Check Data
  const handleResetAllData = () => {
    localStorage.removeItem('nature_bookmarked_rules');
    localStorage.removeItem('nature_mustpass_checked');
    localStorage.removeItem('nature_golden_memorized');
    localStorage.removeItem('nature_wrong_quiz_ids');
    localStorage.removeItem('nature_rule_checkpoints');
    setBookmarkedCodes({});
    setCheckedMustPass({});
    alert('모든 학습 체크리스트, 북마크, 오답노트가 초기화되었습니다.');
  };

  // Live Sync Status
  const [syncStatus, setSyncStatus] = useState({ synced: false, time: null });

  // Bookmarks
  const [bookmarkedCodes, setBookmarkedCodes] = useState(() => {
    const saved = localStorage.getItem('nature_bookmarked_rules');
    return saved ? JSON.parse(saved) : {};
  });

  // Must-Pass Mastery Checklist
  const [checkedMustPass, setCheckedMustPass] = useState(() => {
    const saved = localStorage.getItem('nature_mustpass_checked');
    return saved ? JSON.parse(saved) : {};
  });

  // Toggle Bookmark
  const handleToggleBookmark = (code) => {
    setBookmarkedCodes((prev) => {
      const updated = { ...prev, [code]: !prev[code] };
      localStorage.setItem('nature_bookmarked_rules', JSON.stringify(updated));
      return updated;
    });
  };

  // Toggle Must-Pass Check
  const handleToggleMustPassCheck = (code, e) => {
    if (e && e.stopPropagation) e.stopPropagation();
    setCheckedMustPass((prev) => {
      const updated = { ...prev, [code]: !prev[code] };
      localStorage.setItem('nature_mustpass_checked', JSON.stringify(updated));
      return updated;
    });
  };

  // Auto-Sync with Google Sheets on Mount (앱 진입 시 자동 실시간 최신화)
  useEffect(() => {
    async function doAutoSync() {
      try {
        const syncRes = await autoSyncWithGoogleSheets(rules, goldenNumbers);
        if (syncRes.success) {
          if (syncRes.updatedGoldenNumbers && syncRes.updatedGoldenNumbers.length > 0) {
            setGoldenNumbers(syncRes.updatedGoldenNumbers);
          }
          if (syncRes.updatedQuiz && syncRes.updatedQuiz.length > 0) {
            setQuizList(syncRes.updatedQuiz);
          }
          if (syncRes.updatedRules && syncRes.updatedRules.length > 0) {
            setRules(syncRes.updatedRules);
          }
          if (syncRes.updatedSpillKit) setSpillKitData(syncRes.updatedSpillKit);
          const nowStr = new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });
          setSyncStatus({ synced: true, time: nowStr });
        } else {
          setSyncStatus({ synced: false, time: null, error: syncRes.error || '동기화에 실패했습니다.' });
        }
      } catch (err) {
        console.warn('Auto-sync notice:', err.message);
      }
    }
    doAutoSync();
  }, []);

  // Theme & Font Scale to Body
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.style.setProperty('--font-scale', fontScale);
  }, [theme, fontScale]);

  // Navigate to Handbook with Chapter
  const handleOpenChapter = (chapterId) => {
    setMustPassFilter(false);
    setChapterFilter(chapterId);
    setActiveTab('handbook');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Navigate to Handbook with Must-Pass filter
  const handleOpenMustPass = () => {
    setMustPassFilter(true);
    setChapterFilter(null);
    setActiveTab('handbook');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Open Single Rule Reader
  const handleOpenRule = (code) => {
    setActiveRuleCode(code);
  };

  // Reader Next / Prev Logic
  const currentRuleIndex = useMemo(() => {
    if (!activeRuleCode) return -1;
    return rules.findIndex((r) => r.code === activeRuleCode);
  }, [rules, activeRuleCode]);

  const currentRule = currentRuleIndex >= 0 ? rules[currentRuleIndex] : null;

  const handlePrevRule = () => {
    if (currentRuleIndex > 0) {
      setActiveRuleCode(rules[currentRuleIndex - 1].code);
    }
  };

  const handleNextRule = () => {
    if (currentRuleIndex < rules.length - 1) {
      setActiveRuleCode(rules[currentRuleIndex + 1].code);
    }
  };

  // Manual Trigger Sync from Settings
  const handleManualSync = async () => {
    const syncRes = await autoSyncWithGoogleSheets(rules, goldenNumbers);
    if (syncRes.success) {
      if (syncRes.updatedGoldenNumbers && syncRes.updatedGoldenNumbers.length > 0) {
        setGoldenNumbers(syncRes.updatedGoldenNumbers);
      }
      if (syncRes.updatedQuiz && syncRes.updatedQuiz.length > 0) {
        setQuizList(syncRes.updatedQuiz);
      }
      if (syncRes.updatedRules && syncRes.updatedRules.length > 0) setRules(syncRes.updatedRules);
      if (syncRes.updatedSpillKit) setSpillKitData(syncRes.updatedSpillKit);
      const nowStr = new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });
      setSyncStatus({ synced: true, time: nowStr });
      return true;
    }
    setSyncStatus({ synced: false, time: null, error: syncRes.error || '동기화에 실패했습니다.' });
    return false;
  };

  return (
    <div className="app-container">
      {/* 1. Header (Clean Minimalist Mobile & Desktop Header) */}
      <Header
        onOpenEmergency={setEmergencyModal}
        onOpenSettings={() => setActiveTab('settings')}
        onOpenFeedback={() => handleOpenFeedback(activeRuleCode ? `[${activeRuleCode}]` : '')}
        syncStatus={syncStatus}
        activeTab={activeTab}
        onNavigateTab={setActiveTab}
      />

      {/* 2. Main Body Content (Code Splitting with Suspense) */}
      <main className="main-content">
        <Suspense fallback={<TabLoadingFallback />}>
          {/* TAB 1: 홈 */}
          {activeTab === 'home' && (
            <HomeHub
              rules={rules}
              checkedMustPass={checkedMustPass}
              selectedDept={selectedDept}
              onSelectDept={handleSelectDept}
              onNavigateTab={setActiveTab}
              onOpenRule={handleOpenRule}
              onOpenChapter={handleOpenChapter}
              onOpenEmergency={setEmergencyModal}
              onOpenMustPass={handleOpenMustPass}
            />
          )}

          {/* TAB 2: 규정집 */}
          {activeTab === 'handbook' && (
            <HandbookBrowser
              rules={rules}
              initialChapter={chapterFilter}
              initialDept={selectedDept}
              initialMustPassOnly={mustPassFilter}
              bookmarkedCodes={bookmarkedCodes}
              onToggleBookmark={handleToggleBookmark}
              checkedMustPass={checkedMustPass}
              onToggleMustPassCheck={handleToggleMustPassCheck}
              onSelectRule={handleOpenRule}
            />
          )}

          {/* TAB 3: 현장실사 조사대응 */}
          {(activeTab === 'inspection' || activeTab === 'tracer' || activeTab === 'common' || activeTab === 'brigade') && (
            <InspectionDefenseView
              selectedDept={selectedDept}
              onOpenRule={handleOpenRule}
              initialSubTab={
                activeTab === 'tracer' ? 'tracer' :
                activeTab === 'brigade' ? 'brigade' :
                activeTab === 'quick' ? 'quick' : 'common'
              }
            />
          )}

          {/* TAB 4: 기준 수치 및 실무 계산기 */}
          {(activeTab === 'golden' || activeTab === 'calc') && (
            <GoldenNumbersView
              onSelectRule={(ruleCode) => {
                setActiveRuleCode(ruleCode);
              }}
            />
          )}

          {/* TAB 5: 모의퀴즈 */}
          {activeTab === 'quiz' && (
            <QuizView
              quizList={quizList}
              rules={rules}
              userProfile={{ dept: selectedDept }}
            />
          )}

          {/* TAB 6: 설정 */}
          {activeTab === 'settings' && (
            <SettingsView
              selectedDept={selectedDept}
              onSelectDept={handleSelectDept}
              onSyncSheets={handleManualSync}
              syncStatus={syncStatus}
              theme={theme}
              setTheme={handleUpdateTheme}
              fontScale={fontScale}
              setFontScale={handleUpdateFontScale}
              inspectMode={inspectMode}
              setInspectMode={handleUpdateInspectMode}
              onResetAllData={handleResetAllData}
              onOpenFeedback={handleOpenFeedback}
            />
          )}
        </Suspense>
      </main>

      {/* 3. Bottom Navigation Bar */}
      <nav className="bottom-nav">
        <button
          className={`nav-tab-btn ${activeTab === 'home' ? 'active' : ''}`}
          onClick={() => setActiveTab('home')}
        >
          <div className="nav-icon-wrapper">
            <Home size={20} strokeWidth={activeTab === 'home' ? 2.5 : 1.9} />
          </div>
          <span className="nav-tab-label">홈</span>
        </button>

        <button
          className={`nav-tab-btn ${activeTab === 'handbook' ? 'active' : ''}`}
          onClick={() => {
            setChapterFilter(null);
            setMustPassFilter(false);
            setActiveTab('handbook');
          }}
        >
          <div className="nav-icon-wrapper">
            <BookOpen size={20} strokeWidth={activeTab === 'handbook' ? 2.5 : 1.9} />
          </div>
          <span className="nav-tab-label">규정집</span>
        </button>

        <button
          className={`nav-tab-btn ${activeTab === 'inspection' || activeTab === 'tracer' ? 'active' : ''}`}
          onClick={() => setActiveTab('inspection')}
        >
          <div className="nav-icon-wrapper">
            <ShieldCheck size={20} strokeWidth={activeTab === 'inspection' || activeTab === 'tracer' ? 2.6 : 2} />
          </div>
          <span className="nav-tab-label">조사대응</span>
        </button>

        <button
          className={`nav-tab-btn ${activeTab === 'golden' || activeTab === 'calc' ? 'active' : ''}`}
          onClick={() => setActiveTab('golden')}
        >
          <div className="nav-icon-wrapper">
            <Clock size={20} strokeWidth={activeTab === 'golden' || activeTab === 'calc' ? 2.5 : 1.9} />
          </div>
          <span className="nav-tab-label">기준수치</span>
        </button>

        {!inspectMode && (
          <button
            className={`nav-tab-btn ${activeTab === 'quiz' ? 'active' : ''}`}
            onClick={() => setActiveTab('quiz')}
          >
            <div className="nav-icon-wrapper">
              <HelpCircle size={20} strokeWidth={activeTab === 'quiz' ? 2.5 : 1.9} />
            </div>
            <span className="nav-tab-label">모의퀴즈</span>
          </button>
        )}
      </nav>

      {/* Lazy-Loaded Modals wrapped in Suspense */}
      <Suspense fallback={null}>
        {/* 4. Single Rule Pocket Reader */}
        {currentRule && (
          <PocketCardReader
            rule={currentRule}
            onClose={() => setActiveRuleCode(null)}
            onPrev={handlePrevRule}
            onNext={handleNextRule}
            hasPrev={currentRuleIndex > 0}
            hasNext={currentRuleIndex < rules.length - 1}
            isBookmarked={!!bookmarkedCodes[currentRule.code]}
            onToggleBookmark={handleToggleBookmark}
            isMustPassChecked={!!checkedMustPass[currentRule.code]}
            onToggleMustPassCheck={handleToggleMustPassCheck}
            goldenNumbers={goldenNumbers}
            onOpenFeedback={handleOpenFeedback}
          />
        )}

        {/* 5. Emergency Action Popups */}
        {emergencyModal && (
          <EmergencyModal
            type={emergencyModal}
            spillKitData={spillKitData}
            onClose={() => setEmergencyModal(null)}
          />
        )}

        {/* 6. Feedback & Bug Report Modal */}
        <FeedbackModal
          isOpen={isFeedbackOpen}
          onClose={() => setIsFeedbackOpen(false)}
          initialTargetRule={feedbackTargetRule}
          userDept={selectedDept}
        />
      </Suspense>
    </div>
  );
}
