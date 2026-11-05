(() => {
  'use strict';

  const NAV = [
    ['Start', [['index.html', 'Overview']]],
    ['Traffic', [
      ['pageviews.html', 'Page views'],
      ['grouping.html', 'Page grouping'],
      ['campaigns.html', 'Campaigns'],
    ]],
    ['Behaviour', [
      ['actions.html', 'Actions (clicks)'],
      ['rage-clicks.html', 'Rage clicks'],
      ['events.html', 'Custom events'],
      ['goals.html', 'Goals'],
    ]],
    ['Collection', [
      ['pixel.html', 'No-script pixel'],
      ['exclude.html', 'Exclude your visits'],
      ['privacy.html', 'Privacy & consent'],
    ]],
    ['Assistants', [['ai.html', 'Ask an AI assistant']]],
  ];

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const json = (o) => JSON.stringify(o, null, 2);
  const current = location.pathname.split('/').pop() || 'index.html';

  /* ---------- Shell: header, navigation, footer ---------- */
  const header = $('[data-header]');
  if (header) {
    header.className = 'site-header';
    header.innerHTML = `<button class="menu-toggle" aria-label="Menu" aria-expanded="false">Menu</button>
      <a class="brand" href="index.html"><span class="brand-mark">V</span>Vizoalica <small>demo</small></a>
      <span class="header-spacer"></span>
      <span class="status" data-sdk-status data-state="wait">Checking SDK…</span>
      <a class="header-link" href="https://github.com/ehud-am/vizoalica">GitHub</a>`;
  }
  const nav = $('[data-nav]');
  if (nav) {
    nav.className = 'sidebar';
    nav.setAttribute('aria-label', 'Features');
    nav.innerHTML = NAV.map(([group, links]) => `<h2>${group}</h2>` + links.map(([href, label]) =>
      `<a href="${href}"${href === current ? ' aria-current="page"' : ''}>${label}</a>`).join('')).join('');
    $('.menu-toggle')?.addEventListener('click', (e) => {
      const open = nav.classList.toggle('open');
      e.currentTarget.setAttribute('aria-expanded', String(open));
    });
  }
  const footer = $('[data-footer]');
  if (footer) {
    footer.className = 'site-footer';
    footer.innerHTML = `Demo site for <a href="https://github.com/ehud-am/vizoalica">Vizoalica</a> · MIT licensed ·
      <a href="https://github.com/ehud-am/vizoalica-example">Source of this demo</a>`;
  }

  /* ---------- SDK status ---------- */
  const statusEl = $('[data-sdk-status]');
  const setStatus = (state, text) => { if (statusEl) { statusEl.dataset.state = state; statusEl.textContent = text; } };
  let tries = 0;
  const poll = () => {
    if (window.vizoalica) return setStatus('live', 'SDK connected: events are being sent');
    if (++tries > 20) return setStatus('off', 'SDK not loaded: demos run locally');
    setTimeout(poll, 250);
  };
  poll();

  /* ---------- Vizoalica rules, as documented, used by the demos ---------- */
  const redact = (text, max) => String(text)
    .replace(/\s+/g, ' ').trim()
    .replace(/[^\s@]+@[^\s@]+\.[^\s@]+/g, '[email]')
    .replace(/\d(?:[ .-]?\d){5,}/g, '[number]')
    .replace(/\b(?=[\w-]{20,}\b)(?=[\w-]*[a-z])(?=[\w-]*[A-Z])(?=[\w-]*\d)[\w-]+\b/g, '[token]')
    .slice(0, max);

  const groupSegment = (seg) => {
    if (/^\d+$/.test(seg)) return ':id';
    if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(seg)) return ':id';
    if (/^[0-9a-f]{16,}$/i.test(seg)) return ':id';
    if (/^[0-9A-HJKMNP-TV-Z]{26}$/i.test(seg)) return ':id';
    if (/^[\w-]{20,}$/.test(seg) && /[a-z]/.test(seg) && /[A-Z]/.test(seg) && /\d/.test(seg)) return ':id';
    if (seg.includes('@')) return ':id';
    return seg;
  };
  const groupPath = (path) => {
    const segs = path.split('/');
    return segs.map((seg, i) => {
      const isYear = (s) => /^(19|20)\d\d$/.test(s);
      const isMonth = (s) => /^(0?[1-9]|1[0-2])$/.test(s);
      const isDay = (s) => /^(0?[1-9]|[12]\d|3[01])$/.test(s);
      if (isYear(seg) && isMonth(segs[i + 1] || '')) return seg;
      if (isMonth(seg) && isYear(segs[i - 1] || '')) return seg;
      if (isDay(seg) && isMonth(segs[i - 1] || '') && isYear(segs[i - 2] || '')) return seg;
      return groupSegment(seg);
    }).join('/');
  };
  const pageKey = (input) => {
    let url;
    try { url = new URL(input, location.href); } catch { return null; }
    let key = groupPath(url.pathname);
    if (url.hash.startsWith('#/')) key += '#' + groupPath(url.hash.slice(1).split('?')[0]);
    return key;
  };
  window.__demo = { redact, pageKey };

  /* ---------- Helpers ---------- */
  const NAME_RE = /^[a-z][a-z0-9_]{1,63}$/;
  const SENSITIVE = /(email|pass(word)?|token|secret|card|ssn)/i;
  const track = (name, properties) => {
    if (!NAME_RE.test(name)) return { ok: false, why: 'Rejected: name must be lowercase letters, digits and underscores, start with a letter, 2 to 64 characters.' };
    const keys = Object.keys(properties || {});
    if (keys.length > 25) return { ok: false, why: 'Rejected: more than 25 properties.' };
    const bad = keys.find((k) => SENSITIVE.test(k));
    if (bad) return { ok: false, why: `Rejected: property name "${bad}" looks sensitive.` };
    const sent = !!window.vizoalica;
    window.vizoalica?.track(name, { properties });
    return { ok: true, sent, why: sent ? 'Sent to your Vizoalica backend.' : 'Accepted locally (SDK not loaded, so nothing was sent).' };
  };
  window.__track = track;

  const logTo = (list, html, cls = '') => {
    if (!list) return;
    const li = document.createElement('li');
    li.className = cls;
    li.innerHTML = html;
    list.prepend(li);
    while (list.children.length > 30) list.lastChild.remove();
  };
  const show = (el, obj) => { if (el) el.textContent = typeof obj === 'string' ? obj : json(obj); };

  /* Code blocks: add a copy button */
  $$('pre.code').forEach((pre) => {
    const wrap = document.createElement('div');
    wrap.className = 'code-wrap';
    pre.replaceWith(wrap);
    wrap.append(pre);
    if (pre.hasAttribute('data-nocopy')) return;
    const b = document.createElement('button');
    b.className = 'copy';
    b.textContent = 'Copy';
    b.addEventListener('click', async () => {
      try { await navigator.clipboard.writeText(pre.textContent); b.textContent = 'Copied'; } catch { b.textContent = 'Press ⌘/Ctrl+C'; }
      setTimeout(() => { b.textContent = 'Copy'; }, 1500);
    });
    wrap.append(b);
  });

  /* Integration popup */
  const dialog = document.createElement('dialog');
  dialog.setAttribute('aria-labelledby', 'integration-title');
  dialog.innerHTML = `<div class="dialog-head"><h2 id="integration-title"></h2><button class="dialog-close" aria-label="Close">×</button></div><div class="dialog-body"></div>`;
  document.body.append(dialog);
  $('.dialog-close', dialog).addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', (e) => { if (e.target === dialog) dialog.close(); });
  $$('[data-integration]').forEach((btn) => btn.addEventListener('click', () => {
    const tpl = document.getElementById(btn.dataset.integration);
    if (!tpl) return;
    $('#integration-title', dialog).textContent = tpl.dataset.title || 'Integration';
    const body = $('.dialog-body', dialog);
    body.replaceChildren(tpl.content.cloneNode(true));
    $$('pre.code', body).forEach((pre) => {
      const b = document.createElement('button');
      b.className = 'copy'; b.textContent = 'Copy';
      b.addEventListener('click', async () => { try { await navigator.clipboard.writeText(pre.textContent); b.textContent = 'Copied'; } catch { /* ignore */ } setTimeout(() => { b.textContent = 'Copy'; }, 1500); });
      const wrap = document.createElement('div'); wrap.className = 'code-wrap';
      pre.replaceWith(wrap); wrap.append(pre, b);
    });
    dialog.showModal();
  }));

  /* This page's key */
  $$('[data-page-key]').forEach((el) => { el.textContent = pageKey(location.href); });

  /* ---------- Demos ---------- */
  const demos = {
    pageviews() {
      const log = $('[data-log]');
      const keyOut = $('[data-current-key]');
      let last = pageKey(location.href);
      const update = (why) => {
        const key = pageKey(location.href);
        if (keyOut) keyOut.textContent = key;
        if (key !== last) { logTo(log, `<span class="yes">page view</span> ${esc(key)}`); last = key; }
        else logTo(log, `<span class="no">no page view</span> (${why}; key is still ${esc(key)})`);
      };
      window.addEventListener('hashchange', () => update('same page key'));
      if (keyOut) keyOut.textContent = last;
      $$('[data-route]').forEach((b) => b.addEventListener('click', () => { location.hash = b.dataset.route; }));
      $$('[data-query]').forEach((b) => b.addEventListener('click', () => {
        history.replaceState(null, '', `${location.pathname}?tab=${Math.floor(Math.random() * 100)}${location.hash}`);
        update('only the query changed');
      }));
    },

    grouping() {
      const input = $('[data-url]'), out = $('[data-out]'), list = $('[data-examples]');
      const run = () => { const k = pageKey(input.value); out.textContent = k === null ? 'Not a valid address' : k; };
      input.addEventListener('input', run);
      $$('[data-sample]', list).forEach((b) => b.addEventListener('click', () => { input.value = b.dataset.sample; run(); }));
      run();
    },

    actions() {
      const out = $('[data-out]'), log = $('[data-log]');
      const nameOf = (el) => {
        const pick = [
          ['data-vizoalica-action', el.getAttribute('data-vizoalica-action')],
          ['aria-label', el.getAttribute('aria-label')],
          ['visible text', el.value && el.tagName === 'INPUT' ? el.value : el.textContent],
          ['title', el.getAttribute('title')],
          ['image alt', el.querySelector('img')?.alt],
        ].find(([, v]) => v && v.trim());
        return pick ? [redact(pick[1], 80), pick[0]] : [`Unlabeled ${el.tagName === 'A' ? 'link' : 'button'}`, 'fallback'];
      };
      $$('[data-action-demo]').forEach((el) => el.addEventListener('click', (e) => {
        e.preventDefault();
        if (el.closest('[data-vizoalica-ignore]') || el.hasAttribute('data-vizoalica-ignore')) {
          show(out, 'Not recorded: this control is inside data-vizoalica-ignore.');
          logTo(log, '<span class="no">ignored</span> data-vizoalica-ignore');
          return;
        }
        const [name, source] = nameOf(el);
        const rec = { page: pageKey(location.href), name, kind: el.tagName === 'A' ? 'link' : 'button', name_source: source };
        if (el.tagName === 'A' && el.href.startsWith('http')) { const u = new URL(el.href); rec.destination = { origin: u.origin, path: groupPath(u.pathname) }; }
        show(out, rec);
        logTo(log, `<span class="yes">action</span> ${esc(name)} <span class="no">(from ${esc(source)})</span>`);
      }));
      const tryIt = $('[data-redact-in]');
      tryIt?.addEventListener('input', () => { $('[data-redact-out]').textContent = redact(tryIt.value, 80) || '(empty)'; });
    },

    rage() {
      const btn = $('[data-rage]'), log = $('[data-log]'), out = $('[data-out]');
      let clicks = [], lastBurst = 0, bursts = 0, total = 0;
      btn.addEventListener('click', (e) => {
        if (e.detail === 0) { logTo(log, '<span class="no">keyboard activation</span> never counts'); return; }
        const now = Date.now();
        total += 1;
        clicks = clicks.filter((t) => now - t <= 1000); clicks.push(now);
        logTo(log, `click ${total}`);
        if (clicks.length >= 3 && now - lastBurst >= 5000) {
          lastBurst = now; bursts += 1;
          logTo(log, '<span class="bad">RAGE CLICK</span> 3+ clicks within 1 second: one burst flagged `rage: true`');
        } else if (clicks.length >= 3) logTo(log, '<span class="no">burst suppressed</span> (max one per control every 5 s)');
        show(out, { page: pageKey(location.href), name: 'Save changes', kind: 'button', rage: bursts > 0, bursts_this_session_of_demo: bursts });
      });
    },

    events() {
      const form = $('[data-form]'), out = $('[data-out]'), res = $('[data-result]'), log = $('[data-log]');
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = form.elements.name.value.trim();
        let props;
        try { props = JSON.parse(form.elements.props.value || '{}'); } catch { res.innerHTML = '<span class="bad">Properties are not valid JSON.</span>'; return; }
        const r = track(name, props);
        show(out, { event: name, page: pageKey(location.href), properties: props });
        res.innerHTML = `<span class="${r.ok ? 'yes' : 'bad'}">${esc(r.why)}</span>`;
        logTo(log, `${r.ok ? '<span class="yes">track</span>' : '<span class="bad">rejected</span>'} ${esc(name)}`);
      });
    },

    campaigns() {
      const p = new URLSearchParams(location.search);
      const clean = (v) => {
        if (v === null) return null;
        const s = redact(v.toLowerCase(), 4096).replace(/[^a-z0-9 _\-.+:/\[\]]/g, '').slice(0, 64);
        return s || null;
      };
      const labels = { utm_source: clean(p.get('utm_source')), utm_medium: clean(p.get('utm_medium')), utm_campaign: clean(p.get('utm_campaign')) };
      const seen = Object.values(labels).some(Boolean);
      show($('[data-out]'), seen ? { page: pageKey(location.href), campaign: { source: labels.utm_source ?? '(not set)', medium: labels.utm_medium ?? '(not set)', campaign: labels.utm_campaign ?? '(not set)' } }
        : 'No utm_ labels in this address. Click one of the tagged links above.');
      const ignored = ['utm_term', 'utm_content', 'gclid', 'fbclid'].filter((k) => p.has(k));
      if (ignored.length) $('[data-dropped]').textContent = `Dropped, never stored: ${ignored.join(', ')}`;
    },

    goals() {
      const counts = { page: 0, click: 0, event: 0 };
      const render = () => { $$('[data-count]').forEach((el) => { el.textContent = counts[el.dataset.count]; }); };
      $('[data-goal-click]').addEventListener('click', () => { counts.click += 1; render(); });
      $('[data-goal-event]').addEventListener('click', () => { counts.event += 1; track('signup', { plan: 'free' }); render(); });
      $('[data-goal-page]')?.addEventListener('click', () => { counts.page += 1; render(); });
      render();
    },

    pixel() {
      const f = $('[data-form]');
      const run = () => {
        const { endpoint, key, path } = f.elements;
        const p = path.value.trim();
        const err = !p.startsWith('/') ? 'Path must start with /' : p.length > 512 ? 'Path is longer than 512 characters' : /[?#]/.test(p) ? 'Path must not contain ? or #' : '';
        const url = `https://${endpoint.value.trim() || '<ingestion-endpoint>'}/v1/pixel.gif?website=${encodeURIComponent(key.value.trim()) || '<website-key>'}&path=${p}`;
        $('[data-md]').textContent = `![](${url})`;
        $('[data-html]').textContent = `<img src="${url}" width="1" height="1" alt="">`;
        $('[data-err]').textContent = err ? `Not counted: ${err}.` : 'Valid: each load of this image is one page view.';
      };
      f.addEventListener('input', run); run();
    },

    exclude() {
      const parse4 = (s) => { const m = s.match(/^(\d+)\.(\d+)\.(\d+)\.(\d+)$/); return m && m.slice(1).every((n) => +n < 256) ? ((+m[1] << 24) | (+m[2] << 16) | (+m[3] << 8) | +m[4]) >>> 0 : null; };
      const f = $('[data-form]'), out = $('[data-out]');
      const run = () => {
        const ip = parse4(f.elements.ip.value.trim());
        if (ip === null) { out.textContent = 'Enter an IPv4 address (the real feature also supports IPv6).'; return; }
        const hit = f.elements.list.value.split('\n').map((l) => l.trim()).filter(Boolean).find((entry) => {
          const [addr, bits = '32'] = entry.split('/'); const a = parse4(addr), b = +bits;
          if (a === null || !(b >= 0 && b <= 32)) return false;
          const mask = b === 0 ? 0 : (~0 << (32 - b)) >>> 0;
          return ((ip & mask) >>> 0) === ((a & mask) >>> 0);
        });
        out.innerHTML = hit ? `<span class="no">Dropped</span> on arrival (matches ${esc(hit)}): never stored, only a per-day count is kept.` : '<span class="yes">Counted</span> like any other visit.';
      };
      f.addEventListener('input', run); run();
    },

    privacy() {
      const sel = $('[data-consent]'), out = $('[data-out]');
      const run = () => {
        const v = sel.value;
        show(out, { consent: v, page_view: 'sent', in_page_navigation_views: v === 'analytics-denied' ? 'not sent' : 'sent', note: 'data-consent records the state on every event. To send nothing for a visitor who declines, do not load the script.' });
      };
      sel.addEventListener('change', run); run();
    },
  };

  const demo = document.body.dataset.demo;
  if (demo && demos[demo]) demos[demo]();
})();
