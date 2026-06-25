let state = {
  mode: document.body.dataset.mode || 'requester',
  auth: JSON.parse(localStorage.getItem('inventory_auth') || 'null'),
  categories: [],
  items: [],
  departments: [],
  staff: [],
  withdrawals: [],
  dashboard: {},
  reports: {}
};

document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm');
  if (loginForm) loginForm.addEventListener('submit', login);
  const loginPassword = document.getElementById('loginPassword');
  if (loginPassword) {
    loginPassword.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        loginForm.requestSubmit();
      }
    });
  }

  if (state.mode === 'admin') {
    if (state.auth) bootAdmin();
    return;
  }

  bootRequester();
});

document.addEventListener('click', (event) => {
  document.querySelectorAll('.combo-results.show').forEach((box) => {
    if (!box.closest('.combo').contains(event.target)) box.classList.remove('show');
  });
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
  setBusy(true, 'กำลังเข้าสู่ระบบ...');
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
  } finally {
    setBusy(false);
  }
}

async function bootRequester() {
  setBusy(true, 'กำลังโหลดข้อมูล...');
  try {
    await loadRequesterData();
  } catch (error) {
    showToast(error.message || String(error));
  } finally {
    setBusy(false);
  }
}

async function bootAdmin() {
  document.getElementById('loginView').classList.add('hidden');
  document.getElementById('appView').classList.remove('hidden');
  document.getElementById('userBadge').textContent = `${state.auth.name} (${state.auth.user_id})`;
  showTab('withdraw');
  setBusy(true, 'กำลังโหลดข้อมูล...');
  try {
    await loadAdminData();
  } catch (error) {
    localStorage.removeItem('inventory_auth');
    state.auth = null;
    document.getElementById('appView').classList.add('hidden');
    document.getElementById('loginView').classList.remove('hidden');
    setMessage('loginMessage', error.message || String(error));
  } finally {
    setBusy(false);
  }
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
  fillDepartments('reportDepartment');
  fillDepartments('staffAdminDept');
  bindDepartmentStaffFilter();
  fillRequesterStaff();
  fillCategories('categoryParent', true);
  fillCategories('itemCategory', false);
  fillItems('receiptItem');
  fillItems('adjustItem');
  renderCategoryTree();
  renderItemList();
  renderStaffAdmin();
  renderHistory();
  renderDashboard();
  renderReports();
  renderGuide();
  if (!document.querySelector('#withdrawLines .line-row')) addWithdrawLine();
}

function fillDepartments(id) {
  const select = document.getElementById(id);
  if (!select) return;
  const emptyLabel = id === 'reportDepartment' ? 'ทุกฝ่าย' : id === 'staffAdminDept' ? 'ส่วนกลาง/ไม่ระบุ' : '';
  select.innerHTML = `${emptyLabel ? `<option value="">${emptyLabel}</option>` : ''}${state.departments
    .map((department) => `<option value="${department.dept_id}">${escapeHtml(department.name)}</option>`)
    .join('')}`;
}

function bindDepartmentStaffFilter() {
  const dept = document.getElementById('withdrawDept');
  if (!dept || dept.dataset.staffBound === 'true') return;
  dept.dataset.staffBound = 'true';
  dept.addEventListener('change', () => fillRequesterStaff());
}

