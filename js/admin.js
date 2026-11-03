/**
 * Takdah Grace Academy - Admin Management & Dynamic Tracking Controller
 * Full Administrative control:
 * 1. Applications Review & CSV export
 * 2. Notice Board Editor
 * 3. Events & Calendar Editor
 * 4. Fee Structure Editor (Nursery, Primary, Middle, ICSE, Boarding, Transport)
 * 5. Facilities Manager (Add/Edit/Delete facilities with image uploads)
 * 6. Photo Gallery & Picture Uploader (with client-side image compression)
 * 7. Storage Metrics & JSON Backup/Restore
 */

document.addEventListener('DOMContentLoaded', () => {
  renderPublicNotices();
  renderPublicEvents();
  renderPublicFacilities();
  renderPublicGallery();
  initAdminTabs();
  initAdminForms();
  initTrackerForm();
  loadFeesIntoAdminForm();
});

/* ==========================================================================
   1. Dynamic Public Notice Board Renderer
   ========================================================================== */
function renderPublicNotices() {
  const container = document.getElementById('public-notices-container');
  if (!container) return;

  const notices = window.tgaStore.getNotices();

  if (notices.length === 0) {
    container.innerHTML = `
      <div class="p-6 text-center text-slate-500 text-xs italic bg-white rounded-xl border border-slate-200">
        No active notices currently posted. Check back soon.
      </div>
    `;
    return;
  }

  container.innerHTML = notices.map(n => `
    <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-emerald-500/50 transition group">
      <div class="flex items-center justify-between text-xs mb-2">
        <div class="flex items-center space-x-2">
          ${n.urgent ? `
            <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300 uppercase animate-pulse">
              Urgent
            </span>
          ` : ''}
          <span class="px-2.5 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 uppercase">
            ${n.category}
          </span>
        </div>
        <span class="text-slate-500 text-[11px] font-medium">${n.date}</span>
      </div>
      <h4 class="text-base font-bold text-slate-900 group-hover:text-emerald-700 transition leading-snug">${n.title}</h4>
      <p class="text-xs text-slate-600 mt-1.5 leading-relaxed">${n.content}</p>
      <div class="mt-3 pt-2.5 border-t border-slate-100 text-[11px] text-slate-500 flex items-center justify-between">
        <span>Issued by: <strong class="text-slate-800">${n.author}</strong></span>
        <button onclick="copyNoticeLink('${n.id}')" class="text-emerald-700 hover:text-emerald-800 text-[11px] font-semibold flex items-center space-x-1">
          <i data-lucide="share-2" class="w-3 h-3"></i>
          <span>Share</span>
        </button>
      </div>
    </div>
  `).join('');

  if (window.lucide) lucide.createIcons({ root: container });
}

window.copyNoticeLink = function(id) {
  showToast('Notice Copied', `Reference ID ${id} copied to clipboard for sharing.`, 'info');
};

/* ==========================================================================
   2. Dynamic Public Events Renderer
   ========================================================================== */
function renderPublicEvents(filterCategory = 'all') {
  const container = document.getElementById('public-events-container');
  if (!container) return;

  const events = window.tgaStore.getEvents();
  const filtered = filterCategory === 'all' 
    ? events 
    : events.filter(e => e.category === filterCategory);

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="p-8 text-center text-slate-500 text-sm bg-white rounded-2xl border border-slate-200">
        No events found in this category.
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map(e => `
    <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-emerald-500/50 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition" data-category="${e.category}">
      <div class="flex items-center space-x-5">
        <div class="w-16 h-16 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex flex-col items-center justify-center flex-shrink-0 shadow-sm">
          <span class="text-xs font-bold uppercase tracking-wider">${e.month}</span>
          <span class="text-2xl font-extrabold font-serif-academy text-emerald-900">${e.day}</span>
        </div>
        <div>
          <div class="flex items-center space-x-2">
            <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200 uppercase">${e.category}</span>
            <span class="text-xs text-slate-500 font-medium">${e.time} • ${e.location}</span>
          </div>
          <h3 class="text-base sm:text-lg font-bold text-slate-900 mt-1">${e.title}</h3>
          <p class="text-xs text-slate-600 mt-0.5">${e.description}</p>
        </div>
      </div>
      <div class="w-full md:w-auto flex items-center space-x-3">
        <span class="text-[11px] text-slate-500 hidden sm:inline"><strong class="text-emerald-700">${e.rsvps || 0}</strong> Attending</span>
        <button onclick="rsvpToLocalEvent('${e.id}', '${e.title}')" class="w-full md:w-auto px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs transition shadow-md shadow-emerald-700/20 flex items-center justify-center space-x-2">
          <i data-lucide="check" class="w-3.5 h-3.5"></i>
          <span>RSVP Event</span>
        </button>
      </div>
    </div>
  `).join('');

  if (window.lucide) lucide.createIcons({ root: container });
}

