// ============================================================
// MHS2 ASSETS MANAGEMENT — Apps Script Backend
// Sheet ID: 1FSRqZShA8HE1Bpdubm2QtJjlS4sH0gkJZdyMNcsh3WU
// ============================================================

const SS_ID  = '1FSRqZShA8HE1Bpdubm2QtJjlS4sH0gkJZdyMNcsh3WU';
const GROUPS = ['นิเทศน์','บุคคล','แผน','ICT','อำนวยการ','ส่งเสริม','ตรวจสอบ','กฎหมาย','การเงิน'];
const DAT_ROW = 5;  // data เริ่ม row 5 (row 1-2 title, row 3-4 header 2 ชั้น)

const COL = {
  NO    : 1,   // A ลำดับ
  ITEM  : 2,   // B รายการ
  BRAND : 3,   // C ยี่ห้อ
  MODEL : 4,   // D รุ่น
  SERIAL: 5,   // E Serial
  PRICE : 6,   // F ราคา/หน่วย
  DATE  : 7,   // G วันที่ได้มา
  METHOD: 8,   // H วิธีได้มา
  CODE  : 9,   // I รหัสครุภัณฑ์
  REMARK: 10,  // J หมายเหตุ
  STATUS: 11,  // K สภาพ
  USER  : 12,  // L ใช้ประจำที่/บุคลากร
};

// ============================================================
// ENTRY POINT
// ============================================================
function doGet(e) {
  const p      = e.parameter || {};
  const action = p.action || '';
  let result;
  try {
    switch (action) {
      case 'setup'          : result = setup();                              break;
      case 'login'          : result = login(p.username, p.password);       break;
      case 'list'           : result = list(p.sheet);                        break;
      case 'add'            : result = addRecord(p);                         break;
      case 'update'         : result = updateRecord(p);                      break;
      case 'delete'         : result = deleteRecord(p);                      break;
      case 'syncSummary'    : result = syncSummary();                        break;
      case 'pullDisposed'   : result = pullDisposedRecords();                break;
      case 'confirmDispose' : result = confirmDisposeRecord(p);              break;
      case 'report'         : result = report(p.sheet);                      break;
      default               : result = { error: 'unknown action: ' + action };
    }
  } catch (err) {
    result = { error: err.message };
  }
  return ContentService
    .createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
}

// ============================================================
// SETUP
// ============================================================
function setup() {
  const ss = SpreadsheetApp.openById(SS_ID);
  _ensureSheet(ss, 'บัญชีรวม', ['ลำดับ','รายการ','ยี่ห้อ','รุ่น','Serial','ราคา/หน่วย',
    'วันที่ได้มา','วิธีได้มา','รหัสครุภัณฑ์','หมายเหตุ','สภาพ','ใช้ประจำที่/บุคลากร','ชีตต้นทาง']);
  _ensureSheet(ss, 'ตัดจำหน่าย', ['ลำดับ','รายการ','ยี่ห้อ','รุ่น','Serial','ราคา/หน่วย',
    'วันที่ได้มา','วิธีได้มา','รหัสครุภัณฑ์','หมายเหตุ','สภาพ','ใช้ประจำที่/บุคลากร',
    'วันที่ตัดจำหน่าย','ผู้ดำเนินการ','ชีตต้นทาง']);
  const adminSheet = _ensureSheet(ss, 'admins', ['username','password_hash','display_name']);
  const hasAdmin = adminSheet.getDataRange().getValues().slice(1).some(r => r[0] === 'robert');
  if (!hasAdmin) adminSheet.appendRow(['robert', _sha256('58202200'), 'Robert']);
  return { ok: true, message: 'setup complete' };
}

function _ensureSheet(ss, name, headers) {
  let sh = ss.getSheetByName(name);
  if (!sh) {
    sh = ss.insertSheet(name);
    sh.appendRow(headers);
    sh.getRange(1, 1, 1, headers.length)
      .setFontWeight('bold').setBackground('#1a5276').setFontColor('#ffffff');
  }
  return sh;
}

// ============================================================
// AUTH
// ============================================================
function login(username, password) {
  if (!username || !password) return { ok: false, error: 'ข้อมูลไม่ครบ' };
  const ss   = SpreadsheetApp.openById(SS_ID);
  const sh   = ss.getSheetByName('admins');
  if (!sh) return { ok: false, error: 'ไม่พบ sheet admins' };
  const rows = sh.getDataRange().getValues().slice(1);
  // password ส่งมาเป็น SHA-256 hash จาก browser แล้ว เทียบตรงได้เลย
  const hash = String(password).trim().toLowerCase();
  for (const r of rows) {
    if (String(r[0]).trim() === String(username).trim() &&
        String(r[1]).trim().toLowerCase() === hash) {
      return { ok: true, display_name: r[2] || username };
    }
  }
  return { ok: false, error: 'username หรือ password ไม่ถูกต้อง' };
}

