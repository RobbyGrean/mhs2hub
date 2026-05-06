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
    const searchInput = document.getElementById('searchInput');
    const regionFilterEl = document.getElementById('regionFilter');
    
    if (!searchInput || !regionFilterEl) return;

    let searchTerm = searchInput.value.toLowerCase().trim();
    let selectedRegion = regionFilterEl.value;

    // 1. สร้าง Mapping สำหรับคำค้นหาและตัวกรองภาค
    // ถ้าเจอคำว่า 'อีสาน' ให้มองเป็น 'ตะวันออกเฉียงเหนือ' ทันที
    const regionMap = {
        'อีสาน': 'ตะวันออกเฉียงเหนือ',
        'ภาคอีสาน': 'ตะวันออกเฉียงเหนือ'
    };

    // แปลงค่าจากตัวกรอง (ถ้าเลือกอีสาน ให้เปลี่ยนเป็นตะวันออกเฉียงเหนือเพื่อใช้เทียบกับ Data)
    const mappedRegion = regionMap[selectedRegion] || selectedRegion;

    const filtered = allData.filter(item => {
        const regionText = item.region ? String(item.region).toLowerCase() : "";
        const nameText = item.name ? String(item.name).toLowerCase() : "";

        // 2. ปรับลอจิก Search ให้พิมพ์ 'อีสาน' แล้วเจอ 'ตะวันออกเฉียงเหนือ'
        // เช็กทั้งคำค้นหาปกติ และคำค้นหาที่ผ่านการ Map แล้ว
        const mappedSearch = regionMap[searchTerm] || searchTerm;
        const matchesSearch = nameText.includes(searchTerm) || 
                              regionText.includes(searchTerm) || 
                              regionText.includes(mappedSearch);
        
        // 3. เช็กภาคโดยใช้ค่าที่ Map แล้ว
        const matchesRegion = selectedRegion === "" || item.region === mappedRegion;

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
    if (!confirm(`ยืนยันเปลี่ยนสถานะของ "${name}" เป็น [ ${emoji} ${nextStatus} ] ใช่ไหมครับพี่?`)) {
        filterData(); // เปลี่ยนจาก renderList(allData) เป็นตัวนี้เพื่อให้มันกรองตามเงื่อนไขเดิม
        return;
    }

    // --- ส่วนที่เหลือคือการบันทึกลงฐานข้อมูล ---
    const idx = allData.findIndex(i => i.name === name);
    if (idx !== -1) {
        allData[idx].status = nextStatus;
        previousDataState[name] = nextStatus;
        filterData();
        
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

    const imgEl = document.getElementById('prevImg');
    if (imgEl) {
        // เรียกไฟล์ OBECs.png จากใน Repo ได้เลยครับพี่ร็อบ
        imgEl.src = "OBECs.png"; 
    }

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

function generatePendingReport() {
    const reportSection = document.getElementById('reportSection');
    const previewCard = document.getElementById('previewCard');
    
    if (!reportSection) return;

    if (previewCard) {
        previewCard.classList.add('hidden');
        previewCard.style.display = 'none';
    }

    // --- 1. จัดการเรื่องเดือน (ถอยหลัง 1 เดือน) ---
    const monthNames = ["มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน", 
                        "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"];
    const d = new Date();
    d.setMonth(d.getMonth() - 1); // ลืมนับ -1 จัดให้แล้วครับพี่
    const targetMonth = `${monthNames[d.getMonth()]} ${d.getFullYear() + 543}`;

    // --- 2. กรองและแยกกลุ่ม (นับลำดับแยกกัน) ---
    const regionFilter = document.getElementById('regionFilter').value;
    
    // กรองข้อมูลตามภาคที่เลือกก่อน (ถ้าเลือก)
    const baseFiltered = allData.filter(item => regionFilter === "" || item.region === regionFilter);

    // แยกเป็น 2 กลุ่ม
    const overDue = baseFiltered.filter(item => item.status === 'ค้างจ่าย' || item.status === 'ยังไม่ออก')
                                .sort((a, b) => a.name.localeCompare(b.name, 'th'));
    
    const noData = baseFiltered.filter(item => item.status === 'ยังไม่มีข้อมูล')
                               .sort((a, b) => a.name.localeCompare(b.name, 'th'));

    if (overDue.length === 0 && noData.length === 0) {
        alert("ไม่มีรายการค้างดำเนินการครับ");
        return;
    }

    // ฟังก์ชันช่วยสร้างแถวตาราง (เพื่อความสะอาดของโค้ด)
    const renderRows = (data) => data.map((i, index) => `
        <tr>
            <td style="border: 1px solid #000; padding: 8px; text-align: center;">${index + 1}</td>
            <td style="border: 1px solid #000; padding: 8px;">${i.name || '-'}</td>
            <td style="border: 1px solid #000; padding: 8px; text-align: center; ${i.status === 'ค้างจ่าย' ? 'color: red; font-weight: bold;' : ''}">${i.status}</td>
        </tr>
    `).join('');

    // --- 3. สร้าง HTML รายงาน ---
    let html = `
        <div style="padding: 30px; font-family: 'Kanit', sans-serif; color: black; background: white; min-height: 100vh;">
            <div style="text-align: center; border-bottom: 2px solid #000; padding-bottom: 15px; margin-bottom: 25px;">
                <h1 style="margin: 0; font-size: 24px;">รายงานสรุปเขตพื้นที่ที่ยังไม่ดำเนินการ</h1>
                <p style="font-size: 16px; margin: 8px 0;">สถานะค้างเบิก เดือน : ${targetMonth}</p>
                <p style="font-size: 12px; color: #666;">ข้อมูล ณ วันที่: ${new Date().toLocaleDateString('th-TH')} เวลา ${new Date().toLocaleTimeString('th-TH')} น.</p>
            </div>

            <!-- ตารางที่ 1: ค้างจ่าย -->
            ${overDue.length > 0 ? `
                <h3 style="margin: 15px 0 10px 0; color: #e11d48;">⚠️ รายการค้างจ่าย (${overDue.length} เขต)</h3>
                <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                    <thead>
                        <tr style="background: #f1f5f9;">
                            <th style="border: 1px solid #000; padding: 10px; text-align: center; width: 60px;">ลำดับ</th>
                            <th style="border: 1px solid #000; padding: 10px; text-align: left;">ชื่อเขตพื้นที่</th>
                            <th style="border: 1px solid #000; padding: 10px; text-align: center; width: 150px;">สถานะ</th>
                        </tr>
                    </thead>
                    <tbody>${renderRows(overDue)}</tbody>
                </table>
            ` : ''}

            <!-- ตารางที่ 2: ยังไม่มีข้อมูล -->
            ${noData.length > 0 ? `
                <h3 style="margin: 25px 0 10px 0; color: #475569;">⚪ รายการยังไม่มีข้อมูล (${noData.length} เขต)</h3>
                <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                    <thead>
                        <tr style="background: #f1f5f9;">
                            <th style="border: 1px solid #000; padding: 10px; text-align: center; width: 60px;">ลำดับ</th>
                            <th style="border: 1px solid #000; padding: 10px; text-align: left;">ชื่อเขตพื้นที่</th>
                            <th style="border: 1px solid #000; padding: 10px; text-align: center; width: 150px;">สถานะ</th>
                        </tr>
                    </thead>
                    <tbody>${renderRows(noData)}</tbody>
                </table>
            ` : ''}
            
            <div style="text-align: right; font-weight: bold; font-size: 16px; margin-top: 20px;">
                จำนวนที่ยังไม่เรียบร้อยรวมทั้งสิ้น: ${overDue.length + noData.length} เขต
            </div>
        </div>
    `;

    reportSection.innerHTML = html;
    
    setTimeout(() => {
        window.print();
        if (previewCard) {
            previewCard.classList.remove('hidden');
            previewCard.style.display = 'block';
        }
    }, 300);
}
