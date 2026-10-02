/* ===== CreatorHub app: state, views, actions ===== */
(() => {
const C = CH.config;
let S = CH.store.load() || CH.seed();
S.theme = S.theme || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
const ui = { view: 'dashboard', gq: '', q: '', fp: '', fs: '', month: new Date(), ap: 'All',
  cap: { topic: '', platform: 'Instagram', tone: 'Friendly', keywords: '', n: 0, out: '' } };
const $ = s => document.querySelector(s);
const save = () => CH.store.save(S);
const uid = () => Math.random().toString(36).slice(2, 9);
const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const iso = d => d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
const today = () => iso(new Date());
const fd = s => s ? new Date(s + 'T00:00').toLocaleDateString(undefined, { day: 'numeric', month: 'short' }) : '';
const slug = s => 's-' + String(s).toLowerCase().replace(/\s/g, '');
const pill = (t, c = '') => `<span class="pill ${c}">${esc(t)}</span>`;
const opts = (a, v) => a.map(x => `<option${x === v ? ' selected' : ''}>${esc(x)}</option>`).join('');
const empty = t => `<div class="empty">${t}</div>`;
const head = (t, s, a = '') => `<div class="head"><div><h1>${t}</h1><p class="mut">${s}</p></div><div class="row">${a}</div></div>`;
const btn = (act, c, id, i, l = '') => `<button class="ico" title="${l}" aria-label="${l}" data-act="${act}" data-c="${c}" data-id="${id}">${ic(i, 16)}</button>`;

/* icons */
const I = { dashboard: 'M3 3h7v9H3zM14 3h7v5h-7zM14 12h7v9h-7zM3 16h7v5H3z', ideas: 'M9 18h6M10 21h4M12 3a6 6 0 0 0-4 10c1 1 1 2 1 3h6c0-1 0-2 1-3a6 6 0 0 0-4-10z', calendar: 'M3 5h18v16H3zM3 10h18M8 3v4M16 3v4', projects: 'M3 6h6l2 2h10v12H3z', scripts: 'M6 3h9l4 4v14H6zM9 12h7M9 16h7', captions: 'M4 5h16v11H9l-5 4z', analytics: 'M4 20V10M10 20V4M16 20v-8M22 20H2', templates: 'M12 3l9 5-9 5-9-5zM3 13l9 5 9-5', settings: 'M4 6h10M18 6h2M4 12h4M12 12h8M4 18h12M14 4v4M8 10v4M16 16v4', plus: 'M12 5v14M5 12h14', search: 'M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14zM21 21l-4-4', edit: 'M4 20h4L19 9l-4-4L4 16z', trash: 'M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13', copy: 'M9 9h11v11H9zM5 15V4h11', check: 'M5 12l5 5 9-9', sun: 'M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8zM12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5L19 19M5 19l1.5-1.5M17.5 6.5L19 5', moon: 'M20 14A8 8 0 0 1 10 4a8 8 0 1 0 10 10z', refresh: 'M20 11a8 8 0 0 0-14-4L4 9M4 4v5h5M4 13a8 8 0 0 0 14 4l2-2M20 20v-5h-5' };
function ic(k, s = 20) { return `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="${I[k]}"/></svg>`; }
const NAV = [['dashboard', 'Dashboard', 'Home'], ['ideas', 'Content Ideas', 'Ideas'], ['calendar', 'Content Calendar', 'Calendar'], ['projects', 'Projects', 'Projects'], ['scripts', 'Scripts', 'Scripts'], ['captions', 'Captions', 'Captions'], ['analytics', 'Analytics', 'Analytics'], ['templates', 'Content Templates', 'Templates'], ['settings', 'Settings', 'Settings']];

/* entities: field = [key, label, type, options] */
const P = ['platform', 'Platform', 'select', C.platforms], T = ['type', 'Content type', 'select', C.types];
const ENT = {
  ideas: { n: 'Idea', f: [['title', 'Title', 'text'], P, T, ['category', 'Category', 'select', C.categories], ['priority', 'Priority', 'select', C.priorities], ['status', 'Status', 'select', C.ideaStatus], ['notes', 'Notes', 'textarea']], def: () => ({ platform: C.platforms[0], type: C.types[0], category: C.categories[0], priority: 'Medium', status: 'Idea', added: today() }) },
  calendar: { n: 'Content', f: [['title', 'Content title', 'text'], P, T, ['status', 'Status', 'select', C.calStatus], ['date', 'Date', 'date']], def: () => ({ platform: C.platforms[0], type: C.types[0], status: 'Planned', date: today() }) },
  projects: { n: 'Project', f: [['name', 'Project name', 'text'], ['desc', 'Description', 'textarea'], ['deadline', 'Deadline', 'date'], ['total', 'Total tasks', 'number'], ['done', 'Completed tasks', 'number']], def: () => ({ total: 10, done: 0, deadline: today() }) },
  scripts: { n: 'Script', f: [['title', 'Title', 'text'], P, ['hook', 'Hook', 'textarea'], ['body', 'Main script', 'textarea'], ['cta', 'CTA', 'text'], ['status', 'Status', 'select', C.scriptStatus]], def: () => ({ platform: C.platforms[0], status: 'Draft' }) },
  tasks: { n: 'Task', f: [['text', 'Task', 'text']], def: () => ({ done: false }) }
};

/* modal + form */
const modal = h => { const m = $('#modal'); m.innerHTML = `<div class="sheet">${h}</div>`; m.hidden = false; };
const close = () => { $('#modal').hidden = true; };
function toast(m) { const t = $('#toast'); t.textContent = m; t.className = 'toast show'; setTimeout(() => t.className = 'toast', 1600); }
async function copy(t) { try { await navigator.clipboard.writeText(t); } catch (e) { const a = document.createElement('textarea'); a.value = t; document.body.append(a); a.select(); document.execCommand('copy'); a.remove(); } toast('Copied to clipboard'); }
function openForm(coll, id, preset) {
  const E = ENT[coll], rec = id ? S[coll].find(x => x.id === id) : { ...E.def(), ...preset };
  const fields = E.f.map(([k, l, t, o]) => `<label class="fld${t === 'textarea' || ['title', 'name', 'text'].includes(k) ? ' wide' : ''}"><span>${l}</span>${t === 'select' ? `<select name="${k}">${opts(o, rec[k])}</select>` : t === 'textarea' ? `<textarea name="${k}" rows="3">${esc(rec[k])}</textarea>` : `<input name="${k}" type="${t}" value="${esc(rec[k])}"${t === 'text' ? ' required' : ''}>`}</label>`).join('');
  modal(`<form id="f"><h3>${id ? 'Edit' : 'New'} ${E.n}</h3><div class="grid2">${fields}</div><div class="row end"><button type="button" class="btn ghost" data-act="close">Cancel</button><button class="btn">Save</button></div></form>`);
  $('#f').onsubmit = e => {
    e.preventDefault();
    const v = Object.fromEntries(new FormData(e.target));
    E.f.forEach(([k, , t]) => { if (t === 'number') v[k] = Math.max(0, +v[k] || 0); });
    if (coll === 'projects' && v.done > v.total) v.done = v.total;
    id ? Object.assign(rec, v) : S[coll].unshift({ id: uid(), ...rec, ...v });
    save(); close(); render();
  };
}

/* charts */
function stacked(w) {
  const mx = Math.max(1, ...w.map(o => o.Planned + o.Created + o.Published));
  return `<svg viewBox="0 0 500 200" class="chart" role="img" aria-label="Weekly content progress">${[0, 1, 2, 3].map(i => `<line x1="30" x2="490" y1="${20 + i * 45}" y2="${20 + i * 45}" class="grid"/>`).join('')}${w.map((o, i) => { let y = 155; return `<g>${['Published', 'Created', 'Planned'].map(s => { const h = o[s] / mx * 135; y -= h; return h ? `<rect class="b-${s}" x="${55 + i * 88}" y="${y}" width="48" height="${h}" rx="6"/>` : ''; }).join('')}<text x="${79 + i * 88}" y="178" class="axis">Week ${i + 1}</text></g>`; }).join('')}</svg>`;
}
function line(a, id, col) {
  const mx = Math.max(...a), mn = Math.min(...a) * .9, X = i => 30 + i * (440 / (a.length - 1)), Y = v => 160 - (v - mn) / ((mx - mn) || 1) * 130;
  const pts = a.map((v, i) => `${X(i)},${Y(v)}`).join(' ');
  return `<svg viewBox="0 0 500 190" class="chart"><defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${col}" stop-opacity=".3"/><stop offset="1" stop-color="${col}" stop-opacity="0"/></linearGradient></defs><polygon points="${X(0)},160 ${pts} ${X(a.length - 1)},160" fill="url(#${id})"/><polyline points="${pts}" fill="none" stroke="${col}" stroke-width="3" stroke-linejoin="round"/>${a.map((v, i) => `<circle cx="${X(i)}" cy="${Y(v)}" r="3.5" fill="${col}"/><text x="${X(i)}" y="182" class="axis">W${i + 1}</text>`).join('')}</svg>`;
}

/* views */
const V = {};
V.dashboard = () => {
  const cal = S.calendar, cnt = l => cal.filter(x => l.includes(x.status)).length, n = new Date();
  const dow = (n.getDay() + 6) % 7, ws = new Date(n); ws.setDate(n.getDate() - dow); const we = new Date(ws); we.setDate(ws.getDate() + 6);
  const wk = cal.filter(x => x.date >= iso(ws) && x.date <= iso(we)).length;
  const ym = today().slice(0, 7), mo = cal.filter(x => x.date.startsWith(ym)), pub = mo.filter(x => x.status === 'Published').length, pct = mo.length ? Math.round(pub / mo.length * 100) : 0;
  const w = [0, 1, 2, 3, 4].map(() => ({ Planned: 0, Created: 0, Published: 0 }));
  mo.forEach(x => w[Math.min(4, Math.floor((+x.date.slice(8) - 1) / 7))][x.status]++);
  const up = cal.filter(x => x.date >= today() && x.status !== 'Published').sort((a, b) => a.date.localeCompare(b.date)).slice(0, 5);
  const hr = n.getHours(), g = hr < 12 ? 'Good morning' : hr < 18 ? 'Good afternoon' : 'Good evening';
  return head(`${g}, ${esc(S.user.name)}`, 'Here is where your content stands today.', `<button class="btn" data-act="add" data-c="calendar">+ Schedule content</button>`) +
  `<div class="stats">${[['Content ideas', S.ideas.length], ['Content planned', cnt(['Planned'])], ['Videos created', cnt(['Created', 'Published'])], ['Videos published', cnt(['Published'])], ["This week's content", wk]].map(([l, v]) => `<div class="card stat"><b>${v}</b><span>${l}</span></div>`).join('')}<div class="card stat"><b>${pct}%</b><span>Monthly progress (${pub}/${mo.length} published)</span><div class="bar thin"><i style="width:${pct}%"></i></div></div></div>` +
  `<div class="cols"><div class="card"><h3>Content progress this month</h3>${stacked(w)}<div class="legend">${['Planned', 'Created', 'Published'].map(s => `<span><i class="b-${s}" style="background:${{ Planned: '#bdb6ff', Created: '#3b82f6', Published: '#10b981' }[s]}"></i>${s}</span>`).join('')}</div></div>` +
  `<div class="card"><h3>Today's Tasks</h3><ul class="tasks">${S.tasks.map(t => `<li class="${t.done ? 'done' : ''}"><button class="chk" aria-label="Toggle task" data-act="ttask" data-id="${t.id}">${t.done ? ic('check', 14) : ''}</button><span>${esc(t.text)}</span>${btn('del', 'tasks', t.id, 'trash', 'Delete')}</li>`).join('') || '<li class="mut">No tasks yet.</li>'}</ul><button class="btn ghost sm" data-act="add" data-c="tasks">+ Add task</button></div></div>` +
  `<div class="cols3"><div class="card"><h3>Upcoming Content</h3>${up.map(x => `<div class="list-row" style="margin-bottom:10px"><b class="sm" style="width:52px">${fd(x.date)}</b><div class="grow"><div>${esc(x.title)}</div><span class="mut sm">${esc(x.platform)} · ${esc(x.type)}</span></div>${pill(x.status, slug(x.status))}</div>`).join('') || '<p class="mut">Nothing scheduled.</p>'}</div>` +
  `<div class="card"><h3>Recent Projects</h3>${S.projects.slice(0, 3).map(p => { const q = p.total ? Math.round(p.done / p.total * 100) : 0; return `<div style="margin-bottom:14px"><div class="row between"><b>${esc(p.name)}</b><span class="mut sm">${q}%</span></div><div class="bar thin"><i style="width:${q}%"></i></div></div>`; }).join('') || '<p class="mut">No projects yet.</p>'}</div></div>`;
};

const ideaRows = () => {
  const q = ui.q.toLowerCase(), L = S.ideas.filter(i => (!ui.fp || i.platform === ui.fp) && (!ui.fs || i.status === ui.fs) && (!q || (i.title + i.notes + i.category).toLowerCase().includes(q)));
  return L.map(i => `<div class="idea ${i.status === 'Completed' ? 'done' : ''}"><button class="chk" title="Mark completed" aria-label="Mark completed" data-act="tidea" data-id="${i.id}">${i.status === 'Completed' ? ic('check', 14) : ''}</button><div class="grow"><b>${esc(i.title)}</b><p class="mut">${esc(i.notes)}</p><div class="chips">${pill(i.platform)}${pill(i.type)}${pill(i.category)}${pill(i.priority + ' priority', 'pr-' + i.priority)}<span class="mut sm">Added ${fd(i.added)}</span></div></div><select class="mini" aria-label="Status" data-chg="ideas" data-id="${i.id}">${opts(C.ideaStatus, i.status)}</select>${btn('edit', 'ideas', i.id, 'edit', 'Edit')}${btn('del', 'ideas', i.id, 'trash', 'Delete')}</div>`).join('') || empty('No ideas match. Try clearing filters or add a new idea.');
};
V.ideas = () => head('Content Ideas', 'Capture every idea, then move it toward published.', `<button class="btn" data-act="add" data-c="ideas">+ Add idea</button>`) +
  `<div class="filters"><input data-f="q" value="${esc(ui.q)}" placeholder="Search ideas…" aria-label="Search ideas"><select data-f="fp" aria-label="Platform"><option value="">All platforms</option>${opts(C.platforms, ui.fp)}</select><select data-f="fs" aria-label="Status"><option value="">All statuses</option>${opts(C.ideaStatus, ui.fs)}</select></div><div id="list">${ideaRows()}</div>`;

V.calendar = () => {
  const m = ui.month, y = m.getFullYear(), mo = m.getMonth(), start = (new Date(y, mo, 1).getDay() + 6) % 7, days = new Date(y, mo + 1, 0).getDate(), cells = Math.ceil((start + days) / 7) * 7, t = today();
  let g = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(d => `<div class="dow">${d}</div>`).join('');
  for (let i = 0; i < cells; i++) {
    const dn = i - start + 1; if (dn < 1 || dn > days) { g += '<div class="cell off"></div>'; continue; }
    const ds = iso(new Date(y, mo, dn)), it = S.calendar.filter(x => x.date === ds);
    g += `<div class="cell${ds === t ? ' today' : ''}" data-act="addcal" data-v="${ds}"><span class="dn">${dn}</span>${it.slice(0, 3).map(x => `<button class="ev ${slug(x.status)}" data-act="edit" data-c="calendar" data-id="${x.id}" title="${esc(x.title)} · ${esc(x.platform)} · ${esc(x.type)} · ${x.status}"><b>${esc(x.title)}</b><i>${esc(x.platform)} · ${esc(x.type)} · ${x.status}</i></button>`).join('')}${it.length > 3 ? `<small class="mut">+${it.length - 3} more</small>` : ''}</div>`;
  }
  return head(m.toLocaleDateString(undefined, { month: 'long', year: 'numeric' }), 'Click a day to plan content, or a card to edit it.',
    `<button class="btn ghost" data-act="cal" data-v="-1" aria-label="Previous month">‹ Prev</button><button class="btn ghost" data-act="cal" data-v="0">Today</button><button class="btn ghost" data-act="cal" data-v="1" aria-label="Next month">Next ›</button><button class="btn" data-act="add" data-c="calendar">+ Add Content</button>`) +
    `<div class="cal">${g}</div><div class="legend">${C.calStatus.map(s => `<span>${pill(s, slug(s))}</span>`).join('')}</div>`;
};

V.projects = () => head('Projects', 'Track campaigns and goals through to the deadline.', `<button class="btn" data-act="add" data-c="projects">+ New project</button>`) +
  `<div class="cards">${S.projects.map(p => { const q = p.total ? Math.round(p.done / p.total * 100) : 0; return `<article class="card proj"><div class="row between"><h3>${esc(p.name)}</h3><div>${btn('edit', 'projects', p.id, 'edit', 'Edit')}${btn('del', 'projects', p.id, 'trash', 'Delete')}</div></div><p class="mut">${esc(p.desc)}</p><div class="bar"><i style="width:${q}%"></i></div><div class="row between sm"><b>${q}%</b><span class="mut">${p.done} of ${p.total} tasks done</span></div><div class="row between" style="margin-top:12px">${pill('Due ' + fd(p.deadline))}<div class="row"><button class="btn ghost sm" aria-label="Undo task" data-act="prog" data-id="${p.id}" data-v="-1">−</button><button class="btn sm" data-act="prog" data-id="${p.id}" data-v="1">Complete task</button></div></div></article>`; }).join('') || empty('No projects yet.')}</div>`;

V.scripts = () => head('Scripts', 'Write, polish and reuse your scripts.', `<button class="btn" data-act="add" data-c="scripts">+ Create script</button>`) +
  `<div class="cards">${S.scripts.map(s => `<article class="card"><div class="row between"><h3>${esc(s.title)}</h3>${pill(s.status, slug(s.status))}</div><div class="chips">${pill(s.platform)}</div><p class="lbl">Hook</p><p class="clamp">${esc(s.hook)}</p><p class="lbl">Main script</p><p class="clamp">${esc(s.body)}</p><p class="lbl">CTA</p><p class="clamp">${esc(s.cta)}</p><div class="row" style="margin-top:14px"><button class="btn ghost sm" data-act="edit" data-c="scripts" data-id="${s.id}">Edit</button><button class="btn ghost sm" data-act="copyscript" data-id="${s.id}">Copy</button><button class="btn ghost sm" data-act="del" data-c="scripts" data-id="${s.id}">Delete</button></div></article>`).join('') || empty('No scripts yet.')}</div>`;

/* demo caption generator: swap make() for an AI API call later */
const TONES = {
  Professional: ['A practical look at {t}: what works, what does not, and how to apply it today.', 'Insights on {t} to help you work smarter. Save this for your next planning session.', '{t}, simplified. Three takeaways worth your attention.'],
  Friendly: ['Let us talk {t}! 👋 Here is what I have learned so far. Tell me yours below.', 'A quick one on {t} I wish someone told me sooner ✨', 'Your sign to finally try {t} 💛 Drop a comment if you are in!'],
  Funny: ['Me pretending I have {t} figured out 😅 (I do not.) Tell me I am not alone.', 'Nobody: … Me at 2 AM researching {t} 😂 Send this to your friend who does the same.', '{t} is easy, they said. It was not. 🙃'],
  Inspirational: ['Start where you are. {t} is a journey, and every small step counts. 🌱', 'Your {t} story is still being written. Make the next chapter count. ✨', 'Progress over perfection. Keep showing up for {t}. 💪'],
  Bold: ['Stop scrolling. {t} will change how you create. Here is why. 🔥', 'Unpopular opinion: most people get {t} completely wrong.', 'Do {t} better than everyone else. Here is the playbook. ⚡']
};
const ENDS = { Instagram: '\n\nDouble-tap if this helped and save it 📌', YouTube: '\n\nWatch the full video and subscribe for more.', TikTok: '\n\nFollow for part 2.', LinkedIn: '\n\nWhat would you add? Share your view below.' };
function make() {
  const c = ui.cap, a = TONES[c.tone], t = c.topic.trim() || 'your topic';
  const tags = [...c.keywords.split(','), c.platform.split(' ')[0]].map(k => k.trim().replace(/\s+/g, '')).filter(Boolean).map(k => '#' + k).join(' ');
  return a[c.n % a.length].replace('{t}', t) + (ENDS[c.platform] || '\n\nFollow for more.') + '\n\n' + tags;
}
V.captions = () => head('Captions', 'Generate caption ideas for any post.') +
  `<div class="capgrid"><div class="card capform"><label>Topic<input data-cap="topic" value="${esc(ui.cap.topic)}" placeholder="e.g. morning routine"></label><label>Platform<select data-cap="platform">${opts(C.platforms, ui.cap.platform)}</select></label><label>Tone<select data-cap="tone">${opts(Object.keys(TONES), ui.cap.tone)}</select></label><label>Keywords (comma separated)<input data-cap="keywords" value="${esc(ui.cap.keywords)}" placeholder="productivity, creator"></label><button class="btn" data-act="gen">Generate caption</button></div>` +
  `<div class="card"><h3>Result</h3><div class="banner">Demo captions from built-in samples. No AI service is connected yet.</div>${ui.cap.out ? `<div class="out">${esc(ui.cap.out)}</div><div class="row"><button class="btn" data-act="copycap">${ic('copy', 15)} Copy</button><button class="btn ghost" data-act="regen">${ic('refresh', 15)} Regenerate</button></div>` : empty('Enter a topic and generate your first caption.')}</div></div>`;

V.analytics = () => {
  const A = CH.analytics, Ps = ui.ap === 'All' ? Object.keys(A) : [ui.ap], ser = k => Array.from({ length: 8 }, (_, i) => Ps.reduce((s, p) => s + A[p][k][i], 0)), tot = k => ser(k).reduce((a, b) => a + b, 0), f = n => n.toLocaleString();
  const v = tot('views'), l = tot('likes'), c = tot('comments'), sh = tot('shares'), fol = ser('followers')[7], eng = ((l + c + sh) / v * 100).toFixed(1);
  const vs = ser('views'), gr = ((vs[7] / vs[6] - 1) * 100).toFixed(1), mx = Math.max(l, c, sh);
  return head('Analytics', 'Eight-week performance overview.', `<div class="seg">${['All', 'Instagram', 'YouTube'].map(p => `<button class="${ui.ap === p ? 'on' : ''}" data-act="afilter" data-v="${p}">${p === 'All' ? 'All Platforms' : p}</button>`).join('')}</div>`) +
  `<div class="banner">Demo / sample data (trial version). Real analytics can be connected later.</div><div class="stats">${[['Views', f(v), `${gr > 0 ? '+' : ''}${gr}% vs last week`], ['Likes', f(l)], ['Comments', f(c)], ['Shares', f(sh)], ['Followers', f(fol)], ['Engagement rate', eng + '%']].map(([a, b, s]) => `<div class="card stat"><b>${b}</b><span>${a}${s ? ' · ' + s : ''}</span></div>`).join('')}</div>` +
  `<div class="cols3"><div class="card"><h3>Views per week</h3>${line(vs, 'g1', '#5b4bff')}</div><div class="card"><h3>Follower growth</h3>${line(ser('followers'), 'g2', '#00c2a8')}</div><div class="card"><h3>Interactions</h3>${[['Likes', l], ['Comments', c], ['Shares', sh]].map(([a, b]) => `<div style="margin:18px 0"><div class="row between"><b>${a}</b><span class="mut">${f(b)}</span></div><div class="bar thin"><i style="width:${b / mx * 100}%"></i></div></div>`).join('')}</div></div>`;
};

V.templates = () => head('Content Templates', 'Start from a proven structure.') +
  `<div class="cards">${S.templates.map(t => `<article class="card"><h3>${esc(t.name)}</h3><p class="lbl">Hook</p><p>${esc(t.hook)}</p><p class="lbl">Structure</p><ol style="padding-left:18px;font-size:13px">${t.structure.map(s => `<li>${esc(s)}</li>`).join('')}</ol><p class="lbl">CTA</p><p>${esc(t.cta)}</p><button class="btn sm" style="margin-top:14px" data-act="usetpl" data-id="${t.id}">Use Template</button></article>`).join('')}</div>`;

V.settings = () => head('Settings', 'Preferences and your data.') +
  `<div class="cols3"><div class="card"><h3>Profile</h3><label class="fld"><span>Your name</span><input data-name value="${esc(S.user.name)}"></label></div><div class="card"><h3>Appearance</h3><div class="seg">${['light', 'dark'].map(m => `<button class="${S.theme === m ? 'on' : ''}" data-act="theme" data-v="${m}">${m[0].toUpperCase() + m.slice(1)}</button>`).join('')}</div></div><div class="card"><h3>Your data</h3><p class="mut sm">Stored only in this browser.</p><div class="row" style="margin-top:12px"><button class="btn ghost sm" data-act="export">Export JSON</button><button class="btn ghost sm" data-act="reset">Reset to sample data</button></div></div></div>`;

V.search = () => {
  const q = ui.gq.toLowerCase().trim(), m = (...a) => a.join(' ').toLowerCase().includes(q);
  const g = [['Ideas', 'ideas', S.ideas.filter(i => m(i.title, i.notes, i.category, i.platform)), i => i.title, i => `${i.platform} · ${i.type}`, 'edit'], ['Projects', 'projects', S.projects.filter(p => m(p.name, p.desc)), p => p.name, p => p.desc, 'edit'], ['Scripts', 'scripts', S.scripts.filter(s => m(s.title, s.hook, s.body)), s => s.title, s => s.platform, 'edit'], ['Templates', 'templates', S.templates.filter(t => m(t.name, t.hook)), t => t.name, t => t.hook, 'usetpl']];
  const n = g.reduce((a, x) => a + x[2].length, 0);
  return head('Search', `${n} result${n === 1 ? '' : 's'} for “${esc(ui.gq)}”`) + (g.map(([l, c, L, t, s, a]) => L.length ? `<h3 class="grp">${l}</h3>${L.map(x => `<button class="res" data-act="${a}" data-c="${c}" data-id="${x.id}"><b>${esc(t(x))}</b><span class="mut">${esc(s(x))}</span></button>`).join('')}` : '').join('') || empty('Nothing found. Try another keyword.'));
};

/* render */
function render() {
  document.documentElement.dataset.theme = S.theme;
  const nav = NAV.map(([k, l, s]) => `<button class="nv${ui.view === k && !ui.gq ? ' on' : ''}" data-act="nav" data-v="${k}">${ic(k)}<span>${ui.mobile ? s : l}</span></button>`);
  $('#nav').innerHTML = nav.join('');
  $('#tabbar').innerHTML = NAV.map(([k, l, s]) => `<button class="nv${ui.view === k && !ui.gq ? ' on' : ''}" data-act="nav" data-v="${k}">${ic(k, 22)}<span>${s}</span></button>`).join('');
  $('#si').innerHTML = ic('search', 18);
  $('#theme').innerHTML = ic(S.theme === 'dark' ? 'sun' : 'moon');
  $('#view').innerHTML = ui.gq.trim() ? V.search() : V[ui.view]();
}

/* actions */
const mk = () => { if (!ui.cap.topic.trim()) return toast('Enter a topic first'), false; ui.cap.out = make(); render(); };
const A = {
  nav: (c, i, v) => { ui.view = v; ui.gq = ''; $('#gs').value = ''; render(); scrollTo(0, 0); },
  add: c => openForm(c), edit: (c, i) => openForm(c, i), addcal: (c, i, v) => openForm('calendar', null, { date: v }), close,
  del: (c, i) => { if (confirm('Delete this item?')) { S[c] = S[c].filter(x => x.id !== i); save(); render(); } },
  theme: (c, i, v) => { S.theme = v || (S.theme === 'dark' ? 'light' : 'dark'); save(); render(); },
  quick: () => modal(`<h3>Quick Add</h3><div class="grid2">${[['ideas', '💡 Idea'], ['calendar', '📅 Scheduled content'], ['scripts', '📝 Script'], ['projects', '📁 Project'], ['tasks', '✅ Task']].map(([c, l]) => `<button class="btn ghost" data-act="add" data-c="${c}">${l}</button>`).join('')}</div>`),
  tidea: (c, i) => { const x = S.ideas.find(y => y.id === i); x.status = x.status === 'Completed' ? 'Idea' : 'Completed'; save(); render(); },
  ttask: (c, i) => { const x = S.tasks.find(y => y.id === i); x.done = !x.done; save(); render(); },
  prog: (c, i, v) => { const p = S.projects.find(y => y.id === i); p.done = Math.min(p.total, Math.max(0, p.done + +v)); save(); render(); },
  cal: (c, i, v) => { const m = ui.month; ui.month = v === '0' ? new Date() : new Date(m.getFullYear(), m.getMonth() + +v, 1); render(); },
  usetpl: (c, i) => { const t = S.templates.find(y => y.id === i); openForm('scripts', null, { title: t.name, hook: t.hook, body: t.structure.map((s, n) => `${n + 1}. ${s}`).join('\n'), cta: t.cta }); },
  copyscript: (c, i) => { const s = S.scripts.find(y => y.id === i); copy(`${s.title}\n\nHOOK:\n${s.hook}\n\nSCRIPT:\n${s.body}\n\nCTA:\n${s.cta}`); },
  gen: () => { ui.cap.n = 0; mk(); }, regen: () => { ui.cap.n++; mk(); }, copycap: () => copy(ui.cap.out),
  afilter: (c, i, v) => { ui.ap = v; render(); },
  export: () => { const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([JSON.stringify(S, null, 2)], { type: 'application/json' })); a.download = 'creatorhub-data.json'; a.click(); },
  reset: () => { if (confirm('Reset everything to the sample data?')) { S = { ...CH.seed(), theme: S.theme }; save(); render(); } }
};
document.addEventListener('click', e => {
  if (e.target.id === 'modal') return close();
  const b = e.target.closest('[data-act]'); if (!b) return;
  const d = b.dataset; (A[d.act] || (() => { }))(d.c, d.id, d.v);
});
document.addEventListener('input', e => {
  const t = e.target, d = t.dataset;
  if (d.f) { ui[d.f] = t.value; $('#list').innerHTML = ideaRows(); }
  else if (d.cap) ui.cap[d.cap] = t.value;
  else if (d.name !== undefined) { S.user.name = t.value; save(); }
  else if (t.id === 'gs') { ui.gq = t.value; render(); }
});
document.addEventListener('change', e => {
  const t = e.target; if (!t.dataset.chg) return;
  S[t.dataset.chg].find(y => y.id === t.dataset.id).status = t.value; save(); render();
});
document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });

render();
})();