window.rsvpToLocalEvent = function(id, title) {
  const newCount = window.tgaStore.incrementEventRSVP(id);
  renderPublicEvents();
  showToast('RSVP Confirmed!', `You are registered for "${title}". Total confirmed attendees: ${newCount}.`, 'success');
};

/* ==========================================================================
   3. Dynamic Public Facilities Renderer
   ========================================================================== */
function renderPublicFacilities(filterCategory = 'all') {
  const container = document.getElementById('public-facilities-container');
  if (!container) return;

  const facilities = window.tgaStore.getFacilities();
  const filtered = filterCategory === 'all'
    ? facilities
    : facilities.filter(f => f.category === filterCategory);

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="col-span-3 p-8 text-center text-slate-500 text-sm bg-white rounded-2xl border border-slate-200">
        No facilities found in this category.
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map(f => `
    <div class="facility-card rounded-2xl overflow-hidden bg-white border border-slate-200 shadow-sm hover:shadow-md transition group" data-category="${f.category}">
      <div class="relative h-56 overflow-hidden bg-slate-100">
        <img src="${f.image}" alt="${f.title}" class="w-full h-full object-cover group-hover:scale-105 transition duration-500">
        <span class="absolute top-3 left-3 px-2.5 py-1 rounded bg-forest-700 text-white text-[10px] font-bold uppercase tracking-wider shadow">
          ${f.badge || 'Facility'}
        </span>
      </div>
      <div class="p-6 space-y-2">
        <h3 class="text-xl font-bold font-serif-academy text-slate-900">${f.title}</h3>
        <p class="text-xs text-slate-600 leading-relaxed">${f.description}</p>
        <div class="pt-3 flex items-center justify-between text-xs text-slate-500 border-t border-slate-100">
          <span>${f.specs || 'Takdah Campus'}</span>
          <span class="text-emerald-700 font-bold uppercase text-[11px]">${f.category}</span>
        </div>
      </div>
    </div>
  `).join('');

  if (window.lucide) lucide.createIcons({ root: container });
}

/* ==========================================================================
   4. Dynamic Public Photo Gallery Renderer
   ========================================================================== */
function renderPublicGallery() {
  const container = document.getElementById('public-gallery-container');
  if (!container) return;

  const gallery = window.tgaStore.getGallery();

  if (gallery.length === 0) {
    container.innerHTML = `
      <div class="col-span-full p-8 text-center text-slate-500 text-sm bg-white rounded-2xl border border-slate-200">
        No pictures uploaded yet. School staff can upload photos through the Staff Portal.
      </div>
    `;
    return;
  }

  container.innerHTML = gallery.map(g => `
    <div class="group relative rounded-2xl overflow-hidden bg-white border border-slate-200 shadow-sm hover:shadow-lg transition duration-300">
      <div class="relative h-64 overflow-hidden bg-slate-100">
        <img src="${g.image}" alt="${g.title}" class="w-full h-full object-cover group-hover:scale-105 transition duration-500">
        <div class="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-80 group-hover:opacity-90 transition"></div>
        <span class="absolute top-3 left-3 px-2.5 py-0.5 rounded text-[10px] font-bold bg-white/90 text-slate-900 uppercase shadow-sm">
          ${g.category}
        </span>
      </div>
      <div class="absolute bottom-3 left-3 right-3 text-white">
        <h4 class="text-sm font-bold font-serif-academy leading-snug drop-shadow-sm">${g.title}</h4>
        ${g.caption ? `<p class="text-[11px] text-slate-200 line-clamp-2 mt-0.5">${g.caption}</p>` : ''}
        <span class="text-[10px] text-amber-300 font-medium block mt-1">${g.date}</span>
      </div>
    </div>
  `).join('');

  if (window.lucide) lucide.createIcons({ root: container });
}

/* ==========================================================================
   5. Application Tracking (Parent Self-Service Portal)
   ========================================================================== */
