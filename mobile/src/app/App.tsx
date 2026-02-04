import React, { useState } from "react";
import { ScrollView, StyleSheet, Text as RNText, View } from "react-native";
import {
  AddButton,
  Avatar,
  Bot,
  Breadcrumb,
  Buttons,
  Caption,
  Checkbox,
  CheckRadioLabel,
  Container,
  CustomDrawer,
  DateInput,
  DummyComponent,
  Fields,
  Footer,
  Header,
  IconButton,
  LargeComponent,
  Label,
  Logo,
  PlotSearch,
  ProfileIconStatus,
  RadioCard,
  Text as LibText,
  TextInput,
  Tooltip,
} from "~/lib-index";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export default function App() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [checkboxChecked, setCheckboxChecked] = useState(false);
  const [fieldsValue, setFieldsValue] = useState("");
  const [textInputValue, setTextInputValue] = useState("");
  const [radioCardClicked, setRadioCardClicked] = useState(false);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={new QueryClient()}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <Container>
            <RNText style={styles.sectionTitle}>Header</RNText>
            <Header
              breadcrumbItems={[
                { label: "Home", label_ar: "الرئيسية", onClick: () => {} },
                { label: "Level 1", label_ar: "المستوى 1", onClick: () => {} },
              ]}
            />

            <RNText style={styles.sectionTitle}>Footer</RNText>
            <Footer />

            <RNText style={styles.sectionTitle}>Bot</RNText>
            <Bot />

            <RNText style={styles.sectionTitle}>Logo</RNText>
            <Logo type="full" />
            <Logo type="icon" />
            <Logo type="hub" />

            <RNText style={styles.sectionTitle}>Text</RNText>
            <LibText>Dummy text</LibText>

            <RNText style={styles.sectionTitle}>Label</RNText>
            <Label label="Dummy label" />

            <RNText style={styles.sectionTitle}>Fields</RNText>
            <Fields
              type="text"
              value={fieldsValue}
              onChange={setFieldsValue}
              placeholder="Enter text"
            />

            <RNText style={styles.sectionTitle}>Avatar</RNText>
            <Avatar initials="AB" />
            <Avatar imageUrl="https://adrec-images.mastermind-mindset.com/DefaultImg.png" />

            <RNText style={styles.sectionTitle}>Buttons</RNText>
            <Buttons title="Primary" type="primary" />
            <Buttons title="Secondary" type="secondary" />

            <RNText style={styles.sectionTitle}>AddButton</RNText>
            <AddButton onClick={() => {}} />

            <RNText style={styles.sectionTitle}>Tooltip</RNText>
            <Tooltip text="Dummy tooltip" direction="bottom-center" />

            <RNText style={styles.sectionTitle}>Caption</RNText>
            <Caption captionLeft="Left" captionRight="Right" />

            <RNText style={styles.sectionTitle}>Checkbox</RNText>
            <Checkbox
              id="demo-checkbox"
              checked={checkboxChecked}
              onChange={(id, checked) => setCheckboxChecked(checked)}
            />

            <RNText style={styles.sectionTitle}>TextInput</RNText>
            <TextInput
              label="Field label"
              value={textInputValue}
              onChange={setTextInputValue}
              placeholder="Placeholder"
            />

            <RNText style={styles.sectionTitle}>DateInput</RNText>
            <DateInput />

            <RNText style={styles.sectionTitle}>RadioCard</RNText>
            <RadioCard
              label="Option A"
              clicked={radioCardClicked}
              onClick={() => setRadioCardClicked(!radioCardClicked)}
            />

            <RNText style={styles.sectionTitle}>Breadcrumb</RNText>
            <Breadcrumb
              items={[
                { label: "Home", onClick: () => {} },
                { label: "Level 1", onClick: () => {} },
                { label: "Current", onClick: () => {} },
              ]}
              selectedItemIndex={2}
            />

            <RNText style={styles.sectionTitle}>IconButton</RNText>
            <IconButton
              icon={<RNText style={styles.iconPlaceholder}>⚙</RNText>}
            />

            <RNText style={styles.sectionTitle}>CheckRadioLabel</RNText>
            <CheckRadioLabel label="Checkbox label" />

            <RNText style={styles.sectionTitle}>ProfileIconStatus</RNText>
            <ProfileIconStatus status="complete" />
            <ProfileIconStatus status="inProgress" />
            <ProfileIconStatus status="pending" />
            <ProfileIconStatus status="failed" />

            <RNText style={styles.sectionTitle}>CustomDrawer (trigger)</RNText>
            <Buttons
              title={drawerOpen ? "Close drawer" : "Open drawer"}
              type="primary"
              onClick={() => setDrawerOpen(!drawerOpen)}
            />
            {/* <CustomDrawer
              open={drawerOpen}
              onOpenChange={setDrawerOpen}
              dismissible
            >
              <RNText>Drawer content</RNText>
            </CustomDrawer> */}

            <RNText style={styles.sectionTitle}>DummyComponent</RNText>
            <DummyComponent title="Dummy title" />

            <RNText style={styles.sectionTitle}>LargeComponent</RNText>
            <LargeComponent />

            <RNText style={styles.sectionTitle}>PlotSearch</RNText>
            <PlotSearch />
          </Container>
        </ScrollView>
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
