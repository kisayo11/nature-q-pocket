# [가이드] 원내 오류 신고/수정 제보 구글 스프레드시트 30초 연동 매뉴얼

본 가이드는 병원 임직원들이 모바일 웹앱에서 제출한 오류/수정 제보가 **네이처요양병원 마스터 구글 스프레드시트에 실시간으로 자동 누적**되도록 세팅하는 30초 매뉴얼입니다.

---

## 1. 구글 스프레드시트 탭(시트) 생성
1. 사용 중이신 **네이처요양병원 마스터 스프레드시트**를 엽니다.
2. 맨 아래쪽의 **`+` (시트 추가)** 버튼을 누릅니다.
3. 탭 이름을 **`06_오류신고_피드백`** 으로 변경합니다.
4. 첫 번째 줄(1행)에 아래 헤더 항목들을 입력합니다:
   * **A1**: `접수일시`
   * **B1**: `소속부서`
   * **C1**: `작성자`
   * **D1**: `대상규정`
   * **E1**: `수정요청내용`
   * **F1**: `처리상태`
   * **G1**: `처리메모`

---

## 2. Google Apps Script 복사 & 웹 앱 배포 (핵심)
1. 스프레드시트 상단 메뉴에서 **[확장 프로그램] ➔ [Apps Script]** 를 클릭합니다.
2. 기존에 적혀있는 기본 코드를 모두 지우고, 아래 코드를 그대로 붙여넣습니다:

```javascript
function doPost(e) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName("06_오류신고_피드백");
    
    // 시트가 없으면 자동 생성 및 헤더 세팅
    if (!sheet) {
      sheet = ss.insertSheet("06_오류신고_피드백");
      sheet.appendRow(["접수일시", "소속부서", "작성자", "대상규정", "수정요청내용", "처리상태", "처리메모"]);
      sheet.setFrozenRows(1);
    }
    
    var data = JSON.parse(e.postData.contents);
    var timestamp = Utilities.formatDate(new Date(), "Asia/Seoul", "yyyy-MM-dd HH:mm:ss");
    
    // 데이터 행 실시간 추가
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
```

3. 저장(디스켓 아이콘 또는 Ctrl+S)을 누릅니다.
4. 우측 상단의 파란색 **[배포] ➔ [새 배포]** 버튼을 클릭합니다.
5. 왼쪽 상단 톱니바퀴 ⚙️ 아이콘을 눌러 **[웹 앱]**을 선택합니다:
   * **설명**: `오류신고 접수 API`
   * **다음 사용자로 실행**: `나(내 계정)`
   * **액세스 권한**: **`모든 사용자` (Anyone)** ⭐️ *(필수! 병원 직원들이 로그인 없이 제보할 수 있게 됩니다)*
6. **[배포]** 버튼을 누릅니다. (최초 1회 구글 계정 권한 승인 창이 뜨면 허용해 주세요)
7. 화면에 발급되는 **웹 앱 URL (`https://script.google.com/macros/s/.../exec`)** 을 복사합니다.

---

## 3. 웹앱에 URL 등록하기
* **방법 1 (앱 내 설정 화면)**:
  * 웹앱을 열고 하단 **[설정 ⚙️]** 탭으로 이동합니다.
  * `[원내 오류 신고 및 수정 제보]` 카드 하단의 **[Google Apps Script 웹 앱 연동 URL]** 입력칸에 복사한 주소를 넣고 **[저장]**을 누르면 즉시 연동 완료!
* **방법 2 (채팅창 전달)**:
  * 발급받으신 URL을 에이전트 채팅창에 알려주시면 환경변수/소스코드 기본값에 즉시 반영해 드립니다.
