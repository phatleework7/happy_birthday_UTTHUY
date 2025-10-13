# Happy Birthday (Dì 1969)

Trang web tĩnh chúc mừng sinh nhật dành riêng cho Dì (sinh năm 1969, kinh doanh sắt thép). Phong cách sang trọng, tinh tế, chủ đề màu vàng đồng + trắng ngà, hiệu ứng nhẹ nhàng, tối ưu cho điện thoại và máy tính. Code thuần HTML/CSS/JS, không dùng thư viện nặng.

## Chạy dev nhanh (npm run dev)
Yêu cầu: Node 18+ (khuyến nghị 20+). Trên macOS M4 Pro, chạy:

```bash
cd /Users/phat1/GitHub/Myself/happy_birthday_UTTHUY
npm install
npm run dev
# Mở: http://localhost:5173
```

Xem bản build tĩnh sau khi build:

```bash
npm run build
npm run preview
# Mở: http://localhost:5173
```

## Deploy Netlify
Hai cách đều OK:

- Cách A (không cần build - publish thư mục gốc): trong Netlify, chọn Publish directory là `.` (đã cấu hình trong `netlify.toml`). Hoặc dùng CLI:
  ```bash
  npm i -g netlify-cli
  cd /Users/phat1/GitHub/Myself/happy_birthday_UTTHUY
  netlify init
  netlify deploy --dir=.
  netlify deploy --prod --dir=.
  ```
- Cách B (build rồi publish `dist`):
  ```bash
  npm run build
  netlify deploy --prod --dir=dist
  ```

> Gợi ý: Nếu muốn Netlify luôn build, có thể thêm vào `netlify.toml`:
> ```toml
> [build]
>   command = "npm run build"
>   publish = "dist"
> ```

## Ảnh minh họa cần chuẩn bị
- Số lượng đề xuất: **8–12 ảnh** (tối thiểu 6).
- Đặt tại: `assets/images/`
- Tên gợi ý: `photo-1.jpg` … `photo-8.jpg` (có thể thêm `photo-9.jpg`, `photo-10.jpg`).
- Kích thước khuyến nghị:
  - Mobile: tối thiểu 900×1200 (dọc) hoặc 1200×900 (ngang)
  - Desktop: tối thiểu 1600×1200 (ngang) hoặc 1200×1600 (dọc)
  - Định dạng: JPG chất lượng 80–90 hoặc PNG
- Nếu thiếu ảnh, khung sẽ hiển thị "Thêm ảnh" để bạn bổ sung sau.

## Nhạc nền (tùy chọn)
- Đặt file: `assets/audio/happy-birthday.mp3` (nhạc piano instrumental nhẹ nhàng).
- Khi có file hợp lệ, nút nhạc xuất hiện góc phải dưới để bật/tắt.

## Tùy biến nhanh nội dung
- Đổi xưng hô và người gửi bằng query string:
  - Ví dụ: `http://localhost:5173/?name=D%C3%AC%20%C3%9At%20Th%E1%BB%A7y&from=Phat`
- Sửa lời chúc, tiêu đề, nội dung trong `index.html`.
- Sửa năm sinh (tính tuổi): `assets/script.js` (hằng `BIRTH_YEAR`).

## Cấu trúc dự án
```
/Users/phat1/GitHub/Myself/happy_birthday_UTTHUY
├─ index.html
├─ netlify.toml
├─ package.json
├─ assets/
│  ├─ styles.css
│  ├─ script.js
│  ├─ favicon.svg
│  ├─ images/
│  │  └─ (photo-1.jpg … photo-8.jpg)
│  └─ audio/
│     └─ (tùy chọn) happy-birthday.mp3
```

## Ghi chú
- SEO/OG: thay `assets/images/og-cover.jpg` bằng ảnh bìa thật rồi cập nhật trong `index.html`.
- Hiệu ứng đã tối ưu (reveal + confetti). Nếu muốn thêm slideshow, tôi có thể bổ sung mà không dùng thư viện nặng.