// ============================================================
// LIST
// ============================================================
function list(sheetName) {
  const ss = SpreadsheetApp.openById(SS_ID);
  const sh = ss.getSheetByName(sheetName);
  if (!sh) return { error: 'ไม่พบ sheet: ' + sheetName };

  const isGroup    = GROUPS.includes(sheetName);
  const isDispose  = sheetName === 'ตัดจำหน่าย';
  const isSummary  = sheetName === 'บัญชีรวม';
  const startRow   = isGroup ? DAT_ROW : 2;
  const numCols    = isDispose ? 15 : (isSummary ? 13 : 12);
  const last       = sh.getLastRow();
  if (last < startRow) return { records: [] };

  const data    = sh.getRange(startRow, 1, last - startRow + 1, numCols).getValues();
  const records = [];
  data.forEach((r, i) => {
    if (!r[COL.ITEM - 1]) return;
    records.push({
      rowIndex : startRow + i,
      no       : r[0],
      item     : r[1],
      brand    : r[2],
      model    : r[3],
      serial   : r[4],
      price    : r[5],
      date     : r[6],
      method   : r[7],
      code     : r[8],
      remark   : r[9],
      sourceSheet: isGroup ? sheetName : (isDispose ? r[14] : (isSummary ? r[12] : '')),
      status   : r[10],
      user     : r[11],
      ...(isDispose ? { dispDate: r[12], dispBy: r[13] } : {}),
    });
  });
  return { records };
}

// ============================================================
// ADD
// ============================================================
function addRecord(p) {
  const data = JSON.parse(p.data || '{}');
  const ss   = SpreadsheetApp.openById(SS_ID);
  const sourceSheet = data.sourceSheet || '';
  if (!GROUPS.includes(sourceSheet)) return { error: 'ชื่อ sheet ไม่ถูกต้อง: ' + sourceSheet };
  const sh = ss.getSheetByName(sourceSheet);
  if (!sh) return { error: 'ไม่พบ sheet: ' + sourceSheet };

  const nextNo = _nextSeq(sh);
  sh.appendRow(_buildRow(nextNo, data));

  if (data.isBundle && data.bundle) {
    sh.appendRow(_buildRow(nextNo + 1, {
      ...data.bundle,
      remark : data.remark,
      status : data.status || 'ใช้ได้',
      date   : data.date,
      method : data.method,
      price  : 'ราคารวมกับ ' + data.code,
    }));
  }
  syncSummary();
  return { ok: true };
}

function _buildRow(no, d) {
  return [
    no,
    d.item   || '',
    d.brand  || '',
    d.model  || '',
    d.serial || '',
    d.price  || '',
    d.date   || '',
    d.method || '',
    d.code   || '',
    d.remark || '',
    d.status || 'ใช้ได้',
    d.user   || '',
  ];
}

function _nextSeq(sh) {
  const last = sh.getLastRow();
  if (last < DAT_ROW) return 1;
  const vals = sh.getRange(DAT_ROW, COL.NO, last - DAT_ROW + 1, 1).getValues();
  let max = 0;
  vals.forEach(r => { if (!isNaN(r[0]) && Number(r[0]) > max) max = Number(r[0]); });
  return max + 1;
}

// ============================================================
// UPDATE
// ============================================================
function updateRecord(p) {
  const rowIndex = parseInt(p.rowIndex);
  const data     = JSON.parse(p.data || '{}');
  const ss       = SpreadsheetApp.openById(SS_ID);
  const sourceSheet = data.sourceSheet || '';
  if (!GROUPS.includes(sourceSheet)) return { error: 'ชื่อ sheet ไม่ถูกต้อง: ' + sourceSheet };
  const sh = ss.getSheetByName(sourceSheet);
  if (!sh) return { error: 'ไม่พบ sheet: ' + sourceSheet };
  if (!Number.isInteger(rowIndex) || rowIndex < DAT_ROW || rowIndex > sh.getLastRow()) {
    return { error: 'rowIndex ไม่ถูกต้อง' };
  }
  const no = sh.getRange(rowIndex, COL.NO).getValue();
  sh.getRange(rowIndex, 1, 1, 12).setValues([[
    no,
    data.item   || '',
    data.brand  || '',
    data.model  || '',
    data.serial || '',
    data.price  || '',
    data.date   || '',
    data.method || '',
    data.code   || '',
    data.remark || '',
    data.status || '',
    data.user   || '',
  ]]);
  syncSummary();
  return { ok: true };
}

