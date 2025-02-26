import { View, Text, TouchableOpacity, Image } from "react-native";
import React, { useEffect, useState } from "react";
import { signOut } from "firebase/auth";
import { auth } from "@/config/firebase.config";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Profile() {
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

  const handleSignOut = () => {
    console.log("Signing out...");
    signOut(auth)
      .then(() => {
        router.replace("/auth/login");
      })
      .catch((Error) => {
        console.log("Error signing out:", Error);
      });
  };

  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        backgroundColor: "#1D202D",
        padding: 20,
      }}
    >
      <Image
        source={require("@/assets/images/bot.png")}
        style={{
          width: 100,
          height: 100,
          borderRadius: 50,
          marginTop: 50,
          marginBottom: 20,
          backgroundColor: "#B2ACFB",
        }}
      />

      <Text
        style={{
          color: "white",
          fontSize: 20,
          fontWeight: "bold",
          marginBottom: 20,
        }}
      >
        {userName}
      </Text>

      <TouchableOpacity
        onPress={handleSignOut}
        style={{
          backgroundColor: "#B2ACFB",
          paddingVertical: 12,
          paddingHorizontal: 30,
          borderRadius: 99,
        }}
      >
        <Text style={{ color: "#1D202D", fontWeight: "bold", fontSize: 16 }}>
          Sign Out
        </Text>
      </TouchableOpacity>
    </View>
  );
}
