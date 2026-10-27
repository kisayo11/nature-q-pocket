import React, { useState } from 'react';
import { Calculator } from 'lucide-react';

export default function MorseCalculator() {
  const [morseHistory, setMorseHistory] = useState(0);
  const [morseSecondary, setMorseSecondary] = useState(0);
  const [morseAid, setMorseAid] = useState(0);
  const [morseIV, setMorseIV] = useState(0);
  const [morseGait, setMorseGait] = useState(0);
  const [morseMental, setMorseMental] = useState(0);

  const morseScore = Number(morseHistory) + Number(morseSecondary) + Number(morseAid) + Number(morseIV) + Number(morseGait) + Number(morseMental);

  return (
    <div className="calc-card">
      <div className="calc-title"><Calculator size={18} color="var(--primary)" /> Morse Fall Scale 낙상 사정기</div>
      
      <div className="calc-group">
        <label className="calc-label">1. 지난 3개월간 낙상 과거력</label>
        <select className="calc-select" value={morseHistory} onChange={(e) => setMorseHistory(e.target.value)}>
          <option value="0">없음 (0점)</option>
          <option value="25">있음 (25점)</option>
        </select>
      </div>

      <div className="calc-group">
        <label className="calc-label">2. 이차 진단 (2개 이상 진단명)</label>
        <select className="calc-select" value={morseSecondary} onChange={(e) => setMorseSecondary(e.target.value)}>
          <option value="0">없음 (0점)</option>
          <option value="15">있음 (15점)</option>
        </select>
      </div>

      <div className="calc-group">
        <label className="calc-label">3. 보행 보조기구</label>
        <select className="calc-select" value={morseAid} onChange={(e) => setMorseAid(e.target.value)}>
          <option value="0">사용 안함 / 침상안정 / 휠체어 (0점)</option>
          <option value="15">목발 / 지팡이 / 보행기 (15점)</option>
          <option value="30">가구 등 잡고 보행 (30점)</option>
        </select>
      </div>

      <div className="calc-group">
        <label className="calc-label">4. 정맥수액 요법 / 헤파린 락</label>
        <select className="calc-select" value={morseIV} onChange={(e) => setMorseIV(e.target.value)}>
          <option value="0">없음 (0점)</option>
          <option value="20">투여 중 (20점)</option>
        </select>
      </div>

      <div className="calc-group">
        <label className="calc-label">5. 걸음걸이</label>
        <select className="calc-select" value={morseGait} onChange={(e) => setMorseGait(e.target.value)}>
          <option value="0">정상 / 부동 (0점)</option>
          <option value="10">허약함 (10점)</option>
          <option value="20">장애가 있음 (20점)</option>
        </select>
      </div>

      <div className="calc-group">
        <label className="calc-label">6. 정신 상태</label>
        <select className="calc-select" value={morseMental} onChange={(e) => setMorseMental(e.target.value)}>
          <option value="0">자신의 기능을 인지함 (0점)</option>
          <option value="15">자신의 기능을 과대평가/망각함 (15점)</option>
        </select>
      </div>

      <div className={`calc-result-box ${morseScore >= 51 ? 'danger' : ''}`}>
        <div className="calc-score-display">{morseScore} 점</div>
        <div style={{ fontWeight: 800, fontSize: '15px' }}>
          {morseScore <= 24 ? '🟢 정상 (낙상 위험 낮음)' : morseScore <= 50 ? '🟡 저위험군 (기본 예방활동)' : '🔴 낙상 고위험군 (집중 간호중재)'}
        </div>
        {morseScore >= 51 && (
          <div style={{ marginTop: 8, fontSize: '12px', lineHeight: 1.5, background: 'rgba(255,255,255,0.7)', padding: '8px', borderRadius: '6px' }}>
            <strong>필수 중재:</strong> 1) 손목밴드 '낙상고' 빨간 스티커 부착, 2) 침상 이름표 낙상주의 표시지, 3) EMR '고' 입력, 4) 사이드레일 고정
          </div>
        )}
      </div>
    </div>
  );
}
