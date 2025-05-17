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
        {/* ======================= FORM THÊM GHI CHÚ MỚI ======================= */}
        {/* Ô nhập tiêu đề (TextInput) - trên cùng form */}
        {/* Để sửa vị trí: di chuyển hoặc đổi style Input này */}
        <Input
          placeholder="Tiêu đề"
          placeholderTextColor={theme.colors.text.disabled}
          value={title}
          onChangeText={setTitle}
        />
        {/* Ô nhập nội dung (TextInput) - dưới ô tiêu đề */}
        <Input
          placeholder="Nội dung"
          placeholderTextColor={theme.colors.text.disabled}
          value={content}
          onChangeText={setContent}
          multiline
        />
        {/* Ảnh preview (nếu có) - bên trái nút Xóa ảnh */}
        {image ? (
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            {/* Ảnh preview (Image) */}
            <ImagePreview source={{ uri: `data:image/jpeg;base64,${image}` }} />
            {/* Nút Xóa ảnh (TouchableOpacity) - bên phải ảnh preview */}
            <TouchableOpacity onPress={() => setImage(null)}>
              <Text style={{ color: "tomato" }}>Xóa ảnh</Text>
            </TouchableOpacity>
          </View>
        ) : isConverting ? (
          // Thông báo đang chuyển đổi ảnh (Text) - dưới ô nội dung
          <Text style={{ color: "tomato", marginBottom: 8 }}>Đang chuyển đổi ảnh...</Text>
        ) : null}
        {/* Nút chọn ảnh (TouchableOpacity) - dưới ảnh preview hoặc dưới ô nội dung nếu chưa có ảnh */}
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
        {/* Hiển thị lỗi (Text) - dưới nút chọn ảnh */}
        {error ? (
          <Text style={{ color: theme.colors.text.error, marginBottom: 8 }}>
            {error}
          </Text>
        ) : null}
        {/* Nút Lưu ghi chú (SaveButton) - dưới cùng form thêm mới */}
        <SaveButton onPress={handleSave} disabled={isConverting}>
          <SaveButtonText>
            {isConverting ? "Đang chuyển đổi ảnh..." : "Lưu"}
          </SaveButtonText>
        </SaveButton>

        {/* ======================= DANH SÁCH GHI CHÚ ======================= */}
        {/* FlatList hiển thị danh sách ghi chú - dưới form thêm mới */}
        <FlatList
          data={notes}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => openEditModal(item)}>
              {/* Mỗi ghi chú là 1 NoteItem (View) - hàng ngang */}
              <NoteItem style={{ flexDirection: "row", alignItems: "center" }}>
                {/* Ảnh nhỏ bên trái (NoteItemImage) nếu có */}
                {item.image ? (
                  <NoteItemImage source={{ uri: `data:image/jpeg;base64,${item.image}` }} />
                ) : null}
                {/* Nội dung ghi chú (View) - bên phải ảnh */}
                <View style={{ flex: 1 }}>
                  {/* Tiêu đề (Text) - dòng đầu */}
                  <Text style={{ fontWeight: "bold", color: theme.colors.text.primary }}>
                    {item.title}
                  </Text>
                  {/* Nội dung (Text) - dòng dưới */}
                  <Text style={{ color: theme.colors.text.primary }}>{item.content}</Text>
                  {/* Ngày tạo (Text) - dưới cùng, nhỏ */}
                  <Text style={{ color: theme.colors.text.disabled, fontSize: 12 }}>
                    {item.createdAt ? new Date(item.createdAt).toLocaleString() : ""}
                  </Text>
                </View>
              </NoteItem>
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            // Thông báo khi không có ghi chú (Text) - giữa màn hình
            <Text style={{ textAlign: "center", color: theme.colors.text.disabled }}>
              Không có ghi chú nào
            </Text>
          }
        />

        {/* ======================= MODAL CHỈNH SỬA GHI CHÚ ======================= */}
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
              {/* Ô nhập tiêu đề (Input) - trên cùng modal */}
              <Input
                placeholder="Tiêu đề"
                placeholderTextColor={theme.colors.text.disabled}
                value={editTitle}
                onChangeText={setEditTitle}
              />
              {/* Ô nhập nội dung (Input) - dưới ô tiêu đề */}
              <Input
                placeholder="Nội dung"
                placeholderTextColor={theme.colors.text.disabled}
                value={editContent}
                onChangeText={setEditContent}
                multiline
              />
              {/* Ảnh preview khi chỉnh sửa (ImagePreview) - bên trái nút Xóa ảnh */}
              {editImage ? (
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <ImagePreview source={{ uri: `data:image/jpeg;base64,${editImage}` }} />
                  {/* Nút Xóa ảnh (TouchableOpacity) - bên phải ảnh preview */}
                  <TouchableOpacity onPress={() => setEditImage(null)}>
                    <Text style={{ color: "tomato" }}>Xóa ảnh</Text>
                  </TouchableOpacity>
                </View>
              ) : editIsConverting ? (
                // Thông báo đang chuyển đổi ảnh (Text) - dưới ô nội dung
                <Text style={{ color: "tomato", marginBottom: 8 }}>Đang chuyển đổi ảnh...</Text>
              ) : null}
              {/* Nút chọn ảnh khi chỉnh sửa (TouchableOpacity) - dưới ảnh preview hoặc dưới ô nội dung nếu chưa có ảnh */}
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
              {/* Hai nút: Lưu (bên trái), Xoá (bên phải) nằm cạnh nhau */}
              <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                {/* Nút Lưu (SaveButton) - bên trái */}
                <SaveButton onPress={handleEditSave} style={{ flex: 1, marginRight: 8 }} disabled={editIsConverting}>
                  <SaveButtonText>
                    {editIsConverting ? "Đang chuyển đổi ảnh..." : "Lưu"}
                  </SaveButtonText>
                </SaveButton>
                {/* Nút Xoá (SaveButton) - bên phải, màu xám */}
                <SaveButton
                  onPress={handleDelete}
                  style={{ flex: 1, backgroundColor: "gray", marginLeft: 8 }}
                >
                  <SaveButtonText>Xoá</SaveButtonText>
                </SaveButton>
              </View>
              {/* Nút Đóng modal (TouchableOpacity) - dưới cùng modal, căn giữa */}
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
// HƯỚNG DẪN SỬA VỊ TRÍ NÚT/LAYOUT (áp dụng cho toàn bộ app):
// - Để đổi vị trí nút, di chuyển component TouchableOpacity tương ứng lên/xuống hoặc đổi style (flexDirection, alignItems, margin, ...).
// - Để đổi vị trí các vùng (form thêm mới, danh sách, modal), thay đổi thứ tự hoặc style các View chứa chúng.
// - Để căn chỉnh nút theo ý muốn, sửa style trong từng TouchableOpacity hoặc View cha.
// - Để thêm nút mới, chỉ cần thêm một TouchableOpacity vào vị trí mong muốn trong layout.
// - Để kiểm tra vị trí các nút, tìm comment "Nút ..." hoặc "Ô nhập ..." hoặc "Ảnh preview ..." trong code.
