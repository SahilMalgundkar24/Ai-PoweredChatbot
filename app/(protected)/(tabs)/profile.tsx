import { View, Text, TouchableOpacity, Image } from "react-native";
import React from "react";
import { signOut } from "firebase/auth";
import { auth } from "@/config/firebase.config";
import { router } from "expo-router";

export default function Profile() {
  const userName = "John Doe";

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
