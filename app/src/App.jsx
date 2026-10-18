import React, { useState, useEffect, useMemo } from 'react';
import Header from './components/Header';
import HomeHub from './components/HomeHub';
import HandbookBrowser from './components/HandbookBrowser';
import PocketCardReader from './components/PocketCardReader';
import GoldenNumbersView from './components/GoldenNumbersView';
import EmergencyModal from './components/EmergencyModal';
import Calculators from './components/Calculators';
import QuizView from './components/QuizView';
import SettingsView from './components/SettingsView';

import initialRules from './data/rulesData.json';
import initialGoldenNumbers from './data/goldenNumbers.json';
import initialQuizList from './data/quizData.json';
import { autoSyncWithGoogleSheets } from './utils/googleSheetsSync';

import {
  Home, BookOpen, Clock, Calculator, Settings, HelpCircle
} from 'lucide-react';

export default function App() {
  const [rules, setRules] = useState(initialRules);
  const [goldenNumbers, setGoldenNumbers] = useState(initialGoldenNumbers);
  const [quizList, setQuizList] = useState(initialQuizList);
  const [activeTab, setActiveTab] = useState('home'); // 'home' | 'handbook' | 'golden' | 'calc' | 'quiz' | 'settings'

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
          const nowStr = new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });
          setSyncStatus({ synced: true, time: nowStr });
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
      const nowStr = new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });
      setSyncStatus({ synced: true, time: nowStr });
    }
  };

  return (
    <div className="app-container">
      {/* 1. Header (Clean Minimalist Mobile Header) */}
      <Header
        onOpenEmergency={setEmergencyModal}
        onOpenSettings={() => setActiveTab('settings')}
        syncStatus={syncStatus}
        activeTab={activeTab}
      />

      {/* 2. Main Body Content */}
      <main className="main-content">
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

        {/* TAB 3: 기준 수치 (시간·온도·주기) */}
        {activeTab === 'golden' && (
          <GoldenNumbersView
            onSelectRule={(ruleCode) => {
              setActiveRuleCode(ruleCode);
            }}
          />
        )}

        {/* TAB 4: 실무 계산기 */}
        {activeTab === 'calc' && <Calculators />}

        {/* TAB 5: 퀴즈 */}
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
          />
        )}
      </main>

      {/* 3. Bottom Navigation Bar */}
      <nav className="bottom-nav">
        <button
          className={`nav-tab-btn ${activeTab === 'home' ? 'active' : ''}`}
          onClick={() => setActiveTab('home')}
        >
          <Home size={20} />
          <span className="nav-tab-label">홈</span>
        </button>

        <button
          className={`nav-tab-btn ${activeTab === 'handbook' ? 'active' : ''}`}
          onClick={() => {
            setChapterFilter(null);
            setActiveTab('handbook');
          }}
        >
          <BookOpen size={20} />
          <span className="nav-tab-label">규정집</span>
        </button>

        <button
          className={`nav-tab-btn ${activeTab === 'golden' ? 'active' : ''}`}
          onClick={() => setActiveTab('golden')}
        >
          <Clock size={20} />
          <span className="nav-tab-label">기준수치</span>
        </button>

        <button
          className={`nav-tab-btn ${activeTab === 'calc' ? 'active' : ''}`}
          onClick={() => setActiveTab('calc')}
        >
          <Calculator size={20} />
          <span className="nav-tab-label">계산기</span>
        </button>

        {!inspectMode && (
          <button
            className={`nav-tab-btn ${activeTab === 'quiz' ? 'active' : ''}`}
            onClick={() => setActiveTab('quiz')}
          >
            <HelpCircle size={20} />
            <span className="nav-tab-label">모의퀴즈</span>
          </button>
        )}
      </nav>

      {/* 4. Single Rule Pocket Reader (3분할 탭 모달) */}
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
        />
      )}

      {/* 5. Emergency Action Popups */}
      {emergencyModal && (
        <EmergencyModal
          type={emergencyModal}
          onClose={() => setEmergencyModal(null)}
        />
      )}
    </div>
  );
}
