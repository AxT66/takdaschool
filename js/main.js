/**
 * Takdah Grace Academy - Main Interactive Logic (Light Theme)
 * Location: 6th Mile, Naya Busty, Dist. Darjeeling, West Bengal
 * Integrates with window.tgaStore for dynamic fees, facilities, and local storage.
 */

document.addEventListener('DOMContentLoaded', () => {
  if (window.lucide) {
    lucide.createIcons();
  }

  initParticleCanvas();
  initAnimatedCounters();
  syncPublicFeeCalculator();
  initTuitionCalculator();
  initAcademicTabs();
  initFacilityFilter();
  initEventsFilterControls();
  initCampusMapHotspots();
  initModals();
  initMobileMenu();
});

/* ==========================================================================
   1. Toast Notification System (Light Theme)
   ========================================================================== */
function showToast(title, message, type = 'success') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast glass-panel p-4 rounded-xl shadow-xl flex items-start space-x-3 text-slate-800 border max-w-sm backdrop-blur-xl ${
    type === 'success' ? 'border-emerald-300 bg-white/95 text-slate-800' : 'border-amber-300 bg-white/95 text-slate-800'
  }`;

  const iconName = type === 'success' ? 'check-circle-2' : 'info';
  const iconColor = type === 'success' ? 'text-emerald-600' : 'text-amber-600';

  toast.innerHTML = `
    <div class="${iconColor} mt-0.5 flex-shrink-0">
      <i data-lucide="${iconName}" class="w-5 h-5"></i>
    </div>
    <div class="flex-1 text-sm">
      <div class="font-bold text-slate-900">${title}</div>
      <div class="text-slate-600 text-xs mt-0.5 leading-relaxed">${message}</div>
    </div>
    <button class="text-slate-400 hover:text-slate-700 transition ml-2 focus:outline-none" onclick="this.parentElement.remove()">
      <i data-lucide="x" class="w-4 h-4"></i>
    </button>
  `;

  container.appendChild(toast);
  if (window.lucide) lucide.createIcons({ root: toast });

  setTimeout(() => toast.classList.add('show'), 50);

  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 400);
  }, 4500);
}

/* ==========================================================================
   2. Particle Mesh Canvas (Subtle Light Background)
   ========================================================================== */
function initParticleCanvas() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const particles = [];
  const particleCount = Math.min(Math.floor(width / 24), 55);

  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      radius: Math.random() * 2 + 1,
      color: Math.random() > 0.4 ? 'rgba(4, 120, 87, 0.25)' : 'rgba(194, 65, 12, 0.2)'
    });
  }

  function render() {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0 || p.x > width) p.vx *= -1;
      if (p.y < 0 || p.y > height) p.vy *= -1;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.fill();

      for (let j = i + 1; j < particles.length; j++) {
        const p2 = particles[j];
        const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
        if (dist < 120) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(4, 120, 87, ${0.12 * (1 - dist / 120)})`;
          ctx.lineWidth = 0.8;
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(render);
  }
  render();
}

/* ==========================================================================
   3. Animated Counters (Light Theme)
   ========================================================================== */
function initAnimatedCounters() {
  const counters = document.querySelectorAll('.counter-val');
  let started = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !started) {
        started = true;
        counters.forEach(counter => {
          const target = parseFloat(counter.getAttribute('data-target'));
          const prefix = counter.getAttribute('data-prefix') || '';
          const suffix = counter.getAttribute('data-suffix') || '';
          const duration = 2000;
          const startTime = performance.now();

          function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const ease = 1 - Math.pow(1 - progress, 3);
            const current = ease * target;

            counter.innerText = prefix + Math.floor(current).toLocaleString('en-IN') + suffix;

            if (progress < 1) {
              requestAnimationFrame(update);
            } else {
              counter.innerText = prefix + target.toLocaleString('en-IN') + suffix;
            }
          }
          requestAnimationFrame(update);
        });
      }
    });
  }, { threshold: 0.3 });

  const statsSection = document.getElementById('stats-ribbon');
  if (statsSection) observer.observe(statsSection);
}

