/**
 * JM Project - Military Ops Center
 * พี่ร็อบ (Robbygrean)
 */

const WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbyXTMpnUJw4R9u-g-WV_0nBURdiW6-B9T2HwZCzuq0QDeJVGqV9ok6D7UfMXbXw3jM4LQ/exec';

let allData = [];
let previousDataState = {};
let activeStatusFilter = 'all';

// ── Donut Chart ──────────────────────────────────────────────────────────────
const summaryCtx = document.getElementById('summaryChart').getContext('2d');
const summaryChart = new Chart(summaryCtx, {
    type: 'doughnut',
    data: {
        labels: ['ออกแล้ว', 'ค้างจ่าย', 'ไม่มีข้อมูล'],
        datasets: [{
            data: [0, 0, 1],
            backgroundColor: ['#39ff14', '#ff3131', '#1e293b'],
            borderWidth: 0,
            hoverOffset: 4
        }]
    },
    options: {
        cutout: '72%',
        plugins: { legend: { display: false }, tooltip: { enabled: false } },
        animation: { duration: 800 }
    }
});

// ── Init ─────────────────────────────────────────────────────────────────────
window.onload = async () => {
    await fetchData();
    updateMonthHeader();
};

function updateMonthHeader() {
    const months = ["มกราคม","กุมภาพันธ์","มีนาคม","เมษายน","พฤษภาคม","มิถุนายน","กรกฎาคม","สิงหาคม","กันยายน","ตุลาคม","พฤศจิกายน","ธันวาคม"];
    const d = new Date();
    d.setMonth(d.getMonth() - 1);
    const el = document.getElementById('currentMonthDisplay');
    if (el) el.innerText = `${months[d.getMonth()]} ${d.getFullYear() + 543}`;
}

// ── Fetch ────────────────────────────────────────────────────────────────────
async function fetchData() {
    try {
        const response = await fetch(WEB_APP_URL);
        const result = await response.json();

        allData = result.items;
        const initialLogs = result.logs;

        const feedContainer = document.getElementById('statusFeed');
        if (feedContainer) {
            feedContainer.innerHTML = '';
            if (initialLogs && initialLogs.length > 0) {
                initialLogs.forEach(log => pushToFeed(log.name, log.status, log.time));
            } else {
                feedContainer.innerHTML = '<p class="text-slate-500 italic text-center py-4 text-sm">ยังไม่มีการเคลื่อนไหว</p>';
            }
        }

        allData.forEach(item => { previousDataState[item.name] = item.status; });

        document.getElementById('loading').classList.add('hidden');
        filterData();
        startAutoUpdate();
    } catch (error) {
        console.error("Fetch Error:", error);
    }
}

// ── Summary Update ────────────────────────────────────────────────────────────
function updateSummary(data) {
    const total   = data.length;
    const success = data.filter(d => d.status === 'ออกแล้ว').length;
    const pending = data.filter(d => d.status === 'ค้างจ่าย').length;
    const nodata  = data.filter(d => d.status === 'ยังไม่มีข้อมูล').length;
    const pct     = total > 0 ? Math.round((success / total) * 100) : 0;

    // Stat cards
    animateCounter('sum-success', success);
    animateCounter('sum-pending', pending);
    animateCounter('sum-nodata',  nodata);

    const fmt = n => total > 0 ? `${Math.round((n/total)*100)}% OF ${total}` : '—';
    const el = (id, val) => { const e = document.getElementById(id); if (e) e.innerText = val; };
    el('sum-success-pct', fmt(success));
    el('sum-pending-pct', fmt(pending));
    el('sum-nodata-pct',  fmt(nodata));

    // Donut
    summaryChart.data.datasets[0].data = [success, pending, Math.max(nodata, 0.01)];
    summaryChart.update();
    el('donut-pct', `${pct}%`);

    // HUD bar (always based on allData, not filtered)
    const allSuccess = allData.filter(d => d.status === 'ออกแล้ว').length;
    const allTotal   = allData.length;
    const allPct     = allTotal > 0 ? Math.round((allSuccess / allTotal) * 100) : 0;
    el('hud-count-text', `${allSuccess} / ${allTotal}`);
    el('hud-percent', `${allPct}%`);
    const fill = document.getElementById('hud-progress-fill');
    if (fill) fill.style.width = `${allPct}%`;
}

function animateCounter(id, target) {
    const el = document.getElementById(id);
    if (!el) return;
    const start = parseInt(el.innerText) || 0;
    const diff  = target - start;
    const steps = 20;
    let step = 0;
    const timer = setInterval(() => {
        step++;
        el.innerText = Math.round(start + (diff * step / steps));
        if (step >= steps) { el.innerText = target; clearInterval(timer); }
    }, 20);
}

