const fs = require('fs');
const path = require('path');

const authenticData = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../app/src/data/authenticRulesData.json'), 'utf8'));
const authMap = {};
authenticData.forEach(item => {
  authMap[item.code] = item;
});

const deptUtilsPath = path.resolve(__dirname, '../app/src/utils/deptUtils.js');
let deptUtilsContent = fs.readFileSync(deptUtilsPath, 'utf8');

// Build updated DEPARTMENT_QUICK_ANSWERS
const colors = ['emerald', 'amber', 'teal', 'indigo', 'purple', 'blue', 'rose'];

const DEPT_CODE_MAPPINGS = {
  '간호부': ['1.1', '1.2', '1.3', '2.2.2', '2.3.1', '3.1.5', '3.2.1', '3.2.2', '3.2.3', '4.2', '10.6'],
  '진료부': ['1.1', '2.2.1', '2.2.2', '3.1.1', '3.1.2', '3.1.3', '3.1.6', '3.1.7', '3.2.1', '3.2.3', '5.5'],
  'QPS실': ['6.1', '6.2', '6.3', '12.1', '1.1', '1.2', '9.2'],
  '감염관리실': ['1.3', '7.1', '7.2', '7.3', '7.4', '7.7', '9.4'],
  '원무과': ['2.1.1', '2.1.2', '2.1.4', '5.1', '5.2', '5.3', '5.4', '8.1', '9.3', '11.1', '11.2', '11.3'],
  '재활치료실': ['1.1', '1.2', '3.1.3', '7.2', '7.4', '10.5', '10.6'],
  '방사선실': ['2.3.2', '2.3.3', '10.5', '2.3.1', '1.1'],
  '약제과': ['4.1', '4.2', '4.3', '4.4', '1.1'],
  '영양팀': ['3.1.4', '7.6', '2.2.2', '10.3'],
  '시설팀': ['10.1', '10.2', '10.3', '10.4', '10.6', '5.6']
};

const updatedAnswers = {};
for (const [dept, codeList] of Object.entries(DEPT_CODE_MAPPINGS)) {
  updatedAnswers[dept] = codeList.map((code, idx) => {
    const r = authMap[code];
    return {
      code: code,
      title: r.title,
      answer: r.quickAnswer,
      color: colors[idx % colors.length]
    };
  });
}

// Format as JS string
const answersStr = 'export const DEPARTMENT_QUICK_ANSWERS = ' + JSON.stringify(updatedAnswers, null, 2) + ';\n';

// Replace in file
const exportIdx = deptUtilsContent.indexOf('export const DEPARTMENT_QUICK_ANSWERS =');
if (exportIdx !== -1) {
  deptUtilsContent = deptUtilsContent.slice(0, exportIdx) + answersStr;
  fs.writeFileSync(deptUtilsPath, deptUtilsContent, 'utf8');
  console.log('Successfully updated DEPARTMENT_QUICK_ANSWERS in deptUtils.js');
} else {
  console.error('Could not find DEPARTMENT_QUICK_ANSWERS in deptUtils.js');
}
