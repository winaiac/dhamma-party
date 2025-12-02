// 🔴🔴🔴 CONFIGURATION 🔴🔴🔴
const SUPABASE_URL = 'https://bhfytplqshiviuqwkvbm.supabase.co';
const SUPABASE_KEY = 'sb_publishable_vaRwFf5F6iAc7T_iFjlhAQ_xGk_dxRR';

const { createClient } = supabase;
const sb = createClient(SUPABASE_URL, SUPABASE_KEY);
let currentSession = null;
let isRegisterMode = false;
let isEditMode = false;
let cachedData = [];
let filteredData = [];
let sortConfig = { key: 'created_at', direction: -1 };
const OLD_DATA_TAG = '(สมาชิกรายเดิม)';
const STATUS_APPROVED_TAG = '{{STATUS:APPROVED}}';
let isRecoveryMode = false;
let activeFilter = 'all';

// Map Variables
let map = null;
let markers = [];
let isMapView = false;

// Form Map Variables
let formMap = null;
let formMarker = null;

// 🟢 EXECUTIVE DATA
const executiveData = [
    { id: 1, name: "นาย บุณยติเลิศ สาระ", pos: "หัวหน้าพรรค", date: "6 เมษายน 2568" },
    { id: 2, name: "นาย สุริยา โคตรภูธร", pos: "เลขาธิการพรรค", date: "6 เมษายน 2568" },
    { id: 3, name: "นางสาว ธยาพา เนขขัมม์", pos: "เหรัญญิกพรรค", date: "6 เมษายน 2568" },
    { id: 4, name: "นาง จิราภรณ์ สารตันติพงศ์", pos: "นายทะเบียนสมาชิกพรรค", date: "6 เมษายน 2568" },
    { id: 5, name: "นาย ฐิติเมธินทร์ หลุ่นประพันธ์", pos: "กรรมการบริหารพรรค", date: "6 เมษายน 2568" },
    { id: 6, name: "นาย อภิเกียรติ ประสงค์", pos: "กรรมการบริหารพรรค", date: "6 เมษายน 2568" }
];

// 🟢 PROVINCE COORDINATES
const provinceLatLong = {
    "กรุงเทพมหานคร": [13.7563, 100.5018], "กระบี่": [8.0863, 98.9063], "กาญจนบุรี": [14.0205, 99.5292], "กาฬสินธุ์": [16.4322, 103.5061],
    "กำแพงเพชร": [16.4828, 99.5227], "ขอนแก่น": [16.4322, 102.8236], "จันทบุรี": [12.6114, 102.1039], "ฉะเชิงเทรา": [13.6904, 101.0726],
    "ชลบุรี": [13.3611, 100.9847], "ชัยนาท": [15.1935, 100.1250], "ชัยภูมิ": [15.8105, 102.0289], "ชุมพร": [10.4930, 99.1800],
    "เชียงราย": [19.9105, 99.8406], "เชียงใหม่": [18.7883, 98.9853], "ตรัง": [7.5645, 99.6232], "ตราด": [12.2339, 102.5117],
    "ตาก": [16.8837, 99.1170], "นครนายก": [14.2069, 101.2130], "นครปฐม": [13.8188, 100.0373], "นครพนม": [17.3996, 104.7936],
    "นครราชสีมา": [14.9751, 102.0987], "นครศรีธรรมราช": [8.4309, 99.9631], "นครสวรรค์": [15.7042, 100.1372], "นนทบุรี": [13.8591, 100.5217],
    "นราธิวาส": [6.4255, 101.8253], "น่าน": [18.7838, 100.7813], "บึงกาฬ": [18.3610, 103.6465], "บุรีรัมย์": [14.9930, 103.1029],
    "ปทุมธานี": [14.0208, 100.5250], "ประจวบคีรีขันธ์": [11.8124, 99.7950], "ปราจีนบุรี": [14.0509, 101.3716], "ปัตตานี": [6.8696, 101.2501],
    "พระนครศรีอยุธยา": [14.3532, 100.5684], "พะเยา": [19.1963, 99.9022], "พังงา": [8.4503, 98.5255], "พัทลุง": [7.6167, 100.0740],
    "พิจิตร": [16.4429, 100.3493], "พิษณุโลก": [16.8211, 100.2659], "เพชรบุรี": [13.1129, 99.9412], "เพชรบูรณ์": [16.4190, 101.1567],
    "แพร่": [18.1446, 100.1403], "ภูเก็ต": [7.8804, 98.3923], "มหาสารคาม": [16.1863, 103.3015], "มุกดาหาร": [16.5436, 104.7176],
    "แม่ฮ่องสอน": [19.3020, 97.9654], "ยโสธร": [15.7924, 104.1451], "ยะลา": [6.5413, 101.2803], "ร้อยเอ็ด": [16.0538, 103.6520],
    "ระนอง": [9.9658, 98.6348], "ระยอง": [12.6828, 101.2816], "ราชบุรี": [13.5283, 99.8135], "ลพบุรี": [14.7995, 100.6534],
    "ลำปาง": [18.2883, 99.4928], "ลำพูน": [18.5748, 99.0087], "เลย": [17.4860, 101.7223], "ศรีสะเกษ": [15.1186, 104.3227],
    "สกลนคร": [17.1546, 104.1349], "สงขลา": [7.1988, 100.5951], "สตูล": [6.6238, 100.0674], "สมุทรปราการ": [13.5991, 100.5967],
    "สมุทรสงคราม": [13.4098, 99.9977], "สมุทรสาคร": [13.5475, 100.2744], "สระแก้ว": [13.8240, 102.0646], "สระบุรี": [14.5289, 100.9101],
    "สิงห์บุรี": [14.8906, 100.3967], "สุโขทัย": [17.0094, 99.8264], "สุพรรณบุรี": [14.4745, 100.1177], "สุราษฎร์ธานี": [9.1418, 99.3303],
    "สุรินทร์": [14.8818, 103.4936], "หนองคาย": [17.8785, 102.7413], "หนองบัวลำภู": [17.2026, 102.4413], "อ่างทอง": [14.5896, 100.4551],
    "อำนาจเจริญ": [15.8657, 104.6258], "อุดรธานี": [17.4138, 102.7872], "อุตรดิตถ์": [17.6201, 100.0993], "อุทัยธานี": [15.3835, 100.0247],
    "อุบลราชธานี": [15.2448, 104.8473]
};

const ADMIN_ROLES = {
    'winayo@gmail.com': 'ALL',
    'pramahaweera@gmail.com': 'ALL',
    'admin_central@test.com': 'ALL',
    'admin_korat@test.com': 'นครราชสีมา',
    'winai0615322117@gmail.com': 'ร้อยเอ็ด'
};

const PROVINCES = Object.keys(provinceLatLong).sort();

// --- HELPER FUNCTIONS ---

function getRegion(province) {
    const regions = {
        "ภาคเหนือ": ["เชียงราย", "เชียงใหม่", "น่าน", "พะเยา", "แพร่", "แม่ฮ่องสอน", "ลำปาง", "ลำพูน", "อุตรดิตถ์", "พิษณุโลก", "สุโขทัย", "เพชรบูรณ์", "พิจิตร", "กำแพงเพชร", "นครสวรรค์", "อุทัยธานี"],
        "ภาคตะวันออกเฉียงเหนือ": ["กาฬสินธุ์", "ขอนแก่น", "ชัยภูมิ", "นครพนม", "นครราชสีมา", "บึงกาฬ", "บุรีรัมย์", "มหาสารคาม", "มุกดาหาร", "ยโสธร", "ร้อยเอ็ด", "เลย", "สกลนคร", "สุรินทร์", "ศรีสะเกษ", "หนองคาย", "หนองบัวลำภู", "อุดรธานี", "อุบลราชธานี", "อำนาจเจริญ"],
        "ภาคกลาง": ["กรุงเทพมหานคร", "ชัยนาท", "นครนายก", "นครปฐม", "นนทบุรี", "ปทุมธานี", "พระนครศรีอยุธยา", "ลพบุรี", "สมุทรปราการ", "สมุทรสงคราม", "สมุทรสาคร", "สระบุรี", "สิงห์บุรี", "สุพรรณบุรี", "อ่างทอง"],
        "ภาคตะวันออก": ["จันทบุรี", "ฉะเชิงเทรา", "ชลบุรี", "ตราด", "ปราจีนบุรี", "ระยอง", "สระแก้ว"],
        "ภาคตะวันตก": ["กาญจนบุรี", "ตาก", "ประจวบคีรีขันธ์", "เพชรบุรี", "ราชบุรี"],
        "ภาคใต้": ["กระบี่", "ชุมพร", "ตรัง", "นครศรีธรรมราช", "นราธิวาส", "ปัตตานี", "พังงา", "พัทลุง", "ภูเก็ต", "ระนอง", "สตูล", "สงขลา", "สุราษฎร์ธานี", "ยะลา"]
    };
    for (let r in regions) { if (regions[r].includes(province)) return r; }
    return "ไม่ระบุ";
}

