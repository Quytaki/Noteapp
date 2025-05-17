import React, { useContext, useState } from "react";
// Import các component và hook cần thiết từ React Native và styled-components
import { View, Text, TextInput, TouchableOpacity, FlatList, Modal, Alert, Image } from "react-native";
import styled, { useTheme } from "styled-components/native";
import * as ImagePicker from "expo-image-picker";
import { SafeArea } from "../../../components/utility/safe-area.component";
import { NotesContext } from "../../../services/notes/notes.context";
import uuid from "uuid-random";

// Styled-components cho UI
const Container = styled.View`
  flex: 1;
  padding: 16px;
  background-color: ${(props) => props.theme.colors.bg.primary};
`;

const Input = styled.TextInput`
  border-width: 1px;
  border-color: #ccc;
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 12px;
  background-color: ${(props) => props.theme.colors.ui.primary};
  color: ${(props) => props.theme.colors.text.primary};
`;

const SaveButton = styled.TouchableOpacity`
  background-color: tomato;
  padding: 12px;
  border-radius: 8px;
  align-items: center;
  margin-bottom: 16px;
`;

const SaveButtonText = styled.Text`
  color: white;
  font-weight: bold;
  font-size: 16px;
`;

const NoteItem = styled.View`
  background-color: ${(props) => props.theme.colors.ui.primary};
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 10px;
`;

const ImagePreview = styled.Image`
  width: 80px;
  height: 80px;
  border-radius: 8px;
  margin-bottom: 8px;
  margin-right: 8px;
  background-color: #222;
`;

const NoteItemImage = styled.Image`
  width: 60px;
  height: 60px;
  border-radius: 8px;
  margin-right: 8px;
  background-color: #222;
`;

// Hàm chuyển đổi uri ảnh sang base64 để lưu lên Realtime Database
const getBase64FromUri = async (uri) => {
  return await new Promise((resolve, reject) => {
    import("expo-file-system").then(FileSystem => {
      FileSystem.readAsStringAsync(uri, { encoding: FileSystem.EncodingType.Base64 })
        .then(resolve)
        .catch(reject);
    });
  });
};

