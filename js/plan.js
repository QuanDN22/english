// Lộ trình IELTS: ghép WEEKS_BASE (plan-data.js) với nội dung theo ngôn ngữ (content/*.js),
// dựng lịch từng ngày, và lưu tiến độ trong localStorage.
// Mọi chữ hiển thị lấy qua t() từ locales/*.js.

const START_KEY = "ielts-plan-start";
const DONE_KEY = "ielts-plan-done";
const DAY_MS = 86400000;

// ---------- Lưu trữ ----------
function readStore(key, fallback) {
  try {
    const v = localStorage.getItem(key);
    return v === null ? fallback : JSON.parse(v);
  } catch {
    return fallback;
  }
}
function writeStore(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* chế độ ẩn danh hoặc bị chặn — trang vẫn chạy, chỉ không nhớ tiến độ */
  }
}

let startDate = readStore(START_KEY, null); // "YYYY-MM-DD", luôn là thứ Hai
let done = readStore(DONE_KEY, {}); // taskId -> ngày đánh dấu "YYYY-MM-DD"
let WEEKS = []; // dựng trong initPlan(), sau khi đã chọn ngôn ngữ

// ---------- Ngày tháng (giờ địa phương) ----------
const pad = (n) => String(n).padStart(2, "0");
const toISO = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const fromISO = (s) => {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
};
const addDays = (d, n) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
const mondayOf = (d) => addDays(d, -((d.getDay() + 6) % 7));
const fmtDate = (d) => `${pad(d.getDate())}/${pad(d.getMonth() + 1)}`;
const today = () => {
  const n = new Date();
  return new Date(n.getFullYear(), n.getMonth(), n.getDate());
};
const dayName = (d) => t("days")[d];
const phaseName = (p) => t("phase." + p);
const phaseShort = (p) => t("phaseShort." + p);

function planPosition() {
  if (!startDate) return null;
  const idx = Math.round((today() - fromISO(startDate)) / DAY_MS);
  return { idx, week: Math.floor(idx / 7), day: ((idx % 7) + 7) % 7 };
}
function dateOf(week, day) {
  return startDate ? addDays(fromISO(startDate), week * 7 + day) : null;
}

// ---------- Chữ ghép từ dữ liệu ----------
function satText(w) {
  const mode = w.satMode || (w.phase === 1 ? "p1" : w.phase === 2 ? "p2" : "full");
  const [b, tn] = w.test || [];
  const text = t("sat." + mode, { b, t: tn });
  return w.satNote ? `${text} — ${w.satNote}` : text;
}
function t1Text(w) {
  if (!w.t1) return "";
  return w.t1.rewrite
    ? t("t1.rewrite", { b: w.t1.rewrite[0], t: w.t1.rewrite[1], w: w.t1.rewrite[2] })
    : t("t1.test", { b: w.t1.test[0], t: w.t1.test[1] });
}
const t2Type = (w) => (w.t2 ? t("t2." + w.t2.type) : "");

// ---------- Khối xây dựng task ----------
// Mỗi task: { b: "am"|"pm"|"eve" (buổi), m: số phút, tag: "optional"|"todo"|"allDay"|"busy", h: tiêu đề, s: các bước, l: khóa tài liệu }
function task(b, m, key, params = {}, l, extra = {}) {
  const tx = t("task." + key, params);
  const body = tx && typeof tx === "object" ? tx : { h: String(tx), s: [] };
  return { b, m, h: body.h, s: (body.s || []).concat(extra.more || []), l, tag: extra.tag, opt: extra.opt, min: extra.min };
}
const SEGMENTS = [["0:00", "1:30"], ["1:30", "3:00"], ["3:00", "4:30"], ["4:30", "6:00"]];
const TED_SEGMENTS = [["0:00", "1:00"], ["1:00", "2:00"], ["2:00", "3:00"], ["3:00", "4:00"], ["4:00", "5:00"]];

const flash = () => task("am", 10, "flash", {}, ["notebook"]);
const busy = () => task(null, 15, "busy", {}, undefined, { tag: "busy", min: true });
const dictation = (w, d) => task("am", 20, "dictation", { a: SEGMENTS[d][0], z: SEGMENTS[d][1] }, [w.six]);
const shadow6 = (w) => task("am", 20, "shadow6", {}, [w.six]);
const review = (moreKey) => task("eve", 40, "review", {}, undefined, { more: moreKey ? [t(moreKey)] : [] });
const fixMistakes = () => task("eve", 60, "fixMistakes");
const fun = () => task(null, 0, "fun", {}, undefined, { tag: "optional", opt: true });
const sunday = () => [
  task(null, 10, "sunFlash", {}, ["notebook"]),
  task(null, 10, "sunPreview"),
  task(null, 0, "sunFun", {}, undefined, { tag: "optional", opt: true }),
];
const grammarTask = (w, lastKey) =>
  w.gLinks.length
    ? task("eve", 40, "grammar", { grammar: w.grammar, gNote: w.gNote, last: t(lastKey) }, w.gLinks)
    : task("eve", 40, "grammarReview", { grammar: w.grammar, gNote: w.gNote }, w.gLinks);
