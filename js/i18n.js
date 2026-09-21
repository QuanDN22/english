// Đa ngôn ngữ + tùy chọn người dùng (ngôn ngữ, giao diện).
//
// Thêm một ngôn ngữ mới:
//   1. Tạo js/locales/<mã>.js gọi I18N.register("<mã>", "<tên hiển thị>", { ...chuỗi giao diện })
//   2. Tạo js/content/<mã>.js gọi I18N.content("<mã>", { ...nội dung từng tuần })
//   3. Thêm 2 thẻ <script> tương ứng vào index.html
// Chuỗi nào thiếu sẽ tự lấy từ ngôn ngữ mặc định (FALLBACK), nên có thể dịch dần.

const PREFS_KEY = "prefs";
const FALLBACK = "vi";

const I18N = {
  locales: {}, // mã -> { name, strings, content }
  lang: FALLBACK,

  register(code, name, strings) {
    this.locales[code] = { ...(this.locales[code] || {}), name, strings };
  },
  content(code, weeks) {
    this.locales[code] = { ...(this.locales[code] || {}), content: weeks };
  },

  // Tra một khóa. Giá trị có thể là chuỗi, mảng, object, hoặc hàm (params) => chuỗi.
  // {tên} trong chuỗi được thay bằng params.tên.
  raw(key) {
    for (const code of [this.lang, FALLBACK]) {
      const v = this.locales[code] && this.locales[code].strings[key];
      if (v !== undefined) return v;
    }
    return undefined;
  },
  t(key, params = {}, fallback) {
    const v = this.raw(key);
    if (v === undefined) return fallback !== undefined ? fallback : key;
    return fill(v, params);
  },
  // Chỉ tra trong ngôn ngữ đang chọn, không lấy ngôn ngữ mặc định. Dùng cho bản dịch của dữ liệu gốc
  // (vd tiêu đề tài liệu): thiếu bản dịch thì dùng dữ liệu gốc thay vì bản dịch sang ngôn ngữ khác.
  own(key, fallback) {
    const v = this.locales[this.lang] && this.locales[this.lang].strings[key];
    return v === undefined ? fallback : v;
  },

  // Ghép một tuần theo thứ tự ưu tiên tăng dần: nội dung ngôn ngữ mặc định → dữ liệu gốc (plan-data.js)
  // → nội dung ngôn ngữ đang chọn. Nhờ vậy trường nào chưa dịch sẽ lấy bản mặc định, còn các trường có sẵn
  // trong dữ liệu gốc (tên ngữ pháp, chủ đề bằng tiếng Anh) không bị bản dịch của ngôn ngữ mặc định đè lên.
  week(n, base) {
    const own = (this.locales[this.lang] && this.locales[this.lang].content) || {};
    const def = (this.locales[FALLBACK] && this.locales[FALLBACK].content) || {};
    return { ...(def[n] || {}), ...base, ...(own[n] || {}) };
  },

  // Dịch phần HTML tĩnh: data-i18n (chữ), data-i18n-html (có thẻ HTML), data-i18n-attr="aria-label:khóa;title:khóa"
  apply(root = document) {
    document.documentElement.lang = this.lang;
    root.querySelectorAll("[data-i18n]").forEach((e) => (e.textContent = this.t(e.dataset.i18n)));
    root.querySelectorAll("[data-i18n-html]").forEach((e) => (e.innerHTML = this.t(e.dataset.i18nHtml)));
    root.querySelectorAll("[data-i18n-attr]").forEach((e) => {
      e.dataset.i18nAttr.split(";").forEach((pair) => {
        const [attr, key] = pair.split(":");
        e.setAttribute(attr.trim(), this.t(key.trim()));
      });
    });
  },
};

function fill(v, params) {
  if (typeof v === "function") return v(params);
  if (typeof v === "string") return v.replace(/\{(\w+)\}/g, (m, k) => (params[k] !== undefined ? params[k] : m));
  if (Array.isArray(v)) return v.map((x) => fill(x, params));
  if (v && typeof v === "object") return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, fill(x, params)]));
  return v;
}
const t = (key, params, fallback) => I18N.t(key, params, fallback);

// ---------- Tùy chọn ----------
function readPrefs() {
  try {
    return JSON.parse(localStorage.getItem(PREFS_KEY)) || {};
  } catch {
    return {};
  }
}
function savePrefs(patch) {
  const next = { ...readPrefs(), ...patch };
  try {
    localStorage.setItem(PREFS_KEY, JSON.stringify(next));
  } catch {
    /* chế độ ẩn danh: chỉ không nhớ được lựa chọn */
  }
  return next;
}

// theme: "light" | "dark" | "system" (không đặt data-theme → theo hệ điều hành)
function applyTheme(theme) {
  const root = document.documentElement;
  if (theme === "light" || theme === "dark") root.dataset.theme = theme;
  else delete root.dataset.theme;
}

// Ngôn ngữ ban đầu: đã chọn trước đó, nếu chưa chọn thì dùng ngôn ngữ mặc định
function initI18n() {
  const prefs = readPrefs();
  I18N.lang = I18N.locales[prefs.lang] ? prefs.lang : FALLBACK;
  applyTheme(prefs.theme);
  I18N.apply();
}

function setLanguage(code) {
  if (!I18N.locales[code] || code === I18N.lang) return;
  savePrefs({ lang: code });
  location.reload(); // dựng lại toàn bộ trang bằng ngôn ngữ mới, giữ nguyên #mục đang xem
}
function setTheme(theme) {
  savePrefs({ theme });
  applyTheme(theme);
}