function mapToMainRegion(region) {
    if (["ภาคเหนือ"].includes(region)) return "ภาคเหนือ";
    if (["ภาคตะวันออกเฉียงเหนือ"].includes(region)) return "ภาคตะวันออกเฉียงเหนือ";
    if (["ภาคใต้"].includes(region)) return "ภาคใต้";
    return "ภาคกลาง/อื่นๆ";
}

window.autoFillRegion = function() {
    const prov = document.getElementById('inp-prov').value;
    const region = getRegion(prov);
    document.getElementById('inp-region').value = region;
    
    if (formMap && prov && provinceLatLong[prov]) {
        const coords = provinceLatLong[prov];
        formMap.setView(coords, 12);
        if (formMarker) {
            formMarker.setLatLng(coords);
            document.getElementById('inp-lat').value = coords[0];
            document.getElementById('inp-lng').value = coords[1];
        }
    }
};

function checkThaiID(id) {
    if (id.length != 13) return false;
    for (i = 0, sum = 0; i < 12; i++) sum += parseFloat(id.charAt(i)) * (13 - i);
    if ((11 - sum % 11) % 10 != parseFloat(id.charAt(12))) return false;
    return true;
}

function validatePhone(phone) { const phoneRegex = /^0\d{9}$/; return phoneRegex.test(phone); }

function getAdminProvince(email) {
    if (ADMIN_ROLES[email]) return ADMIN_ROLES[email];
    if (cachedData.length > 0) {
        const userRecord = cachedData.find(m => m.email === email && m.type !== 'feedback');
        if (userRecord) {
            if (userRecord.admin_role) return userRecord.admin_role;
            const match = (userRecord.remarks || '').match(/{{ROLE:(.*?)}}/);
            if (match) return match[1];
        }
    }
    return null;
}

function formatLabel(str) {
    if (str.length <= 16) return str;
    const words = str.split(' ');
    const lines = [];
    let currentLine = words[0];
    for (let i = 1; i < words.length; i++) {
        if (currentLine.length + 1 + words[i].length <= 16) { currentLine += ' ' + words[i]; }
        else { lines.push(currentLine); currentLine = words[i]; }
    }
    lines.push(currentLine);
    return lines;
}

const commonOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        tooltip: {
            callbacks: {
                title: function (tooltipItems) {
                    const item = tooltipItems[0];
                    let label = item.chart.data.labels[item.dataIndex];
                    if (Array.isArray(label)) return label.join(' ');
                    return label;
                }
            }
        },
        legend: { labels: { font: { family: 'Sarabun', size: 14 } } }
    },
    layout: { padding: 10 }
};

// --- INITIALIZATION ---
window.addEventListener('DOMContentLoaded', () => {
    const provSelect = document.getElementById('inp-prov');
    if(provSelect) {
        PROVINCES.sort().forEach(p => {
            provSelect.innerHTML += `<option value="${p}">${p}</option>`;
        });
    }

    // Check for password recovery or errors in URL
    if (window.location.hash) {
        if (window.location.hash.includes('error=access_denied') && window.location.hash.includes('error_code=otp_expired')) {
            alert("ลิงก์รีเซ็ตรหัสผ่านหมดอายุแล้ว กรุณากด 'ลืมรหัสผ่าน' เพื่อขอลิงก์ใหม่");
            window.location.hash = '';
            window.switchView('auth');
        }
        else if (window.location.hash.includes('type=recovery')) {
            isRecoveryMode = true;
            window.switchView('reset');
        }
    }

    if(document.getElementById('ideologyChart')) {
        initCharts();
    }

    sb.auth.getSession().then(({ data: { session } }) => {
        currentSession = session;
        updateNavState();
        if(session) {
            renderExecutives();
            initPartyInfo();
            fetchData();
        }
    });

    sb.auth.onAuthStateChange((_event, session) => {
        currentSession = session;
        updateNavState();
        if(session) {
            renderExecutives();
            initPartyInfo();
            fetchData();
        }
    });
});

function initCharts() {
    const ctxIdeology = document.getElementById('ideologyChart').getContext('2d');
    new Chart(ctxIdeology, {
        type: 'radar',
        data: {
            labels: ['ปกป้องพุทธศาสนา', 'ประชาธิปไตย', 'ช่วยเหลือเกษตรกร', 'ปฏิรูปกฎหมาย', 'การศึกษาทันสมัย'].map(formatLabel),
            datasets: [{
                label: 'ระดับความเข้มข้นนโยบาย',
                data: [10, 8, 9, 7, 6],
                fill: true,
                backgroundColor: 'rgba(255, 109, 0, 0.2)',
                borderColor: '#FF6D00',
                pointBackgroundColor: '#FF6D00',
                pointBorderColor: '#fff'
            }]
        },
        options: {
            ...commonOptions,
            scales: { r: { ticks: { display: false }, suggestedMin: 0, suggestedMax: 10 } }
        }
    });
    
    if(document.getElementById('monkSalaryChart')) {
        const ctxMonk = document.getElementById('monkSalaryChart').getContext('2d');
        new Chart(ctxMonk, {
            type: 'bar',
            data: {
                labels: ['ปัจจุบัน (1 เท่า)', 'นโยบายใหม่ (2 เท่า)'].map(formatLabel),
                datasets: [{ label: 'อัตราเงินเดือน (เท่า)', data: [1, 2], backgroundColor: ['#B0BEC5', '#FF6D00'], borderRadius: 8 }]
            },
            options: { ...commonOptions, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } } }
        });
    }
    if(document.getElementById('socialSecurityChart')) {
        const ctxSocial = document.getElementById('socialSecurityChart').getContext('2d');
        new Chart(ctxSocial, {
            type: 'doughnut',
            data: {
                labels: ['อัตราปัจจุบัน (5%)', 'อัตราใหม่ (1%)'].map(formatLabel),
                datasets: [{ data: [5, 1], backgroundColor: ['#ECEFF1', '#00B0FF'], borderWidth: 2 }]
            },
            options: { ...commonOptions, cutout: '60%', plugins: { legend: { position: 'bottom' } } }
        });
    }
    if(document.getElementById('membershipChart')) {
        const ctxMember = document.getElementById('membershipChart').getContext('2d');
        new Chart(ctxMember, {
            type: 'bar',
            data: {
                labels: ['รายปี (20บ.)', 'ตลอดชีพ (200บ.)'].map(formatLabel),
                datasets: [{ label: 'ค่าบำรุงพรรค (บาท)', data: [20, 200], backgroundColor: ['#FFCC80', '#EF6C00'], borderRadius: 6 }]
            },
            options: { ...commonOptions, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true } } }
        });
    }
}

// 🟢 GLOBAL FUNCTIONS (Attached to window for HTML access)

// 🟢 MAP FUNCTIONS
window.toggleMapView = function() {
    isMapView = !isMapView;
    const tableDiv = document.getElementById('dashboard-table-view');
    const mapDiv = document.getElementById('dashboard-map-view');
    const btnText = document.getElementById('btn-map-text');

    if (isMapView) {
        tableDiv.classList.add('hidden');
        mapDiv.classList.remove('hidden');
        btnText.innerText = "ดูแบบตาราง";
        if (!map) initMap();
        else {
            setTimeout(() => { map.invalidateSize(); }, 200); 
            updateMapMarkers(); 
        }
    } else {
        tableDiv.classList.remove('hidden');
        mapDiv.classList.add('hidden');
        btnText.innerText = "ดูบนแผนที่";
    }
};

function initMap() {
    map = L.map('map').setView([13.7563, 100.5018], 6);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    updateMapMarkers();
}