/* ==========================================================================
   4. Academic Programs Tab System (Light Theme)
   ========================================================================== */
const academicData = {
  nursery: {
    title: "Early Years Foundation (Nursery, LKG, UKG)",
    subtitle: "Ages 3 to 5 Years • Play-Way & Activity Learning",
    description: "Our Early Childhood division introduces little children to the joy of school through loving care, storytelling, phonics, number songs, creative art, and gentle habit formation in the fresh mountain air of Takdah.",
    badge: "Foundational Early Years • Loving Mentorship",
    stats: [
      { label: "Class Ratio", val: "1:15 Ratio" },
      { label: "Focus", val: "Phonics & Numbers" },
      { label: "Languages", val: "English & Rhymes" }
    ],
    features: [
      "Activity-based play-way learning environment with colourful educational toys",
      "Oral English communication, phonics drills, and vocabulary development",
      "Fine motor skills through clay modelling, colouring, paper craft, and rhymes",
      "Gentle habit formation, personal hygiene, courtesy, and moral values"
    ],
    curriculumDoc: "TGA-Nursery-KG-Curriculum.pdf",
    image: "https://images.unsplash.com/photo-1588072432836-e10032774350?auto=format&fit=crop&w=1200&q=80"
  },
  primary: {
    title: "Primary Section (Classes I to V)",
    subtitle: "Ages 6 to 10 Years • Strong Foundational Skills",
    description: "Developing solid competency in reading, writing, mathematical computation, and environmental awareness. Students learn in English medium while developing strong command over Nepali and Hindi languages.",
    badge: "ICSE Primary Continuum • Holistic Learning",
    stats: [
      { label: "Core Subjects", val: "English, Maths, EVS" },
      { label: "Second Language", val: "Nepali / Hindi" },
      { label: "Activity Hours", val: "Art, Sports, Drill" }
    ],
    features: [
      "Structured English grammar, comprehension, handwriting, and spelling mastery",
      "Mental arithmetic, practical math concepts, and word problems",
      "Environmental Studies (EVS) with local Himalayan ecology and botanical tours",
      "Introduction to basic computer fundamentals and keyboard typing skills"
    ],
    curriculumDoc: "TGA-Primary-Curriculum-Class-1-to-5.pdf",
    image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1200&q=80"
  },
  middle: {
    title: "Middle School Section (Classes VI to VIII)",
    subtitle: "Ages 11 to 13 Years • Conceptual Rigor & Discipline",
    description: "Transitioning students into distinct subject disciplines including Physics, Chemistry, Biology, History, Civics, and Geography, laying a sturdy foundation for the ICSE Board examination syllabus.",
    badge: "Pre-ICSE Division • Analytical Growth",
    stats: [
      { label: "Science Branches", val: "Physics, Chem, Bio" },
      { label: "Computer Lab", val: "Practical Coding" },
      { label: "Languages", val: "English, Nepali, Hindi" }
    ],
    features: [
      "Laboratory demonstrations and scientific practical experiments",
      "Indian History, Civics governance, and World Geography map-work",
      "Computer Science with fundamentals of programming logic and office software",
      "Co-curricular debating, elocution, quiz competitions, and school choir"
    ],
    curriculumDoc: "TGA-Middle-School-Curriculum-Class-6-to-8.pdf",
    image: "https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=1200&q=80"
  },
  icse: {
    title: "ICSE Secondary Section (Classes IX & X)",
    subtitle: "Ages 14 to 16 Years • Comprehensive ICSE Board Preparation",
    description: "Preparing students for the prestigious Indian Certificate of Secondary Education (ICSE) Board Examination conducted by CISCE, New Delhi. Guided closely by Principal Mr. Chandan Singh and senior subject faculties.",
    badge: "ICSE Board (CISCE, New Delhi) • 100% Pass Record",
    stats: [
      { label: "Board Pass Rate", val: "100% Target" },
      { label: "Lab Practicals", val: "Full Equipment" },
      { label: "ICSE Subjects", val: "Science & Commerce" }
    ],
    features: [
      "Rigorous preparation strictly aligned with ICSE syllabus and question patterns",
      "Compulsory hands-on Science laboratory practicals (Physics, Chemistry, Biology)",
      "ICSE Computer Applications with hands-on Java OOP programming",
      "Regular unit tests, term exams, diagnostic remedial classes, and full mock pre-boards"
    ],
    curriculumDoc: "TGA-ICSE-Class-9-10-Curriculum-Guide.pdf",
    image: "images/grace-academy-campus.png"
  }
};

