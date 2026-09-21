// Điều hướng: điện thoại dùng thanh dưới, máy tính bảng dùng thanh dọc hẹp, máy tính dùng sidebar đầy đủ
// (thu gọn được). Mỗi mục là một panel trong index.html, chọn bằng #hash (vd #today, #settings).

const ICONS = {
  today: '<path d="M12 3v2M12 19v2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M3 12h2M19 12h2M5.6 18.4 7 17M17 7l1.4-1.4"/><circle cx="12" cy="12" r="4"/>',
  week: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',
  words: '<path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z"/><path d="M4 21V5M8 7h7M8 11h5"/>',
  cards: '<rect x="3" y="7" width="14" height="13" rx="2"/><path d="M7 4h12a2 2 0 0 1 2 2v11"/>',
  lib: '<path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>',
  settings: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>',
  sidebar: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M9 4v16"/>',
  edit: '<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/>',
};

const NAV = ["today", "week", "words", "cards", "lib", "settings"];
const COLLAPSE_KEY = "ui-sidebar-collapsed";

const svg = (name) => `<svg viewBox="0 0 24 24" aria-hidden="true">${ICONS[name]}</svg>`;
function readLocal(key) {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}
function writeLocal(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch {
    /* trình duyệt chặn lưu trữ: chỉ không nhớ được trạng thái */
  }
}

// Cuối sidebar: ngày bắt đầu lộ trình + nút sửa (mở mục Cài đặt)
function renderSideFooter() {
  const foot = document.getElementById("side-foot");
  if (!foot) return;
  let start = null;
  try {
    start = JSON.parse(readLocal("ielts-plan-start"));
  } catch {
    start = null;
  }
  foot.innerHTML = "";
  const label = document.createElement("span");
  label.className = "muted";
  label.textContent = t("side.start");
  const value = document.createElement("span");
  value.className = "side-start";
  if (start) {
    const [y, m, d] = start.split("-");
    value.textContent = t("side.startValue", { date: `${d}/${m}/${y}` });
  } else {
    value.textContent = t("side.startNone");
  }
  const edit = document.createElement("a");
  edit.className = "icon-btn";
  edit.href = "#settings";
  edit.innerHTML = svg("edit");
  edit.setAttribute("aria-label", t("side.editStart"));
  edit.title = t("side.editStart");
  const row = document.createElement("div");
  row.className = "side-start-row";
  row.append(value, edit);
  foot.append(label, row);
}

// Dựng sidebar vào #sidebar, rồi bật panel theo #hash. onRoute(id) chạy mỗi khi đổi panel.
function mountNav(fallback, onRoute) {
  const side = document.getElementById("sidebar");

  // Hàng đầu: tên trang + nút thu gọn (chỉ hiện trên máy tính)
  const top = document.createElement("div");
  top.className = "brand-row";
  const brand = document.createElement("a");
  brand.className = "brand";
  brand.href = "#today";
  brand.textContent = t("app.name");
  const toggle = document.createElement("button");
  toggle.type = "button";
  toggle.className = "collapse-btn";
  toggle.innerHTML = svg("sidebar");
  const setCollapsed = (on) => {
    document.body.classList.toggle("side-collapsed", on);
    const label = t(on ? "side.expand" : "side.collapse");
    toggle.setAttribute("aria-label", label);
    toggle.title = label;
    toggle.setAttribute("aria-expanded", String(!on));
  };
  setCollapsed(readLocal(COLLAPSE_KEY) === "1");
  toggle.addEventListener("click", () => {
    const on = !document.body.classList.contains("side-collapsed");
    setCollapsed(on);
    writeLocal(COLLAPSE_KEY, on ? "1" : "0");
  });
  top.append(brand, toggle);

  const nav = document.createElement("nav");
  nav.className = "nav";
  nav.setAttribute("aria-label", t("nav.aria"));
  NAV.forEach((id) => {
    const a = document.createElement("a");
    a.href = "#" + id;
    a.dataset.nav = id;
    a.title = t("nav." + id);
    a.innerHTML = `${svg(id)}<span></span>`;
    a.querySelector("span").textContent = t("nav." + id);
    nav.append(a);
  });

  // Cuối sidebar: thẻ tiến độ (nếu có) + ngày bắt đầu
  const bottom = document.createElement("div");
  bottom.className = "side-bottom";
  const extra = document.getElementById("side-extra");
  if (extra) bottom.append(extra);
  const foot = document.createElement("div");
  foot.id = "side-foot";
  foot.className = "side-foot";
  bottom.append(foot);

  side.innerHTML = "";
  side.append(top, nav, bottom);
  renderSideFooter();

  const panels = [...document.querySelectorAll(".panel")].map((p) => p.id);
  const show = () => {
    const id = panels.includes(location.hash.slice(1)) ? location.hash.slice(1) : fallback;
    document.querySelectorAll(".panel").forEach((p) => p.classList.toggle("active", p.id === id));
    nav.querySelectorAll("a").forEach((a) => {
      const on = a.dataset.nav === id;
      a.classList.toggle("active", on);
      if (on) a.setAttribute("aria-current", "page");
      else a.removeAttribute("aria-current");
    });
    document.title = `${t("nav." + id)} · ${t("app.name")}`;
    window.scrollTo(0, 0);
    if (onRoute) onRoute(id);
  };
  window.addEventListener("hashchange", show);
  show();
}
