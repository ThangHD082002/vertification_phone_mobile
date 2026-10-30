# ABC Bank - CAMARA Network API & SIM Swap Demo (Next.js)

Dự án mô phỏng ứng dụng Mobile Banking của **ABC Bank** kết nối và kiểm thử các API chuẩn viễn thông quốc tế **CAMARA**:
- **CAMARA Number Verification v0.3**: Định danh số thuê bao ngầm qua mạng 4G/5G Viettel không cần gửi mã OTP SMS.
- **CAMARA SIM Swap v0.4**: Kiểm tra lịch sử đổi SIM gần nhất nhằm phòng chống gian lận và chiếm đoạt tài khoản khi chuyển tiền giá trị lớn.

Giao diện giữ nguyên 100% bản Figma & phong cách Mobile App với bảng màu xanh thẫm ngân hàng, hộp Terminal Console debug theo dõi từng bản tin API, ma trận 6 Test Cases và giả lập sinh trắc học FaceID (eKYC).

---

## 🚀 Hướng dẫn chạy trên Local

```bash
# 1. Cài đặt thư viện
npm install

# 2. Khởi chạy server phát triển
npm run dev
```

Mở trình duyệt tại [http://localhost:3000](http://localhost:3000).

---

## 🌐 Deploy lên Vercel

Dự án được tối ưu hóa đặc biệt để deploy lên Vercel mà không cần cấu hình phức tạp:

### Cách 1: Deploy qua Vercel Dashboard (Khuyên dùng)
1. Đẩy code lên GitHub repository.
2. Đăng nhập [vercel.com](https://vercel.com) -> Chọn **Add New Project**.
3. Import repository này từ GitHub.
4. Framework Preset sẽ tự động nhận diện là **Next.js**.
5. Bấm **Deploy**.

### Cách 2: Deploy qua Vercel CLI
```bash
npm i -g vercel
vercel
```

---

## 🛠️ Chế độ hoạt động (Modes)

1. **Offline Simulator Mode (Mặc định khi deploy lên Vercel)**:
   - Toàn bộ 6 kịch bản kiểm thử (TC-01 đến TC-06) đều có dữ liệu phản hồi mô phỏng chân thực, thời gian phản hồi thực tế và mã HTTP status code chuẩn CAMARA.
   - Thích hợp để demo trực tiếp trên Vercel cho đối tác, khách hàng mà không cần dựng backend Java.

2. **Real Backend Mode**:
   - Mở **Dev Panel** (nút nổi `DEV: TC-01` góc phải dưới) -> Bật **"Kết nối Backend thật (:8088)"**.
   - Nhập URL backend Spring Boot (ví dụ: `http://localhost:8088/api/v1` hoặc IP LAN `http://192.168.x.x:8088/api/v1`).
   - Ứng dụng sẽ gọi trực tiếp các API:
     - `GET /api/v1/number-verification/authorize-url`
     - `POST /api/v1/number-verification/verify`
     - `POST /api/v1/sim-swap/check`

---

## 📁 Cấu trúc thư mục

```
src/
├── app/
│   ├── page.tsx               # Màn A1: Đăng nhập / Nhập số điện thoại
│   ├── verify-loading/        # Màn A2: Đang xác thực ngầm qua 4G Viettel
│   ├── verify-success/        # Màn A3: Xác thực thuê bao thành công
│   ├── verify-failed/         # Màn A4: Thất bại (Wifi) -> Fallback SMS OTP
│   ├── dashboard/             # Màn B1: Trang chủ Dashboard ngân hàng
│   ├── transfer/              # Màn B2: Chuyển tiền (giao dịch lớn >10M)
│   ├── transfer-check/        # Màn B3: Đang quét lịch sử SIM Swap với Telco
│   ├── transfer-success/      # Màn B4: SIM an toàn -> Chuyển tiền thành công
│   ├── transfer-blocked/      # Màn B5: Phát hiện tráo SIM -> Khóa & yêu cầu eKYC
│   ├── dev-panel/             # Màn hình quản lý ma trận 6 test cases & logs
│   ├── telco-callback/        # Nhận OAuth callback từ cổng Telco
│   ├── layout.tsx             # Root Layout giả lập khung điện thoại
│   └── globals.css            # Tailwind & Theme styles
├── components/
│   ├── ConsoleBox.tsx         # Hộp Terminal kiểm tra bản tin Request/Response
│   ├── DevModal.tsx           # Modal cấu hình kịch bản test
│   ├── DevFloatingButton.tsx  # Nút tròn nổi kích hoạt Dev Panel
│   └── LogoutButton.tsx       # Nút đăng xuất
├── context/
│   └── MockContext.tsx        # Quản lý state test cases, logs và backend switch
├── services/
│   └── telcoApi.ts            # Xử lý gọi API nhà mạng & Browser popup
└── types/
    └── index.ts               # Định nghĩa interface CAMARA & Test cases
```
