import fs from 'fs';

const quizList = JSON.parse(fs.readFileSync('src/data/quizData.json', 'utf8'));

// Format to TSV for Google Sheets pasting
const headers = ['문제ID', '카테고리', '난이도', '유형', '문제내용', '보기1', '보기2', '보기3', '보기4', '정답', '해설', '관련규정'];
const rows = [headers.join('\t')];

quizList.forEach((q) => {
  const opt1 = q.options[0] || '';
  const opt2 = q.options[1] || '';
  const opt3 = q.options[2] || '';
  const opt4 = q.options[3] || '';
  
  // 1-based index or O/X
  let ansStr = '';
  if (q.type === 'OX') {
    ansStr = q.answer === 0 ? 'O' : 'X';
  } else {
    ansStr = String(q.answer + 1);
  }

  const clean = (str) => (str || '').replace(/\t/g, ' ').replace(/\r?\n/g, ' ');

  const row = [
    clean(q.id),
    clean(q.category),
    clean(q.difficulty),
    clean(q.type),
    clean(q.question),
    clean(opt1),
    clean(opt2),
    clean(opt3),
    clean(opt4),
    clean(ansStr),
    clean(q.explanation),
    clean(q.rule)
  ];
  rows.push(row.join('\t'));
});

fs.writeFileSync('quiz_for_google_sheets.tsv', rows.join('\n'), 'utf8');
console.log('Successfully generated quiz_for_google_sheets.tsv with', quizList.length, 'questions!');