// ============================================================
// DELETE
// ============================================================
function deleteRecord(p) {
  const rowIndex = parseInt(p.rowIndex);
  const sourceSheet = p.sourceSheet || '';
  const ss       = SpreadsheetApp.openById(SS_ID);
  if (!GROUPS.includes(sourceSheet)) return { error: 'ชื่อ sheet ไม่ถูกต้อง: ' + sourceSheet };
  const sh = ss.getSheetByName(sourceSheet);
  if (!sh) return { error: 'ไม่พบ sheet: ' + sourceSheet };
  if (!Number.isInteger(rowIndex) || rowIndex < DAT_ROW || rowIndex > sh.getLastRow()) {
    return { error: 'rowIndex ไม่ถูกต้อง' };
  }
  sh.deleteRow(rowIndex);
  _renumber(sh);
  syncSummary();
  return { ok: true };
}

function _renumber(sh) {
  const last = sh.getLastRow();
  if (last < DAT_ROW) return;
  for (let i = DAT_ROW; i <= last; i++) {
    sh.getRange(i, COL.NO).setValue(i - DAT_ROW + 1);
  }
}

// ============================================================
// SYNC SUMMARY — bulk overwrite (ไม่ทับถม)
// ============================================================
function syncSummary() {
  const ss       = SpreadsheetApp.openById(SS_ID);
  const sumSheet = ss.getSheetByName('บัญชีรวม');
  if (!sumSheet) return { error: 'ไม่พบ sheet บัญชีรวม' };
  sumSheet.getRange(1, 10).setValue('หมายเหตุ');
  sumSheet.getRange(1, 13).setValue('ชีตต้นทาง');

  // clear data rows เก่าทั้งหมด เก็บ header row 1 ไว้
  const lastRow = sumSheet.getLastRow();
  if (lastRow > 1) sumSheet.getRange(2, 1, lastRow - 1, 13).clearContent();

  // รวบรวมทุกแถวจาก 9 กลุ่มงานก่อน แล้วเขียนทีเดียว
  const allRows = [];
  let seq = 1;
  GROUPS.forEach(grp => {
    const sh   = ss.getSheetByName(grp);
    if (!sh) return;
    const last = sh.getLastRow();
    if (last < DAT_ROW) return;
    const data = sh.getRange(DAT_ROW, 1, last - DAT_ROW + 1, 12).getValues();
    data.forEach(r => {
      if (!r[COL.ITEM - 1]) return;
      allRows.push([seq++, r[1], r[2], r[3], r[4], r[5], r[6], r[7], r[8], r[9], r[10], r[11], grp]);
    });
  });

  // เขียนทีเดียว (bulk) — ไม่มีทางทับถม
  if (allRows.length > 0) {
    sumSheet.getRange(2, 1, allRows.length, 13).setValues(allRows);
  }
  return { ok: true, total: allRows.length };
}

// ============================================================
// PULL DISPOSED — scan ชำรุด/เสื่อมสภาพ/สูญ → copy ไป ตัดจำหน่าย
// ยังไม่ลบต้นทาง รอ confirmDispose
// ============================================================
function pullDisposedRecords() {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const ss = SpreadsheetApp.openById(SS_ID);
    const dstSheet = ss.getSheetByName('ตัดจำหน่าย');
    if (!dstSheet) return { error: 'ไม่พบ sheet ตัดจำหน่าย' };
    dstSheet.getRange(1, 10).setValue('หมายเหตุ');
    dstSheet.getRange(1, 15).setValue('ชีตต้นทาง');

    // Confirmed legacy rows stay untouched. Pending rows are a live projection
    // of current asset condition, so rebuild them on every scan.
    const confirmedRows = [];
    const dstLast = dstSheet.getLastRow();
    if (dstLast > 1) {
      const dstData = dstSheet.getRange(2, 1, dstLast - 1, 15).getValues();
      dstData.forEach(r => {
        if (r[COL.ITEM - 1] && String(r[13]).trim() !== 'รอการยืนยัน') confirmedRows.push(r);
      });
      dstSheet.getRange(2, 1, dstLast - 1, 15).clearContent();
    }

    const disposeStatuses = new Set(['ชำรุด', 'เสื่อมสภาพ', 'สูญ']);
    const pendingRows = [];
    GROUPS.forEach(sourceSheet => {
      const sh = ss.getSheetByName(sourceSheet);
      if (!sh || sh.getLastRow() < DAT_ROW) return;
      const data = sh.getRange(DAT_ROW, 1, sh.getLastRow() - DAT_ROW + 1, 12).getValues();
      data.forEach(r => {
        if (!r[COL.ITEM - 1]) return;
        if (!disposeStatuses.has(String(r[COL.STATUS - 1]).trim())) return;
        pendingRows.push([...r, '', 'รอการยืนยัน', sourceSheet]);
      });
    });

    const rows = confirmedRows.concat(pendingRows);
    if (rows.length) dstSheet.getRange(2, 1, rows.length, 15).setValues(rows);
    return {
      ok: true,
      pulled: pendingRows.length,
      removed: Math.max(0, dstLast - 1 - confirmedRows.length),
    };
  } finally {
    lock.releaseLock();
  }
}

