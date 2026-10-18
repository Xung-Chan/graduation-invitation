# Thiệp Mời Lễ Tốt Nghiệp (Graduation Invitation)

Trang web tĩnh thiệp mời Lễ Tốt Nghiệp được thiết kế chuẩn theo Figma:
- **Mobile layout**: Khung dọc tối ưu cho điện thoại (Figma node `146:791`).
- **Desktop layout**: Khung ngang 2 cột Scrapbook Studio dành cho máy tính (Figma node `145:340`).
- **Tên khách mời**: Tự động nhận diện từ tham số URL (`?name=...`).

---

## 🚀 Cách chạy và xem trang web

### Cách 1: Mở trực tiếp (Không cần cài đặt)
Chỉ cần nhấp đúp vào file [`index.html`](file:///d:/Study/ReactNative/graduation-invitation/index.html) để mở trực tiếp trên trình duyệt của bạn.

### Cách 2: Chạy qua Local Server
```bash
# Khởi chạy server nội bộ (port 3000)
npm start
# hoặc
node server.js
```
Sau đó truy cập: [http://localhost:3000](http://localhost:3000)

---

## 💌 Cách truyền slug / tên khách mời qua URL

Trang web tự động lấy `slug` từ tham số URL (`?slug=...` hoặc `?u=...`, `?name=...`) và tra cứu tên trong [`customer.json`](file:///d:/Study/ReactNative/graduation-invitation/customer.json):

```json
[
  { "slug": "quoc-manh", "name": "Quốc Mạnh" },
  { "slug": "minh-truong", "name": "Minh Trường" }
]
```

### Ví dụ:
- `http://localhost:3000/?slug=quoc-manh` $\rightarrow$ Hiển thị: **"Thân mời: Quốc Mạnh"**
- `http://localhost:3000/?slug=minh-truong` $\rightarrow$ Hiển thị: **"Thân mời: Minh Trường"**
- Khi truyền tên tự do: `http://localhost:3000/?name=Bạn%20Trang` $\rightarrow$ Hiển thị: **"Thân mời: Bạn Trang"**
- Mặc định (khi không có tham số): Hiển thị **"Nguyễn Văn A"**

> 💡 **Thêm khách mời mới**: Bạn chỉ cần thêm một đối tượng `{ "slug": "...", "name": "..." }` vào file [`customer.json`](file:///d:/Study/ReactNative/graduation-invitation/customer.json), trang web sẽ tự động nhận diện và cập nhật cả gợi ý chọn nhanh trong panel!

---

## ✨ Các tính năng tương tác nổi bật
1. **Hiệu ứng Scrapbook sinh động**: Các sticker chú thỏ, chuột hamster, cờ tốt nghiệp và loa phát thanh có animation đung đưa, lượn sóng nhẹ nhàng.
2. **Bắn pháo hoa 🎉**: Chạm vào hình nhân vật cử nhân hoặc mở trang để kích hoạt pháo hoa chúc mừng.
3. **Sticky Note thông minh**:
   - **Thời gian**: Bấm vào để thêm sự kiện vào **Google Calendar**.
   - **Địa điểm**: Bấm vào để mở bản đồ chỉ đường **Google Maps** đến Trường ĐH Tôn Đức Thắng.
   - **Liên hệ**: Bấm vào để mở nhanh tùy chọn **Gọi điện**, **Nhắn Zalo** hoặc **Sao chép số điện thoại**.