// ── Filter ───────────────────────────────────────────────────────────────────
function setStatusFilter(btn) {
    activeStatusFilter = btn.dataset.status;
    document.querySelectorAll('.status-pill').forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    filterData();
}

function filterData() {
    const searchInput   = document.getElementById('searchInput');
    const regionFilterEl = document.getElementById('regionFilter');
    if (!searchInput || !regionFilterEl) return;

    const searchTerm     = searchInput.value.toLowerCase().trim();
    const selectedRegion = regionFilterEl.value;

    const regionMap = {
        'อีสาน': 'ตะวันออกเฉียงเหนือ',
        'ภาคอีสาน': 'ตะวันออกเฉียงเหนือ'
    };
    const mappedRegion = regionMap[selectedRegion] || selectedRegion;
    const mappedSearch = regionMap[searchTerm] || searchTerm;

    const filtered = allData.filter(item => {
        const regionText = item.region ? String(item.region).toLowerCase() : '';
        const nameText   = item.name   ? String(item.name).toLowerCase()   : '';

        const matchesSearch = nameText.includes(searchTerm) ||
                              regionText.includes(searchTerm) ||
                              regionText.includes(mappedSearch);

        const matchesRegion = selectedRegion === '' || item.region === mappedRegion;

        const matchesStatus = activeStatusFilter === 'all' || item.status === activeStatusFilter;

        return matchesSearch && matchesRegion && matchesStatus;
    });

    renderList(filtered);
    updateSummary(filtered);

    const countEl = document.getElementById('result-count');
    if (countEl) countEl.innerText = `SHOWING ${filtered.length} DISTRICTS`;
}

