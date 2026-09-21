// Lộ trình IELTS: dựng lịch từng ngày từ WEEKS (lo-trinh-data.js) và lưu tiến độ trong localStorage.

const DAY_NAMES = ["Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy", "Chủ Nhật"];
const PHASES = {
  0: "Chuẩn bị",
  1: "Giai đoạn 1 · Nền tảng (5.0 → 5.5)",
  2: "Giai đoạn 2 · Vận dụng (5.5 → 6.5)",
  3: "Giai đoạn 3 · Tinh chỉnh (6.5 → 7.0)",
};
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

function planPosition() {
  if (!startDate) return null;
  const idx = Math.round((today() - fromISO(startDate)) / DAY_MS);
  return { idx, week: Math.floor(idx / 7), day: ((idx % 7) + 7) % 7 };
}
function dateOf(week, day) {
  return startDate ? addDays(fromISO(startDate), week * 7 + day) : null;
}

// ---------- Khối xây dựng task ----------
const flash = () => ({
  t: "Sáng · 10 phút",
  h: "Ôn flashcard",
  s: ["Mở tab Flashcard trong English Notebook (hoặc Anki), ôn hết thẻ đến hạn.", "Thêm vào các cụm từ mới của hôm qua."],
  l: ["notebook"],
});
const minTask = () => ({
  t: "Ngày bận · 15 phút",
  h: "Bản tối thiểu (thay cho cả ngày)",
  s: ["Ôn flashcard 5 phút.", "Nghe lại tập 6 Minute English của tuần 10 phút.", "Quy tắc: được bỏ 1 ngày, không bỏ 2 ngày liên tiếp."],
  min: true,
});
const SEGMENTS = ["phút 0:00–1:30", "phút 1:30–3:00", "phút 3:00–4:30", "phút 4:30–6:00"];
const dictation = (w, d) => ({
  t: "Sáng · 20 phút",
  h: "Nghe chép chính tả",
  s: [
    `Nghe ${SEGMENTS[d]} của tập 6 Minute English tuần này. Dừng sau mỗi câu và viết lại đúng từng từ.`,
    "Mở transcript trên trang BBC để so. Gạch chân chỗ nghe sai, thường là đuôi -s/-ed, mạo từ, từ nối.",
  ],
  l: [w.six],
});
const shadow6 = (w) => ({
  t: "Sáng · 20 phút",
  h: "Shadowing",
  s: [
    "Lấy đoạn đã chép chính tả hôm thứ Hai/Ba. Nghe 1 câu → dừng → nói lại đúng nhịp, chỗ nhấn, chỗ nối âm.",
    "Lần cuối, ghi âm cả đoạn rồi nghe so với bản gốc.",
  ],
  l: [w.six],
});
const review = (extra = []) => ({
  t: "Tối · 40 phút",
  h: "Tổng kết tuần",
  s: [
    "Ghi âm 2 phút: giải thích ngữ pháp của tuần như đang dạy lại cho người khác. Không giải thích được thì xem lại video.",
    "Che nghĩa, ôn toàn bộ cụm từ của tuần. Cụm nào quên thì đánh dấu để ôn lại.",
    "Ghi vào sổ: 3 điều làm tốt, 1 điều sẽ làm khác đi tuần sau.",
    ...extra,
  ],
});
const sunday = () => [
  { t: "10 phút", h: "Ôn flashcard", s: ["Ôn hết thẻ đến hạn. Việc này giữ chuỗi ngày học."], l: ["notebook"] },
  { t: "10 phút", h: "Xem trước tuần sau", s: ["Mở tuần sau trên trang này và xem trước tài liệu.", "Đặt giờ học vào lịch điện thoại cho cả tuần."] },
  { t: "Tùy chọn", h: "Giải trí bằng tiếng Anh", s: ["Xem phim, series hoặc YouTube với phụ đề tiếng Anh. Không ghi chép, không tính là học."], opt: true },
];
const fixMistakes = (what) => ({
  t: "Tối · 60 phút",
  h: "Chữa bài",
  s: [
    `Chấm ${what} bằng đáp án cuối sách, quy ra band theo bảng trong sách.`,
    "Với MỖI câu sai: tìm câu chứa đáp án trong transcript hoặc bài đọc, gạch chân phần được diễn đạt lại (paraphrase).",
    "Ghi vào sổ lỗi: số câu · loại lỗi (không biết từ / không nhận ra paraphrase / chính tả / hết giờ / mất tập trung) · bài học.",
    "Nghe lại các đoạn làm sai kèm transcript, 2 lần.",
  ],
});
const grammarTask = (w, lastStep) => ({
  t: "Tối · 40 phút",
  h: "Ngữ pháp: " + w.grammar,
  s: w.gLinks.length
    ? [w.gNote, "Xem video, rồi đọc trang British Council và làm hết bài tập trên trang.", lastStep]
    : [w.gNote, "Mở sổ lỗi, chọn 3 chủ đề ngữ pháp sai nhiều nhất và làm lại bài tập British Council của các tuần đó."],
  l: w.gLinks,
});
const speakingSteps = (w, withP3) => {
  const s = [
    "Part 1, trả lời mỗi câu 20–30 giây và ghi âm cả loạt: " + w.sp.p1.join(" / "),
  ];
  if (w.sp.p2) s.push("Part 2, chuẩn bị 1 phút (chỉ ghi từ khóa), nói 2 phút liên tục: " + w.sp.p2);
  if (withP3 && w.sp.p3 && w.sp.p3.length) s.push("Part 3, trả lời mỗi câu 45–60 giây theo công thức ý kiến → lý do → ví dụ: " + w.sp.p3.join(" / "));
  s.push("Nghe lại, ghi 3 lỗi (ngữ pháp của tuần, phát âm, chỗ ngập ngừng), rồi nói lại lần 2.");
  return s;
};

