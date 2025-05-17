import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NotesNavigator } from "./notes.navigator";
import { SettingsNavigator } from "./settings.navigator";
import { NotesContextProvider } from "../../services/notes/notes.context";
import { createStackNavigator } from "@react-navigation/stack";
import { LoginScreen } from "../../features/auth/screens/login.screen";
import { RegisterScreen } from "../../features/auth/screens/register.screen";

const Tab = createBottomTabNavigator();
const RootStack = createStackNavigator();

const TAB_ICONS = {
  Notes: [Ionicons, "list"],
  Settings: [Ionicons, "settings"],
};
const TAB_ICONS_COLORS = {
  Active: "tomato",
  Inactive: "#A5A5A5",
};

const createScreenOptions = ({ route }) => {
  const [IconComponent, iconName] = TAB_ICONS[route.name];
  return {
    headerShown: false,
    tabBarIcon: ({ focused, size }) => {
      const Color = focused
        ? TAB_ICONS_COLORS["Active"]
        : TAB_ICONS_COLORS["Inactive"];
      return <IconComponent name={iconName} size={size} color={Color} />;
    },
    tabBarActiveTintColor: TAB_ICONS_COLORS["Active"],
    tabBarInactiveTintColor: TAB_ICONS_COLORS["Inactive"],
    tabBarStyle: {
      backgroundColor: "black",
      borderTopWidth: 0,
    },
  };
};

const MainTabs = ({ route }) => {
  // Lấy tên tab mặc định từ params nếu có
  const initialTab = route?.params?.screen || "Notes";
  return (
    <Tab.Navigator
      initialRouteName={initialTab}
      screenOptions={createScreenOptions}
    >
      <Tab.Screen name="Notes" component={NotesNavigator} />
      <Tab.Screen name="Settings" component={SettingsNavigator} />
    </Tab.Navigator>
  );
};

export const AppNavigator = () => {
  return (
    <NotesContextProvider>
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        <RootStack.Screen name="Login" component={LoginScreen} />
        <RootStack.Screen name="Register" component={RegisterScreen} />
        <RootStack.Screen name="MainTabs" component={MainTabs} />
      </RootStack.Navigator>
    </NotesContextProvider>
  );
};
