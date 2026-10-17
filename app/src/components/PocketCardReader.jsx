import React, { useState } from 'react';
import {
  X, Copy, Check, ChevronLeft, ChevronRight, Bookmark,
  AlertTriangle, HelpCircle, FileText, CheckCircle2,
  Volume2, Clock, ShieldCheck, BookOpen, Layers,
  ExternalLink, Download
} from 'lucide-react';

export default function PocketCardReader({
  rule,
  onClose,
  onPrev,
  onNext,
  hasPrev,
  hasNext,
  isBookmarked,
  onToggleBookmark,
  isMustPassChecked,
  onToggleMustPassCheck,
  goldenNumbers = []
}) {
  const [activeTab, setActiveTab] = useState('summary'); // 'summary' (핵심 요약) | 'checklist' (실천 지침) | 'fulltext' (규정 전문)
  const [copied, setCopied] = useState(false);
  const [checkedPoints, setCheckedPoints] = useState({});
  const [speaking, setSpeaking] = useState(false);
  const [pdfViewMode, setPdfViewMode] = useState('pdf'); // 'pdf' | 'text'

  if (!rule) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(rule.quickAnswer);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSpeak = () => {
    if (!('speechSynthesis' in window)) {
      handleCopy();
      return;
    }
    if (speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
      return;
    }
    const utter = new SpeechSynthesisUtterance(rule.quickAnswer);
    utter.lang = 'ko-KR';
    utter.rate = 1.0;
    utter.onend = () => setSpeaking(false);
    utter.onerror = () => setSpeaking(false);
    setSpeaking(true);
    window.speechSynthesis.speak(utter);
  };

  const togglePointCheck = (index) => {
    setCheckedPoints((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const relatedNumbers = goldenNumbers.filter(
    (g) => g.rule && (g.rule === rule.code || g.rule.startsWith(rule.code))
  );

  // Robust FAQ Q&A Resolver
  const getFaqParts = () => {
    if (rule.faqQuestion && rule.faqAnswer) {
      return { q: rule.faqQuestion, a: rule.faqAnswer };
    }
    if (!rule.faq) return null;
    let raw = rule.faq.trim();
    if (raw.startsWith('Q:') || raw.startsWith('Q.')) {
      const parts = raw.split(/A[:.]/);
      const q = parts[0].replace(/^Q[:.]\s*/, '').trim();
      const a = (parts[1] || '').trim();
      return { q, a };
    }
    if (raw.includes('?')) {
      const idx = raw.indexOf('?');
      return {
        q: raw.slice(0, idx + 1).trim(),
        a: raw.slice(idx + 1).trim()
      };
    }
    return { q: '조사위원 중점 확인 사항', a: raw };
  };

  const faqData = getFaqParts();

  return (
    <div className="reader-backdrop" onClick={onClose}>
      <div className="reader-sheet" onClick={(e) => e.stopPropagation()}>
        {/* Drag Handle Bar */}
        <div className="reader-handle-bar">
          <div className="reader-handle-pill" />
        </div>

        {/* Top Control Bar */}
        <div className="reader-top-bar">
          <div className="reader-nav-btns">
            <button
              className="reader-icon-btn"
              onClick={onPrev}
              disabled={!hasPrev}
              title="이전 규정"
            >
              <ChevronLeft size={18} />
            </button>
            <span className="reader-nav-indicator">
              규정 <strong>{rule.code}</strong>
            </span>
            <button
              className="reader-icon-btn"
              onClick={onNext}
              disabled={!hasNext}
              title="다음 규정"
            >
              <ChevronRight size={18} />
            </button>
          </div>

          <div className="reader-actions">
            <button
              className={`reader-icon-btn ${isBookmarked ? 'bookmarked' : ''}`}
              onClick={() => onToggleBookmark(rule.code)}
              title={isBookmarked ? '북마크 해제' : '북마크 저장'}
            >
              <Bookmark size={16} fill={isBookmarked ? 'currentColor' : 'none'} />
            </button>
            <button className="reader-close-btn" onClick={onClose} title="닫기">
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Title & Badge Header */}
        <div className="reader-header-minimal">
          <div className="reader-code-row">
            <span className={`reader-code-badge ${rule.isMustPass ? 'must' : ''}`}>
              {rule.code} {rule.isMustPass ? '★ 필수항목' : ''}
            </span>
            <span className="reader-dept-text">
              {rule.department?.join(', ')}
            </span>
            {rule.isMustPass && (
              <button
                className={`reader-must-toggle-btn ${isMustPassChecked ? 'checked' : ''}`}
                onClick={(e) => onToggleMustPassCheck(rule.code, e)}
              >
                <Check size={13} />
                <span>{isMustPassChecked ? '숙지완료' : '숙지확인'}</span>
              </button>
            )}
          </div>
          <h1 className="reader-title-clean">{rule.title}</h1>
        </div>

        {/* 3-Section Segmented Tab Switcher (단정하고 깔끔한 3분할 탭) */}
        <div className="reader-segmented-tabs">
          <button
            className={`reader-tab-segment ${activeTab === 'summary' ? 'active' : ''}`}
            onClick={() => setActiveTab('summary')}
          >
            <CheckCircle2 size={14} />
            <span>핵심 요약</span>
          </button>
          <button
            className={`reader-tab-segment ${activeTab === 'checklist' ? 'active' : ''}`}
            onClick={() => setActiveTab('checklist')}
          >
            <Layers size={14} />
            <span>실전 지침</span>
          </button>
          <button
            className={`reader-tab-segment ${activeTab === 'fulltext' ? 'active' : ''}`}
            onClick={() => setActiveTab('fulltext')}
          >
            <BookOpen size={14} />
            <span>공식 원문 (PDF)</span>
          </button>
        </div>

        {/* Scrollable Body Content */}
        <div className="reader-body-clean">
          {/* TAB 1: 핵심 요약 (3초 답변 + 조사위원 질의응답 + 골든넘버) */}
          {activeTab === 'summary' && (
            <div className="tab-pane-fade">
              {/* 3-Second Spoken Answer (Hero Card) */}
              <div className="clean-hero-answer">
                <div className="hero-answer-head">
                  <span className="hero-answer-tag">💡 3초 구두 모범 답변</span>
                  <div className="hero-answer-actions">
                    <button
                      className={`hero-action-btn ${speaking ? 'active' : ''}`}
                      onClick={handleSpeak}
                      title="답변 음성 듣기"
                    >
                      <Volume2 size={14} />
                      <span>{speaking ? '정지' : '듣기'}</span>
                    </button>
                    <button
                      className={`hero-action-btn ${copied ? 'copied' : ''}`}
                      onClick={handleCopy}
                      title="답변 복사"
                    >
                      {copied ? <Check size={14} /> : <Copy size={14} />}
                      <span>{copied ? '복사됨' : '복사'}</span>
                    </button>
                  </div>
                </div>
                <p className="hero-answer-text">"{rule.quickAnswer}"</p>
              </div>

              {/* Related Golden Numbers */}
              {relatedNumbers.length > 0 && (
                <div className="clean-section-block">
                  <h3 className="clean-section-title">
                    <Clock size={15} /> 꼭 외워야 할 기준 수치
                  </h3>
                  <div className="golden-chips-row">
                    {relatedNumbers.map((gn, idx) => (
                      <div key={idx} className="golden-chip-card">
                        <span className="gcc-name">{gn.name}</span>
                        <strong className="gcc-val">{gn.value}</strong>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* FAQ Q&A */}
              {faqData && (
                <div className="clean-section-block">
                  <h3 className="clean-section-title">
                    <HelpCircle size={15} /> 조사위원 주요 질의 및 핵심 사안
                  </h3>
                  <div className="clean-qa-card">
                    <div className="qa-q-row">
                      <span className="qa-badge q">질의</span>
                      <span className="qa-text-q">{faqData.q}</span>
                    </div>
                    <div className="qa-a-row">
                      <span className="qa-badge a">답변</span>
                      <span className="qa-text-a">{faqData.a}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: 실천 지침 (조사위원 현장 실사 대비 실천 체크리스트) */}
          {activeTab === 'checklist' && (
            <div className="tab-pane-fade">
              {/* Action Checklist (현장 실천 수칙) */}
              {rule.keyPoints && rule.keyPoints.length > 0 && (
                <div className="clean-section-block">
                  <div className="checklist-head-row">
                    <h3 className="clean-section-title">
                      <CheckCircle2 size={16} color="var(--primary)" />
                      <span>현장 실전 점검 수칙</span>
                    </h3>
                    <span className="checklist-count-tag">
                      {Object.values(checkedPoints).filter(Boolean).length}/{rule.keyPoints.length} 점검 완료
                    </span>
                  </div>
                  <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', marginBottom: 8, lineHeight: 1.5 }}>
                    인증 조사위원이 현장에서 직접 확인하는 핵심 실천 수칙입니다. 항목별로 확인 후 체크하세요.
                  </p>
                  <div className="clean-checklist-wrap">
                    {rule.keyPoints.map((pt, idx) => {
                      const isChecked = !!checkedPoints[idx];
                      return (
                        <label
                          key={idx}
                          className={`clean-check-item ${isChecked ? 'checked' : ''}`}
                          onClick={() => togglePointCheck(idx)}
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => { }}
                            className="clean-checkbox-input"
                          />
                          <span className="clean-check-label">{pt}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: 공식 규정집 원본 (PDF 뷰어 + 텍스트 모드 전환) */}
          {activeTab === 'fulltext' && (
            <div className="tab-pane-fade">
              {/* PDF Control & Notice Bar */}
              <div className="pdf-viewer-control-bar">
                <div className="pdf-meta-left">
                  <span className="pdf-official-tag">공식 결재본 (Ver.4)</span>
                  <span className="pdf-doc-code">규정 {rule.code}.pdf</span>
                </div>
                <div className="pdf-actions-right">
                  <a
                    href={rule.pdfUrl || `/regulations/${rule.code}.pdf`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="pdf-btn-action"
                    title="새 창으로 원본 전체화면 열람"
                  >
                    <ExternalLink size={13} />
                    <span>새 창 열기</span>
                  </a>
                  <a
                    href={rule.pdfUrl || `/regulations/${rule.code}.pdf`}
                    download={`네이처요양병원_${rule.code}_${rule.title}.pdf`}
                    className="pdf-btn-action"
                    title="PDF 파일 다운로드"
                  >
                    <Download size={13} />
                    <span>다운로드</span>
                  </a>
                  <a
                    href="/nature_handbook_print.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="pdf-btn-action handbook-link"
                    title="핸드북 파일 열람"
                  >
                    <BookOpen size={13} />
                    <span>핸드북</span>
                  </a>
                  <button
                    className={`pdf-btn-action ${pdfViewMode === 'text' ? 'active' : ''}`}
                    onClick={() => setPdfViewMode((prev) => (prev === 'pdf' ? 'text' : 'pdf'))}
                    title="PDF / 텍스트 보기 전환"
                  >
                    <FileText size={13} />
                    <span>{pdfViewMode === 'pdf' ? '텍스트 모드' : 'PDF 뷰어'}</span>
                  </button>
                </div>
              </div>

              {pdfViewMode === 'pdf' ? (
                <div className="pdf-iframe-container">
                  <iframe
                    src={`${rule.pdfUrl || `/regulations/${rule.code}.pdf`}#toolbar=0&navpanes=0`}
                    title={`${rule.code} ${rule.title} 규정집 원문`}
                    className="pdf-embed-frame"
                  />
                  <div className="pdf-fallback-hint">
                    <span>💡 스마트폰에서 확대·축소나 인쇄가 필요하시면 상단 <strong>[새 창 열기]</strong>를 터치하세요.</span>
                  </div>
                </div>
              ) : (
                <div className="clean-fulltext-card">
                  {(rule.fullTextSnippet || rule.purpose || '원문 준비 중입니다.').split('\n\n').map((paragraph, pIdx) => {
                    const trimmed = paragraph.trim();
                    if (!trimmed) return null;

                    // Section Header styling
                    if (trimmed.startsWith('[') && trimmed.includes(']')) {
                      const lines = trimmed.split('\n');
                      const header = lines[0];
                      const content = lines.slice(1).join('\n');
                      return (
                        <div key={pIdx} className="fulltext-section-box">
                          <div className="fulltext-sec-header">{header}</div>
                          <div className="fulltext-sec-body">{content}</div>
                        </div>
                      );
                    }

                    return (
                      <p key={pIdx} className="fulltext-para">
                        {trimmed}
                      </p>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
