// JM Project - Core Logic
// พี่ร็อบอย่าลืมตรวจสอบ URL ด้านล่างนี้ให้ตรงกับที่ Deploy มานะครับ
const WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbyXTMpnUJw4R9u-g-WV_0nBURdiW6-B9T2HwZCzuq0QDeJVGqV9ok6D7UfMXbXw3jM4LQ/exec';

let allData = [];

// 1. ดึงข้อมูลเมื่อโหลดหน้าเว็บ
window.onload = async () => {
    await fetchData();
};

async function fetchData() {
    try {
        const response = await fetch(WEB_APP_URL);
        allData = await response.json();
        document.getElementById('loading').classList.add('hidden');
        renderList(allData);
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('loading').innerHTML = '<p class="text-red-400">เกิดข้อผิดพลาดในการดึงข้อมูลครับพี่ร็อบ</p>';
    }
}

// 2. แสดงผลรายการ Card
function renderList(data) {
    const container = document.getElementById('itemList');
    container.innerHTML = '';

    data.forEach(item => {
        const card = document.createElement('div');
        card.className = 'item-card p-6 rounded-2xl flex justify-between items-center';
        
        // กำหนด Class ตามสถานะ
        let statusClass = 'none';
        if (item.status === 'ออกแล้ว') statusClass = 'active';
        if (item.status === 'ยังไม่ออก') statusClass = '';

        card.innerHTML = `
            <div>
                <h3 class="text-xl font-semibold mb-1">
                    ${item.status === 'ออกแล้ว' ? `<a href="${item.url}" target="_blank" class="text-blue-400 hover:underline">${item.name}</a>` : item.name}
                </h3>
                <p class="text-slate-400 text-sm">${item.region} | ${item.type}</p>
            </div>
            <div class="flex flex-col items-center gap-2">
                <div class="toggle-bg ${statusClass}" onclick="updateStatus('${item.name}', '${item.status}')">
                    <div class="toggle-dot"></div>
                </div>
                <span class="text-xs ${item.status === 'ออกแล้ว' ? 'text-emerald-400' : 'text-slate-500'}">${item.status}</span>
            </div>
        `;
        container.appendChild(card);
    });
}

// 3. ระบบ Toggle สถานะ 3 จังหวะ (ยังไม่ออก -> ออกแล้ว -> ยังไม่มีข้อมูล)
async function updateStatus(name, currentStatus) {
    let nextStatus = '';
    if (currentStatus === 'ยังไม่ออก') nextStatus = 'ออกแล้ว';
    else if (currentStatus === 'ออกแล้ว') nextStatus = 'ยังไม่มีข้อมูล';
    else nextStatus = 'ยังไม่ออก';

    // Update UI ทันที (Optimistic Update)
    const index = allData.findIndex(i => i.name === name);
    allData[index].status = nextStatus;
    renderList(allData);

    // ส่งข้อมูลไปบันทึกใน Google Sheets
    try {
        await fetch(WEB_APP_URL, {
            method: 'POST',
            body: JSON.stringify({ name: name, status: nextStatus })
        });
    } catch (error) {
        alert('บันทึกข้อมูลไม่สำเร็จครับพี่ร็อบ ลองตรวจสอบเน็ตดูนะครับ');
    }
}

// 4. ระบบค้นหาและคัดกรอง (รองรับคำว่า "อีสาน")
function filterList() {
    const searchTerm = document.getElementById('searchBox').value.toLowerCase();
    const regionSelect = document.getElementById('regionFilter').value;

    const filtered = allData.filter(item => {
        const regionText = item.region.toLowerCase();
        
        // รองรับ Alias "อีสาน"
        const isIsanSearch = searchTerm.includes("อีสาน") && regionText.includes("ตะวันออกเฉียงเหนือ");

        const matchesSearch = item.name.toLowerCase().includes(searchTerm) || 
                              regionText.includes(searchTerm) ||
                              item.type.toLowerCase().includes(searchTerm) ||
                              isIsanSearch;

        const matchesRegion = regionSelect === "" || item.region === regionSelect;

        return matchesSearch && matchesRegion;
    });

    renderList(filtered);
}

// 5. ระบบออกรายงาน PDF (Direct Print)
function generatePendingReport() {
    const pendingItems = allData.filter(item => item.status === 'ยังไม่ออก');
    const noDataItems = allData.filter(item => item.status === 'ยังไม่มีข้อมูล');

    if (pendingItems.length === 0 && noDataItems.length === 0) {
        alert("🎉 ข้อมูลครบทุกเขตแล้วครับพี่ร็อบ!");
        return;
    }

    const reportContent = document.getElementById('reportContent');
    const timestamp = new Date().toLocaleString('th-TH');
    
    let tableHtml = (data) => `
        <table border="1" style="width:100%; border-collapse: collapse; margin-bottom: 20px;">
            <thead>
                <tr style="background: #eee;">
                    <th style="padding: 8px;">ชื่อเขต</th>
                    <th style="padding: 8px;">ภาค</th>
                    <th style="padding: 8px;">ประเภท</th>
                </tr>
            </thead>
            <tbody>
                ${data.map(i => `<tr><td style="padding: 8px;">${i.name}</td><td style="padding: 8px;">${i.region}</td><td style="padding: 8px;">${i.type}</td></tr>`).join('')}
            </tbody>
        </table>
    `;

    reportContent.innerHTML = `
        <div style="font-family: 'Kanit', sans-serif; color: black;">
            <h1 style="text-align:center;">รายงานสรุปเขตที่ค้างจ่าย (JM Project)</h1>
            <p style="text-align:right;">ข้อมูล ณ วันที่: ${timestamp}</p>
            ${pendingItems.length > 0 ? `<h3>🔴 รายการที่ยังไม่ออก (${pendingItems.length} เขต)</h3>${tableHtml(pendingItems)}` : ''}
            ${noDataItems.length > 0 ? `<h3>⚪ รายการที่ยังไม่มีข้อมูล (${noDataItems.length} เขต)</h3>${tableHtml(noDataItems)}` : ''}
        </div>
    `;

    window.print();
}
