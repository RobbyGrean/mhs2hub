function onOpen() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('📍 ระบบเช็คชื่อ 📍')
    .addItem('➕ เปิดการประชุมใหม่', 'showDatePicker')
    .addSeparator()
    .addItem('✅ สรุปโรงเรียนที่มาเข้าประชุม', 'showAttendedSummary')
    .addItem('❌ สรุปโรงเรียนที่ไม่เข้าประชุม', 'showMissingSummary')
    .addToUi();
}

function showDatePicker() {
  var html = HtmlService.createHtmlOutputFromFile('DatePicker')
    .setWidth(300)
    .setHeight(220);
  SpreadsheetApp.getUi().showModalDialog(html, 'เลือกวันที่ประชุม');
}

function createMeetingSheetFromDate(selectedDate) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var parts = String(selectedDate || '').split('-');
  if (parts.length !== 3) {
    SpreadsheetApp.getUi().alert('รูปแบบวันที่ไม่ถูกต้อง');
    return;
  }

  var yearCE = parseInt(parts[0], 10);
  var yearBE = yearCE < 2500 ? yearCE + 543 : yearCE;
  var sheetName = parts[2] + parts[1] + yearBE.toString().substring(2);

  if (ss.getSheetByName(sheetName)) {
    SpreadsheetApp.getUi().alert('แท็บ ' + sheetName + ' มีอยู่แล้ว');
    return;
  }

  var sheet = ss.insertSheet(sheetName, 0);
  var headers = [['ชื่อโรงเรียน', 'รายชื่อผู้เข้าร่วมและตำแหน่ง', 'สถานะ', 'เวลาล่าสุด', 'หมายเหตุ']];
  sheet.getRange(1, 1, 1, 5).setValues(headers)
    .setFontWeight('bold')
    .setBackground('#cfe2f3')
    .setHorizontalAlignment('center')
    .setBorder(true, true, true, true, true, true);

  sheet.setColumnWidth(1, 250);
  sheet.setColumnWidth(2, 450);
  sheet.setColumnWidth(3, 120);
  sheet.setColumnWidth(4, 120);
  sheet.setColumnWidth(5, 200);
  sheet.setFrozenRows(1);
  SpreadsheetApp.getUi().alert('สร้างแท็บ ' + sheetName + ' เรียบร้อยแล้ว');
}

function showAttendedSummary() {
  var html = HtmlService.createHtmlOutputFromFile('AttendedSummary').setWidth(450).setHeight(550);
  SpreadsheetApp.getUi().showModalDialog(html, '✅ รายชื่อโรงเรียนที่มาเข้าร่วม');
}

function showMissingSummary() {
  var html = HtmlService.createHtmlOutputFromFile('MissingSummary').setWidth(450).setHeight(550);
  SpreadsheetApp.getUi().showModalDialog(html, '❌ รายชื่อโรงเรียนที่ยังไม่มา');
}

function doGet(e) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var masterSheet = ss.getSheetByName('MasterData');
  var currentSheet = ss.getSheets()[0];

  if (!masterSheet || !currentSheet) {
    return jsonOutput({
      schoolData: [],
      attendedCount: 0,
      missingCount: 0,
      totalCount: 0,
      recentLogs: []
    });
  }

  var page = e && e.parameter ? e.parameter.page : '';
  var masterRows = getMasterRows_(masterSheet);
  var masterSchools = masterRows.map(function(row) { return row.name; });

  if (page === 'attended' || page === 'missing') {
    return createSummaryTable(page, currentSheet, masterSchools);
  }

  var attendedMap = getAttendedMap_(currentSheet);
  var attendedCount = Object.keys(attendedMap).length;
  var totalCount = masterSchools.length;

  return jsonOutput({
    schoolData: masterRows,
    attendedCount: attendedCount,
    missingCount: Math.max(0, totalCount - attendedCount),
    totalCount: totalCount,
    recentLogs: getRecentLogs_(currentSheet, 20)
  });
}

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.waitLock(10000);

  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheets()[0];
    var data = JSON.parse((e && e.postData && e.postData.contents) || '{}');
    var school = normalizeText_(data.school);
    var name = normalizeText_(data.name);
    var position = normalizeText_(data.position);

    if (!school || !name || !position) {
      return jsonOutput({ status: 'invalid' });
    }

    var newDetails = name + ' (' + position + ')';
    var now = Utilities.formatDate(new Date(), 'GMT+7', 'HH:mm:ss');
    var foundRow = findSchoolRow_(sheet, school);

    if (foundRow > -1) {
      var existingDetails = String(sheet.getRange(foundRow, 2).getValue() || '');
      if (existingDetails.indexOf(newDetails) > -1) {
        return jsonOutput({ status: 'exists' });
      }

      sheet.getRange(foundRow, 2).setValue(existingDetails ? existingDetails + ', ' + newDetails : newDetails);
      sheet.getRange(foundRow, 3).setValue('มาแล้ว');
      sheet.getRange(foundRow, 4).setValue(now);
      return jsonOutput({ status: 'updated' });
    }

    sheet.appendRow([school, newDetails, 'มาแล้ว', now, '']);
    return jsonOutput({ status: 'success' });
  } catch (err) {
    return jsonOutput({ status: 'error', message: String(err && err.message ? err.message : err) });
  } finally {
    lock.releaseLock();
  }
}

function getMeetingStatus() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var currentSheet = ss.getSheets()[0];
  var masterSheet = ss.getSheetByName('MasterData');

  if (!masterSheet || !currentSheet) {
    return { attended: [], missing: [], totalAll: 0 };
  }

  var allSchools = getMasterRows_(masterSheet).map(function(row) { return row.name; });
  var attendedMap = getAttendedMap_(currentSheet);
  var attended = Object.keys(attendedMap).map(function(key) {
    return attendedMap[key];
  });
  var missing = allSchools.filter(function(school) {
    return !attendedMap[normalizeKey_(school)];
  });

  return {
    attended: attended,
    missing: missing,
    totalAll: allSchools.length
  };
}