function updateMapMarkers() {
    if (!map) return;
    markers.forEach(m => map.removeLayer(m));
    markers = [];
    const provinceCounts = {};
    cachedData.forEach(m => {
        if (activeFilter !== 'all' && m.type !== activeFilter) return;
        if (m.lat && m.lng && !isNaN(parseFloat(m.lat)) && !isNaN(parseFloat(m.lng))) {
            const lat = parseFloat(m.lat);
            const lng = parseFloat(m.lng);
            const marker = L.marker([lat, lng]).addTo(map);
            let popupContent = `
                <div class="text-center">
                    <h4 class="text-blue-600 font-bold">${m.name}</h4>
                    <p class="text-xs text-gray-600">${m.address || ''} ${m.tambon || ''} ${m.province || ''}</p>
                    <span class="bg-green-100 text-green-800 text-[10px] px-2 py-1 rounded mt-1 inline-block">พิกัดระบุเอง</span>
                </div>
            `;
            marker.bindPopup(popupContent);
            markers.push(marker);
        } 
        else if (m.province && provinceLatLong[m.province]) {
            if (!provinceCounts[m.province]) provinceCounts[m.province] = 0;
            provinceCounts[m.province]++;
        }
    });
    for (const [prov, count] of Object.entries(provinceCounts)) {
        const coords = provinceLatLong[prov];
        const marker = L.marker(coords, { opacity: 0.7 }).addTo(map);
        marker.bindPopup(`
            <div class="text-center">
                <h4>${prov} (รวม)</h4>
                <div class="text-xl font-bold text-orange-600 mb-1">${count} คน</div>
                <div class="text-xs text-gray-500">* พิกัดกลางจังหวัด (ไม่ได้ระบุพิกัดบ้าน)</div>
            </div>
        `);
        markers.push(marker);
    }
}

window.initFormMap = function(lat, lng) {
    const defaultLat = lat || 13.7563;
    const defaultLng = lng || 100.5018;
    const zoomLevel = lat ? 15 : 10;

    if (!formMap) {
        formMap = L.map('form-map').setView([defaultLat, defaultLng], zoomLevel);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: 'OpenStreetMap'
        }).addTo(formMap);

        formMarker = L.marker([defaultLat, defaultLng], { draggable: true }).addTo(formMap);
        
        formMarker.on('dragend', function(e) {
            const position = formMarker.getLatLng();
            document.getElementById('inp-lat').value = position.lat;
            document.getElementById('inp-lng').value = position.lng;
        });
        
        formMap.on('click', function(e) {
            formMarker.setLatLng(e.latlng);
            document.getElementById('inp-lat').value = e.latlng.lat;
            document.getElementById('inp-lng').value = e.latlng.lng;
        });

    } else {
        formMap.setView([defaultLat, defaultLng], zoomLevel);
        formMarker.setLatLng([defaultLat, defaultLng]);
    }
    
    setTimeout(() => { formMap.invalidateSize(); }, 300);
    
    if(lat && lng) {
        document.getElementById('inp-lat').value = lat;
        document.getElementById('inp-lng').value = lng;
    }
};

window.switchView = function(view) {
    ['landing', 'auth', 'dashboard', 'reset', 'member-center'].forEach(id => {
        const el = document.getElementById('view-' + id);
        if (el) el.classList.add('hidden');
    });
    const target = document.getElementById('view-' + view);
    if (target) target.classList.remove('hidden');
    window.scrollTo(0, 0);
    
    if (view === 'dashboard') {
        fetchData();
        renderExecutives();
        initPartyInfo();
    }
    if (view === 'member-center') {
        fetchData().then(() => {
            renderNews();
            renderKnowledge();
        });
        renderFeedbacks();
    }
};

window.handleLogout = async function() {
    try { await sb.auth.signOut(); } catch (err) { console.error(err); }
    window.switchView('landing'); currentSession = null;
    updateNavState();
};

// ✅✅✅ Updated handleAuth with Thai messages and Email instructions
window.handleAuth = async function(e) {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const pass = document.getElementById('password').value;
    try {
        if (isRegisterMode) {
            const { error } = await sb.auth.signUp({ email, password: pass });
            if (error) throw error;
            alert("ลงทะเบียนสำเร็จ!\n\nกรุณาตรวจสอบอีเมลของคุณ (รวมถึงใน Junk/Spam) และคลิกลิงก์ยืนยันตัวตนเพื่อเปิดใช้งานบัญชี ก่อนที่จะเข้าสู่ระบบครับ");
            window.switchAuthMode('login');
        } else {
            const { error } = await sb.auth.signInWithPassword({ email, password: pass });
            if (error) throw error;
        }
    } catch (err) {
        // Translate common errors
        let msg = err.message;
        if(msg.includes("Invalid login credentials")) msg = "อีเมลหรือรหัสผ่านไม่ถูกต้อง";
        else if(msg.includes("User already registered")) msg = "อีเมลนี้ถูกลงทะเบียนไว้แล้ว";
        alert("เกิดข้อผิดพลาด: " + msg);
    }
};

// ✅✅✅ Updated handleUpdatePassword with Thai messages
window.handleUpdatePassword = async function(e) {
    e.preventDefault();
    const newPassword = document.getElementById('new-password').value;
    if (newPassword.length < 6) return alert("รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร");
    try {
        const { data, error } = await sb.auth.updateUser({ password: newPassword });
        if (error) throw error;
        alert("เปลี่ยนรหัสผ่านสำเร็จเรียบร้อย!\nระบบจะพาคุณไปที่หน้าหลัก...");
        isRecoveryMode = false; window.location.hash = ''; window.switchView('dashboard');
    } catch (err) {
        let msg = err.message;
        if (msg.includes("New password should be different from the old password")) {
            msg = "รหัสผ่านใหม่ต้องต่างจากรหัสผ่านเดิม";
        }
        alert("เกิดข้อผิดพลาด: " + msg);
    }
};

// ✅✅✅ Updated handleForgotPassword with Thai messages and Email instructions
window.handleForgotPassword = async function() {
    const email = prompt("กรุณาระบุอีเมลที่ต้องการรีเซ็ตรหัสผ่าน:");
    if (email) {
        try {
            const { error } = await sb.auth.resetPasswordForEmail(email, { redirectTo: window.location.href });
            if (error) throw error;
            alert(`ระบบส่งลิงก์รีเซ็ตรหัสผ่านไปที่ ${email} เรียบร้อยแล้ว\n\nกรุณาเปิดอีเมลและคลิกลิงก์เพื่อตั้งรหัสผ่านใหม่ครับ`);
        } catch (err) { alert("ไม่สามารถส่งอีเมลได้: " + err.message); }
    }
};

window.switchAuthMode = function(mode) {
    isRegisterMode = mode === 'register';
    document.querySelector('#view-auth h2').innerText = isRegisterMode ? "ลงทะเบียนสมาชิกแอพ" : "ลงชื่อเข้าใช้งาน";
    document.querySelector('#view-auth button').innerText = isRegisterMode ? "ยืนยันการลงทะเบียน" : "เข้าสู่ระบบ";
};

window.togglePassword = function(inputId, icon) {
    const input = document.getElementById(inputId);
    if (input.type === "password") {
        input.type = "text"; icon.classList.remove("fa-eye"); icon.classList.add("fa-eye-slash");
    } else {
        input.type = "password"; icon.classList.remove("fa-eye-slash"); icon.classList.add("fa-eye");
    }
};

window.handlePublicAction = async function(type) {
    if (!currentSession) { alert("กรุณาลงชื่อเข้าใช้งานก่อน"); window.switchView('auth'); return; }
    const email = currentSession.user.email;
    const adminProv = getAdminProvince(email);
    if (adminProv) { window.openModal(type, null); return; }
    let existingData = null;
    if (cachedData.length > 0) {
        const found = cachedData.find(m => m.email === email && m.type !== 'feedback');
        if (found) existingData = found;
    } else { existingData = { email: email }; }
    window.openModal(type, existingData);
};

window.filterDashboard = function(type) {
    activeFilter = type;
    document.querySelectorAll('.filter-btn').forEach(btn => {
        if (btn.dataset.filter === type) { btn.classList.remove('bg-white', 'border', 'text-gray-600'); btn.classList.add('bg-gray-200', 'text-gray-700'); }
        else { btn.classList.add('bg-white', 'border', 'text-gray-600'); btn.classList.remove('bg-gray-200', 'text-gray-700'); }
    });
    window.handleSearch();
};

window.handleSearch = function() {
    const txt = document.getElementById('inp-search').value.toLowerCase();
    let baseData = cachedData;
    if (activeFilter !== 'all') baseData = cachedData.filter(m => m.type === activeFilter);
    if (!txt) filteredData = [...baseData];
    else {
        filteredData = baseData.filter(m =>
            (m.name || '').toLowerCase().includes(txt) || (m.member_id || '').toLowerCase().includes(txt) ||
            (m.id_card || '').includes(txt) || (m.phone || '').includes(txt) || (m.remarks || '').toLowerCase().includes(txt) ||
            (m.province || '').includes(txt)
        );
    }
    renderTable(filteredData);
};