export const NotesScreen = () => {
  // Lấy theme và context ghi chú
  const theme = useTheme();
  const { notes, addNote, updateNote, deleteNote } = useContext(NotesContext);

  // State cho form thêm mới
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null); // base64 string
  const [error, setError] = useState("");
  const [isConverting, setIsConverting] = useState(false); // trạng thái chuyển đổi ảnh

  // State cho modal chỉnh sửa
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editNoteId, setEditNoteId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [editImage, setEditImage] = useState(null);
  const [editIsConverting, setEditIsConverting] = useState(false);

  // Hàm chọn ảnh cho ghi chú mới
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
      base64: false,
    });
    if (!result.canceled && result.assets && result.assets[0]?.uri) {
      setIsConverting(true);
      setImage(null);
      try {
        // Chuyển ảnh sang base64
        const base64 = await getBase64FromUri(result.assets[0].uri);
        setImage(base64);
      } catch (e) {
        setImage(null);
        Alert.alert("Lỗi", "Chuyển đổi ảnh thất bại.");
      }
      setIsConverting(false);
    }
  };

  // Hàm chọn ảnh cho ghi chú khi chỉnh sửa
  const pickEditImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
      base64: false,
    });
    if (!result.canceled && result.assets && result.assets[0]?.uri) {
      setEditIsConverting(true);
      setEditImage(null);
      try {
        const base64 = await getBase64FromUri(result.assets[0].uri);
        setEditImage(base64);
      } catch (e) {
        setEditImage(null);
        Alert.alert("Lỗi", "Chuyển đổi ảnh thất bại.");
      }
      setEditIsConverting(false);
    }
  };

  // Hàm lưu ghi chú mới lên Realtime Database
  const handleSave = async () => {
    if (isConverting) return;
    if (!title.trim() && !content.trim()) {
      setError("Vui lòng nhập tiêu đề hoặc nội dung.");
      return;
    }
    setError("");
    await addNote({
      id: uuid(),
      title,
      content,
      image,
      createdAt: new Date().toISOString(),
    });
    setTitle("");
    setContent("");
    setImage(null);
  };

  // Mở modal chỉnh sửa ghi chú
  const openEditModal = (note) => {
    setEditNoteId(note.id);
    setEditTitle(note.title);
    setEditContent(note.content);
    setEditImage(note.image || null);
    setEditModalVisible(true);
  };

  // Hàm lưu chỉnh sửa ghi chú lên Realtime Database
  const handleEditSave = async () => {
    if (editIsConverting) return;
    if (!editTitle.trim() && !editContent.trim()) {
      Alert.alert("Lỗi", "Vui lòng nhập tiêu đề hoặc nội dung.");
      return;
    }
    await updateNote({
      id: editNoteId,
      title: editTitle,
      content: editContent,
      image: editImage,
      createdAt: new Date().toISOString(),
    });
    setEditModalVisible(false);
  };

  // Hàm xoá ghi chú khỏi Realtime Database
  const handleDelete = async () => {
    Alert.alert(
      "Xác nhận xoá",
      "Bạn có chắc muốn xoá ghi chú này?",
      [
        { text: "Huỷ", style: "cancel" },
        {
          text: "Xoá",
          style: "destructive",
          onPress: async () => {
            await deleteNote(editNoteId);
            setEditModalVisible(false);
          },
        },
      ],
      { cancelable: true }
    );
  };

  // Render UI
  return (
    <SafeArea>
      <Container>
        {/* Form nhập tiêu đề và nội dung */}
        <Input
          placeholder="Tiêu đề"
          placeholderTextColor={theme.colors.text.disabled}
          value={title}
          onChangeText={setTitle}
        />
        <Input
          placeholder="Nội dung"
          placeholderTextColor={theme.colors.text.disabled}
          value={content}
          onChangeText={setContent}
          multiline
        />
        {/* Hiển thị ảnh preview nếu có */}
        {image ? (
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <ImagePreview source={{ uri: `data:image/jpeg;base64,${image}` }} />
            <TouchableOpacity onPress={() => setImage(null)}>
              <Text style={{ color: "tomato" }}>Xóa ảnh</Text>
            </TouchableOpacity>
          </View>
        ) : isConverting ? (
          <Text style={{ color: "tomato", marginBottom: 8 }}>Đang chuyển đổi ảnh...</Text>
        ) : null}
        {/* Nút chọn ảnh */}
        <TouchableOpacity
          style={{
            marginBottom: 12,
            alignSelf: "flex-start",
            backgroundColor: "#333",
            paddingHorizontal: 16,
            paddingVertical: 8,
            borderRadius: 8,
          }}
          onPress={pickImage}
        >
          <Text style={{ color: "white" }}>Chọn ảnh</Text>
        </TouchableOpacity>
        {/* Hiển thị lỗi nếu có */}
        {error ? (
          <Text style={{ color: theme.colors.text.error, marginBottom: 8 }}>
            {error}
          </Text>
        ) : null}
        {/* Nút lưu ghi chú */}
        <SaveButton onPress={handleSave} disabled={isConverting}>
          <SaveButtonText>
            {isConverting ? "Đang chuyển đổi ảnh..." : "Lưu"}
          </SaveButtonText>
        </SaveButton>
        {/* Danh sách các ghi chú */}
        <FlatList
          data={notes}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => openEditModal(item)}>
              <NoteItem style={{ flexDirection: "row", alignItems: "center" }}>
                {item.image ? (
                  <NoteItemImage source={{ uri: `data:image/jpeg;base64,${item.image}` }} />
                ) : null}
                <View style={{ flex: 1 }}>
                  <Text style={{ fontWeight: "bold", color: theme.colors.text.primary }}>
                    {item.title}
                  </Text>
                  <Text style={{ color: theme.colors.text.primary }}>{item.content}</Text>
                  <Text style={{ color: theme.colors.text.disabled, fontSize: 12 }}>
                    {item.createdAt ? new Date(item.createdAt).toLocaleString() : ""}
                  </Text>
                </View>
              </NoteItem>
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <Text style={{ textAlign: "center", color: theme.colors.text.disabled }}>
              Không có ghi chú nào
            </Text>
          }
        />

        {/* Modal chỉnh sửa ghi chú */}
        <Modal
          visible={editModalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setEditModalVisible(false)}
        >
          <View
            style={{
              flex: 1,
              backgroundColor: "rgba(0,0,0,0.5)",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <View
              style={{
                width: "90%",
                backgroundColor: theme.colors.bg.primary,
                borderRadius: 12,
                padding: 20,
              }}
            >
              {/* Form chỉnh sửa tiêu đề và nội dung */}
              <Input
                placeholder="Tiêu đề"
                placeholderTextColor={theme.colors.text.disabled}
                value={editTitle}
                onChangeText={setEditTitle}
              />
              <Input
                placeholder="Nội dung"
                placeholderTextColor={theme.colors.text.disabled}
                value={editContent}
                onChangeText={setEditContent}
                multiline
              />
              {/* Hiển thị ảnh preview khi chỉnh sửa */}
              {editImage ? (
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <ImagePreview source={{ uri: `data:image/jpeg;base64,${editImage}` }} />
                  <TouchableOpacity onPress={() => setEditImage(null)}>
                    <Text style={{ color: "tomato" }}>Xóa ảnh</Text>
                  </TouchableOpacity>
                </View>
              ) : editIsConverting ? (
                <Text style={{ color: "tomato", marginBottom: 8 }}>Đang chuyển đổi ảnh...</Text>
              ) : null}
              {/* Nút chọn ảnh khi chỉnh sửa */}
              <TouchableOpacity
                style={{
                  marginBottom: 12,
                  alignSelf: "flex-start",
                  backgroundColor: "#333",
                  paddingHorizontal: 16,
                  paddingVertical: 8,
                  borderRadius: 8,
                }}
                onPress={pickEditImage}
              >
                <Text style={{ color: "white" }}>Chọn ảnh</Text>
              </TouchableOpacity>
              {/* Nút lưu và xoá ghi chú */}
              <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <SaveButton onPress={handleEditSave} style={{ flex: 1, marginRight: 8 }} disabled={editIsConverting}>
                  <SaveButtonText>
                    {editIsConverting ? "Đang chuyển đổi ảnh..." : "Lưu"}
                  </SaveButtonText>
                </SaveButton>
                <SaveButton
                  onPress={handleDelete}
                  style={{ flex: 1, backgroundColor: "gray", marginLeft: 8 }}
                >
                  <SaveButtonText>Xoá</SaveButtonText>
                </SaveButton>
              </View>
              {/* Nút đóng modal */}
              <TouchableOpacity
                style={{ marginTop: 12, alignItems: "center" }}
                onPress={() => setEditModalVisible(false)}
              >
                <Text style={{ color: theme.colors.text.link || "tomato" }}>Đóng</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </Container>
    </SafeArea>
  );
}
