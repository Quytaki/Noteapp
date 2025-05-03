# 📝 Ứng Dụng Ghi Chú Đơn Giản (Note App)

Đây là một ứng dụng ghi chú đơn giản được xây dựng bằng **React Native** + **JavaScript** sử dụng nền tảng **Expo**. Hiện tại, ứng dụng đã hỗ trợ lưu và hiển thị ghi chú sử dụng **AsyncStorage** để lưu dữ liệu cục bộ.

---

## ⚙️ Tính năng đã hoàn thành

- 🖊️ Thêm ghi chú với tiêu đề và nội dung
- 💾 Lưu trữ ghi chú cục bộ bằng `AsyncStorage`
- 📄 Hiển thị danh sách các ghi chú đã tạo
- 🗑️ Xoá ghi chú
- ✏️ Chỉnh sửa ghi chú
- 🕒 Hiển thị thời gian tạo
- 🔍 Tìm kiếm ghi chú theo tiêu đề hoặc nội dung

---

### 🚧 Tính năng đang phát triển

- ⚙️ **Màn hình cài đặt (Settings)**: Tùy chọn thay đổi chủ đề (Dark/Light), xoá toàn bộ dữ liệu, đồng bộ đám mây,...
- ☁️ **Đồng bộ Firebase**: Lưu và đồng bộ ghi chú online
- 🌙 **Dark Mode**: Giao diện tối theo cài đặt hệ thống (chưa tích hợp hoàn chỉnh)
- 📌 **Ghim ghi chú quan trọng**: Ghi chú sẽ hiển thị lên đầu danh sách
- 🧭 **Tách màn hình (Navigation)**: Chuyển giữa các màn hình bằng điều hướng rõ ràng hơn



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
git clone https://github.com/ten-cua-ban/note-app.git
cd note-app
yarn install
npx expo start
****
```
