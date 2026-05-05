/** 
 * JM Project - Core Logic
 * Revised for "Brother Robb" (พี่ร็อบ)
 */

const WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbyXTMpnUJw4R9u-g-WV_0nBURdiW6-B9T2HwZCzuq0QDeJVGqV9ok6D7UfMXbXw3jM4LQ/exec'; 
let allData = [];
let pendingUpdate = null;

// 1. โหลดข้อมูลจาก Google Sheets
async function loadData() {
    const listContainer = document.getElementById('list-container');
    try {
        const response = await fetch(WEB_APP_URL);
        allData = await response.json();
        renderList(allData);
    } catch (error) {
        console.error("Fetch Error:", error);
        listContainer.innerHTML = `<div class="text-center p-10 bg-red-900/20 rounded-3xl border border-red-500/50">
            <p class="text-2xl text-red-400 font-bold">❌ การเชื่อมต่อล้มเหลว</p>
            <p class="text-slate-400">กรุณาเช็คการ Deploy ใน Apps Script หรือสิทธิ์การเข้าถึง</p>
        </div>`;
    }
}

// 2. แสดงผลรายชื่อ (เน้นตัวใหญ่ สไตล์ชาวบ้าน)
function renderList(items) {
    const listContainer = document.getElementById('list-container');
    if (items.length === 0) {
        listContainer.innerHTML = '<p class="text-center py-10 text-slate-500 text-xl">ไม่พบข้อมูลที่ค้นหา...</p>';
        return;
    }

    listContainer.innerHTML = items.map(item => `
        <div class="item-card group">
            <div class="flex-1 pr-4">
                <div class="text-title tracking-tighter">${item.name}</div>
                <div class="text-subtitle font-bold text-blue-400/80">${item.region} | ${item.type}</div>
            </div>
            <div class="flex flex-col items-center gap-2">
                <label class="switch">
                    <input type="checkbox" ${item.status === 'ออกแล้ว' ? 'checked' : ''} 
                           onchange="confirmToggle('${item.name}', this)">
                    <span class="slider"></span>
                </label>
                <span class="${item.status === 'ออกแล้ว' ? 'text-emerald-400' : 'text-red-400'} text-xs font-bold uppercase tracking-widest">
                    ${item.status}
                </span>
            </div>
        </div>
    `).join('');
}

// 3. ระบบค้นหา (กรองได้ทั้งชื่อและภาค)
function filterList() {
    const term = document.getElementById('searchBox').value.toLowerCase();
    const filtered = allData.filter(item => 
        item.name.toLowerCase().includes(term) || 
        item.region.toLowerCase().includes(term)
    );
    renderList(filtered);
}

// 4. ระบบยืนยัน (กันมือลั่น)
function confirmToggle(name, checkbox) {
    const isDone = checkbox.checked;
    const modal = document.getElementById('confirmModal');
    const modalText = document.getElementById('modalText');
    const confirmBtn = document.getElementById('confirmBtn');

    modal.classList.remove('hidden');
    modalText.innerText = `คุณกำลังจะเปลี่ยนสถานะของ "${name}" เป็น "${isDone ? 'ออกแล้ว' : 'ยังไม่ออก'}" ยืนยันไหมครับ?`;

    pendingUpdate = { name, isDone, checkbox };

    confirmBtn.onclick = async () => {
        checkbox.disabled = true;
        closeModal();
        await updateStatus(name, isDone);
        checkbox.disabled = false;
    };
}

function closeModal() {
    if (pendingUpdate) {
        pendingUpdate.checkbox.checked = !pendingUpdate.isDone; 
    }
    document.getElementById('confirmModal').classList.add('hidden');
}

// 5. อัปเดตข้อมูลสถานะ
async function updateStatus(name, isDone) {
    const status = isDone ? 'ออกแล้ว' : 'ยังไม่ออก';
    const target = allData.find(d => d.name === name);
    
    // แสดงความเฟี้ยว (Space Preview) ถ้าเงินออก
    if (isDone && target) {
        showSpacePreview(target);
    }

    try {
        await fetch(WEB_APP_URL, {
            method: 'POST',
            mode: 'no-cors',
            body: JSON.stringify({ name: name, status: status })
        });
        if(target) target.status = status;
        renderList(allData); // Refresh หน้าจอ
    } catch (e) { 
        console.error("Update failed", e);
        alert("เกิดข้อผิดพลาดในการส่งข้อมูลไปที่ Sheet");
    }
}

// 6. ระบบแสดงผลอวกาศ (Space Preview)
function showSpacePreview(item) {
    const card = document.getElementById('previewCard');
    document.getElementById('prevName').innerText = item.name;
    document.getElementById('prevLink').href = item.url || "#";
    
    // ดึงภาพ Thumbnail (ใช้บริการดึงจาก URL เว็บเขต)
    document.getElementById('prevImg').src = `https://s2.googleusercontent.com/s2/favicons?domain=${item.url}&sz=128`;

    card.classList.remove('hidden');
    setTimeout(() => {
        card.classList.remove('scale-0', 'opacity-0');
        card.classList.add('scale-100', 'opacity-100');
    }, 50);

    // หายไปเองใน 8 วินาที
    setTimeout(closeSpacePreview, 8000);
}

function closeSpacePreview() {
    const card = document.getElementById('previewCard');
    card.classList.add('scale-0', 'opacity-0');
    setTimeout(() => card.classList.add('hidden'), 700);
}

// 7. ระบบรายงาน (เฉพาะเขตที่ยังไม่ออก)
function generatePendingReport() {
    const reportSection = document.getElementById('reportSection');
    const reportContent = document.getElementById('reportContent');
    const pendingItems = allData.filter(item => item.status === "ยังไม่ออก");

    if (pendingItems.length === 0) {
        alert("🎉 ทุกเขตเงินออกครบหมดแล้วครับพี่ร็อบ!");
        return;
    }

    let html = `
        <table class="w-full text-left border-collapse">
            <thead>
                <tr class="text-slate-400 border-b-2 border-slate-100 text-lg">
                    <th class="py-4 px-2">ลำดับ</th>
                    <th class="py-4">ชื่อเขตพื้นที่</th>
                    <th class="py-4">ภาค</th>
                </tr>
            </thead>
            <tbody>
                ${pendingItems.map((item, i) => `
                    <tr class="border-b border-slate-50">
                        <td class="py-4 px-2 text-slate-300 font-bold">${i + 1}</td>
                        <td class="py-4 font-black text-3xl text-slate-800 tracking-tighter">${item.name}</td>
                        <td class="py-4 text-xl text-slate-500">${item.region}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
        <div class="mt-10 p-6 bg-red-50 rounded-3xl text-center">
            <p class="text-2xl font-bold text-red-600">รวมที่ยังค้างจ่ายทั้งสิ้น: ${pendingItems.length} เขต</p>
        </div>
    `;

    reportContent.innerHTML = html;
    document.getElementById('reportTimestamp').innerText = `พิมพ์เมื่อ: ${new Date().toLocaleString('th-TH')}`;
    reportSection.classList.remove('hidden');
    reportSection.scrollIntoView({ behavior: 'smooth' });
}

function closeReport() {
    document.getElementById('reportSection').classList.add('hidden');
}

// เริ่มรันระบบ
loadData();
