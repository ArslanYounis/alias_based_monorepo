import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { CustomDrawer, DateInput, TextInput } from "~/lib-index";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function App() {
  const [open, setOpen] = useState(false);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
        <StatusBar style="auto" />
        <TextInput label="Name" placeholder="Enter your name" />
        <DateInput
          label="Date of Birth"
          placeholder="Select your date of birth"
        />
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    // alignItems: "center",
    justifyContent: "center",
    padding: 10,
  },
});