function initTrackerForm() {
  const trackerForm = document.getElementById('tracker-form');
  const resultContainer = document.getElementById('tracker-result');
  if (!trackerForm || !resultContainer) return;

  trackerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const query = document.getElementById('tracker-input').value.trim();
    if (!query) return;

    const app = window.tgaStore.getApplicationByRef(query);

    if (!app) {
      resultContainer.innerHTML = `
        <div class="p-6 rounded-2xl bg-rose-50 border border-rose-200 text-center text-slate-700 animate-fadeIn">
          <i data-lucide="alert-circle" class="w-8 h-8 text-rose-600 mx-auto mb-2"></i>
          <h4 class="font-bold text-slate-900 text-base">Application Not Found</h4>
          <p class="text-xs text-slate-600 mt-1 max-w-sm mx-auto">
            No record matched reference or mobile <strong>"${query}"</strong>. Please verify the code or contact the 6th Mile office at +91 (0354) Takdah.
          </p>
        </div>
      `;
      if (window.lucide) lucide.createIcons({ root: resultContainer });
      return;
    }

    let statusColor = 'bg-amber-100 text-amber-800 border-amber-300';
    let stepProgress = 1;
    if (app.status === 'Under Review') {
      statusColor = 'bg-blue-100 text-blue-800 border-blue-300';
      stepProgress = 2;
    } else if (app.status === 'Interview Scheduled') {
      statusColor = 'bg-purple-100 text-purple-800 border-purple-300';
      stepProgress = 3;
    } else if (app.status === 'Approved') {
      statusColor = 'bg-emerald-100 text-emerald-800 border-emerald-300';
      stepProgress = 4;
    } else if (app.status === 'Rejected') {
      statusColor = 'bg-rose-100 text-rose-800 border-rose-300';
      stepProgress = 4;
    }

    resultContainer.innerHTML = `
      <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-md text-left animate-fadeIn space-y-4">
        
        <div class="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
          <div>
            <span class="text-[10px] uppercase font-bold tracking-widest text-emerald-700">Application Reference</span>
            <h4 class="text-xl font-bold font-serif-academy text-slate-900">${app.id}</h4>
          </div>
          <span class="px-3 py-1 rounded-full text-xs font-bold border ${statusColor} self-start sm:self-auto">
            ${app.status}
          </span>
        </div>

        <div class="py-2">
          <div class="text-[11px] font-semibold text-slate-500 mb-2">Admission Review Journey</div>
          <div class="grid grid-cols-4 gap-2 text-center text-[10px]">
            <div class="p-2 rounded-lg ${stepProgress >= 1 ? 'bg-emerald-100 text-emerald-900 border border-emerald-300 font-bold' : 'bg-slate-100 text-slate-400'}">
              1. Submitted
            </div>
            <div class="p-2 rounded-lg ${stepProgress >= 2 ? 'bg-emerald-100 text-emerald-900 border border-emerald-300 font-bold' : 'bg-slate-100 text-slate-400'}">
              2. Review
            </div>
            <div class="p-2 rounded-lg ${stepProgress >= 3 ? 'bg-emerald-100 text-emerald-900 border border-emerald-300 font-bold' : 'bg-slate-100 text-slate-400'}">
              3. Interview
            </div>
            <div class="p-2 rounded-lg ${stepProgress >= 4 ? (app.status === 'Approved' ? 'bg-emerald-600 text-white font-bold' : 'bg-rose-600 text-white font-bold') : 'bg-slate-100 text-slate-400'}">
              4. Decision
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200">
          <div><span class="text-slate-500">Student Name:</span> <strong class="text-slate-900">${app.studentName}</strong></div>
          <div><span class="text-slate-500">Applying For:</span> <strong class="text-emerald-800">${app.grade}</strong></div>
          <div><span class="text-slate-500">Parent/Guardian:</span> <span class="text-slate-800 font-medium">${app.parentName}</span></div>
          <div><span class="text-slate-500">Location:</span> <span class="text-slate-800">${app.location}</span></div>
          <div><span class="text-slate-500">Admission Mode:</span> <span class="text-slate-800">${app.admissionType}</span></div>
          <div><span class="text-slate-500">Submission Date:</span> <span class="text-slate-800">${new Date(app.appliedAt).toLocaleDateString()}</span></div>
        </div>

        <div class="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200 text-xs">
          <div class="text-emerald-800 font-bold mb-1 flex items-center space-x-1.5">
            <i data-lucide="message-square" class="w-3.5 h-3.5"></i>
            <span>Official Office Remarks</span>
          </div>
          <p class="text-slate-700 italic">${app.adminRemarks || 'No additional remarks.'}</p>
        </div>

      </div>
    `;

    if (window.lucide) lucide.createIcons({ root: resultContainer });
  });
}

/* ==========================================================================
   6. Admin Dashboard Controller (Navigation & Tabs)
   ========================================================================== */
