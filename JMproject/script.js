// JM Project - Core Logic (Slider Version)
const WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbyXTMpnUJw4R9u-g-WV_0nBURdiW6-B9T2HwZCzuq0QDeJVGqV9ok6D7UfMXbXw3jM4LQ/exec';

let allData = [];

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
        document.getElementById('loading').innerHTML = '<p class="text-red-400">เกิดข้อผิดพลาดในการดึงข้อมูลครับพี่</p>';
    }
}

// 2. แสดงผลรายการ Card พร้อม Slider และจุดมาร์ค (Tick Marks)
function renderList(data) {
    const container = document.getElementById('itemList');
    container.innerHTML = '';

    data.forEach(item => {
        const card = document.createElement('div');
        card.className = 'item-card p-6 rounded-2xl flex justify-between items-center';
        
        // แปลงสถานะเป็นตัวเลข 0, 1, 2 สำหรับ Slider
        let sliderValue = 0; 
        let statusColor = 'text-slate-500';
        
        if (item.status === 'ยังไม่ออก') {
            sliderValue = 1;
            statusColor = 'text-red-400';
        } else if (item.status === 'ออกแล้ว') {
            sliderValue = 2;
            statusColor = 'text-emerald-400';
        }

        // --- จุดที่พี่ต้องดูคือ card.innerHTML ด้านล่างนี้ครับ ---
        card.innerHTML = `
            <div>
                <h3 class="text-xl font-semibold mb-1">
                    ${item.status === 'ออกแล้ว' ? `<a href="${item.url}" target="_blank" class="text-cyan-400 hover:underline">${item.name}</a>` : item.name}
                </h3>
                <p class="text-slate-400 text-sm">${item.region} | ${item.type}</p>
            </div>
            <div class="flex flex-col items-center gap-2 min-w-[150px]">
                <!-- 1. ตัวรูด Slider -->
                <input type="range" min="0" max="2" step="1" value="${sliderValue}" 
                       class="status-slider w-full" 
                       onchange="handleSliderChange(this, '${item.name}', '${item.status}')">
                
                <!-- 2. จุดมาร์คใต้เส้น (Label) -->
                <div class="flex justify-between w-full px-1 text-[10px] text-slate-500 font-bold">
                    <span>ไม่มี</span>
                    <span>ค้าง</span>
                    <span>ออก</span>
                </div>

                <!-- 3. สถานะตัวหนังสือ (ล่างสุด) -->
                <span class="text-[10px] uppercase tracking-widest font-bold ${statusColor} mt-1">
                    ${item.status}
                </span>
            </div>
        `;
        container.appendChild(card);
    });
}

// 3. ฟังก์ชันจัดการการรูด (Slider)
async function handleSliderChange(slider, name, currentStatus) {
    const val = parseInt(slider.value);
    let nextStatus = '';
    let emoji = '';

    if (val === 0) { nextStatus = 'ยังไม่มีข้อมูล'; emoji = '⚪'; }
    else if (val === 1) { nextStatus = 'ยังไม่ออก'; emoji = '🔴'; }
    else { nextStatus = 'ออกแล้ว'; emoji = '✅'; }

    // ถ้าลากมาที่เดิม ไม่ต้องทำอะไร
    if (nextStatus === currentStatus) return;

    // ถามยืนยันเพื่อความชัวร์
    const confirmMsg = `ยืนยันเปลี่ยนสถานะของ "${name}"\nเป็น [ ${emoji} ${nextStatus} ] ใช่ไหมครับพี่?`;
    if (!confirm(confirmMsg)) {
        renderList(allData); // วาดใหม่เพื่อดีดปุ่มกลับที่เดิม
        return;
    }

    // Update UI ทันที
    const index = allData.findIndex(i => i.name === name);
    allData[index].status = nextStatus;
    renderList(allData);

    // ส่งข้อมูลไปบันทึก
    try {
        await fetch(WEB_APP_URL, {
            method: 'POST',
            body: JSON.stringify({ name: name, status: nextStatus })
        });
    } catch (error) {
        alert('❌ บันทึกไม่สำเร็จครับพี่ร็อบ!');
        fetchData(); 
    }
}

// 4. ระบบค้นหา (คงเดิม)
function filterList() {
    const searchTerm = document.getElementById('searchBox').value.toLowerCase();
    const regionSelect = document.getElementById('regionFilter').value;

    const filtered = allData.filter(item => {
        const regionText = item.region.toLowerCase();
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

// 5. ระบบรายงาน (คงเดิม)
function generatePendingReport() {
    const pendingItems = allData.filter(item => item.status === 'ยังไม่ออก');
    const noDataItems = allData.filter(item => item.status === 'ยังไม่มีข้อมูล');
    if (pendingItems.length === 0 && noDataItems.length === 0) {
        alert("🎉 ข้อมูลครบทุกเขตแล้วครับ!");
        return;
    }
    const reportContent = document.getElementById('reportContent');
    const timestamp = new Date().toLocaleString('th-TH');
    let tableHtml = (data) => `
        <table border="1" style="width:100%; border-collapse: collapse; margin-bottom: 20px;">
            <tr style="background: #eee;"><th>ชื่อเขต</th><th>ภาค</th><th>ประเภท</th></tr>
            ${data.map(i => `<tr><td>${i.name}</td><td>${i.region}</td><td>${i.type}</td></tr>`).join('')}
        </table>`;
    reportContent.innerHTML = `
        <div style="font-family: 'Kanit', sans-serif; color: black; padding:20px;">
            <h1 style="text-align:center;">รายงานสรุปเขตที่ค้างจ่าย (JM Project)</h1>
            <p style="text-align:right;">ข้อมูล ณ วันที่: ${timestamp}</p>
            ${pendingItems.length > 0 ? `<h3>🔴 ยังไม่ออก (${pendingItems.length})</h3>${tableHtml(pendingItems)}` : ''}
            ${noDataItems.length > 0 ? `<h3>⚪ ยังไม่มีข้อมูล (${noDataItems.length})</h3>${tableHtml(noDataItems)}` : ''}
        </div>`;
    window.print();
}
