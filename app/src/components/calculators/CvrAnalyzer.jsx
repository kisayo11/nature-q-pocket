import React, { useState } from 'react';
import { Calculator } from 'lucide-react';

export default function CvrAnalyzer() {
  const [cvrTest, setCvrTest] = useState('k');
  const [cvrValue, setCvrValue] = useState('');

  const checkCvr = () => {
    const val = parseFloat(cvrValue);
    if (isNaN(val)) return null;

    if (cvrTest === 'hb') {
      if (val < 7.0) return { alert: true, msg: 'CVR 경고치! 급성 빈혈 및 활동성 출혈 위험 (수혈 검토). 즉시 주치의 보고!' };
    } else if (cvrTest === 'glucose') {
      if (val < 50) return { alert: true, msg: 'CVR 초응급! 저혈당 쇼크 위험. 즉시 당 공급(의식 있을 시 주스, 의식 없으면 포도당 IV) 및 주치의 보고!' };
      if (val > 400) return { alert: true, msg: 'CVR 경고치! 고혈당성 혼수 위기. 즉시 주치의 보고!' };
    } else if (cvrTest === 'k') {
      if (val < 2.8 || val > 6.0) return { alert: true, msg: 'CVR 초응급! 치명적 부정맥 및 심정지 유발 위험. 즉시 심전도 감시 및 주치의 긴급 보고!' };
    } else if (cvrTest === 'platelet') {
      if (val < 50) return { alert: true, msg: 'CVR 경고치! 자발적 출혈 및 지혈 장애 위험. 주치의 보고!' };
    }
    return { alert: false, msg: '정상 또는 일반 관리 범위입니다.' };
  };

  const cvrResult = checkCvr();

  return (
    <div className="calc-card">
      <div className="calc-title"><Calculator size={18} color="var(--primary)" /> CVR (임계검사치) 즉시 판독기</div>

      <div className="calc-group">
        <label className="calc-label">검사 항목 선택</label>
        <select className="calc-select" value={cvrTest} onChange={(e) => setCvrTest(e.target.value)}>
          <option value="k">K (Potassium) - CVR: &lt;2.8 or &gt;6.0 mmol/L</option>
          <option value="glucose">Glucose - CVR: &lt;50 or &gt;400 mg/dL</option>
          <option value="hb">Hb (Hemoglobin) - CVR: &lt;7.0 g/dL</option>
          <option value="platelet">Platelet - CVR: &lt;50 10³/μL</option>
        </select>
      </div>

      <div className="calc-group">
        <label className="calc-label">측정 결과값 입력</label>
        <input
          type="number"
          step="0.1"
          className="calc-input"
          placeholder="예: 2.5 또는 450"
          value={cvrValue}
          onChange={(e) => setCvrValue(e.target.value)}
        />
      </div>

      {cvrResult && (
        <div className={`calc-result-box ${cvrResult.alert ? 'danger' : ''}`}>
          <div style={{ fontWeight: 900, fontSize: '15px' }}>
            {cvrResult.alert ? '🚨 CVR 이상치 감지!' : '✅ 일반 수치'}
          </div>
          <div style={{ fontSize: '13px', marginTop: 6, lineHeight: 1.5 }}>
            {cvrResult.msg}
          </div>
        </div>
      )}
    </div>
  );
}
