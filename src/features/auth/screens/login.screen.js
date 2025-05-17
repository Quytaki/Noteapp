import React, { useState } from "react";
import { View, TextInput, TouchableOpacity, Text } from "react-native";
import styled, { useTheme } from "styled-components/native";
import { SafeArea } from "../../../components/utility/safe-area.component";
import { signInWithEmailAndPassword } from "firebase/auth";
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

export const LoginScreen = ({ navigation }) => {
  const theme = useTheme();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (email.trim() === "" || password.trim() === "") {
      setError("Vui lòng nhập đầy đủ thông tin.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigation.replace("MainTabs", { screen: "Notes" });
    } catch (err) {
      setError("Đăng nhập thất bại. Kiểm tra lại tài khoản hoặc mật khẩu.");
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
        {/* Nút Đăng nhập (Button) - dưới cùng form */}
        <Button onPress={handleLogin} disabled={loading}>
          <ButtonText>{loading ? "Đang đăng nhập..." : "Đăng nhập"}</ButtonText>
        </Button>
        {/* Nút chuyển sang màn hình đăng ký (TouchableOpacity) - dưới nút đăng nhập */}
        <TouchableOpacity
          style={{ marginTop: 16 }}
          onPress={() => navigation.navigate("Register")}
        >
          <Text style={{ color: theme.colors.text.link || "tomato", fontWeight: "bold" }}>
            Chưa có tài khoản? Đăng ký
          </Text>
        </TouchableOpacity>
      </Container>
    </SafeArea>
  );
};
