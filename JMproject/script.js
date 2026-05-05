const WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbyXTMpnUJw4R9u-g-WV_0nBURdiW6-B9T2HwZCzuq0QDeJVGqV9ok6D7UfMXbXw3jM4LQ/exec';

async function loadData() {
    const listContainer = document.getElementById('list-container');
    listContainer.innerHTML = '<p class="text-center">กำลังโหลดข้อมูล...</p>';

    try {
        const response = await fetch(WEB_APP_URL);
        const data = await response.json();
        renderList(data);
    } catch (error) {
        listContainer.innerHTML = '<p class="text-red-400">เกิดข้อผิดพลาดในการดึงข้อมูล</p>';
    }
}

function renderList(items) {
    const listContainer = document.getElementById('list-container');
    listContainer.innerHTML = items.map(item => `
        <div class="flex items-center justify-between p-4 mb-2 bg-slate-800/40 rounded-xl border border-white/5">
            <div>
                <div class="text-sm font-bold">${item.name}</div>
                <div class="text-xs text-slate-400">${item.region}</div>
            </div>
            <label class="switch">
                <input type="checkbox" ${item.status === 'ออกแล้ว' ? 'checked' : ''} 
                       onchange="updateStatus('${item.name}', this.checked)">
                <span class="slider"></span>
            </label>
        </div>
    `).join('');
}

async function updateStatus(name, isDone) {
    const status = isDone ? 'ออกแล้ว' : 'ยังไม่ออก';
    
    // ส่งข้อมูลไปที่ GAS (doPost)
    fetch(WEB_APP_URL, {
        method: 'POST',
        body: JSON.stringify({ name: name, status: status })
    });
}

// โหลดข้อมูลเมื่อเปิดหน้าเว็บ
loadData();
