const fs = require('fs');
const path = require('path');

const rulesDataPath = path.resolve(__dirname, '../app/src/data/rulesData.json');
const authenticDataPath = path.resolve(__dirname, '../app/src/data/authenticRulesData.json');

const rulesData = JSON.parse(fs.readFileSync(rulesDataPath, 'utf8'));
const authenticData = JSON.parse(fs.readFileSync(authenticDataPath, 'utf8'));

const authMap = {};
authenticData.forEach(item => {
  authMap[item.code] = item;
});

const merged = rulesData.map(rule => {
  const auth = authMap[rule.code];
  if (!auth) {
    console.warn('No authentic entry for rule code:', rule.code);
    return rule;
  }

  const faqText = `Q: ${auth.faqQuestion}\nA: ${auth.faqAnswer}`;
  const searchKey = `${auth.code} ${auth.title} ${rule.choseong || ''} ${(auth.department || []).join(' ')} ${auth.isMustPass ? '필수 mustpass' : ''}`.trim();

  return {
    ...rule,
    code: auth.code,
    title: auth.title,
    isMustPass: auth.isMustPass,
    department: auth.department,
    purpose: auth.purpose || rule.purpose,
    quickAnswer: auth.quickAnswer,
    faq: faqText,
    faqQuestion: auth.faqQuestion,
    faqAnswer: auth.faqAnswer,
    keyPoints: auth.keyPoints,
    forms: auth.forms || rule.forms || [],
    searchKey: searchKey,
    pdfUrl: `/regulations/${auth.code}.pdf`
  };
});

fs.writeFileSync(rulesDataPath, JSON.stringify(merged, null, 2), 'utf8');
console.log('Successfully merged authentic data into rulesData.json. Total count:', merged.length);
