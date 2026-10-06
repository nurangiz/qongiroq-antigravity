// Barcha qo'ng'iroq vaqtlarini saqlash uchun massiv
let schedules = ['08:00', '08:45', '08:50', '09:35']; // Boshlang'ich jadvallar misol tariqasida
let lastPlayedTime = "";

function updateClock() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    
    // Ekranda soatni ko'rsatish
    document.getElementById('clock').textContent = `${hours}:${minutes}:${seconds}`;

    // Joriy soat va minutni tekshirish
    const currentTimeString = `${hours}:${minutes}`;
    checkBell(currentTimeString, seconds);
}

function checkBell(currentTimeString, seconds) {
    // Agar hozirgi vaqt jadvallar ro'yxatida bo'lsa va bu daqiqada hali chalinmagan bo'lsa (00-sekundda chalish)
    if (schedules.includes(currentTimeString) && lastPlayedTime !== currentTimeString && seconds === "00") {
        playBell();
        lastPlayedTime = currentTimeString;
    }
}

function playBell() {
    const audio = document.getElementById('bellAudio');
    audio.currentTime = 0; // Ovozni boshidan boshlash
    audio.play().catch(e => {
        console.warn("Avtomatik ovoz chalish bloklandi. Iltimos sahifa bilan o'zaro aloqada bo'ling (click qiling).", e);
        alert("Qo'ng'iroq chalindi! Lekin brauzer avtomatik ovozni bloklagan bo'lishi mumkin.");
    });
}

function testBell() {
    playBell();
}

function addTime() {
    const timeInput = document.getElementById('timeInput').value;
    if (timeInput && !schedules.includes(timeInput)) {
        schedules.push(timeInput);
        schedules.sort(); // Vaqtlari bo'yicha tartiblash
        renderSchedule();
    }
    document.getElementById('timeInput').value = '';
}

function removeTime(time) {
    schedules = schedules.filter(t => t !== time);
    renderSchedule();
}

function renderSchedule() {
    const list = document.getElementById('scheduleList');
    list.innerHTML = '';
    schedules.forEach(time => {
        const li = document.createElement('li');
        li.innerHTML = `
            <span>${time}</span> 
            <button class="delete-btn" onclick="removeTime('${time}')">O'chirish</button>
        `;
        list.appendChild(li);
    });
}

// Dastur ishga tushganda jadvallarni chizish
renderSchedule();

// Soatni har sekundda yangilab turish
setInterval(updateClock, 1000);
updateClock();
