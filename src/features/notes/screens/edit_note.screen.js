import React, { useContext, useState, useEffect } from "react";
import { Text, View, TextInput, Keyboard } from "react-native";
import styled from "styled-components/native";
import { useTheme } from "styled-components";
import { Spacer } from "../../../components/spacer/spacer.component";
import { NotesContext } from "../../../services/notes/notes.context";
import { useIsFocused } from "@react-navigation/native";
import { SafeArea } from "../../../components/utility/safe-area.component";

// Styled-components cho UI
const Container = styled.View`
  flex: 1;
  background-color: ${(props) => props.theme.colors.bg.primary};
`;
const TitleContainer = styled.View`
  padding-horizontal: ${(props) => props.theme.space[4]};
  padding-vertical: ${(props) => props.theme.space[2]};
  margin-horizontal: ${(props) => props.theme.space[2]};
  background-color: ${(props) => props.theme.colors.ui.primary};
  border-radius: ${(props) => props.theme.sizes[1]};
`;
const NoteContainer = styled.View`
  flex: 1;
  padding-vertical: ${(props) => props.theme.space[2]};
  padding-horizontal: ${(props) => props.theme.space[4]};
  margin: ${(props) => props.theme.space[2]};
  background-color: ${(props) => props.theme.colors.ui.primary};
  border-radius: ${(props) => props.theme.sizes[1]};
`;
const Loading = styled.ActivityIndicator`
  flex: 1;
`;

export const EditNoteScreen = ({ route, navigation }) => {
  // Lấy các biến cần thiết từ navigation và context
  const isFocused = useIsFocused();
  const theme = useTheme();
  const { noteId } = route.params;
  const [id, setId] = useState(noteId);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [date, setDate] = useState(new Date(Date.now()));
  const [newNote, setNewNote] = useState(false);
  const {
    notes,
    getNotes,
    getNote,
    updateNote,
    addNote,
    deleteNote,
    isLoading,
  } = useContext(NotesContext);

  // Undo/redo stack cho nội dung ghi chú
  const [contentUndoStack, setContentUndoStack] = useState([]);
  const [contentRedoStack, setContentRedoStack] = useState([]);

  // Hàm cập nhật nội dung và lưu vào undo stack
  const updateContent = (text) => {
    setContentUndoStack([...contentUndoStack, content]);
    setContentRedoStack([]);
    setContent(text);
  };

  // Undo nội dung
  const undoContent = () => {
    if (contentUndoStack.length > 0) {
      setContentRedoStack([...contentRedoStack, content]);
      setContent(contentUndoStack.pop());
      setContentUndoStack([...contentUndoStack]);
    }
  };

  // Redo nội dung
  const redoContent = () => {
    if (contentRedoStack.length > 0) {
      setContentUndoStack([...contentUndoStack, content]);
      setContent(contentRedoStack.pop());
      setContentRedoStack([...contentRedoStack]);
    }
  };

  // Cập nhật các hàm undo/redo cho navigation params để dùng ở header
  useEffect(() => {
    navigation.setParams({
      undoContent: undoContent,
      redoContent: redoContent,
      contentUndoStackLength: contentUndoStack.length,
      contentRedoStackLength: contentRedoStack.length,
    });
  }, [contentUndoStack, contentRedoStack]);

  // Hàm lấy dữ liệu ghi chú từ database (nếu có)
  const fetchNoteData = async () => {
    console.log("fetching note data ", id);
    const noteData = await getNote(id);
    if (noteData != null) {
      console.log("fetchNoteData data:", noteData);
      setTitle(noteData.title);
      setContent(noteData.content);
      console.log("date type: ", typeof new Date(Date.now()));
      setDate(new Date(noteData.date));
      setNewNote(false);
    } else {
      console.log("fetchNoteData null");
      setNewNote(true);
    }
  };

  // Hàm lưu hoặc xoá ghi chú khi rời khỏi màn hình
  handleFinishEdit = () => {
    if (title == "" && content == "") {
      console.log("removing note");
      if (!newNote) {
        deleteNote(id); // Xoá trên realtime database
      }
    } else {
      if (newNote) {
        addNote({ id, title, content, createdAt: new Date().toISOString() }); // Thêm lên realtime database
      } else {
        updateNote({
          id,
          title,
          content,
          createdAt: new Date().toISOString(),
        }); // Sửa trên realtime database
      }
    }
  };

  // Khi vào màn hình, load dữ liệu ghi chú
  useEffect(() => {
    fetchNoteData();
  }, [id]);

  // Khi rời khỏi màn hình, tự động lưu hoặc xoá ghi chú
  useEffect(() => {
    if (!isFocused) {
      console.log("Navigated away from EditNoteScreen");
      handleFinishEdit();
    }
  }, [isFocused]);

  useEffect(() => {
    console.log(date.getMonth() + 1);
  }, [date]);

  return (
    <Container>
      <Spacer position="top" size="large"></Spacer>
      {isLoading ? (
        <SafeArea>
          <Loading animating={true} color="tomato" size={100} />
        </SafeArea>
      ) : (
        <>
          {/* Ô nhập tiêu đề */}
          <TitleContainer>
            <TextInput
              placeholder="Title"
              multiline={true}
              value={title}
              onChangeText={(text) => setTitle(text)}
              style={{
                fontSize: 25,
                color: theme.colors.text.primary,
              }}
              placeholderTextColor={theme.colors.text.secondary}
            />
          </TitleContainer>
          {/* Ô nhập nội dung */}
          <NoteContainer>
            <TextInput
              placeholder="Write something..."
              value={content}
              onChangeText={(text) => updateContent(text)}
              multiline={true}
              style={{
                fontSize: 16,
                color: theme.colors.text.primary,
              }}
              placeholderTextColor={theme.colors.text.secondary}
            />
          </NoteContainer>
        </>
      )}
    </Container>
  );
};
