(() => {
  const GRID_ID   = 'eventsGrid';
  const TOGGLE_ID = 'eventsToggle';
  // IMPORTANT: use absolute-from-root so it works no matter which page you're on
  const DATA_URL  = 'https://peaceful-loris-622.convex.site/public/events';
  const MAX_VISIBLE = 6;

  const grid   = document.getElementById(GRID_ID);
  const toggle = document.getElementById(TOGGLE_ID);

  if (!grid) return;

  const showEmpty = (msg = 'No upcoming events yet.') => {
    grid.innerHTML = `
      <div style="grid-column:1/-1; text-align:center; padding:24px 0; color:#2D308F; font:500 16px/1.6 Poppins, sans-serif;">
        ${msg}
      </div>`;
    if (toggle) { toggle.style.display = 'none'; toggle.onclick = null; }
  };

  // ---- Date helpers ---------------------------------------------------------
  const fmtDateParts = (iso) => {
    // Accept "YYYY-MM-DD"
    if (!iso || typeof iso !== 'string' || !iso.includes('-')) return { month:'', day:'' };
    const [y, m, d] = iso.split('-').map(Number);
    const dt = new Date(y, (m || 1) - 1, d || 1);
    if (isNaN(dt)) return { month:'', day:'' };
    const month = dt.toLocaleString('en-US', { month: 'short' }).toUpperCase();
    const day   = String(dt.getDate());
    return { month, day };
  };

  // ---- Rendering ------------------------------------------------------------
  const makeCard = (evt, i) => {
    const { month, day } = fmtDateParts(evt.date || '');
    const a = document.createElement('a');
    a.className = `event-card ${i % 2 ? 'navy' : 'green'}`;
    a.href = evt.link || '#';
    a.target = '_blank';
    a.rel = 'noopener';
    a.setAttribute('aria-label', `${evt.title || 'Event'} — open Instagram post`);

    a.innerHTML = `
      <div class="event-date">${month}</div>
      <div class="event-day">${day}</div>
      <h3 class="event-title">${evt.title || ''}</h3>
      <p class="event-meta">
        ${evt.time ? `${evt.time} · ` : ''}${evt.location || ''}
      </p>
      <div class="event-arrow">→</div>
    `;
    return a;
  };

  const renderCollapsed = (events) => {
    grid.innerHTML = '';
    if (!events || !events.length) { showEmpty(); return; }
    const show = Math.min(events.length, MAX_VISIBLE);
    for (let i = 0; i < show; i++) grid.appendChild(makeCard(events[i], i));

    if (events.length > MAX_VISIBLE) {
      toggle.style.display = 'inline-flex';
      toggle.textContent = 'More events';
      toggle.onclick = () => renderExpanded(events);
    } else {
      toggle.style.display = 'none';
      toggle.onclick = null;
    }
  };

  const renderExpanded = (events) => {
    grid.innerHTML = '';
    events.forEach((evt, i) => grid.appendChild(makeCard(evt, i)));
    toggle.style.display = 'inline-flex';
    toggle.textContent = 'Hide Events';
    toggle.onclick = () => renderCollapsed(events);
  };

  // ---- Data loading (inline first, then fetch) ------------------------------
  const loadInline = () => {
    const el = document.getElementById('eventsData');
    if (!el) return null;
    try {
      const json = JSON.parse(el.textContent.trim());
      return Array.isArray(json) ? json : null;
    } catch { return null; }
  };

  const loadRemote = async () => {
    try {
      const res = await fetch(DATA_URL, { cache: 'no-store' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const events = Array.isArray(data.events) ? data.events : data; // backwards compat if file
      return events.map((e) => ({
        title: e.title,
        date: e.date ? e.date : (e.start_date ? new Date(e.start_date).toISOString().slice(0,10) : ''),
        time: e.time,
        location: e.location,
        link: e.url || e.link || '#',
      }));
    } catch (err) {
      console.error('Failed to load events.json:', err);
      return null;
    }
  };

  const start = async () => {
    let events = loadInline();
    if (!events) events = await loadRemote();
    if (!Array.isArray(events)) {
      showEmpty('No upcoming events yet or failed to load events.');
      return;
    }

    // Sort by date ascending; filter out invalid dates if any
    events = events
      .filter(e => typeof e?.date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(e.date))
      .sort((a,b) => a.date.localeCompare(b.date));

    renderCollapsed(events);
  };

  start();
})();