const speakingSteps = (w, withP3) => {
  const s = [t("speak.p1", { q: w.sp.p1.join(" / ") })];
  if (w.sp.p2) s.push(t("speak.p2", { q: w.sp.p2 }));
  if (withP3 && w.sp.p3 && w.sp.p3.length) s.push(t("speak.p3", { q: w.sp.p3.join(" / ") }));
  s.push(t("speak.redo"));
  return s;
};
const withSteps = (tk, steps) => ({ ...tk, s: steps });

// ---------- Giai đoạn 1 ----------
function phase1Day(w, d) {
  const col = w.col.join(" · ");
  switch (d) {
    case 0:
      return [flash(), dictation(w, 0),
        grammarTask(w, "last.p1"),
        task("eve", 30, "p1.vocab", { topic: w.topic, col }, [w.six, "collocDict", "oxfordDict"]),
        task("eve", 20, "p1.listenAll", {}, [w.six])];
    case 1:
      return [flash(), dictation(w, 1),
        task("eve", 45, "p1.read", {}, [w.read]),
        task("eve", 15, "p1.analyse"),
        task("eve", 30, "p1.summary")];
    case 2:
      return [flash(), dictation(w, 2),
        task("eve", 15, "p1.pron", {}, w.pron),
        task("eve", 20, "p1.shadow", {}, [w.six]),
        withSteps(task("eve", 40, "p1.speak", {}, w.n === 1 ? ["spP1Topics", "fmtS"] : []), speakingSteps(w, false)),
        task("eve", 15, "p1.grammarRedo", {}, w.gLinks.filter((k) => k.startsWith("bc")))];
    case 3:
      return [flash(), dictation(w, 3),
        task("eve", 45, "p1.journal", { journal: w.journal }),
        task("eve", 25, "p1.fix"),
        task("eve", 20, "p1.useCol", { col })];
    case 4:
      return [flash(),
        task("am", 20, "p1.relisten", {}, [w.six]),
        task("eve", 30, "p1.listenMore", {}, [w.listen]),
        task("eve", 20, "p1.ted", {}, [w.ted]),
        review("more.p1Review")];
    case 5:
      if (w.satMode === "fullLR") {
        return [task("am", 100, "p1.finalTest", { sat: satText(w) }), fixMistakes(), task("eve", 20, "p1.compare")];
      }
      return [
        task("am", 20, "p1.skillVid", {}, w.skill),
        task("am", 45, "p1.test", { sat: satText(w) }),
        fixMistakes(),
        task("pm", 15, "p1.relistenT"),
        fun(),
      ];
    default:
      return sunday();
  }
}

// ---------- Giai đoạn 2 ----------
function phase2Day(w, d) {
  const morning = d <= 1 ? dictation(w, d) : shadow6(w);
  const col = w.col.join(" · ");
  switch (d) {
    case 0:
      return [flash(), morning,
        grammarTask(w, "last.p2"),
        task("eve", 30, "p2.vocab", { topic: w.topic, col }, [w.six, "opal", "collocDict"]),
        task("eve", 20, "p2.listenAll", {}, [w.six])];
    case 1: {
      const t1 = w.t1 || { links: [] };
      return [flash(), morning,
        task("eve", 35, "p2.read", {}, [w.read]),
        ...(w.rskill && w.rskill.length ? [task("eve", 15, "p2.rskill", {}, w.rskill)] : []),
        task("eve", 40, t1.links.length ? "p2.t1" : "p2.t1rewrite", { cam: t1Text(w) }, t1.links)];
    }
    case 2:
      return [flash(), morning,
        task("eve", 10, "p2.pron", {}, w.pron),
        task("eve", 10, "p2.speakVid", {}, w.speakVid),
        withSteps(task("eve", 50, "p2.speak", {}, ["bdS"]), speakingSteps(w, true)),
        task("eve", 20, "p2.redoP2")];
    case 3:
      return [flash(), morning,
        task("eve", 10, "p2.model", { type: t2Type(w) }, w.t2.links),
        task("eve", 40, "p2.t2", { prompt: w.t2.prompt }),
        task("eve", 25, "p2.t2fix", {}, ["bdW"]),
        task("eve", 15, "p2.t2rewrite")];
    case 4:
      return [flash(), morning,
        task("eve", 30, "p2.listenMore", {}, [w.listen]),
        task("eve", 20, "p2.ted", {}, [w.ted]),
        review()];
    case 5:
      if (w.satMode === "full") {
        return [task("am", 160, "p2.fullTest", { sat: satText(w) }), fixMistakes(), task("eve", 30, "p2.fixW", {}, ["bdW"])];
      }
      if (w.satMode === "fullLR") {
        return [task("am", 95, "p2.lrTest", { sat: satText(w) }), fixMistakes(), ...(w.extra && w.extra[5] ? [] : [fun()])];
      }
      return [
        ...(w.satVid && w.satVid.length ? [task("am", 15, "p2.satVid", {}, w.satVid)] : []),
        task("am", 60, "p2.test", { sat: satText(w) }),
        fixMistakes(),
        task("pm", 15, "p2.relistenT"),
      ];
    default:
      return sunday();
  }
}