// ---------- Giai đoạn 1 ----------
function phase1Day(w, d) {
  switch (d) {
    case 0:
      return [flash(), dictation(w, 0),
        grammarTask(w, "Viết 5 câu về chính bạn có dùng cấu trúc này, ghi vào sổ."),
        { t: "Tối · 30 phút", h: "Từ vựng: " + w.topic, s: ["Học các từ trong mục VOCABULARY ở cuối trang 6 Minute English tuần này.", "8 cụm từ của tuần: " + w.col.join(" · "), "Thêm 10 thẻ vào English Notebook: mặt trước là cụm từ, mặt sau là nghĩa + một câu ví dụ của bạn."], l: [w.six, "collocDict", "oxfordDict"] },
        { t: "Tối · 20 phút", h: "Nghe cả tập 6 Minute English", s: ["Lần 1 không transcript, trả lời câu đố ở đầu tập.", "Lần 2 mở transcript, đọc theo."], l: [w.six] }];
    case 1:
      return [flash(), dictation(w, 1),
        { t: "Tối · 45 phút", h: "Đọc hiểu", s: ["Làm phần Preparation, đọc bài một lượt không tra từ, rồi làm các task có chấm điểm trên trang.", "Sau đó mới tra những từ cản trở việc hiểu (tối đa 8 từ)."], l: [w.read] },
        { t: "Tối · 15 phút", h: "Phân tích câu", s: ["Chép 5 câu trong bài: gạch chủ ngữ, động từ chính, và ghi vì sao dùng thì hoặc cấu trúc đó."] },
        { t: "Tối · 30 phút", h: "Tóm tắt bằng lời của bạn", s: ["Viết 80–100 từ tóm tắt bài đọc, không chép câu gốc. Đây là bài tập paraphrase, nền tảng của Reading và Writing."] }];
    case 2:
      return [flash(), dictation(w, 2),
        { t: "Tối · 15 phút", h: "Phát âm", s: ["Xem video, nói theo từng ví dụ trong video."], l: w.pron },
        { t: "Tối · 20 phút", h: "Shadowing", s: ["Chọn 1 phút transcript 6 Minute English. Nghe 1 câu → dừng → nói lại đúng nhịp và chỗ nhấn.", "Ghi âm lần cuối và so với bản gốc."], l: [w.six] },
        { t: "Tối · 40 phút", h: "Nói", s: speakingSteps(w, false), l: w.n === 1 ? ["spP1Topics", "fmtS"] : [] },
        { t: "Tối · 15 phút", h: "Ôn ngữ pháp", s: ["Làm lại bài tập British Council hôm thứ Hai, không xem lời giải."], l: w.gLinks.filter((k) => k.startsWith("bc")) }];
    case 3:
      return [flash(), dictation(w, 3),
        { t: "Tối · 45 phút", h: "Viết nhật ký", s: [w.journal, "Viết thẳng ra, đừng dịch từ tiếng Việt. Không biết từ nào thì diễn đạt vòng."] },
        { t: "Tối · 25 phút", h: "Sửa bài", s: ["Tự đọc lại theo checklist: thì của động từ, mạo từ, đuôi -s/-ed, từ nối.", "Dán bài vào AI với câu lệnh chữa bài (mục Tài liệu). Yêu cầu chỉ ra lỗi, không viết lại cả bài.", "Ghi 3 lỗi quan trọng nhất vào sổ lỗi."] },
        { t: "Tối · 20 phút", h: "Dùng cụm từ của tuần", s: ["Che nghĩa, tự đặt câu mới với 8 cụm từ: " + w.col.join(" · "), "Đọc to từng câu."] }];
    case 4:
      return [flash(),
        { t: "Sáng · 20 phút", h: "Nghe lại cả tập", s: ["Nghe lại toàn bộ tập 6 Minute English, không transcript. Đếm xem bạn hiểu thêm được bao nhiêu so với thứ Hai."], l: [w.six] },
        { t: "Tối · 30 phút", h: "Nghe mở rộng", s: ["Làm phần Preparation, nghe và làm các task có chấm điểm. Chỉ mở transcript sau khi làm xong."], l: [w.listen] },
        { t: "Tối · 20 phút", h: "TED-Ed", s: ["Xem 3 lần: không phụ đề → phụ đề tiếng Anh → không phụ đề.", "Ghi lại 3 cụm từ hay vào flashcard."], l: [w.ted] },
        review(["Chuẩn bị cho thứ Bảy: sách Cambridge, tai nghe, đồng hồ bấm giờ."])];
    case 5:
      if (w.satMode === "fullLR") {
        return [
          { t: "Sáng · 100 phút", h: "Kiểm tra cuối giai đoạn", s: [w.sat, "Listening: nghe một lần duy nhất, 30 phút + 2 phút soát (giống thi trên máy). Reading: 60 phút, không từ điển."] },
          fixMistakes("Listening và Reading"),
          { t: "Tối · 20 phút", h: "So với Tuần 0", s: ["Ghi điểm hôm nay cạnh điểm thi thử Tuần 0. Tăng từ 0.5 band trở lên là đúng tiến độ."] },
        ];
      }
      return [
        { t: "Sáng · 20 phút", h: "Video kỹ năng", s: ["Xem video, ghi lại 3 mẹo sẽ áp dụng ngay trong đề hôm nay."], l: w.skill },
        { t: "Sáng · 45 phút", h: "Làm đề", s: [w.sat, "Listening nghe một lần như thi thật. Reading Passage 1 bấm giờ 20 phút."] },
        fixMistakes("Listening và Reading"),
        { t: "Chiều · 15 phút", h: "Nghe lại có transcript", s: ["Nghe lại Part 1–2, vừa nghe vừa đọc transcript ở cuối sách."] },
        { t: "Tùy chọn", h: "Giải trí bằng tiếng Anh", s: ["Buổi chiều tự do. Xem một bộ phim có phụ đề tiếng Anh."], opt: true },
      ];
    default:
      return sunday();
  }
}

