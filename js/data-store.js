/**
 * Takdah Grace Academy - Local Data Store Layer
 * Handles all client-side persistent storage via HTML5 localStorage.
 * No external database required - all data persists in the user's browser.
 * Includes Fees management, Facilities CRUD, and Photo Gallery with client-side image compression.
 */

const TGA_STORAGE_KEYS = {
  NOTICES: 'tga_local_notices_v1',
  EVENTS: 'tga_local_events_v1',
  APPLICATIONS: 'tga_local_applications_v1',
  QUOTES: 'tga_local_fee_quotes_v1',
  FEES: 'tga_local_fees_v1',
  FACILITIES: 'tga_local_facilities_v1',
  GALLERY: 'tga_local_gallery_v1'
};

// Initial Seed Data
const TGA_INITIAL_SEEDS = {
  fees: {
    nursery: 18000,
    primary: 24000,
    middle: 30000,
    icse: 36000,
    hostelWeekly: 42000,
    hostelFull: 60000,
    transport: 9600,
    lunch: 6000,
    coaching: 4800,
    admissionFee: 5000
  },

  facilities: [
    {
      id: 'fac-1',
      title: 'Main 2-Storey Academic Block',
      category: 'campus',
      specs: 'Nursery to Class X Classrooms',
      badge: 'Main Building',
      image: 'images/grace-academy-campus.png',
      description: 'Terracotta & white facade with prominent green Grace Academy roof-sign, spacious classrooms, covered waiting area, and front assembly courtyard.'
    },
    {
      id: 'fac-2',
      title: 'Composite Science Laboratory',
      category: 'labs',
      specs: 'Classes VI - X',
      badge: 'ICSE Practical Lab',
      image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=800&q=80',
      description: 'Equipped with modern apparatus for Physics, Chemistry, and Biology experiments per CISCE / ICSE board curriculum guidelines.'
    },
    {
      id: 'fac-3',
      title: 'Modern Computer & IT Suite',
      category: 'labs',
      specs: '1:1 Terminal Access',
      badge: 'IT Education',
      image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80',
      description: 'Dedicated workstation terminals for every student covering ICSE Computer Applications (Java), office tools, and digital literacy.'
    },
    {
      id: 'fac-4',
      title: 'Mount View Sports & Assembly Ground',
      category: 'sports',
      specs: 'Morning Drills & Football',
      badge: 'Outdoor Athletics',
      image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=800&q=80',
      description: 'Spacious open-air playground for morning prayers, drill exercises, football, volleyball, badminton, and annual sports events.'
    },
    {
      id: 'fac-5',
      title: 'Academy Library & Study Hall',
      category: 'campus',
      specs: '3,000+ Titles',
      badge: 'Library',
      image: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=800&q=80',
      description: 'Extensive collection of ICSE reference guides, storybooks, regional history, encyclopedias, and periodicals in English, Nepali, and Hindi.'
    },
    {
      id: 'fac-6',
      title: 'Grace Residential Hostel & Dining',
      category: 'campus',
      specs: 'Boys & Girls Dorms',
      badge: 'Hostel Facility',
      image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80',
      description: 'Safe, supervised dormitory accommodations with warden care, warm water, home-cooked nutritious meals, and disciplined evening study hours.'
    }
  ],

  gallery: [
    {
      id: 'gal-1',
      title: 'Grace Academy Main Campus Building',
      category: 'Campus',
      date: '2026-11-01',
      image: 'images/grace-academy-campus.png',
      caption: 'Main 2-storey terracotta building with green roof-sign and covered front waiting shed at 6th Mile, Naya Busty.'
    },
    {
      id: 'gal-2',
      title: 'Students During Morning Assembly',
      category: 'Activities',
      date: '2026-10-25',
      image: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80',
      caption: 'Discipline and moral values nurtured through daily morning prayers in the crisp hill air.'
    },
    {
      id: 'gal-3',
      title: 'Science Practical Demonstration',
      category: 'Academics',
      date: '2026-10-15',
      image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=800&q=80',
      caption: 'Hands-on chemistry and physics experiments for ICSE secondary students.'
    },
    {
      id: 'gal-4',
      title: 'Hill Sports & Physical Training',
      category: 'Sports',
      date: '2026-10-08',
      image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=800&q=80',
      caption: 'Outdoor team sports on the hillside terrace playground.'
    }
  ],

  notices: [
    {
      id: 'ntc-101',
      title: 'Admissions Open for Class Nursery to Class X (Academic Session 2026-27)',
      category: 'Admissions',
      date: '2026-11-10',
      urgent: true,
      content: 'Application forms for Class Nursery, LKG, UKG, Primary, Middle School, and ICSE Secondary (Classes IX & X) are now being accepted at the 6th Mile office or online through this portal.',
      author: 'Office of the Director'
    },
    {
      id: 'ntc-102',
      title: 'CISCE / ICSE Board Examination 2027 Registration Schedule',
      category: 'Academic',
      date: '2026-11-20',
      urgent: false,
      content: 'Class IX students must submit birth certificates, passport photographs, and previous mark sheets for CISCE online registration by December 15.',
      author: 'Mr. Chandan Singh, Principal'
    },
    {
      id: 'ntc-103',
      title: 'Annual Hill Sports & Athletics Meet at 6th Mile Naya Busty Ground',
      category: 'Sports',
      date: '2026-12-01',
      urgent: false,
      content: 'House captains for Kanchenjunga, Everest, Lhotse, and Makalu houses are requested to submit team rosters for the annual sports events by next Friday.',
      author: 'Sports Committee'
    },
    {
      id: 'ntc-104',
      title: 'Winter Uniform & School Bus Route Re-alignment for Takdah & Rangliot',
      category: 'General',
      date: '2026-12-15',
      urgent: false,
      content: 'School winter blazers and pullovers are available at the accounts office. Van timings for Tinchuley and Rangliot have been updated for the winter season.',
      author: 'Transport & Administration'
    }
  ],

  events: [
    {
      id: 'evt-201',
      title: 'Admission Registration & Campus Tour for New Parents',
      date: '2026-12-05',
      month: 'DEC',
      day: '05',
      time: '10:00 AM – 2:00 PM',
      category: 'admissions',
      location: 'Administrative Wing, 6th Mile',
      description: 'Open interaction with Director Mr. Bhupen Dukpa and Principal Mr. Chandan Singh for families seeking admission from Nursery to Class X.',
      rsvps: 24
    },
    {
      id: 'evt-202',
      title: 'Annual Takdah Grace Academy Hill Sports Day',
      date: '2026-12-18',
      month: 'DEC',
      day: '18',
      time: '9:30 AM Onwards',
      category: 'sports',
      location: '6th Mile Naya Busty Ground',
      description: 'Track events, inter-house relays, march past, and physical drill demonstrations by students across all divisions.',
      rsvps: 68
    },
    {
      id: 'evt-203',
      title: 'ICSE Board Preparation & Parents Strategy Conclave',
      date: '2027-01-10',
      month: 'JAN',
      day: '10',
      time: '11:00 AM – 1:30 PM',
      category: 'academic',
      location: 'Main Academic Hall',
      description: 'Mandatory orientation and diagnostic review for Class IX and X parents addressing the 2027 ICSE exam syllabus and practical schedules.',
      rsvps: 42
    }
  ],

  applications: [
    {
      id: 'TGA-2026-1042',
      studentName: 'Aryan Tamang',
      grade: 'Class IX (ICSE)',
      parentName: 'Ramesh Tamang',
      mobile: '+91 98320 11223',
      location: '6th Mile, Naya Busty',
      admissionType: 'Day Scholar',
      notes: 'Interested in ICSE Science with Computer Applications (Java). Transport required from 6th Mile junction.',
      appliedAt: '2026-11-01T09:30:00.000Z',
      status: 'Approved',
      adminRemarks: 'Documents verified by Principal Mr. Chandan Singh. Admission confirmed for Academic Year 2026-27.'
    },
    {
      id: 'TGA-2026-1088',
      studentName: 'Prerana Dukpa',
      grade: 'Class Nursery',
      parentName: 'Bikash Dukpa',
      mobile: '+91 94340 55678',
      location: 'Takdah Cantonment',
      admissionType: 'Day Scholar',
      notes: 'Child is 3.5 years old. Energetic and eager to join play-way nursery.',
      appliedAt: '2026-11-02T14:15:00.000Z',
      status: 'Interview Scheduled',
      adminRemarks: 'Interaction scheduled on Dec 05 at 11:30 AM with Early Childhood in-charge.'
    },
    {
      id: 'TGA-2026-1120',
      studentName: 'Rohan Chhetri',
      grade: 'Class VI (Middle)',
      parentName: 'Maya Chhetri',
      mobile: '+91 98001 99283',
      location: 'Rangliot Tea Estate',
      admissionType: 'Hostel / Boarder',
      notes: 'Seeking boarding accommodation with school lunch. Transferring from primary school.',
      appliedAt: '2026-11-03T08:45:00.000Z',
      status: 'Under Review',
      adminRemarks: 'Transfer certificate awaited from previous school.'
    }
  ]
};

