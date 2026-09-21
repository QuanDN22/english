# English Notebook

Trang cá nhân để học tiếng Anh: lộ trình IELTS 5.0 → 7.0 trong 33 tuần (mỗi ngày có việc cụ thể và link tài liệu đã chọn sẵn), sổ từ vựng và flashcard. Có tiếng Việt / English, giao diện sáng / tối / theo hệ thống.

Địa chỉ: https://quandn22.github.io/english/ — các mục: `#today`, `#week`, `#words`, `#cards`, `#lib`, `#settings`.

Dữ liệu (tiến độ, từ vựng, cài đặt) lưu trong `localStorage` của trình duyệt, nên mỗi máy và mỗi trình duyệt có dữ liệu riêng. Từ vựng có thể sao lưu bằng nút Xuất/Nhập JSON.

## Cấu trúc

```
index.html              Trang duy nhất, mỗi mục là một <section class="panel">
css/base.css            Màu (sáng/tối), khung trang, sidebar, từ vựng, flashcard
css/plan.css            Giao diện lộ trình
js/i18n.js              Đa ngôn ngữ + tùy chọn (ngôn ngữ, giao diện)
js/locales/vi.js, en.js Chuỗi giao diện
js/content/vi.js, en.js Nội dung từng tuần (tên tuần, ghi chú ngữ pháp, nhật ký...)
js/plan-data.js         Cấu trúc lộ trình, link tài liệu, đề bài (không phụ thuộc ngôn ngữ)
js/plan.js              Ghép lịch từng ngày, tiến độ, vẽ mục Hôm nay / Lộ trình / Tài liệu
js/notebook.js          Từ vựng + flashcard
js/settings.js          Mục Cài đặt
js/nav.js               Điều hướng (thanh dưới / thanh dọc / sidebar)
js/app.js               Khởi động
tools/check-links.py    Kiểm tra link
archive/                5 file lộ trình tham khảo ban đầu
```

## Thêm một ngôn ngữ

1. Tạo `js/locales/<mã>.js` với `I18N.register("<mã>", "<tên>", { ... })`, dịch các khóa trong `js/locales/vi.js`.
2. Tạo `js/content/<mã>.js` với `I18N.content("<mã>", { ... })`, dịch nội dung trong `js/content/vi.js`.
3. Thêm 2 thẻ `<script>` vào `index.html`. Nút chọn ngôn ngữ trong Cài đặt sẽ tự xuất hiện.

Khóa nào chưa dịch sẽ tự dùng bản tiếng Việt, nên có thể dịch dần.

## Chạy thử trên máy

```bash
python3 -m http.server 8000
```

Mở http://localhost:8000

## Kiểm tra link định kỳ

Video và trang web có thể bị gỡ. Nên chạy lệnh này mỗi 1–2 tháng:

```bash
python3 tools/check-links.py
```

British Council chặn công cụ tự động, nên script chỉ liệt kê các link đó để bạn mở tay vài cái.