// ---------- Giai đoạn 2 ----------
function phase2Day(w, d) {
  const morning = d <= 1 ? dictation(w, d) : shadow6(w);
  switch (d) {
    case 0:
      return [flash(), morning,
        grammarTask(w, "Viết 5 câu về chủ đề của tuần có dùng cấu trúc này."),
        { t: "Tối · 30 phút", h: "Từ vựng: " + w.topic, s: ["Học mục VOCABULARY của tập 6 Minute English.", "8 cụm từ của tuần: " + w.col.join(" · "), "Thêm 10 từ học thuật từ danh sách OPAL (Written, học lần lượt từ đầu).", "Tạo thẻ flashcard cho tất cả."], l: [w.six, "opal", "collocDict"] },
        { t: "Tối · 20 phút", h: "Nghe cả tập 6 Minute English", s: ["Lần 1 không transcript. Lần 2 có transcript."], l: [w.six] }];
    case 1: {
      const t1 = w.t1 || { links: [], cam: "" };
      return [flash(), morning,
        { t: "Tối · 35 phút", h: "Đọc hiểu (bấm giờ)", s: ["Đọc bài trong 8 phút, rồi làm các task có chấm điểm.", "Chép 3 cặp paraphrase (từ trong câu hỏi ↔ từ trong bài)."], l: [w.read] },
        ...(w.rskill && w.rskill.length ? [{ t: "Tối · 15 phút", h: "Kỹ năng Reading", s: ["Xem video, ghi các bước làm dạng bài này thành 3–4 dòng, dùng ngay thứ Bảy."], l: w.rskill }] : []),
        { t: "Tối · 40 phút", h: "Writing Task 1", s: t1.links.length
          ? ["Xem video hoặc bài mẫu trước (10 phút).", "Viết " + t1.cam + ". Bấm giờ 20 phút, tối thiểu 150 từ, gõ trên máy tính.", "So với bài mẫu cuối sách: overview đã nêu rõ xu hướng chính chưa? Đã có số liệu so sánh chưa?"]
          : [t1.cam + ". Bấm giờ 20 phút, gõ trên máy tính.", "So với bài cũ: những lỗi đã ghi trong sổ lỗi có còn lặp lại không?"], l: t1.links }];
    }
    case 2:
      return [flash(), morning,
        { t: "Tối · 10 phút", h: "Phát âm", s: ["Xem bài của Tim, nói theo các ví dụ."], l: w.pron },
        { t: "Tối · 10 phút", h: "Video Speaking", s: ["Xem video, chọn 1 điều sẽ áp dụng ngay hôm nay."], l: w.speakVid },
        { t: "Tối · 50 phút", h: "Nói Part 1–2–3", s: speakingSteps(w, true), l: ["bdS"] },
        { t: "Tối · 20 phút", h: "Nói lại Part 2", s: ["Nói lại Part 2 lần 3, lần này có ghi âm và chép lại transcript.", "Dán transcript vào AI với câu lệnh chấm Speaking (mục Tài liệu)."] }];
    case 3:
      return [flash(), morning,
        { t: "Tối · 10 phút", h: "Đọc bài mẫu cùng dạng", s: ["Dạng bài tuần này: " + w.t2.type + ". Đọc bài mẫu, chú ý mở bài và câu chủ đề của từng đoạn."], l: w.t2.links },
        { t: "Tối · 40 phút", h: "Writing Task 2 (bấm giờ)", s: ["Đề: " + w.t2.prompt, "5 phút lập dàn ý → 35 phút viết, tối thiểu 250 từ. Gõ trên máy tính vì ở Việt Nam chỉ còn thi trên máy."] },
        { t: "Tối · 25 phút", h: "Chữa bài", s: ["Dán bài vào AI với câu lệnh chữa Writing (mục Tài liệu).", "Đối chiếu nhận xét với band descriptors, nhất là cột Task Response."], l: ["bdW"] },
        { t: "Tối · 15 phút", h: "Viết lại & ghi lỗi", s: ["Viết lại đoạn thân bài yếu nhất.", "Ghi 3 lỗi vào sổ lỗi."] }];
    case 4:
      return [flash(), morning,
        { t: "Tối · 30 phút", h: "Nghe mở rộng", s: ["Làm các task có chấm điểm, sau đó mới mở transcript."], l: [w.listen] },
        { t: "Tối · 20 phút", h: "TED-Ed", s: ["Xem 2 lần: không phụ đề → phụ đề tiếng Anh.", "Tóm tắt nội dung bằng lời trong 1 phút, có ghi âm."], l: [w.ted] },
        review()];
    case 5: {
      if (w.satMode === "full") {
        return [
          { t: "Sáng · 2 giờ 40 phút", h: "Thi thử đầy đủ", s: [w.sat, "Listening 30 phút + 2 phút soát → Reading 60 phút → Writing 60 phút (Task 1 20 phút, Task 2 40 phút). Không nghỉ, không từ điển."] },
          fixMistakes("Listening và Reading"),
          { t: "Tối · 30 phút", h: "Chữa Writing", s: ["Dán cả 2 bài vào AI với câu lệnh chữa Writing.", "Chép 3 lỗi vào sổ lỗi."], l: ["bdW"] },
        ];
      }
      if (w.satMode === "fullLR") {
        return [
          { t: "Sáng · 95 phút", h: "Thi thử Listening + Reading", s: [w.sat, "Listening 30 phút + 2 phút soát → Reading 60 phút."] },
          fixMistakes("Listening và Reading"),
          ...(w.extra && w.extra[5] ? [] : [{ t: "Tùy chọn", h: "Giải trí bằng tiếng Anh", s: ["Buổi chiều tự do."], opt: true }]),
        ];
      }
      return [
        ...(w.satVid && w.satVid.length ? [{ t: "Sáng · 15 phút", h: "Video kỹ năng Listening", s: ["Xem video, ghi 3 mẹo."], l: w.satVid }] : []),
        { t: "Sáng · 60 phút", h: "Làm đề", s: [w.sat, "Listening nghe một lần như thi. Reading bấm 40 phút cho 2 passage."] },
        fixMistakes("Listening và Reading"),
        { t: "Chiều · 15 phút", h: "Nghe lại có transcript", s: ["Nghe lại Part 3–4 kèm transcript ở cuối sách."] },
      ];
    }
    default:
      return sunday();
  }
}