class TGADataStore {
  constructor() {
    this.init();
  }

  init() {
    if (!localStorage.getItem(TGA_STORAGE_KEYS.NOTICES)) {
      localStorage.setItem(TGA_STORAGE_KEYS.NOTICES, JSON.stringify(TGA_INITIAL_SEEDS.notices));
    }
    if (!localStorage.getItem(TGA_STORAGE_KEYS.EVENTS)) {
      localStorage.setItem(TGA_STORAGE_KEYS.EVENTS, JSON.stringify(TGA_INITIAL_SEEDS.events));
    }
    if (!localStorage.getItem(TGA_STORAGE_KEYS.APPLICATIONS)) {
      localStorage.setItem(TGA_STORAGE_KEYS.APPLICATIONS, JSON.stringify(TGA_INITIAL_SEEDS.applications));
    }
    if (!localStorage.getItem(TGA_STORAGE_KEYS.FEES)) {
      localStorage.setItem(TGA_STORAGE_KEYS.FEES, JSON.stringify(TGA_INITIAL_SEEDS.fees));
    }
    if (!localStorage.getItem(TGA_STORAGE_KEYS.FACILITIES)) {
      localStorage.setItem(TGA_STORAGE_KEYS.FACILITIES, JSON.stringify(TGA_INITIAL_SEEDS.facilities));
    }
    if (!localStorage.getItem(TGA_STORAGE_KEYS.GALLERY)) {
      localStorage.setItem(TGA_STORAGE_KEYS.GALLERY, JSON.stringify(TGA_INITIAL_SEEDS.gallery));
    }
    if (!localStorage.getItem(TGA_STORAGE_KEYS.QUOTES)) {
      localStorage.setItem(TGA_STORAGE_KEYS.QUOTES, JSON.stringify([]));
    }
  }