function fillRequesterStaff(selectedStaffId = '') {
  const select = document.getElementById('withdrawRequesterStaff');
  if (!select) return;
  const deptId = valueOf('withdrawDept');
  const rows = state.staff
    .filter((staff) => staff.dept_id === deptId && ['department_head', 'department_staff'].includes(staff.role))
    .sort((a, b) => {
      if (a.role !== b.role) return a.role === 'department_head' ? -1 : 1;
      return String(a.name).localeCompare(String(b.name), 'th');
    });
  select.innerHTML = rows.map((staff) => `
    <option value="${staff.staff_id}">${escapeHtml(staff.name)} (${escapeHtml(staff.position_label || staff.role)})</option>
  `).join('') || '<option value="">ยังไม่มีรายชื่อในกลุ่มงานนี้</option>';
  if (selectedStaffId) select.value = selectedStaffId;
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
  row.className = 'line-row searchable-line';
  row.innerHTML = `
    <label>ประเภท
      <select class="line-category">
        <option value="">ทั้งหมด</option>
        ${categoryOptions()}
      </select>
    </label>
    <label>ค้นหารายการ
      <div class="combo">
        <input class="line-search" autocomplete="off" placeholder="พิมพ์ชื่อรายการ หรือคลิกเพื่อดูทั้งหมด">
        <input class="line-item" type="hidden">
        <div class="combo-results"></div>
      </div>
    </label>
    <label>จำนวน
      <input class="line-qty" type="number" min="1" step="1" value="${values.requested_qty || 1}">
    </label>
    <span class="line-stock"></span>
    <span class="line-shortage"></span>
    <button type="button" title="ลบรายการ" onclick="this.closest('.line-row').remove()">x</button>
  `;
  container.appendChild(row);

  row.querySelector('.line-category').addEventListener('change', () => {
    row.querySelector('.line-item').value = '';
    row.querySelector('.line-search').value = '';
    updateLineInfo(row);
  });
  row.querySelector('.line-search').addEventListener('focus', () => renderComboResults(row));
  row.querySelector('.line-search').addEventListener('input', () => renderComboResults(row));
  row.querySelector('.line-qty').addEventListener('input', () => updateLineInfo(row));

  if (values.item_id) selectItemForRow(row, values.item_id);
  updateLineInfo(row);
}

function categoryOptions() {
  return state.categories.map((category) => {
    const depth = categoryDepth(category.category_id);
    return `<option value="${category.category_id}">${'-- '.repeat(depth)}${escapeHtml(category.name)}</option>`;
  }).join('');
}

function renderComboResults(row) {
  const query = row.querySelector('.line-search').value.trim().toLowerCase();
  const categoryId = row.querySelector('.line-category').value;
  const results = itemsForCategory(categoryId)
    .filter((item) => {
      const haystack = `${item.name} ${categoryPath(item.category_id)} ${item.unit}`.toLowerCase();
      return !query || haystack.includes(query);
    })
    .slice(0, 30);
  const box = row.querySelector('.combo-results');
  box.innerHTML = results.map((item) => `
    <button type="button" class="combo-option" onclick="selectItemForRow(this.closest('.line-row'), '${item.item_id}')">
      <strong>${escapeHtml(item.name)}</strong>
      <small>${escapeHtml(categoryPath(item.category_id))} · คงเหลือ ${item.stock} ${escapeHtml(item.unit)}</small>
    </button>
  `).join('') || '<div class="combo-empty">ไม่พบรายการ</div>';
  box.classList.add('show');
}

function selectItemForRow(row, itemId) {
  const item = findItem(itemId);
  row.querySelector('.line-item').value = item.item_id || '';
  row.querySelector('.line-search').value = item.name || '';
  row.querySelector('.combo-results').classList.remove('show');
  updateLineInfo(row);
}

function updateLineInfo(row) {
  const item = findItem(row.querySelector('.line-item').value);
  const qty = Number(row.querySelector('.line-qty').value || 0);
  const shortage = Math.max(qty - Number(item.stock || 0), 0);
  row.querySelector('.line-stock').textContent = item.item_id ? `คงเหลือ ${item.stock} ${item.unit}` : 'ยังไม่เลือกรายการ';
  row.querySelector('.line-shortage').textContent = !item.item_id
    ? ''
    : Number(item.stock || 0) < 1
      ? 'ไม่มีของในคลัง'
      : shortage > 0 ? `ขาด ${shortage} ${item.unit}` : 'พอจ่าย';
}

async function submitWithdrawal() {
  const requesterStaff = StaffById(valueOf('withdrawRequesterStaff'));
  const payload = {
    dept_id: valueOf('withdrawDept'),
    requester_staff_id: requesterStaff ? requesterStaff.staff_id : '',
    requester_name: requesterStaff ? requesterStaff.name : '',
    requester_position: requesterStaff ? requesterStaff.position_label : '',
    items: collectLines('withdrawLines')
  };
  if (!payload.requester_name || payload.items.length === 0) {
    setMessage('withdrawMessage', 'กรอกชื่อผู้เบิกและเลือกรายการอย่างน้อย 1 รายการ');
    return;
  }
  const unavailable = payload.items
    .map((line) => findItem(line.item_id))
    .filter((item) => Number(item.stock || 0) < 1);
  if (unavailable.length > 0) {
    const names = unavailable.map((item) => item.name).join(', ');
    setMessage('withdrawMessage', `บันทึกไม่ได้: ${names} ไม่มีของในคลัง`);
    showToast(`บันทึกไม่ได้: ${names} ไม่มีของในคลัง`);
    return;
  }
  await withBusy('กำลังบันทึกใบเบิก...', async () => {
    const result = await api('createWithdrawal', payload);
    setMessage('withdrawMessage', `บันทึกแล้ว: ${result.withdrawal.withdraw_no}`);
    showToast(`บันทึกใบเบิกเสร็จสิ้น: ${result.withdrawal.withdraw_no}`);
    document.getElementById('withdrawLines').innerHTML = '';
    addWithdrawLine();
    await reloadData();
  });
}