// ============================================================
// CONFIRM DISPOSE — archive รายวัน แล้วลบจากชีตต้นทาง
// ============================================================
function confirmDisposeRecord(p) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const dstRow = parseInt(p.dstRow);
    const dispBy = p.dispBy || 'ระบบ';
    const ss = SpreadsheetApp.openById(SS_ID);
    const dstSheet = ss.getSheetByName('ตัดจำหน่าย');
    if (!dstSheet) return { error: 'ไม่พบ sheet ตัดจำหน่าย' };
    if (!Number.isInteger(dstRow) || dstRow < 2 || dstRow > dstSheet.getLastRow()) {
      return { error: 'แถวตัดจำหน่ายไม่ถูกต้อง' };
    }

    const pending = dstSheet.getRange(dstRow, 1, 1, 15).getValues()[0];
    if (String(pending[13]).trim() !== 'รอการยืนยัน') {
      return { error: 'รายการนี้ไม่ได้อยู่ในสถานะรอการยืนยัน' };
    }
    const sourceSheet = String(pending[14]).trim();
    if (!GROUPS.includes(sourceSheet)) return { error: 'ไม่พบข้อมูลชีตต้นทาง กรุณาสแกนใหม่' };

    const srcSheet = ss.getSheetByName(sourceSheet);
    const code = String(pending[COL.CODE - 1]).trim();
    const item = String(pending[COL.ITEM - 1]).trim();
    const serial = String(pending[COL.SERIAL - 1]).trim();
    const disposeStatuses = new Set(['ชำรุด', 'เสื่อมสภาพ', 'สูญ']);
    let sourceRow = 0;
    if (srcSheet && srcSheet.getLastRow() >= DAT_ROW) {
      const srcData = srcSheet.getRange(DAT_ROW, 1, srcSheet.getLastRow() - DAT_ROW + 1, 12).getValues();
      for (let i = 0; i < srcData.length; i++) {
        const row = srcData[i];
        if (String(row[COL.CODE - 1]).trim() === code &&
            String(row[COL.ITEM - 1]).trim() === item &&
            String(row[COL.SERIAL - 1]).trim() === serial) {
          if (!disposeStatuses.has(String(row[COL.STATUS - 1]).trim())) {
            return { error: 'สภาพต้นทางไม่อยู่ในเงื่อนไขตัดจำหน่าย กรุณาสแกนใหม่' };
          }
          sourceRow = DAT_ROW + i;
          break;
        }
      }
    }
    if (!sourceRow) return { error: 'ไม่พบรายการต้นทาง กรุณาสแกนใหม่' };

    const now = new Date();
    const tz = Session.getScriptTimeZone() || 'Asia/Bangkok';
    const thaiYear = Number(Utilities.formatDate(now, tz, 'yyyy')) + 543;
    const archiveName = 'รายการตัดจำหน่าย ' + Utilities.formatDate(now, tz, 'dd-MM-') + thaiYear;
    const headers = ['ลำดับ','รายการ','ยี่ห้อ','รุ่น','Serial','ราคา/หน่วย','วันที่ได้มา','วิธีได้มา',
      'รหัสครุภัณฑ์','หมายเหตุ','สภาพ','ใช้ประจำที่/บุคลากร','วันที่ตัดจำหน่าย','ผู้ดำเนินการ','ชีตต้นทาง'];
    const archive = _ensureSheet(ss, archiveName, headers);
    const archiveRow = pending.slice(0, 12).concat([
      Utilities.formatDate(now, tz, 'dd/MM/') + thaiYear + Utilities.formatDate(now, tz, ' HH:mm:ss'),
      dispBy, sourceSheet,
    ]);
    archive.appendRow(archiveRow);

    srcSheet.deleteRow(sourceRow);
    _renumber(srcSheet);
    dstSheet.deleteRow(dstRow);
    syncSummary();
    return { ok: true, archiveSheet: archiveName };
  } finally {
    lock.releaseLock();
  }
}

// ============================================================
// REPORT
// ============================================================
function report(sheetName) {
  return list(sheetName || 'บัญชีรวม');
}

// ============================================================
// UTIL
// ============================================================
function _sha256(str) {
  const raw = Utilities.computeDigest(
    Utilities.DigestAlgorithm.SHA_256, str, Utilities.Charset.UTF_8
  );
  return raw.map(b => ('0' + (b & 0xff).toString(16)).slice(-2)).join('');
}