// ---------- Giai đoạn 3 ----------
function phase3Day(w, d) {
  const prev = WEEKS[w.n - 1];
  const seg = TED_SEGMENTS[d] || TED_SEGMENTS[0];
  const morning = task("am", 20, "p3.shadow", { a: seg[0], z: seg[1] }, [prev.ted]);
  switch (d) {
    case 0:
      return [flash(), morning,
        grammarTask(w, "last.p3"),
        task("eve", 30, "p3.listen", {}, [w.listen]),
        task("eve", 20, "p3.vocab", { topic: w.topic, col: w.col.join(" · ") }, [w.six, "collocDict"])];
    case 1:
      return [flash(), morning,
        task("eve", 45, "p3.read", {}, [w.read, "conversation"]),
        task("eve", 25, "p3.paraphrase"),
        task("eve", 20, "p3.opal", {}, ["opal"])];
    case 2:
      return [flash(), morning,
        withSteps(task("eve", 45, "p3.mock", {}, ["bdS"]), [...speakingSteps(w, true), t("more.p3Mock")]),
        w.n === 27 ? task("eve", 30, "p3.intonation", {}, w.gLinks) : task("eve", 30, "p3.pronShadow", {}, [prev.ted]),
        task("eve", 15, "p3.redo")];
    case 3:
      return [flash(), morning,
        task("eve", 20, "p3.t1rewrite"),
        task("eve", 40, "p3.t2", { type: t2Type(w), prompt: w.t2.prompt }, w.t2.links),
        task("eve", 30, "p3.fix", {}, ["bdW"])];
    case 4:
      return [flash(), morning,
        task("eve", 45, "p3.ted", {}, [w.ted]),
        review("more.p3Review")];
    case 5:
      if (w.satMode === "rest") return [task(null, 0, "rest", {}, undefined, { tag: "allDay", opt: true })];
      return [
        task("am", 160, "p3.fullTest", { sat: satText(w) }),
        fixMistakes(),
        task("eve", 30, "p3.fixW", {}, ["bdW"]),
        task(null, 20, "p3.partner", {}, ["speakSample"], { tag: "optional", opt: true }),
      ];
    default:
      return sunday();
  }
}

// ---------- Tuần đặc biệt ----------
function week0Day(d) {
  return [
    [
      task("eve", 30, "w0.format", {}, ["fmtL", "fmtR", "fmtW", "fmtS"]),
      task("eve", 30, "w0.tools", {}, ["notebook", "anki"]),
      task("eve", 15, "w0.habit"),
      task("eve", 15, "w0.env"),
    ],
    [task("eve", 90, "w0.lr", {}, ["famTest", "famInfo"])],
    [task("eve", 60, "w0.w", {}, ["famTest"]), task("eve", 20, "w0.s", {}, ["speakSample"])],
    [task("eve", 60, "w0.self", {}, ["bdW", "bdS", "writeSample"]), task("eve", 30, "w0.diff", {}, ["diff67"])],
    [task("eve", 30, "w0.scores"), task(null, 0, "w0.books", {}, undefined, { tag: "todo" })],
    [task(null, 10, "w0.start", {}, ["notebook", "ox3000"]), fun()],
    sunday(),
  ][d];
}

