let state = {
  mode: document.body.dataset.mode || 'requester',
  auth: JSON.parse(localStorage.getItem('inventory_auth') || 'null'),
  categories: [],
  items: [],
  departments: [],
  withdrawals: [],
  dashboard: {}
};

document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm');
  if (loginForm) loginForm.addEventListener('submit', login);

  if (state.mode === 'admin') {
    if (state.auth) bootAdmin();
    return;
  }

  bootRequester();
});

async function api(action, payload = {}) {
  const body = {
    ...payload,
    action,
    token: state.auth ? state.auth.token : ''
  };
  const response = await fetch(`${window.INVENTORY_CONFIG.API_BASE_URL}?action=${encodeURIComponent(action)}`, {
    method: 'POST',
    body: JSON.stringify(body)
  });
  const result = await response.json();
  if (!result.ok) throw new Error(result.error || 'API error');
  return result.data;
}

async function login(event) {
  event.preventDefault();
  try {
    const data = await api('login', {
      user_id: valueOf('loginUser'),
      password: valueOf('loginPassword')
    });
    if (data.role !== 'admin') throw new Error('บัญชีนี้ไม่ใช่ admin');
    state.auth = data;
    localStorage.setItem('inventory_auth', JSON.stringify(data));
    await bootAdmin();
  } catch (error) {
    setMessage('loginMessage', error.message);
  }
}

async function bootRequester() {
  await loadRequesterData();
}

async function bootAdmin() {
  document.getElementById('loginView').classList.add('hidden');
  document.getElementById('appView').classList.remove('hidden');
  document.getElementById('userBadge').textContent = `${state.auth.name} (${state.auth.user_id})`;
  showTab('withdraw');
  await loadAdminData();
}

function logout() {
  localStorage.removeItem('inventory_auth');
  location.reload();
}

async function loadRequesterData() {
  setMessage('withdrawMessage', 'กำลังโหลดข้อมูล...');
  const data = await api('getRequesterData');
  Object.assign(state, data);
  renderAll();
  setMessage('withdrawMessage', '');
}

async function loadAdminData() {
  setMessage('withdrawMessage', 'กำลังโหลดข้อมูล...');
  const data = await api('getAppData');
  Object.assign(state, data);
  renderAll();
  setMessage('withdrawMessage', '');
}

async function reloadData() {
  if (state.mode === 'admin') return loadAdminData();
  return loadRequesterData();
}

function showTab(tabName) {
  document.querySelectorAll('.tab').forEach((button) => {
    button.classList.toggle('active', button.dataset.tab === tabName);
  });
  document.querySelectorAll('.panel').forEach((panel) => {
    panel.classList.toggle('active', panel.id === tabName);
  });
}

function renderAll() {
  fillDepartments('withdrawDept');
  fillDepartments('editDept');
  fillCategories('categoryParent', true);
  fillCategories('itemCategory', false);
  fillItems('receiptItem');
  fillItems('adjustItem');
  renderCategoryTree();
  renderHistory();
  renderDashboard();
  if (!document.querySelector('#withdrawLines .line-row')) addWithdrawLine();
}

function fillDepartments(id) {
  const select = document.getElementById(id);
  if (!select) return;
  select.innerHTML = state.departments
    .map((department) => `<option value="${department.dept_id}">${escapeHtml(department.name)}</option>`)
    .join('');
}

function fillCategories(id, includeEmpty) {
  const select = document.getElementById(id);
  if (!select) return;
  const options = state.categories.map((category) => {
    const depth = categoryDepth(category.category_id);
    return `<option value="${category.category_id}">${'-- '.repeat(depth)}${escapeHtml(category.name)}</option>`;
  });
  select.innerHTML = `${includeEmpty ? '<option value="">ประเภทหลัก</option>' : ''}${options.join('')}`;
}

function fillItems(id) {
  const select = document.getElementById(id);
  if (!select) return;
  select.innerHTML = state.items
    .map((item) => `<option value="${item.item_id}">${escapeHtml(item.name)} (${item.stock} ${escapeHtml(item.unit)})</option>`)
    .join('');
}

function itemOptions() {
  return state.items
    .map((item) => `<option value="${item.item_id}">${escapeHtml(item.name)} | คงเหลือ ${item.stock} ${escapeHtml(item.unit)}</option>`)
    .join('');
}

