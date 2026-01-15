import React from 'react';
import { View, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Container } from "~/src/ui/Container";
import { Text } from "~/src/ui/Text";
import { LargeComponent } from "~/lib-index";

export default function App() {
  return (
    <View style={styles.container}>
      <LargeComponent />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
});