  // --- FEES MANAGEMENT ---
  getFees() {
    try {
      const data = localStorage.getItem(TGA_STORAGE_KEYS.FEES);
      return data ? JSON.parse(data) : TGA_INITIAL_SEEDS.fees;
    } catch (e) {
      return TGA_INITIAL_SEEDS.fees;
    }
  }

  updateFees(newFees) {
    const current = this.getFees();
    const updated = { ...current, ...newFees };
    localStorage.setItem(TGA_STORAGE_KEYS.FEES, JSON.stringify(updated));
    return updated;
  }

  // --- FACILITIES MANAGEMENT ---
  getFacilities() {
    try {
      const data = localStorage.getItem(TGA_STORAGE_KEYS.FACILITIES);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  }

  addFacility(facility) {
    const facilities = this.getFacilities();
    const newFacility = {
      id: 'fac-' + Date.now().toString(36),
      title: facility.title.trim(),
      category: facility.category || 'campus',
      specs: facility.specs ? facility.specs.trim() : 'Campus Facility',
      badge: facility.badge ? facility.badge.trim() : 'Facility',
      image: facility.image || 'images/grace-academy-campus.png',
      description: facility.description.trim()
    };
    facilities.push(newFacility);
    localStorage.setItem(TGA_STORAGE_KEYS.FACILITIES, JSON.stringify(facilities));
    return newFacility;
  }

  updateFacility(id, updatedFields) {
    const facilities = this.getFacilities();
    const index = facilities.findIndex(f => f.id === id);
    if (index !== -1) {
      facilities[index] = { ...facilities[index], ...updatedFields };
      localStorage.setItem(TGA_STORAGE_KEYS.FACILITIES, JSON.stringify(facilities));
      return facilities[index];
    }
    return null;
  }

  deleteFacility(id) {
    let facilities = this.getFacilities();
    facilities = facilities.filter(f => f.id !== id);
    localStorage.setItem(TGA_STORAGE_KEYS.FACILITIES, JSON.stringify(facilities));
  }

  // --- PHOTO GALLERY & PICTURE UPLOADS ---
  getGallery() {
    try {
      const data = localStorage.getItem(TGA_STORAGE_KEYS.GALLERY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  }

  addGalleryImage(item) {
    const gallery = this.getGallery();
    const newImage = {
      id: 'gal-' + Date.now().toString(36),
      title: item.title.trim() || 'Grace Academy Campus',
      category: item.category || 'Campus',
      date: item.date || new Date().toISOString().split('T')[0],
      image: item.image, // Base64 data URL or relative URL
      caption: item.caption ? item.caption.trim() : ''
    };
    gallery.unshift(newImage);
    localStorage.setItem(TGA_STORAGE_KEYS.GALLERY, JSON.stringify(gallery));
    return newImage;
  }

  deleteGalleryImage(id) {
    let gallery = this.getGallery();
    gallery = gallery.filter(g => g.id !== id);
    localStorage.setItem(TGA_STORAGE_KEYS.GALLERY, JSON.stringify(gallery));
  }

  // --- NOTICES ---
  getNotices() {
    try {
      const data = localStorage.getItem(TGA_STORAGE_KEYS.NOTICES);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  }

  addNotice(notice) {
    const notices = this.getNotices();
    const newNotice = {
      id: 'ntc-' + Date.now().toString(36),
      title: notice.title || 'School Notice',
      category: notice.category || 'General',
      date: notice.date || new Date().toISOString().split('T')[0],
      urgent: !!notice.urgent,
      content: notice.content || '',
      author: notice.author || 'Takdah Grace Academy Administration'
    };
    notices.unshift(newNotice);
    localStorage.setItem(TGA_STORAGE_KEYS.NOTICES, JSON.stringify(notices));
    return newNotice;
  }

  deleteNotice(id) {
    let notices = this.getNotices();
    notices = notices.filter(n => n.id !== id);
    localStorage.setItem(TGA_STORAGE_KEYS.NOTICES, JSON.stringify(notices));
  }

  // --- EVENTS ---
  getEvents() {
    try {
      const data = localStorage.getItem(TGA_STORAGE_KEYS.EVENTS);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  }

  addEvent(event) {
    const events = this.getEvents();
    const dateObj = new Date(event.date || Date.now());
    const month = dateObj.toLocaleString('en-US', { month: 'short' }).toUpperCase();
    const day = String(dateObj.getDate()).padStart(2, '0');

    const newEvent = {
      id: 'evt-' + Date.now().toString(36),
      title: event.title || 'School Event',
      date: event.date,
      month: month,
      day: day,
      time: event.time || '10:00 AM',
      category: event.category || 'academic',
      location: event.location || 'Takdah Grace Academy Campus',
      description: event.description || '',
      rsvps: 1
    };
    events.push(newEvent);
    localStorage.setItem(TGA_STORAGE_KEYS.EVENTS, JSON.stringify(events));
    return newEvent;
  }

  deleteEvent(id) {
    let events = this.getEvents();
    events = events.filter(e => e.id !== id);
    localStorage.setItem(TGA_STORAGE_KEYS.EVENTS, JSON.stringify(events));
  }

  incrementEventRSVP(id) {
    const events = this.getEvents();
    const event = events.find(e => e.id === id);
    if (event) {
      event.rsvps = (event.rsvps || 0) + 1;
      localStorage.setItem(TGA_STORAGE_KEYS.EVENTS, JSON.stringify(events));
      return event.rsvps;
    }
    return 0;
  }

  // --- APPLICATIONS ---
  getApplications() {
    try {
      const data = localStorage.getItem(TGA_STORAGE_KEYS.APPLICATIONS);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  }

  addApplication(app) {
    const applications = this.getApplications();
    const randomCode = Math.floor(1000 + Math.random() * 9000);
    const newApp = {
      id: `TGA-2026-${randomCode}`,
      studentName: app.studentName.trim(),
      grade: app.grade,
      parentName: app.parentName.trim(),
      mobile: app.mobile.trim(),
      location: app.location ? app.location.trim() : 'Takdah / 6th Mile',
      admissionType: app.admissionType || 'Day Scholar',
      notes: app.notes ? app.notes.trim() : '',
      appliedAt: new Date().toISOString(),
      status: 'Pending Review',
      adminRemarks: 'Application received online. Under preliminary review by the admissions desk.'
    };
    applications.unshift(newApp);
    localStorage.setItem(TGA_STORAGE_KEYS.APPLICATIONS, JSON.stringify(applications));
    return newApp;
  }

  updateApplicationStatus(id, newStatus, adminRemarks = '') {
    const applications = this.getApplications();
    const app = applications.find(a => a.id === id);
    if (app) {
      app.status = newStatus;
      if (adminRemarks) app.adminRemarks = adminRemarks;
      app.updatedAt = new Date().toISOString();
      localStorage.setItem(TGA_STORAGE_KEYS.APPLICATIONS, JSON.stringify(applications));
      return app;
    }
    return null;
  }

  deleteApplication(id) {
    let applications = this.getApplications();
    applications = applications.filter(a => a.id !== id);
    localStorage.setItem(TGA_STORAGE_KEYS.APPLICATIONS, JSON.stringify(applications));
  }

  getApplicationByRef(ref) {
    if (!ref) return null;
    const cleanRef = ref.trim().toUpperCase();
    const applications = this.getApplications();
    return applications.find(a => 
      a.id.toUpperCase() === cleanRef || 
      (a.mobile && a.mobile.replace(/\D/g, '').endsWith(cleanRef.replace(/\D/g, '')))
    ) || null;
  }

  // --- FEE QUOTES ---
  getQuotes() {
    try {
      const data = localStorage.getItem(TGA_STORAGE_KEYS.QUOTES);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  }

  saveQuote(quote) {
    const quotes = this.getQuotes();
    const newQuote = {
      id: 'QT-' + Date.now().toString(36).toUpperCase(),
      createdAt: new Date().toISOString(),
      ...quote
    };
    quotes.unshift(newQuote);
    localStorage.setItem(TGA_STORAGE_KEYS.QUOTES, JSON.stringify(quotes));
    return newQuote;
  }

  // --- BACKUP & RESTORE ---
  exportAllDataJSON() {
    const backup = {
      version: '2.0',
      exportedAt: new Date().toISOString(),
      institution: 'Takdah Grace Academy (6th Mile, Naya Busty, Darjeeling)',
      fees: this.getFees(),
      facilities: this.getFacilities(),
      gallery: this.getGallery(),
      notices: this.getNotices(),
      events: this.getEvents(),
      applications: this.getApplications(),
      quotes: this.getQuotes()
    };
    return JSON.stringify(backup, null, 2);
  }

  importDataJSON(jsonString) {
    try {
      const data = JSON.parse(jsonString);
      if (data.fees) localStorage.setItem(TGA_STORAGE_KEYS.FEES, JSON.stringify(data.fees));
      if (Array.isArray(data.facilities)) localStorage.setItem(TGA_STORAGE_KEYS.FACILITIES, JSON.stringify(data.facilities));
      if (Array.isArray(data.gallery)) localStorage.setItem(TGA_STORAGE_KEYS.GALLERY, JSON.stringify(data.gallery));
      if (Array.isArray(data.notices)) localStorage.setItem(TGA_STORAGE_KEYS.NOTICES, JSON.stringify(data.notices));
      if (Array.isArray(data.events)) localStorage.setItem(TGA_STORAGE_KEYS.EVENTS, JSON.stringify(data.events));
      if (Array.isArray(data.applications)) localStorage.setItem(TGA_STORAGE_KEYS.APPLICATIONS, JSON.stringify(data.applications));
      if (Array.isArray(data.quotes)) localStorage.setItem(TGA_STORAGE_KEYS.QUOTES, JSON.stringify(data.quotes));
      return { success: true };
    } catch (err) {
      console.error('Import error:', err);
      return { success: false, error: err.message };
    }
  }

  resetToDefaults() {
    localStorage.setItem(TGA_STORAGE_KEYS.FEES, JSON.stringify(TGA_INITIAL_SEEDS.fees));
    localStorage.setItem(TGA_STORAGE_KEYS.FACILITIES, JSON.stringify(TGA_INITIAL_SEEDS.facilities));
    localStorage.setItem(TGA_STORAGE_KEYS.GALLERY, JSON.stringify(TGA_INITIAL_SEEDS.gallery));
    localStorage.setItem(TGA_STORAGE_KEYS.NOTICES, JSON.stringify(TGA_INITIAL_SEEDS.notices));
    localStorage.setItem(TGA_STORAGE_KEYS.EVENTS, JSON.stringify(TGA_INITIAL_SEEDS.events));
    localStorage.setItem(TGA_STORAGE_KEYS.APPLICATIONS, JSON.stringify(TGA_INITIAL_SEEDS.applications));
    localStorage.setItem(TGA_STORAGE_KEYS.QUOTES, JSON.stringify([]));
  }
}

// Client-Side Image Compressor to allow storing multiple high-res photos inside localStorage smoothly
window.compressImageFile = function(file, maxWidth = 1000, quality = 0.75) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
};

// Global instance
window.tgaStore = new TGADataStore();
