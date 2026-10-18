import React, { useState, useMemo } from 'react';
import goldenNumbersData from '../data/goldenNumbers.json';
import {
  Clock, Thermometer, Repeat, Hash, Search,
  Check, ArrowRight, ShieldCheck
} from 'lucide-react';

export default function GoldenNumbersView({ onSelectRule }) {
  const [activeCategory, setActiveCategory] = useState('전체');
  const [searchQuery, setSearchQuery] = useState('');
  const [memorized, setMemorized] = useState(() => {
    const saved = localStorage.getItem('nature_golden_memorized');
    return saved ? JSON.parse(saved) : {};
  });

  const categories = ['전체', '시간', '온도', '주기', '수치'];

  const getItemKey = (item) => `${item.category}_${item.name}_${item.value}`;

  const toggleMemorized = (item, e) => {
    e.stopPropagation();
    const key = getItemKey(item);
    setMemorized((prev) => {
      const updated = { ...prev, [key]: !prev[key] };
      localStorage.setItem('nature_golden_memorized', JSON.stringify(updated));
      return updated;
    });
  };

  const filteredData = useMemo(() => {
    return goldenNumbersData.filter((item) => {
      const matchCat =
        activeCategory === '전체' ||
        (item.category && item.category.includes(activeCategory));
      const q = searchQuery.trim().toLowerCase();
      const matchQuery =
        !q ||
        item.name.toLowerCase().includes(q) ||
        item.value.toLowerCase().includes(q) ||
        (item.question && item.question.toLowerCase().includes(q)) ||
        (item.action && item.action.toLowerCase().includes(q));
      return matchCat && matchQuery;
    });
  }, [activeCategory, searchQuery]);

  const memorizedCount = useMemo(() => {
    return goldenNumbersData.filter((g) => memorized[getItemKey(g)]).length;
  }, [memorized]);

  const progressPercent = Math.round((memorizedCount / goldenNumbersData.length) * 100);

  return (
    <div className="golden-clean-wrap">
      {/* Top Simple Banner */}
      <div className="golden-clean-head">
        <div className="head-top-row">
          <span className="clean-badge">
            <ShieldCheck size={14} /> 필수 암기 수치
          </span>
          <span className="memorize-stat">
            암기 확인: <strong>{memorizedCount}</strong> / {goldenNumbersData.length}개 ({progressPercent}%)
          </span>
        </div>
        <h2 className="head-main-title">법정 기준 및 원내 수치 모음</h2>
        <p className="head-sub-desc">
          시간, 온도, 점수, 주기 등 조사위원이 현장에서 확인하는 필수 수치입니다.
        </p>

        <div className="clean-progress-track">
          <div
            className="clean-progress-bar"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Category Pills */}
      <div className="clean-tabs-scroll">
        {categories.map((cat) => (
          <button
            key={cat}
            className={`clean-tab-pill ${activeCategory === cat ? 'active' : ''}`}
            onClick={() => setActiveCategory(cat)}
          >
            {cat === '시간' && <Clock size={13} />}
            {cat === '온도' && <Thermometer size={13} />}
            {cat === '주기' && <Repeat size={13} />}
            {cat === '수치' && <Hash size={13} />}
            <span>{cat}</span>
          </button>
        ))}
      </div>

      {/* Search Input */}
      <div className="search-input-wrapper" style={{ margin: '8px 0 12px' }}>
        <Search size={16} className="search-icon" />
        <input
          type="text"
          className="search-input"
          placeholder="수치, 질문, 기준명 검색 (예: 24시간, 냉장고, Morse)"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Clean Cards List */}
      <div className="clean-golden-list">
        {filteredData.map((item, idx) => {
          const itemKey = getItemKey(item);
          const isDone = !!memorized[itemKey];

          return (
            <div
              key={itemKey}
              className={`clean-golden-card ${isDone ? 'done' : ''}`}
            >
              <div className="cgc-top-row">
                <span className="cgc-category">{item.category}</span>
                <span className="cgc-name">{item.name}</span>
                <button
                  className={`cgc-check-btn ${isDone ? 'checked' : ''}`}
                  onClick={(e) => toggleMemorized(item, e)}
                  title={isDone ? '암기 확인 취소' : '암기 완료 체크'}
                >
                  <Check size={14} />
                  <span>{isDone ? '완료' : '체크'}</span>
                </button>
              </div>

              {/* Large Value Display */}
              <div className="cgc-value-box">
                <span className="cgc-value">{item.value}</span>
              </div>

              {/* Question & Action Guidance */}
              <div className="cgc-details">
                {item.question && (
                  <div className="cgc-q-line">
                    <strong>질문:</strong> <span>{item.question}</span>
                  </div>
                )}
                <div className="cgc-a-line">
                  <strong>지침:</strong> <span>{item.action}</span>
                </div>
              </div>

              {item.rule && (
                <div className="cgc-footer">
                  <button
                    className="cgc-rule-link"
                    onClick={() => onSelectRule && onSelectRule(item.rule)}
                  >
                    <span>관련 규정 {item.rule} 바로가기</span>
                    <ArrowRight size={12} />
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
