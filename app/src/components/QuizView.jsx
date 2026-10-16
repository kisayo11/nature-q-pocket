import React, { useState } from 'react';
import { Award, CheckCircle2, XCircle, RotateCcw, Sparkles, Trophy } from 'lucide-react';
import quizData from '../data/quizData.json';

export default function QuizView({ userProfile }) {
  const [quizMode, setQuizMode] = useState('quiz'); // 'quiz' | 'flashcard' | 'ranking'
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const currentQ = quizData[currentIdx] || quizData[0];

  const handleSelectOption = (idx) => {
    if (showResult) return;
    setSelectedOption(idx);
    setShowResult(true);
    if (idx === currentQ.answer) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    setSelectedOption(null);
    setShowResult(false);
    if (currentIdx < quizData.length - 1) {
      setCurrentIdx(currentIdx + 1);
    } else {
      setCurrentIdx(0);
    }
  };

  return (
    <div>
      {/* Sub Menu Switcher */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 6, marginBottom: 14 }}>
        <button
          onClick={() => setQuizMode('quiz')}
          style={{
            padding: '8px 4px',
            borderRadius: '8px',
            border: 'none',
            fontSize: '12px',
            fontWeight: 800,
            cursor: 'pointer',
            background: quizMode === 'quiz' ? 'var(--primary)' : 'var(--surface)',
            color: quizMode === 'quiz' ? '#fff' : 'var(--text-muted)'
          }}
        >
          오늘의 1분 퀴즈
        </button>
        <button
          onClick={() => setQuizMode('flashcard')}
          style={{
            padding: '8px 4px',
            borderRadius: '8px',
            border: 'none',
            fontSize: '12px',
            fontWeight: 800,
            cursor: 'pointer',
            background: quizMode === 'flashcard' ? 'var(--primary)' : 'var(--surface)',
            color: quizMode === 'flashcard' ? '#fff' : 'var(--text-muted)'
          }}
        >
          플래시 암기카드
        </button>
        <button
          onClick={() => setQuizMode('ranking')}
          style={{
            padding: '8px 4px',
            borderRadius: '8px',
            border: 'none',
            fontSize: '12px',
            fontWeight: 800,
            cursor: 'pointer',
            background: quizMode === 'ranking' ? 'var(--primary)' : 'var(--surface)',
            color: quizMode === 'ranking' ? '#fff' : 'var(--text-muted)'
          }}
        >
          부서별 랭킹
        </button>
      </div>

      {/* 1. Daily Quiz Mode */}
      {quizMode === 'quiz' && (
        <div className="calc-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <span style={{ fontSize: '12px', fontWeight: 800, color: 'var(--primary)', background: 'var(--primary-light)', padding: '2px 8px', borderRadius: '4px' }}>
              {currentQ.category} • 기준 {currentQ.rule}
            </span>
            <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)' }}>
              문제 {currentIdx + 1} / {quizData.length}
            </span>
          </div>

          <div style={{ fontSize: '15px', fontWeight: 800, lineHeight: 1.5, marginBottom: 16 }}>
            {currentQ.question}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {currentQ.options.map((opt, idx) => {
              let btnStyle = {
                padding: '12px 14px',
                borderRadius: '8px',
                border: '1px solid var(--border)',
                background: 'var(--surface-raised)',
                textAlign: 'left',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                color: 'var(--text-main)',
                transition: 'all 0.15s ease'
              };

              if (showResult) {
                if (idx === currentQ.answer) {
                  btnStyle.background = 'var(--success-light)';
                  btnStyle.borderColor = 'var(--success)';
                  btnStyle.color = 'var(--success)';
                  btnStyle.fontWeight = 800;
                } else if (selectedOption === idx) {
                  btnStyle.background = 'var(--danger-light)';
                  btnStyle.borderColor = 'var(--danger)';
                  btnStyle.color = 'var(--danger)';
                }
              }

              return (
                <button key={idx} style={btnStyle} onClick={() => handleSelectOption(idx)}>
                  <span>{idx + 1}. {opt}</span>
                  {showResult && idx === currentQ.answer && <CheckCircle2 size={16} color="var(--success)" />}
                  {showResult && selectedOption === idx && idx !== currentQ.answer && <XCircle size={16} color="var(--danger)" />}
                </button>
              );
            })}
          </div>

          {showResult && (
            <div style={{ marginTop: 14, padding: '12px', background: 'var(--surface-raised)', borderRadius: '8px', borderLeft: '4px solid var(--primary)' }}>
              <div style={{ fontSize: '12px', fontWeight: 800, color: 'var(--primary)', marginBottom: 2 }}>해설 및 암기 팁</div>
              <div style={{ fontSize: '13px', lineHeight: 1.5 }}>{currentQ.explanation}</div>
              <button
                onClick={handleNext}
                style={{
                  marginTop: 12,
                  width: '100%',
                  padding: '10px',
                  borderRadius: '8px',
                  border: 'none',
                  background: 'var(--primary)',
                  color: '#fff',
                  fontWeight: 800,
                  fontSize: '13px',
                  cursor: 'pointer'
                }}
              >
                다음 문제 풀기 ➔
              </button>
            </div>
          )}
        </div>
      )}

      {/* 2. Flashcard Mode */}
      {quizMode === 'flashcard' && (
        <div
          onClick={() => setIsFlipped(!isFlipped)}
          style={{
            background: isFlipped ? 'var(--primary-light)' : 'var(--surface)',
            border: isFlipped ? '2px solid var(--primary)' : '1px solid var(--border)',
            borderRadius: '16px',
            padding: '30px 20px',
            minHeight: '260px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
            cursor: 'pointer',
            boxShadow: 'var(--shadow-md)',
            transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
            position: 'relative'
          }}
        >
          <div style={{ position: 'absolute', top: 12, right: 14, fontSize: '11px', color: 'var(--text-muted)' }}>
            탭하여 카드 뒤집기 🔄
          </div>

          <div style={{ fontSize: '11px', fontWeight: 800, color: isFlipped ? 'var(--primary)' : 'var(--secondary)', marginBottom: 8 }}>
            {isFlipped ? '🌟 조사위원 앞 모범 구두 답변' : `❓ 조사위원 질문 [기준 ${currentQ.rule}]`}
          </div>

          <div style={{ fontSize: '16px', fontWeight: 800, lineHeight: 1.6, color: 'var(--text-main)' }}>
            {isFlipped ? currentQ.explanation : currentQ.question}
          </div>

          <div style={{ marginTop: 20, display: 'flex', gap: 10 }}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsFlipped(false);
                handleNext();
              }}
              style={{
                background: 'var(--surface-raised)',
                border: '1px solid var(--border)',
                padding: '6px 14px',
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              다음 카드 ➔
            </button>
          </div>
        </div>
      )}

      {/* 3. Department Ranking Mode */}
      {quizMode === 'ranking' && (
        <div className="calc-card">
          <div className="calc-title"><Trophy size={18} color="hsl(45, 100%, 45%)" /> 부서별 인증 퀴즈 달성 랭킹</div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 10 }}>
            {[
              { rank: 1, dept: '3병동 간호팀', rate: '98%', count: '242회 풀이' },
              { rank: 2, dept: '6병동 간호팀', rate: '95%', count: '210회 풀이' },
              { rank: 3, dept: '원무행정팀', rate: '92%', count: '145회 풀이' },
              { rank: 4, dept: '영양팀', rate: '89%', count: '102회 풀이' },
              { rank: 5, dept: '시설안전팀', rate: '86%', count: '88회 풀이' },
              { rank: 6, dept: '진료부 (의사/한의사)', rate: '84%', count: '65회 풀이' }
            ].map((item, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 14px',
                  background: item.rank <= 3 ? 'var(--primary-light)' : 'var(--surface-raised)',
                  borderRadius: '8px',
                  borderLeft: item.rank === 1 ? '4px solid hsl(45, 100%, 45%)' : item.rank === 2 ? '4px solid hsl(0, 0%, 75%)' : item.rank === 3 ? '4px solid hsl(25, 75%, 55%)' : 'none'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontWeight: 900, fontSize: '15px', width: '20px' }}>
                    {item.rank === 1 ? '🥇' : item.rank === 2 ? '🥈' : item.rank === 3 ? '🥉' : `${item.rank}.`}
                  </span>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '14px' }}>{item.dept}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{item.count}</div>
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontWeight: 900, fontSize: '16px', color: 'var(--primary)' }}>{item.rate}</span>
                  <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>정답률</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
