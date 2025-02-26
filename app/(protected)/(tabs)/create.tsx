// create.tsx
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import React, { useState } from "react";
import { router } from "expo-router";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { firestore } from "@/config/firebase.config";
import { useAuth } from "@/context/auth";

export default function Create() {
  const [chatTitle, setChatTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const handleStartChat = async () => {
    if (!chatTitle.trim()) {
      Alert.alert("Oops!", "Please enter a chat title before starting.");
      return;
    }

    if (!user) {
      Alert.alert("Error", "You must be logged in to start a chat.");
      return;
    }

    setLoading(true);

    try {
      // Create a new chat document in Firestore
      const chatRef = collection(firestore, `users/${user.uid}/chats`);
      const newChatDoc = await addDoc(chatRef, {
        title: chatTitle,
        createdAt: serverTimestamp(),
      });

      // Navigate to chat screen with the chat ID
      router.push({
        pathname: "/chatscreen",
        params: { chatId: newChatDoc.id, chatTitle: chatTitle },
      });
    } catch (error) {
      console.error("Error creating chat:", error);
      Alert.alert("Error", "Failed to create chat. Please try again.");
    } finally {
      setLoading(false);
    }
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
          opacity: loading ? 0.7 : 1,
        }}
        onPress={handleStartChat}
        disabled={loading}
      >
        <Text style={{ color: "#1D202D", fontSize: 16, fontWeight: "bold" }}>
          {loading ? "Creating..." : "Start Chat"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