function createSummaryTable(type, sheet, masterSchools) {
  var today = Utilities.formatDate(new Date(), 'GMT+7', 'd MMM yyyy');
  var dateParts = today.split(' ');
  var thaiDate = dateParts[0] + ' ' + dateParts[1] + ' ' + (parseInt(dateParts[2], 10) + 543);
  var title = type === 'attended'
    ? 'รายชื่อโรงเรียนที่มาลงทะเบียนแล้ว'
    : 'รายชื่อโรงเรียนที่ยังไม่ได้ลงทะเบียน';

  var displayData = sheet.getDataRange().getDisplayValues();
  var attendedMap = getAttendedMap_(sheet);
  var html = '<style>' +
    'body { font-family: "Sarabun", sans-serif; padding: 40px; background: #0f172a; color: #f1f5f9; } ' +
    'h2, h3 { color: #fff; text-align: center; } ' +
    'table { width: 100%; border-collapse: collapse; margin-top: 20px; background: #1e293b; border-radius: 12px; overflow: hidden; } ' +
    'th, td { border: 1px solid #334155; padding: 12px; text-align: left; } ' +
    'th { background: #4f46e5; color: white; } ' +
    'tr:nth-child(even) { background: #1e293b; } ' +
    'tr:nth-child(odd) { background: #0f172a; } ' +
    '.btn-print { background: #10b981; color: white; padding: 12px 24px; border: none; border-radius: 8px; cursor: pointer; margin-bottom: 20px; font-weight: bold; } ' +
    '@media print { body { background: white !important; color: black !important; padding: 0; } .btn-print { display: none; } table { background: white !important; color: black !important; } th, td { border: 1px solid #000 !important; color: black !important; } th { background: #eee !important; color: black !important; } tr { background: white !important; } }' +
    '</style>';

  html += '<div class="header-text"><h2>' + escapeHtml_(title) + '</h2>';
  html += '<h3>ประจำวันที่ ' + escapeHtml_(thaiDate) + '</h3></div>';
  html += '<button class="btn-print" onclick="window.print()">พิมพ์รายงาน (Print)</button>';
  html += '<table><tr><th>ลำดับ</th><th>ชื่อโรงเรียน</th><th>รายชื่อผู้เข้าร่วม</th><th>เวลาล่าสุด</th></tr>';

  var count = 1;
  if (type === 'attended') {
    var printed = {};
    for (var i = 1; i < displayData.length; i++) {
      var school = normalizeText_(displayData[i][0]);
      var key = normalizeKey_(school);
      if (!school || !attendedMap[key] || printed[key]) continue;
      printed[key] = true;
      html += '<tr><td>' + count++ + '</td><td>' + escapeHtml_(school) + '</td><td>' +
        escapeHtml_(displayData[i][1]) + '</td><td>' + escapeHtml_(displayData[i][3]) + '</td></tr>';
    }
  } else {
    masterSchools.forEach(function(school) {
      if (!attendedMap[normalizeKey_(school)]) {
        html += '<tr><td>' + count++ + '</td><td>' + escapeHtml_(school) + '</td><td>-</td><td>-</td></tr>';
      }
    });
  }

  html += '</table>';
  return HtmlService.createHtmlOutput(html).setTitle(title);
}

function getMasterRows_(masterSheet) {
  var lastRow = masterSheet.getLastRow();
  if (lastRow <= 1) return [];

  return masterSheet.getRange(2, 2, lastRow - 1, 3).getValues()
    .map(function(row) {
      return {
        name: normalizeText_(row[0]),
        tambon: normalizeText_(row[1]),
        amphure: normalizeText_(row[2])
      };
    })
    .filter(function(row) {
      return row.name;
    });
}

function getAttendedMap_(sheet) {
  var lastRow = sheet.getLastRow();
  var result = {};
  if (lastRow <= 1) return result;

  var values = sheet.getRange(2, 1, lastRow - 1, 1).getValues();
  values.forEach(function(row) {
    var school = normalizeText_(row[0]);
    if (school) result[normalizeKey_(school)] = school;
  });
  return result;
}

function getRecentLogs_(sheet, limit) {
  var lastRow = sheet.getLastRow();
  if (lastRow <= 1) return [];

  var startRow = Math.max(2, lastRow - limit + 1);
  var values = sheet.getRange(startRow, 1, lastRow - startRow + 1, 4).getDisplayValues();
  return values.reverse()
    .map(function(row) {
      return {
        school: normalizeText_(row[0]),
        details: normalizeText_(row[1]),
        time: normalizeText_(row[3])
      };
    })
    .filter(function(row) {
      return row.school;
    });
}

function findSchoolRow_(sheet, school) {
  var key = normalizeKey_(school);
  var lastRow = sheet.getLastRow();
  if (lastRow <= 1) return -1;

  var values = sheet.getRange(2, 1, lastRow - 1, 1).getValues();
  for (var i = 0; i < values.length; i++) {
    if (normalizeKey_(values[i][0]) === key) return i + 2;
  }
  return -1;
}

function normalizeText_(value) {
  return String(value || '').replace(/\s+/g, ' ').trim();
}

function normalizeKey_(value) {
  return normalizeText_(value).toLowerCase();
}

function escapeHtml_(value) {
  return String(value || '').replace(/[&<>"']/g, function(ch) {
    return {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    }[ch];
  });
}

function jsonOutput(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
