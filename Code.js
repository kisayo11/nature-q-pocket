// 1. GET 요청: 현재 접수된 피드백 목록 전체 조회 (JSON)
function doGet(e) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("06_오류신고_피드백");
  if (!sheet) {
    return ContentService.createTextOutput(JSON.stringify({ list: [] }))
      .setMimeType(ContentService.MimeType.JSON);
  }
  
  var data = sheet.getDataRange().getValues();
  var rows = [];
  for (var i = 1; i < data.length; i++) {
    rows.push({
      rowIndex: i + 1, // 실제 시트 행 번호
      timestamp: data[i][0],
      department: data[i][1],
      author: data[i][2],
      targetRule: data[i][3],
      content: data[i][4],
      status: data[i][5],
      memo: data[i][6]
    });
  }
  return ContentService.createTextOutput(JSON.stringify({ list: rows }))
    .setMimeType(ContentService.MimeType.JSON);
}

// 2. POST 요청: 신규 등록 OR 처리상태/메모 업데이트
function doPost(e) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName("06_오류신고_피드백");
    
    if (!sheet) {
      sheet = ss.insertSheet("06_오류신고_피드백");
      sheet.appendRow(["접수일시", "소속부서", "작성자", "대상규정", "수정요청내용", "처리상태", "처리메모"]);
      sheet.setFrozenRows(1);
    }
    
    var data = JSON.parse(e.postData.contents);
    
    // [기능 A] 처리상태 및 메모 업데이트 (rowIndex 또는 targetRule 기준)
    if (data.action === "updateStatus") {
      var lastRow = sheet.getLastRow();
      var targetRow = data.rowIndex;
      
      // 행 번호가 지정되지 않았을 경우 대상규정(targetRule)으로 가장 최근 접수건 검색
      if (!targetRow && data.targetRule) {
        var values = sheet.getRange(2, 4, lastRow - 1, 1).getValues();
        for (var i = values.length - 1; i >= 0; i--) {
          if (String(values[i][0]).indexOf(data.targetRule) !== -1) {
            targetRow = i + 2;
            break;
          }
        }
      }
      
      if (targetRow && targetRow <= lastRow) {
        if (data.status) sheet.getRange(targetRow, 6).setValue(data.status); // F열: 처리상태
        if (data.memo) sheet.getRange(targetRow, 7).setValue(data.memo);     // G열: 처리메모
        return ContentService.createTextOutput(JSON.stringify({ result: "success", updatedRow: targetRow }))
          .setMimeType(ContentService.MimeType.JSON);
      } else {
        return ContentService.createTextOutput(JSON.stringify({ result: "not_found" }))
          .setMimeType(ContentService.MimeType.JSON);
      }
    }

    // [기능 B] 02_57개규정_마스터 시트의 특정 규정(code) 행 실시간 업데이트
    if (data.action === "updateMasterRule") {
      var masterSheet = ss.getSheetByName("02_57개규정_마스터");
      if (!masterSheet) {
        return ContentService.createTextOutput(JSON.stringify({ result: "master_sheet_not_found" }))
          .setMimeType(ContentService.MimeType.JSON);
      }
      var lastMasterRow = masterSheet.getLastRow();
      var codes = masterSheet.getRange(2, 1, lastMasterRow - 1, 1).getValues();
      var targetMasterRow = null;
      for (var j = 0; j < codes.length; j++) {
        if (String(codes[j][0]).trim() === String(data.code).trim()) {
          targetMasterRow = j + 2;
          break;
        }
      }
      if (targetMasterRow) {
        if (data.quickAnswer) masterSheet.getRange(targetMasterRow, 5).setValue(data.quickAnswer); // E열: 3초핵심모범답변
        if (data.guidelines) masterSheet.getRange(targetMasterRow, 6).setValue(data.guidelines);   // F열: 상세실무지침
        if (data.faq) masterSheet.getRange(targetMasterRow, 7).setValue(data.faq);                 // G열: FAQ
        return ContentService.createTextOutput(JSON.stringify({ result: "success", updatedRow: targetMasterRow, code: data.code }))
          .setMimeType(ContentService.MimeType.JSON);
      } else {
        return ContentService.createTextOutput(JSON.stringify({ result: "rule_not_found" }))
          .setMimeType(ContentService.MimeType.JSON);
      }
    }
    
    // [기능 B] 일반 신규 제보 접수 (기본 동작)
    var timestamp = Utilities.formatDate(new Date(), "Asia/Seoul", "yyyy-MM-dd HH:mm:ss");
    sheet.appendRow([
      timestamp,
      data.department || "미지정",
      data.author || "익명",
      data.targetRule || "일반 제보",
      data.content || "",
      "접수",
      ""
    ]);
    
    return ContentService.createTextOutput(JSON.stringify({ result: "success" }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ result: "error", message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
