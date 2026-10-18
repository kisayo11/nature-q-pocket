import React, { useState, useEffect, useMemo } from 'react';
import {
  Award, CheckCircle2, XCircle, RotateCcw, Sparkles,
  HelpCircle, ArrowRight, ArrowLeft, Shuffle, BookMarked,
  Filter, AlertTriangle
} from 'lucide-react';
import defaultQuizData from '../data/quizData.json';
import defaultRulesData from '../data/rulesData.json';
import { isRuleMatchingDept } from '../utils/deptUtils';

// Fisher-Yates Random Shuffle
function shuffleArray(arr) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export default function QuizView({ quizList = defaultQuizData, rules = defaultRulesData, userProfile }) {
  const rawList = quizList && quizList.length > 0 ? quizList : defaultQuizData;

  const [quizMode, setQuizMode] = useState('quiz'); // 'quiz' | 'flashcard'
  const [filterMode, setFilterMode] = useState('all'); // 'all' | 'dept' | 'wrong' | 'must'
  const [questionCount, setQuestionCount] = useState(30); // 10 | 30 | 60
  
  // Shuffled items state (랜덤 셔플된 문제 리스트)
  const [shuffledList, setShuffledList] = useState(() => shuffleArray(rawList));
  
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [solvedCount, setSolvedCount] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  // Wrong questions tracker (오답 노트)
  const [wrongQuestionIds, setWrongQuestionIds] = useState(() => {
    const saved = localStorage.getItem('nature_wrong_quiz_ids');
    return saved ? JSON.parse(saved) : {};
  });

  // Quiz Finished state (결과 요약창)
  const [isQuizFinished, setIsQuizFinished] = useState(false);

  // Re-shuffle when master quizList changes
  useEffect(() => {
    setShuffledList(shuffleArray(rawList));
    setCurrentIdx(0);
    setSelectedOption(null);
    setShowResult(false);
    setIsQuizFinished(false);
  }, [quizList]);

  // Active Questions filtered by Mode & Count
  const activeQuestions = useMemo(() => {
    let list = shuffledList;
    if (filterMode === 'wrong') {
      return shuffledList.filter((q) => wrongQuestionIds[q.id]);
    }
    if (filterMode === 'must') {
      const mustRules = ['1.1', '1.2', '1.3', '5.2', '5.6', '9.3', '9.4', '10.6', '3.2.1', '3.2.3'];
      const filtered = shuffledList.filter((q) => mustRules.includes(q.rule));
      return filtered.length > 0 ? filtered : shuffledList;
    }
    if (filterMode === 'dept') {
      const myDept = userProfile?.dept || '간호부';
      const ruleMap = Object.fromEntries((rules || defaultRulesData).map((r) => [r.code, r]));
      const filtered = shuffledList.filter((q) => {
        const r = ruleMap[q.rule];
        return r ? isRuleMatchingDept(r, myDept) : false;
      });
      return filtered.length > 0 ? filtered : shuffledList;
    }
    // Standard 'all' mode: limit to questionCount (e.g. 30 questions)
    if (questionCount && list.length > questionCount) {
      return list.slice(0, questionCount);
    }
    return list;
  }, [shuffledList, filterMode, wrongQuestionIds, questionCount, userProfile?.dept, rules]);

  const currentQ = activeQuestions[currentIdx] || activeQuestions[0] || rawList[0];

  // Manual Re-shuffle & Restart
  const handleShuffle = () => {
    setShuffledList(shuffleArray(rawList));
    setCurrentIdx(0);
    setSelectedOption(null);
    setShowResult(false);
    setIsFlipped(false);
    setIsQuizFinished(false);
    setScore(0);
    setSolvedCount(0);
  };

  const handleSelectOption = (idx) => {
    if (showResult) return;
    setSelectedOption(idx);
    setShowResult(true);
    setSolvedCount((c) => c + 1);

    const isCorrect = idx === currentQ.answer;
    if (isCorrect) {
      setScore((s) => s + 1);
      // Remove from wrong list if answered correctly
      if (wrongQuestionIds[currentQ.id]) {
        setWrongQuestionIds((prev) => {
          const updated = { ...prev };
          delete updated[currentQ.id];
          localStorage.setItem('nature_wrong_quiz_ids', JSON.stringify(updated));
          return updated;
        });
      }
    } else {
      // Add to wrong list
      setWrongQuestionIds((prev) => {
        const updated = { ...prev, [currentQ.id]: true };
        localStorage.setItem('nature_wrong_quiz_ids', JSON.stringify(updated));
        return updated;
      });
    }
  };

  const handleNext = () => {
    setSelectedOption(null);
    setShowResult(false);
    setIsFlipped(false);
    if (currentIdx < activeQuestions.length - 1) {
      setCurrentIdx(currentIdx + 1);
    } else {
      // All questions in this set completed -> Show Results Summary!
      setIsQuizFinished(true);
    }
  };

  const handlePrev = () => {
    setSelectedOption(null);
    setShowResult(false);
    setIsFlipped(false);
    if (currentIdx > 0) {
      setCurrentIdx(currentIdx - 1);
    } else {
      setCurrentIdx(activeQuestions.length - 1);
    }
  };

  const wrongCount = Object.keys(wrongQuestionIds).length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {/* 1. Main 2-Segment Switcher (실전 퀴즈 / 플래시 암기카드) */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        <button
          onClick={() => {
            setQuizMode('quiz');
            setIsFlipped(false);
          }}
          style={{
            padding: '12px 8px',
            borderRadius: '10px',
            border: 'none',
            fontSize: '13px',
            fontWeight: 800,
            cursor: 'pointer',
            background: quizMode === 'quiz' ? 'var(--primary)' : 'var(--surface-raised)',
            color: quizMode === 'quiz' ? '#fff' : 'var(--text-muted)',
            boxShadow: quizMode === 'quiz' ? '0 2px 8px rgba(15, 118, 110, 0.25)' : 'none',
            transition: 'all 0.15s ease'
          }}
        >
          ✍️ 실전 모의 퀴즈 ({activeQuestions.length}문항)
        </button>
        <button
          onClick={() => {
            setQuizMode('flashcard');
            setIsFlipped(false);
          }}
          style={{
            padding: '12px 8px',
            borderRadius: '10px',
            border: 'none',
            fontSize: '13px',
            fontWeight: 800,
            cursor: 'pointer',
            background: quizMode === 'flashcard' ? 'var(--primary)' : 'var(--surface-raised)',
            color: quizMode === 'flashcard' ? '#fff' : 'var(--text-muted)',
            boxShadow: quizMode === 'flashcard' ? '0 2px 8px rgba(15, 118, 110, 0.25)' : 'none',
            transition: 'all 0.15s ease'
          }}
        >
          💡 핵심 플래시 암기카드
        </button>
      </div>

      {/* 2. Practical Filter & Shuffle Bar (실무 필터 & 무작위 섞기) */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--surface-raised)', padding: '8px 12px', borderRadius: '8px', fontSize: '12px', flexWrap: 'wrap', gap: 6 }}>
        <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
          <button
            onClick={() => {
              setFilterMode('all');
              setCurrentIdx(0);
              setSelectedOption(null);
              setShowResult(false);
              setIsQuizFinished(false);
            }}
            style={{
              padding: '4px 8px',
              borderRadius: '6px',
              border: 'none',
              fontWeight: filterMode === 'all' ? 800 : 600,
              background: filterMode === 'all' ? 'var(--primary)' : 'var(--surface)',
              color: filterMode === 'all' ? '#fff' : 'var(--text-muted)',
              cursor: 'pointer'
            }}
          >
            전체 풀기
          </button>
          <button
            onClick={() => {
              setFilterMode('dept');
              setCurrentIdx(0);
              setSelectedOption(null);
              setShowResult(false);
              setIsQuizFinished(false);
            }}
            style={{
              padding: '4px 8px',
              borderRadius: '6px',
              border: 'none',
              fontWeight: filterMode === 'dept' ? 800 : 600,
              background: filterMode === 'dept' ? 'var(--primary)' : 'var(--surface)',
              color: filterMode === 'dept' ? '#fff' : 'var(--text-muted)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 3
            }}
          >
            <span>🏢 {userProfile?.dept || '내 부서'} 전용</span>
          </button>
          <button
            onClick={() => {
              setFilterMode('wrong');
              setCurrentIdx(0);
              setSelectedOption(null);
              setShowResult(false);
              setIsQuizFinished(false);
            }}
            style={{
              padding: '4px 8px',
              borderRadius: '6px',
              border: 'none',
              fontWeight: filterMode === 'wrong' ? 800 : 600,
              background: filterMode === 'wrong' ? 'var(--danger)' : 'var(--surface)',
              color: filterMode === 'wrong' ? '#fff' : 'var(--text-muted)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 3
            }}
          >
            <span>오답노트</span>
            {wrongCount > 0 && <span style={{ background: '#fff', color: 'var(--danger)', borderRadius: '10px', padding: '0 5px', fontSize: '10px', fontWeight: 900 }}>{wrongCount}</span>}
          </button>
          <button
            onClick={() => {
              setFilterMode('must');
              setCurrentIdx(0);
              setSelectedOption(null);
              setShowResult(false);
              setIsQuizFinished(false);
            }}
            style={{
              padding: '4px 8px',
              borderRadius: '6px',
              border: 'none',
              fontWeight: filterMode === 'must' ? 800 : 600,
              background: filterMode === 'must' ? 'hsl(45, 100%, 40%)' : 'var(--surface)',
              color: filterMode === 'must' ? '#fff' : 'var(--text-muted)',
              cursor: 'pointer'
            }}
          >
            ★필수 탈락기준
          </button>
        </div>

        {/* Random Shuffle Button */}
        <button
          onClick={handleShuffle}
          title="문제 순서 무작위 섞기"
          style={{
            padding: '5px 10px',
            borderRadius: '6px',
            border: '1px solid var(--border)',
            background: 'var(--surface)',
            color: 'var(--text-main)',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 4
          }}
        >
          <Shuffle size={13} color="var(--primary)" />
          <span>순서 섞기</span>
        </button>
      </div>

      {/* 2-1. Question Count Selector (30문항 실전모의 / 60문항 전체 / 10문항 스피드) */}
      {(filterMode === 'all' || filterMode === 'dept') && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 4px', fontSize: '11.5px', color: 'var(--text-sub)' }}>
          <span style={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}>
            <span>출제 범위:</span>
            <strong style={{ color: 'var(--primary)' }}>{activeQuestions.length}문항</strong>
          </span>
          <div style={{ display: 'flex', gap: 5 }}>
            {[
              { count: 30, label: '30문항 (실전모의)' },
              { count: 60, label: '60문항 (전체)' },
              { count: 10, label: '10문항 (스피드)' }
            ].map(({ count, label }) => (
              <button
                key={count}
                onClick={() => {
                  setQuestionCount(count);
                  setCurrentIdx(0);
                  setSelectedOption(null);
                  setShowResult(false);
                }}
                style={{
                  padding: '4px 9px',
                  borderRadius: '12px',
                  border: '1px solid',
                  borderColor: questionCount === count ? 'var(--primary)' : 'var(--border)',
                  background: questionCount === count ? 'var(--primary-light)' : 'var(--surface-raised)',
                  color: questionCount === count ? 'var(--primary)' : 'var(--text-sub)',
                  fontWeight: questionCount === count ? 800 : 600,
                  fontSize: '11px',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* MODE 1: 실전 모의 퀴즈 */}
      {quizMode === 'quiz' && (
        <>
          {/* A. Empty State for Wrong Notes */}
          {filterMode === 'wrong' && activeQuestions.length === 0 ? (
            <div className="calc-card" style={{ textAlign: 'center', padding: '36px 20px' }}>
              <div style={{ fontSize: '42px', marginBottom: 12 }}>🎉</div>
              <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--primary)', marginBottom: 8 }}>
                오답노트가 비어 있습니다!
              </h3>
              <p style={{ fontSize: '13.5px', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: 20 }}>
                현재 틀린 문제 없이 완벽하게 학습 중이십니다.<br />
                실전 모의고사를 풀다가 틀린 문제가 생기면 이곳에 자동으로 보관됩니다.
              </p>
              <button
                onClick={() => {
                  setFilterMode('all');
                  setCurrentIdx(0);
                  setIsQuizFinished(false);
                }}
                style={{
                  padding: '12px 24px',
                  borderRadius: '10px',
                  background: 'var(--primary)',
                  color: '#fff',
                  fontWeight: 800,
                  fontSize: '14px',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                전체 모의고사 풀러 가기
              </button>
            </div>
          ) : isQuizFinished ? (
            /* B. Quiz Completed Score Summary Screen */
            <div className="calc-card" style={{ textAlign: 'center', padding: '30px 20px' }}>
              <div style={{ fontSize: '46px', marginBottom: 10 }}>
                {Math.round((score / activeQuestions.length) * 100) >= 80 ? '🏆' : '📚'}
              </div>
              <span style={{
                display: 'inline-block',
                padding: '4px 12px',
                borderRadius: '14px',
                fontSize: '12px',
                fontWeight: 800,
                background: Math.round((score / activeQuestions.length) * 100) >= 80 ? 'var(--primary-light)' : 'var(--warning-light)',
                color: Math.round((score / activeQuestions.length) * 100) >= 80 ? 'var(--primary)' : 'var(--warning)',
                marginBottom: 10
              }}>
                {Math.round((score / activeQuestions.length) * 100) >= 80 ? '인증 실사 합격선 도달' : '취약 항목 보충 권장'}
              </span>

              <h2 style={{ fontSize: '22px', fontWeight: 900, color: 'var(--text-main)', marginBottom: 6 }}>
                모의평가 완료!
              </h2>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: 20 }}>
                총 {activeQuestions.length}문항 중 <strong>{score}문항 정답</strong> (정답률 {Math.round((score / activeQuestions.length) * 100)}%)
              </p>

              {/* Score Metric Card */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: 8,
                background: 'var(--surface-raised)',
                padding: '14px 10px',
                borderRadius: '12px',
                marginBottom: 20
              }}>
                <div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>총 문항</div>
                  <strong style={{ fontSize: '16px', color: 'var(--text-main)' }}>{activeQuestions.length}</strong>
                </div>
                <div>
                  <div style={{ fontSize: '11px', color: 'var(--success)' }}>정답</div>
                  <strong style={{ fontSize: '16px', color: 'var(--success)' }}>{score}</strong>
                </div>
                <div>
                  <div style={{ fontSize: '11px', color: 'var(--danger)' }}>오답</div>
                  <strong style={{ fontSize: '16px', color: 'var(--danger)' }}>{activeQuestions.length - score}</strong>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {wrongCount > 0 && (
                  <button
                    onClick={() => {
                      setFilterMode('wrong');
                      setCurrentIdx(0);
                      setSelectedOption(null);
                      setShowResult(false);
                      setIsQuizFinished(false);
                    }}
                    style={{
                      width: '100%',
                      padding: '13px',
                      borderRadius: '10px',
                      background: 'var(--danger)',
                      color: '#fff',
                      fontWeight: 800,
                      fontSize: '14px',
                      border: 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 6
                    }}
                  >
                    <span>오답노트 {wrongCount}문제 집중 복습하기</span>
                    <ArrowRight size={16} />
                  </button>
                )}

                <button
                  onClick={handleShuffle}
                  style={{
                    width: '100%',
                    padding: '13px',
                    borderRadius: '10px',
                    background: 'var(--primary)',
                    color: '#fff',
                    fontWeight: 800,
                    fontSize: '14px',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 6
                  }}
                >
                  <RotateCcw size={16} />
                  <span>새로운 문제로 다시 풀기</span>
                </button>

                <button
                  onClick={() => {
                    setQuizMode('flashcard');
                    setIsQuizFinished(false);
                  }}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '10px',
                    background: 'var(--surface-raised)',
                    border: '1px solid var(--border)',
                    color: 'var(--text-main)',
                    fontWeight: 700,
                    fontSize: '13.5px',
                    cursor: 'pointer'
                  }}
                >
                  💡 암기카드로 핵심 요점 빠르게 훑기
                </button>
              </div>
            </div>
          ) : (
            /* C. Standard Active Question Screen */
            <div className="calc-card">
              {/* Quiz Header Bar */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                <span style={{ fontSize: '12px', fontWeight: 800, color: 'var(--primary)', background: 'var(--primary-light)', padding: '4px 10px', borderRadius: '6px' }}>
                  {currentQ.category} • 기준 {currentQ.rule}
                </span>
                <span style={{ fontSize: '13px', fontWeight: 800, color: 'var(--text-main)' }}>
                  문제 <strong>{currentIdx + 1}</strong> / {activeQuestions.length}
                </span>
              </div>

              {/* Question Text */}
              <div style={{ fontSize: '16px', fontWeight: 800, lineHeight: 1.55, marginBottom: 18, color: 'var(--text-main)' }}>
                {currentQ.question}
              </div>

              {/* Options */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {currentQ.options.map((opt, idx) => {
                  let optBg = 'var(--surface-raised)';
                  let optBorder = 'var(--border)';
                  let optColor = 'var(--text-main)';

                  if (showResult) {
                    if (idx === currentQ.answer) {
                      optBg = 'var(--primary-light)';
                      optBorder = 'var(--primary)';
                      optColor = 'var(--primary)';
                    } else if (idx === selectedOption) {
                      optBg = 'var(--danger-light)';
                      optBorder = 'var(--danger)';
                      optColor = 'var(--danger)';
                    }
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelectOption(idx)}
                      disabled={showResult}
                      style={{
                        padding: '14px 16px',
                        borderRadius: '10px',
                        border: `1.5px solid ${optBorder}`,
                        background: optBg,
                        color: optColor,
                        fontSize: '14px',
                        fontWeight: 700,
                        textAlign: 'left',
                        cursor: showResult ? 'default' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <span>{opt}</span>
                      {showResult && idx === currentQ.answer && <CheckCircle2 size={18} color="var(--primary)" />}
                      {showResult && idx === selectedOption && idx !== currentQ.answer && <XCircle size={18} color="var(--danger)" />}
                    </button>
                  );
                })}
              </div>

              {/* Result Feedback & Explanation */}
              {showResult && (
                <div style={{ marginTop: 18, padding: '14px 16px', borderRadius: '10px', background: 'var(--surface-raised)', borderLeft: `4px solid ${selectedOption === currentQ.answer ? 'var(--primary)' : 'var(--danger)'}` }}>
                  <div style={{ fontWeight: 800, fontSize: '14px', color: selectedOption === currentQ.answer ? 'var(--primary)' : 'var(--danger)', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
                    {selectedOption === currentQ.answer ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
                    <span>{selectedOption === currentQ.answer ? '정답입니다! 완벽하게 숙지하셨습니다.' : '오답입니다. 오답노트에 자동 저장되었습니다.'}</span>
                  </div>
                  <div style={{ fontSize: '13px', lineHeight: 1.6, color: 'var(--text-main)' }}>
                    <strong>해설 및 실무 팁:</strong> {currentQ.explanation}
                  </div>

                  <div style={{ marginTop: 14, display: 'flex', gap: 8 }}>
                    <button
                      onClick={handleNext}
                      style={{
                        flex: 1,
                        background: 'var(--primary)',
                        color: '#fff',
                        border: 'none',
                        padding: '12px 14px',
                        borderRadius: '8px',
                        fontWeight: 800,
                        fontSize: '14px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 6
                      }}
                    >
                      <span>{currentIdx === activeQuestions.length - 1 ? '최종 결과 확인하기' : '다음 문제 풀기'}</span>
                      <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              )}

              {/* Bottom Score & Navigation Bar (결과 확인 전 이전/다음 이동) */}
              {!showResult && (
                <div style={{ marginTop: 20, paddingTop: 14, borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                    진행: <strong>{currentIdx + 1}</strong> / {activeQuestions.length}
                  </span>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button
                      onClick={handlePrev}
                      style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid var(--border)', background: 'var(--surface)', fontSize: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}
                    >
                      <ArrowLeft size={13} /> 이전
                    </button>
                    <button
                      onClick={handleNext}
                      style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid var(--border)', background: 'var(--surface)', fontSize: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}
                    >
                      건너뛰기 <ArrowRight size={13} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </>
      )}

      {/* MODE 2: 핵심 플래시 암기카드 (무작위 셔플) */}
      {quizMode === 'flashcard' && (
        <div className="calc-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <span style={{ fontSize: '12px', fontWeight: 800, color: 'var(--primary)', background: 'var(--primary-light)', padding: '4px 10px', borderRadius: '6px' }}>
              암기카드 {currentIdx + 1} / {activeQuestions.length} (무작위)
            </span>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              카드를 터치하면 정답이 공개됩니다
            </span>
          </div>

          {/* Flip Flashcard */}
          <div
            onClick={() => setIsFlipped(!isFlipped)}
            style={{
              minHeight: '220px',
              background: isFlipped ? 'var(--primary-light)' : 'var(--surface-raised)',
              border: `2px solid ${isFlipped ? 'var(--primary)' : 'var(--border)'}`,
              borderRadius: '14px',
              padding: '24px 20px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'all 0.25s ease',
              boxShadow: isFlipped ? '0 4px 14px rgba(15, 118, 110, 0.15)' : 'none'
            }}
          >
            {!isFlipped ? (
              <>
                <div style={{ fontSize: '12px', fontWeight: 800, color: 'var(--text-muted)', marginBottom: 8 }}>
                  [문제 Q] 터치하여 정답 확인
                </div>
                <div style={{ fontSize: '16px', fontWeight: 800, lineHeight: 1.6, color: 'var(--text-main)' }}>
                  {currentQ.question}
                </div>
                <div style={{ marginTop: 16, fontSize: '11px', color: 'var(--primary)', fontWeight: 700 }}>
                  👉 탭하여 해설과 모범 답안 보기
                </div>
              </>
            ) : (
              <>
                <div style={{ fontSize: '12px', fontWeight: 800, color: 'var(--primary)', marginBottom: 6 }}>
                  [정답] {currentQ.options[currentQ.answer]}
                </div>
                <div style={{ fontSize: '14px', fontWeight: 700, lineHeight: 1.6, color: 'var(--text-main)', marginTop: 8 }}>
                  {currentQ.explanation}
                </div>
                <div style={{ marginTop: 12, fontSize: '12px', color: 'var(--text-muted)' }}>
                  관련 인증 기준: 규정 <strong>{currentQ.rule}</strong>
                </div>
              </>
            )}
          </div>

          {/* Flashcard Controls */}
          <div style={{ marginTop: 18, display: 'flex', gap: 10, justifyContent: 'center' }}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handlePrev();
              }}
              style={{
                flex: 1,
                background: 'var(--surface-raised)',
                border: '1px solid var(--border)',
                padding: '12px',
                borderRadius: '8px',
                fontSize: '13px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6
              }}
            >
              <ArrowLeft size={15} /> 이전 카드
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsFlipped(!isFlipped);
              }}
              style={{
                flex: 1,
                background: isFlipped ? 'var(--surface)' : 'var(--primary-light)',
                color: 'var(--primary)',
                border: '1px solid var(--primary)',
                padding: '12px',
                borderRadius: '8px',
                fontSize: '13px',
                fontWeight: 800,
                cursor: 'pointer'
              }}
            >
              {isFlipped ? '문제 다시 보기' : '정답 뒤집기'}
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleNext();
              }}
              style={{
                flex: 1,
                background: 'var(--primary)',
                color: '#fff',
                border: 'none',
                padding: '12px',
                borderRadius: '8px',
                fontSize: '13px',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6
              }}
            >
              <span>다음 카드</span>
              <ArrowRight size={15} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
