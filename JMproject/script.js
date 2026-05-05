const WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbyXTMpnUJw4R9u-g-WV_0nBURdiW6-B9T2HwZCzuq0QDeJVGqV9ok6D7UfMXbXw3jM4LQ/exec';
let allData = [];
let pendingUpdate = null;

async function loadData() {
    const listContainer = document.getElementById('list-container');
    listContainer.innerHTML = '<p class="text-center py-10 animate-pulse">กำลังซิงค์ข้อมูลจาก Database...</p>';

    try {
        const response = await fetch(WEB_APP_URL);
        allData = await response.json();
        renderList(allData);
    } catch (error) {
        listContainer.innerHTML = '<p class="text-red-400 text-center">❌ เชื่อมต่อท่อข้อมูลไม่สำเร็จ</p>';
    }
}

function renderList(items) {
    const listContainer = document.getElementById('list-container');
    listContainer.innerHTML = items.map(item => `
        <div class="flex items-center justify-between p-5 mb-3 bg-slate-800/60 rounded-2xl border border-white/5 hover:border-blue-500/50 transition shadow-lg group">
            <div>
                <div class="text-xl font-bold text-white group-hover:text-blue-300 transition">${item.name}</div>
                <div class="text-sm text-slate-500 font-medium">${item.region} | ${item.type}</div>
            </div>
            <label class="switch">
                <input type="checkbox" ${item.status === 'ออกแล้ว' ? 'checked' : ''} 
                       onchange="confirmToggle('${item.name}', this)">
                <span class="slider"></span>
            </label>
        </div>
    `).join('');
}

function generatePendingReport() {
    const reportSection = document.getElementById('reportSection');
    const reportContent = document.getElementById('reportContent');
    const reportTimestamp = document.getElementById('reportTimestamp');
    
    // 1. กรองเฉพาะเขตที่สถานะคือ "ยังไม่ออก"
    const pendingItems = allData.filter(item => item.status === "ยังไม่ออก");

    if (pendingItems.length === 0) {
        alert("🎉 ยินดีด้วย! ทุกเขตเงินออกครบหมดแล้วครับพี่ร็อบ");
        return;
    }

    // 2. จัดรูปแบบการแสดงผล
    let html = `
        <table class="w-full text-left">
            <thead>
                <tr class="text-slate-500 border-b">
                    <th class="py-2">ลำดับ</th>
                    <th class="py-2">รายชื่อเขตพื้นที่</th>
                    <th class="py-2">ภาค</th>
                </tr>
            </thead>
            <tbody>
    `;

    pendingItems.forEach((item, index) => {
        html += `
            <tr class="border-b border-slate-100">
                <td class="py-3 font-bold text-slate-400">${index + 1}</td>
                <td class="py-3 font-black text-2xl text-slate-800">${item.name}</td>
                <td class="py-3 text-slate-600">${item.region}</td>
            </tr>
        `;
    });

    html += `</tbody></table>`;
    html += `<div class="mt-6 text-2xl font-bold text-red-600">รวมทั้งหมด: ${pendingItems.length} เขต</div>`;

    // 3. แสดงผลและเลื่อนหน้าจอมาที่รายงาน
    reportContent.innerHTML = html;
    reportTimestamp.innerText = `ข้อมูล ณ วันที่: ${new Date().toLocaleString('th-TH')}`;
    reportSection.classList.remove('hidden');
    reportSection.scrollIntoView({ behavior: 'smooth' });
}

function closeReport() {
    document.getElementById('reportSection').classList.add('hidden');
}

// ระบบค้นหา
function filterList() {
    const term = document.getElementById('searchBox').value.toLowerCase();
    const filtered = allData.filter(item => 
        item.name.toLowerCase().includes(term) || 
        item.region.toLowerCase().includes(term)
    );
    renderList(filtered);
}

// ระบบยืนยันข้อมูล
function confirmToggle(name, checkbox) {
    const isDone = checkbox.checked;
    const modal = document.getElementById('confirmModal');
    const modalText = document.getElementById('modalText');
    const confirmBtn = document.getElementById('confirmBtn');

    modal.classList.remove('hidden');
    modalText.innerText = `ต้องการเปลี่ยนสถานะของ "${name}" เป็น "${isDone ? 'ออกแล้ว' : 'ยังไม่ออก'}" ใช่หรือไม่?`;

    // เก็บค่าไว้รอกดตกลง
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
        pendingUpdate.checkbox.checked = !pendingUpdate.isDone; // คืนค่าถ้ากดยกเลิก
    }
    document.getElementById('confirmModal').classList.add('hidden');
}

async function updateStatus(name, isDone) {
    const status = isDone ? 'ออกแล้ว' : 'ยังไม่ออก';
    try {
        await fetch(WEB_APP_URL, {
            method: 'POST',
            mode: 'no-cors', // สำคัญมากสำหรับ GAS
            body: JSON.stringify({ name: name, status: status })
        });
        // อัปเดตข้อมูลในตัวแปร local
        const target = allData.find(d => d.name === name);
        if(target) target.status = status;
    } catch (e) { console.error("Update failed", e); }
}

loadData();
