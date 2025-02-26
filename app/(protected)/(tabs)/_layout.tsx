import { Tabs } from "expo-router";
import { memo } from "react";
import { Pressable, View } from "react-native";
import { Home2, AddCircle, Airplane, Profile } from "iconsax-react-native";

type TabIconProps = {
  Icon: any;
  focused: boolean;
};

const TabIcon = memo(({ Icon, focused }: TabIconProps) => {
  return (
    <View
      style={{
        alignItems: "center",
        justifyContent: "center",
        width: 50,
        height: 50,
      }}
    >
      <Icon
        size={32}
        variant={focused ? "Bold" : "Outline"}
        color={focused ? "black" : "#000"}
      />
    </View>
  );
});

export default function RootLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: true,
        tabBarStyle: {
          position: "absolute",
          bottom: 20,
          marginLeft: 50,
          marginRight: 50,
          backgroundColor: "#B2ACFB",
          borderRadius: 100,
          height: 65,
          borderTopWidth: 0,
        },
        tabBarIconStyle: {
          flex: 1,
          justifyContent: "center",
        },
        tabBarShowLabel: false,
        tabBarButton: (props) => (
          <Pressable
            {...props}
            android_ripple={{ color: "transparent" }} // Disable ripple on Android
            style={(state) => [
              props.style,
              { opacity: 1 }, // Keep opacity at 1 even when pressed
            ]}
          />
        ),
        header: () => null,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon Icon={Home2} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="create"
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon Icon={AddCircle} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon Icon={Profile} focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
}
