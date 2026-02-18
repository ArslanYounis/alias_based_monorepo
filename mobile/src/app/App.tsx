import React, { useState } from "react";
import { ScrollView, StyleSheet, Text as RNText, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export default function App() {


  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={new QueryClient()}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        ></ScrollView>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 48,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 24,
    marginBottom: 12,
  },
  iconPlaceholder: {
    fontSize: 24,
  },
});