// ---------- Giai đoạn 3 ----------
const TED_SEG = ["phút 0:00–1:00", "phút 1:00–2:00", "phút 2:00–3:00", "phút 3:00–4:00", "phút 4:00–5:00"];
function phase3Day(w, d) {
  const prev = WEEKS[w.n - 1];
  const morning = {
    t: "Sáng · 20 phút",
    h: "Shadowing",
    s: [`Shadowing ${TED_SEG[d] || TED_SEG[0]} của video tuần trước (đã hiểu nội dung), bật phụ đề tiếng Anh.`, "Bắt chước chỗ nhấn và ngữ điệu, không chỉ đọc đúng từ."],
    l: [prev.ted],
  };
  switch (d) {
    case 0:
      return [flash(), morning,
        grammarTask(w, "Viết 3 câu dùng cấu trúc này về chủ đề Task 2 của tuần, để dùng lại hôm thứ Năm."),
        { t: "Tối · 30 phút", h: "Nghe C1", s: ["Làm các task có chấm điểm, sau đó nghe lại với transcript."], l: [w.listen] },
        { t: "Tối · 20 phút", h: "Từ vựng: " + w.topic, s: ["8 cụm từ của tuần: " + w.col.join(" · "), "Thêm từ trong tập 6 Minute English của tuần (nghe khi đi lại).", "Tạo thẻ flashcard."], l: [w.six, "collocDict"] }];
    case 1:
      return [flash(), morning,
        { t: "Tối · 45 phút", h: "Đọc C1 (bấm giờ)", s: ["Đọc lần đầu trong 10 phút, làm task có chấm điểm.", "Đọc lại, gạch những câu dài và tách thành các mệnh đề."], l: [w.read, "conversation"] },
        { t: "Tối · 25 phút", h: "Paraphrase", s: ["Chọn 5 câu trong bài, viết lại mỗi câu theo 2 cách: đổi từ loại (danh từ ↔ động từ), đổi cấu trúc (chủ động ↔ bị động, mệnh đề ↔ cụm từ)."] },
        { t: "Tối · 20 phút", h: "Từ học thuật", s: ["Học tiếp 10 từ OPAL, đặt câu với chủ đề của tuần."], l: ["opal"] }];
    case 2:
      return [flash(), morning,
        { t: "Tối · 45 phút", h: "Speaking mock (tự thi)", s: [...speakingSteps(w, true), "Tự chấm 4 tiêu chí theo band descriptors, ghi band ước tính vào sổ."], l: ["bdS"] },
        w.n === 27
          ? { t: "Tối · 30 phút", h: "Ngữ điệu & nối âm", s: ["Xem 2 video đầu, luyện theo từng ví dụ.", "Đánh dấu từ cần nhấn trong câu trả lời Part 2 của bạn, rồi nói lại."], l: w.gLinks }
          : { t: "Tối · 30 phút", h: "Phát âm qua shadowing", s: ["Chọn 3 câu trong bản ghi âm hôm nay mà bạn nói chưa tự nhiên. Tìm câu tương tự trong TED talk tuần trước và shadowing câu đó."], l: [prev.ted] },
        { t: "Tối · 15 phút", h: "Nói lại", s: ["Nói lại Part 2 và 1 câu Part 3 yếu nhất."] }];
    case 3:
      return [flash(), morning,
        { t: "Tối · 20 phút", h: "Viết lại Task 1", s: ["Viết lại Writing Task 1 của bài thi thứ Bảy tuần trước dựa trên nhận xét, bấm giờ 20 phút."] },
        { t: "Tối · 40 phút", h: "Writing Task 2 (bấm giờ)", s: ["Dạng: " + w.t2.type, "Đề: " + w.t2.prompt, "5 phút dàn ý → 35 phút viết, gõ trên máy. Dùng 1–2 cấu trúc của tuần nếu tự nhiên."], l: w.t2.links },
        { t: "Tối · 30 phút", h: "Chữa bài", s: ["Chữa bằng AI với câu lệnh chữa Writing, đối chiếu band descriptors.", "Viết lại 1 đoạn, ghi 3 lỗi vào sổ."], l: ["bdW"] }];
    case 4:
      return [flash(), morning,
        { t: "Tối · 45 phút", h: "TED talk", s: ["Xem lần 1 không phụ đề: tóm tắt ý chính trong 3 câu.", "Xem lần 2 có phụ đề tiếng Anh: ghi 10 cách diễn đạt dùng được cho Speaking Part 3."], l: [w.ted] },
        review(["Mở sổ lỗi: loại lỗi nào xuất hiện nhiều nhất tuần này?"])];
    case 5:
      if (w.satMode === "rest") return [{ t: "Cả ngày", h: "Nghỉ", s: ["Không làm đề. Đi dạo, vận động, ngủ sớm."], opt: true }];
      return [
        { t: "Sáng · 2 giờ 40 phút", h: "Thi thử đầy đủ", s: [w.sat, "Listening 30 phút + 2 phút soát → Reading 60 phút → Writing 60 phút. Không nghỉ, không từ điển, gõ Writing trên máy."] },
        fixMistakes("Listening và Reading"),
        { t: "Tối · 30 phút", h: "Chữa Writing", s: ["Chữa cả 2 bài bằng AI. Thứ Năm tuần sau sẽ viết lại Task 1."], l: ["bdW"] },
        { t: "Tùy chọn · 20 phút", h: "Speaking với người thật", s: ["Nhờ bạn, đồng nghiệp hoặc gia sư hỏi đủ 3 part, ghi âm lại."], opt: true, l: ["speakSample"] },
      ];
    default:
      return sunday();
  }
}