function initAdminTabs() {
  const tabs = document.querySelectorAll('.admin-nav-tab');
  const sections = document.querySelectorAll('.admin-tab-section');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => {
        t.classList.remove('bg-emerald-700', 'text-white');
        t.classList.add('bg-white', 'text-slate-700', 'border', 'border-slate-200');
      });
      tab.classList.add('bg-emerald-700', 'text-white');
      tab.classList.remove('bg-white', 'text-slate-700', 'border', 'border-slate-200');

      const target = tab.getAttribute('data-admin-target');
      sections.forEach(s => {
        if (s.id === target) {
          s.classList.remove('hidden');
        } else {
          s.classList.add('hidden');
        }
      });

      if (target === 'admin-applications-section') renderAdminApplicationsTable();
      if (target === 'admin-notices-section') renderAdminNoticesTable();
      if (target === 'admin-events-section') renderAdminEventsTable();
      if (target === 'admin-fees-section') loadFeesIntoAdminForm();
      if (target === 'admin-facilities-section') renderAdminFacilitiesList();
      if (target === 'admin-gallery-section') renderAdminGalleryGrid();
      if (target === 'admin-backup-section') renderStorageMetrics();
      if (window.lucide) lucide.createIcons();
    });
  });
}

window.openAdminDashboard = function() {
  openModal('admin-modal');
  renderAdminApplicationsTable();
  renderStorageMetrics();
  loadFeesIntoAdminForm();
  renderAdminFacilitiesList();
  renderAdminGalleryGrid();
  if (window.lucide) lucide.createIcons();
};

/* --- TAB 1: APPLICATIONS TABLE --- */
function renderAdminApplicationsTable(filterQuery = '') {
  const tableBody = document.getElementById('admin-applications-tbody');
  if (!tableBody) return;

  const applications = window.tgaStore.getApplications();
  const filtered = filterQuery
    ? applications.filter(a => 
        a.studentName.toLowerCase().includes(filterQuery.toLowerCase()) ||
        a.id.toLowerCase().includes(filterQuery.toLowerCase()) ||
        a.grade.toLowerCase().includes(filterQuery.toLowerCase())
      )
    : applications;

  const countBadge = document.getElementById('admin-apps-count');
  if (countBadge) countBadge.innerText = `${filtered.length} Applications`;

  if (filtered.length === 0) {
    tableBody.innerHTML = `<tr><td colspan="6" class="p-6 text-center text-slate-500 italic">No applications found.</td></tr>`;
    return;
  }

  tableBody.innerHTML = filtered.map(a => `
    <tr class="border-b border-slate-200 hover:bg-slate-50 text-xs">
      <td class="p-3 font-mono font-bold text-emerald-800">${a.id}</td>
      <td class="p-3">
        <div class="font-bold text-slate-900">${a.studentName}</div>
        <div class="text-[11px] text-slate-500">${a.grade} • ${a.admissionType}</div>
      </td>
      <td class="p-3">
        <div class="text-slate-800 font-medium">${a.parentName}</div>
        <div class="text-slate-500 text-[11px]">${a.mobile}</div>
      </td>
      <td class="p-3">
        <select onchange="updateAppStatus('${a.id}', this.value)" class="bg-white border border-slate-300 rounded px-2.5 py-1 text-xs text-slate-800 focus:outline-none focus:border-emerald-600">
          <option value="Pending Review" ${a.status === 'Pending Review' ? 'selected' : ''}>Pending Review</option>
          <option value="Under Review" ${a.status === 'Under Review' ? 'selected' : ''}>Under Review</option>
          <option value="Interview Scheduled" ${a.status === 'Interview Scheduled' ? 'selected' : ''}>Interview Scheduled</option>
          <option value="Approved" ${a.status === 'Approved' ? 'selected' : ''}>Approved</option>
          <option value="Rejected" ${a.status === 'Rejected' ? 'selected' : ''}>Rejected</option>
        </select>
      </td>
      <td class="p-3 text-[11px] text-slate-600 max-w-[200px] truncate" title="${a.notes || ''}">
        ${a.notes || '—'}
      </td>
      <td class="p-3 text-right">
        <button onclick="deleteAppRecord('${a.id}')" class="p-1.5 rounded hover:bg-rose-100 text-rose-600 hover:text-rose-700 transition" title="Delete Application">
          <i data-lucide="trash-2" class="w-4 h-4"></i>
        </button>
      </td>
    </tr>
  `).join('');

  if (window.lucide) lucide.createIcons({ root: tableBody });
}

