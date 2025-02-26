import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import React, { useState, useEffect } from "react";
import { useRouter } from "expo-router";
import { auth, firestore } from "@/config/firebase.config";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  limit,
} from "firebase/firestore";
import { Ionicons } from "@expo/vector-icons";

// Define chat type interface
interface ChatItem {
  id: string;
  title: string;
  createdAt: {
    toDate: () => Date;
  };
}

export default function Index() {
  const [userName, setUserName] = useState("User");
  const [chats, setChats] = useState<ChatItem[]>([]);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    async function getUserName() {
      try {
        const user = auth.currentUser;
        if (user && user.displayName) {
          setUserName(user.displayName);
          return;
        }

        const storedName = await AsyncStorage.getItem("userName");
        if (storedName) {
          setUserName(storedName);
        }
      } catch (error) {
        console.error("Error retrieving user name:", error);
      }
    }

    getUserName();
  }, []);

  useEffect(() => {
    const user = auth.currentUser;

    if (!user) {
      setLoading(false);
      return;
    }

    // Fetch recent chats, limited to 3
    const chatsRef = collection(firestore, `users/${user.uid}/chats`);
    const chatsQuery = query(chatsRef, orderBy("createdAt", "desc"), limit(3));

    const unsubscribe = onSnapshot(chatsQuery, (snapshot) => {
      const chatsList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as ChatItem[];

      setChats(chatsList);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleChatPress = (chatId: string, chatTitle: string) => {
    router.push({
      pathname: "/chatscreen",
      params: { chatId, chatTitle },
    });
  };

  return (
    <View
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: "#1D202D",
        paddingTop: 20,
      }}
    >
      <Text style={{ color: "white", fontFamily: "Poppins", fontSize: 20 }}>
        Welcome,
      </Text>
      <Text
        style={{
          color: "white",
          fontFamily: "Poppins",
          fontSize: 24,
          marginTop: -7,
        }}
      >
        {userName}
      </Text>

      <View
        style={{
          marginTop: 20,
          width: "100%",
          padding: 20,
          backgroundColor: "#B2ACFB",
          borderRadius: 20,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <View style={{ width: "70%" }}>
          <Text
            style={{
              color: "white",
              fontFamily: "Poppins",
              fontSize: 20,
              fontWeight: "bold",
            }}
          >
            Talk to Your AI Assistant!
          </Text>
          <Text
            style={{
              color: "white",
              fontFamily: "Poppins",
              fontSize: 14,
              marginTop: 7,
            }}
          >
            Ask anything and get instant responses powered by AI.
          </Text>

          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => {
              router.push("/create");
            }}
          >
            <View
              style={{
                backgroundColor: "white",
                marginTop: 20,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                padding: 10,
                paddingHorizontal: 20,
                borderRadius: 999,
                alignSelf: "flex-start",
              }}
            >
              <Text style={{ fontWeight: "bold" }}>Start Chatting</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={{ width: "30%" }}>
          <Image
            source={require("@/assets/images/bot.png")}
            style={{
              width: 100,
              height: 150,
            }}
          />
        </View>
      </View>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: 20,
        }}
      >
        <Text
          style={{
            fontFamily: "Poppins",
            color: "white",
            fontSize: 20,
          }}
        >
          Your Recent Chats
        </Text>
      </View>

      {loading ? (
        <View style={{ marginTop: 15, alignItems: "center" }}>
          <ActivityIndicator size="small" color="#B2ACFB" />
          <Text
            style={{ color: "#B2B2B2", marginTop: 5, fontFamily: "Poppins" }}
          >
            Loading chats...
          </Text>
        </View>
      ) : chats.length === 0 ? (
        <View style={{ marginTop: 15, alignItems: "center", padding: 20 }}>
          <Text
            style={{
              color: "#B2B2B2",
              fontFamily: "Poppins",
              textAlign: "center",
            }}
          >
            No chats yet. Start a new conversation!
          </Text>
        </View>
      ) : (
        <ScrollView style={{ marginTop: 10 }}>
          {chats.map((chat) => (
            <TouchableOpacity
              key={chat.id}
              style={{
                marginTop: 10,
                width: "100%",
                paddingHorizontal: 20,
                paddingVertical: 15,
                backgroundColor: "#252C39",
                borderRadius: 15,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
              onPress={() => handleChatPress(chat.id, chat.title)}
            >
              <View style={{ flex: 1 }}>
                <Text style={{ color: "white", fontFamily: "Poppins" }}>
                  {chat.title}
                </Text>
                {chat.createdAt && (
                  <Text
                    style={{
                      color: "#B2B2B2",
                      fontSize: 12,
                      marginTop: 3,
                      fontFamily: "Poppins",
                    }}
                  >
                    {new Date(chat.createdAt.toDate()).toLocaleDateString()}
                  </Text>
                )}
              </View>
              <Ionicons name="chevron-forward" size={20} color="#B2ACFB" />
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </View>
  );
}
