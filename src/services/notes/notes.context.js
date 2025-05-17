import React, { createContext, useState, useEffect } from "react";
// Import firebase auth và database để xác thực và thao tác dữ liệu realtime
import { auth } from "../auth/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { getDatabase, ref, set, onValue, remove } from "firebase/database";

// Tạo context cho ghi chú, giúp chia sẻ state và action cho toàn bộ app
export const NotesContext = createContext();

// Provider cho context ghi chú, bọc quanh toàn bộ app
export const NotesContextProvider = ({ children }) => {
  // State lưu danh sách ghi chú hiện tại của user
  const [notes, setNotes] = useState([]);
  // State lưu thông tin user hiện tại (firebase user)
  const [user, setUser] = useState(null);

  // Theo dõi trạng thái đăng nhập của user (tự động cập nhật khi đăng nhập/đăng xuất)
  useEffect(() => {
    // onAuthStateChanged trả về hàm unsubscribe, cần return để cleanup khi unmount
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      // Có thể thêm logic ở đây nếu muốn thực hiện action khi user đăng nhập/xuất
    });
    return unsubscribe;
  }, []);

  // Khi user thay đổi, load notes từ Firebase Realtime Database
  useEffect(() => {
    if (!user) {
      setNotes([]);
      return;
    }
    const db = getDatabase();
    // Đường dẫn tới notes của user hiện tại trên database
    const notesRef = ref(db, `notes/${user.uid}`);
    // Lắng nghe realtime thay đổi dữ liệu notes (tự động update khi có thay đổi)
    const unsubscribe = onValue(notesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        // Chuyển object thành array và sắp xếp theo thời gian tạo mới nhất
        const arr = Object.values(data).sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
        setNotes(arr);
      } else {
        setNotes([]);
      }
    });
    // Cleanup listener khi user đổi hoặc component unmount
    return () => unsubscribe();
  }, [user]);

  // Thêm ghi chú mới lên database
  // Có thể mở rộng: validate dữ liệu, thêm trường "pinned", "tags", "reminder", v.v.
  const addNote = async (note) => {
    if (!user) return;
    const db = getDatabase();
    // Đường dẫn tới note mới (theo id)
    const noteRef = ref(db, `notes/${user.uid}/${note.id}`);
    await set(noteRef, note);
    // Nếu muốn gửi thông báo/thực hiện action sau khi thêm, có thể thêm ở đây
    // Ví dụ: gửi notification, log lịch sử, trigger cloud function, ...
  };

  // Xoá ghi chú khỏi database
  // Có thể mở rộng: xác nhận trước khi xoá, lưu vào thùng rác (soft delete), log lịch sử xoá
  const deleteNote = async (id) => {
    if (!user) return;
    const db = getDatabase();
    const noteRef = ref(db, `notes/${user.uid}/${id}`);
    await remove(noteRef);
    // Có thể thêm logic: cập nhật số lượng note, gửi thông báo, v.v.
  };

  // Sửa/ghi đè ghi chú lên database
  // Có thể mở rộng: chỉ update trường thay đổi, kiểm tra quyền, log lịch sử chỉnh sửa
  const updateNote = async (updatedNote) => {
    if (!user) return;
    const db = getDatabase();
    const noteRef = ref(db, `notes/${user.uid}/${updatedNote.id}`);
    await set(noteRef, updatedNote);
    // Có thể thêm logic: cập nhật thời gian sửa, gửi notification, v.v.
  };

  // (Gợi ý mở rộng) Lấy 1 ghi chú theo id (dùng cho màn hình edit chi tiết)
  // const getNote = async (id) => {
  //   if (!user) return null;
  //   const db = getDatabase();
  //   const noteRef = ref(db, `notes/${user.uid}/${id}`);
  //   const snapshot = await get(noteRef);
  //   return snapshot.exists() ? snapshot.val() : null;
  // };

  // (Gợi ý mở rộng) Tìm kiếm ghi chú theo từ khoá
  // const searchNotes = (keyword) => {
  //   return notes.filter(note => note.title.includes(keyword) || note.content.includes(keyword));
  // };

  // (Gợi ý mở rộng) Ghim ghi chú quan trọng
  // const pinNote = async (id, pinned) => {
  //   // Update trường pinned cho note
  // };

  // (Gợi ý mở rộng) Đồng bộ offline/online, cache local, undo/redo, v.v.

  // Trả về context provider cho toàn app, truyền các action và state xuống các component con
  return (
    <NotesContext.Provider
      value={{
        notes,         // Danh sách ghi chú hiện tại
        addNote,       // Hàm thêm ghi chú
        deleteNote,    // Hàm xoá ghi chú
        updateNote,    // Hàm cập nhật ghi chú
        user,          // Thông tin user hiện tại
        // getNote,    // (nếu muốn dùng)
        // searchNotes,// (nếu muốn dùng)
        // pinNote,    // (nếu muốn dùng)
      }}
    >
      {children}
    </NotesContext.Provider>
  );
};