function week32Day(w, d) {
  return [
    [flash(), task("eve", 60, "w32.top10"), task("eve", 30, "w32.p2")],
    [task("eve", 160, "w32.rehearsal", {}, ["famTest"])],
    [flash(), task("eve", 40, "w32.fix"), task("eve", 20, "w32.mock", {}, ["speakSample"])],
    [flash(), task("eve", 30, "w32.light", {}, [w.six, "t32", "t32b"]), task(null, 40, "w32.t2", { prompt: w.t2.prompt }, w.t2.links, { tag: "optional", opt: true })],
    [flash(), task("eve", 20, "w32.logistics")],
    [task(null, 0, "rest", {}, undefined, { tag: "allDay", opt: true })],
    [task(null, 10, "w32.sunday")],
  ][d];
}

// ---------- Lịch một ngày ----------
function tasksFor(weekNo, d) {
  const w = WEEKS[weekNo];
  let tasks;
  if (w.n === 0) tasks = week0Day(d);
  else if (w.n === 32) tasks = week32Day(w, d);
  else if (w.override && w.override[d]) tasks = w.override[d];
  else if (w.phase === 1) tasks = phase1Day(w, d);
  else if (w.phase === 2) tasks = phase2Day(w, d);
  else tasks = phase3Day(w, d);
  if (w.extra && w.extra[d]) tasks = tasks.concat(w.extra[d]);
  if (d < 6 && w.n !== 0) tasks = tasks.concat([busy()]);
  // id giữ nguyên cách đánh số cũ để không mất tiến độ đã lưu
  return tasks.map((tk, i) => ({ ...tk, id: tk.min ? `${w.n}-${d}-min` : `${w.n}-${d}-${i}` }));
}

// ---------- Tiến độ & chuỗi ngày ----------
const counted = (tk) => !tk.min && !tk.opt;
const minutesOf = (tk) => tk.m || 0;
function dayProgress(weekNo, d) {
  const ts = tasksFor(weekNo, d);
  const main = ts.filter(counted);
  return {
    total: main.length,
    checked: main.filter((tk) => done[tk.id]).length,
    minDone: ts.some((tk) => tk.min && done[tk.id]),
    left: main.filter((tk) => !done[tk.id]).reduce((sum, tk) => sum + minutesOf(tk), 0),
  };
}
function weekProgress(weekNo) {
  let total = 0, checked = 0;
  for (let d = 0; d < 7; d++) {
    const p = dayProgress(weekNo, d);
    total += p.total;
    checked += p.checked;
  }
  return { total, checked };
}
function planProgress() {
  let total = 0, checked = 0;
  WEEKS.forEach((w) => {
    const p = weekProgress(w.n);
    total += p.total;
    checked += p.checked;
  });
  return { total, checked };
}
function streakInfo() {
  const days = new Set(Object.values(done));
  const td = today();
  let cursor = days.has(toISO(td)) ? td : addDays(td, -1);
  let streak = 0;
  while (days.has(toISO(cursor))) {
    streak++;
    cursor = addDays(cursor, -1);
  }
  return {
    streak,
    doneToday: days.has(toISO(td)),
    missedYesterday: days.size > 0 && !days.has(toISO(addDays(td, -1))),
    total: days.size,
  };
}

function fmtMinutes(m) {
  const h = Math.floor(m / 60), r = m % 60;
  if (!h) return t("fmt.min", { n: r });
  return r ? t("fmt.hmin", { h, n: r }) : t("fmt.h", { h });
}
const pct = (p) => (p.total ? Math.round((p.checked / p.total) * 100) : 0);

// Việc được nhóm theo buổi: đúng với cách gắn thói quen (sáng trước giờ làm, tối sau bữa tối).
const BLOCKS = ["am", "pm", "eve", "other"];
const blockOf = (tk) => (tk.b ? tk.b : "other");
function timeLabel(tk, inBlock) {
  const dur = tk.m ? fmtMinutes(tk.m) : "";
  if (inBlock && tk.b) return dur;
  const head = tk.b ? t("time." + tk.b) : tk.tag ? t("tag." + tk.tag) : "";
  return [head, dur].filter(Boolean).join(" · ");
}

// ---------- Hiển thị: phần tử cơ bản ----------
const $ = (sel) => document.querySelector(sel);
const el = (tag, cls, text) => {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (text !== undefined) e.textContent = text;
  return e;
};

let viewWeek = 0;
let viewDay = 0;
let scrollToDay = false; // mở từ link "Xem ngày mai" → cuộn tới chi tiết ngày đó

