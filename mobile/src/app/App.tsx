import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { CustomDrawer, DateInput, PlotSearch, TextInput } from "~/lib-index";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export default function App() {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={new QueryClient()}>
        <PlotSearch />
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    padding: 10,
  },
  drawerTrigger: {
    padding: 12,
    marginBottom: 8,
    backgroundColor: "#e0e0e0",
    borderRadius: 8,
    alignSelf: "flex-start",
  },
});
