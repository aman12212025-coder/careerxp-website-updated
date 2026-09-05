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

  /* ---------- Video testimonial swipe stack ---------- */
  /* A Tinder-style deck: the front card is fully interactive, the rest
     sit fanned behind it (positioned purely via the --pos custom
     property in CSS). Dragging the front card left/right past a
     threshold — or using the arrow buttons / dots — rotates the
     `order` array so the next card becomes the front card. Nothing is
     removed from the DOM, so the stack loops forever in both directions. */
  const stack = document.getElementById('testimonialStack');
  if (stack) {
    const cards = Array.from(stack.querySelectorAll('.stack-card'));
    const dotsWrap = document.getElementById('stackDots');
    const prevBtn = document.getElementById('stackPrev');
    const nextBtn = document.getElementById('stackNext');
    let order = cards.map((_, i) => i); // order[0] = index of the front card

    const dots = cards.map((_, i) => {
      const dot = document.createElement('button');
      dot.className = 'stack-dot';
      dot.type = 'button';
      dot.setAttribute('aria-label', `Show testimonial ${i + 1}`);
      dot.addEventListener('click', () => goTo(i));
      dotsWrap?.appendChild(dot);
      return dot;
    });

    function render() {
      order.forEach((cardIndex, pos) => {
        const card = cards[cardIndex];
        card.style.setProperty('--pos', pos);
        card.style.zIndex = String(100 - pos);
        card.classList.toggle('is-front', pos === 0);
        if (pos !== 0) {
          const v = card.querySelector('video');
          if (v && !v.paused) v.pause();
        }
      });
      dots.forEach((dot, i) => dot.classList.toggle('is-active', order[0] === i));
    }

    function next() { order.push(order.shift()); render(); }
    function prev() { order.unshift(order.pop()); render(); }
    function goTo(cardIndex) {
      const steps = order.indexOf(cardIndex);
      for (let n = 0; n < steps; n++) order.push(order.shift());
      render();
    }

    nextBtn?.addEventListener('click', next);
    prevBtn?.addEventListener('click', prev);

    /* Drag-to-swipe (mouse + touch, via Pointer Events). We wait for a
       small movement threshold before treating it as a drag, so a plain
       tap still reaches the video's own play/pause controls. */
    let drag = null;

    stack.addEventListener('pointerdown', (e) => {
      const card = e.target.closest('.stack-card');
      if (!card || !card.classList.contains('is-front')) return;
      drag = { card, startX: e.clientX, dx: 0, dragging: false, pointerId: e.pointerId };
    });

    stack.addEventListener('pointermove', (e) => {
      if (!drag || e.pointerId !== drag.pointerId) return;
      drag.dx = e.clientX - drag.startX;
      if (!drag.dragging && Math.abs(drag.dx) > 8) {
        drag.dragging = true;
        drag.card.setPointerCapture(e.pointerId);
        drag.card.classList.add('is-dragging');
      }
      if (drag.dragging) {
        const rotate = drag.dx / 18;
        drag.card.style.transform = `translateX(${drag.dx}px) rotate(${rotate}deg)`;
      }
    });

    function flingOut(card, dir, after) {
      card.style.transition = 'transform .25s ease-in, opacity .25s ease-in';
      card.style.transform = `translateX(${dir * (stack.offsetWidth + 140)}px) rotate(${dir * 20}deg)`;
      card.style.opacity = '0';
      setTimeout(() => {
        card.style.transition = '';
        card.style.transform = '';
        card.style.opacity = '';
        after();
      }, 250);
    }

    function endDrag(e) {
      if (!drag || e.pointerId !== drag.pointerId) return;
      const { card, dx, dragging } = drag;
      card.classList.remove('is-dragging');
      if (dragging) {
        const threshold = stack.offsetWidth * 0.28;
        if (dx <= -threshold) {
          flingOut(card, -1, next);
        } else if (dx >= threshold) {
          flingOut(card, 1, prev);
        } else {
          card.style.transform = '';
        }
      }
      drag = null;
    }
    stack.addEventListener('pointerup', endDrag);
    stack.addEventListener('pointercancel', endDrag);

    /* Keyboard support (left/right arrows) when the stack has focus */
    stack.setAttribute('tabindex', '0');
    stack.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    });

    render();
  }

});