// ---------- Tuần đặc biệt ----------
function week0Day(d) {
  return [
    [
      { t: "Tối · 30 phút", h: "Hiểu bài thi", s: ["Đọc cấu trúc 4 kỹ năng: số câu, thời gian, dạng câu hỏi.", "Ở Việt Nam, từ 30/03/2025 IELTS chỉ còn thi trên máy tính. Vì vậy mọi bài Writing trong lộ trình đều gõ trên máy."], l: ["fmtL", "fmtR", "fmtW", "fmtS"] },
      { t: "Tối · 30 phút", h: "Dựng công cụ", s: ["Mở English Notebook (hoặc cài Anki) để làm flashcard.", "Tạo sổ lỗi (Google Sheets hoặc sổ giấy) với các cột: Ngày · Kỹ năng · Câu sai · Loại lỗi · Sửa đúng · Bài học."], l: ["notebook", "anki"] },
      { t: "Tối · 15 phút", h: "Gắn thói quen vào lịch", s: ["Viết 2 câu và dán lên bàn học: 'Sau khi [pha cà phê buổi sáng], tôi ôn flashcard 10 phút tại [bàn làm việc].' và 'Sau khi [ăn tối], tôi học 90 phút tại [...]'.", "Đặt nhắc lịch lặp lại trên điện thoại."] },
      { t: "Tối · 15 phút", h: "Sắp xếp môi trường", s: ["Chuyển ngôn ngữ điện thoại sang tiếng Anh.", "Đưa app mạng xã hội ra khỏi màn hình chính. Ghim trang lộ trình này lên màn hình chính."] },
    ],
    [
      { t: "Tối · 90 phút", h: "Thi thử đầu vào: Listening + Reading", s: ["Làm bài thi làm quen chính thức (Academic) trên máy. Có điểm Listening và Reading ngay.", "Ghi điểm lại. Đây là mốc để so vào tuần 8, 20 và 32."], l: ["famTest", "famInfo"] },
    ],
    [
      { t: "Tối · 60 phút", h: "Thi thử đầu vào: Writing", s: ["Làm phần Writing của bài thi làm quen (Task 1 20 phút + Task 2 40 phút), gõ trên máy. Lưu lại bài."], l: ["famTest"] },
      { t: "Tối · 20 phút", h: "Thi thử đầu vào: Speaking", s: ["Mở đề mẫu Speaking chính thức, tự hỏi và trả lời đủ 3 part, ghi âm toàn bộ.", "Lưu file ghi âm để so vào tuần 8, 20 và 32."], l: ["speakSample"] },
    ],
    [
      { t: "Tối · 60 phút", h: "Tự chấm Writing & Speaking", s: ["Đọc band descriptors. Dán bài Writing vào AI với câu lệnh chữa bài (mục Tài liệu).", "Đọc bài mẫu có điểm và nhận xét của giám khảo để thấy band 5, 6, 7 khác nhau thế nào."], l: ["bdW", "bdS", "writeSample"] },
      { t: "Tối · 30 phút", h: "Band 6 khác band 7 ở đâu", s: ["Đọc bài của IELTS về sự khác biệt giữa band 6 và 7. Ghi 3 điều bạn cần đạt được."], l: ["diff67"] },
    ],
    [
      { t: "Tối · 30 phút", h: "Chốt điểm đầu vào", s: ["Ghi 4 điểm: Listening, Reading, Writing (ước tính), Speaking (ước tính).", "Kỹ năng thấp nhất sẽ được thêm 15 phút chữa bài mỗi thứ Bảy."] },
      { t: "Việc cần làm", h: "Mua sách", s: ["Cambridge IELTS 15 Academic (dùng từ tuần 1) và 16 Academic (dùng từ tuần 5). Các cuốn sau mua dần theo mục Tài liệu."] },
    ],
    [
      { t: "10 phút", h: "Bắt đầu chuỗi ngày học", s: ["Thêm 10 từ đầu tiên vào flashcard: chọn từ bạn chưa biết trong Oxford 3000 (cấp A2–B1)."], l: ["notebook", "ox3000"] },
      { t: "Tùy chọn", h: "Giải trí bằng tiếng Anh", s: ["Xem một bộ phim với phụ đề tiếng Anh."], opt: true },
    ],
    sunday(),
  ][d];
}

