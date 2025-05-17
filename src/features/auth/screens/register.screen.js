import React, { useState } from "react";
import { View, TextInput, TouchableOpacity, Text } from "react-native";
import styled, { useTheme } from "styled-components/native";
import { SafeArea } from "../../../components/utility/safe-area.component";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../../services/auth/firebase";

const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: ${(props) => props.theme.colors.bg.primary};
`;

const Input = styled.TextInput`
  width: 80%;
  padding: 12px;
  margin-bottom: 16px;
  border-radius: 8px;
  background-color: ${(props) => props.theme.colors.ui.primary};
  color: ${(props) => props.theme.colors.text.primary};
`;

const Button = styled.TouchableOpacity`
  width: 80%;
  padding: 12px;
  border-radius: 8px;
  background-color: tomato;
  align-items: center;
`;

const ButtonText = styled.Text`
  color: white;
  font-size: 16px;
  font-weight: bold;
`;

export const RegisterScreen = ({ navigation }) => {
  const theme = useTheme();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (email.trim() === "" || password.trim() === "") {
      setError("Vui lòng nhập đầy đủ thông tin.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigation.replace("MainTabs", { screen: "Notes" });
    } catch (err) {
      setError("Đăng ký thất bại. Email có thể đã được sử dụng.");
    }
    setLoading(false);
  };

  return (
    <SafeArea>
      <Container>
        {/* Ô nhập email (TextInput) - trên cùng */}
        <Input
          placeholder="Email"
          placeholderTextColor={theme.colors.text.disabled}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        {/* Ô nhập mật khẩu (TextInput) - dưới ô email */}
        <Input
          placeholder="Mật khẩu"
          placeholderTextColor={theme.colors.text.disabled}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        {/* Hiển thị lỗi (Text) - dưới ô mật khẩu */}
        {error ? (
          <Text style={{ color: theme.colors.text.error, marginBottom: 8 }}>
            {error}
          </Text>
        ) : null}
        {/* Nút Đăng ký (Button) - dưới cùng form */}
        <Button onPress={handleRegister} disabled={loading}>
          <ButtonText>{loading ? "Đang đăng ký..." : "Đăng ký"}</ButtonText>
        </Button>
        {/* Nút quay lại màn hình đăng nhập (TouchableOpacity) - dưới nút đăng ký */}
        <TouchableOpacity
          style={{ marginTop: 16 }}
          onPress={() => navigation.goBack()}
        >
          <Text style={{ color: theme.colors.text.link || "tomato", fontWeight: "bold" }}>
            Đã có tài khoản? Đăng nhập
          </Text>
        </TouchableOpacity>
      </Container>
    </SafeArea>
  );
};
