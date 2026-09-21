// Điều hướng dùng chung cho index.html và lo-trinh.html.
// Điện thoại: thanh dưới · máy tính bảng: thanh dọc hẹp · máy tính: sidebar đầy đủ, thu gọn được (xem style.css).

const ICONS = {
  today: '<path d="M12 3v2M12 19v2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M3 12h2M19 12h2M5.6 18.4 7 17M17 7l1.4-1.4"/><circle cx="12" cy="12" r="4"/>',
  week: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',
  words: '<path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z"/><path d="M4 21V5M8 7h7M8 11h5"/>',
  cards: '<rect x="3" y="7" width="14" height="13" rx="2"/><path d="M7 4h12a2 2 0 0 1 2 2v11"/>',
  lib: '<path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>',
  sidebar: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M9 4v16"/>',
};

const NAV = [
  ["today", "lo-trinh.html", "Hôm nay"],
  ["week", "lo-trinh.html", "Lộ trình"],
  ["words", "index.html", "Từ vựng"],
  ["cards", "index.html", "Flashcard"],
  ["lib", "lo-trinh.html", "Tài liệu"],
];
const COLLAPSE_KEY = "ui-sidebar-collapsed";
const PLAN_START_KEY = "ielts-plan-start";

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

// Cuối sidebar: ngày bắt đầu lộ trình (đọc chung một khóa lưu trữ với lo-trinh.js).
function renderSideFooter() {
  const foot = document.getElementById("side-foot");
  if (!foot) return;
  let start = null;
  try {
    start = JSON.parse(readLocal(PLAN_START_KEY));
  } catch {
    start = null;
  }
  foot.innerHTML = "";
  const label = document.createElement("span");
  label.className = "muted";
  label.textContent = "Ngày bắt đầu";
  const value = document.createElement("span");
  value.className = "side-start";
  if (start) {
    const [y, m, d] = start.split("-");
    value.textContent = `Thứ Hai, ${d}/${m}/${y}`;
  } else {
    value.textContent = "Chưa chọn";
  }
  const change = document.createElement("a");
  change.href = "lo-trinh.html#lib";
  change.textContent = start ? "Đổi" : "Chọn ngày";
  const row = document.createElement("div");
  row.className = "side-start-row";
  row.append(value, change);
  foot.append(label, row);
}

// Dựng sidebar vào #sidebar, rồi bật panel theo #hash của URL.
// onRoute(id) được gọi mỗi khi đổi panel trên trang hiện tại.
function mountNav(fallback, onRoute) {
  const page = location.pathname.split("/").pop() || "index.html";
  const side = document.getElementById("sidebar");

  // Hàng đầu: tên trang + nút thu gọn (chỉ hiện trên máy tính)
  const top = document.createElement("div");
  top.className = "brand-row";
  const brand = document.createElement("a");
  brand.className = "brand";
  brand.href = "lo-trinh.html#today";
  brand.textContent = "English Notebook";
  const toggle = document.createElement("button");
  toggle.type = "button";
  toggle.className = "collapse-btn";
  toggle.innerHTML = svg("sidebar");
  const setCollapsed = (on) => {
    document.body.classList.toggle("side-collapsed", on);
    toggle.setAttribute("aria-label", on ? "Mở rộng thanh bên" : "Thu gọn thanh bên");
    toggle.title = toggle.getAttribute("aria-label");
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
  nav.setAttribute("aria-label", "Điều hướng chính");
  NAV.forEach(([id, file, label]) => {
    const a = document.createElement("a");
    a.href = `${file}#${id}`;
    a.dataset.nav = id;
    a.dataset.page = file;
    a.title = label;
    a.innerHTML = `${svg(id)}<span></span>`;
    a.querySelector("span").textContent = label;
    nav.append(a);
  });

  // Cuối sidebar: thẻ tiến độ (nếu trang có) + ngày bắt đầu
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
      const on = a.dataset.page === page && a.dataset.nav === id;
      a.classList.toggle("active", on);
      if (on) a.setAttribute("aria-current", "page");
      else a.removeAttribute("aria-current");
    });
    window.scrollTo(0, 0);
    if (onRoute) onRoute(id);
  };
  window.addEventListener("hashchange", show);
  show();
}
