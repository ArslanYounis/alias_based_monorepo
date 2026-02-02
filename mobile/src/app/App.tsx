import React from "react";
import { StatusBar } from "expo-status-bar";
import { View, StyleSheet, Text } from "react-native";
import { CustomDrawer } from "~/lib-index";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
        <StatusBar style="auto" />
        <CustomDrawer open>
          <View>
            <Text>Layer 1</Text>
          </View>
        </CustomDrawer>
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