function openStaffDialog() {
  const dialog = document.getElementById('staffDialog');
  if (dialog) dialog.showModal();
}

function closeStaffDialog() {
  const dialog = document.getElementById('staffDialog');
  if (dialog) dialog.close();
}

async function submitNewDepartmentStaff() {
  const payload = {
    dept_id: valueOf('withdrawDept'),
    prefix: valueOf('staffPrefix'),
    first_name: valueOf('staffFirstName'),
    last_name: valueOf('staffLastName'),
    position_label: valueOf('staffPosition')
  };
  if (!payload.first_name || !payload.last_name || !payload.position_label) {
    showToast('กรอกชื่อ นามสกุล และตำแหน่งให้ครบ');
    return;
  }
  await withBusy('กำลังเพิ่มรายชื่อ...', async () => {
    const created = await api('saveDepartmentStaff', payload);
    closeStaffDialog();
    ['staffFirstName', 'staffLastName', 'staffPosition'].forEach(clearValue);
    await reloadData();
    fillRequesterStaff(created.staff_id);
    showToast(`เพิ่มรายชื่อ "${created.name}" แล้ว`);
  });
}

function collectLines(containerId) {
  return Array.from(document.querySelectorAll(`#${containerId} .line-row`))
    .map((row) => ({
      item_id: row.querySelector('.line-item').value,
      requested_qty: Number(row.querySelector('.line-qty').value || 0)
    }))
    .filter((line) => line.item_id && line.requested_qty > 0);
}

function renderGuide(selectedCategoryId = '') {
  const guide = document.getElementById('itemGuide');
  if (!guide) return;
  const rootCategories = state.categories.filter((category) => !category.parent_id);
  const activeCategoryId = selectedCategoryId || (rootCategories[0] && rootCategories[0].category_id) || '';
  const previewLimit = window.matchMedia('(max-width: 760px)').matches ? 5 : 8;
  const items = itemsForCategory(activeCategoryId).slice(0, previewLimit);
  const total = itemsForCategory(activeCategoryId).length;
  guide.innerHTML = `
    <h2>รายการพัสดุตามประเภท</h2>
    <div class="guide-tabs">
      ${rootCategories.map((category) => `
        <button type="button" class="${category.category_id === activeCategoryId ? 'active' : ''}" onclick="renderGuide('${category.category_id}')">
          ${escapeHtml(category.name)}
        </button>
      `).join('')}
    </div>
    <div class="guide-list">
      ${items.map((item) => guideItemButton(item)).join('') || '<p>ยังไม่มีรายการในประเภทนี้</p>'}
    </div>
    ${total > previewLimit ? `<button type="button" onclick="renderGuideAll('${activeCategoryId}')">แสดงรายการทั้งหมด (${total})</button>` : ''}
  `;
}

function renderGuideAll(categoryId) {
  const guide = document.getElementById('itemGuide');
  const items = itemsForCategory(categoryId);
  guide.querySelector('.guide-list').innerHTML = items.map((item) => guideItemButton(item)).join('');
}

function guideItemButton(item) {
  return `
    <button type="button" class="guide-item" onclick="addItemFromGuide('${item.item_id}')">
      <strong>${escapeHtml(item.name)}</strong>
      <small>${escapeHtml(categoryPath(item.category_id))} · คงเหลือ ${item.stock} ${escapeHtml(item.unit)}</small>
    </button>
  `;
}

function addItemFromGuide(itemId) {
  addWithdrawLine({ item_id: itemId, requested_qty: 1 });
  showToast(`เพิ่ม "${findItem(itemId).name}" ในใบเบิกแล้ว`);
}

