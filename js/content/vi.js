// Nội dung lộ trình theo tuần — tiếng Việt (ngôn ngữ mặc định).
// Cấu trúc, link và đề bài nằm trong js/plan-data.js; file này chỉ chứa chữ hiển thị.
// Mỗi việc (override/extra): { b: "am"|"pm"|"eve", m: số phút, tag?, opt?, h: tiêu đề, s: các bước, l: khóa tài liệu }
I18N.content("vi", {
  0: {
    title: "Chuẩn bị & kiểm tra đầu vào",
    note: "Tuần này chưa học mới. Mục tiêu: biết điểm thật của từng kỹ năng, dựng sẵn công cụ, và chốt giờ học cố định.",
  },
  1: {
    title: "Hiện tại đơn & hiện tại tiếp diễn",
    gNote: "Present simple nói về thói quen, sự thật, lịch cố định (I work in a bank). Present continuous nói về việc đang diễn ra quanh lúc nói hoặc tạm thời (I'm working from home this week). Stative verbs như know, like, want gần như không dùng dạng -ing.",
    journal: "Viết 150–200 từ: một ngày làm việc bình thường của bạn (present simple), và tuần này có gì khác thường (present continuous).",
  },
  2: {
    title: "Quá khứ đơn & quá khứ tiếp diễn",
    gNote: "Past continuous dựng bối cảnh (I was walking home...), past simple là sự việc chính cắt ngang (...when it started to rain). Used to + V nói về thói quen trong quá khứ nay không còn.",
    journal: "Kể lại một chuyến đi hoặc một ngày đáng nhớ (150–200 từ). Có ít nhất 3 câu dạng: I was ...ing when ...",
  },
  3: {
    title: "Các cách nói về tương lai",
    gNote: "be going to: dự định đã có hoặc dự đoán dựa vào dấu hiệu hiện tại. Present continuous: việc đã sắp xếp (có giờ, có người hẹn). will: quyết định ngay lúc nói, lời hứa, dự đoán theo ý kiến. Trong Writing, dùng will kèm mức độ chắc chắn: will probably, is likely to.",
    journal: "Kế hoạch 12 tháng tới của bạn (150–200 từ): việc bạn định làm (going to), việc đã hẹn tuần sau (present continuous), điều bạn nghĩ sẽ xảy ra (will / is likely to).",
  },
  4: {
    title: "So sánh hơn & so sánh nhất",
    gNote: "Tính từ ngắn thêm -er/-est, tính từ dài dùng more/most. Muốn nói mức độ chênh lệch thì thêm much, far, slightly, a little: far more expensive, slightly higher. Cấu trúc này dùng rất nhiều trong Writing Task 1.",
    journal: "So sánh quê bạn với một thành phố bạn từng đến (150–200 từ): kích thước, giá cả, con người, giao thông. Dùng ít nhất 2 lần much/far/slightly + so sánh hơn.",
  },
  5: {
    title: "Mạo từ & danh từ đếm được / không đếm được",
    gNote: "a/an: nhắc lần đầu, người nghe chưa biết cái nào. the: cả hai đã biết là cái nào, hoặc chỉ có một. Không mạo từ: nói chung chung với danh từ số nhiều hoặc không đếm được (Sugar is bad for you. Children need sleep). Đây là lỗi người Việt gặp nhiều nhất, và nó kéo điểm Grammar trong Writing.",
    journal: "Bạn đã ăn gì hôm qua, và chế độ ăn của bạn có lành mạnh không (150–200 từ)? Viết xong, khoanh tròn MỌI danh từ và kiểm tra mạo từ trước nó.",
  },
  6: {
    title: "Động từ khuyết thiếu: bắt buộc, lời khuyên, suy đoán",
    gNote: "must: người nói thấy bắt buộc. have to: quy định từ bên ngoài. don't have to: không cần (KHÁC mustn't: bị cấm). should: lời khuyên. might/may/could: có thể. Trong Writing, modals giúp bạn nói ý kiến mềm hơn, tránh khẳng định tuyệt đối.",
    journal: "Viết lời khuyên cho một người bắt đầu học tiếng Anh từ con số 0 (150–200 từ): những điều họ must, should, don't have to và mustn't làm.",
  },
  7: {
    title: "Giới từ chỉ thời gian & nơi chốn",
    gNote: "at: một điểm (at 7 pm, at the station). on: ngày hoặc bề mặt (on Monday, on the wall). in: khoảng lớn hoặc bên trong (in May, in 2026, in the city). Học giới từ đi theo tính từ thành cụm: interested in, good at, worried about.",
    journal: "Tả nhà bạn và quãng đường đi làm hoặc đi học (150–200 từ): đồ vật ở đâu, mấy giờ bạn đi và đến, đi qua những đâu. Gạch chân mọi giới từ.",
  },
  8: {
    title: "Câu hỏi & mệnh đề quan hệ · Tổng kết giai đoạn 1",
    gNote: "Câu hỏi tiếng Anh cần trợ động từ đứng trước chủ ngữ (Do you..., Have you..., Where did you...). Mệnh đề quan hệ nối thông tin vào danh từ mà không cần câu mới: The teacher who helped me most was..., The city where I grew up is...",
    journal: "Viết về một người đã ảnh hưởng đến bạn (150–200 từ), dùng ít nhất 4 mệnh đề quan hệ (who, which, that, where).",
    override: {
      4: [
        { b: "am", m: 10, h: "Ôn flashcard", s: ["Ôn hết thẻ đến hạn."] },
        { b: "eve", m: 50, h: "Ôn 8 chủ đề ngữ pháp của giai đoạn 1", s: ["Mở lại trang British Council của tuần 1 → 8, làm lại bài tập (không xem đáp án).", "Chủ đề nào sai trên 30% → ghi vào sổ lỗi, xem lại video tuần đó vào Chủ nhật."], l: ["bcPresSimple", "bcPastCont", "bcFuture", "bcComparative", "bcArticles", "bcModalOblig", "bcPrepTime", "bcQuestions"] },
        { b: "eve", m: 40, h: "Tự kiểm tra trước khi sang giai đoạn 2", s: ["Nói 3 phút về bản thân, ghi âm, so với bản ghi âm Tuần 0.", "Đếm số thẻ flashcard đã học (mục tiêu: 400+ từ/cụm từ).", "Tiêu chí sang giai đoạn 2: nghe hiểu ý chính 6 Minute English không cần transcript, và Listening Part 1–2 đúng 12/20 câu trở lên."] },
      ],
    },
  },
  9: {
    title: "Hiện tại hoàn thành",
    gNote: "Present perfect nối quá khứ với hiện tại: trải nghiệm (I've been to Japan), việc vừa xong có kết quả bây giờ (I've lost my keys), việc kéo dài tới nay (I've lived here for 5 years). Có mốc thời gian đã kết thúc (yesterday, in 2020) thì dùng past simple.",
  },
  10: {
    title: "Quá khứ hoàn thành & hiện tại hoàn thành tiếp diễn",
    gNote: "Past perfect: việc xảy ra TRƯỚC một mốc quá khứ khác (When I arrived, the film had started). Present perfect continuous nhấn mạnh quá trình kéo dài tới nay (I've been studying for two hours). Hai thì này giúp kể chuyện rõ thứ tự thời gian trong Speaking Part 2.",
  },
  11: {
    title: "Câu điều kiện loại 0, 1, 2",
    gNote: "Loại 0: sự thật luôn đúng (If you heat ice, it melts). Loại 1: tình huống có thể xảy ra (If it rains, I'll stay home). Loại 2: giả định không có thật ở hiện tại (If I had more time, I would travel). Trong Writing Task 2, câu điều kiện dùng để nêu hệ quả của một đề xuất.",
  },
  12: {
    title: "Câu tường thuật",
    gNote: "Tường thuật thường lùi thì (She said she was tired), nhưng nếu điều đó vẫn còn đúng thì không cần lùi. Học reporting verbs thay cho said: claim, argue, suggest, admit, insist. Đây là cách diễn đạt quan điểm của người khác rất hay dùng trong Writing Task 2.",
  },
  13: {
    title: "Mệnh đề quan hệ xác định & không xác định",
    gNote: "Mệnh đề xác định (không có dấu phẩy) cho biết đang nói về cái NÀO. Mệnh đề không xác định (có dấu phẩy) chỉ thêm thông tin, không dùng that: My brother, who lives in Hanoi, is a doctor. Dùng đúng giúp câu Writing dài mà vẫn rõ, đó là điểm Grammatical Range.",
    extra: {
      6: [{ tag: "optional", m: 0, opt: true, h: "Đặt 1 buổi chữa Writing/Speaking với giáo viên", s: ["Giữa lộ trình là lúc nên có người thật chấm 1 lần để kiểm tra AI có chấm lệch không. Mang theo 2 bài Task 2 và 1 bản ghi âm Part 2."] }],
    },
  },
  14: {
    title: "Câu bị động",
    gNote: "Dùng bị động khi hành động hoặc kết quả quan trọng hơn người làm, hoặc không rõ ai làm: The bridge was built in 1990. Bị động là chìa khóa của Writing Task 1 dạng quy trình (process): Leaves are picked, then they are dried...",
  },
  15: {
    title: "V-ing hay to V",
    gNote: "Một số động từ đi với V-ing (enjoy, avoid, consider), một số đi với to V (want, decide, plan). Remember/forget/stop/try đổi nghĩa theo dạng: stop smoking (bỏ hút thuốc) khác stop to smoke (dừng lại để hút). Học theo cụm, đừng học quy tắc suông.",
  },
  16: {
    title: "Suy đoán về quá khứ",
    gNote: "must have + V3: gần như chắc chắn đã xảy ra. might/could have + V3: có thể đã. can't have + V3: chắc chắn không. should have + V3: đáng lẽ nên (tiếc nuối). Rất tự nhiên khi nói Speaking Part 3 về lịch sử: People must have worked extremely hard...",
  },
  17: {
    title: "Từ nối chỉ sự tương phản · Tuần tập trung Writing",
    gNote: "although + mệnh đề (Although it was expensive, ...), despite/in spite of + danh từ hoặc V-ing (Despite the cost, ...), however đứng đầu câu mới, có dấu phẩy. whereas để so sánh hai đối tượng trong Task 1. Dùng đúng từ nối là tiêu chí Coherence & Cohesion.",
  },
  18: {
    title: "Cụm động từ · Tuần tập trung Speaking",
    grammar: "Phrasal verbs (4 loại, vị trí tân ngữ)",
    gNote: "Phrasal verb làm câu nói tự nhiên hơn: find out, set up, carry on, come up with. Với loại tách được, đại từ phải đứng giữa: turn it off (không nói turn off it). Dùng nhiều trong Speaking; trong Writing trang trọng thì chọn từ tương đương (investigate thay find out).",
    extra: {
      5: [{ b: "pm", m: 30, h: "Speaking mock với người thật", s: ["Nhờ bạn bè, đồng nghiệp hoặc gia sư hỏi bạn đủ 3 part (khoảng 14 phút), dùng đề mẫu chính thức.", "Ghi âm lại để nghe và ghi lỗi vào sổ."], l: ["speakSample", "bdS"] }],
    },
  },
  19: {
    title: "Ôn tập giai đoạn 2 · xử lý điểm yếu",
    grammar: "Ôn tổng hợp các thì (narrative tenses)",
    gNote: "Tuần này không học chủ đề mới. Lấy sổ lỗi ra, chọn 3 lỗi lặp lại nhiều nhất, và dành mọi buổi ngữ pháp cho 3 lỗi đó.",
  },
  20: {
    title: "Thi thử giữa lộ trình",
    grammar: "Không học mới — ôn theo sổ lỗi",
    gNote: "Mục tiêu tuần này: đo tiến bộ bằng một bài thi thử đầy đủ, rồi so với Tuần 0 và Tuần 8. Nếu Listening/Reading đã ở mức 6.0–6.5 thì bạn đang đúng hướng.",
    satNote: "THI THỬ ĐẦY ĐỦ, gõ bài Writing trên máy tính",
    extra: {
      5: [{ b: "eve", m: 20, h: "So sánh điểm với Tuần 0 và Tuần 8", s: ["Ghi điểm Listening/Reading của Tuần 0, Tuần 8 và hôm nay vào một bảng.", "Kỹ năng nào tăng ít nhất → tăng thời lượng kỹ năng đó ở giai đoạn 3 (ví dụ: đổi buổi Từ vựng thứ Hai thành luyện thêm kỹ năng đó)."] }],
    },
  },
  21: {
    title: "Câu điều kiện loại 3 & hỗn hợp",
    gNote: "Loại 3 tưởng tượng một quá khứ khác (If I had studied harder, I would have passed). Hỗn hợp nối quá khứ với hiện tại (If I had chosen medicine, I would be a doctor now). Rất hợp với Speaking Part 2 dạng 'một quyết định quan trọng'.",
  },
  22: {
    title: "Nhấn mạnh: câu chẻ & đảo ngữ với câu điều kiện",
    topic: "Environment (nâng cao)",
    gNote: "Câu chẻ đưa điểm quan trọng lên trước: What worries me most is..., It is the government that should... Đảo ngữ điều kiện trang trọng hơn If: Should you need help, ... / Had I known, ... Dùng 1–2 lần mỗi bài là đủ, đừng nhồi.",
  },
  23: {
    title: "Đảo ngữ sau trạng từ phủ định",
    gNote: "Khi câu bắt đầu bằng Not only, Rarely, Seldom, Never before, Only when..., trợ động từ đứng trước chủ ngữ: Not only does AI save time, but it also... Mang sắc thái trang trọng, hợp với Writing. Trong Speaking dùng ít thôi.",
  },
  24: {
    title: "Mong ước & thời gian không có thật",
    gNote: "wish + past simple: muốn hiện tại khác (I wish I lived closer to work). wish + past perfect: tiếc về quá khứ. wish + would: phàn nàn về hành vi người khác. It's time we + past simple: đã đến lúc nên làm.",
  },
  25: {
    title: "Văn phong trang trọng & thân mật",
    gNote: "Writing cần văn phong trang trọng: children thay vì kids, a large number of thay vì a lot of, không viết tắt (do not thay vì don't). Speaking thì ngược lại, nói tự nhiên, dùng phrasal verbs. Nhầm văn phong là lỗi Lexical Resource phổ biến ở band 6.",
  },
  26: {
    title: "Sắc thái từ & từ đồng nghĩa",
    gNote: "Từ đồng nghĩa không thay được cho nhau mọi lúc: slim (khen) khác skinny (chê), determined khác stubborn. Mỗi lần tra từ mới trong Oxford, xem mục ví dụ để biết sắc thái trước khi dùng. Tránh lặp từ bằng từ thay thế và đại từ, đừng thay bằng từ lạ không chắc nghĩa.",
    extra: {
      0: [{ tag: "todo", m: 0, h: "Đăng ký ngày thi", s: ["Đăng ký thi vào khoảng tuần 33 (sau tuần cuối của lộ trình), thi trên máy tính.", "Có ngày thi cụ thể sẽ tạo hạn chót rõ ràng cho 7 tuần còn lại."], l: ["famInfo"] }],
    },
  },
  27: {
    title: "Ngữ điệu & nối âm · Tuần tập trung phát âm",
    grammar: "Không học ngữ pháp mới — dành giờ ngữ pháp cho phát âm",
    gNote: "Pronunciation chiếm 1/4 điểm Speaking. Band 7 cần nói dễ hiểu, có trọng âm câu và ngữ điệu tự nhiên, không cần giọng bản xứ. Người Việt hay mắc: nuốt âm cuối, nói đều đều từng từ, không nhấn từ khóa.",
  },
  28: {
    title: "Cụm động từ nâng cao",
    gNote: "Tuần này học phrasal verbs theo chủ đề gia đình: take after, bring up, look after, get on with, grow apart. Chú ý vị trí tân ngữ với loại tách được.",
  },
  29: {
    title: "Mệnh đề phân từ · câu gọn cho Writing",
    gNote: "Mệnh đề phân từ rút gọn câu: Having finished the report, she went home. / Built in 1990, the bridge... Giúp Writing gọn mà vẫn đa dạng cấu trúc. Chủ ngữ của hai vế phải là một, nếu không câu sẽ sai nghĩa.",
  },
  30: {
    title: "Nói giảm & lập luận cân bằng",
    gNote: "Band 7 thể hiện lập luận cân bằng, không tuyệt đối: It could be argued that..., This is likely to..., To some extent..., While it is true that... Trong Speaking Part 3, dùng để mở đầu câu trả lời trước khi đưa lý do và ví dụ.",
  },
  31: {
    title: "Ôn tổng hợp · sửa lỗi cuối",
    grammar: "Ôn theo sổ lỗi: 3 lỗi lặp nhiều nhất",
    gNote: "Không học gì mới. Mở sổ lỗi, đếm lỗi theo loại, và dành mọi buổi ngữ pháp cho 3 loại lỗi nhiều nhất. Mục tiêu là không lặp lại lỗi cũ, chứ không phải biết thêm cấu trúc mới.",
    satNote: "đề Cambridge cuối cùng",
  },
  32: {
    title: "Tổng duyệt & chuẩn bị ngày thi",
    grammar: "—",
    gNote: "Tuần nhẹ: một lần tổng duyệt trên giao diện máy tính chính thức, sau đó giảm dần cường độ. Ngủ đủ quan trọng hơn học thêm.",
  },
});
