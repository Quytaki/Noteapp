import React, { createContext, useState, useEffect } from "react";
import { auth } from "../auth/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { getDatabase, ref, set, onValue, remove } from "firebase/database";

export const NotesContext = createContext();

export const NotesContextProvider = ({ children }) => {
  const [notes, setNotes] = useState([]);
  const [user, setUser] = useState(null);

  // Theo dõi đăng nhập
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
    });
    return unsubscribe;
  }, []);

  // Load notes từ Realtime Database khi user thay đổi
  useEffect(() => {
    if (!user) {
      setNotes([]);
      return;
    }
    const db = getDatabase();
    const notesRef = ref(db, `notes/${user.uid}`);
    const unsubscribe = onValue(notesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        // Chuyển object thành array
        const arr = Object.values(data).sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
        setNotes(arr);
      } else {
        setNotes([]);
      }
    });
    return () => unsubscribe();
  }, [user]);

  // Thêm ghi chú
  const addNote = async (note) => {
    if (!user) return;
    const db = getDatabase();
    const noteRef = ref(db, `notes/${user.uid}/${note.id}`);
    await set(noteRef, note);
    // Không cần setNotes ở đây vì onValue sẽ tự cập nhật
  };

  // Xoá ghi chú
  const deleteNote = async (id) => {
    if (!user) return;
    const db = getDatabase();
    const noteRef = ref(db, `notes/${user.uid}/${id}`);
    await remove(noteRef);
  };

  // Sửa ghi chú
  const updateNote = async (updatedNote) => {
    if (!user) return;
    const db = getDatabase();
    const noteRef = ref(db, `notes/${user.uid}/${updatedNote.id}`);
    await set(noteRef, updatedNote);
  };

  return (
    <NotesContext.Provider
      value={{
        notes,
        addNote,
        deleteNote,
        updateNote,
        user,
      }}
    >
      {children}
    </NotesContext.Provider>
  );
};