function resTitle(k) {
  return I18N.own("res.title." + k, R[k][0]); // tiêu đề gốc là tiếng Anh, chỉ thay khi ngôn ngữ đang chọn có bản dịch
}
function resMeta(k) {
  const [, , src, extra] = R[k];
  const detail = typeof extra === "number" ? t("fmt.min", { n: extra }) : extra ? t("res.kind." + extra) : "";
  return [src, detail].filter(Boolean).join(" · ");
}
function linkList(keys) {
  const ul = el("ul", "links");
  (keys || []).forEach((k) => {
    if (!R[k]) {
      console.warn("Thiếu tài liệu:", k);
      return;
    }
    const li = el("li");
    const a = el("a", "", resTitle(k));
    a.href = R[k][1];
    if (!R[k][1].startsWith("#")) {
      a.target = "_blank";
      a.rel = "noopener";
    }
    li.append(a, el("span", "meta", " · " + resMeta(k)));
    ul.append(li);
  });
  return ul;
}

function bar(p) {
  const b = el("div", "bar");
  const f = el("div", "fill");
  f.style.width = pct(p) + "%";
  b.append(f);
  return b;
}

function toggleTask(id, on) {
  if (on) done[id] = toISO(today());
  else delete done[id];
  writeStore(DONE_KEY, done);
  renderPlan();
  const again = document.querySelector(`.panel.active input[data-id="${id}"]`);
  if (again) again.focus({ preventScroll: true });
}

function renderTask(tk, inBlock) {
  const box = el("div", "task" + (tk.min ? " task-min" : "") + (tk.opt ? " task-opt" : "") + (done[tk.id] ? " is-done" : ""));
  const label = el("label", "task-head");
  const cb = el("input");
  cb.type = "checkbox";
  cb.dataset.id = tk.id;
  cb.checked = !!done[tk.id];
  cb.addEventListener("change", () => toggleTask(tk.id, cb.checked));
  label.append(cb, el("span", "task-title", tk.h), el("span", "task-time", timeLabel(tk, inBlock)));
  box.append(label);
  if (tk.s && tk.s.length) {
    const ul = el("ul", "steps");
    tk.s.forEach((s) => ul.append(el("li", "", s)));
    box.append(ul);
  }
  if (tk.l && tk.l.length) box.append(linkList(tk.l));
  return box;
}

function renderBlocks(container, tasks) {
  const main = tasks.filter((tk) => !tk.min);
  BLOCKS.forEach((key) => {
    const items = main.filter((tk) => blockOf(tk) === key);
    if (!items.length) return;
    const mins = items.filter((tk) => !tk.opt).reduce((sum, tk) => sum + minutesOf(tk), 0);
    const sec = el("section", "block");
    const h = el("h3", "block-title");
    h.append(el("span", "", t("block." + key)));
    if (mins) h.append(el("span", "block-time", fmtMinutes(mins)));
    sec.append(h);
    items.forEach((tk) => sec.append(renderTask(tk, key !== "other")));
    container.append(sec);
  });
  const min = tasks.find((tk) => tk.min);
  if (min) {
    const sec = el("section", "block block-min");
    sec.append(el("h3", "block-title", t("block.busyTitle")));
    sec.append(renderTask(min, false));
    container.append(sec);
  }
}

// Thẻ chọn ngày bắt đầu (mục Cài đặt, và mục Hôm nay khi chưa chọn)
function startCard(title) {
  const card = el("div", "card setup");
  card.append(el("h2", "", title));
  card.append(el("p", "muted", t("settings.startNote")));
  const row = el("div", "setup-row");
  const input = el("input");
  input.type = "date";
  input.setAttribute("aria-label", t("settings.start"));
  input.value = startDate || toISO(addDays(today(), (8 - today().getDay()) % 7)); // thứ Hai gần nhất
  const btn = el("button", "primary", t("settings.save"));
  btn.type = "button";
  btn.addEventListener("click", () => setStart(input.value));
  row.append(input, btn);
  card.append(row);
  return card;
}

function stat(value, label) {
  const s = el("div", "stat");
  s.append(el("span", "stat-value", value), el("span", "stat-label", label));
  return s;
}

// Mở mục Lộ trình ở đúng tuần/ngày (dùng cho "Xem cả tuần", "Xem ngày mai").
function openDay(weekNo, d, scroll) {
  viewWeek = weekNo;
  viewDay = d;
  scrollToDay = scroll;
  if (location.hash === "#week") renderWeek();
  else location.hash = "week";
}
function dayLink(text, weekNo, d, scroll) {
  const a = el("a", "more-link", text);
  a.href = "#week";
  a.addEventListener("click", (e) => {
    e.preventDefault();
    openDay(weekNo, d, scroll);
  });
  return a;
}
const rangeOf = (weekNo) => {
  const a = dateOf(weekNo, 0), z = dateOf(weekNo, 6);
  return a ? `${fmtDate(a)} – ${fmtDate(z)}` : "";
};
function factsList(pairs) {
  const dl = el("dl", "facts");
  pairs.forEach(([k, v]) => {
    if (v) dl.append(el("dt", "", k), el("dd", "", v));
  });
  return dl;
}

