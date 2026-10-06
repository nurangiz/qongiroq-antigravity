(function(){
  const LESSON_MIN = 45;
  const SMALL_BREAK_MIN = 5;
  const BIG_BREAK_MIN = 45; // 45 daqiqalik katta tanaffus
  const BIG_BREAK_AFTER = 5; // 5-darsdan keyin
  const TOTAL_LESSONS = 9;
  const RING_CIRC = 2 * Math.PI * 105;

  const $ = (id) => document.getElementById(id);
  const startInput = $('startTime');
  const applyBtn = $('applyBtn');
  const testBellBtn = $('testBellBtn');
  const testBreakBtn = $('testBreakBtn');
  const soundSwitch = $('soundSwitch');
  const timelineEl = $('timeline');
  const ringProgress = $('ringProgress');
  const statusLabel = $('statusLabel');
  const timeLabel = $('timeLabel');
  const subLabel = $('subLabel');
  const nextUp = $('nextUp');
  const themeBtn = $('themeBtn');
  const audioStatus = $('audioStatus');

  ringProgress.style.strokeDasharray = RING_CIRC.toFixed(1);

  let soundOn = true;
  let scheduleMins = [];
  let lastRungMinute = -1;
  let lastWarningMinute = -1;
  let scheduleVersion = 0; // Himoya qulfi

  // Mavzuni sozlash (Theme)
  const savedTheme = localStorage.getItem('bell_theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  document.documentElement.setAttribute('data-theme', savedTheme);

  themeBtn.onclick = () => {
    const root = document.documentElement;
    const currentTheme = root.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', newTheme);
    localStorage.setItem('bell_theme', newTheme);
  };

  // Ovozni sozlash (Sound)
  try {
    const savedSound = localStorage.getItem('bell_sound_on');
    if (savedSound !== null) soundOn = savedSound === '1';
    const savedStart = localStorage.getItem('bell_start_time');
    if (savedStart) startInput.value = savedStart;
  } catch(e) {}

  function updateSoundSwitch() {
    if (soundOn) soundSwitch.classList.add('on');
    else soundSwitch.classList.remove('on');
  }
  updateSoundSwitch();

  soundSwitch.onclick = () => {
    soundOn = !soundOn;
    localStorage.setItem('bell_sound_on', soundOn ? '1' : '0');
    updateSoundSwitch();
  };

  // Audio sozlamalari
  const bellAudio = new Audio('bell.mp3');
  bellAudio.preload = 'auto';

  const breakStartAudio = new Audio('break_start.mp3');
  breakStartAudio.preload = 'auto';

  const breakWarningAudio = new Audio('break_warning.mp3');
  breakWarningAudio.preload = 'auto';

  const breakEndAudio = new Audio('break_end.mp3');
  breakEndAudio.preload = 'auto';

  const musicAudio = new Audio('music.mp3');
  musicAudio.loop = true;
  musicAudio.preload = 'auto'; // Faylni oldindan yuklab tayyorlab turish
  let musicOn = false;
  let musicTimeout = null;

  function toggleMusic(forceState) {
    if (typeof forceState === 'boolean') {
      musicOn = forceState;
    } else {
      musicOn = !musicOn;
    }

    if (musicOn) {
      $('musicBtn').textContent = '⏸ To\'xtatish';
      musicAudio.play().catch(e => {
        audioStatus.textContent = "Musiqani chalish uchun sahifani bir marta bosing!";
        setTimeout(() => audioStatus.textContent = "", 3000);
        musicOn = false;
        $('musicBtn').textContent = '▶ Yoqish';
      });
    } else {
      $('musicBtn').textContent = '▶ Yoqish';
      musicAudio.pause();
    }
  }

  $('musicBtn').onclick = () => {
    if (musicTimeout) clearTimeout(musicTimeout);
    toggleMusic();
  };

  const anthemAudio = new Audio('anthem.mp3');
  let anthemOn = false;

  $('anthemBtn').onclick = () => {
    anthemOn = !anthemOn;
    if (anthemOn) {
      $('anthemBtn').textContent = '⏸ To\'xtatish';
      
      if (musicOn) toggleMusic(false); 
      bellAudio.pause();

      anthemAudio.play().catch(e => {
        audioStatus.textContent = "Madhiyani chalish uchun sahifani bosing!";
        setTimeout(() => audioStatus.textContent = "", 3000);
        anthemOn = false;
        $('anthemBtn').textContent = '▶ Tinglash';
      });
    } else {
      $('anthemBtn').textContent = '▶ Tinglash';
      anthemAudio.pause();
    }
  };

  anthemAudio.onended = () => {
    anthemOn = false;
    $('anthemBtn').textContent = '▶ Tinglash';
  };

  function playBell() {
    bellAudio.currentTime = 0;
    bellAudio.play().then(() => {
      setTimeout(() => {
        bellAudio.pause();
        bellAudio.currentTime = 0;
      }, 7000);
    }).catch(e => {
      audioStatus.textContent = "Brauzer avtomatik ovozni blokladi, iltimos tugmani bosing!";
      setTimeout(() => audioStatus.textContent = "", 4000);
    });
  }

  testBellBtn.onclick = playBell;

  // Tanaffusni sun'iy ravishda sinab ko'rish uchun:
  if (testBreakBtn) {
    testBreakBtn.onclick = () => {
      if (!soundOn) return;
      buildSchedule(); // Hamma narsani tozalash va noldan boshlash uchun chaqiramiz
      const myVersion = scheduleVersion; // Qulf raqamini saqlaymiz

      playBell();
      
      setTimeout(() => {
        if (myVersion !== scheduleVersion) return;
        musicAudio.volume = 1.0; 
        musicAudio.currentTime = 0; 
        toggleMusic(true);
        
        if (musicTimeout) clearTimeout(musicTimeout);
        musicTimeout = setTimeout(() => {
          if (myVersion === scheduleVersion) toggleMusic(false);
        }, 5 * 60 * 1000);
      }, 1000);

      setTimeout(() => {
        if (myVersion !== scheduleVersion) return;
        musicAudio.pause();
        $('musicBtn').textContent = '▶ Yoqish';
        breakStartAudio.currentTime = 0;
        breakStartAudio.play().catch(e => console.log(e));
      }, 7500);

      setTimeout(() => {
        if (myVersion !== scheduleVersion) return;
        if (soundOn && musicTimeout) {
          musicAudio.play().catch(e => console.log(e));
          $('musicBtn').textContent = '⏸ To\'xtatish';
        }
      }, 16000);
    };
  }

  // Vaqtni yordamchi funksiyalari
  function timeToMins(timeStr) {
    const [h, m] = timeStr.split(':').map(Number);
    return h * 60 + m;
  }

  function minsToTime(mins) {
    const h = Math.floor(mins / 60) % 24;
    const m = mins % 60;
    return String(h).padStart(2, '0') + ':' + String(m).padStart(2, '0');
  }

  // Jadvalni tuzish
  function buildSchedule() {
    scheduleVersion++; // Yangi jadval tuzilganda eski buyruqlarni bekor qilish uchun versiyani oshiramiz
    
    // Har safar yangi jadval tuzilganda barcha ochiq qolgan ovozlarni to'xtatish
    if (musicTimeout) clearTimeout(musicTimeout);
    toggleMusic(false);
    bellAudio.pause(); bellAudio.currentTime = 0;
    breakStartAudio.pause(); breakStartAudio.currentTime = 0;
    breakEndAudio.pause(); breakEndAudio.currentTime = 0;
    breakWarningAudio.pause(); breakWarningAudio.currentTime = 0;
    anthemAudio.pause(); anthemAudio.currentTime = 0;
    anthemOn = false;
    if ($('anthemBtn')) $('anthemBtn').textContent = '▶ Tinglash';

    const timeVal = startInput.value;
    if (!timeVal) return;
    localStorage.setItem('bell_start_time', timeVal);

    let currentMin = timeToMins(timeVal);
    scheduleMins = [];

    for (let i = 1; i <= TOTAL_LESSONS; i++) {
      const startMins = currentMin;
      const endMins = currentMin + LESSON_MIN;
      scheduleMins.push({
        type: 'lesson',
        num: i,
        startMins,
        endMins,
        startStr: minsToTime(startMins),
        endStr: minsToTime(endMins),
        label: `${i}-dars`
      });
      currentMin = endMins;

      if (i < TOTAL_LESSONS) {
        const breakLen = (i === BIG_BREAK_AFTER) ? BIG_BREAK_MIN : SMALL_BREAK_MIN;
        const bStartMins = currentMin;
        const bEndMins = currentMin + breakLen;
        scheduleMins.push({
          type: 'break',
          num: i,
          startMins: bStartMins,
          endMins: bEndMins,
          startStr: minsToTime(bStartMins),
          endStr: minsToTime(bEndMins),
          label: (i === BIG_BREAK_AFTER) ? 'Katta tanaffus' : 'Tanaffus'
        });
        currentMin = bEndMins;
      }
    }
    renderTimeline();
    tick(); 

    // Tanaffus o'rtasida dasturga kirilsa yoki yangilansa, musiqani mos joydan davom ettirish (Sinxronizatsiya)
    const now = new Date();
    const currentMins = now.getHours() * 60 + now.getMinutes();
    const currentSecs = now.getSeconds();
    let activeEv = null;
    for (const ev of scheduleMins) {
      if (currentMins >= ev.startMins && currentMins < ev.endMins) {
        activeEv = ev; break;
      }
    }
    if (activeEv && activeEv.type === 'break' && soundOn) {
      const elapsedSecs = ((currentMins - activeEv.startMins) * 60) + currentSecs;
      if (elapsedSecs >= 16 && elapsedSecs < 300) {
        musicAudio.currentTime = elapsedSecs; // Roppa-rosa o'sha joyidan boshlash
        toggleMusic(true);
        const msLeft = (300 - elapsedSecs) * 1000;
        if (musicTimeout) clearTimeout(musicTimeout);
        musicTimeout = setTimeout(() => { toggleMusic(false); }, msLeft);
      } else if (elapsedSecs < 16) {
        setTimeout(() => {
          if (soundOn) {
            musicAudio.currentTime = 16;
            toggleMusic(true);
            if (musicTimeout) clearTimeout(musicTimeout);
            musicTimeout = setTimeout(() => { toggleMusic(false); }, (300 - 16) * 1000);
          }
        }, (16 - elapsedSecs) * 1000);
      }
    }
  }

  function renderTimeline() {
    timelineEl.innerHTML = '';
    scheduleMins.forEach((ev, idx) => {
      const row = document.createElement('div');
      row.className = 'row' + (ev.type === 'break' ? ' is-break' : '');
      row.id = 'ev-' + idx;

      if (ev.type === 'lesson') {
        row.innerHTML = `
          <div class="done-mark"></div>
          <div class="row-header">
            <span class="label">${ev.label}</span>
            <span class="range">${ev.startStr} - ${ev.endStr}</span>
          </div>
        `;
      } else {
        row.innerHTML = `
          <div class="done-mark"></div>
          <div class="row-header">
            <span class="label">☕ ${ev.label}</span>
            <span class="range">${ev.startStr} - ${ev.endStr}</span>
          </div>
        `;
      }
      timelineEl.appendChild(row);
    });
  }

  function updateTimelineUI(activeEvent) {
    scheduleMins.forEach((ev, idx) => {
      const row = $('ev-' + idx);
      if (!row) return;
      if (activeEvent && ev.startMins === activeEvent.startMins) {
        row.classList.add('is-current');
      } else {
        row.classList.remove('is-current');
      }
    });
  }

  applyBtn.onclick = buildSchedule;

  // Asosiy sikl (Har soniyada)
  function tick() {
    const now = new Date();
    const currentMins = now.getHours() * 60 + now.getMinutes();
    const currentSecs = now.getSeconds();

    timeLabel.textContent = minsToTime(currentMins) + ':' + String(currentSecs).padStart(2, '0');

    let activeEvent = null;
    let nextEvent = null;

    for (let i = 0; i < scheduleMins.length; i++) {
      const ev = scheduleMins[i];
      if (currentMins >= ev.startMins && currentMins < ev.endMins) {
        activeEvent = ev;
        nextEvent = scheduleMins[i+1] || null;
        break;
      } else if (currentMins < ev.startMins) {
        if (!activeEvent) nextEvent = ev;
        break;
      }
    }

    // Qo'ng'iroq chalish mantiqi
    const currentMinStr = minsToTime(currentMins);
    if (currentSecs === 0 && now.getMinutes() !== lastRungMinute) {
      let isBoundary = false;
      let announcement = null;
      
      for (const ev of scheduleMins) {
        if (ev.startStr === currentMinStr) {
          isBoundary = true;
          if (ev.type === 'break') {
            announcement = 'break_start';
          } else if (ev.num > 1) {
            announcement = 'break_end';
          }
        }
      }
      if (scheduleMins.length > 0 && scheduleMins[scheduleMins.length - 1].endStr === currentMinStr) {
        isBoundary = true;
      }

      if (isBoundary) {
        lastRungMinute = now.getMinutes();
        if (soundOn) {
          const myVersion = scheduleVersion;
          playBell();
          
          if (announcement === 'break_start') {
            // 1. Musiqa qo'ng'iroqdan so'ng darhol boshlanadi
            setTimeout(() => {
              if (myVersion !== scheduleVersion) return;
              musicAudio.volume = 1.0; 
              musicAudio.currentTime = 0; 
              toggleMusic(true);
              
              if (musicTimeout) clearTimeout(musicTimeout);
              musicTimeout = setTimeout(() => {
                if (myVersion === scheduleVersion) toggleMusic(false);
              }, 5 * 60 * 1000);
            }, 1000);

            // 2. E'lon boshlanganda musiqani to'xtatib turish (pause)
            setTimeout(() => {
              if (myVersion !== scheduleVersion) return;
              musicAudio.pause();
              $('musicBtn').textContent = '▶ Yoqish';
              breakStartAudio.currentTime = 0;
              breakStartAudio.play().catch(e => console.log(e));
            }, 7500);

            // 3. E'lon tugagach musiqani to'xtagan joyidan davom ettirish
            setTimeout(() => {
              if (myVersion !== scheduleVersion) return;
              if (soundOn && musicTimeout) {
                musicAudio.play().catch(e => console.log(e));
                $('musicBtn').textContent = '⏸ To\'xtatish';
              }
            }, 16000);

          } else if (announcement === 'break_end') {
            // Tanaffus tugasa musiqani to'xtatish
            if (musicTimeout) clearTimeout(musicTimeout);
            toggleMusic(false);

            setTimeout(() => {
              if (myVersion !== scheduleVersion) return;
              breakEndAudio.currentTime = 0;
              breakEndAudio.play().catch(e => console.log(e));
            }, 7500);
          } else {
             // Boshqa barcha holatlarda (1-dars boshlanishi, uyga ketish)
             if (musicTimeout) clearTimeout(musicTimeout);
             toggleMusic(false);
          }
        }
      }
    }

    // UI yangilanishlari
    if (activeEvent) {
      const totalDurationSecs = (activeEvent.endMins - activeEvent.startMins) * 60;
      const elapsedSecs = ((currentMins - activeEvent.startMins) * 60) + currentSecs;
      const remainingSecs = totalDurationSecs - elapsedSecs;

      statusLabel.textContent = activeEvent.label;
      const rM = Math.floor(remainingSecs / 60);
      const rS = remainingSecs % 60;
      subLabel.textContent = `tugashiga ${String(rM).padStart(2, '0')}:${String(rS).padStart(2, '0')} qoldi`;

      // -- Tanaffus tugashiga 10 soniya qolganda ogohlantirish --
      if (activeEvent.type === 'break' && soundOn && remainingSecs <= 10 && remainingSecs > 0) {
        if (lastWarningMinute !== currentMins) {
          lastWarningMinute = currentMins;
          breakWarningAudio.currentTime = 0;
          breakWarningAudio.play().catch(e => console.log(e));
          
          if (musicOn) {
            musicAudio.pause(); // Ogohlantirish eshitilishi uchun musiqani to'xtatib turamiz
            $('musicBtn').textContent = '▶ Yoqish';
            setTimeout(() => {
              if (soundOn && musicOn) {
                musicAudio.play().catch(e => console.log(e));
                $('musicBtn').textContent = '⏸ To\'xtatish';
              }
            }, 6000); // 6 soniyadan so'ng yana davom etadi
          }
        }
      }

      if (nextEvent) {
        nextUp.innerHTML = `Keyingi: <b>${nextEvent.label}</b> (${nextEvent.startStr})`;
      } else {
        nextUp.innerHTML = `Darslar yakunlanmoqda`;
      }

      const progress = elapsedSecs / totalDurationSecs;
      ringProgress.style.strokeDashoffset = Math.max(0, RING_CIRC - (progress * RING_CIRC));
    } else {
      statusLabel.textContent = "Kutilmoqda";
      subLabel.textContent = scheduleMins.length ? "dars vaqti emas" : "jadval kutilmoqda";
      ringProgress.style.strokeDashoffset = RING_CIRC;
      
      if (nextEvent) {
        nextUp.innerHTML = `Keyingi: <b>${nextEvent.label}</b> (${nextEvent.startStr})`;
      } else {
        nextUp.innerHTML = `&nbsp;`;
      }
    }

    updateTimelineUI(activeEvent);
  }

  buildSchedule();
  setInterval(tick, 1000);

})();