async function saveCategoryFromForm() {
  const name = valueOf('categoryName');
  await withBusy('กำลังบันทึกประเภท...', async () => {
    await api('saveCategory', {
      name,
      parent_id: valueOf('categoryParent'),
      reason: 'บันทึกผ่านหน้า HTML'
    });
    clearValue('categoryName');
    await loadAdminData();
    showToast(`ประเภท "${name}" เสร็จสิ้น!`);
  });
}

async function saveItemFromForm() {
  const itemId = valueOf('itemId');
  const name = valueOf('itemName');
  await withBusy(itemId ? 'กำลังแก้ไขรายการพัสดุ...' : 'กำลังบันทึกรายการพัสดุ...', async () => {
    await api('saveItem', {
      item_id: itemId,
      name,
      category_id: valueOf('itemCategory'),
      unit: valueOf('itemUnit'),
      min_stock: Number(valueOf('itemMinStock') || 0),
      reason: itemId ? 'แก้ไขผ่านหน้า HTML' : 'บันทึกผ่านหน้า HTML'
    });
    resetItemForm();
    await loadAdminData();
    showToast(`รายการ "${name}" เสร็จสิ้น!`);
  });
}

async function saveReceiptFromForm() {
  await withBusy('กำลังบันทึกรับเข้า...', async () => {
    await api('saveReceipt', {
      item_id: valueOf('receiptItem'),
      qty: Number(valueOf('receiptQty') || 0),
      unit_price: Number(valueOf('receiptUnitPrice') || 0),
      doc_ref: valueOf('receiptDocRef')
    });
    ['receiptQty', 'receiptUnitPrice', 'receiptDocRef'].forEach(clearValue);
    await loadAdminData();
    showToast('รับเข้าเสร็จสิ้น!');
  });
}

async function saveAdjustmentFromForm() {
  await withBusy('กำลังบันทึกปรับยอด...', async () => {
    await api('saveAdjustment', {
      item_id: valueOf('adjustItem'),
      qty_change: Number(valueOf('adjustQty') || 0),
      reason: valueOf('adjustReason')
    });
    ['adjustQty', 'adjustReason'].forEach(clearValue);
    await loadAdminData();
    showToast('ปรับยอดเสร็จสิ้น!');
  });
}

async function saveStaffFromForm() {
  const payload = {
    staff_id: valueOf('staffAdminId'),
    prefix: valueOf('staffAdminPrefix'),
    first_name: valueOf('staffAdminFirstName'),
    last_name: valueOf('staffAdminLastName'),
    role: valueOf('staffAdminRole'),
    dept_id: valueOf('staffAdminDept'),
    position_label: valueOf('staffAdminPosition'),
    active: true,
    reason: 'บันทึกผ่านหน้า admin'
  };
  if (!payload.first_name || !payload.last_name || !payload.position_label) {
    showToast('กรอกชื่อ นามสกุล และตำแหน่งให้ครบ');
    return;
  }
  if (['department_staff', 'department_head'].includes(payload.role) && !payload.dept_id) {
    showToast('เลือกกลุ่มงานก่อน');
    return;
  }
  await withBusy('กำลังบันทึกเจ้าหน้าที่...', async () => {
    await api('saveStaff', payload);
    resetStaffForm();
    await loadAdminData();
    showToast('บันทึกเจ้าหน้าที่เสร็จสิ้น!');
  });
}

function renderStaffAdmin() {
  const list = document.getElementById('staffAdminList');
  if (!list) return;
  list.innerHTML = state.staff.map((staff) => `
    <div class="item-row">
      <div>
        <strong>${escapeHtml(staff.name)}</strong>
        <small>${escapeHtml(roleLabel(staff.role))} · ${escapeHtml(departmentName(staff.dept_id) || 'ส่วนกลาง')} · ${escapeHtml(staff.position_label || '')}</small>
      </div>
      <button type="button" onclick="editStaff('${staff.staff_id}')">แก้ไข</button>
      <button type="button" onclick="deactivateStaff('${staff.staff_id}')">ปิดใช้</button>
    </div>
  `).join('') || '<p>ยังไม่มีรายชื่อเจ้าหน้าที่</p>';
}

function editStaff(staffId) {
  const staff = StaffById(staffId);
  if (!staff) return;
  document.getElementById('staffAdminId').value = staff.staff_id;
  document.getElementById('staffAdminPrefix').value = staff.prefix || 'นาย';
  document.getElementById('staffAdminFirstName').value = staff.first_name || '';
  document.getElementById('staffAdminLastName').value = staff.last_name || '';
  document.getElementById('staffAdminRole').value = staff.role || 'department_staff';
  document.getElementById('staffAdminDept').value = staff.dept_id || '';
  document.getElementById('staffAdminPosition').value = staff.position_label || '';
  showTab('staff');
}

