import { View, Text, Image, Touchable, TouchableOpacity } from "react-native";
import React, { useState, useEffect } from "react";
import { useRouter } from "expo-router";
import { auth } from "@/config/firebase.config";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Index() {
  const [userName, setUserName] = useState("User");

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

  const router = useRouter();
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

      <Text
        style={{
          marginTop: 20,
          fontFamily: "Poppins",
          color: "white",
          fontSize: 20,
        }}
      >
        Your Recent Chats
      </Text>

      <View
        style={{
          marginTop: 15,
          width: "100%",
          paddingHorizontal: 20,
          paddingVertical: 15,
          backgroundColor: "#252C39",
          borderRadius: 15,
        }}
      >
        <Text style={{ color: "white", fontFamily: "Poppins" }}>
          Chat Title 1
        </Text>
      </View>
      <View
        style={{
          marginTop: 15,
          width: "100%",
          paddingHorizontal: 20,
          paddingVertical: 15,
          backgroundColor: "#252C39",
          borderRadius: 15,
        }}
      >
        <Text style={{ color: "white", fontFamily: "Poppins" }}>
          Chat Title 2
        </Text>
      </View>
      <View
        style={{
          marginTop: 15,
          width: "100%",
          paddingHorizontal: 20,
          paddingVertical: 15,
          backgroundColor: "#252C39",
          borderRadius: 15,
        }}
      >
        <Text style={{ color: "white", fontFamily: "Poppins" }}>
          Chat Title 1
        </Text>
      </View>
    </View>
  );
}
