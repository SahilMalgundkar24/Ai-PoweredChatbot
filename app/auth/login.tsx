import {
  View,
  Text,
  TextInput,
  Button,
  Alert,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/config/firebase.config";
import { router, Stack } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      const user = userCredential.user;
      if (user.displayName) {
        await AsyncStorage.setItem("userName", user.displayName);
      }

      router.push("/(protected)/(tabs)");
    } catch (error) {
      Alert.alert(error instanceof Error ? error.message : "An error occurred");
    }
  };

  return (
    <>
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          padding: 20,
          backgroundColor: "#1D202D",
        }}
      >
        <Text
          style={{
            fontSize: 24,
            fontWeight: "bold",
            marginBottom: 20,
            color: "white",
          }}
        >
          Login
        </Text>

        <TextInput
          placeholder="Enter Email"
          value={email}
          onChangeText={setEmail}
          placeholderTextColor="#888888"
          style={{
            color: "white",
            width: "80%",
            borderWidth: 1,
            borderColor: "#252C39",
            padding: 10,
            borderRadius: 8,
            marginBottom: 16,
          }}
          keyboardType="email-address"
        />

        <TextInput
          placeholder="Enter Password"
          value={password}
          onChangeText={setPassword}
          placeholderTextColor="#888888"
          secureTextEntry
          style={{
            color: "white",
            width: "80%",
            borderWidth: 1,
            borderColor: "#252C39",
            padding: 10,
            borderRadius: 8,
            marginBottom: 16,
          }}
        />

        <TouchableOpacity
          onPress={handleLogin}
          activeOpacity={0.9}
          style={{
            backgroundColor: "#B2ACFB",
            paddingVertical: 10,
            paddingHorizontal: 40,
            borderRadius: 99,
          }}
        >
          <Text>Login</Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => {
            router.push("/auth/signup");
          }}
        >
          <Text
            style={{
              color: "white",
              marginTop: 20,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            Create a account
          </Text>
        </TouchableOpacity>
      </View>
    </>
  );
}
