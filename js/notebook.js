// Sổ từ vựng + flashcard. Dữ liệu lưu trong localStorage của trình duyệt (chỉ trên máy đang dùng).

function initNotebook() {
  const STORAGE_KEY = "english-notebook-words";
  let words = load();
  let order = []; // thứ tự thẻ trong chế độ flashcard
  let current = 0;

  function load() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch {
      return [];
    }
  }
  function save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(words));
    } catch {
      alert(t("words.saveFail"));
    }
  }

  // ---------- Danh sách từ ----------
  const form = document.getElementById("word-form");
  const list = document.getElementById("word-list");
  const search = document.getElementById("search");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    words.unshift({
      id: Date.now(),
      word: document.getElementById("f-word").value.trim(),
      meaning: document.getElementById("f-meaning").value.trim(),
      example: document.getElementById("f-example").value.trim(),
    });
    save();
    form.reset();
    document.getElementById("f-word").focus();
    renderList();
  });
  search.addEventListener("input", renderList);

  function renderList() {
    const q = search.value.trim().toLowerCase();
    const shown = words.filter((w) => w.word.toLowerCase().includes(q) || w.meaning.toLowerCase().includes(q));
    list.innerHTML = "";
    shown.forEach((w) => {
      const li = document.createElement("li");
      const info = document.createElement("div");
      const word = document.createElement("div");
      word.className = "w-word";
      word.textContent = w.word;
      const meaning = document.createElement("div");
      meaning.textContent = w.meaning;
      info.append(word, meaning);
      if (w.example) {
        const ex = document.createElement("div");
        ex.className = "w-example";
        ex.textContent = w.example;
        info.append(ex);
      }
      const del = document.createElement("button");
      del.type = "button";
      del.className = "delete";
      del.textContent = t("words.delete");
      del.addEventListener("click", () => {
        if (!confirm(t("words.confirmDelete", { word: w.word }))) return;
        words = words.filter((x) => x.id !== w.id);
        save();
        renderList();
      });
      li.append(info, del);
      list.append(li);
    });
    document.getElementById("count").textContent = t("words.count", { n: words.length });
  }

  // ---------- Xuất / nhập JSON (để sao lưu hoặc chuyển máy) ----------
  document.getElementById("export").addEventListener("click", () => {
    const blob = new Blob([JSON.stringify(words, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "english-words.json";
    a.click();
    URL.revokeObjectURL(a.href);
  });
  document.getElementById("import").addEventListener("change", async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const data = JSON.parse(await file.text());
      if (!Array.isArray(data)) throw new Error();
      // Gộp, bỏ qua từ trùng id
      const ids = new Set(words.map((w) => w.id));
      data.forEach((w) => {
        if (w && w.word && w.meaning && !ids.has(w.id)) {
          words.push({ id: w.id || Date.now() + Math.random(), word: w.word, meaning: w.meaning, example: w.example || "" });
        }
      });
      save();
      renderList();
      alert(t("words.imported"));
    } catch {
      alert(t("words.badFile"));
    }
    e.target.value = "";
  });

  // ---------- Flashcard ----------
  const cardFront = document.getElementById("card-front");
  const cardBack = document.getElementById("card-back");

  function startCards() {
    const empty = words.length === 0;
    document.getElementById("card-empty").hidden = !empty;
    document.getElementById("card-area").hidden = empty;
    if (empty) return;
    order = words.map((_, i) => i);
    current = 0;
    showCard();
  }
  function showCard() {
    const w = words[order[current]];
    cardFront.textContent = w.word;
    cardBack.innerHTML = "";
    const m = document.createElement("div");
    m.textContent = w.meaning;
    cardBack.append(m);
    if (w.example) {
      const ex = document.createElement("div");
      ex.className = "w-example";
      ex.textContent = w.example;
      cardBack.append(ex);
    }
    cardFront.hidden = false;
    cardBack.hidden = true;
    document.getElementById("card-pos").textContent = `${current + 1} / ${order.length}`;
  }
  function flip() {
    cardFront.hidden = !cardFront.hidden;
    cardBack.hidden = !cardBack.hidden;
  }
  function move(step) {
    current = (current + step + order.length) % order.length;
    showCard();
  }
  document.getElementById("card").addEventListener("click", flip);
  document.getElementById("flip").addEventListener("click", flip);
  document.getElementById("prev").addEventListener("click", () => move(-1));
  document.getElementById("next").addEventListener("click", () => move(1));
  document.getElementById("shuffle").addEventListener("click", () => {
    for (let i = order.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [order[i], order[j]] = [order[j], order[i]];
    }
    current = 0;
    showCard();
  });

  // Phím tắt trong mục Flashcard: ← → để chuyển, phím cách để lật
  document.addEventListener("keydown", (e) => {
    if (!document.getElementById("cards").classList.contains("active") || !order.length) return;
    if (e.target.closest("input, textarea, select")) return;
    if (e.key === "ArrowLeft") move(-1);
    if (e.key === "ArrowRight") move(1);
    if (e.key === " ") {
      e.preventDefault();
      flip();
    }
  });

  renderList();
  return { startCards };
}
