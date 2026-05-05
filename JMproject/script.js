/**
 * JM Project - Modern Command Center (Stable & Refined)
 * สำหรับ พี่ร็อบ (Brother Robb)
 */

const WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbyXTMpnUJw4R9u-g-WV_0nBURdiW6-B9T2HwZCzuq0QDeJVGqV9ok6D7UfMXbXw3jM4LQ/exec';
let allData = [];
let previousDataState = {}; 

window.onload = async () => { 
    await fetchData();
    updateMonthHeader(); 
};

function updateMonthHeader() {
    const months = ["มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"];
    const d = new Date();
    d.setMonth(d.getMonth() - 1); 
    const monthDisplay = document.getElementById('currentMonthDisplay');
    if (monthDisplay) {
        monthDisplay.innerText = `${months[d.getMonth()]} ${d.getFullYear() + 543}`;
    }
}

async function fetchData() {
    try {
        const response = await fetch(WEB_APP_URL);
        const result = await response.json(); 
        
        allData = result.items; // ข้อมูลเขต
        const initialLogs = result.logs; // ประวัติล่าสุด

        // 1. โหลดประวัติลง Live Feed ทันที
        const feedContainer = document.getElementById('statusFeed');
        if (feedContainer) {
            feedContainer.innerHTML = '';
            if (initialLogs && initialLogs.length > 0) {
                initialLogs.forEach(log => pushToFeed(log.name, log.status, log.time));
            } else {
                feedContainer.innerHTML = '<p class="text-slate-500 italic text-center py-4 text-sm">ยังไม่มีการเคลื่อนไหว</p>';
            }
        }

        // 2. เก็บสถานะเริ่มต้นไว้เช็กการเปลี่ยนแปลง
        allData.forEach(item => {
            previousDataState[item.name] = item.status;
        });

        document.getElementById('loading').classList.add('hidden');
        renderList(allData); // แสดงรายการทั้งหมด
        startAutoUpdate();
    } catch (error) {
        console.error("Fetch Error:", error);
    }
}

// --- ระบบ Search & Filter (เพิ่มกลับเข้ามาให้พี่ร็อบแล้ว) ---
function filterData() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const regionFilter = document.getElementById('regionFilter').value;

    const filtered = allData.filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(searchTerm) || 
                              item.region.toLowerCase().includes(searchTerm);
        const matchesRegion = regionFilter === "" || item.region === regionFilter;
        return matchesSearch && matchesRegion;
    });
    renderList(filtered);
}

function renderList(data) {
    const container = document.getElementById('itemList');
    if (!container) return;
    container.innerHTML = '';

    data.forEach(item => {
        const { name, status, region, type, url } = item; // Destructuring ชื่อภาษาอังกฤษจาก GAS
        
        let sliderValue = (status === 'ออกแล้ว') ? 2 : (status === 'ยังไม่ออก' || status === 'ค้างจ่าย') ? 1 : 0;
        let statusColor = sliderValue === 1 ? 'text-rose-400' : sliderValue === 2 ? 'text-emerald-400' : 'text-slate-500';
        let nameColor = sliderValue === 1 ? 'text-rose-400 animate-pulse' : sliderValue === 2 ? 'text-emerald-400' : 'text-slate-200';

        const card = document.createElement('div');
        card.className = 'item-card p-6 rounded-2xl flex justify-between items-center';
        card.innerHTML = `
            <div>
                <h3 class="text-xl font-semibold mb-1 ${nameColor}">
                    <a href="${url}" target="_blank" class="hover:underline">${name}</a>
                </h3>
                <p class="text-slate-400 text-sm">${region} | ${type}</p>
            </div>
            <div class="flex flex-col items-center gap-2 min-w-[150px]">
                <input type="range" min="0" max="2" step="1" value="${sliderValue}" 
                       class="status-slider w-full" 
                       onchange="handleSliderChange(this, '${name}', '${status}', '${url}')">
                <div class="flex justify-between w-full px-1 text-[10px] text-slate-500 font-bold uppercase">
                    <span>ไม่มี</span><span>ค้าง</span><span>ออก</span>
                </div>
                <span class="text-[10px] uppercase tracking-widest font-bold ${statusColor} mt-1">${status}</span>
            </div>
        `;
        container.appendChild(card);
    });
}