function addWithdrawLine(values = {}) {
  addLine('withdrawLines', values);
}

function addEditLine(values = {}) {
  addLine('editLines', values);
}

function addLine(containerId, values = {}) {
  const container = document.getElementById(containerId);
  if (!container) return;
  const row = document.createElement('div');
  row.className = 'line-row';
  row.innerHTML = `
    <label>รายการ
      <select class="line-item">${itemOptions()}</select>
    </label>
    <label>จำนวน
      <input class="line-qty" type="number" min="1" step="1" value="${values.requested_qty || 1}">
    </label>
    <span class="line-stock"></span>
    <span class="line-shortage"></span>
    <button type="button" title="ลบรายการ" onclick="this.closest('.line-row').remove()">x</button>
  `;
  container.appendChild(row);
  const select = row.querySelector('.line-item');
  if (values.item_id) select.value = values.item_id;
  row.querySelector('.line-qty').addEventListener('input', () => updateLineInfo(row));
  select.addEventListener('change', () => updateLineInfo(row));
  updateLineInfo(row);
}

function updateLineInfo(row) {
  const item = findItem(row.querySelector('.line-item').value);
  const qty = Number(row.querySelector('.line-qty').value || 0);
  const shortage = Math.max(qty - Number(item.stock || 0), 0);
  row.querySelector('.line-stock').textContent = `คงเหลือ ${item.stock} ${item.unit}`;
  row.querySelector('.line-shortage').textContent = shortage > 0 ? `ขาด ${shortage} ${item.unit}` : 'พอจ่าย';
}

async function submitWithdrawal() {
  const payload = {
    dept_id: valueOf('withdrawDept'),
    requester_name: valueOf('withdrawRequester'),
    items: collectLines('withdrawLines')
  };
  if (!payload.requester_name || payload.items.length === 0) {
    setMessage('withdrawMessage', 'กรอกชื่อผู้เบิกและรายการอย่างน้อย 1 รายการ');
    return;
  }
  const result = await api('createWithdrawal', payload);
  setMessage('withdrawMessage', `บันทึกแล้ว: ${result.withdrawal.withdraw_no}`);
  document.getElementById('withdrawLines').innerHTML = '';
  addWithdrawLine();
  await reloadData();
}

function collectLines(containerId) {
  return Array.from(document.querySelectorAll(`#${containerId} .line-row`))
    .map((row) => ({
      item_id: row.querySelector('.line-item').value,
      requested_qty: Number(row.querySelector('.line-qty').value || 0)
    }))
    .filter((line) => line.item_id && line.requested_qty > 0);
}

async function saveCategoryFromForm() {
  await api('saveCategory', {
    name: valueOf('categoryName'),
    parent_id: valueOf('categoryParent'),
    reason: 'บันทึกผ่านหน้า HTML'
  });
  clearValue('categoryName');
  await loadAdminData();
}

async function saveItemFromForm() {
  await api('saveItem', {
    name: valueOf('itemName'),
    category_id: valueOf('itemCategory'),
    unit: valueOf('itemUnit'),
    min_stock: Number(valueOf('itemMinStock') || 0),
    reason: 'บันทึกผ่านหน้า HTML'
  });
  ['itemName', 'itemUnit'].forEach(clearValue);
  await loadAdminData();
}

async function saveReceiptFromForm() {
  await api('saveReceipt', {
    item_id: valueOf('receiptItem'),
    qty: Number(valueOf('receiptQty') || 0),
    unit_price: Number(valueOf('receiptUnitPrice') || 0),
    doc_ref: valueOf('receiptDocRef')
  });
  ['receiptQty', 'receiptUnitPrice', 'receiptDocRef'].forEach(clearValue);
  await loadAdminData();
}

async function saveAdjustmentFromForm() {
  await api('saveAdjustment', {
    item_id: valueOf('adjustItem'),
    qty_change: Number(valueOf('adjustQty') || 0),
    reason: valueOf('adjustReason')
  });
  ['adjustQty', 'adjustReason'].forEach(clearValue);
  await loadAdminData();
}

function renderCategoryTree() {
  const tree = document.getElementById('categoryTree');
  if (!tree) return;
  const roots = state.categories.filter((category) => !category.parent_id);
  tree.innerHTML = roots.map(renderCategoryNode).join('') || '<p>ยังไม่มีประเภท</p>';
}

