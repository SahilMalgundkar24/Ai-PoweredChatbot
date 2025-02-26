import { useFonts } from "expo-font";
import { router, SplashScreen, Stack } from "expo-router";
import React, { useEffect } from "react";
import { StatusBar, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthProvider } from "@/context/auth";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    Poppins: require("../assets/fonts/Poppins-Regular.ttf"),
  });

  useEffect(() => {
    async function checkFirstTime() {
      try {
        const value = await AsyncStorage.getItem("hasLoaded");
        if (value) {
          SplashScreen.hideAsync();
        } else {
          router.replace("/auth/signup");
        }
      } catch (error) {
        console.error("Error checking first time:", error);
      }
    }
    checkFirstTime();
  }, []);

  return (
    <AuthProvider>
      <SafeAreaProvider>
        <StatusBar backgroundColor="#1D202D" barStyle="light-content" />
        <View style={{ flex: 1, height: "100%" }}>
          <Stack>
            <Stack.Screen name="(protected)" options={{ headerShown: false }} />
            <Stack.Screen name="auth" options={{ headerShown: false }} />
          </Stack>
        </View>
      </SafeAreaProvider>
    </AuthProvider>
  );
}
