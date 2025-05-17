# 📝 Ứng Dụng Ghi Chú Đơn Giản (Note App)

Đây là một ứng dụng ghi chú đơn giản được xây dựng bằng **React Native** + **JavaScript** sử dụng nền tảng **Expo**. Ứng dụng hỗ trợ lưu, chỉnh sửa, xoá và đồng bộ ghi chú (bao gồm cả hình ảnh) hoàn toàn trên **Firebase Realtime Database**.

---

## ⚙️ Tính năng đã hoàn thành

- 🖊️ Thêm ghi chú với tiêu đề và nội dung
- 📄 Hiển thị danh sách các ghi chú đã tạo
- 🗑️ Xoá ghi chú
- ✏️ Chỉnh sửa ghi chú
- 🕒 Hiển thị thời gian tạo
- ⚙️ Màn hình cài đặt (Settings): Đổi chủ đề (Dark/Light), chọn màu chủ đề, đăng xuất
- 🌙 Dark Mode: Hỗ trợ đổi theme dark/light qua ThemeContext
- 🧭 Tách màn hình (Navigation): Navigation rõ ràng với nhiều stack/tab navigator
- 🔑 Đăng nhập với Firebase Authentication
- 📅 Hiển thị thời gian tạo ghi chú
- 📄 Hiển thị và cập nhật danh sách ghi chú qua FlatList
- 📸 Thêm và hiển thị hình ảnh cho ghi chú (lưu base64 trực tiếp trong Realtime Database)
- ☁️ **Đồng bộ Firebase**: Lưu và đồng bộ toàn bộ ghi chú (và ảnh) online qua Firebase Realtime Database

---

### 🚧 Tính năng đang phát triển
- 📌 **Ghim ghi chú quan trọng**: Ghi chú sẽ hiển thị lên đầu danh sách
- ❌ Custom Hook để tái sử dụng logic (ví dụ: quản lý ghi chú, đăng nhập, tải ảnh)
- ❌ Sử dụng Redux Toolkit để quản lý trạng thái (không bắt buộc)
- 🔍 Tìm kiếm ghi chú theo tiêu đề hoặc nội dung

## 📌 Các thư viện đang sử dụng

| Thư viện | Mục đích |
|----------|----------|
| [React Native](https://reactnative.dev/) | Xây dựng giao diện người dùng di động |
| [Expo](https://expo.dev/) | Hỗ trợ phát triển và build nhanh |
| [Firebase](https://firebase.google.com/) | Xác thực, lưu trữ và đồng bộ ghi chú (Realtime Database) |
| [styled-components](https://styled-components.com/) | Styling cho React Native |
| [uuid](https://www.npmjs.com/package/uuid) | Sinh id cho ghi chú |

---

## 📦 Cài đặt & chạy ứng dụng

```bash
git clone https://github.com/Quytaki/Noteapp.git
cd note-app
npm install
npx expo start
```
# Hoặc bằng yarn

```bash
git clone https://github.com/Quytaki/Noteapp.git
cd note-app
yarn install
npx expo start
```
