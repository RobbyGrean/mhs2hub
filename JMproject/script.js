/** 
 * JM Project - Core Logic (3-Step Toggle Full Version)
 * Revised for "Brother Robb" (พี่ร็อบ)
 */

const WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbyXTMpnUJw4R9u-g-WV_0nBURdiW6-B9T2HwZCzuq0QDeJVGqV9ok6D7UfMXbXw3jM4LQ/exec'; 
const statusMap = ["ยังไม่มีข้อมูล", "ยังไม่ออก", "ออกแล้ว"];
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

// 2. แสดงผลรายชื่อ (ปรับเป็น 3-Step Toggle)
function renderList(items) {
    const listContainer = document.getElementById('list-container');
    if (items.length === 0) {
        listContainer.innerHTML = '<p class="text-center py-10 text-slate-500 text-xl">ไม่พบข้อมูลที่ค้นหา...</p>';
        return;
    }

    listContainer.innerHTML = items.map(item => {
        let stateIdx = statusMap.indexOf(item.status);
        if (stateIdx === -1) stateIdx = 0; // Default เป็นซ้ายสุด (ยังไม่มีข้อมูล)

        return `
        <div class="item-card group">
            <div class="flex-1 pr-4">
                <div class="text-title tracking-tighter">${item.name}</div>
                <div class="text-subtitle font-bold text-blue-400/80">${item.region} | ${item.type}</div>
            </div>
            <div class="flex flex-col items-center gap-2">
                <!-- 3-Step Toggle Slider -->
                <div class="tri-state-toggle state-${stateIdx}" onclick="confirmToggle('${item.name}', ${stateIdx})">
                    <div class="toggle-ball"></div>
                </div>
                <span class="text-xs font-bold uppercase tracking-widest 
                    ${stateIdx === 1 ? 'text-red-400' : (stateIdx === 2 ? 'text-emerald-400' : 'text-slate-500')}">
                    ${statusMap[stateIdx]}
                </span>
            </div>
        </div>
    `}).join('');
}

// 3. ระบบค้นหา (คงเดิม)
function filterList() {
    const term = document.getElementById('searchBox').value.toLowerCase();
    const filtered = allData.filter(item => 
        item.name.toLowerCase().includes(term) || 
        item.region.toLowerCase().includes(term)
    );
    renderList(filtered);
}

// 4. ระบบยืนยันการเปลี่ยนสถานะ (กันมือลั่น)
function confirmToggle(name, currentIdx) {
    const nextIdx = (currentIdx + 1) % 3;
    const modal = document.getElementById('confirmModal');
    const modalText = document.getElementById('modalText');
    const confirmBtn = document.getElementById('confirmBtn');

    modal.classList.remove('hidden');
    modalText.innerText = `คุณกำลังจะเปลี่ยนสถานะของ "${name}" เป็น "${statusMap[nextIdx]}" ยืนยันไหมครับพี่ร็อบ?`;

    pendingUpdate = { name, nextIdx };

    confirmBtn.onclick = async () => {
        closeModal();
        await updateStatus(name, statusMap[nextIdx]);
    };
}

function closeModal() {
    document.getElementById('confirmModal').classList.add('hidden');
    pendingUpdate = null;
}

// 5. อัปเดตข้อมูลสถานะ (ส่งไป Sheet)
async function updateStatus(name, status) {
    const target = allData.find(d => d.name === name);
    
    // ถ้าเปลี่ยนเป็น "ออกแล้ว" (Index 2) ให้โชว์ Preview อวกาศ
    if (status === "ออกแล้ว" && target) {
        showSpacePreview(target);
    }

    try {
        await fetch(WEB_APP_URL, {
            method: 'POST',
            mode: 'no-cors',
            body: JSON.stringify({ name: name, status: status })
        });
        if(target) target.status = status;
        renderList(allData); // Refresh UI
    } catch (e) { 
        console.error("Update failed", e);
        alert("เกิดข้อผิดพลาดในการส่งข้อมูลไปที่ Sheet");
    }
}

// 6. ระบบแสดงผลอวกาศ (Space Preview)
function showSpacePreview(item) {
    const card = document.getElementById('previewCard');
    if(!card) return;
    
    document.getElementById('prevName').innerText = item.name;
    document.getElementById('prevLink').href = item.url || "#";
    document.getElementById('prevImg').src = `https://s2.googleusercontent.com/s2/favicons?domain=${item.url}&sz=128`;

    card.classList.remove('hidden');
    setTimeout(() => {
        card.classList.remove('scale-0', 'opacity-0');
        card.classList.add('scale-100', 'opacity-100');
    }, 50);

    setTimeout(closeSpacePreview, 8000);
}

function closeSpacePreview() {
    const card = document.getElementById('previewCard');
    if(!card) return;
    card.classList.add('scale-0', 'opacity-0');
    setTimeout(() => card.classList.add('hidden'), 700);
}

// 7. ระบบรายงาน (แยกโซน ยังไม่ออก VS ยังไม่มีข้อมูล)
function generatePendingReport() {
    const reportSection = document.getElementById('reportSection');
    const reportContent = document.getElementById('reportContent');
    
    const pendingItems = allData.filter(item => item.status === "ยังไม่ออก");
    const noDataItems = allData.filter(item => item.status === "ยังไม่มีข้อมูล");

    if (pendingItems.length === 0 && noDataItems.length === 0) {
        alert("🎉 ข้อมูลครบและเงินออกหมดทุกเขตแล้วครับพี่ร็อบ!");
        return;
    }

    let html = "";
    
    // โซนที่ 1: ยังไม่ออก (แดง)
    if (pendingItems.length > 0) {
        html += `<h3 class="text-2xl font-black text-red-600 mb-4 border-l-8 border-red-600 pl-4">🔴 เขตที่แจ้งว่าเงินยังไม่ออก (${pendingItems.length})</h3>`;
        html += renderTable(pendingItems);
    }

    // โซนที่ 2: ยังไม่มีข้อมูล (เทา)
    if (noDataItems.length > 0) {
        html += `<h3 class="text-2xl font-black text-slate-500 mb-4 mt-10 border-l-8 border-slate-500 pl-4">⚪ เขตที่ยังไม่ได้กรอกข้อมูล (${noDataItems.length})</h3>`;
        html += renderTable(noDataItems);
    }

    reportContent.innerHTML = html;
    document.getElementById('reportTimestamp').innerText = `พิมพ์เมื่อ: ${new Date().toLocaleString('th-TH')}`;
    reportSection.classList.remove('hidden');
    reportSection.scrollIntoView({ behavior: 'smooth' });
}

function renderTable(items) {
    return `
        <table class="w-full text-left border-collapse mb-8">
            <thead>
                <tr class="text-slate-400 border-b-2 border-slate-100">
                    <th class="py-2 px-2">ลำดับ</th>
                    <th class="py-2">ชื่อเขตพื้นที่</th>
                    <th class="py-2">ภาค</th>
                </tr>
            </thead>
            <tbody>
                ${items.map((item, i) => `
                    <tr class="border-b border-slate-50">
                        <td class="py-3 px-2 text-slate-400">${i + 1}</td>
                        <td class="py-3 font-bold text-2xl text-slate-800">${item.name}</td>
                        <td class="py-3 text-slate-500">${item.region}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>`;
}

function closeReport() {
    document.getElementById('reportSection').classList.add('hidden');
}

// เริ่มรัน
loadData();