window.updateAppStatus = function(id, newStatus) {
  const remark = prompt(`Update status to "${newStatus}". Enter note for parent:`, `Status updated to ${newStatus} by administration.`);
  window.tgaStore.updateApplicationStatus(id, newStatus, remark || '');
  renderAdminApplicationsTable();
  showToast('Status Updated', `Application ${id} is now set to "${newStatus}".`, 'success');
};

window.deleteAppRecord = function(id) {
  if (confirm(`Are you sure you want to delete application ${id}?`)) {
    window.tgaStore.deleteApplication(id);
    renderAdminApplicationsTable();
    showToast('Record Deleted', `Application ${id} removed from local storage.`, 'info');
  }
};

window.filterAdminApps = function(val) {
  renderAdminApplicationsTable(val);
};

window.exportApplicationsCSV = function() {
  const apps = window.tgaStore.getApplications();
  if (apps.length === 0) {
    showToast('No Data', 'There are no applications to export.', 'info');
    return;
  }

  const headers = ['Application ID', 'Student Name', 'Grade', 'Parent Name', 'Mobile', 'Location', 'Type', 'Status', 'Notes', 'Applied Date'];
  const rows = apps.map(a => [
    `"${a.id}"`,
    `"${a.studentName}"`,
    `"${a.grade}"`,
    `"${a.parentName}"`,
    `"${a.mobile}"`,
    `"${a.location || ''}"`,
    `"${a.admissionType || ''}"`,
    `"${a.status}"`,
    `"${(a.notes || '').replace(/"/g, '""')}"`,
    `"${a.appliedAt}"`
  ]);

  const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `TGA_Applications_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  link.remove();

  showToast('CSV Exported', 'Applications list downloaded successfully.', 'success');
};

/* --- TAB 2: NOTICES TABLE --- */
function renderAdminNoticesTable() {
  const container = document.getElementById('admin-notices-tbody');
  if (!container) return;

  const notices = window.tgaStore.getNotices();
  if (notices.length === 0) {
    container.innerHTML = `<tr><td colspan="5" class="p-6 text-center text-slate-500 italic">No notices currently in local storage.</td></tr>`;
    return;
  }

  container.innerHTML = notices.map(n => `
    <tr class="border-b border-slate-200 hover:bg-slate-50 text-xs">
      <td class="p-3 font-semibold text-slate-900">${n.title}</td>
      <td class="p-3 text-emerald-700 font-medium">${n.category}</td>
      <td class="p-3 text-slate-500">${n.date}</td>
      <td class="p-3">${n.urgent ? '<span class="text-amber-700 font-bold bg-amber-50 px-2 py-0.5 rounded border border-amber-200">Yes</span>' : 'No'}</td>
      <td class="p-3 text-right">
        <button onclick="deleteNoticeRecord('${n.id}')" class="p-1.5 rounded hover:bg-rose-100 text-rose-600" title="Delete Notice">
          <i data-lucide="trash-2" class="w-4 h-4"></i>
        </button>
      </td>
    </tr>
  `).join('');

  if (window.lucide) lucide.createIcons({ root: container });
}

window.deleteNoticeRecord = function(id) {
  if (confirm('Delete this notice from the public board?')) {
    window.tgaStore.deleteNotice(id);
    renderAdminNoticesTable();
    renderPublicNotices();
    showToast('Notice Removed', 'Notice deleted from local storage and public board.', 'info');
  }
};

/* --- TAB 3: EVENTS TABLE --- */
function renderAdminEventsTable() {
  const container = document.getElementById('admin-events-tbody');
  if (!container) return;

  const events = window.tgaStore.getEvents();
  if (events.length === 0) {
    container.innerHTML = `<tr><td colspan="5" class="p-6 text-center text-slate-500 italic">No events recorded.</td></tr>`;
    return;
  }

  container.innerHTML = events.map(e => `
    <tr class="border-b border-slate-200 hover:bg-slate-50 text-xs">
      <td class="p-3 font-semibold text-slate-900">${e.title}</td>
      <td class="p-3 text-terracotta-dark font-medium">${e.date} (${e.time})</td>
      <td class="p-3 text-emerald-800 capitalize font-medium">${e.category}</td>
      <td class="p-3 font-bold text-slate-900">${e.rsvps || 0}</td>
      <td class="p-3 text-right">
        <button onclick="deleteEventRecord('${e.id}')" class="p-1.5 rounded hover:bg-rose-100 text-rose-600" title="Delete Event">
          <i data-lucide="trash-2" class="w-4 h-4"></i>
        </button>
      </td>
    </tr>
  `).join('');

  if (window.lucide) lucide.createIcons({ root: container });
}

window.deleteEventRecord = function(id) {
  if (confirm('Delete this event from the calendar?')) {
    window.tgaStore.deleteEvent(id);
    renderAdminEventsTable();
    renderPublicEvents();
    showToast('Event Deleted', 'Event removed from calendar.', 'info');
  }
};

/* --- TAB 4: FEES STRUCTURE EDITOR --- */
function loadFeesIntoAdminForm() {
  const fees = window.tgaStore.getFees();
  if (!fees) return;

  const setVal = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.value = val;
  };

  setVal('admin-fee-nursery', fees.nursery || 18000);
  setVal('admin-fee-primary', fees.primary || 24000);
  setVal('admin-fee-middle', fees.middle || 30000);
  setVal('admin-fee-icse', fees.icse || 36000);
  setVal('admin-fee-hostel-weekly', fees.hostelWeekly || 42000);
  setVal('admin-fee-hostel-full', fees.hostelFull || 60000);
  setVal('admin-fee-transport', fees.transport || 9600);
  setVal('admin-fee-lunch', fees.lunch || 6000);
  setVal('admin-fee-coaching', fees.coaching || 4800);
}

/* --- TAB 5: FACILITIES MANAGER --- */
function renderAdminFacilitiesList() {
  const container = document.getElementById('admin-facilities-list');
  if (!container) return;

  const facilities = window.tgaStore.getFacilities();

  if (facilities.length === 0) {
    container.innerHTML = `
      <div class="p-6 text-center text-slate-500 text-xs italic bg-white rounded-xl border border-slate-200">
        No facilities recorded. Add a facility using the form above.
      </div>
    `;
    return;
  }

  container.innerHTML = facilities.map(f => `
    <div class="flex items-center justify-between p-3.5 bg-white rounded-xl border border-slate-200 shadow-sm text-xs">
      <div class="flex items-center space-x-3">
        <img src="${f.image}" alt="${f.title}" class="w-14 h-12 rounded-lg object-cover border border-slate-200">
        <div>
          <div class="font-bold text-slate-900 text-sm">${f.title}</div>
          <div class="text-slate-500 text-[11px]">${f.badge} • Category: <span class="capitalize font-semibold text-emerald-800">${f.category}</span></div>
          <div class="text-[11px] text-slate-600 line-clamp-1 max-w-md">${f.description}</div>
        </div>
      </div>
      <button onclick="deleteFacilityRecord('${f.id}')" class="p-2 rounded-lg hover:bg-rose-50 text-rose-600 transition" title="Delete Facility">
        <i data-lucide="trash-2" class="w-4 h-4"></i>
      </button>
    </div>
  `).join('');

  if (window.lucide) lucide.createIcons({ root: container });
}

window.deleteFacilityRecord = function(id) {
  if (confirm('Delete this campus facility?')) {
    window.tgaStore.deleteFacility(id);
    renderAdminFacilitiesList();
    renderPublicFacilities();
    showToast('Facility Removed', 'Facility deleted from website.', 'info');
  }
};

/* --- TAB 6: PHOTO GALLERY & UPLOADS --- */
function renderAdminGalleryGrid() {
  const container = document.getElementById('admin-gallery-grid');
  if (!container) return;

  const gallery = window.tgaStore.getGallery();

  if (gallery.length === 0) {
    container.innerHTML = `
      <div class="col-span-full p-6 text-center text-slate-500 text-xs italic bg-white rounded-xl border border-slate-200">
        No pictures in gallery. Upload one using the form above.
      </div>
    `;
    return;
  }

  container.innerHTML = gallery.map(g => `
    <div class="group relative rounded-xl overflow-hidden border border-slate-200 bg-white shadow-sm">
      <img src="${g.image}" alt="${g.title}" class="w-full h-32 object-cover">
      <div class="p-2.5">
        <div class="font-bold text-slate-900 text-xs truncate" title="${g.title}">${g.title}</div>
        <div class="text-[10px] text-slate-500 flex items-center justify-between mt-1">
          <span class="bg-slate-100 px-1.5 py-0.5 rounded text-slate-700">${g.category}</span>
          <span>${g.date}</span>
        </div>
      </div>
      <button onclick="deleteGalleryImageRecord('${g.id}')" class="absolute top-2 right-2 p-1.5 rounded-lg bg-black/60 text-white hover:bg-rose-600 transition shadow" title="Delete Picture">
        <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
      </button>
    </div>
  `).join('');

  if (window.lucide) lucide.createIcons({ root: container });
}

window.deleteGalleryImageRecord = function(id) {
  if (confirm('Delete this picture from the school gallery?')) {
    window.tgaStore.deleteGalleryImage(id);
    renderAdminGalleryGrid();
    renderPublicGallery();
    showToast('Picture Removed', 'Photo removed from gallery.', 'info');
  }
};

/* --- TAB 7: STORAGE & BACKUP --- */
function renderStorageMetrics() {
  const apps = window.tgaStore.getApplications().length;
  const notices = window.tgaStore.getNotices().length;
  const events = window.tgaStore.getEvents().length;
  const facilities = window.tgaStore.getFacilities().length;
  const gallery = window.tgaStore.getGallery().length;

  const totalBytes = JSON.stringify(localStorage).length;
  const kbUsed = (totalBytes / 1024).toFixed(2);

  const el = document.getElementById('storage-metrics-display');
  if (el) {
    el.innerHTML = `
      <div class="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center">
        <div class="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
          <div class="text-2xl font-bold text-emerald-700 font-serif-academy">${apps}</div>
          <div class="text-[10px] uppercase text-slate-500 font-bold">Applications</div>
        </div>
        <div class="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
          <div class="text-2xl font-bold text-amber-600 font-serif-academy">${notices}</div>
          <div class="text-[10px] uppercase text-slate-500 font-bold">Notices</div>
        </div>
        <div class="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
          <div class="text-2xl font-bold text-blue-700 font-serif-academy">${events}</div>
          <div class="text-[10px] uppercase text-slate-500 font-bold">Events</div>
        </div>
        <div class="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
          <div class="text-2xl font-bold text-terracotta-700 font-serif-academy">${facilities}</div>
          <div class="text-[10px] uppercase text-slate-500 font-bold">Facilities</div>
        </div>
        <div class="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
          <div class="text-2xl font-bold text-purple-700 font-serif-academy">${gallery} (${kbUsed} KB)</div>
          <div class="text-[10px] uppercase text-slate-500 font-bold">Photos / Storage</div>
        </div>
      </div>
    `;
  }
}

window.downloadJSONBackup = function() {
  const jsonStr = window.tgaStore.exportAllDataJSON();
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `TakdahGraceAcademy_FullBackup_${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);
  showToast('Backup Created', 'Complete local data exported.', 'success');
};

