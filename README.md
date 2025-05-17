# 📝 Ứng Dụng Ghi Chú Đơn Giản (Note App)

Đây là một ứng dụng ghi chú đơn giản được xây dựng bằng **React Native** + **JavaScript** sử dụng nền tảng **Expo**. Hiện tại, ứng dụng đã hỗ trợ lưu và hiển thị ghi chú sử dụng **AsyncStorage** để lưu dữ liệu cục bộ.

---

## ⚙️ Tính năng đã hoàn thành

- 🖊️ Thêm ghi chú với tiêu đề và nội dung
- 📄 Hiển thị danh sách các ghi chú đã tạo
- 🗑️ Xoá ghi chú
- ✏️ Chỉnh sửa ghi chú
- 🕒 Hiển thị thời gian tạo
- ⚙️ Màn hình cài đặt (Settings): Đã có SettingsScreen với đổi chủ đề (Dark/Light), chọn màu chủ đề, đăng xuất.
- 🌙 Dark Mode: Đã có hỗ trợ đổi theme dark/light qua ThemeContext, chuyển đổi trong Settings.
- 🧭 Tách màn hình (Navigation): Đã có navigation rõ ràng với nhiều stack/tab navigator (AppNavigator).
- 🔑 Đăng nhập với Firebase Authentication
- 📅 Hiển thị thời gian tạo ghi chú
- 📄 Hiển thị và cập nhật danh sách ghi chú qua FlatList: Đã có sử dụng FlatList trong NotesScreen.
- 📸 Upload và hiển thị hình ảnh từ Firebase Realtime Database
- 📸 Đồng bộ dữ liệu với Firebase (Realtime Database)
- ☁️ **Đồng bộ Firebase**: Lưu và đồng bộ ghi chú online


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
| [AsyncStorage](https://react-native-async-storage.github.io/async-storage/) | Lưu dữ liệu ghi chú cục bộ |

---

## 📦 Cài đặt & chạy ứng dụng

```bash
[git clone https://github.com/Quytaki/Noteapp.git]
cd note-app
npm install
npx expo start
```
#Hoặc bằng yarn

```bash
[git clone https://github.com/Quytaki/Noteapp.git]
cd note-app
yarn install
npx expo start
****
```
