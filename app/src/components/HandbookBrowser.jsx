import React, { useState, useMemo, useEffect } from 'react';
import { CHAPTERS, getChapterIdByCode } from '../data/chaptersData';
import { isRuleMatchingDept } from '../utils/deptUtils';
import {
  Search, X, Star, Bookmark, Filter, ChevronRight, Check,
  Sparkles, CheckCircle2, AlertTriangle, Layers, BookOpen, ShieldAlert
} from 'lucide-react';

// Choseong Helper
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

export default function HandbookBrowser({
  rules = [],
  initialChapter = null,
  initialDept = '전체',
  initialMustPassOnly = false,
  bookmarkedCodes = {},
  onToggleBookmark,
  checkedMustPass = {},
  onToggleMustPassCheck,
  onSelectRule
}) {
  const [selectedChapter, setSelectedChapter] = useState(initialChapter);
  const [selectedDept, setSelectedDept] = useState(initialDept);
  const [mustPassOnly, setMustPassOnly] = useState(initialMustPassOnly);
  const [bookmarkOnly, setBookmarkOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (initialMustPassOnly) {
      setMustPassOnly(true);
      setSelectedChapter(null);
    }
  }, [initialMustPassOnly]);

  useEffect(() => {
    if (initialChapter !== null) {
      setSelectedChapter(initialChapter);
      setMustPassOnly(false);
    }
  }, [initialChapter]);

  const departments = [
    '전체', '간호부', '진료부', 'QPS실', '감염관리실',
    '원무과', '재활치료실', '방사선실', '약제과', '영양팀', '시설팀'
  ];

  // Filter Rules
  const filteredRules = useMemo(() => {
    return rules.filter((rule) => {
      // 1. Chapter filter
      if (selectedChapter !== null) {
        const ruleChapter = getChapterIdByCode(rule.code);
        if (ruleChapter !== selectedChapter) return false;
      }

      // 2. Must-Pass filter
      if (mustPassOnly && !rule.isMustPass) return false;

      // 3. Bookmark filter
      if (bookmarkOnly && !bookmarkedCodes[rule.code]) return false;

      // 4. Department filter (with Synonyms & Cross-Functional matching)
      if (selectedDept !== '전체') {
        if (!isRuleMatchingDept(rule, selectedDept)) return false;
      }

      // 5. Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.trim().toLowerCase();
        const qChoseong = getChoseong(q);

        const titleLower = rule.title.toLowerCase();
        const codeMatch = rule.code.includes(q);
        const titleMatch = titleLower.includes(q);
        const choseongMatch =
          (rule.choseong && rule.choseong.includes(q)) ||
          (rule.choseong && rule.choseong.includes(qChoseong));
        const quickAnswerMatch = (rule.quickAnswer || '').toLowerCase().includes(q);
        const deptMatch = rule.department?.some((d) => d.toLowerCase().includes(q));

        if (!codeMatch && !titleMatch && !choseongMatch && !quickAnswerMatch && !deptMatch) {
          return false;
        }
      }

      return true;
    });
  }, [
    rules,
    selectedChapter,
    mustPassOnly,
    bookmarkOnly,
    selectedDept,
    searchQuery,
    bookmarkedCodes
  ]);

  const activeChapterInfo = selectedChapter !== null
    ? CHAPTERS.find((c) => c.id === selectedChapter)
    : null;

  return (
    <div className="handbook-browser-wrap">
      {/* Search Header Bar */}
      <div className="browser-search-box">
        <div className="search-input-wrapper">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="초성(ㄴㅅ, ㅅㅇㅅ), 규정코드(1.1), 키워드 검색"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button className="clear-search-btn" onClick={() => setSearchQuery('')}>
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Chapter Scrollable Tabs */}
      <div className="chapter-filter-scroll">
        <button
          className={`chapter-pill ${selectedChapter === null ? 'active' : ''}`}
          onClick={() => setSelectedChapter(null)}
        >
          <Layers size={13} />
          <span>전체 12장</span>
        </button>
        {CHAPTERS.map((ch) => (
          <button
            key={ch.id}
            className={`chapter-pill ${selectedChapter === ch.id ? 'active' : ''}`}
            onClick={() => setSelectedChapter(selectedChapter === ch.id ? null : ch.id)}
          >
            <span>{ch.badge}</span>
            <span className="pill-title">{ch.title.replace(/제\d+장\s*/, '')}</span>
          </button>
        ))}
      </div>

      {/* Sub Filter Chips Bar */}
      <div className="browser-sub-filters">
        <div className="sub-filters-left">
          {/* Must-Pass Toggle */}
          <button
            className={`filter-chip ${mustPassOnly ? 'active-must' : ''}`}
            onClick={() => setMustPassOnly(!mustPassOnly)}
          >
            <Star size={13} fill={mustPassOnly ? 'currentColor' : 'none'} />
            <span>★필수 규정</span>
          </button>

          {/* Bookmark Toggle */}
          <button
            className={`filter-chip ${bookmarkOnly ? 'active-bookmark' : ''}`}
            onClick={() => setBookmarkOnly(!bookmarkOnly)}
          >
            <Bookmark size={13} fill={bookmarkOnly ? 'currentColor' : 'none'} />
            <span>북마크</span>
          </button>
        </div>

        {/* Dept Selector */}
        <select
          className="dept-select-box"
          value={selectedDept}
          onChange={(e) => setSelectedDept(e.target.value)}
        >
          {departments.map((d) => (
            <option key={d} value={d}>
              {d === '전체' ? '전체 부서' : `${d}`}
            </option>
          ))}
        </select>
      </div>

      {/* Active Chapter Banner (If selected) */}
      {activeChapterInfo && (
        <div className="active-chapter-banner">
          <div className="ac-left">
            <span className="ac-badge">{activeChapterInfo.badge}</span>
            <div>
              <h3 className="ac-title">{activeChapterInfo.title}</h3>
              <p className="ac-desc">{activeChapterInfo.subtitle}</p>
            </div>
          </div>
          <button
            className="ac-clear-btn"
            onClick={() => setSelectedChapter(null)}
            title="챕터 필터 해제"
          >
            <X size={15} />
          </button>
        </div>
      )}

      {/* P1: 🚨 Must-Pass Active Focus Banner */}
      {mustPassOnly && (
        <div style={{
          margin: '10px 0 12px',
          padding: '12px 14px',
          background: 'linear-gradient(135deg, #fff1f2 0%, #ffe4e6 100%)',
          border: '1.5px solid #fda4af',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 10,
          boxShadow: '0 2px 6px rgba(225,29,72,0.06)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: '20px', flexShrink: 0 }}>🚨</span>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 800, color: '#e11d48', display: 'flex', alignItems: 'center', gap: 6 }}>
                <span>10대 탈락방지 필수 규정 (Must-Pass) 집중 모드</span>
                <span style={{ fontSize: '10px', background: '#e11d48', color: '#fff', padding: '1px 5px', borderRadius: '4px' }}>필수</span>
              </div>
              <div style={{ fontSize: '11px', color: '#881337', marginTop: 2 }}>
                인증 불인증 직결 항목 · 전 직원 100% 암기 및 즉시 행동 지침
              </div>
            </div>
          </div>
          <button
            onClick={() => setMustPassOnly(false)}
            style={{
              padding: '5px 9px',
              fontSize: '11px',
              fontWeight: 700,
              background: '#fff',
              border: '1px solid #f43f5e',
              color: '#e11d48',
              borderRadius: '6px',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              flexShrink: 0
            }}
          >
            전체보기
          </button>
        </div>
      )}

      {/* Results Count Bar */}
      <div className="results-status-bar">
        <span>
          총 <strong>{filteredRules.length}</strong>개 규정 검색됨
        </span>
        {(mustPassOnly || bookmarkOnly || selectedDept !== '전체' || selectedChapter !== null) && (
          <button
            className="reset-filters-btn"
            onClick={() => {
              setSelectedChapter(null);
              setSelectedDept('전체');
              setMustPassOnly(false);
              setBookmarkOnly(false);
              setSearchQuery('');
            }}
          >
            필터 초기화
          </button>
        )}
      </div>

      {/* Pocket Item Cards List */}
      <div className="pocket-items-list">
        {filteredRules.length === 0 ? (
          <div className="empty-results-box">
            <BookOpen size={40} className="empty-icon" />
            <p className="empty-title">조건에 맞는 규정이 없습니다.</p>
            <p className="empty-sub">검색어나 선택된 필터를 확인해 보세요.</p>
          </div>
        ) : (
          filteredRules.map((rule) => {
            const isBookmarked = !!bookmarkedCodes[rule.code];
            const isMustChecked = !!checkedMustPass[rule.code];

            return (
              <div
                key={rule.code}
                className={`pocket-item-card ${rule.isMustPass ? 'must-pass' : ''}`}
                onClick={() => onSelectRule(rule.code)}
              >
                <div className="item-card-header">
                  <div className="item-code-row">
                    <span className={`item-code ${rule.isMustPass ? 'must' : ''}`}>
                      {rule.code}
                    </span>
                    {rule.isMustPass && (
                      <span className="item-must-tag">★필수</span>
                    )}
                    <span className="item-dept-tag">
                      {rule.department?.[0] || '전체'}
                    </span>
                  </div>

                  <div className="item-header-actions" onClick={(e) => e.stopPropagation()}>
                    {rule.isMustPass && (
                      <button
                        className={`item-check-btn ${isMustChecked ? 'checked' : ''}`}
                        onClick={(e) => onToggleMustPassCheck(rule.code, e)}
                        title={isMustChecked ? '숙지완료' : '숙지 미체크'}
                      >
                        <Check size={12} />
                        <span>{isMustChecked ? '숙지' : '체크'}</span>
                      </button>
                    )}
                    <button
                      className={`item-bookmark-btn ${isBookmarked ? 'active' : ''}`}
                      onClick={() => onToggleBookmark(rule.code)}
                      title="북마크"
                    >
                      <Bookmark size={15} fill={isBookmarked ? 'currentColor' : 'none'} />
                    </button>
                  </div>
                </div>

                <h3 className="item-title">{rule.title}</h3>

                {/* 3-Second Quick Answer One-Line Preview */}
                <div className="item-quick-preview">
                  <span className="quick-tag">3초 구두 답변</span>
                  <p className="quick-text">{rule.quickAnswer}</p>
                </div>

                <div className="item-footer">
                  <div className="item-tags-wrap">
                    {rule.forms && rule.forms[0] && (
                      <span className="item-form-badge">📄 {rule.forms[0]}</span>
                    )}
                  </div>
                  <div className="item-open-btn">
                    <span>상세 규정 열람</span>
                    <ChevronRight size={14} />
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
