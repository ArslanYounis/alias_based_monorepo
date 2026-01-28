import React from "react";
import { StatusBar } from "expo-status-bar";
import { View, StyleSheet } from "react-native";
import {
  Bot,
  Logo,
  Avatar,
  Buttons,
  Caption,
  AddButton,
  CheckRadioLabel,
  ProfileIconStatus,
} from "~/lib-index";
import SharedLanguageSwitchRenderer from "~/components/shared/SharedLanguageSwitchRenderer";

export default function App() {
  return (
    <View style={styles.container}>
      <SharedLanguageSwitchRenderer
        language="en"
        value="Hello"
        value_ar="مرحبا"
      />
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10 }}>
        <Buttons title="Primary" />
        <Buttons title="Primary Disable" disabled />
        <Buttons title="Secondary" type="secondary" />
        <Buttons title="Tertiary" type="tertiary" />
        <Buttons title="Delete" type="delete" />
      </View>
      <View style={{ flexDirection: "row", gap: 10 }}>
        <Avatar />
        <AddButton />
        <AddButton disabled />
        <CheckRadioLabel label="label" />
      </View>
      <View style={{ flexDirection: "row", gap: 10 }}>
        <Logo type="full" />
        <Logo type="icon" />
        <Logo type="hub" />
      </View>
      <Caption
        captionLeft="Left Caption"
        captionRight="Right Caption"
        errorMessage="Error Message"
        hasError={true}
        language="en"
      />
      <View style={{ flexDirection: "row", gap: 10 }}>
        <ProfileIconStatus status="pending" />
        <ProfileIconStatus status="inProgress" />
        <ProfileIconStatus status="complete" />
        <ProfileIconStatus status="failed" />
      </View>
      {/* <Bot /> */}
      <StatusBar style="auto" />
    </View>
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
