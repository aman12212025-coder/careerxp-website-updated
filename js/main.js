/* ==========================================================================
   CareerXP — Shared Site Behavior
   Every block below checks for its target element first, so this single
   file can be safely included on every page.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Mobile nav toggle ---------- */
  const menuToggle = document.querySelector('.menu-toggle');
  const navList = document.querySelector('nav ul');
  if (menuToggle && navList) {
    menuToggle.addEventListener('click', () => {
      const isOpen = navList.classList.toggle('is-open');
      menuToggle.classList.toggle('is-open', isOpen);
      menuToggle.setAttribute('aria-expanded', String(isOpen));
    });
    navList.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navList.classList.remove('is-open');
        menuToggle.classList.remove('is-open');
      });
    });
  }

  /* ---------- Nav scroll-spy for in-page anchor links ---------- */
  /* "How it works" / "Stories" (and any other #section link) don't get a
     static class="active" like separate pages do, since they're anchors on
     the same page — so we track which section is currently in view and
     toggle the matching nav link's active state as the user scrolls. */
  const anchorNavLinks = Array.from(document.querySelectorAll('nav a[href^="#"], nav a[href*="index.html#"]'))
    .map(link => {
      const hash = link.getAttribute('href').split('#')[1];
      const section = hash ? document.getElementById(hash) : null;
      return section ? { link, section } : null;
    })
    .filter(Boolean);

  if (anchorNavLinks.length && 'IntersectionObserver' in window) {
    const spy = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const match = anchorNavLinks.find(a => a.section === entry.target);
        if (!match) return;
        if (entry.isIntersecting) {
          anchorNavLinks.forEach(a => a.link.classList.remove('active'));
          match.link.classList.add('active');
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });
    anchorNavLinks.forEach(a => spy.observe(a.section));
  }

  /* ---------- Hero ledger ticker (compact, home page) ---------- */
  const ledgerTrack = document.getElementById('ledger-track');
  if (ledgerTrack && typeof CAREERXP_LEDGER !== 'undefined') {
    const ticketHtml = (r) => `
      <div class="ticket">
        <div><span class="who">${r[0]}</span><span class="role">${r[1]} · ${r[2]}</span></div>
        <div><span class="ctc">${r[3]}</span><span class="stamp">VERIFIED</span></div>
      </div>`;
    ledgerTrack.innerHTML = CAREERXP_LEDGER.map(ticketHtml).join('') + CAREERXP_LEDGER.map(ticketHtml).join('');
  }

  const ledgerCount = document.getElementById('ledger-count');
  if (ledgerCount && typeof CAREERXP_STATS !== 'undefined') {
    let count = CAREERXP_STATS.totalHires;
    const render = () => { ledgerCount.textContent = count.toLocaleString() + ' total'; };
    render();
    setInterval(() => { count += 1; render(); }, 4000);
  }

  /* ---------- Full ledger grid (placements page) ---------- */
  const ledgerGrid = document.getElementById('ledger-grid');
  if (ledgerGrid && typeof CAREERXP_LEDGER !== 'undefined') {
    ledgerGrid.innerHTML = CAREERXP_LEDGER.map(r => `
      <div class="ledger-row">
        <div><span class="who">${r[0]}</span><span class="role">${r[1]} · ${r[2]}</span></div>
        <div class="right"><span class="ctc">${r[3]}</span><span class="stamp">VERIFIED</span></div>
      </div>`).join('');
  }

  /* ---------- Partner ticker (home page, scrolling strip) ---------- */
  const partnerTrack = document.getElementById('partner-track');
  if (partnerTrack && typeof CAREERXP_PARTNERS !== 'undefined') {
    partnerTrack.innerHTML = CAREERXP_PARTNERS.concat(CAREERXP_PARTNERS)
      .map(p => `<span>${p}</span>`).join('');
  }

  /* ---------- Partner grid (placements page, static grid) ---------- */
  const partnerGrid = document.getElementById('partner-grid');
  if (partnerGrid && typeof CAREERXP_PARTNERS !== 'undefined') {
    partnerGrid.innerHTML = CAREERXP_PARTNERS.map(p => `<div class="partner-cell">${p}</div>`).join('');
  }

  /* ---------- Weekly placement drive report (placements page) ---------- */
  const driveTableBody = document.getElementById('drive-table-body');
  if (driveTableBody && typeof CAREERXP_WEEKLY_DRIVES !== 'undefined') {
    driveTableBody.innerHTML = CAREERXP_WEEKLY_DRIVES.map(row => `
      <tr>
        <td>${row[0]}</td>
        <td class="num-cell">${row[1]}</td>
        <td class="num-cell">${row[2]}</td>
      </tr>`).join('');
  }

  /* ---------- Partnered colleges (placements page) ---------- */
  const collegeGrid = document.getElementById('college-grid');
  if (collegeGrid && typeof CAREERXP_COLLEGES !== 'undefined') {
    collegeGrid.innerHTML = CAREERXP_COLLEGES.map(c => {
      const hasLink = c.linkedin && c.linkedin.trim().length > 0;
      const linkHtml = hasLink
        ? `<a href="${c.linkedin}" target="_blank" rel="noopener" class="college-link">View LinkedIn post</a>`
        : `<span class="college-link is-placeholder">LinkedIn post pending</span>`;
      return `
        <div class="college-row">
          <h4>${c.name}</h4>
          ${linkHtml}
        </div>`;
    }).join('');
  }

  /* ---------- Course filter chips (courses page) ---------- */
  const chips = document.querySelectorAll('.filter-chip');
  const rows = document.querySelectorAll('.course-row');
  if (chips.length && rows.length) {
    chips.forEach(chip => {
      chip.addEventListener('click', () => {
        chips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        const filter = chip.dataset.filter;
        rows.forEach(row => {
          row.style.display = (filter === 'all' || row.dataset.cat === filter) ? 'grid' : 'none';
        });
      });
    });
  }

  /* ---------- Contact / enroll form ---------- */
  /* Wired for Netlify Forms (data-netlify="true" in contact.html). On
     Netlify, submissions are captured automatically, emailed to whoever is
     set up under Site settings -> Forms -> Form notifications, and can be
     piped into a Google Sheet via a Zapier/Make "New Form Submission"
     trigger (see README.md). */
  const enrollForm = document.getElementById('enroll-form');
  const successMsg = document.getElementById('success-msg');
  if (enrollForm && successMsg) {
    enrollForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const data = new URLSearchParams(new FormData(enrollForm)).toString();
      fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: data,
      })
        .then(() => {
          enrollForm.style.display = 'none';
          successMsg.style.display = 'block';
        })
        .catch(() => {
          enrollForm.style.display = 'none';
          successMsg.style.display = 'block';
        });
    });
  }

});