window.sortTable = function(key) {
    if (sortConfig.key === key) sortConfig.direction *= -1;
    else { sortConfig.key = key; sortConfig.direction = 1; }
    filteredData.sort((a, b) => {
        let valA = a[key] || '';
        let valB = b[key] || '';
        return valA.toString().localeCompare(valB.toString()) * sortConfig.direction;
    });
    renderTable(filteredData);
    document.querySelectorAll('th i').forEach(i => i.className = 'fa-solid fa-sort ml-1');
    const activeTh = document.querySelector(`th[onclick="sortTable('${key}')"] i`);
    if (activeTh) activeTh.className = sortConfig.direction === 1 ? 'fa-solid fa-sort-up ml-1' : 'fa-solid fa-sort-down ml-1';
};

window.openModal = function(type, record = null) {
    if (type === 'edit' && record && typeof record === 'string') {
        const r = cachedData.find(d => d.id == record);
        if (r && r.type === 'feedback') { window.openFeedbackManageModal(r); return; }
    } else if (type === 'edit' && record && record.type === 'feedback') { window.openFeedbackManageModal(record); return; }

    if (typeof record === 'string') { record = cachedData.find(r => r.id == record); }

    const modal = document.getElementById('modal-form');
    const form = document.getElementById('memberForm');
    form.reset();
    document.getElementById('record-id').value = '';
    
    document.getElementById('modal-title').innerText = type === 'candidate' ? 'เพิ่มผู้สมัคร ส.ส.' : 'ลงทะเบียนสมาชิก';
    document.getElementById('inp-type').value = type;

    document.getElementById('id-error').classList.add('hidden');
    document.getElementById('phone-error').classList.add('hidden');
    document.getElementById('admin-tools').classList.add('hidden');

    const adminProv = currentSession && getAdminProvince(currentSession.user.email);
    if (adminProv) {
        document.getElementById('admin-tools').classList.remove('hidden');
        const roleSetting = document.getElementById('admin-role-setting');
        if (adminProv === 'ALL') roleSetting.classList.remove('hidden'); else roleSetting.classList.add('hidden');
    }

    let mapLat = null, mapLng = null;

    if (record) {
        document.getElementById('record-id').value = record.id;
        document.getElementById('inp-member-id').value = record.member_id || '';
        document.getElementById('inp-name').value = record.name || '';
        document.getElementById('inp-dob').value = record.dob || '';
        document.getElementById('inp-id').value = record.id_card || '';
        document.getElementById('inp-email').value = record.email || '';
        document.getElementById('inp-phone').value = record.phone || '';
        document.getElementById('inp-line').value = record.line_id || '';
        
        document.getElementById('inp-house-no').value = record.address || ''; 
        document.getElementById('inp-village').value = record.village || '';
        document.getElementById('inp-road').value = record.road || '';
        document.getElementById('inp-tambon').value = record.tambon || '';
        document.getElementById('inp-district').value = record.district || '';
        document.getElementById('inp-prov').value = record.province || '';
        document.getElementById('inp-zip').value = record.zip || '';
        document.getElementById('inp-region').value = record.region || getRegion(record.province || '');

        if (record.lat && record.lng) {
            mapLat = parseFloat(record.lat);
            mapLng = parseFloat(record.lng);
        } else if (record.province && provinceLatLong[record.province]) {
            mapLat = provinceLatLong[record.province][0];
            mapLng = provinceLatLong[record.province][1];
        }

        document.getElementById('inp-recommender').value = record.recommender_name || '';
        document.getElementById('inp-start-date').value = record.start_date || '';
        document.getElementById('inp-pdpa').checked = false; 

        let remarks = record.remarks || '';
        let adminRole = record.admin_role || '';
        const roleMatch = remarks.match(/{{ROLE:(.*?)}}/);
        if (roleMatch) adminRole = roleMatch[1];
        document.getElementById('inp-admin-role').value = adminRole;

        if (remarks.includes(OLD_DATA_TAG)) { document.getElementById('inp-is-old').checked = true; remarks = remarks.replace(OLD_DATA_TAG, ''); }
        else { document.getElementById('inp-is-old').checked = false; }

        remarks = remarks.replace(/{{MID:(.*?)}}/g, '').replace(/{{ROLE:(.*?)}}/g, '')
            .replace(STATUS_APPROVED_TAG, '').replace('{{STATUS:RESOLVED}}', '')
            .replace(/{{START_DATE:(.*?)}}/g, '').replace(/{{INTERACT:({.*?})}}/s, '')
            .replace(/{{DOC1:(.*?)}}/g, '').replace(/{{PDF:(.*?)}}/g, '').replace(/{{DOC2:(.*?)}}/g, '').trim();
        document.getElementById('inp-remarks').value = remarks;

    } else {
        if(!adminProv) document.getElementById('inp-email').value = currentSession.user.email;
    }
    
    const provSelect = document.getElementById('inp-prov');
    provSelect.disabled = false;
    if (adminProv && adminProv !== 'ALL') { provSelect.value = adminProv; provSelect.disabled = true; window.autoFillRegion(); }

    modal.classList.remove('hidden'); modal.classList.add('flex');

    setTimeout(() => {
        window.initFormMap(mapLat, mapLng);
    }, 100);
};

window.closeModal = function() { document.getElementById('modal-form').classList.add('hidden'); };

window.saveData = async function(e) {
    e.preventDefault();
    const saveBtn = document.getElementById('btn-save');
    saveBtn.disabled = true; saveBtn.innerText = "กำลังบันทึก...";

    if (!document.getElementById('inp-pdpa').checked) {
        alert("กรุณายอมรับเงื่อนไขการเก็บรวบรวมข้อมูลส่วนบุคคล");
        saveBtn.disabled = false; saveBtn.innerText = "บันทึกข้อมูล";
        return;
    }

    try {
        const recordId = document.getElementById('record-id').value;
        const type = document.getElementById('inp-type').value;
        
        const phone = document.getElementById('inp-phone').value;
        const idCard = document.getElementById('inp-id').value;
        const adminProv = currentSession && getAdminProvince(currentSession.user.email);

        if (!adminProv && !checkThaiID(idCard)) {
            document.getElementById('id-error').classList.remove('hidden'); throw new Error("เลขบัตรประชาชนไม่ถูกต้อง");
        } else { document.getElementById('id-error').classList.add('hidden'); }

        if (!adminProv && !validatePhone(phone)) {
            document.getElementById('phone-error').classList.remove('hidden'); throw new Error("เบอร์โทรศัพท์ไม่ถูกต้อง");
        } else { document.getElementById('phone-error').classList.add('hidden'); }

        let remarks = document.getElementById('inp-remarks').value;
        if (document.getElementById('inp-is-old').checked) remarks += ` ${OLD_DATA_TAG}`;
        const adminRoleVal = document.getElementById('inp-admin-role').value;
        if (adminRoleVal) remarks += ` {{ROLE:${adminRoleVal}}}`;

        if (recordId) {
            const oldRec = cachedData.find(r => r.id == recordId);
            if (oldRec) {
                if (oldRec.remarks.includes(STATUS_APPROVED_TAG)) remarks += ` ${STATUS_APPROVED_TAG}`;
                const interactMatch = (oldRec.remarks || '').match(/{{INTERACT:({.*?})}}/s);
                if (interactMatch) remarks += ` ${interactMatch[0]}`;
            }
        }

        const payload = {
            member_id: document.getElementById('inp-member-id').value,
            name: document.getElementById('inp-name').value,
            dob: document.getElementById('inp-dob').value,
            id_card: idCard,
            email: document.getElementById('inp-email').value,
            phone: phone,
            line_id: document.getElementById('inp-line').value,
            
            address: document.getElementById('inp-house-no').value,
            village: document.getElementById('inp-village').value,
            road: document.getElementById('inp-road').value,
            tambon: document.getElementById('inp-tambon').value,
            district: document.getElementById('inp-district').value,
            province: document.getElementById('inp-prov').value,
            zip: document.getElementById('inp-zip').value,
            region: document.getElementById('inp-region').value,
            
            lat: document.getElementById('inp-lat').value || null,
            lng: document.getElementById('inp-lng').value || null,

            recommender_name: document.getElementById('inp-recommender').value,
            type: type,
            remarks: remarks,
            start_date: document.getElementById('inp-start-date').value
        };

        if(!adminProv) payload.email = currentSession.user.email;

        let result;
        if (recordId) {
            result = await sb.from('members').update(payload).eq('id', recordId);
        } else {
            result = await sb.from('members').insert([payload]);
        }

        if (result.error) throw result.error;
        alert("บันทึกข้อมูลสำเร็จ");
        window.closeModal();
        fetchData();
    } catch (err) {
        alert("เกิดข้อผิดพลาด: " + err.message + "\n(ตรวจสอบคอลัมน์ใน Supabase: village, road, region, lat, lng)");
    } finally {
        saveBtn.disabled = false; saveBtn.innerText = "บันทึกข้อมูล";
    }
};

