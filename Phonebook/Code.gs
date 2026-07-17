// ===================================================
// สมุดโทรศัพท์ ผอ.โรงเรียน สพป.มส.2
// Google Apps Script — Web App Backend
// Deploy: Extensions → Apps Script → Deploy → Web App
// ===================================================

const SHEET_NAME = 'เบอร์โทร';
const DATA_START_ROW = 5;
const COL = { ID: 1, SCHOOL: 2, DIRECTOR: 3, TAMBON: 4, AMPHOE: 5, PHONE: 6 };

function getSheet() {
  return SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
}

function doGet(e) {
  const action = e.parameter.action || 'list';
  let result;
  try {
    if (action === 'list') result = listAll();
    else if (action === 'add') result = addRecord(JSON.parse(e.parameter.data || '{}'));
    else if (action === 'update') result = updateRecord(e.parameter.rowIndex, JSON.parse(e.parameter.data || '{}'));
    else if (action === 'delete') result = deleteRecord(e.parameter.rowIndex);
    else result = { error: 'Unknown action' };
  } catch (err) {
    result = { error: err.message };
  }
  return ContentService.createTextOutput(JSON.stringify(result)).setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  let body, result;
  try {
    body = JSON.parse(e.postData.contents);
    if (body.action === 'add') result = addRecord(body.data);
    else if (body.action === 'update') result = updateRecord(body.rowIndex, body.data);
    else if (body.action === 'delete') result = deleteRecord(body.rowIndex);
    else result = { error: 'Unknown action' };
  } catch (err) {
    result = { error: err.message };
  }
  return ContentService.createTextOutput(JSON.stringify(result)).setMimeType(ContentService.MimeType.JSON);
}

function listAll() {
  const sheet = getSheet();
  const lastRow = sheet.getLastRow();
  if (lastRow < DATA_START_ROW) return { records: [] };
  const values = sheet.getRange(DATA_START_ROW, 1, lastRow - DATA_START_ROW + 1, 6).getValues();
  const records = [];
  values.forEach((row, i) => {
    const school = String(row[COL.SCHOOL - 1] || '').trim();
    if (!school) return;
    records.push({
      rowIndex: DATA_START_ROW + i,
      school,
      director: String(row[COL.DIRECTOR - 1] || '').trim(),
      tambon: String(row[COL.TAMBON - 1] || '').trim(),
      amphoe: String(row[COL.AMPHOE - 1] || '').trim(),
      phone: String(row[COL.PHONE - 1] || '').trim(),
    });
  });
  return { records };
}

function addRecord(data) {
  const sheet = getSheet();
  const newRow = sheet.getLastRow() + 1;
  sheet.getRange(newRow, COL.ID).setValue(newRow - DATA_START_ROW + 1);
  sheet.getRange(newRow, COL.SCHOOL).setValue(data.school || '');
  sheet.getRange(newRow, COL.DIRECTOR).setValue(data.director || '');
  sheet.getRange(newRow, COL.TAMBON).setValue(data.tambon || '');
  sheet.getRange(newRow, COL.AMPHOE).setValue(data.amphoe || '');
  sheet.getRange(newRow, COL.PHONE).setValue(data.phone || '');
  return { ok: true, rowIndex: newRow };
}

function updateRecord(rowIndex, data) {
  const sheet = getSheet();
  const ri = Number(rowIndex);
  if (ri < DATA_START_ROW || ri > sheet.getLastRow()) return { error: 'Invalid rowIndex: ' + ri };
  sheet.getRange(ri, COL.SCHOOL).setValue(data.school || '');
  sheet.getRange(ri, COL.DIRECTOR).setValue(data.director || '');
  sheet.getRange(ri, COL.TAMBON).setValue(data.tambon || '');
  sheet.getRange(ri, COL.AMPHOE).setValue(data.amphoe || '');
  sheet.getRange(ri, COL.PHONE).setValue(data.phone || '');
  return { ok: true };
}

function deleteRecord(rowIndex) {
  const sheet = getSheet();
  const ri = Number(rowIndex);
  if (ri < DATA_START_ROW || ri > sheet.getLastRow()) return { error: 'Invalid rowIndex: ' + ri };
  sheet.deleteRow(ri);
  renumberSeq();
  return { ok: true };
}

function renumberSeq() {
  const sheet = getSheet();
  const lastRow = sheet.getLastRow();
  if (lastRow < DATA_START_ROW) return;
  for (let r = DATA_START_ROW; r <= lastRow; r++) {
    sheet.getRange(r, COL.ID).setValue(r - DATA_START_ROW + 1);
  }
}