// ---------- Hôm nay ----------
function renderToday() {
  const root = $("#today-body");
  root.innerHTML = "";
  const pos = planPosition();
  if (!pos || pos.idx < 0 || pos.week >= WEEKS.length) {
    const head = el("div", "page-head");
    head.append(el("p", "eyebrow", t("today.eyebrow")), el("h1", "", t("nav.today")));
    root.append(head);
    if (!pos) root.append(startCard(t("today.pickStart")));
    else if (pos.idx < 0) root.append(el("p", "card", t("today.notStarted", { date: fmtDate(fromISO(startDate)) })));
    else root.append(el("p", "card", t("today.finished")));
    return;
  }

  const w = WEEKS[pos.week];
  const tasks = tasksFor(pos.week, pos.day);
  const p = dayProgress(pos.week, pos.day);
  const s = streakInfo();

  const head = el("div", "card today-head");
  const titles = el("div", "today-titles");
  titles.append(
    el("p", "eyebrow", t("week.eyebrow", { phase: phaseName(w.phase), n: w.n })),
    el("h1", "", `${dayName(pos.day)}, ${fmtDate(today())}`),
    el("p", "muted", w.title),
  );
  const stats = el("div", "stats");
  const s1 = stat(`${p.checked}/${p.total}`, t("today.tasks"));
  s1.append(bar(p));
  stats.append(s1, stat(p.left ? fmtMinutes(p.left) : t("today.done"), p.left ? t("today.left") : t("today.doneLabel")));
  head.append(titles, stats);
  if (!s.doneToday && s.missedYesterday) head.append(el("p", "warn", t("today.missed")));
  root.append(head);

  const grid = el("div", "today-grid");
  const main = el("div", "today-main");
  renderBlocks(main, tasks);

  const rail = el("aside", "today-rail");
  const wk = el("div", "card");
  wk.append(el("p", "eyebrow", t("today.thisWeek")), el("h3", "", w.title));
  if (w.grammar && w.n > 0 && w.n < 32) wk.append(factsList([[t("facts.grammar"), w.grammar], [t("facts.topic"), w.topic]]));
  const wp = weekProgress(pos.week);
  const prog = el("div", "progress");
  prog.append(bar(wp), el("span", "muted", `${pct(wp)}%`));
  wk.append(prog, dayLink(t("today.seeWeek"), pos.week, pos.day, false));
  rail.append(wk);

  if (w.col) {
    const c = el("div", "card");
    c.append(el("p", "eyebrow", t("today.phrases")));
    const chips = el("div", "chips");
    w.col.forEach((x) => chips.append(el("span", "chip", x)));
    c.append(chips);
    rail.append(c);
  }
  if (w.test) {
    const c = el("div", "card");
    c.append(el("p", "eyebrow", t("today.saturday")), el("p", "", satText(w)));
    rail.append(c);
  }
  const nextIdx = pos.idx + 1;
  const nw = Math.floor(nextIdx / 7), nd = nextIdx % 7;
  if (nw < WEEKS.length) {
    const c = el("div", "card");
    c.append(el("p", "eyebrow", t("today.tomorrow", { day: dayName(nd) })));
    const ul = el("ul", "steps compact");
    tasksFor(nw, nd).filter(counted).forEach((tk) => ul.append(el("li", "", tk.h)));
    c.append(ul, dayLink(t("today.seeTomorrow"), nw, nd, true));
    rail.append(c);
  }

  grid.append(main, rail);
  root.append(grid);
}

// ---------- Lộ trình: khung chọn tuần (phải) ----------
function arrow(text, label, disabled, onClick) {
  const b = el("button", "arrow", text);
  b.type = "button";
  b.setAttribute("aria-label", label);
  b.title = label;
  b.disabled = disabled;
  b.addEventListener("click", onClick);
  return b;
}