window.deleteData = async function(id) {
    if (!confirm("คุณต้องการลบข้อมูลนี้ใช่หรือไม่? การกระทำนี้ไม่สามารถย้อนกลับได้")) return;
    try {
        const { error } = await sb.from('members').delete().eq('id', id);
        if (error) throw error;
        alert("ลบข้อมูลเรียบร้อยแล้ว");
        fetchData();
    } catch (err) { alert("เกิดข้อผิดพลาดในการลบ: " + err.message); }
};

function updateNavState() {
    if (currentSession) {
        document.getElementById('nav-guest').classList.add('hidden');
        document.getElementById('nav-user').classList.remove('hidden');
        document.getElementById('nav-user').classList.add('flex');
        const adminProv = getAdminProvince(currentSession.user.email);
        const roleText = adminProv ? `<span class="text-orange-600 font-bold">(Admin ${adminProv === 'ALL' ? 'ส่วนกลาง' : adminProv})</span>` : '<span class="text-green-600">(Member)</span>';
        const userDisplay = document.getElementById('user-display');
        if(userDisplay) userDisplay.innerHTML = `${currentSession.user.email} ${roleText}`;
        if (!isRecoveryMode && !document.getElementById('view-auth').classList.contains('hidden')) window.switchView('dashboard');
    } else {
        document.getElementById('nav-guest').classList.remove('hidden');
        document.getElementById('nav-user').classList.add('hidden');
        document.getElementById('nav-user').classList.remove('flex');
    }
}

async function fetchData() {
    document.getElementById('loading').classList.remove('hidden');
    document.getElementById('table-body').innerHTML = '';
    
    const adminProv = currentSession ? getAdminProvince(currentSession.user.email) : null;
    let query = sb.from('members').select('*');
    
    if (!adminProv) { query = query.or(`email.eq.${currentSession.user.email},type.eq.post,type.eq.knowledge`); }
    else if (adminProv !== 'ALL') { query = query.or(`province.eq.${adminProv},type.eq.post,type.eq.knowledge,province.eq.ALL`); }
    
    const { data, error } = await query;
    document.getElementById('loading').classList.add('hidden');
    if (error) { console.error(error); return; }
    cachedData = data || [];
    
    const users = new Set(cachedData.map(m => m.email)).size;
    const members = cachedData.filter(m => m.type === 'member').length;
    const candidates = cachedData.filter(m => m.type === 'candidate').length;
    const sU = document.getElementById('stat-users'); if(sU) sU.innerText = users;
    const sT = document.getElementById('stat-total'); if(sT) sT.innerText = members;
    const sC = document.getElementById('stat-candidate'); if(sC) sC.innerText = candidates;

    const regionStats = {};
    cachedData.filter(m => m.type === 'member').forEach(m => {
        const region = mapToMainRegion(getRegion(m.province));
        regionStats[region] = (regionStats[region] || 0) + 1;
    });
    const regionHTML = Object.entries(regionStats).map(([reg, count]) => `
        <div class="bg-gray-50 p-3 rounded-lg border border-gray-200">
            <span class="block text-xs text-gray-500">${reg}</span>
            <span class="block text-xl font-bold text-gray-800">${count}</span>
        </div>
    `).join('');
    const rC = document.getElementById('region-stats-container'); if(rC) rC.innerHTML = regionHTML || '<div class="text-xs text-gray-400">ยังไม่มีข้อมูล</div>';
    
    window.handleSearch();
    if(isMapView && map) updateMapMarkers();
}

function renderTable(data) {
    const tbody = document.getElementById('table-body');
    if(!tbody) return;
    tbody.innerHTML = '';
    
    if (data.length === 0) {
        document.getElementById('empty-state').classList.remove('hidden'); return;
    } else { document.getElementById('empty-state').classList.add('hidden'); }

    const adminProv = currentSession ? getAdminProvince(currentSession.user.email) : null;

    data.forEach(item => {
        if (activeFilter !== 'all' && item.type !== activeFilter) return;
        
        let manageBtns = '';
        const isOwner = item.email === currentSession.user.email;
        if (adminProv || isOwner) {
            const canEdit = adminProv === 'ALL' || (adminProv && item.province === adminProv) || isOwner;
            if (canEdit) {
                manageBtns = `
                    <button onclick="openModal('edit', '${item.id}')" class="text-blue-600 hover:text-blue-800 mr-2"><i class="fa-solid fa-pen-to-square"></i></button>
                    <button onclick="deleteData('${item.id}')" class="text-red-600 hover:text-red-800"><i class="fa-solid fa-trash"></i></button>
                `;
            }
        }

        let status = '<span class="px-2 py-1 rounded bg-gray-100 text-gray-500 text-xs">ทั่วไป</span>';
        if (item.type === 'member') status = '<span class="px-2 py-1 rounded bg-green-100 text-green-700 text-xs">สมาชิก</span>';
        if (item.type === 'candidate') status = '<span class="px-2 py-1 rounded bg-orange-100 text-orange-700 text-xs">ผู้สมัคร ส.ส.</span>';
        if (item.type === 'feedback') {
            const isResolved = (item.remarks || '').includes('{{STATUS:RESOLVED}}');
            status = isResolved
                ? '<span class="px-2 py-1 rounded bg-green-100 text-green-700 text-xs font-bold">เสร็จสิ้น</span>'
                : '<span class="px-2 py-1 rounded bg-orange-100 text-orange-700 text-xs font-bold">รอการตอบกลับ</span>';
        }
        if (item.remarks && item.remarks.includes(OLD_DATA_TAG)) status += ' <span class="text-xs text-gray-400">(เดิม)</span>';
        
        const date = new Date(item.start_date || item.created_at).toLocaleDateString('th-TH');
        
        let fullAddr = `<b>${item.address || '-'}</b>`; 
        if(item.village) fullAddr += ` <span class="text-gray-500">ม.${item.village}</span>`;
        if(item.road) fullAddr += ` <span class="text-gray-500">ถ.${item.road}</span>`;
        fullAddr += `<br>ต.${item.tambon || '-'} อ.${item.district || '-'}`;
        fullAddr += `<br>จ.${item.province || '-'} ${item.zip || ''}`;
        
        tbody.innerHTML += `
            <tr class="hover:bg-gray-50 border-b align-top">
                <td class="px-6 py-4 font-mono text-xs text-gray-500">${item.member_id || '-'}</td>
                <td class="px-6 py-4 text-xs whitespace-nowrap">${date}</td>
                <td class="px-6 py-4 font-medium text-gray-900">${item.name}</td>
                <td class="px-6 py-4">${status}</td>
                <td class="px-6 py-4 text-xs">
                    <div class="flex flex-col gap-1">
                        <span><i class="fa-solid fa-phone w-4"></i> ${item.phone || '-'}</span>
                        <span class="text-gray-400">ID: ${item.id_card || '-'}</span>
                    </div>
                </td>
                <td class="px-6 py-4 text-xs address-cell border-l border-r border-gray-100 bg-gray-50/50">
                    ${fullAddr}
                </td>
                <td class="px-6 py-4 text-xs">
                    <div class="font-bold text-gray-700">${item.province}</div>
                    <div class="text-gray-400">${item.region || getRegion(item.province)}</div>
                </td>
                <td class="px-6 py-4 text-right">
                    ${manageBtns}
                </td>
            </tr>
        `;
    });
}

function renderExecutives() {
    const container = document.getElementById('executive-container');
    if(!container) return;
    container.innerHTML = '';
    executiveData.forEach(p => {
        container.innerHTML += `
            <div class="bg-white p-5 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition flex items-start gap-4">
                <div class="bg-orange-50 text-orange-600 w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg border border-orange-100">
                    ${p.id}
                </div>
                <div>
                    <h4 class="font-bold text-gray-800 text-lg leading-tight">${p.name}</h4>
                    <div class="bg-orange-600 text-white text-xs px-2 py-1 rounded inline-block mt-2 mb-1">${p.pos}</div>
                    <p class="text-xs text-gray-500"><i class="fa-regular fa-calendar mr-1"></i> เริ่ม: ${p.date}</p>
                </div>
            </div>
        `;
    });
}

async function initPartyInfo() {
    const { data, error } = await sb.from('party_info').select('*').single();
    if (data) renderPartyInfo(data);

    sb.channel('public:party_info')
        .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'party_info' }, payload => {
            renderPartyInfo(payload.new);
        })
        .subscribe();
}