function week32Day(w, d) {
  return [
    [flash(), { t: "Tối · 60 phút", h: "10 lỗi quan trọng nhất", s: ["Đọc lại toàn bộ sổ lỗi, chọn 10 lỗi hay lặp nhất, viết lại câu đúng lên một trang. Đây là trang bạn đọc lại trước ngày thi."] }, { t: "Tối · 30 phút", h: "Nói Part 2", s: ["Chọn 3 đề Part 2 của các tuần trước, mỗi đề nói 2 phút có ghi âm."] }],
    [{ t: "Tối · 2 giờ 40 phút", h: "Tổng duyệt trên giao diện thi thật", s: ["Làm lại bài thi làm quen chính thức: Listening + Reading + Writing, đúng giờ, không nghỉ.", "Mục tiêu là quen thao tác trên máy (đánh dấu, highlight, đếm từ), không phải điểm số."], l: ["famTest"] }],
    [flash(), { t: "Tối · 40 phút", h: "Chữa bài tổng duyệt", s: ["Chỉ xem lỗi thuộc 10 lỗi quan trọng nhất. Lỗi mới thì ghi lại, không học thêm gì."] }, { t: "Tối · 20 phút", h: "Speaking mock", s: ["Dùng đề mẫu chính thức, nói đủ 3 part có ghi âm. So với bản ghi âm Tuần 0."], l: ["speakSample"] }],
    [flash(), { t: "Tối · 30 phút", h: "Học nhẹ", s: ["Nghe tập 6 Minute English của tuần.", "Xem 2 TED talk ngắn về sự bền bỉ."], l: [w.six, "t32", "t32b"] }, { t: "Tùy chọn · 40 phút", h: "Task 2 cuối cùng", s: ["Đề: " + w.t2.prompt], opt: true, l: w.t2.links }],
    [flash(), { t: "Tối · 20 phút", h: "Chuẩn bị ngày thi", s: ["Kiểm tra giấy tờ tùy thân đã dùng khi đăng ký, địa điểm thi, giờ có mặt, đường đi.", "Đi ngủ sớm."] }],
    [{ t: "Cả ngày", h: "Nghỉ", s: ["Không học. Vận động nhẹ, ngủ đủ."], opt: true }],
    [{ t: "10 phút", h: "Đọc lại trang 10 lỗi", s: ["Tuần sau thi. Đọc lại trang 10 lỗi quan trọng nhất, rồi nghỉ."] }],
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
  if (d < 6 && w.n !== 0) tasks = tasks.concat([minTask()]);
  return tasks.map((t, i) => ({ ...t, id: t.min ? `${w.n}-${d}-min` : `${w.n}-${d}-${i}` }));
}


// ---------- Tiến độ & chuỗi ngày ----------
const counted = (t) => !t.min && !t.opt;
function dayProgress(weekNo, d) {
  const ts = tasksFor(weekNo, d);
  const main = ts.filter(counted);
  return {
    total: main.length,
    checked: main.filter((t) => done[t.id]).length,
    minDone: ts.some((t) => t.min && done[t.id]),
    left: main.filter((t) => !done[t.id]).reduce((sum, t) => sum + minutesOf(t), 0),
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
  const t = today();
  let cursor = days.has(toISO(t)) ? t : addDays(t, -1);
  let streak = 0;
  while (days.has(toISO(cursor))) {
    streak++;
    cursor = addDays(cursor, -1);
  }
  return {
    streak,
    doneToday: days.has(toISO(t)),
    missedYesterday: days.size > 0 && !days.has(toISO(addDays(t, -1))),
    total: days.size,
  };
}

function minutesOf(t) {
  const h = t.t.match(/(\d+) giờ/);
  const m = t.t.match(/(\d+) phút/);
  return (h ? Number(h[1]) * 60 : 0) + (m ? Number(m[1]) : 0);
}
const fmtMinutes = (m) =>
  m >= 60 ? `${Math.floor(m / 60)} giờ${m % 60 ? " " + (m % 60) + " phút" : ""}` : `${m} phút`;
const pct = (p) => (p.total ? Math.round((p.checked / p.total) * 100) : 0);

// Việc được nhóm theo buổi: đúng với cách gắn thói quen (sáng trước giờ làm, tối sau bữa tối).
const BLOCKS = [["sang", "Buổi sáng"], ["chieu", "Buổi chiều"], ["toi", "Buổi tối"], ["khac", "Việc khác"]];
const blockOf = (t) =>
  t.t.startsWith("Sáng") ? "sang" : t.t.startsWith("Chiều") ? "chieu" : t.t.startsWith("Tối") ? "toi" : "khac";

// ---------- Hiển thị: phần tử cơ bản ----------
const SHORT_DAYS = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];
const $ = (sel) => document.querySelector(sel);
const el = (tag, cls, text) => {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (text !== undefined) e.textContent = text;
  return e;
};

let viewWeek = 0;
let viewDay = 0;
let scrollToDay = false; // bấm một ngày ở dải 7 ngày → cuộn tới chi tiết ngày đó

function linkList(keys) {
  const ul = el("ul", "links");
  (keys || []).forEach((k) => {
    const r = R[k];
    if (!r) {
      console.warn("Thiếu tài liệu:", k);
      return;
    }
    const li = el("li");
    const a = el("a", "", r[0]);
    a.href = r[1];
    if (!r[1].includes(".html")) {
      a.target = "_blank";
      a.rel = "noopener";
    }
    li.append(a, el("span", "meta", " · " + r[2]));
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
  renderAll();
  const again = document.querySelector(`.panel.active input[data-id="${id}"]`);
  if (again) again.focus({ preventScroll: true });
}

function renderTask(t, inBlock) {
  const box = el("div", "task" + (t.min ? " task-min" : "") + (t.opt ? " task-opt" : "") + (done[t.id] ? " is-done" : ""));
  const label = el("label", "task-head");
  const cb = el("input");
  cb.type = "checkbox";
  cb.dataset.id = t.id;
  cb.checked = !!done[t.id];
  cb.addEventListener("change", () => toggleTask(t.id, cb.checked));
  // Trong nhóm buổi đã có tên buổi, nên chỉ hiện thời lượng.
  const time = inBlock && t.t.includes(" · ") ? t.t.split(" · ").slice(1).join(" · ") : t.t;
  label.append(cb, el("span", "task-title", t.h), el("span", "task-time", time));
  box.append(label);
  if (t.s && t.s.length) {
    const ul = el("ul", "steps");
    t.s.forEach((s) => ul.append(el("li", "", s)));
    box.append(ul);
  }
  if (t.l && t.l.length) box.append(linkList(t.l));
  return box;
}

function renderBlocks(container, tasks) {
  const main = tasks.filter((t) => !t.min);
  BLOCKS.forEach(([key, label]) => {
    const items = main.filter((t) => blockOf(t) === key);
    if (!items.length) return;
    const mins = items.filter((t) => !t.opt).reduce((sum, t) => sum + minutesOf(t), 0);
    const sec = el("section", "block");
    const h = el("h3", "block-title");
    h.append(el("span", "", label));
    if (mins) h.append(el("span", "block-time", fmtMinutes(mins)));
    sec.append(h);
    items.forEach((t) => sec.append(renderTask(t, key !== "khac")));
    container.append(sec);
  });
  const min = tasks.find((t) => t.min);
  if (min) {
    const sec = el("section", "block block-min");
    sec.append(el("h3", "block-title", "Hôm nay quá bận?"));
    sec.append(renderTask(min, false));
    container.append(sec);
  }
}

function setupCard(title) {
  const card = el("div", "card setup");
  card.append(el("h2", "", title));
  card.append(el("p", "muted", "Lộ trình luôn bắt đầu vào thứ Hai. Nếu chọn ngày khác, trang sẽ tự lùi về thứ Hai của tuần đó."));
  const row = el("div", "setup-row");
  const input = el("input");
  input.type = "date";
  input.setAttribute("aria-label", "Ngày bắt đầu");
  input.value = startDate || toISO(addDays(today(), (8 - today().getDay()) % 7)); // thứ Hai gần nhất
  const btn = el("button", "primary", "Lưu");
  btn.type = "button";
  btn.addEventListener("click", () => setStart(input.value));
  row.append(input, btn);
  card.append(row);
  return card;
}

// Dải 7 ngày của một tuần: nhìn là biết tuần này đã học những ngày nào.
function weekStrip(weekNo, highlightDay) {
  const strip = el("div", "week-strip");
  const pos = planPosition();
  for (let d = 0; d < 7; d++) {
    const p = dayProgress(weekNo, d);
    const date = dateOf(weekNo, d);
    const isToday = pos && pos.week === weekNo && pos.day === d;
    const isFuture = pos && (weekNo > pos.week || (weekNo === pos.week && d > pos.day));
    let cls = "strip-day";
    if (p.total && p.checked === p.total) cls += " is-done";
    else if (p.checked || p.minDone) cls += " is-partial";
    if (isToday) cls += " is-today";
    if (isFuture) cls += " is-future";
    if (highlightDay === d) cls += " is-view";
    const b = el("button", cls);
    b.type = "button";
    b.append(el("span", "strip-name", SHORT_DAYS[d]), el("span", "strip-date", date ? fmtDate(date) : ""));
    b.title = `${DAY_NAMES[d]}: ${p.checked}/${p.total} việc` + (p.minDone ? " · đã làm bản tối thiểu" : "");
    b.addEventListener("click", () => {
      viewWeek = weekNo;
      viewDay = d;
      scrollToDay = true;
      if (location.hash === "#week") renderWeek();
      else location.hash = "week";
    });
    strip.append(b);
  }
  return strip;
}

function stat(value, label) {
  const s = el("div", "stat");
  s.append(el("span", "stat-value", value), el("span", "stat-label", label));
  return s;
}

// ---------- Hôm nay ----------
function renderToday() {
  const root = $("#today-body");
  root.innerHTML = "";
  const pos = planPosition();
  if (!pos || pos.idx < 0 || pos.week >= WEEKS.length) {
    const head = el("div", "page-head");
    head.append(el("p", "eyebrow", "IELTS 5.0 → 7.0"), el("h1", "", "Hôm nay"));
    root.append(head);
    if (!pos) root.append(setupCard("Chọn ngày bắt đầu lộ trình"));
    else if (pos.idx < 0) root.append(el("p", "card", `Lộ trình bắt đầu vào thứ Hai ${fmtDate(fromISO(startDate))}. Trong lúc chờ, bạn có thể xem trước Tuần 0 ở mục Lộ trình.`));
    else root.append(el("p", "card", "Bạn đã đi hết 33 tuần. Chúc bạn thi tốt!"));
    return;
  }

  const w = WEEKS[pos.week];
  const tasks = tasksFor(pos.week, pos.day);
  const p = dayProgress(pos.week, pos.day);
  const s = streakInfo();

  const head = el("div", "card today-head");
  const titles = el("div", "today-titles");
  titles.append(el("p", "eyebrow", `${PHASES[w.phase]} · Tuần ${w.n}`), el("h1", "", `${DAY_NAMES[pos.day]}, ${fmtDate(today())}`), el("p", "muted", w.title));
  const stats = el("div", "stats");
  const s1 = stat(`${p.checked}/${p.total}`, "việc hôm nay");
  s1.append(bar(p));
  stats.append(s1, stat(p.left ? fmtMinutes(p.left) : "Xong", p.left ? "còn lại" : "hôm nay"), stat(`🔥 ${s.streak}`, "ngày liên tiếp"));
  head.append(titles, stats);
  if (!s.doneToday && s.missedYesterday) {
    head.append(el("p", "warn", "Hôm qua bạn đã nghỉ. Hôm nay đừng nghỉ lần thứ hai: làm bản tối thiểu 15 phút cũng được."));
  }
  head.append(weekStrip(pos.week, null));
  root.append(head);

  const grid = el("div", "today-grid");
  const main = el("div", "today-main");
  renderBlocks(main, tasks);

  const rail = el("aside", "today-rail");
  const wk = el("div", "card");
  wk.append(el("p", "eyebrow", "Tuần này"), el("h3", "", w.title));
  if (w.grammar && w.n > 0 && w.n < 32) {
    const dl = el("dl", "facts");
    dl.append(el("dt", "", "Ngữ pháp"), el("dd", "", w.grammar), el("dt", "", "Chủ đề"), el("dd", "", w.topic));
    wk.append(dl);
  }
  const wp = weekProgress(pos.week);
  const prog = el("div", "progress");
  prog.append(bar(wp), el("span", "muted", `${pct(wp)}%`));
  const more = el("a", "", "Xem cả tuần →");
  more.href = "#week";
  more.addEventListener("click", () => { viewWeek = pos.week; viewDay = pos.day; });
  wk.append(prog, more);
  rail.append(wk);

  if (w.col) {
    const c = el("div", "card");
    c.append(el("p", "eyebrow", "Cụm từ của tuần"));
    const chips = el("div", "chips");
    w.col.forEach((x) => chips.append(el("span", "chip", x)));
    c.append(chips);
    rail.append(c);
  }
  if (w.sat && w.satMode !== "rest") {
    const c = el("div", "card");
    c.append(el("p", "eyebrow", "Thứ Bảy này"), el("p", "", w.sat));
    rail.append(c);
  }
  const nextIdx = pos.idx + 1;
  const nw = Math.floor(nextIdx / 7), nd = nextIdx % 7;
  if (nw < WEEKS.length) {
    const c = el("div", "card");
    c.append(el("p", "eyebrow", `Ngày mai · ${DAY_NAMES[nd]}`));
    const ul = el("ul", "steps compact");
    tasksFor(nw, nd).filter(counted).forEach((t) => ul.append(el("li", "", t.h)));
    c.append(ul);
    rail.append(c);
  }

  grid.append(main, rail);
  root.append(grid);
}

// ---------- Lộ trình (theo tuần) ----------
function renderTimeline() {
  const box = $("#timeline");
  box.innerHTML = "";
  const pos = planPosition();
  const all = planProgress();
  const top = el("div", "tl-top");
  top.append(el("span", "", pos && pos.week >= 0 && pos.week < WEEKS.length ? `Đang ở tuần ${pos.week}/32` : "Chưa bắt đầu"), el("span", "muted", `Cả lộ trình: ${pct(all)}%`));
  box.append(top);

  const cells = el("div", "tl");
  WEEKS.forEach((w) => {
    let cls = `tl-cell phase-${w.phase}`;
    if (pos && pos.week === w.n) cls += " is-current";
    if (viewWeek === w.n) cls += " is-view";
    const b = el("button", cls);
    b.type = "button";
    b.style.setProperty("--fill", pct(weekProgress(w.n)) + "%");
    b.title = `Tuần ${w.n} · ${w.title}`;
    b.setAttribute("aria-label", b.title);
    b.addEventListener("click", () => {
      viewWeek = w.n;
      viewDay = pos && pos.week === w.n ? pos.day : 0;
      renderWeek();
    });
    cells.append(b);
  });
  box.append(cells);

  const legend = el("div", "tl-legend");
  [0, 1, 2, 3].forEach((ph) => {
    const item = el("span", `legend-item phase-${ph}`);
    item.append(el("i"), document.createTextNode(ph === 0 ? "Chuẩn bị" : `Giai đoạn ${ph}`));
    legend.append(item);
  });
  box.append(legend);
}

function renderWeek() {
  renderTimeline();
  const root = $("#week-body");
  root.innerHTML = "";
  const w = WEEKS[viewWeek];

  const head = el("div", "card week-head");
  const navRow = el("div", "week-nav");
  const prev = el("button", "", "←");
  prev.type = "button";
  prev.setAttribute("aria-label", "Tuần trước");
  prev.disabled = viewWeek === 0;
  prev.addEventListener("click", () => { viewWeek--; viewDay = 0; renderWeek(); });
  const sel = el("select");
  sel.setAttribute("aria-label", "Chọn tuần");
  WEEKS.forEach((x) => {
    const o = el("option", "", `Tuần ${x.n} · ${x.title}`);
    o.value = String(x.n);
    sel.append(o);
  });
  sel.value = String(viewWeek);
  sel.addEventListener("change", () => { viewWeek = Number(sel.value); viewDay = 0; renderWeek(); });
  const next = el("button", "", "→");
  next.type = "button";
  next.setAttribute("aria-label", "Tuần sau");
  next.disabled = viewWeek === WEEKS.length - 1;
  next.addEventListener("click", () => { viewWeek++; viewDay = 0; renderWeek(); });
  navRow.append(prev, sel, next);
  head.append(navRow);

  const info = el("div", "week-info");
  const left = el("div");
  left.append(el("p", "eyebrow", `${PHASES[w.phase]} · Tuần ${w.n}`), el("h2", "", w.title));
  if (w.note) left.append(el("p", "", w.note));
  if (w.gNote && w.n !== 0) left.append(el("p", "note", w.gNote));
  info.append(left);
  if (w.n > 0 && w.n < 32) {
    const dl = el("dl", "facts");
    const add = (k, v) => { if (v) dl.append(el("dt", "", k), el("dd", "", v)); };
    add("Ngữ pháp", w.grammar);
    add("Chủ đề", w.topic);
    add("Cụm từ", w.col.join(" · "));
    if (w.t2) add("Task 2", w.t2.type);
    add("Thứ Bảy", w.sat);
    info.append(dl);
  }
  head.append(info);
  const wp = weekProgress(viewWeek);
  const prog = el("div", "progress");
  prog.append(bar(wp), el("span", "muted", `${wp.checked}/${wp.total} việc · ${pct(wp)}%`));
  head.append(prog);
  root.append(head);

  // Danh sách ngày (trái) · chi tiết ngày đang chọn (phải)
  const split = el("div", "week-split");
  const list = el("div", "day-list");
  list.setAttribute("role", "tablist");
  const pos = planPosition();
  for (let d = 0; d < 7; d++) {
    const p = dayProgress(viewWeek, d);
    const date = dateOf(viewWeek, d);
    let cls = "day-btn";
    if (d === viewDay) cls += " active";
    if (p.total && p.checked === p.total) cls += " is-done";
    if (pos && pos.week === viewWeek && pos.day === d) cls += " is-today";
    const b = el("button", cls);
    b.type = "button";
    b.setAttribute("role", "tab");
    b.setAttribute("aria-selected", String(d === viewDay));
    const name = el("span", "day-name", DAY_NAMES[d]);
    const meta = el("span", "day-meta", (date ? fmtDate(date) + " · " : "") + `${p.checked}/${p.total}`);
    b.append(name, meta, bar(p));
    b.addEventListener("click", () => { viewDay = d; renderWeek(); });
    list.append(b);
  }
  const detail = el("div", "day-detail");
  const date = dateOf(viewWeek, viewDay);
  const dh = el("div", "day-detail-head");
  dh.append(el("h2", "", DAY_NAMES[viewDay] + (date ? ", " + fmtDate(date) : "")));
  const total = tasksFor(viewWeek, viewDay).filter(counted).reduce((sum, t) => sum + minutesOf(t), 0);
  if (total) dh.append(el("span", "muted", "Tổng " + fmtMinutes(total)));
  detail.append(dh);
  renderBlocks(detail, tasksFor(viewWeek, viewDay));
  split.append(list, detail);
  root.append(split);

  // Điện thoại: danh sách ngày cuộn ngang, đưa ngày đang chọn vào tầm nhìn.
  const active = list.querySelector(".active");
  if (active && list.scrollWidth > list.clientWidth) list.scrollLeft = active.offsetLeft - list.offsetLeft - 8;
  if (scrollToDay) {
    scrollToDay = false;
    split.scrollIntoView({ block: "start" });
  }
}

// ---------- Sidebar (máy tính) ----------
function renderSide() {
  const box = $("#side-extra");
  box.innerHTML = "";
  const card = el("div", "side-card");
  const pos = planPosition();
  if (!pos) {
    const a = el("a", "", "Chọn ngày bắt đầu →");
    a.href = "#today";
    card.append(a);
  } else {
    const s = streakInfo();
    const all = planProgress();
    card.append(el("span", "side-streak", `🔥 ${s.streak}`), el("span", "muted", "ngày liên tiếp"));
    const inPlan = pos.week >= 0 && pos.week < WEEKS.length;
    card.append(el("p", "side-week", inPlan ? `Tuần ${pos.week}/32 · ${PHASES[WEEKS[pos.week].phase].split(" · ")[0]}` : "Ngoài thời gian lộ trình"));
    card.append(bar(all), el("span", "muted", `Cả lộ trình ${pct(all)}%`));
  }
  box.append(card);
}

// ---------- Tài liệu ----------
const LIB = [
  ["Bắt đầu & công cụ", ["notebook", "anki", "oxfordDict", "collocDict", "ox3000", "opal"]],
  ["Chính thức từ IELTS", ["famTest", "famInfo", "sampleQ", "speakSample", "writeSample", "bdW", "bdS", "diff67", "fmtL", "fmtR", "fmtW", "fmtS"]],
  ["Luyện đề & bài mẫu miễn phí", ["liz100", "lizT1", "lizT2", "lizP1", "lizP2", "modelOpinion", "modelDiscussion", "modelSolution", "modelAdv", "modelDirect"]],
  ["Nghe & đọc thêm khi rảnh", ["tews", "bcMag", "conversation"]],
];
function renderLibrary() {
  const root = $("#lib-body");
  root.innerHTML = "";
  root.append(setupCard("Cài đặt: ngày bắt đầu"));

  const books = el("div", "card");
  books.append(el("h2", "", "Sách cần mua"), el("p", "muted", "Mua dần theo tuần bắt đầu dùng. Sách có kèm audio và đáp án."));
  const ul = el("ul", "steps");
  BOOKS.forEach(([b, when]) => ul.append(el("li", "", `${b} — dùng từ ${when}`)));
  books.append(ul);
  root.append(books);

  [["Câu lệnh chữa Writing bằng AI", AI_PROMPT_WRITING], ["Câu lệnh chấm Speaking bằng AI", AI_PROMPT_SPEAKING]].forEach(([title, text]) => {
    const card = el("div", "card");
    card.append(el("h2", "", title));
    card.append(el("p", "muted", "AI chấm điểm chỉ mang tính ước lượng. Hãy dùng nó chủ yếu để tìm lỗi, và mỗi 1–2 tháng nhờ giáo viên chấm một lần để đối chiếu."));
    const pre = el("pre", "prompt", text);
    const btn = el("button", "", "Sao chép");
    btn.type = "button";
    btn.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(text);
        btn.textContent = "Đã chép";
      } catch {
        btn.textContent = "Hãy bôi đen và chép tay";
      }
      setTimeout(() => (btn.textContent = "Sao chép"), 2000);
    });
    card.append(pre, btn);
    root.append(card);
  });

  LIB.forEach(([title, keys]) => {
    const card = el("div", "card");
    card.append(el("h2", "", title), linkList(keys));
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
  renderAll();
  location.hash = "today";
}
function renderAll() {
  renderToday();
  renderWeek();
  renderSide();
  renderLibrary();
}

(function init() {
  const pos = planPosition();
  if (pos && pos.week >= 0 && pos.week < WEEKS.length) {
    viewWeek = pos.week;
    viewDay = pos.day;
  }
  renderAll();
  mountNav("today", (id) => { if (id === "week") renderWeek(); });
})();