function renderPicker() {
  const box = $("#week-picker");
  box.innerHTML = "";
  const pos = planPosition();
  const current = pos && pos.week >= 0 && pos.week < WEEKS.length ? pos.week : null;
  const w = WEEKS[viewWeek];
  const go = (n) => {
    viewWeek = n;
    viewDay = current === n ? pos.day : 0;
    renderWeek();
  };

  const card = el("div", "card picker-card");
  const navRow = el("div", "picker-nav");
  const label = el("div", "picker-label");
  label.append(
    el("span", "picker-week", t("week.label", { n: w.n })),
    el("span", "picker-title", w.title), // chỉ hiện trên màn hình hẹp, nơi phần đầu tuần nằm ở cuối trang
    el("span", "picker-range", [rangeOf(viewWeek), phaseShort(w.phase)].filter(Boolean).join(" · ")),
  );
  navRow.append(
    arrow("←", t("week.prev"), viewWeek === 0, () => go(viewWeek - 1)),
    label,
    arrow("→", t("week.next"), viewWeek === WEEKS.length - 1, () => go(viewWeek + 1)),
  );
  card.append(navRow);

  // 33 ô: toàn cảnh lộ trình, màu theo giai đoạn, đầy dần theo tiến độ; bấm để nhảy tuần
  const cells = el("div", "tl");
  WEEKS.forEach((x) => {
    let cls = `tl-cell phase-${x.phase}`;
    if (current === x.n) cls += " is-current";
    if (viewWeek === x.n) cls += " is-view";
    const b = el("button", cls);
    b.type = "button";
    b.style.setProperty("--fill", pct(weekProgress(x.n)) + "%");
    b.title = t("week.cellTitle", { n: x.n, title: x.title });
    b.setAttribute("aria-label", b.title);
    b.addEventListener("click", () => go(x.n));
    cells.append(b);
  });
  card.append(cells);

  const foot = el("div", "picker-foot");
  const legend = el("div", "tl-legend");
  [0, 1, 2, 3].forEach((ph) => {
    const item = el("span", `legend-item phase-${ph}`);
    item.append(el("i"), document.createTextNode(t("legend." + ph)));
    legend.append(item);
  });
  foot.append(legend, el("span", "muted", t("week.planPct", { p: pct(planProgress()) })));
  card.append(foot);
  if (current !== null && current !== viewWeek) {
    const back = el("button", "link-btn", t("week.back", { n: current }));
    back.type = "button";
    back.addEventListener("click", () => go(current));
    card.append(back);
  }
  box.append(card);

  // Thứ Hai … Chủ Nhật
  const list = el("div", "day-list");
  list.setAttribute("role", "tablist");
  list.setAttribute("aria-label", t("week.days"));
  for (let d = 0; d < 7; d++) {
    const p = dayProgress(viewWeek, d);
    const date = dateOf(viewWeek, d);
    let cls = "day-btn";
    if (d === viewDay) cls += " active";
    if (p.total && p.checked === p.total) cls += " is-done";
    const b = el("button", cls);
    b.type = "button";
    b.setAttribute("role", "tab");
    b.setAttribute("aria-selected", String(d === viewDay));
    const name = el("span", "day-name", dayName(d));
    if (current === viewWeek && pos.day === d) name.append(el("span", "day-today", " · " + t("week.today")));
    b.append(name, el("span", "day-meta", (date ? fmtDate(date) + " · " : "") + `${p.checked}/${p.total}`), bar(p));
    b.addEventListener("click", () => { viewDay = d; renderWeek(); });
    list.append(b);
  }
  box.append(list);
  return list;
}

// ---------- Lộ trình: nội dung tuần & ngày (trái) ----------
function renderWeek() {
  const list = renderPicker();
  const root = $("#week-body");
  root.innerHTML = "";
  const w = WEEKS[viewWeek];

  const head = el("div", "card week-head");
  head.append(el("p", "eyebrow", t("week.eyebrow", { phase: phaseName(w.phase), n: w.n })), el("h1", "", w.title));
  if (w.note) head.append(el("p", "", w.note));
  if (w.n > 0 && w.n < 32) {
    head.append(factsList([
      [t("facts.grammar"), w.grammar],
      [t("facts.topic"), w.topic],
      [t("facts.phrases"), w.col.join(" · ")],
      [t("facts.task2"), t2Type(w)],
      [t("facts.saturday"), satText(w)],
    ]));
  }
  if (w.gNote && w.n !== 0) {
    const det = el("details", "gnote");
    det.open = window.innerWidth >= 1100;
    det.append(el("summary", "", t("week.gnote")), el("p", "note", w.gNote));
    head.append(det);
  }
  const wp = weekProgress(viewWeek);
  const prog = el("div", "progress");
  prog.append(bar(wp), el("span", "muted", t("week.progress", { c: wp.checked, t: wp.total, p: pct(wp) })));
  head.append(prog);

  const detail = el("div", "day-detail");
  const date = dateOf(viewWeek, viewDay);
  const dh = el("div", "day-detail-head");
  dh.append(el("h2", "", dayName(viewDay) + (date ? ", " + fmtDate(date) : "")));
  const total = tasksFor(viewWeek, viewDay).filter(counted).reduce((sum, tk) => sum + minutesOf(tk), 0);
  if (total) dh.append(el("span", "muted", t("week.total", { d: fmtMinutes(total) })));
  detail.append(dh);
  renderBlocks(detail, tasksFor(viewWeek, viewDay));

  root.append(head, detail);

  // Màn hình hẹp: danh sách ngày cuộn ngang, đưa ngày đang chọn vào tầm nhìn.
  const active = list.querySelector(".active");
  if (active && list.scrollWidth > list.clientWidth) list.scrollLeft = active.offsetLeft - list.offsetLeft - 8;
  if (scrollToDay) {
    scrollToDay = false;
    detail.scrollIntoView({ block: "start" });
  }
}