async function deactivateStaff(staffId) {
  const staff = StaffById(staffId);
  if (!staff || !confirm(`ปิดใช้งาน ${staff.name}?`)) return;
  await withBusy('กำลังปิดใช้งานเจ้าหน้าที่...', async () => {
    await api('saveStaff', { ...staff, active: false, reason: 'ปิดใช้งานผ่านหน้า admin' });
    await loadAdminData();
    showToast('ปิดใช้งานแล้ว');
  });
}

function resetStaffForm() {
  ['staffAdminId', 'staffAdminFirstName', 'staffAdminLastName', 'staffAdminPosition'].forEach(clearValue);
  const role = document.getElementById('staffAdminRole');
  if (role) role.value = 'department_staff';
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

function renderItemList() {
  const list = document.getElementById('itemList');
  if (!list) return;
  list.innerHTML = state.items.map((item) => `
    <div class="item-row">
      <div>
        <strong>${escapeHtml(item.name)}</strong>
        <small>${escapeHtml(categoryPath(item.category_id))} · ${escapeHtml(item.unit)} · คงเหลือ ${item.stock}</small>
      </div>
      <small>เตือนต่ำกว่า ${item.min_stock || 0}</small>
      <button type="button" onclick="editItem('${item.item_id}')">แก้ไข</button>
    </div>
  `).join('') || '<p>ยังไม่มีรายการพัสดุ</p>';
}

function editItem(itemId) {
  const item = state.items.find((row) => row.item_id === itemId);
  if (!item) return;
  document.getElementById('itemId').value = item.item_id;
  document.getElementById('itemName').value = item.name;
  document.getElementById('itemCategory').value = item.category_id;
  document.getElementById('itemUnit').value = item.unit;
  document.getElementById('itemMinStock').value = item.min_stock || 0;
  document.getElementById('itemName').focus();
  showToast(`กำลังแก้ไข "${item.name}"`);
}

function resetItemForm() {
  ['itemId', 'itemName', 'itemUnit'].forEach(clearValue);
  const minStock = document.getElementById('itemMinStock');
  if (minStock) minStock.value = 0;
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
  await withBusy('กำลังบันทึกการแก้ไข...', async () => {
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
    showToast('แก้ไขใบเบิกเสร็จสิ้น!');
  });
}

async function cancelWithdrawalFromHistory(withdrawId) {
  const reason = prompt('เหตุผลการยกเลิก');
  if (!reason) return;
  await withBusy('กำลังยกเลิกใบเบิก...', async () => {
    await api('cancelWithdrawal', { withdraw_id: withdrawId, reason });
    await loadAdminData();
    showToast('ยกเลิกใบเบิกเสร็จสิ้น!');
  });
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
  renderRanking('topItems', dashboard.topItems || []);
  renderRanking('topDepartments', dashboard.topDepartments || []);
  renderRanking('topCategories', dashboard.topCategories || []);
  renderRanking('deptCategoryRanking', dashboard.departmentCategory || []);
}

function renderRanking(id, rows) {
  const box = document.getElementById(id);
  if (!box) return;
  const max = Math.max(...rows.map((row) => Number(row.qty || row.count || 0)), 1);
  box.innerHTML = rows.map((row, index) => {
    const value = Number(row.qty || row.count || 0);
    return `
      <div class="rank-row">
        <span>${index + 1}. ${escapeHtml(row.name || row.label)}</span>
        <strong>${value}</strong>
        <div class="bar"><i style="width:${Math.round((value / max) * 100)}%"></i></div>
      </div>
    `;
  }).join('') || '<p>ยังไม่มีข้อมูล</p>';
}

function renderReports() {
  const reports = state.reports || {};
  renderCurrentStockReport(reports.currentStock || []);
  renderReportRows('yearReportRows', reports.yearly || []);
  renderReportRows('monthReportRows', filterBySelectedMonth(reports.monthly || []));
  renderReportRows('weekReportRows', filterBySelectedWeek(reports.weekly || []));
  renderReportRows('departmentReportRows', filterBySelectedDepartment(reports.department || []));
}

function renderCurrentStockReport(rows) {
  const box = document.getElementById('currentStockReportRows');
  if (!box) return;
  box.innerHTML = rows.map((row) => `
    <tr>
      <td>${escapeHtml(row.category)}</td>
      <td>${escapeHtml(row.item_name)}</td>
      <td>${escapeHtml(row.unit)}</td>
      <td>${row.received}</td>
      <td>${row.issued}</td>
      <td>${row.adjusted}</td>
      <td><strong>${row.stock}</strong></td>
    </tr>
  `).join('');
}

function renderReportRows(id, rows) {
  const box = document.getElementById(id);
  if (!box) return;
  box.innerHTML = rows.map((row) => `
    <tr>
      <td>${escapeHtml(row.date)}</td>
      <td>${escapeHtml(row.department_name)}</td>
      <td>${escapeHtml(row.requester_name)}</td>
      <td>${escapeHtml(row.item_name)}</td>
      <td>${row.issued_qty}</td>
      <td>${escapeHtml(row.unit)}</td>
      <td>${escapeHtml(row.withdraw_no)}</td>
    </tr>
  `).join('') || '<tr><td colspan="7">ไม่มีข้อมูล</td></tr>';
}

function filterBySelectedMonth(rows) {
  const month = valueOf('reportMonth');
  if (!month) return rows;
  return rows.filter((row) => row.month === month);
}

function filterBySelectedWeek(rows) {
  const week = valueOf('reportWeek');
  if (!week) return rows;
  return rows.filter((row) => row.week === week);
}

function filterBySelectedDepartment(rows) {
  const deptId = valueOf('reportDepartment');
  if (!deptId) return rows;
  return rows.filter((row) => row.dept_id === deptId);
}

function refreshReports() {
  renderReports();
  showToast('กรองรายงานแล้ว');
}

function findItem(itemId) {
  return state.items.find((item) => item.item_id === itemId) || { item_id: '', name: '', stock: 0, unit: '' };
}

function StaffById(staffId) {
  return state.staff.find((staff) => staff.staff_id === staffId) || null;
}

function departmentName(deptId) {
  const department = state.departments.find((dept) => dept.dept_id === deptId);
  return department ? department.name : '';
}

function roleLabel(role) {
  return {
    supply_officer: 'เจ้าหน้าที่พัสดุ',
    chief_supply_officer: 'หัวหน้าเจ้าหน้าที่พัสดุ',
    department_staff: 'เจ้าหน้าที่กลุ่มงาน',
    department_head: 'ผอ. กลุ่ม'
  }[role] || role;
}

function itemsForCategory(categoryId) {
  if (!categoryId) return state.items;
  const ids = new Set([categoryId, ...descendantCategoryIds(categoryId)]);
  return state.items.filter((item) => ids.has(item.category_id));
}

function descendantCategoryIds(categoryId) {
  const children = state.categories.filter((category) => category.parent_id === categoryId);
  return children.flatMap((category) => [category.category_id, ...descendantCategoryIds(category.category_id)]);
}

function categoryDepth(categoryId, depth = 0) {
  const category = state.categories.find((row) => row.category_id === categoryId);
  if (!category || !category.parent_id) return depth;
  return categoryDepth(category.parent_id, depth + 1);
}

function categoryPath(categoryId) {
  const category = state.categories.find((row) => row.category_id === categoryId);
  if (!category) return 'ไม่ระบุประเภท';
  if (!category.parent_id) return category.name;
  return `${categoryPath(category.parent_id)} > ${category.name}`;
}

function valueOf(id) {
  const el = document.getElementById(id);
  return el ? el.value : '';
}

function clearValue(id) {
  const el = document.getElementById(id);
  if (el) el.value = '';
}

function setMessage(id, message) {
  const el = document.getElementById(id);
  if (el) el.textContent = message;
}

async function withBusy(message, task) {
  setBusy(true, message);
  try {
    return await task();
  } catch (error) {
    showToast(error.message || String(error));
    throw error;
  } finally {
    setBusy(false);
  }
}

function setBusy(isBusy, message = 'กำลังทำงาน...') {
  const overlay = document.getElementById('loadingOverlay');
  const text = document.getElementById('loadingText');
  if (text) text.textContent = message;
  if (overlay) overlay.classList.toggle('active', isBusy);
  document.querySelectorAll('button, input, select').forEach((el) => {
    if (el.closest('#loadingOverlay')) return;
    el.disabled = isBusy;
  });
}

function showToast(message) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove('show'), 3200);
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
