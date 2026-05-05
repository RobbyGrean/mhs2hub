// บรรทัดที่ 1: URL จาก Apps Script ของพี่
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
        allData = await response.json();
        allData.forEach(item => {
            previousDataState[item["ชื่อเขต"]] = item["สถานะ"];
        });
        document.getElementById('loading').classList.add('hidden');
        renderList(allData);
        startAutoUpdate();
    } catch (error) {
        document.getElementById('loading').innerHTML = '<p class="text-red-400">เกิดข้อผิดพลาดในการดึงข้อมูลครับพี่</p>';
    }
}

function renderList(data) {
    const container = document.getElementById('itemList');
    if (!container) return;
    container.innerHTML = '';

    data.forEach(item => {
        const card = document.createElement('div');
        card.className = 'item-card p-6 rounded-2xl flex justify-between items-center';
        
        let sliderValue = 0; 
        let statusColor = 'text-slate-500';
        let nameColor = 'text-slate-200';
        
        const status = item["สถานะ"];
        const name = item["ชื่อเขต"];

        if (status === 'ยังไม่ออก' || status === 'ค้างจ่าย') {
            sliderValue = 1;
            statusColor = 'text-red-400';
            nameColor = 'text-rose-400 animate-pulse';
        } else if (status === 'ออกแล้ว') {
            sliderValue = 2;
            statusColor = 'text-emerald-400';
            nameColor = 'text-emerald-400';
        }

        card.innerHTML = `
            <div>
                <h3 class="text-xl font-semibold mb-1 ${nameColor}">${name}</h3>
                <p class="text-slate-400 text-sm">${item["ภาค"]} | ${item["ประเภท"]}</p>
            </div>
            <div class="flex flex-col items-center gap-2 min-w-[150px]">
                <input type="range" min="0" max="2" step="1" value="${sliderValue}" 
                       class="status-slider w-full" 
                       onchange="handleSliderChange(this, '${name}', '${status}')">
                <div class="flex justify-between w-full px-1 text-[10px] text-slate-500 font-bold">
                    <span>ไม่มี</span><span>ค้าง</span><span>ออก</span>
                </div>
                <span class="text-[10px] uppercase tracking-widest font-bold ${statusColor} mt-1">${status}</span>
            </div>
        `;
        container.appendChild(card);
    });
}

async function handleSliderChange(slider, name, currentStatus) {
    const val = parseInt(slider.value);
    let nextStatus = val === 0 ? 'ยังไม่มีข้อมูล' : val === 1 ? 'ยังไม่ออก' : 'ออกแล้ว';
    let emoji = val === 0 ? '⚪' : val === 1 ? '🔴' : '✅';

    if (nextStatus === currentStatus) return;

    if (!confirm(`ยืนยันเปลี่ยนสถานะของ "${name}" เป็น [ ${emoji} ${nextStatus} ] ใช่ไหมครับพี่?`)) {
        renderList(allData);
        return;
    }

    const index = allData.findIndex(i => i["ชื่อเขต"] === name);
    if (index !== -1) {
        allData[index]["สถานะ"] = nextStatus;
        previousDataState[name] = nextStatus;
        renderList(allData); 

        // ถ้าสถานะเป็น "ค้างจ่าย" ให้เด้ง Preview ตรา สพฐ. ทันที
        if (nextStatus === 'ยังไม่ออก' || nextStatus === 'ค้างจ่าย') {
            showPreview(name, allData[index].url || '#');
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

// ฟังก์ชันแสดงพรีวิว (ล็อคภาพตรา สพฐ.)
function showPreview(name, url) {
    const card = document.getElementById('previewCard');
    const prevImg = document.getElementById('prevImg');
    
    document.getElementById('prevName').innerText = name;
    document.getElementById('prevLink').href = url;

    // ล็อคลิงก์ภาพเป็นตรา สพฐ. ตามที่พี่ร็อบสั่งเลยครับ
    prevImg.src = "https://www.kruchiangrai.net/wp-content/uploads/2021/02/%E0%B8%95%E0%B8%A3%E0%B8%B2%E0%B8%AA%E0%B8%B1%E0%B8%8D%E0%B8%A5%E0%B8%B1%E0%B8%81%E0%B8%A9%E0%B8%93%E0%B9%8C-%E0%B8%AA%E0%B8%9E%E0%B8%90.-%E0%B8%AA%E0%B8%9E%E0%B8%90.-3-D-%E0%B9%84%E0%B8%A1%E0%B9%88%E0%B8%A1%E0%B8%B5%E0%B8%82%E0%B8%AD%E0%B8%9า-1024x1024.png";

    card.classList.remove('hidden', 'scale-0', 'opacity-0');
    card.classList.add('scale-100', 'opacity-100');
}

function hidePreview() {
    const card = document.getElementById('previewCard');
    card.classList.remove('scale-100', 'opacity-100');
    card.classList.add('scale-0', 'opacity-0');
    setTimeout(() => { if(card.classList.contains('scale-0')) card.classList.add('hidden'); }, 500);
}

function pushToFeed(areaName, status) {
    const feedContainer = document.getElementById('statusFeed');
    if (!feedContainer) return;
    const timeStr = new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    let statusMsg = status === "ออกแล้ว" 
        ? `เปลี่ยนสถานะเป็น <span class="text-emerald-400 font-bold">[ออกแล้ว]</span> ✅`
        : `เปลี่ยนสถานะเป็น <span class="text-rose-400 font-bold">[ค้างจ่าย]</span> 🔴`;
    let borderClass = status === "ออกแล้ว" ? "border-emerald-500/30 bg-emerald-500/5" : "border-rose-500/30 bg-rose-500/5";
    const logHTML = `<div class="p-3 rounded-xl border ${borderClass} mb-3 shadow-lg animate-fade-in-down"><div class="text-[10px] text-slate-500 font-mono mb-1">${timeStr}</div><div class="text-slate-200 font-bold mb-1">${areaName}</div><div class="text-slate-400 text-[11px]">${statusMsg}</div></div>`;
    if (feedContainer.querySelector('p')) feedContainer.innerHTML = '';
    feedContainer.insertAdjacentHTML('afterbegin', logHTML);
    if (feedContainer.children.length > 15) feedContainer.lastChild.remove();
}

async function autoUpdateCheck() {
    try {
        const response = await fetch(WEB_APP_URL); 
        const data = await response.json();
        data.forEach(item => {
            const areaName = item["ชื่อเขต"];
            const currentStatus = item["สถานะ"];
            if (previousDataState[areaName] !== undefined && previousDataState[areaName] !== currentStatus) {
                pushToFeed(areaName, currentStatus);
            }
            previousDataState[areaName] = currentStatus;
        });
        allData = data;
        renderList(allData);
    } catch (error) { console.error("Auto check error:", error); }
}

let autoUpdateInterval;
function startAutoUpdate() {
    if (autoUpdateInterval) clearInterval(autoUpdateInterval);
    autoUpdateInterval = setInterval(autoUpdateCheck, 60000); 
}

document.addEventListener("visibilitychange", () => {
    if (document.hidden) clearInterval(autoUpdateInterval);
    else startAutoUpdate();
});
