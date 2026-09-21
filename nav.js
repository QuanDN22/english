// Điều hướng dùng chung cho index.html và lo-trinh.html.
// Điện thoại: thanh dưới · máy tính bảng: thanh dọc hẹp · máy tính: sidebar đầy đủ (xem style.css).

const ICONS = {
  today: '<path d="M12 3v2M12 19v2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M3 12h2M19 12h2M5.6 18.4 7 17M17 7l1.4-1.4"/><circle cx="12" cy="12" r="4"/>',
  week: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',
  words: '<path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z"/><path d="M4 21V5M8 7h7M8 11h5"/>',
  cards: '<rect x="3" y="7" width="14" height="13" rx="2"/><path d="M7 4h12a2 2 0 0 1 2 2v11"/>',
  lib: '<path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>',
};

const NAV = [
  ["today", "lo-trinh.html", "Hôm nay"],
  ["week", "lo-trinh.html", "Lộ trình"],
  ["words", "index.html", "Từ vựng"],
  ["cards", "index.html", "Flashcard"],
  ["lib", "lo-trinh.html", "Tài liệu"],
];

// Dựng sidebar vào #sidebar, rồi bật panel theo #hash của URL.
// onRoute(id) được gọi mỗi khi đổi panel trên trang hiện tại.
function mountNav(fallback, onRoute) {
  const page = location.pathname.split("/").pop() || "index.html";
  const side = document.getElementById("sidebar");
  const brand = document.createElement("a");
  brand.className = "brand";
  brand.href = "lo-trinh.html#today";
  brand.textContent = "English Notebook";

  const nav = document.createElement("nav");
  nav.className = "nav";
  nav.setAttribute("aria-label", "Điều hướng chính");
  NAV.forEach(([id, file, label]) => {
    const a = document.createElement("a");
    a.href = `${file}#${id}`;
    a.dataset.nav = id;
    a.dataset.page = file;
    a.innerHTML = `<svg viewBox="0 0 24 24" aria-hidden="true">${ICONS[id]}</svg><span></span>`;
    a.querySelector("span").textContent = label;
    nav.append(a);
  });
  side.prepend(brand, nav);

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