async function handleSliderChange(slider, name, currentStatus, url) {
    const val = parseInt(slider.value);
    // กำหนดค่าสถานะใหม่ตามตำแหน่ง Slider
    let nextStatus = val === 0 ? 'ยังไม่มีข้อมูล' : val === 1 ? 'ค้างจ่าย' : 'ออกแล้ว';
    let emoji = val === 0 ? '⚪' : val === 1 ? '🔴' : '✅';

    // 1. ถ้าเลื่อนแล้วได้ค่าเดิม (ไม่ได้เปลี่ยนตำแหน่งจริง) ไม่ต้องทำอะไร
    if (nextStatus === currentStatus) return;

    // 2. [จุดสำคัญ] บังคับถาม Confirm ทุกกรณี ไม่ว่าจะเลื่อนไปซ้าย (ไม่มีข้อมูล) หรือขวา (ออกแล้ว)
    if (!confirm(`ยืนยันเปลี่ยนสถานะของ "${name}" เป็น [ ${emoji} ${nextStatus} ] ใช่ไหมครับพี่ร็อบ?`)) {
        renderList(allData); // ถ้ากด Cancel ให้เด้งกลับไปตำแหน่งเดิม
        return;
    }

    // --- ส่วนที่เหลือคือการบันทึกลงฐานข้อมูล ---
    const idx = allData.findIndex(i => i.name === name);
    if (idx !== -1) {
        allData[idx].status = nextStatus;
        previousDataState[name] = nextStatus;
        renderList(allData); 
        
        // ถ้าค้างโอน ให้โชว์ Preview Card
        if (nextStatus === 'ค้างจ่าย') showPreview(name, url);
        else hidePreview();
        
        pushToFeed(name, nextStatus); 
    }

    try {
        await fetch(WEB_APP_URL, {
            method: 'POST',
            mode: 'no-cors', // ป้องกัน Error CORS บางกรณี
            body: JSON.stringify({ name: name, status: nextStatus })
        });
    } catch (e) {
        console.error("Save Error:", e);
        alert('❌ บันทึกไม่สำเร็จ!');
        fetchData(); 
    }
}

// ตรงบรรทัดที่สร้าง Card (renderList) ต้องเช็กว่าส่งค่าแบบนี้:
// onchange="handleSliderChange(this, '${item.name}', '${item.status}', '${item.url}')"

function showPreview(name, url) {
    const card = document.getElementById('previewCard');
    if (!card) return;

    document.getElementById('prevName').innerText = name;
    document.getElementById('prevLink').href = url || '#';
    // ใช้รูปตรา สพฐ. ตามที่พี่ต้องการ
    document.getElementById('prevImg').src = "https://www.kruchiangrai.net/wp-content/uploads/2021/02/%E0%B8%95%E0%B8%A3%E0%B8%B2%E0%B8%AA%E0%B8%B1%E0%B8%8D%E0%B8%A5%E0%B8%B1%E0%B8%81%E0%B8%A9%E0%B8%93%E0%B9%8C-%E0%B8%AA%E0%B8%9E%E0%B8%90.-%E0%B8%AA%E0%B8%9E%E0%B8%90.-3-D-%E0%B9%84%E0%B8%A1%E0%B9%88%E0%B8%A1%E0%B8%B5%E0%B8%82%E0%B8%AD%E0%B8%9า-1024x1024.png";

    // จังหวะแสดงตัว: ต้องลบ hidden ออกก่อน แล้วค่อยใส่ scale-100
    card.classList.remove('hidden');
    setTimeout(() => {
        card.classList.remove('scale-0', 'opacity-0');
        card.classList.add('scale-100', 'opacity-100');
    }, 10);
}

function hidePreview() {
    const card = document.getElementById('previewCard');
    if (!card) return;
    card.classList.replace('scale-100', 'scale-0');
    card.classList.replace('opacity-100', 'opacity-0');
    setTimeout(() => card.classList.add('hidden'), 500);
}

