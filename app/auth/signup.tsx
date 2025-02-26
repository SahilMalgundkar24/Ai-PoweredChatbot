import {
  View,
  Text,
  TextInput,
  Button,
  Alert,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import { router, SplashScreen, Stack } from "expo-router";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "@/config/firebase.config";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Signup() {
  SplashScreen.hideAsync();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      await updateProfile(userCredential.user, {
        displayName: name,
      });

      await AsyncStorage.setItem("userName", name);

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
          Signup
        </Text>

        <TextInput
          placeholder="Enter Name"
          value={name}
          onChangeText={setName}
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
        />

        <TextInput
          placeholder="Enter Email"
          value={email}
          onChangeText={setEmail}
          placeholderTextColor="#888888"
          keyboardType="email-address"
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
            marginBottom: 36,
          }}
        />

        <TouchableOpacity
          onPress={handleSignup}
          activeOpacity={0.9}
          style={{
            backgroundColor: "#B2ACFB",
            paddingVertical: 10,
            paddingHorizontal: 40,
            borderRadius: 99,
          }}
        >
          <Text>SignUp</Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => {
            router.push("/auth/login");
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
            Already have a account? Login
          </Text>
        </TouchableOpacity>
      </View>
    </>
  );
}
