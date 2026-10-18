const fs = require('fs');
const path = require('path');

// Read config from local gemini config if available
let clientId = process.env.GOOGLE_CLIENT_ID;
let clientSecret = process.env.GOOGLE_CLIENT_SECRET;
let refreshToken = process.env.GOOGLE_REFRESH_TOKEN;

const mcpConfigPath = path.resolve(process.env.USERPROFILE || 'C:/Users/ssang', '.gemini/config/mcp_config.json');
if (fs.existsSync(mcpConfigPath)) {
  try {
    const mcpConfig = JSON.parse(fs.readFileSync(mcpConfigPath, 'utf8'));
    if (mcpConfig.mcpServers?.gdrive?.env) {
      clientId = clientId || mcpConfig.mcpServers.gdrive.env.GOOGLE_CLIENT_ID;
      clientSecret = clientSecret || mcpConfig.mcpServers.gdrive.env.GOOGLE_CLIENT_SECRET;
      refreshToken = refreshToken || mcpConfig.mcpServers.gdrive.env.GOOGLE_REFRESH_TOKEN;
    }
  } catch (e) {
    console.warn('Config read note:', e.message);
  }
}

const SPREADSHEET_ID = '1kHG6C2qzSdWtrJXv-yHrC5rSUyUq4199MS_KL0m4CGE';

async function updateGoogleSheet() {
  if (!clientId || !clientSecret || !refreshToken) {
    throw new Error('Google OAuth credentials not found in environment or mcp_config.json');
  }

  console.log('1. Refreshing Google OAuth Access Token...');
  const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
      grant_type: 'refresh_token'
    })
  });
  const tokenData = await tokenRes.json();
  if (!tokenData.access_token) {
    throw new Error('Failed to obtain access token: ' + JSON.stringify(tokenData));
  }
  const token = tokenData.access_token;
  console.log('-> Access token successfully obtained.');

  console.log('2. Loading authentic 58-rule master data...');
  const authenticData = JSON.parse(
    fs.readFileSync(path.resolve(__dirname, '../app/src/data/authenticRulesData.json'), 'utf8')
  );

  const header = [
    '규정번호',
    '규정명',
    '담당부서',
    '필수여부',
    '3초핵심모범답변',
    '상세실무지침',
    '조사위원빈출질문_FAQ',
    '주요서식_점검대장'
  ];

  const rows = authenticData.map((r) => [
    r.code,
    r.title,
    r.department.join(', '),
    r.isMustPass ? '필수(Must-Pass)' : '정규',
    r.quickAnswer,
    r.keyPoints.join('; '),
    `Q: ${r.faqQuestion}\nA: ${r.faqAnswer}`,
    (r.forms || []).join('; ')
  ]);

  const allValues = [header, ...rows];
  console.log(`-> Prepared ${allValues.length} rows (1 header + ${rows.length} regulations).`);

  // Clear sheet first to remove any stale or duplicate rows
  console.log('3. Clearing existing data in 02_57개규정_마스터...');
  const clearUrl = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/02_57개규정_마스터!A1:Z150:clear`;
  const clearRes = await fetch(clearUrl, {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + token,
      'Content-Type': 'application/json'
    }
  });
  const clearJson = await clearRes.json();
  console.log('-> Clear result:', clearJson);

  // Update with authentic data
  console.log('4. Writing authentic 58-rule data to Google Sheet...');
  const updateUrl = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/02_57개규정_마스터!A1:H${allValues.length}?valueInputOption=USER_ENTERED`;
  const updateRes = await fetch(updateUrl, {
    method: 'PUT',
    headers: {
      'Authorization': 'Bearer ' + token,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      range: `02_57개규정_마스터!A1:H${allValues.length}`,
      majorDimension: 'ROWS',
      values: allValues
    })
  });

  const updateJson = await updateRes.json();
  if (updateJson.error) {
    throw new Error('Google Sheets API update error: ' + JSON.stringify(updateJson.error));
  }

  console.log('5. SUCCESS! Updated Google Sheet:');
  console.log(`-> Updated rows: ${updateJson.updatedRows}, columns: ${updateJson.updatedColumns}, cells: ${updateJson.updatedCells}`);
}

updateGoogleSheet().catch((err) => {
  console.error('Update failed:', err);
  process.exit(1);
});
