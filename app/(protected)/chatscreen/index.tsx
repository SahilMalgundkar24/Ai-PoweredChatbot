import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import React, { useState, useRef, useEffect } from "react";

export default function Index() {
  const [messages, setMessages] = useState<
    { text: string; sender: "user" | "bot" }[]
  >([{ text: "Hello! How can I help you today?", sender: "bot" }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const scrollViewRef = useRef<ScrollView>(null);

  const API = process.env.EXPO_PUBLIC_GEMINI_API_KEY;

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { text: input, sender: "user" };
    setMessages((prevMessages) => [
      ...prevMessages,
      userMessage as { text: string; sender: "user" | "bot" },
    ]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: messages
              .map((msg) => ({
                role: msg.sender === "user" ? "user" : "model",
                parts: [{ text: msg.text }],
              }))
              .concat([{ role: "user", parts: [{ text: input }] }]),
          }),
        }
      );

      const data = await response.json();
      const botMessage = {
        text:
          data?.candidates?.[0]?.content?.parts?.[0]?.text ||
          "Sorry, I couldn't process that.",
        sender: "bot",
      };

      setMessages((prevMessages) => [
        ...prevMessages,
        botMessage as { text: string; sender: "user" | "bot" },
      ]);
    } catch (error) {
      console.error("Error:", error);
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: "Error fetching response.", sender: "bot" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  return (
    <View style={{ flex: 1, backgroundColor: "#1D202D", padding: 10 }}>
      {/* Chat Messages */}
      <ScrollView
        ref={scrollViewRef}
        style={{ flex: 1, marginBottom: 10 }}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        {messages.map((msg, index) => (
          <View
            key={index}
            style={{
              alignSelf: msg.sender === "user" ? "flex-end" : "flex-start",
              backgroundColor: msg.sender === "user" ? "#B2ACFB" : "#2A2E3E",
              padding: 10,
              paddingHorizontal: 18,
              borderRadius: 20,
              marginBottom: 5,
              maxWidth: "80%",
            }}
          >
            <Text style={{ color: "white" }}>{msg.text}</Text>
          </View>
        ))}
      </ScrollView>

      {/* Loading Indicator */}
      {loading && (
        <ActivityIndicator
          size="small"
          color="#B2ACFB"
          style={{ marginBottom: 10 }}
        />
      )}

      {/* Input & Send Button */}
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
        >
          <Text style={{ color: "#1D202D", fontWeight: "bold" }}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