// ── Render ───────────────────────────────────────────────────────────────────
function renderList(data) {
    const container = document.getElementById('itemList');
    if (!container) return;
    container.innerHTML = '';

    data.forEach(item => {
        const { name, status, region, type, url } = item;

        let sliderValue = (status === 'ออกแล้ว') ? 2 : (status === 'ยังไม่ออก' || status === 'ค้างจ่าย') ? 1 : 0;
        const isPending  = (status === 'ค้างจ่าย');

        let statusColor = isPending ? 'text-rose-400' : sliderValue === 2 ? 'text-emerald-400' : 'text-slate-500';
        let nameColor   = isPending ? 'text-rose-400' : sliderValue === 2 ? 'text-emerald-400' : 'text-slate-200';
        let pendingClass = isPending ? 'is-pending' : '';

        const card = document.createElement('div');
        card.className = `item-card p-6 rounded-2xl flex justify-between items-center ${pendingClass}`;
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
            </div>`;
        container.appendChild(card);
    });
}

// ── Slider Change ────────────────────────────────────────────────────────────
async function handleSliderChange(slider, name, currentStatus, url) {
    const val = parseInt(slider.value);
    let nextStatus = val === 0 ? 'ยังไม่มีข้อมูล' : val === 1 ? 'ค้างจ่าย' : 'ออกแล้ว';
    let emoji = val === 0 ? '⚪' : val === 1 ? '🔴' : '✅';

    if (nextStatus === currentStatus) return;

    if (!confirm(`ยืนยันเปลี่ยนสถานะของ "${name}" เป็น [ ${emoji} ${nextStatus} ] ใช่ไหมครับพี่?`)) {
        filterData();
        return;
    }

    const idx = allData.findIndex(i => i.name === name);
    if (idx !== -1) {
        allData[idx].status = nextStatus;
        previousDataState[name] = nextStatus;
        filterData();
        if (nextStatus === 'ค้างจ่าย') showPreview(name, url);
        else hidePreview();
        pushToFeed(name, nextStatus);
    }

    try {
        await fetch(WEB_APP_URL, {
            method: 'POST',
            mode: 'no-cors',
            body: JSON.stringify({ name, status: nextStatus })
        });
    } catch (e) {
        console.error("Save Error:", e);
        alert('❌ บันทึกไม่สำเร็จ!');
        fetchData();
    }
}

// ── Live Feed ─────────────────────────────────────────────────────────────────
function pushToFeed(name, status, time = null) {
    const feedContainer = document.getElementById('statusFeed');
    if (!feedContainer) return;

    let timeStr = '';
    if (time) {
        timeStr = time;
    } else {
        const now = new Date();
        const datePart = now.toLocaleDateString('th-TH', { day: '2-digit', month: '2-digit' });
        const timePart = now.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' });
        timeStr = `${datePart} | ${timePart}`;
    }

    const isSuccess = status === 'ออกแล้ว';
    const colorClass = isSuccess ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-rose-500/30 bg-rose-500/5';
    const textClass  = isSuccess ? 'text-emerald-400' : 'text-rose-400';

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

// ── Auto Update ───────────────────────────────────────────────────────────────
async function autoUpdateCheck() {
    try {
        const response = await fetch(WEB_APP_URL);
        const result   = await response.json();
        const newData  = result.items;

        newData.forEach(item => {
            if (previousDataState[item.name] !== undefined &&
                previousDataState[item.name] !== item.status) {
                pushToFeed(item.name, item.status);
                previousDataState[item.name] = item.status;
            }
        });

        allData = newData;
    } catch (e) { console.log("Silent update error"); }
}

let autoUpdateInterval;
function startAutoUpdate() {
    if (autoUpdateInterval) clearInterval(autoUpdateInterval);
    autoUpdateInterval = setInterval(autoUpdateCheck, 40000);
}

// ── Preview Card ──────────────────────────────────────────────────────────────
function showPreview(name, url) {
    const card = document.getElementById('previewCard');
    if (!card) return;
    document.getElementById('prevName').innerText = name;
    document.getElementById('prevLink').href = url || '#';
    const imgEl = document.getElementById('prevImg');
    if (imgEl) imgEl.src = 'OBECs.png';
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

// ── Export Excel ──────────────────────────────────────────────────────────────
function exportExcel() {
    const regionFilter   = document.getElementById('regionFilter').value;
    const searchTerm     = document.getElementById('searchInput').value.toLowerCase().trim();
    const regionMap      = { 'อีสาน': 'ตะวันออกเฉียงเหนือ', 'ภาคอีสาน': 'ตะวันออกเฉียงเหนือ' };
    const mappedRegion   = regionMap[regionFilter] || regionFilter;
    const mappedSearch   = regionMap[searchTerm]   || searchTerm;

    const exportData = allData.filter(item => {
        const regionText = item.region ? String(item.region).toLowerCase() : '';
        const nameText   = item.name   ? String(item.name).toLowerCase()   : '';
        const matchesSearch = nameText.includes(searchTerm) || regionText.includes(searchTerm) || regionText.includes(mappedSearch);
        const matchesRegion = regionFilter === '' || item.region === mappedRegion;
        const matchesStatus = activeStatusFilter === 'all' || item.status === activeStatusFilter;
        return matchesSearch && matchesRegion && matchesStatus;
    });

    if (exportData.length === 0) {
        alert('ไม่มีข้อมูลสำหรับ export ครับ');
        return;
    }

    const months = ["มกราคม","กุมภาพันธ์","มีนาคม","เมษายน","พฤษภาคม","มิถุนายน","กรกฎาคม","สิงหาคม","กันยายน","ตุลาคม","พฤศจิกายน","ธันวาคม"];
    const d = new Date();
    d.setMonth(d.getMonth() - 1);
    const monthName = `${months[d.getMonth()]} ${d.getFullYear() + 543}`;

    const rows = exportData.map((item, i) => ({
        'ลำดับ':        i + 1,
        'เขตพื้นที่':   item.name   || '',
        'ภาค':          item.region || '',
        'ประเภท':       item.type   || '',
        'สถานะ':        item.status || '',
        'URL':          item.url    || ''
    }));

    const ws = XLSX.utils.json_to_sheet(rows);

    // ปรับความกว้างคอลัมน์
    ws['!cols'] = [
        { wch: 6 }, { wch: 40 }, { wch: 20 }, { wch: 20 }, { wch: 20 }, { wch: 50 }
    ];

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, `สถานะ ${monthName}`);

    const filename = `JM_Report_${monthName.replace(' ', '_')}.xlsx`;
    XLSX.writeFile(wb, filename);
}

// ── Print Report ──────────────────────────────────────────────────────────────
function openPrintMenu() {
    const modal = document.getElementById('printModal');
    if (modal) modal.classList.remove('hidden');
}

function closePrintMenu() {
    const modal = document.getElementById('printModal');
    if (modal) modal.classList.add('hidden');
}

function generateReport(mode) {
    closePrintMenu();

    const months = ["มกราคม","กุมภาพันธ์","มีนาคม","เมษายน","พฤษภาคม","มิถุนายน","กรกฎาคม","สิงหาคม","กันยายน","ตุลาคม","พฤศจิกายน","ธันวาคม"];
    const d = new Date();
    d.setMonth(d.getMonth() - 1);
    const targetMonth    = `${months[d.getMonth()]} ${d.getFullYear() + 543}`;
    const regionFilter   = document.getElementById('regionFilter').value;
    const baseFiltered   = allData.filter(item => regionFilter === '' || item.region === regionFilter);

    let reportTitle = '';
    let contentHTML = '';
    let totalCount  = 0;
    let colorTheme  = mode === 'success' ? '#059669' : '#e11d48';

    const renderRows = (data) => data.map((i, idx) => `
        <tr>
            <td style="border:1px solid #000;padding:8px;text-align:center;">${idx + 1}</td>
            <td style="border:1px solid #000;padding:8px;">${i.name || '-'}</td>
            <td style="border:1px solid #000;padding:8px;text-align:center;${i.status === 'ค้างจ่าย' ? 'color:red;font-weight:bold;' : ''}">${i.status}</td>
        </tr>`).join('');

    if (mode === 'success') {
        reportTitle = 'รายงานสรุปเขตพื้นที่ที่ดำเนินการเรียบร้อยแล้ว';
        const successData = baseFiltered.filter(i => i.status === 'ออกแล้ว').sort((a, b) => a.name.localeCompare(b.name, 'th'));
        totalCount = successData.length;
        if (totalCount === 0) return alert('ไม่มีรายการที่ออกแล้วครับ');
        contentHTML = `<h3 style="color:#059669;">✅ รายการที่ดำเนินการแล้ว (${totalCount} เขต)</h3>
            <table style="width:100%;border-collapse:collapse;">
                <thead><tr style="background:#f1f5f9;">
                    <th style="border:1px solid #000;padding:10px;width:60px;">ลำดับ</th>
                    <th style="border:1px solid #000;padding:10px;text-align:left;">ชื่อเขตพื้นที่</th>
                    <th style="border:1px solid #000;padding:10px;width:150px;">สถานะ</th>
                </tr></thead>
                <tbody>${renderRows(successData)}</tbody>
            </table>`;
    } else {
        reportTitle = 'รายงานสรุปเขตพื้นที่ที่ยังไม่ดำเนินการ';
        const overDue = baseFiltered.filter(i => i.status === 'ค้างจ่าย' || i.status === 'ยังไม่ออก').sort((a, b) => a.name.localeCompare(b.name, 'th'));
        const noData  = baseFiltered.filter(i => i.status === 'ยังไม่มีข้อมูล').sort((a, b) => a.name.localeCompare(b.name, 'th'));
        totalCount = overDue.length + noData.length;
        if (totalCount === 0) return alert('ไม่มีรายการค้างดำเนินการครับ');
        contentHTML = `
            ${overDue.length > 0 ? `<h3 style="color:#e11d48;">⚠️ รายการค้างจ่าย (${overDue.length} เขต)</h3>
            <table style="width:100%;border-collapse:collapse;margin-bottom:20px;">
                <thead><tr style="background:#f1f5f9;">
                    <th style="border:1px solid #000;padding:10px;width:60px;">ลำดับ</th>
                    <th style="border:1px solid #000;padding:10px;text-align:left;">ชื่อเขตพื้นที่</th>
                    <th style="border:1px solid #000;padding:10px;width:150px;">สถานะ</th>
                </tr></thead>
                <tbody>${renderRows(overDue)}</tbody>
            </table>` : ''}
            ${noData.length > 0 ? `<h3 style="color:#475569;">⚪ รายการยังไม่มีข้อมูล (${noData.length} เขต)</h3>
            <table style="width:100%;border-collapse:collapse;">
                <thead><tr style="background:#f1f5f9;">
                    <th style="border:1px solid #000;padding:10px;width:60px;">ลำดับ</th>
                    <th style="border:1px solid #000;padding:10px;text-align:left;">ชื่อเขตพื้นที่</th>
                    <th style="border:1px solid #000;padding:10px;width:150px;">สถานะ</th>
                </tr></thead>
                <tbody>${renderRows(noData)}</tbody>
            </table>` : ''}`;
    }

    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <html><head><title>Report</title>
        <link href="https://fonts.googleapis.com/css2?family=Kanit&display=swap" rel="stylesheet">
        <style>body{font-family:'Kanit',sans-serif;padding:40px;}.header{text-align:center;border-bottom:2px solid #000;padding-bottom:10px;margin-bottom:20px;}</style>
        </head><body>
        <div class="header">
            <h1 style="color:${colorTheme};">${reportTitle}</h1>
            <p>เดือน : ${targetMonth}</p>
            <p style="font-size:12px;">พิมพ์เมื่อ: ${new Date().toLocaleString('th-TH')} น.</p>
        </div>
        ${contentHTML}
        <div style="text-align:right;font-weight:bold;margin-top:20px;">รวมทั้งสิ้น: ${totalCount} เขต</div>
        </body></html>`);
    printWindow.document.close();
    setTimeout(() => { printWindow.focus(); printWindow.print(); printWindow.close(); }, 500);
}
