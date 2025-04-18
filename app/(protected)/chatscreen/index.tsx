// chatscreen.tsx
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import React, { useState, useRef, useEffect } from "react";
import { useLocalSearchParams } from "expo-router";
import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  orderBy,
  onSnapshot,
  doc,
  getDoc,
} from "firebase/firestore";
import { firestore } from "@/config/firebase.config";
import { useAuth } from "@/context/auth";
import Constants from "expo-constants";
import { shareAsync } from "expo-sharing";
import * as FileSystem from "expo-file-system";

export default function ChatScreen() {
  const { chatId, chatTitle } = useLocalSearchParams();
  const [messages, setMessages] = useState<
    { id?: string; text: string; sender: "user" | "bot"; timestamp?: any }[]
  >([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  const { user } = useAuth();
  const scrollViewRef = useRef<ScrollView>(null);

  const API =
    Constants.expoConfig?.extra?.EXPO_PUBLIC_GEMINI_API_KEY ||
    process.env.EXPO_PUBLIC_GEMINI_API_KEY;

  // Load messages when component mounts
  useEffect(() => {
    if (!user || !chatId) return;

    const chatRef = doc(firestore, `users/${user.uid}/chats/${chatId}`);
    const messagesRef = collection(chatRef, "messages");
    const messagesQuery = query(messagesRef, orderBy("timestamp", "asc"));

    // Check if chat exists and has messages
    const fetchInitialData = async () => {
      try {
        const chatDoc = await getDoc(chatRef);

        if (!chatDoc.exists()) {
          await addDoc(messagesRef, {
            text: "Hello! How can I help you today?",
            sender: "bot",
            timestamp: serverTimestamp(),
          });
        }
      } catch (error) {
        console.error("Error fetching chat:", error);
      }
    };

    fetchInitialData();

    // Subscribe to messages
    const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
      const messagesList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as {
        id: string;
        text: string;
        sender: "user" | "bot";
        timestamp: any;
      }[];

      setMessages(messagesList);
      setInitialLoading(false);
    });

    return () => unsubscribe();
  }, [user, chatId]);

  const sendMessage = async () => {
    if (!input.trim() || !user || !chatId) return;

    const userMessageText = input;
    setInput("");
    setLoading(true);

    try {
      const chatRef = doc(firestore, `users/${user.uid}/chats/${chatId}`);
      const messagesRef = collection(chatRef, "messages");

      await addDoc(messagesRef, {
        text: userMessageText,
        sender: "user",
        timestamp: serverTimestamp(),
      });

      const historyMessages = messages.map((msg) => ({
        role: msg.sender === "user" ? "user" : "model",
        parts: [{ text: msg.text }],
      }));

      // Add the current message
      historyMessages.push({
        role: "user",
        parts: [{ text: userMessageText }],
      });

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: historyMessages,
          }),
        }
      );

      const data = await response.json();
      const botResponseText =
        data?.candidates?.[0]?.content?.parts?.[0]?.text ||
        "Sorry, I couldn't process that.";

      await addDoc(messagesRef, {
        text: botResponseText,
        sender: "bot",
        timestamp: serverTimestamp(),
      });
    } catch (error) {
      console.error("Error:", error);

      const chatRef = doc(firestore, `users/${user.uid}/chats/${chatId}`);
      const messagesRef = collection(chatRef, "messages");

      await addDoc(messagesRef, {
        text: "Error fetching response.",
        sender: "bot",
        timestamp: serverTimestamp(),
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (messages.length > 0) {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }
  }, [messages]);

  if (initialLoading) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#1D202D",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator size="large" color="#B2ACFB" />
        <Text style={{ color: "white", marginTop: 10 }}>Loading chat...</Text>
      </View>
    );
  }

  const generateSummary = async () => {
    try {
      setLoading(true);

      const idToken = await user?.getIdToken();

      const response = await fetch(
        "http://192.168.0.102:5000/generate-summary",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${idToken}`,
          },
          body: JSON.stringify({
            userId: user?.uid,
            chatId: chatId,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate summary");
      }

      if (data.summary) {
        const fileUri = FileSystem.documentDirectory + "chat_summary.txt";
        await FileSystem.writeAsStringAsync(fileUri, data.summary);
        await shareAsync(fileUri);
      }
    } catch (error: unknown) {
      console.error("Summary error:", error);
      alert(
        error instanceof Error ? error.message : "An unknown error occurred"
      );
    } finally {
      setLoading(false);
    }
  };
  return (
    <View style={{ flex: 1, backgroundColor: "#1D202D", padding: 10 }}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          padding: 10,
          borderBottomWidth: 1,
          borderBottomColor: "#2A2E3E",
        }}
      >
        <Text style={{ color: "white", fontSize: 18, fontWeight: "bold" }}>
          {chatTitle}
        </Text>

        {/* Add this inside the input container */}
        <TouchableOpacity
          onPress={generateSummary}
          style={{
            backgroundColor: "#6C63FF",
            padding: 10,
            borderRadius: 99,
            marginLeft: 5,
          }}
          disabled={loading}
        >
          <Text style={{ color: "white", fontWeight: "bold" }}>
            Get Summary
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        ref={scrollViewRef}
        style={{ flex: 1, marginBottom: 10 }}
        contentContainerStyle={{ paddingBottom: 20, paddingTop: 10 }}
      >
        {messages.map((msg, index) => (
          <View
            key={msg.id || index}
            style={{
              alignSelf: msg.sender === "user" ? "flex-end" : "flex-start",
              backgroundColor: msg.sender === "user" ? "#B2ACFB" : "#2A2E3E",
              padding: 10,
              paddingHorizontal: 18,
              borderRadius: 20,
              marginBottom: 5,
              maxWidth: "80%",
              marginTop:
                index > 0 && messages[index - 1]?.sender !== msg.sender
                  ? 10
                  : 2,
            }}
          >
            <Text style={{ color: "white" }}>{msg.text}</Text>
          </View>
        ))}
      </ScrollView>

      {loading && (
        <ActivityIndicator
          size="small"
          color="#B2ACFB"
          style={{ marginBottom: 10 }}
        />
      )}

      <View
        style={{
          marginBottom: 10,
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: "#2A2E3E",
          borderRadius: 99,
          padding: 10,
        }}
      >
        <TextInput
          style={{
            flex: 1,
            color: "white",
            fontSize: 16,
            paddingHorizontal: 10,
          }}
          placeholder="Type a message..."
          placeholderTextColor="#B2B2B2"
          value={input}
          onChangeText={setInput}
        />
        <TouchableOpacity
          onPress={sendMessage}
          style={{
            backgroundColor: "#B2ACFB",
            padding: 10,
            paddingHorizontal: 15,
            borderRadius: 99,
            marginRight: 5,
          }}
          disabled={loading}
        >
          <Text style={{ color: "#1D202D", fontWeight: "bold" }}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