// ---------- Sidebar (máy tính) ----------
function renderSide() {
  const box = $("#side-extra");
  if (!box) return;
  box.innerHTML = "";
  const card = el("div", "side-card");
  const pos = planPosition();
  if (!pos) {
    const a = el("a", "", t("side.pickStart"));
    a.href = "#settings";
    card.append(a);
  } else {
    const s = streakInfo();
    const all = planProgress();
    card.append(el("span", "side-streak", `🔥 ${s.streak}`), el("span", "muted", t("side.streak")));
    const inPlan = pos.week >= 0 && pos.week < WEEKS.length;
    card.append(el("p", "side-week", inPlan ? t("side.week", { n: pos.week, phase: phaseShort(WEEKS[pos.week].phase) }) : t("side.outside")));
    card.append(bar(all), el("span", "muted", t("week.planPct", { p: pct(all) })));
  }
  box.append(card);
}

// ---------- Tài liệu ----------
const LIB = [
  ["tools", ["notebook", "anki", "oxfordDict", "collocDict", "ox3000", "opal"]],
  ["official", ["famTest", "famInfo", "sampleQ", "speakSample", "writeSample", "bdW", "bdS", "diff67", "fmtL", "fmtR", "fmtW", "fmtS"]],
  ["practice", ["liz100", "lizT1", "lizT2", "lizP1", "lizP2", "modelOpinion", "modelDiscussion", "modelSolution", "modelAdv", "modelDirect"]],
  ["extra", ["tews", "bcMag", "conversation"]],
];
function renderLibrary() {
  const root = $("#lib-body");
  root.innerHTML = "";

  const books = el("div", "card");
  books.append(el("h2", "", t("lib.books")), el("p", "muted", t("lib.booksNote")));
  const ul = el("ul", "steps");
  BOOKS.forEach(([b, w]) => ul.append(el("li", "", t("lib.bookItem", { b, w, extra: b === 20 ? t("lib.book20") : "" }))));
  books.append(ul);
  root.append(books);

  [["lib.promptW", "prompt.writing"], ["lib.promptS", "prompt.speaking"]].forEach(([title, key]) => {
    const text = t(key);
    const card = el("div", "card");
    card.append(el("h2", "", t(title)), el("p", "muted", t("lib.promptNote")));
    const pre = el("pre", "prompt", text);
    const btn = el("button", "", t("lib.copy"));
    btn.type = "button";
    btn.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(text);
        btn.textContent = t("lib.copied");
      } catch {
        btn.textContent = t("lib.copyFail");
      }
      setTimeout(() => (btn.textContent = t("lib.copy")), 2000);
    });
    card.append(pre, btn);
    root.append(card);
  });

  LIB.forEach(([group, keys]) => {
    const card = el("div", "card");
    card.append(el("h2", "", t("lib.group." + group)), linkList(keys));
    root.append(card);
  });
}

// ---------- Khởi động ----------
function setStart(value) {
  if (!value) return;
  startDate = toISO(mondayOf(fromISO(value)));
  writeStore(START_KEY, startDate);
  const pos = planPosition();
  const inPlan = pos && pos.week >= 0 && pos.week < WEEKS.length;
  viewWeek = inPlan ? pos.week : 0;
  viewDay = inPlan ? pos.day : 0;
  renderPlan();
  location.hash = "today";
}
function renderPlan() {
  renderToday();
  renderWeek();
  renderSide();
  const slot = $("#settings-plan");
  if (slot) {
    slot.innerHTML = "";
    slot.append(startCard(t("settings.start")));
  }
  if (typeof renderSideFooter === "function") renderSideFooter(); // ngày bắt đầu ở cuối sidebar (nav.js)
}

function initPlan() {
  WEEKS = WEEKS_BASE.map((b) => I18N.week(b.n, b));
  const pos = planPosition();
  if (pos && pos.week >= 0 && pos.week < WEEKS.length) {
    viewWeek = pos.week;
    viewDay = pos.day;
  }
  renderPlan();
  renderLibrary();
}
