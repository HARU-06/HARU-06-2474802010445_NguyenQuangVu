# VLU Space — Prototype giảng viên

Prototype giao diện quản lý phòng, thiết bị, báo cáo sự cố và xác nhận nhường lịch dành cho giảng viên VLU.

## Chạy local trên Windows

Nhấp đúp `start-local.bat`. Trình duyệt sẽ mở tại:

`http://localhost:5500`

Hoặc chạy thủ công:

```powershell
python -m http.server 5500 --directory dist
```

## Triển khai

Mỗi lần cập nhật nhánh `main`, workflow `Deploy GitHub Pages` sẽ tự động triển khai nội dung trong thư mục `dist`.
