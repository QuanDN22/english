# English Notebook

Trang cá nhân để học tiếng Anh.

- **index.html**: lưu từ vựng và ôn bằng flashcard.
- **lo-trinh.html**: lộ trình IELTS 5.0 → 7.0 trong 33 tuần. Mỗi ngày có việc cụ thể và link tài liệu đã chọn sẵn, kèm đánh dấu tiến độ và chuỗi ngày học.

Dữ liệu (từ vựng, tiến độ) lưu trong `localStorage` của trình duyệt, nên mỗi máy và mỗi trình duyệt có dữ liệu riêng. Từ vựng có thể sao lưu bằng nút Xuất/Nhập JSON.

## Chạy thử trên máy

```bash
python3 -m http.server 8000
```

Mở http://localhost:8000

## Sửa lộ trình

- Nội dung từng tuần và danh sách tài liệu: `lo-trinh-data.js`
- Cách ghép việc theo từng ngày: `lo-trinh.js`

## Kiểm tra link định kỳ

Video và trang web có thể bị gỡ. Nên chạy lệnh này mỗi 1–2 tháng:

```bash
python3 check-links.py
```

British Council chặn công cụ tự động, nên script chỉ liệt kê các link đó để bạn mở tay vài cái.