function renderPartyInfo(info) {
    if (!info) return;
    const fmt = (n) => n ? n.toLocaleString() : '0';

    const dashIds = {
        total: 'dash-ect-member-total', n: 'dash-ect-member-n', c: 'dash-ect-member-c', ne: 'dash-ect-member-ne', s: 'dash-ect-member-s',
        branch: 'dash-ect-branch-total', rep: 'dash-ect-rep-total',
        mName: 'dash-ect-month-name', mInc: 'dash-ect-month-inc', mDec: 'dash-ect-month-dec'
    };

    const update = (id, val) => { const el = document.getElementById(id); if(el) el.innerText = val; };

    update(dashIds.total, fmt(info.member_total));
    update(dashIds.branch, fmt(info.branch_total));
    update(dashIds.rep, fmt(info.rep_total));
    update(dashIds.mName, info.month_name);
    update(dashIds.mInc, '+' + fmt(info.month_inc));
    update(dashIds.mDec, '-' + fmt(info.month_dec));
}

// --- FEEDBACK & POSTS FUNCTIONS ---

function parseInteractions(remarks) {
    const match = remarks.match(/{{INTERACT:({.*?})}}/s);
    if (match) { try { return JSON.parse(match[1]); } catch (e) { console.error("Parse Error", e); } }
    return { likes: [], neutrals: [], comments: [] };
}

async function updateInteraction(id, action, payload = null) {
    if (!currentSession) return alert("กรุณาเข้าสู่ระบบก่อน");
    const recordIndex = cachedData.findIndex(r => r.id == id);
    if (recordIndex === -1) return;
    const record = cachedData[recordIndex];
    let remarks = record.remarks || '';
    let interactData = parseInteractions(remarks);
    const userEmail = currentSession.user.email;
    if (action === 'like') {
        if (interactData.likes.includes(userEmail)) { interactData.likes = interactData.likes.filter(e => e !== userEmail); }
        else { interactData.likes.push(userEmail); interactData.neutrals = interactData.neutrals.filter(e => e !== userEmail); }
    } else if (action === 'neutral') {
        if (interactData.neutrals.includes(userEmail)) { interactData.neutrals = interactData.neutrals.filter(e => e !== userEmail); }
        else { interactData.neutrals.push(userEmail); interactData.likes = interactData.likes.filter(e => e !== userEmail); }
    } else if (action === 'comment') {
        if (!payload || !payload.trim()) return;
        interactData.comments.push({ user: userEmail, text: payload, time: new Date().toISOString() });
    }
    const newTag = `{{INTERACT:${JSON.stringify(interactData)}}}`;
    let newRemarks = remarks.replace(/{{INTERACT:({.*?})}}/s, '').trim();
    newRemarks = (newRemarks + ' ' + newTag).trim();
    cachedData[recordIndex].remarks = newRemarks;
    const containerId = document.getElementById('modal-news-reader').classList.contains('hidden') === false ? 'news-interaction-area' :
        (document.getElementById('modal-feedback-read').classList.contains('hidden') === false ? 'fb-interaction-area' : 'kn-interaction-area');
    renderInteractionUI(containerId, cachedData[recordIndex]);
    await sb.from('members').update({ remarks: newRemarks }).eq('id', id);
}

function renderInteractionUI(containerId, record) {
    const container = document.getElementById(containerId);
    if (!container) return;
    const data = parseInteractions(record.remarks || '');
    const likesCount = data.likes ? data.likes.length : 0;
    const neutralsCount = data.neutrals ? data.neutrals.length : 0;
    const comments = data.comments || [];
    const userEmail = currentSession ? currentSession.user.email : '';
    const isLiked = data.likes && data.likes.includes(userEmail);
    const isNeutral = data.neutrals && data.neutrals.includes(userEmail);
    let commentsHtml = comments.map(c => `
        <div class="mb-3">
            <div class="flex items-center gap-2 mb-1">
                <div class="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center text-[10px] text-gray-600 font-bold">${c.user.substring(0, 2).toUpperCase()}</div>
                <span class="text-xs font-bold text-gray-700">${c.user}</span>
                <span class="text-[10px] text-gray-400">${new Date(c.time).toLocaleDateString('th-TH')}</span>
            </div>
            <div class="comment-bubble text-gray-800">${c.text}</div>
        </div>
    `).join('');
    if (comments.length === 0) commentsHtml = '<p class="text-gray-400 text-sm text-center py-4">ยังไม่มีความคิดเห็น</p>';
    container.innerHTML = `
        <div class="flex items-center gap-4 mb-6">
            <button onclick="updateInteraction('${record.id}', 'like')" class="flex items-center gap-2 px-4 py-2 rounded-full border transition ${isLiked ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'}">
                <i class="fa-solid fa-thumbs-up"></i> <span>ถูกใจ (${likesCount})</span>
            </button>
            <button onclick="updateInteraction('${record.id}', 'neutral')" class="flex items-center gap-2 px-4 py-2 rounded-full border transition ${isNeutral ? 'bg-gray-600 text-white border-gray-600' : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'}">
                <i class="fa-solid fa-face-meh"></i> <span>เฉยๆ (${neutralsCount})</span>
            </button>
        </div>
        <h5 class="font-bold text-gray-800 mb-4"><i class="fa-regular fa-comments mr-2"></i> ความคิดเห็น (${comments.length})</h5>
        <div class="max-h-64 overflow-y-auto mb-4 pr-2 reader-scroll">${commentsHtml}</div>
        <div class="flex gap-2">
            <input id="comment-input-${record.id}" class="flex-grow p-2 border rounded-lg text-sm bg-gray-50 outline-none focus:ring-2 focus:ring-blue-500" placeholder="แสดงความคิดเห็น...">
            <button onclick="submitComment('${record.id}')" class="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-700"><i class="fa-solid fa-paper-plane"></i></button>
        </div>
    `;
}

function submitComment(id) {
    const input = document.getElementById(`comment-input-${id}`);
    const text = input.value;
    if (!text) return;
    updateInteraction(id, 'comment', text).then(() => { if (input) input.value = ''; });
}

window.handleFeedbackSubmit = async function(e) {
    e.preventDefault();
    if (!currentSession) { alert("กรุณาเข้าสู่ระบบก่อน"); return window.switchView('auth'); }
    const btn = document.getElementById('btn-feedback-submit');
    btn.disabled = true; btn.innerHTML = 'กำลังส่ง...';
    
    const payload = {
        name: document.getElementById('fb-topic').value,
        remarks: document.getElementById('fb-detail').value,
        type: 'feedback', email: currentSession.user.email, province: document.getElementById('fb-type').value,
        id_card: 'FEEDBACK', phone: '-'
    };
    const { error } = await sb.from('members').insert([payload]);
    if (error) alert("ส่งเรื่องไม่สำเร็จ: " + error.message);
    else {
        alert("✅ ส่งเรื่องเรียบร้อยแล้ว");
        e.target.reset();
        renderFeedbacks();
    }
    btn.disabled = false; btn.innerHTML = '<i class="fa-solid fa-paper-plane mr-2"></i> ส่งเรื่อง';
};