function renderCategoryNode(category) {
  const children = state.categories.filter((child) => child.parent_id === category.category_id);
  return `
    <div class="tree-item">
      ${escapeHtml(category.name)}
      ${children.map(renderCategoryNode).join('')}
    </div>
  `;
}

function renderHistory() {
  const list = document.getElementById('historyList');
  if (!list) return;
  list.innerHTML = state.withdrawals.map((withdrawal) => `
    <article class="history-card">
      <div class="history-head">
        <div>
          <div class="history-title">${escapeHtml(withdrawal.title)}</div>
          <div class="history-meta">${escapeHtml(withdrawal.withdraw_no)} · ${statusLabel(withdrawal.status)}</div>
        </div>
        <div class="actions">
          <button onclick="openEditDialog('${withdrawal.withdraw_id}')">แก้ไข</button>
          <button onclick="cancelWithdrawalFromHistory('${withdrawal.withdraw_id}')">ยกเลิก</button>
        </div>
      </div>
      <div class="history-items">
        ${withdrawal.items.map((line) => `
          <div>${escapeHtml(line.item_name)}: ขอ ${line.requested_qty}, จ่าย ${line.issued_qty}, ขาด ${line.shortage_qty} ${escapeHtml(line.unit)}</div>
        `).join('')}
      </div>
    </article>
  `).join('') || '<p>ยังไม่มีประวัติ</p>';
}

function openEditDialog(withdrawId) {
  const withdrawal = state.withdrawals.find((row) => row.withdraw_id === withdrawId);
  document.getElementById('editWithdrawId').value = withdrawId;
  document.getElementById('editDept').value = withdrawal.dept_id;
  document.getElementById('editRequester').value = withdrawal.requester_name;
  document.getElementById('editLines').innerHTML = '';
  withdrawal.items.forEach((line) => addEditLine(line));
  document.getElementById('editDialog').showModal();
}

function closeEditDialog() {
  document.getElementById('editDialog').close();
}

async function submitEditWithdrawal() {
  await api('updateWithdrawal', {
    withdraw_id: valueOf('editWithdrawId'),
    dept_id: valueOf('editDept'),
    requester_name: valueOf('editRequester'),
    items: collectLines('editLines'),
    reason: valueOf('editReason')
  });
  clearValue('editReason');
  closeEditDialog();
  await loadAdminData();
}

async function cancelWithdrawalFromHistory(withdrawId) {
  const reason = prompt('เหตุผลการยกเลิก');
  if (!reason) return;
  await api('cancelWithdrawal', { withdraw_id: withdrawId, reason });
  await loadAdminData();
}

function renderDashboard() {
  const cards = document.getElementById('dashboardCards');
  const list = document.getElementById('lowStockList');
  if (!cards || !list) return;
  const dashboard = state.dashboard || {};
  cards.innerHTML = `
    <div>รายการพัสดุ<strong>${dashboard.totalItems || 0}</strong></div>
    <div>ใกล้หมด<strong>${dashboard.lowStockCount || 0}</strong></div>
    <div>รายการขาด<strong>${dashboard.shortageCount || 0}</strong></div>
  `;
  list.innerHTML = (dashboard.lowStock || []).map((item) => `
    <div class="stock-row">
      <span>${escapeHtml(item.name)}</span>
      <strong>${item.stock} ${escapeHtml(item.unit)}</strong>
    </div>
  `).join('') || '<p>ยังไม่มีรายการใกล้หมด</p>';
}

function findItem(itemId) {
  return state.items.find((item) => item.item_id === itemId) || { stock: 0, unit: '' };
}

function categoryDepth(categoryId, depth = 0) {
  const category = state.categories.find((row) => row.category_id === categoryId);
  if (!category || !category.parent_id) return depth;
  return categoryDepth(category.parent_id, depth + 1);
}

function valueOf(id) {
  return document.getElementById(id).value;
}

function clearValue(id) {
  const el = document.getElementById(id);
  if (el) el.value = '';
}

function setMessage(id, message) {
  const el = document.getElementById(id);
  if (el) el.textContent = message;
}

function statusLabel(status) {
  return {
    completed: 'จ่ายแล้ว',
    edited: 'แก้ไขแล้ว',
    cancelled: 'ยกเลิก'
  }[status] || status;
}

function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}