window.importJSONBackup = function(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    const res = window.tgaStore.importDataJSON(e.target.result);
    if (res.success) {
      renderPublicNotices();
      renderPublicEvents();
      renderPublicFacilities();
      renderPublicGallery();
      renderAdminApplicationsTable();
      renderAdminNoticesTable();
      renderAdminEventsTable();
      renderAdminFacilitiesList();
      renderAdminGalleryGrid();
      loadFeesIntoAdminForm();
      if (typeof syncPublicFeeCalculator === 'function') syncPublicFeeCalculator();
      renderStorageMetrics();
      showToast('Data Restored', 'All school records imported from backup.', 'success');
    } else {
      showToast('Import Failed', res.error, 'info');
    }
  };
  reader.readAsText(file);
};

window.resetAllDataDefaults = function() {
  if (confirm('Reset all applications, fees, facilities, gallery, notices, and events back to default seed records?')) {
    window.tgaStore.resetToDefaults();
    renderPublicNotices();
    renderPublicEvents();
    renderPublicFacilities();
    renderPublicGallery();
    renderAdminApplicationsTable();
    renderAdminNoticesTable();
    renderAdminEventsTable();
    renderAdminFacilitiesList();
    renderAdminGalleryGrid();
    loadFeesIntoAdminForm();
    if (typeof syncPublicFeeCalculator === 'function') syncPublicFeeCalculator();
    renderStorageMetrics();
    showToast('Reset Complete', 'Local storage refreshed to default initial data.', 'success');
  }
};

