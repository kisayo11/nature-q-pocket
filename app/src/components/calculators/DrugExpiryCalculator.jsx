import React, { useState } from 'react';
import { Calculator, Copy, Check } from 'lucide-react';

export default function DrugExpiryCalculator() {
  const [drugType, setDrugType] = useState('insulin');
  const [openDate, setOpenDate] = useState(() => {
    const today = new Date();
    const pad = (n) => String(n).padStart(2, '0');
    return `${today.getFullYear()}-${pad(today.getMonth() + 1)}-${pad(today.getDate())}`;
  });
  const [copied, setCopied] = useState(false);

  const calculateExpiry = () => {
    const baseDate = openDate ? new Date(openDate) : new Date();
    const expiry = new Date(baseDate);
    let label = '';
    let days = 28;

    if (drugType === 'insulin' || drugType === 'eye') {
      days = 28;
      label = '개봉 후 28일';
    } else if (drugType === 'syrup_open' || drugType === 'ointment_open') {
      days = 180;
      label = '개봉 후 6개월';
    } else if (drugType === 'syrup_sub' || drugType === 'ointment_sub') {
      days = 30;
      label = '소분 후 30일(1개월)';
    }

    expiry.setDate(baseDate.getDate() + days);

    const pad = (n) => String(n).padStart(2, '0');
    const openDateStr = `${baseDate.getFullYear()}-${pad(baseDate.getMonth() + 1)}-${pad(baseDate.getDate())}`;
    const expiryStr = `${expiry.getFullYear()}-${pad(expiry.getMonth() + 1)}-${pad(expiry.getDate())}`;

    return { openDateStr, expiryStr, label };
  };

  const { openDateStr, expiryStr, label } = calculateExpiry();
  const labelText = `[약품라벨] 개봉일: ${openDateStr} / 폐기일: ${expiryStr} (${label})`;

  const copyLabel = () => {
    navigator.clipboard.writeText(labelText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="calc-card">
      <div className="calc-title"><Calculator size={18} color="var(--primary)" /> 의약품 개봉 후 유효기간 계산기</div>

      <div className="calc-group">
        <label className="calc-label">약품 종류 선택</label>
        <select className="calc-select" value={drugType} onChange={(e) => setDrugType(e.target.value)}>
          <option value="insulin">인슐린 주사제 (개봉 후 28일)</option>
          <option value="eye">안약 / 안연고 (개봉 후 28일)</option>
          <option value="syrup_open">경구 시럽제 원제품 (개봉 후 6개월)</option>
          <option value="syrup_sub">경구 시럽제 소분병 (소분 후 1개월)</option>
          <option value="ointment_open">외용 연고 원제품 (개봉 후 6개월)</option>
          <option value="ointment_sub">외용 연고 소분통 (소분 후 30일)</option>
        </select>
      </div>

      <div className="calc-group">
        <label className="calc-label">개봉일자 직접 선택</label>
        <input
          type="date"
          className="calc-input"
          value={openDate}
          onChange={(e) => setOpenDate(e.target.value)}
        />
      </div>

      <div style={{ background: 'var(--surface-raised)', padding: '14px', borderRadius: '8px', marginTop: 12 }}>
        <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>기준일로부터 자동 산출:</div>
        <div style={{ fontSize: '18px', fontWeight: 900, color: 'var(--primary)', margin: '6px 0' }}>
          폐기일자: {expiryStr}
        </div>
        <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
          개봉일: {openDateStr} ({label})
        </div>

        <button
          onClick={copyLabel}
          style={{
            marginTop: 12,
            width: '100%',
            padding: '10px',
            borderRadius: '8px',
            border: 'none',
            background: copied ? 'var(--success)' : 'var(--primary)',
            color: '#fff',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6
          }}
        >
          {copied ? <Check size={16} /> : <Copy size={16} />}
          {copied ? '라벨 텍스트 복사됨!' : '라벨 텍스트 복사하기'}
        </button>
      </div>
    </div>
  );
}
