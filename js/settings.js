// Mục Cài đặt: ngôn ngữ, giao diện sáng/tối. Ngày bắt đầu lộ trình do plan.js vẽ vào #settings-plan.

function segmented(container, options, value, onPick) {
  container.innerHTML = "";
  options.forEach(([key, label]) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "seg" + (key === value ? " active" : "");
    b.setAttribute("role", "radio");
    b.setAttribute("aria-checked", String(key === value));
    b.textContent = label;
    b.addEventListener("click", () => onPick(key));
    container.append(b);
  });
}

function renderSettings() {
  // Ngôn ngữ: lấy từ các locale đã đăng ký, tên hiển thị bằng chính ngôn ngữ đó
  const langs = Object.entries(I18N.locales)
    .filter(([, l]) => l.strings)
    .map(([code, l]) => [code, l.name]);
  segmented(document.getElementById("lang-options"), langs, I18N.lang, setLanguage);

  const theme = readPrefs().theme || "system";
  const themes = ["light", "dark", "system"].map((v) => [v, t("settings.theme." + v)]);
  segmented(document.getElementById("theme-options"), themes, theme, (v) => {
    setTheme(v);
    renderSettings();
  });
}