async function renderFeedbacks() {
    const tbody = document.getElementById('feedback-table-body');
    if(!tbody) return;
    tbody.innerHTML = '<tr><td colspan="5" class="text-center py-4 text-gray-400">กำลังโหลด...</td></tr>';
    const { data } = await sb.from('members').select('*').eq('type', 'feedback').order('created_at', { ascending: false }).limit(10);
    tbody.innerHTML = '';
    if (data && data.length > 0) {
        data.forEach(f => {
            const isResolved = (f.remarks || '').includes('{{STATUS:RESOLVED}}');
            const statusBadge = isResolved ? '<span class="text-green-600">เสร็จสิ้น</span>' : '<span class="text-orange-500">รอตอบกลับ</span>';
            const ticketId = '#' + f.id.substring(0, 6).toUpperCase();
            const safeFbObj = JSON.stringify(f).replace(/"/g, '&quot;');
            
            tbody.innerHTML += `
                <tr class="hover:bg-gray-50 transition border-b cursor-pointer group" onclick="openFeedbackReader(${safeFbObj})">
                    <td class="px-6 py-4 text-gray-400 text-xs font-mono font-bold">${ticketId}</td>
                    <td class="px-6 py-4 text-gray-500 text-xs">${new Date(f.created_at).toLocaleDateString('th-TH')}</td>
                    <td class="px-6 py-4 text-sm whitespace-nowrap">${f.province.toUpperCase()}</td>
                    <td class="px-6 py-4 font-medium text-gray-800 text-sm group-hover:text-blue-600 truncate max-w-xs">${f.name}</td>
                    <td class="px-6 py-4 text-right">${statusBadge}</td>
                </tr>`;
        });
    } else { tbody.innerHTML = `<tr><td colspan="5" class="text-center py-4 text-gray-400">ไม่มีรายการ</td></tr>`; }
}

window.openFeedbackReader = function(fb) {
    document.getElementById('fb-read-topic').innerText = fb.name;
    document.getElementById('fb-read-type').innerText = fb.province === 'suggestion' ? 'ข้อเสนอแนะ' : (fb.province === 'complaint' ? 'ร้องเรียน' : 'สอบถาม');
    document.getElementById('fb-read-date').innerText = new Date(fb.created_at).toLocaleDateString('th-TH');
    let detail = (fb.remarks || '').replace('{{STATUS:RESOLVED}}', '').replace(/{{INTERACT:({.*?})}}/s, '').trim();
    document.getElementById('fb-read-detail').innerText = detail;
    let isResolved = (fb.remarks || '').includes('{{STATUS:RESOLVED}}');
    document.getElementById('fb-read-status').innerHTML = isResolved
        ? '<span class="text-green-600 font-bold"><i class="fa-solid fa-circle-check"></i> ดำเนินการเสร็จสิ้นแล้ว</span>'
        : '<span class="text-orange-500 font-bold"><i class="fa-regular fa-clock"></i> อยู่ระหว่างรอเจ้าหน้าที่ตอบกลับ</span>';
    document.getElementById('modal-feedback-read').classList.remove('hidden');
    document.getElementById('modal-feedback-read').classList.add('flex');
    renderInteractionUI('fb-interaction-area', fb);
};

window.openFeedbackManageModal = function(record) {
    const modal = document.getElementById('modal-feedback-manage');
    document.getElementById('fb-manage-id').value = record.id;
    document.getElementById('fb-manage-type').innerText = record.province.toUpperCase();
    document.getElementById('fb-manage-date').innerText = new Date(record.created_at).toLocaleDateString('th-TH');
    document.getElementById('fb-manage-topic').innerText = record.name;
    document.getElementById('fb-manage-by').innerText = record.email;
    let detail = (record.remarks || '').replace('{{STATUS:RESOLVED}}', '').replace(/{{INTERACT:({.*?})}}/s, '').trim();
    document.getElementById('fb-manage-detail').innerText = detail;
    const isResolved = (record.remarks || '').includes('{{STATUS:RESOLVED}}');
    document.getElementById('fb-manage-status').value = isResolved ? 'RESOLVED' : 'PENDING';
    modal.classList.remove('hidden'); modal.classList.add('flex');
};

window.saveFeedbackStatus = async function(e) {
    e.preventDefault();
    const btn = e.target;
    btn.disabled = true; btn.innerText = "กำลังบันทึก...";
    try {
        const id = document.getElementById('fb-manage-id').value;
        const newStatus = document.getElementById('fb-manage-status').value;
        const record = cachedData.find(r => r.id == id);
        if (!record) throw new Error("Record not found");
        let remarks = record.remarks || '';
        remarks = remarks.replace('{{STATUS:RESOLVED}}', '').trim();
        if (newStatus === 'RESOLVED') { remarks = remarks + ' {{STATUS:RESOLVED}}'; }
        const { error } = await sb.from('members').update({ remarks: remarks }).eq('id', id);
        if (error) throw error;
        alert("อัปเดตสถานะเรียบร้อยแล้ว");
        document.getElementById('modal-feedback-manage').classList.add('hidden');
        fetchData();
    } catch (err) { alert("เกิดข้อผิดพลาด: " + err.message); } finally { btn.disabled = false; btn.innerText = "บันทึกสถานะ"; }
};

function renderNews() {
    const container = document.getElementById('news-container');
    if(!container) return;
    container.innerHTML = '';
    let userProv = null;
    let adminProv = null;
    if (currentSession) {
        const user = cachedData.find(m => m.email === currentSession.user.email);
        userProv = user ? user.province : null;
        adminProv = getAdminProvince(currentSession.user.email);
    }
    if (adminProv) document.getElementById('btn-create-post').classList.remove('hidden');
    else document.getElementById('btn-create-post').classList.add('hidden');
    const posts = cachedData.filter(m => m.type === 'post').filter(p => {
        return p.province === 'ALL' || (userProv && p.province === userProv) || adminProv;
    });
    if (posts.length === 0) {
        container.innerHTML = `<div class="col-span-full text-center py-12 text-gray-400 bg-white rounded-xl border border-dashed">ยังไม่มีข่าวสารในขณะนี้</div>`;
        return;
    }
    posts.forEach(p => {
        const date = new Date(p.created_at).toLocaleDateString('th-TH');
        let content = p.remarks || '';
        let imgUrl = 'https://via.placeholder.com/400x225?text=No+Image';
        const imgMatch = content.match(/{{IMG:(.*?)}}/);
        if (imgMatch) { imgUrl = imgMatch[1]; content = content.replace(/{{IMG:(.*?)}}/g, ''); }
        content = content.replace(/{{INTERACT:({.*?})}}/s, '');
        let controls = '';
        const isOwner = p.email === currentSession?.user?.email;
        if (adminProv === 'ALL' || isOwner) {
            controls = `
                <div class="absolute bottom-2 right-2 flex gap-1 z-20">
                    <button onclick="event.stopPropagation(); openPostModal('edit', ${JSON.stringify(p).replace(/"/g, '&quot;')})" class="bg-white/90 p-2 rounded-full hover:bg-white text-blue-600 shadow border action-btn"><i class="fa-solid fa-pen"></i></button>
                    <button onclick="event.stopPropagation(); deleteData('${p.id}')" class="bg-white/90 p-2 rounded-full hover:bg-white text-red-600 shadow border action-btn"><i class="fa-solid fa-trash"></i></button>
                </div>
            `;
        }
        const badge = p.province === 'ALL'
            ? '<span class="bg-blue-600 text-white text-xs px-2 py-1 rounded absolute top-2 left-2 z-10">ส่วนกลาง</span>'
            : `<span class="bg-orange-600 text-white text-xs px-2 py-1 rounded absolute top-2 left-2 z-10">${p.province}</span>`;
        const safePostObj = JSON.stringify(p).replace(/"/g, '&quot;');
        container.innerHTML += `
            <div class="bg-white rounded-xl shadow-sm border overflow-hidden relative group hover:shadow-lg transition cursor-pointer" onclick="openNewsReader(${safePostObj})">
                ${badge}
                <img src="${imgUrl}" class="w-full h-48 object-cover aspect-video relative z-0">
                ${controls}
                <div class="p-4 relative z-0">
                    <div class="text-xs text-gray-400 mb-2"><i class="fa-regular fa-calendar mr-1"></i> ${date}</div>
                    <h4 class="font-bold text-gray-800 text-lg mb-2 line-clamp-2">${p.name}</h4>
                    <p class="text-sm text-gray-600 line-clamp-3 mb-4">${content}</p>
                    <button class="text-orange-600 text-sm font-bold hover:underline action-btn">อ่านเพิ่มเติม</button>
                </div>
            </div>
        `;
    });
}

window.openNewsReader = function(post) {
    let content = post.remarks || '';
    const imgMatch = content.match(/{{IMG:(.*?)}}/);
    let imgUrl = null;
    if (imgMatch) { imgUrl = imgMatch[1]; content = content.replace(/{{IMG:(.*?)}}/g, ''); }
    content = content.replace(/{{INTERACT:({.*?})}}/s, '');
    document.getElementById('news-reader-title').innerText = post.name;
    document.getElementById('news-reader-date').innerText = new Date(post.created_at).toLocaleDateString('th-TH');
    document.getElementById('news-reader-content').innerText = content;
    const imgContainer = document.getElementById('news-reader-img-container');
    const img = document.getElementById('news-reader-img');
    if (imgUrl) { imgContainer.classList.remove('hidden'); img.src = imgUrl; }
    else { imgContainer.classList.add('hidden'); }
    document.getElementById('modal-news-reader').classList.remove('hidden');
    document.getElementById('modal-news-reader').classList.add('flex');
    renderInteractionUI('news-interaction-area', post);
};

window.openPostModal = function(mode, record = null) {
    const modal = document.getElementById('modal-post');
    const form = document.getElementById('postForm');
    const title = document.getElementById('modal-post-title');
    const targetWrapper = document.getElementById('post-target-wrapper');
    const imgPreview = document.getElementById('post-img-preview');
    form.reset();
    imgPreview.classList.add('hidden');
    document.getElementById('post-id').value = '';
    const adminProv = getAdminProvince(currentSession.user.email);
    if (adminProv === 'ALL') targetWrapper.classList.remove('hidden');
    else targetWrapper.classList.add('hidden');
    if (mode === 'edit' && record) {
        title.innerText = "แก้ไขข่าว";
        document.getElementById('post-id').value = record.id;
        document.getElementById('inp-post-title').value = record.name;
        let content = record.remarks || '';
        const imgMatch = content.match(/{{IMG:(.*?)}}/);
        if (imgMatch) { imgPreview.classList.remove('hidden'); imgPreview.querySelector('img').src = imgMatch[1]; content = content.replace(/{{IMG:(.*?)}}/g, ''); }
        content = content.replace(/{{INTERACT:({.*?})}}/s, '');
        document.getElementById('inp-post-content').value = content.trim();
        if (adminProv === 'ALL') document.getElementById('inp-post-target').value = record.province;
    } else { title.innerText = "สร้างข่าวใหม่"; }
    modal.classList.remove('hidden'); modal.classList.add('flex');
};

window.closePostModal = function() { document.getElementById('modal-post').classList.add('hidden'); };

window.savePost = async function(e) {
    e.preventDefault();
    const btn = document.getElementById('btn-post-save');
    btn.disabled = true; btn.innerText = "กำลังโพสต์...";
    const recordId = document.getElementById('post-id').value;
    const title = document.getElementById('inp-post-title').value;
    const content = document.getElementById('inp-post-content').value;
    const fileInput = document.getElementById('inp-post-img');
    const adminProv = getAdminProvince(currentSession.user.email);
    let targetProv = adminProv === 'ALL' ? document.getElementById('inp-post-target').value : adminProv;
    let imgUrl = null;
    if (fileInput.files.length > 0) {
        const file = fileInput.files[0];
        const ext = file.name.split('.').pop();
        const name = `news_${Date.now()}_${Math.random().toString(36).substring(7)}.${ext}`;
        const { error, data } = await sb.storage.from('ThaiDev').upload(name, file);
        if (error) { alert("Error: " + error.message); btn.disabled = false; return; }
        const { data: urlData } = sb.storage.from('ThaiDev').getPublicUrl(name);
        imgUrl = urlData.publicUrl;
    } else if (recordId) {
        const oldRec = cachedData.find(r => r.id == recordId);
        const oldMatch = (oldRec.remarks || '').match(/{{IMG:(.*?)}}/);
        if (oldMatch) imgUrl = oldMatch[1];
    }
    let finalRemarks = content;
    if (imgUrl) finalRemarks += ` {{IMG:${imgUrl}}}`;
    if (recordId) {
        const oldRec = cachedData.find(r => r.id == recordId);
        const interactMatch = (oldRec.remarks || '').match(/{{INTERACT:({.*?})}}/s);
        if (interactMatch) finalRemarks += ` ${interactMatch[0]}`;
    }
    const payload = {
        name: title, remarks: finalRemarks, type: 'post', province: targetProv,
        email: currentSession.user.email, id_card: 'POST', phone: '-'
    };
    let result;
    if (recordId) result = await sb.from('members').update(payload).eq('id', recordId);
    else result = await sb.from('members').insert([payload]);
    if (result.error) alert("บันทึกไม่สำเร็จ: " + result.error.message);
    else { window.closePostModal(); alert("บันทึกข่าวเรียบร้อย"); fetchData(); }
    btn.disabled = false; btn.innerText = "โพสต์ข่าว";
};

function renderKnowledge() {
    const list = document.getElementById('knowledge-list');
    const btnAdd = document.getElementById('btn-add-knowledge');
    if(!list) return;
    list.innerHTML = '';
    const adminProv = currentSession ? getAdminProvince(currentSession.user.email) : null;
    if (adminProv) btnAdd.classList.remove('hidden'); else btnAdd.classList.add('hidden');
    const docs = cachedData.filter(d => d.type === 'knowledge');
    if (docs.length === 0) { list.innerHTML = `<li class="text-center text-gray-400 text-sm py-4">ยังไม่มีเอกสารในระบบ</li>`; return; }
    docs.forEach(doc => {
        let deleteBtn = adminProv ? `<i onclick="event.stopPropagation(); deleteData('${doc.id}')" class="fa-solid fa-trash text-gray-300 hover:text-red-500 cursor-pointer ml-3 p-2" title="ลบเอกสาร"></i>` : '';
        const safeDoc = JSON.stringify(doc).replace(/"/g, '&quot;').replace(/'/g, "\\'");
        list.innerHTML += `
        <li onclick='openKnowledgeReader(${safeDoc})' class="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-blue-50 transition group/item cursor-pointer">
            <div class="flex items-center gap-3 flex-grow">
                <i class="fa-solid fa-book text-blue-500 text-lg"></i>
                <span class="text-gray-700 text-sm font-bold">${doc.name}</span>
            </div>
            <div class="flex items-center">
                <span class="text-xs text-gray-400 mr-2">คลิกเพื่อดู</span>
                ${deleteBtn}
            </div>
        </li>`;
    });
}

window.openKnowledgeReader = function(doc) {
    document.getElementById('kn-read-title').innerText = doc.name;
    let filesHtml = '';
    let pdfUrl1 = '#', pdfUrl2 = '#';
    const match1 = (doc.remarks || '').match(/{{PDF1:(.*?)}}/);
    const match2 = (doc.remarks || '').match(/{{PDF2:(.*?)}}/);
    const oldMatch = (doc.remarks || '').match(/{{PDF:(.*?)}}/);
    if (match1) pdfUrl1 = match1[1]; else if (oldMatch) pdfUrl1 = oldMatch[1];
    if (match2) pdfUrl2 = match2[1];
    if (pdfUrl1 !== '#') filesHtml += `<a href="${pdfUrl1}" target="_blank" class="bg-white/20 text-white px-3 py-1 rounded text-xs hover:bg-white/30 border border-white/30"><i class="fa-solid fa-download mr-1"></i> ดาวน์โหลดไฟล์ 1</a>`;
    if (pdfUrl2 !== '#') filesHtml += `<a href="${pdfUrl2}" target="_blank" class="bg-white/20 text-white px-3 py-1 rounded text-xs hover:bg-white/30 border border-white/30"><i class="fa-solid fa-download mr-1"></i> ดาวน์โหลดไฟล์ 2</a>`;
    document.getElementById('kn-read-files').innerHTML = filesHtml;
    document.getElementById('modal-knowledge-read').classList.remove('hidden');
    document.getElementById('modal-knowledge-read').classList.add('flex');
    renderInteractionUI('kn-interaction-area', doc);
};

window.saveKnowledge = async function(e) {
    e.preventDefault();
    if (!currentSession) return;
    const btn = document.getElementById('btn-know-save');
    const title = document.getElementById('inp-know-title').value;
    const file1 = document.getElementById('inp-know-file-1').files[0];
    const file2 = document.getElementById('inp-know-file-2').files[0];
    if (!file1 && !file2) return alert("กรุณาเลือกไฟล์ PDF อย่างน้อย 1 ไฟล์");
    btn.disabled = true; btn.innerText = "กำลังอัปโหลด...";
    try {
        let remarks = "";
        if (file1) {
            const ext1 = file1.name.split('.').pop();
            const name1 = `know1_${Date.now()}_${Math.random().toString(36).substring(7)}.${ext1}`;
            const { error: err1 } = await sb.storage.from('ThaiDev').upload(name1, file1, { cacheControl: '3600', upsert: false });
            if (err1) throw err1;
            const { data: data1 } = sb.storage.from('ThaiDev').getPublicUrl(name1);
            remarks += `{{PDF1:${data1.publicUrl}}} `;
        }
        if (file2) {
            const ext2 = file2.name.split('.').pop();
            const name2 = `know2_${Date.now()}_${Math.random().toString(36).substring(7)}.${ext2}`;
            const { error: err2 } = await sb.storage.from('ThaiDev').upload(name2, file2, { cacheControl: '3600', upsert: false });
            if (err2) throw err2;
            const { data: data2 } = sb.storage.from('ThaiDev').getPublicUrl(name2);
            remarks += `{{PDF2:${data2.publicUrl}}}`;
        }
        const payload = {
            name: title, type: 'knowledge', remarks: remarks.trim(),
            email: currentSession.user.email, province: 'ALL', id_card: 'KNOWLEDGE', phone: '-'
        };
        const { error: dbError } = await sb.from('members').insert([payload]);
        if (dbError) throw dbError;
        alert("อัปโหลดเอกสารเรียบร้อยแล้ว");
        document.getElementById('modal-knowledge').classList.add('hidden');
        e.target.reset();
        fetchData().then(() => renderKnowledge());
    } catch (err) { alert("เกิดข้อผิดพลาด: " + err.message); }
    finally { btn.disabled = false; btn.innerText = "อัปโหลด"; }
};
