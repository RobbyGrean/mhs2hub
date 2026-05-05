const WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbyXTMpnUJw4R9u-g-WV_0nBURdiW6-B9T2HwZCzuq0QDeJVGqV9ok6D7UfMXbXw3jM4LQ/exec';
let allData = [];

window.onload = async () => { 
    await fetchData();
    updateMonthHeader(); // เพิ่มการแสดงผลเดือนที่หัวเว็บ
};

// 1. คำนวณเดือนย้อนหลัง (เบิกเดือนนี้ คือยอดของเดือนที่แล้ว)
function updateMonthHeader() {
    const months = ["มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"];
    const d = new Date();
    d.setMonth(d.getMonth() - 1); // ถอยกลับ 1 เดือนตามเงื่อนไขพี่ร็อบ

    const monthDisplay = document.getElementById('currentMonthDisplay');
    if (monthDisplay) {
        monthDisplay.innerText = `${months[d.getMonth()]} ${d.getFullYear() + 543}`;
    }
}

async function fetchData() {
    try {
        const response = await fetch(WEB_APP_URL);
        allData = await response.json();
        document.getElementById('loading').classList.add('hidden');
        renderList(allData);
    } catch (error) {
        document.getElementById('loading').innerHTML = '<p class="text-red-400">เกิดข้อผิดพลาดในการดึงข้อมูลครับพี่</p>';
    }
}

// 2. แสดงผลรายการ (ปรับให้ลิงก์ไปอยู่ที่ Preview Card แทน)
function renderList(data) {
    const container = document.getElementById('itemList');
    container.innerHTML = '';

    data.forEach(item => {
        const card = document.createElement('div');
        card.className = 'item-card p-6 rounded-2xl flex justify-between items-center';
        
        let sliderValue = 0; 
        let statusColor = 'text-slate-500';
        let nameColor = 'text-slate-200';
        
        if (item.status === 'ยังไม่ออก') {
            sliderValue = 1;
            statusColor = 'text-red-400';
            nameColor = 'text-rose-400 animate-pulse'; // เน้นชื่อเขตที่ค้าง
        } else if (item.status === 'ออกแล้ว') {
            sliderValue = 2;
            statusColor = 'text-emerald-400';
            nameColor = 'text-emerald-400';
        }

        card.innerHTML = `
            <div>
                <h3 class="text-xl font-semibold mb-1 ${nameColor}">
                    ${item.name}
                </h3>
                <p class="text-slate-400 text-sm">${item.region} | ${item.type}</p>
            </div>
            <div class="flex flex-col items-center gap-2 min-w-[150px]">
                <input type="range" min="0" max="2" step="1" value="${sliderValue}" 
                       class="status-slider w-full" 
                       onchange="handleSliderChange(this, '${item.name}', '${item.status}')">
                
                <div class="flex justify-between w-full px-1 text-[10px] text-slate-500 font-bold">
                    <span>ไม่มี</span>
                    <span>ค้าง</span>
                    <span>ออก</span>
                </div>

                <span class="text-[10px] uppercase tracking-widest font-bold ${statusColor} mt-1">
                    ${item.status}
                </span>
            </div>
        `;
        container.appendChild(card);
    });
}

// 3. จัดการการรูด Slider และสั่งเด้ง Preview Card
async function handleSliderChange(slider, name, currentStatus) {
    const val = parseInt(slider.value);
    let nextStatus = val === 0 ? 'ยังไม่มีข้อมูล' : val === 1 ? 'ยังไม่ออก' : 'ออกแล้ว';
    let emoji = val === 0 ? '⚪' : val === 1 ? '🔴' : '✅';

    if (nextStatus === currentStatus) return;

    if (!confirm(`ยืนยันเปลี่ยนสถานะของ "${name}"\nเป็น [ ${emoji} ${nextStatus} ] ใช่ไหมครับพี่?`)) {
        renderList(allData);
        return;
    }

    const index = allData.findIndex(i => i.name === name);
    if (index !== -1) {
        allData[index].status = nextStatus;
        renderList(allData); 
        
        // --- เงื่อนไขใหม่: ถ้าค้าง ให้โชว์ Card ทันที ---
        if (nextStatus === 'ยังไม่ออก' && allData[index].url !== '#') {
            showPreview(name, allData[index].url);
        } else {
            hidePreview();
        }
    }

    try {
        await fetch(WEB_APP_URL, {
            method: 'POST',
            body: JSON.stringify({ name: name, status: nextStatus })
        });
    } catch (error) {
        alert('❌ บันทึกไม่สำเร็จครับพี่!');
        fetchData(); 
    }
}

// 4. ควบคุม Preview Card (มุมขวาล่าง)
function showPreview(name, url) {
    const card = document.getElementById('previewCard');
    const prevImg = document.getElementById('prevImg');
    
    // 1. ใส่ชื่อเขตและลิงก์เข้าไปก่อน
    document.getElementById('prevName').innerText = name;
    document.getElementById('prevLink').href = url;

    // 2. เคลียร์รูปเก่าออกก่อน (เพื่อไม่ให้รูปเขตก่อนหน้าค้างตอนโหลดรูปใหม่)
    prevImg.src = ""; 

    // 3. ดึงภาพด้วย API (ใช้สูตรดึงภาพ Open Graph เหมือน Google Sheets)
    // ผมใช้ encodeURIComponent เพื่อให้รองรับ URL ทุกรูปแบบครับ
    const apiUrl = `https://api.microlink.io/?url=${encodeURIComponent(url)}&embed=image.url&screenshot=true&meta=false`;
    prevImg.src = apiUrl;

    // 4. สั่งให้ Card เด้งขึ้นมา
    card.classList.remove('hidden', 'scale-0', 'opacity-0');
    card.classList.add('scale-100', 'opacity-100');

    // 5. กรณีดึงรูปไม่สำเร็จ ให้ใช้ภาพ Default ที่ดู Professional หน่อยครับ
    prevImg.onerror = function() {
        this.src = 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=80&w=400&h=200&auto=format&fit=crop';
    };
}

function hidePreview() {
    const card = document.getElementById('previewCard');
    card.classList.remove('scale-100', 'opacity-100');
    card.classList.add('scale-0', 'opacity-0');
    setTimeout(() => { if(card.classList.contains('scale-0')) card.classList.add('hidden'); }, 500);
}

// 5. ระบบค้นหา
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

// 6. ระบบรายงาน
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