function pushToFeed(name, status, time = null) {
    const feedContainer = document.getElementById('statusFeed');
    if (!feedContainer) return;
    
    const timeStr = time || new Date().toLocaleTimeString('th-TH');
    const isSuccess = status === "ออกแล้ว";
    const colorClass = isSuccess ? "border-emerald-500/30 bg-emerald-500/5" : "border-rose-500/30 bg-rose-500/5";
    const textClass = isSuccess ? "text-emerald-400" : "text-rose-400";
    
    const logHTML = `
        <div class="p-3 rounded-xl border ${colorClass} mb-3 shadow-lg animate-fade-in-down">
            <div class="text-[10px] text-slate-500 font-mono mb-1">${timeStr}</div>
            <div class="text-slate-200 font-bold mb-1">${name}</div>
            <div class="${textClass} text-[11px] font-bold">
                ${isSuccess ? '✅ [ออกแล้ว]' : '🔴 [ค้างจ่าย]'}
            </div>
        </div>`;
        
    if (feedContainer.querySelector('p')) feedContainer.innerHTML = '';
    feedContainer.insertAdjacentHTML('afterbegin', logHTML);
    if (feedContainer.children.length > 15) feedContainer.lastChild.remove();
}

async function autoUpdateCheck() {
    try {
        const response = await fetch(WEB_APP_URL);
        const result = await response.json();
        const newData = result.items;

        newData.forEach(item => {
            if (previousDataState[item.name] !== undefined && previousDataState[item.name] !== item.status) {
                pushToFeed(item.name, item.status);
                previousDataState[item.name] = item.status;
            }
        });
        
        allData = newData;
        // ไม่สั่ง renderList() ใหม่ที่นี่เพื่อไม่ให้ไปกวนการ Search ของพี่ขณะพิมพ์
    } catch (e) { console.log("Silent update error"); }
}

let autoUpdateInterval;
function startAutoUpdate() {
    if (autoUpdateInterval) clearInterval(autoUpdateInterval);
    autoUpdateInterval = setInterval(autoUpdateCheck, 40000); // เช็กทุก 40 วินาที
}

function generateReport() {
    // 1. กรองข้อมูลจาก allData โดยใช้ชื่อตัวแปรภาษาอังกฤษ
    const completed = allData.filter(item => item.status === 'ออกแล้ว');
    const pending = allData.filter(item => item.status === 'ค้างจ่าย' || item.status === 'ยังไม่ออก');

    const reportSection = document.getElementById('reportSection');
    if (!reportSection) return;

    // 2. สร้างโครงสร้าง HTML สำหรับพิมพ์
    reportSection.innerHTML = `
        <div style="padding: 40px; font-family: 'Kanit', sans-serif; color: black; background: white;">
            <h1 style="text-align: center; font-size: 24px;">รายงานสถานะการโอนเงินเงินเดือน</h1>
            <p style="text-align: center;">ข้อมูล ณ วันที่: ${new Date().toLocaleDateString('th-TH')} เวลา ${new Date().toLocaleTimeString('th-TH')}</p>
            <hr style="margin: 20px 0;">
            <div style="display: flex; justify-content: space-between;">
                <div style="width: 48%;">
                    <h3 style="color: #059669; border-bottom: 2px solid #059669;">✅ ออกแล้ว (${completed.length} เขต)</h3>
                    <ul style="list-style: none; padding: 0;">
                        ${completed.map(i => `<li style="padding: 5px 0; border-bottom: 1px solid #eee;">${i.name}</li>`).join('')}
                    </ul>
                </div>
                <div style="width: 48%;">
                    <h3 style="color: #dc2626; border-bottom: 2px solid #dc2626;">🔴 ค้างจ่าย (${pending.length} เขต)</h3>
                    <ul style="list-style: none; padding: 0;">
                        ${pending.map(i => `<li style="padding: 5px 0; border-bottom: 1px solid #eee;">${i.name}</li>`).join('')}
                    </ul>
                </div>
            </div>
        </div>
    `;

    // 3. สั่งพิมพ์
    window.print();
}
