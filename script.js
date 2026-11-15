(function () {
  'use strict';

  const d = (y, m, day) => new Date(y, m - 1, day);

  const DEADLINES = [
    { title: 'Certificate requests, October batch', date: d(2026, 11, 25), kind: 'certificate' },
    { title: 'Winter internship applications', date: d(2026, 11, 30), kind: 'internship' },
    { title: 'Final project submission, September batch', date: d(2026, 12, 5), kind: 'course' },
    { title: 'January batch enrollment', date: d(2026, 12, 15), kind: 'course' },
    { title: 'Internship interim report', date: d(2026, 12, 22), kind: 'internship' }
  ];

  const COURSES = [
    { title: 'Full-Stack Web Development', meta: '12 weeks · HTML, CSS, JavaScript, Node.js, databases' },
    { title: 'Python for Data Science', meta: '8 weeks · Python, pandas, visualization, SQL' },
    { title: 'Machine Learning Foundations', meta: '10 weeks · regression, classification, model evaluation' },
    { title: 'Cloud & DevOps Essentials', meta: '8 weeks · Linux, Git, CI/CD, containers' },
    { title: 'UI/UX Design Basics', meta: '6 weeks · research, wireframes, prototyping' }
  ];

  const INTERNSHIPS = [
    { title: 'Web Development Intern', meta: '8 to 12 weeks · remote · live project with a mentor' },
    { title: 'Data Analyst Intern', meta: '8 weeks · remote · dashboards and reporting' },
    { title: 'Machine Learning Intern', meta: '12 weeks · remote · model building and evaluation' },
    { title: 'UI/UX Design Intern', meta: '6 weeks · remote · design sprints with the product team' }
  ];

  const CERT_STEPS = [
    'Finish all course modules and submit the final project.',
    'Make sure your attendance is at least 75%.',
    'Open the student portal, go to Certificates and tap Request.',
    'Wait 3 to 5 working days while the team verifies your record.',
    'Download the PDF certificate. It carries a verification ID that employers can check.'
  ];

  const FALLBACK_TEXT =
    'I\'m sorry, I can only help with student courses, internships, deadlines, and certificates. Please contact the helpdesk.';

  const MENU_CHIPS = ['Courses', 'Internships', 'Upcoming Deadlines', 'Certificate Process'];

  const fmtDate = (dt) => dt.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  const startOfDay = (dt) => new Date(dt.getFullYear(), dt.getMonth(), dt.getDate());
  const daysLeft = (dt) => Math.round((startOfDay(dt) - startOfDay(new Date())) / 86400000);

  function badgeFor(dt) {
    const n = daysLeft(dt);
    if (n < 0) return { text: 'Closed', cls: 'closed' };
    if (n === 0) return { text: 'Today', cls: 'soon' };
    return { text: n + (n === 1 ? ' day left' : ' days left'), cls: n <= 14 ? 'soon' : '' };
  }

  const INTENTS = [
    { id: 'deadlines',    words: ['deadline', 'last date', 'due', 'closing', 'closes', 'cutoff', 'cut off', 'submit by', 'dates', 'date', 'schedule', 'timeline'] },
    { id: 'internships',  words: ['intern', 'placement', 'stipend', 'work experience', 'job', 'eligib'] },
    { id: 'courses',      words: ['course', 'class', 'program', 'syllabus', 'curriculum', 'learn', 'enrol', 'batch', 'python', 'web dev', 'full stack', 'machine learning', 'data science', 'cloud', 'devops', 'design', 'duration'] },
    { id: 'certificates', words: ['certif', 'diploma', 'completion', 'verif', 'credential', 'hard copy', 'download'] }
  ];

  function detectIntent(raw) {
    const text = ' ' + raw.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();
    if (/^\s*(hi|hello|hey|hii|namaste|good (morning|afternoon|evening))\b/.test(text)) return 'greeting';
    if (/\b(thanks|thank you|thx|thankyou)\b/.test(text)) return 'thanks';

    const dateBonus = /\b(deadline|last date|due|closing|closes|cutoff|cut off|submit by)/.test(text) ? 2 : 0;

    let best = null, bestScore = 0;
    for (const intent of INTENTS) {
      let score = intent.words.reduce((n, w) => n + (new RegExp('\\b' + w).test(text) ? 1 : 0), 0);
      if (intent.id === 'deadlines') score += dateBonus;
      if (score > bestScore) { best = intent.id; bestScore = score; }
    }
    if (best) return best;
    if (/\b(help|menu|options|what can you do)\b/.test(text)) return 'menu';
    return 'fallback';
  }

  function respond(query) {
    const q = query.toLowerCase();
    switch (detectIntent(query)) {
      case 'greeting':
        return { text: 'Hi, welcome to the Skillinf Student Helpdesk. I can help with courses, internships, deadlines and certificates. What would you like to know?', chips: MENU_CHIPS };
      case 'thanks':
        return { text: 'You\'re welcome. Ask me anything else about your courses, internships, deadlines or certificates.', chips: ['Upcoming Deadlines', 'Certificate Process'] };
      case 'menu':
        return { text: 'Here is what I can help with. Pick a topic or type your own question.', chips: MENU_CHIPS };
      case 'courses':
        return {
          text: 'We currently run five career-focused courses. Every course includes live mentor sessions, assignments and a final project.',
          items: COURSES.map((c) => ({ title: c.title, meta: c.meta })),
          chips: ['Internships', 'January batch deadline', 'Certificate Process']
        };
      case 'internships':
        return {
          text: 'Internships are open to students who have completed at least one course module. Apply from the student portal with your resume, then take a short skills assessment and an interview.',
          items: INTERNSHIPS.map((i) => ({ title: i.title, meta: i.meta })),
          chips: ['Internship Deadlines', 'Courses']
        };
      case 'deadlines': {
        let list = DEADLINES, intro = 'Here are the upcoming deadlines, soonest first.';
        if (/intern/.test(q)) { list = DEADLINES.filter((x) => x.kind === 'internship'); intro = 'These are the internship deadlines, soonest first.'; }
        else if (/certif/.test(q)) { list = DEADLINES.filter((x) => x.kind === 'certificate'); intro = 'This is the certificate deadline.'; }
        else if (/(course|enrol|batch|project)/.test(q)) { list = DEADLINES.filter((x) => x.kind === 'course'); intro = 'These are the course deadlines, soonest first.'; }
        return {
          text: intro,
          items: list.slice().sort((a, b) => a.date - b.date).map((x) => ({ title: x.title, meta: fmtDate(x.date), badge: badgeFor(x.date) })),
          note: 'Dates are sample data for this demo. Confirm final dates on the student portal.',
          chips: ['Internships', 'Certificate Process']
        };
      }
      case 'certificates':
        return {
          text: 'You can get your certificate in five steps. Hard copies are available on request after your digital certificate is issued.',
          steps: CERT_STEPS,
          chips: ['Certificate deadline', 'Courses']
        };
      default:
        return { text: FALLBACK_TEXT, chips: MENU_CHIPS };
    }
  }

  const svg = (inner) =>
    '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
    'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + inner + '</svg>';

  const ICONS = {
    book: svg('<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>'),
    briefcase: svg('<rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>'),
    calendar: svg('<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>'),
    award: svg('<circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/>')
  };

  const TOPICS = [
    { label: 'Courses',      desc: 'Programs, duration and what you will learn', query: 'What courses are available?', icon: 'book' },
    { label: 'Internships',  desc: 'Tracks, eligibility and how to apply',       query: 'Tell me about internships',   icon: 'briefcase' },
    { label: 'Deadlines',    desc: 'Upcoming dates, soonest first',              query: 'Upcoming deadlines',          icon: 'calendar' },
    { label: 'Certificates', desc: 'Steps to request and download yours',        query: 'How do I get my certificate?', icon: 'award' }
  ];

  const QUICK_CHIPS = ['Courses', 'Internships', 'Internship Deadlines', 'Certificate Process', 'Upcoming Deadlines'];

  const $ = (id) => document.getElementById(id);
  const root = document.documentElement;
  const messages = $('messages'), chatLog = $('chatLog'), input = $('chatInput'),
        sendBtn = $('sendBtn'), counter = $('counter'), form = $('chatForm'),
        statusText = $('statusText'), chipRail = $('chipRail'), welcome = $('welcome'),
        topicGrid = $('topicGrid'), toBottom = $('toBottom'), themeBtn = $('themeBtn'),
        sunIcon = $('sunIcon'), moonIcon = $('moonIcon'), resetBtn = $('resetBtn');

  const MAX = 300;
  const IDLE_STATUS = 'Online · replies instantly';
  let busy = false;
  let typingEl = null;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(pointer: fine)').matches;

  function scrollToEnd() {
    chatLog.scrollTo({ top: chatLog.scrollHeight, behavior: reduceMotion ? 'auto' : 'smooth' });
  }
  function updateToBottom() {
    const gap = chatLog.scrollHeight - chatLog.scrollTop - chatLog.clientHeight;
    toBottom.hidden = gap < 140;
  }
  const timeNow = () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  function el(tag, cls, text) {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }

  function makeChip(label, cls) {
    const b = el('button', cls + ' rounded-full px-3.5 py-1.5 text-sm font-medium', label);
    b.type = 'button';
    b.addEventListener('click', () => sendMessage(label));
    return b;
  }

  function avatar() {
    const a = el('div', 'brand-mark mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg font-display text-sm font-bold', 'S');
    a.setAttribute('aria-hidden', 'true');
    return a;
  }

  function addUser(text) {
    const row = el('div', 'msg-in flex flex-col items-end gap-1');
    row.append(
      el('div', 'bubble-user max-w-[85%] whitespace-pre-wrap break-words px-4 py-2.5', text),
      el('span', 'muted text-[11px]', timeNow())
    );
    messages.append(row);
  }

  function addBot(reply) {
    const row = el('div', 'msg-in flex items-start gap-2.5');
    const col = el('div', 'flex min-w-0 max-w-[90%] flex-col items-start gap-1');
    const bubble = el('div', 'bubble-bot w-full px-4 py-3');
    bubble.append(el('p', 'break-words', reply.text));

    if (reply.items) {
      const list = el('ul', 'list-panel');
      reply.items.forEach((it) => {
        const li = el('li', 'flex items-start justify-between gap-3');
        const left = el('div', 'min-w-0');
        left.append(el('div', 'text-sm font-semibold break-words', it.title), el('div', 'muted text-[13px] break-words', it.meta));
        li.append(left);
        if (it.badge) li.append(el('span', 'badge ' + it.badge.cls + ' shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold', it.badge.text));
        list.append(li);
      });
      bubble.append(list);
    }

    if (reply.steps) {
      const ol = el('ol', 'list-panel');
      reply.steps.forEach((s, i) => {
        const li = el('li', 'flex items-start gap-3');
        li.append(
          el('span', 'step-num flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold', String(i + 1)),
          el('span', 'text-sm break-words', s)
        );
        ol.append(li);
      });
      bubble.append(ol);
    }

    if (reply.note) bubble.append(el('p', 'muted mt-3 text-xs', reply.note));

    col.append(bubble);
    if (reply.chips && reply.chips.length) {
      const wrap = el('div', 'mt-1 flex flex-wrap gap-2');
      reply.chips.forEach((c) => wrap.append(makeChip(c, 'chip-inline')));
      col.append(wrap);
    }
    col.append(el('span', 'muted text-[11px]', timeNow()));
    row.append(avatar(), col);
    messages.append(row);
  }

  function showTyping() {
    typingEl = el('div', 'msg-in flex items-start gap-2.5');
    const bubble = el('div', 'bubble-bot flex items-center gap-1.5 px-4 py-3.5');
    bubble.setAttribute('role', 'status');
    bubble.setAttribute('aria-label', 'Skillinf Helpdesk is typing');
    bubble.append(el('span', 'dot'), el('span', 'dot'), el('span', 'dot'));
    typingEl.append(avatar(), bubble);
    messages.append(typingEl);
    statusText.textContent = 'Typing…';
    scrollToEnd();
  }
  function hideTyping() {
    if (typingEl) typingEl.remove();
    typingEl = null;
    statusText.textContent = IDLE_STATUS;
  }

  function syncSend() { sendBtn.disabled = busy || input.value.trim().length === 0; }
  function syncCounter() {
    const n = input.value.length;
    counter.textContent = n + ' / ' + MAX;
    counter.classList.toggle('warn', n >= 270);
  }
  function setBusy(v) { busy = v; syncSend(); }

  function sendMessage(raw) {
    const text = (raw || '').trim().slice(0, MAX);
    if (!text || busy) return;

    welcome.hidden = true;
    addUser(text);
    input.value = '';
    syncCounter();
    setBusy(true);
    scrollToEnd();

    const reply = respond(text);
    setTimeout(showTyping, 250);
    setTimeout(() => {
      hideTyping();
      addBot(reply);
      setBusy(false);
      scrollToEnd();
      updateToBottom();
      if (finePointer) input.focus({ preventScroll: true });
    }, 900 + Math.random() * 600);
  }

  function resetChat() {
    if (busy) return;
    messages.replaceChildren();
    welcome.hidden = false;
    chatLog.scrollTo({ top: 0 });
    updateToBottom();
  }

  function isDark() {
    const t = root.getAttribute('data-theme');
    if (t) return t === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }
  function syncThemeIcon() {
    sunIcon.hidden = !isDark();
    moonIcon.hidden = isDark();
  }
  try {
    const saved = localStorage.getItem('skillinf-theme');
    if (saved === 'light' || saved === 'dark') root.setAttribute('data-theme', saved);
  } catch (e) { }

  themeBtn.addEventListener('click', () => {
    const next = isDark() ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    try { localStorage.setItem('skillinf-theme', next); } catch (e) { }
    syncThemeIcon();
  });

  TOPICS.forEach((t) => {
    const card = el('button', 'topic');
    card.type = 'button';
    const icon = el('span', 'topic-icon');
    icon.innerHTML = ICONS[t.icon];
    const body = el('span', 'flex min-w-0 flex-col gap-0.5');
    body.append(el('span', 'topic-title', t.label), el('span', 'topic-desc', t.desc));
    card.append(icon, body);
    card.addEventListener('click', () => sendMessage(t.query));
    topicGrid.append(card);
  });

  QUICK_CHIPS.forEach((c) => chipRail.append(makeChip(c, 'chip')));

  form.addEventListener('submit', (e) => { e.preventDefault(); sendMessage(input.value); });
  input.addEventListener('input', () => { syncCounter(); syncSend(); });
  resetBtn.addEventListener('click', resetChat);
  toBottom.addEventListener('click', scrollToEnd);
  chatLog.addEventListener('scroll', updateToBottom, { passive: true });

  syncThemeIcon();
  syncCounter();
  syncSend();
  updateToBottom();
})();
