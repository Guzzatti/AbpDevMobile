import { ScreenContent } from "components/ScreenContent";
import { StatusBar } from "expo-status-bar";
import { Platform } from "react-native";

export default function Modal() {
  return (
    <>
      <ScreenContent path="screens/modal.tsx" title="Modal"></ScreenContent>
      <StatusBar style={Platform.OS === "ios" ? "light" : "auto"} />
    </>
  );
}