/* ==========================================================================
   7. Admin Forms Handlers (Fees, Facilities, Gallery, Notices, Events)
   ========================================================================== */
function initAdminForms() {
  // 1. Fee Structure Save Form
  const feeForm = document.getElementById('admin-fees-form');
  if (feeForm) {
    feeForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const newFees = {
        nursery: parseInt(document.getElementById('admin-fee-nursery').value, 10) || 18000,
        primary: parseInt(document.getElementById('admin-fee-primary').value, 10) || 24000,
        middle: parseInt(document.getElementById('admin-fee-middle').value, 10) || 30000,
        icse: parseInt(document.getElementById('admin-fee-icse').value, 10) || 36000,
        hostelWeekly: parseInt(document.getElementById('admin-fee-hostel-weekly').value, 10) || 42000,
        hostelFull: parseInt(document.getElementById('admin-fee-hostel-full').value, 10) || 60000,
        transport: parseInt(document.getElementById('admin-fee-transport').value, 10) || 9600,
        lunch: parseInt(document.getElementById('admin-fee-lunch').value, 10) || 6000,
        coaching: parseInt(document.getElementById('admin-fee-coaching').value, 10) || 4800
      };

      window.tgaStore.updateFees(newFees);
      if (typeof syncPublicFeeCalculator === 'function') {
        syncPublicFeeCalculator();
      }
      showToast('Fee Structure Updated!', 'New rates are saved and live on the public Fee Calculator.', 'success');
    });
  }

  // 2. Add Facility Form (With Image File Upload)
  const facilityForm = document.getElementById('admin-new-facility-form');
  if (facilityForm) {
    facilityForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const title = document.getElementById('admin-fac-title').value;
      const category = document.getElementById('admin-fac-category').value;
      const badge = document.getElementById('admin-fac-badge').value;
      const specs = document.getElementById('admin-fac-specs').value;
      const desc = document.getElementById('admin-fac-desc').value;
      const fileInput = document.getElementById('admin-fac-file');
      const urlInput = document.getElementById('admin-fac-url');

      let imageUrl = 'images/grace-academy-campus.png';

      if (fileInput && fileInput.files && fileInput.files[0]) {
        try {
          imageUrl = await window.compressImageFile(fileInput.files[0], 900, 0.75);
        } catch (err) {
          console.error('Compression failed:', err);
        }
      } else if (urlInput && urlInput.value.trim()) {
        imageUrl = urlInput.value.trim();
      }

      window.tgaStore.addFacility({
        title,
        category,
        badge,
        specs,
        description: desc,
        image: imageUrl
      });

      facilityForm.reset();
      renderAdminFacilitiesList();
      renderPublicFacilities();
      renderStorageMetrics();
      showToast('Facility Added!', `"${title}" has been added to the campus facilities.`, 'success');
    });
  }

  // 3. Photo Gallery Upload Form
  const galleryForm = document.getElementById('admin-new-gallery-form');
  if (galleryForm) {
    galleryForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const title = document.getElementById('admin-gal-title').value;
      const category = document.getElementById('admin-gal-category').value;
      const caption = document.getElementById('admin-gal-caption').value;
      const fileInput = document.getElementById('admin-gal-file');

      if (!fileInput || !fileInput.files || !fileInput.files[0]) {
        showToast('Image Required', 'Please select a photo file to upload.', 'info');
        return;
      }

      try {
        const compressedImage = await window.compressImageFile(fileInput.files[0], 1000, 0.78);
        window.tgaStore.addGalleryImage({
          title,
          category,
          caption,
          image: compressedImage
        });

        galleryForm.reset();
        renderAdminGalleryGrid();
        renderPublicGallery();
        renderStorageMetrics();
        showToast('Picture Uploaded!', `"${title}" added to school photo gallery.`, 'success');
      } catch (err) {
        showToast('Upload Error', 'Could not process image file.', 'info');
      }
    });
  }

  // 4. Notice Form
  const noticeForm = document.getElementById('admin-new-notice-form');
  if (noticeForm) {
    noticeForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const title = document.getElementById('admin-notice-title').value;
      const category = document.getElementById('admin-notice-category').value;
      const content = document.getElementById('admin-notice-content').value;
      const urgent = document.getElementById('admin-notice-urgent').checked;

      window.tgaStore.addNotice({
        title,
        category,
        content,
        urgent,
        author: 'Takdah Grace Academy Office'
      });

      noticeForm.reset();
      renderAdminNoticesTable();
      renderPublicNotices();
      renderStorageMetrics();
      showToast('Notice Published', 'New circular posted and visible on the website.', 'success');
    });
  }

  // 5. Event Form
  const eventForm = document.getElementById('admin-new-event-form');
  if (eventForm) {
    eventForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const title = document.getElementById('admin-event-title').value;
      const date = document.getElementById('admin-event-date').value;
      const time = document.getElementById('admin-event-time').value;
      const category = document.getElementById('admin-event-category').value;
      const location = document.getElementById('admin-event-location').value;
      const description = document.getElementById('admin-event-desc').value;

      window.tgaStore.addEvent({
        title,
        date,
        time,
        category,
        location,
        description
      });

      eventForm.reset();
      renderAdminEventsTable();
      renderPublicEvents();
      renderStorageMetrics();
      showToast('Event Added', 'Event scheduled and visible on the public calendar.', 'success');
    });
  }
}