function initAcademicTabs() {
  const tabButtons = document.querySelectorAll('.academic-tab-btn');
  const container = document.getElementById('academic-content-container');
  if (!container) return;

  function renderContent(key) {
    const data = academicData[key];
    if (!data) return;

    container.innerHTML = `
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center animate-fadeIn">
        <div class="lg:col-span-7 space-y-6">
          <div class="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-emerald-50 border border-emerald-200 text-emerald-800">
            <i data-lucide="award" class="w-3.5 h-3.5 text-emerald-600"></i>
            <span>${data.badge}</span>
          </div>

          <h3 class="text-3xl sm:text-4xl font-serif-academy font-bold text-slate-900 tracking-tight">
            ${data.title}
          </h3>
          <p class="text-terracotta-dark text-sm font-semibold tracking-wide uppercase">
            ${data.subtitle}
          </p>
          <p class="text-slate-600 leading-relaxed text-base">
            ${data.description}
          </p>

          <div class="grid grid-cols-3 gap-3 pt-2">
            ${data.stats.map(s => `
              <div class="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-center">
                <div class="text-base sm:text-lg font-bold text-slate-900 font-serif-academy">${s.val}</div>
                <div class="text-[11px] text-slate-500 uppercase tracking-wider mt-1">${s.label}</div>
              </div>
            `).join('')}
          </div>

          <div class="space-y-2.5 pt-2">
            <h4 class="text-xs uppercase font-bold text-slate-500 tracking-wider">Curricular Highlights</h4>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              ${data.features.map(f => `
                <div class="flex items-start space-x-2 text-sm text-slate-700">
                  <i data-lucide="check-circle-2" class="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5"></i>
                  <span>${f}</span>
                </div>
              `).join('')}
            </div>
          </div>

          <div class="pt-4 flex flex-wrap gap-4 items-center">
            <button onclick="openCurriculumModal('${data.title}', '${data.curriculumDoc}')" class="px-5 py-2.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-sm flex items-center space-x-2 transition shadow-md shadow-emerald-700/20">
              <i data-lucide="file-text" class="w-4 h-4"></i>
              <span>Download Syllabus Guide</span>
            </button>
            <button onclick="openInquiryModal('${data.title}')" class="px-5 py-2.5 rounded-lg border border-slate-300 hover:border-emerald-600 text-slate-700 hover:text-emerald-700 font-semibold text-sm flex items-center space-x-2 transition bg-white">
              <i data-lucide="calendar-plus" class="w-4 h-4 text-emerald-600"></i>
              <span>Inquire for Admission</span>
            </button>
          </div>
        </div>

        <div class="lg:col-span-5">
          <div class="relative group rounded-2xl overflow-hidden border border-slate-200 shadow-xl bg-white">
            <img src="${data.image}" alt="${data.title}" class="w-full h-[380px] object-cover group-hover:scale-105 transition duration-700">
            <div class="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent"></div>
            <div class="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md p-4 rounded-xl border border-slate-200 shadow-lg">
              <div class="flex items-center justify-between">
                <div>
                  <span class="text-xs text-emerald-700 font-bold uppercase tracking-wider">Takdah Grace Academy</span>
                  <div class="text-sm font-bold text-slate-900">6th Mile, Naya Busty, Darjeeling</div>
                </div>
                <div class="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <i data-lucide="book-open" class="w-5 h-5"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    if (window.lucide) lucide.createIcons({ root: container });
  }

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      tabButtons.forEach(b => {
        b.classList.remove('bg-emerald-700', 'text-white', 'shadow-md', 'shadow-emerald-700/25');
        b.classList.add('bg-white', 'text-slate-700', 'hover:bg-slate-100', 'border', 'border-slate-200');
      });
      btn.classList.remove('bg-white', 'text-slate-700', 'hover:bg-slate-100', 'border', 'border-slate-200');
      btn.classList.add('bg-emerald-700', 'text-white', 'shadow-md', 'shadow-emerald-700/25');

      const target = btn.getAttribute('data-tab');
      renderContent(target);
    });
  });

  renderContent('icse');
}

/* ==========================================================================
   5. Dynamic Public Fee Calculator (Syncs with tgaStore.getFees())
   ========================================================================== */
function syncPublicFeeCalculator() {
  if (!window.tgaStore) return;
  const fees = window.tgaStore.getFees();

  const gradeSelect = document.getElementById('calc-grade');
  const boardingSelect = document.getElementById('calc-boarding');
  const mealsSelect = document.getElementById('calc-meals');
  const transportLabel = document.getElementById('calc-transport-label');
  const coachingLabel = document.getElementById('calc-coaching-label');

  if (gradeSelect) {
    const currentVal = gradeSelect.value;
    gradeSelect.innerHTML = `
      <option value="${fees.nursery}">Class Nursery, LKG & UKG — ₹${fees.nursery.toLocaleString('en-IN')}/yr (₹${Math.round(fees.nursery/12).toLocaleString('en-IN')}/mo)</option>
      <option value="${fees.primary}">Primary Section (Classes I - V) — ₹${fees.primary.toLocaleString('en-IN')}/yr (₹${Math.round(fees.primary/12).toLocaleString('en-IN')}/mo)</option>
      <option value="${fees.middle}">Middle School (Classes VI - VIII) — ₹${fees.middle.toLocaleString('en-IN')}/yr (₹${Math.round(fees.middle/12).toLocaleString('en-IN')}/mo)</option>
      <option value="${fees.icse}" selected>ICSE Secondary (Classes IX - X) — ₹${fees.icse.toLocaleString('en-IN')}/yr (₹${Math.round(fees.icse/12).toLocaleString('en-IN')}/mo)</option>
    `;
    // Retain selection if valid
    if ([fees.nursery, fees.primary, fees.middle, fees.icse].map(String).includes(currentVal)) {
      gradeSelect.value = currentVal;
    }
  }

  if (boardingSelect) {
    boardingSelect.innerHTML = `
      <option value="0" selected>Day Scholar — ₹0</option>
      <option value="${fees.hostelWeekly}">Weekly Hostel (Mon - Fri) — +₹${fees.hostelWeekly.toLocaleString('en-IN')}/yr</option>
      <option value="${fees.hostelFull}">Full Residential Boarder — +₹${fees.hostelFull.toLocaleString('en-IN')}/yr</option>
    `;
  }

  if (mealsSelect) {
    mealsSelect.innerHTML = `
      <option value="0" selected>Home Packed Tiffin — ₹0</option>
      <option value="${fees.lunch}">School Fresh Hot Lunch — ₹${fees.lunch.toLocaleString('en-IN')}/yr</option>
      <option value="0">Hostel Meals (Included in Boarding)</option>
    `;
  }

  if (transportLabel) {
    transportLabel.innerText = `School Van / Bus Service (+₹${fees.transport.toLocaleString('en-IN')}/yr)`;
  }
  if (coachingLabel) {
    coachingLabel.innerText = `Special ICSE Coaching (+₹${fees.coaching.toLocaleString('en-IN')}/yr)`;
  }
}

function initTuitionCalculator() {
  const gradeSelect = document.getElementById('calc-grade');
  const boardingSelect = document.getElementById('calc-boarding');
  const scholarshipSlider = document.getElementById('calc-scholarship');
  const transportCheckbox = document.getElementById('calc-transport');
  const mealsSelect = document.getElementById('calc-meals');
  const clubsCheckbox = document.getElementById('calc-clubs');

  const outBase = document.getElementById('out-base');
  const outDiscount = document.getElementById('out-discount');
  const outBoarding = document.getElementById('out-boarding');
  const outAddons = document.getElementById('out-addons');
  const outTotal = document.getElementById('out-total');
  const outTerm = document.getElementById('out-term');
  const outMonthly = document.getElementById('out-monthly');
  const scholarshipValDisplay = document.getElementById('scholarship-pct-display');

  if (!gradeSelect || !outTotal) return;

  function calculate() {
    const fees = window.tgaStore ? window.tgaStore.getFees() : { transport: 9600, coaching: 4800 };
    const baseTuition = parseInt(gradeSelect.value, 10) || 36000;
    const boardingFee = parseInt(boardingSelect.value, 10) || 0;
    const mealFee = parseInt(mealsSelect.value, 10) || 0;
    const scholarshipPct = parseInt(scholarshipSlider.value, 10) || 0;

    let addonsFee = mealFee;
    if (transportCheckbox && transportCheckbox.checked) addonsFee += (fees.transport || 9600);
    if (clubsCheckbox && clubsCheckbox.checked) addonsFee += (fees.coaching || 4800);

    const discountAmount = Math.round((baseTuition * scholarshipPct) / 100);
    const netTuition = baseTuition - discountAmount;
    const finalTotal = netTuition + boardingFee + addonsFee;
    const termFee = Math.round(finalTotal / 4);
    const monthlyFee = Math.round(finalTotal / 12);

    if (scholarshipValDisplay) scholarshipValDisplay.innerText = `${scholarshipPct}%`;
    if (outBase) outBase.innerText = `₹${baseTuition.toLocaleString('en-IN')}`;
    if (outDiscount) outDiscount.innerText = `-₹${discountAmount.toLocaleString('en-IN')}`;
    if (outBoarding) outBoarding.innerText = `₹${boardingFee.toLocaleString('en-IN')}`;
    if (outAddons) outAddons.innerText = `₹${addonsFee.toLocaleString('en-IN')}`;
    if (outTotal) outTotal.innerText = `₹${finalTotal.toLocaleString('en-IN')}`;
    if (outTerm) outTerm.innerText = `₹${termFee.toLocaleString('en-IN')}`;
    if (outMonthly) outMonthly.innerText = `₹${monthlyFee.toLocaleString('en-IN')}`;
  }

  const inputs = [gradeSelect, boardingSelect, scholarshipSlider, transportCheckbox, mealsSelect, clubsCheckbox];
  inputs.forEach(input => {
    if (input) {
      input.addEventListener('input', calculate);
      input.addEventListener('change', calculate);
    }
  });

  calculate();
}

window.saveLocalFeeQuote = function() {
  const grade = document.getElementById('calc-grade')?.selectedOptions[0]?.text || '';
  const total = document.getElementById('out-total')?.innerText || '₹0';
  const term = document.getElementById('out-term')?.innerText || '₹0';
  const monthly = document.getElementById('out-monthly')?.innerText || '₹0';

  if (!window.tgaStore) return;
  const quote = window.tgaStore.saveQuote({
    grade,
    annualTotal: total,
    termInstallment: term,
    monthlyInstallment: monthly
  });

  showToast('Fee Quotation Saved!', `Quotation ${quote.id} (${total}/yr) is stored in your local browser profile.`, 'success');
};

/* ==========================================================================
   6. Facilities Filter
   ========================================================================== */
function initFacilityFilter() {
  const filterBtns = document.querySelectorAll('.facility-filter-btn');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => {
        b.classList.remove('bg-forest-700', 'text-white', 'shadow-sm');
        b.classList.add('bg-white', 'text-slate-700', 'border', 'border-slate-200');
      });
      btn.classList.add('bg-forest-700', 'text-white', 'shadow-sm');
      btn.classList.remove('bg-white', 'text-slate-700', 'border', 'border-slate-200');

      const filter = btn.getAttribute('data-filter');
      if (typeof renderPublicFacilities === 'function') {
        renderPublicFacilities(filter);
      }
    });
  });
}

/* ==========================================================================
   7. Events Filter Controls
   ========================================================================== */
function initEventsFilterControls() {
  const filterBtns = document.querySelectorAll('.event-filter-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => {
        b.classList.remove('bg-forest-700', 'text-white', 'shadow-sm');
        b.classList.add('bg-white', 'text-slate-700', 'border', 'border-slate-200');
      });
      btn.classList.add('bg-forest-700', 'text-white', 'shadow-sm');
      btn.classList.remove('bg-white', 'text-slate-700', 'border', 'border-slate-200');

      const filter = btn.getAttribute('data-filter');
      if (typeof renderPublicEvents === 'function') {
        renderPublicEvents(filter);
      }
    });
  });
}

/* ==========================================================================
   8. Campus Map Hotspots (Light Theme)
   ========================================================================== */
const campusHotspots = {
  1: {
    name: "Main Academic Building",
    area: "6th Mile Campus Front",
    specs: "Distinctive terracotta 2-storey block with green Grace Academy roof-sign and classrooms from Nursery to Class X",
    director: "Mr. Chandan Singh, Principal",
    img: "images/grace-academy-campus.png"
  },
  2: {
    name: "ICSE Science & Computer Laboratory",
    area: "East Academic Wing",
    specs: "Fully equipped Physics, Chemistry, Biology demonstration benches & 1:1 Computer Terminals",
    director: "Head of Science Faculty",
    img: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=600&q=80"
  },
  3: {
    name: "Mount View Assembly Ground",
    area: "South Hillside Terrace",
    specs: "Morning assembly, drill ground, football, badminton, and outdoor sports arena",
    director: "Physical Education Master",
    img: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=600&q=80"
  },
  4: {
    name: "Administrative Office",
    area: "Main Entrance",
    specs: "Director Mr. Bhupen Dukpa and Principal Mr. Chandan Singh Chambers, Fee & Admission Counter",
    director: "Mr. Bhupen Dukpa, Director",
    img: "images/grace-academy-campus.png"
  },
  5: {
    name: "Grace Residential Hostel & Dining Hall",
    area: "Upper Pine Ridge",
    specs: "Comfortable dormitories for outstation students, hot meals, 24/7 warden supervision",
    director: "Hostel Warden & Matron",
    img: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=600&q=80"
  }
};

function initCampusMapHotspots() {
  const pins = document.querySelectorAll('.map-pin');
  const infoCard = document.getElementById('map-pin-detail');
  if (!infoCard) return;

  pins.forEach(pin => {
    pin.addEventListener('click', () => {
      pins.forEach(p => p.classList.remove('active'));
      pin.classList.add('active');

      const id = pin.getAttribute('data-id');
      const data = campusHotspots[id];
      if (!data) return;

      infoCard.innerHTML = `
        <div class="flex flex-col sm:flex-row gap-4 items-center animate-fadeIn">
          <img src="${data.img}" alt="${data.name}" class="w-full sm:w-36 h-28 object-cover rounded-xl border border-slate-200 shadow-sm">
          <div class="flex-1 space-y-1.5 text-left">
            <span class="inline-block px-2.5 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
              ${data.area}
            </span>
            <h4 class="text-lg font-bold text-slate-900 font-serif-academy">${data.name}</h4>
            <p class="text-xs text-slate-600 leading-relaxed">${data.specs}</p>
            <div class="text-[11px] text-emerald-700 flex items-center space-x-1.5 pt-1">
              <i data-lucide="user-check" class="w-3.5 h-3.5"></i>
              <span>Faculty in Charge: <strong>${data.director}</strong></span>
            </div>
          </div>
        </div>
      `;

      if (window.lucide) lucide.createIcons({ root: infoCard });
    });
  });
}

/* ==========================================================================
   9. Modals & Application Submission (Saved directly to localStorage)
   ========================================================================== */
function initModals() {
  const inquiryForm = document.getElementById('inquiry-form');
  if (inquiryForm) {
    inquiryForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const studentName = document.getElementById('inquiry-student-name').value;
      const grade = document.getElementById('inquiry-grade').value;
      const parentName = document.getElementById('inquiry-parent-name')?.value || 'Parent';
      const mobile = document.getElementById('inquiry-mobile')?.value || '';
      const location = document.getElementById('inquiry-location')?.value || '';
      const admissionType = document.getElementById('inquiry-admission-type')?.value || 'Day Scholar';
      const notes = document.getElementById('inquiry-notes')?.value || '';

      const newApp = window.tgaStore.addApplication({
        studentName,
        grade,
        parentName,
        mobile,
        location,
        admissionType,
        notes
      });

      closeModal('inquiry-modal');
      inquiryForm.reset();

      showToast(
        'Application Saved Locally!',
        `Reference ID: ${newApp.id} for ${newApp.studentName} (${newApp.grade}). Use "Track Application" to view real-time status.`,
        'success'
      );

      if (typeof renderAdminApplicationsTable === 'function') {
        renderAdminApplicationsTable();
      }
      if (typeof renderStorageMetrics === 'function') {
        renderStorageMetrics();
      }
    });
  }

  const newsletterForm = document.getElementById('newsletter-form');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const contact = document.getElementById('newsletter-email').value;
      newsletterForm.reset();
      showToast('Subscribed to Notices!', `Takdah Grace Academy circulars will be sent to ${contact}.`, 'success');
    });
  }
}

window.openModal = function(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
};

window.closeModal = function(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }
};

window.openInquiryModal = function(prefillProgram = '') {
  if (prefillProgram) {
    const noteField = document.getElementById('inquiry-notes');
    if (noteField) noteField.value = `Interested in: ${prefillProgram}`;
  }
  openModal('inquiry-modal');
};

window.openCurriculumModal = function(title, fileName) {
  const titleEl = document.getElementById('curriculum-modal-title');
  const fileEl = document.getElementById('curriculum-modal-filename');
  if (titleEl) titleEl.innerText = title;
  if (fileEl) fileEl.innerText = fileName;
  openModal('curriculum-modal');
};

window.downloadCurriculumFile = function() {
  const fileName = document.getElementById('curriculum-modal-filename')?.innerText || 'TGA-Curriculum-Guide.pdf';
  closeModal('curriculum-modal');
  showToast('Download Started', `Downloading official ${fileName} for Takdah Grace Academy...`, 'success');
};

window.rsvpEvent = function(eventName, eventDate) {
  showToast('Registration Confirmed', `You are registered for "${eventName}" on ${eventDate} at Takdah Grace Academy campus.`, 'success');
};

window.downloadTuitionEstimate = function() {
  const total = document.getElementById('out-total')?.innerText || '₹32,400';
  const grade = document.getElementById('calc-grade')?.selectedOptions[0]?.text || 'Class Selected';
  showToast('Fee Structure Downloaded', `Fee estimate for ${grade} (${total}) saved to your device.`, 'success');
};

/* ==========================================================================
   10. Mobile Menu Toggle
   ========================================================================== */
function initMobileMenu() {
  const toggleBtn = document.getElementById('mobile-menu-btn');
  const mobileDrawer = document.getElementById('mobile-menu-drawer');
  const closeBtn = document.getElementById('mobile-menu-close');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  if (!toggleBtn || !mobileDrawer) return;

  function toggle() {
    mobileDrawer.classList.toggle('hidden');
    document.body.style.overflow = mobileDrawer.classList.contains('hidden') ? '' : 'hidden';
  }

  toggleBtn.addEventListener('click', toggle);
  if (closeBtn) closeBtn.addEventListener('click', toggle);

  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      mobileDrawer.classList.add('hidden');
      document.body.style.overflow = '';
    });
  });
}
