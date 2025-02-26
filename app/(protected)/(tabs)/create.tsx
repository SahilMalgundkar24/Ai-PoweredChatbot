import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import React, { useState } from "react";
import { router } from "expo-router";

export default function Create() {
  const [chatTitle, setChatTitle] = useState("");

  const handleStartChat = () => {
    if (!chatTitle.trim()) {
      Alert.alert("Oops!", "Please enter a chat title before starting.");
      return;
    }
    console.log("Chat Started with title:", chatTitle);
    router.push("/chatscreen");
  };

  return (
    <View
      style={{
        backgroundColor: "#1D202D",
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: "100%",
        padding: 20,
      }}
    >
      <Text
        style={{
          color: "white",
          fontSize: 26,
          fontWeight: "bold",
          marginBottom: 20,
          textAlign: "center",
        }}
      >
        Let's Get Talking!
      </Text>

      <TextInput
        style={{
          width: "80%",
          backgroundColor: "#2A2E3E",
          color: "white",
          padding: 12,
          borderRadius: 10,
          fontSize: 16,
          marginBottom: 20,
        }}
        placeholder="Enter chat title..."
        placeholderTextColor="#B2B2B2"
        value={chatTitle}
        onChangeText={setChatTitle}
      />

      <TouchableOpacity
        style={{
          backgroundColor: "#fff",
          paddingVertical: 12,
          paddingHorizontal: 30,
          borderRadius: 999,
        }}
        onPress={handleStartChat}
      >
        <Text style={{ color: "#1D202D", fontSize: 16, fontWeight: "bold" }}>
          Start Chat
        </Text>
      </TouchableOpacity>
    </View>
  );
}
