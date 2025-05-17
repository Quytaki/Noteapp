import React, { useContext, useState } from "react";
import { View, Text, TouchableOpacity, Switch, Modal, TextInput, FlatList } from "react-native";
import styled, { useTheme } from "styled-components/native";
import { SafeArea } from "../../../components/utility/safe-area.component";
import { NotesContext } from "../../../services/notes/notes.context";
import { signOut } from "firebase/auth";
import { auth } from "../../../services/auth/firebase";
import { ThemeContext } from "../../../infrastructure/theme/theme.context";

const Container = styled.View`
  flex: 1;
  padding: 24px;
  background-color: ${(props) => props.theme.colors.bg.primary};
`;

const Section = styled.View`
  margin-bottom: 32px;
`;

const Label = styled.Text`
  font-size: 16px;
  color: ${(props) => props.theme.colors.text.primary};
  margin-bottom: 8px;
`;

const Value = styled.Text`
  font-size: 16px;
  color: ${(props) => props.theme.colors.text.secondary};
  margin-bottom: 8px;
`;

const LogoutButton = styled.TouchableOpacity`
  background-color: tomato;
  padding: 12px;
  border-radius: 8px;
  align-items: center;
  margin-top: 12px;
`;

const LogoutButtonText = styled.Text`
  color: white;
  font-weight: bold;
  font-size: 16px;
`;

const ColorBox = styled.TouchableOpacity`
  width: 36px;
  height: 36px;
  border-radius: 8px;
  margin-right: 12px;
  margin-bottom: 8px;
  border-width: ${(props) => (props.selected ? 3 : 1)};
  border-color: ${(props) => (props.selected ? "tomato" : "#ccc")};
  background-color: ${(props) => props.color};
`;

const ColorPreview = styled.View`
  width: 100%;
  height: 48px;
  border-radius: 8px;
  margin-bottom: 12px;
  background-color: ${(props) => props.bg};
  justify-content: center;
  align-items: center;
  border-width: 1px;
  border-color: #ccc;
`;

const COLORS = [
  "#22223b", "#4a4e69", "#9a8c98", "#c9ada7", "#f2e9e4",
  "#ffffff", "#f5f5f5", "#e07a5f", "#3d405b", "#81b29a", "#f2cc8f"
];

export const SettingsScreen = ({ navigation }) => {
  const theme = useTheme();
  const { user } = useContext(NotesContext);

  // Theme context (tạo ở dưới)
  const { mode, setMode, customColor, setCustomColor } = useContext(ThemeContext);

  const [colorModal, setColorModal] = useState(false);
  const [inputColor, setInputColor] = useState(customColor);

  const handleLogout = async () => {
    await signOut(auth);
    navigation.replace("Login");
  };

  const handleColorPick = (color) => {
    setCustomColor(color);
    setColorModal(false);
  };

  return (
    <SafeArea>
      <Container>
        <Section>
          <Label>Thông tin tài khoản</Label>
          <Value>{user?.email || "Chưa đăng nhập"}</Value>
          <LogoutButton onPress={handleLogout}>
            <LogoutButtonText>Đăng xuất</LogoutButtonText>
          </LogoutButton>
        </Section>

        <Section>
          <Label>Chế độ hiển thị</Label>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text style={{ color: theme.colors.text.primary, marginRight: 8 }}>Light</Text>
            <Switch
              value={mode === "dark"}
              onValueChange={(v) => setMode(v ? "dark" : "light")}
              thumbColor={mode === "dark" ? "#ffb86c" : "#fff"}
              trackColor={{ false: "#bbb", true: "#23262f" }}
            />
            <Text style={{ color: theme.colors.text.primary, marginLeft: 8 }}>Dark</Text>
          </View>
        </Section>

        <Section>
          <Label>Chọn màu chủ đề</Label>
          <ColorPreview bg={customColor}>
            <Text style={{ color: theme.colors.text.primary }}>
              Preview: {customColor}
            </Text>
          </ColorPreview>
          <TouchableOpacity
            style={{
              backgroundColor: customColor,
              borderRadius: 8,
              padding: 10,
              marginBottom: 8,
              borderWidth: 1,
              borderColor: "#ccc",
              alignSelf: "flex-start"
            }}
            onPress={() => setColorModal(true)}
          >
            <Text style={{ color: theme.colors.text.primary }}>Chọn màu</Text>
          </TouchableOpacity>
        </Section>

        <Modal
          visible={colorModal}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setColorModal(false)}
        >
          <View style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.4)",
            justifyContent: "center",
            alignItems: "center"
          }}>
            <View style={{
              backgroundColor: theme.colors.bg.primary,
              borderRadius: 12,
              padding: 24,
              width: "90%"
            }}>
              <Text style={{ color: theme.colors.text.primary, marginBottom: 12 }}>
                Chọn màu chủ đề hoặc nhập mã màu hex:
              </Text>
              <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
                {COLORS.map((color) => (
                  <ColorBox
                    key={color}
                    color={color}
                    selected={customColor === color}
                    onPress={() => handleColorPick(color)}
                  />
                ))}
              </View>
              <TextInput
                style={{
                  borderWidth: 1,
                  borderColor: "#ccc",
                  borderRadius: 8,
                  padding: 8,
                  marginTop: 12,
                  color: theme.colors.text.primary
                }}
                placeholder="#abcdef"
                placeholderTextColor={theme.colors.text.disabled}
                value={inputColor}
                onChangeText={setInputColor}
                onSubmitEditing={() => {
                  if (/^#[0-9a-fA-F]{6}$/.test(inputColor)) {
                    handleColorPick(inputColor);
                  }
                }}
              />
              <ColorPreview bg={inputColor}>
                <Text style={{ color: "#fff" }}>Preview: {inputColor}</Text>
              </ColorPreview>
              <TouchableOpacity
                style={{ marginTop: 16, alignItems: "center" }}
                onPress={() => setColorModal(false)}
              >
                <Text style={{ color: theme.colors.text.link || "tomato" }}>Đóng</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </Container>
    </SafeArea>
  );
};
