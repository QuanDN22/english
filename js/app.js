// Khởi động ứng dụng. Thứ tự nạp script xem trong index.html:
// i18n → locales → content → plan-data → plan → notebook → settings → nav → app.
initI18n();
initPlan();
const notebook = initNotebook();
renderSettings();
mountNav("today", (id) => {
  if (id === "week") renderWeek();
  if (id === "cards") notebook.startCards();
});
