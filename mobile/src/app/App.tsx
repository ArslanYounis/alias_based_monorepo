import React from "react";
import { View, StyleSheet } from "react-native";
import { StatusBar } from "expo-status-bar";
import { AddButton, Avatar, Bot, Buttons } from "~/lib-index";
import SharedLanguageSwitchRenderer from "~/components/shared/SharedLanguageSwitchRenderer";

export default function App() {
  return (
    <View style={styles.container}>
      <SharedLanguageSwitchRenderer
        language="en"
        value="Hello"
        value_ar="مرحبا"
      />
      <Buttons title="Primary" />
      <Buttons title="Primary Disable" disabled />
      <Buttons title="Secondary" type="secondary" />
      <Buttons title="Tertiary" type="tertiary" />
      <Buttons title="Delete" type="delete" />
      <Avatar />
      <AddButton />
      {/* <Bot /> */}
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
});
