import React, { useState } from "react";
import { View, Text } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Layout } from "@platform/Layout";
import TitleBar from "@platform/TitleBar";
import { CustomDrawer } from "@platform/CustomDrawer";
import { OwnerSearch } from "@shared/components/OwnerSearch";
import type { IOwnerSearchResult } from "@shared/components/OwnerSearch";

const queryClient = new QueryClient();

export default function App() {
  const [selected, setSelected] = useState<IOwnerSearchResult[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <BottomSheetModalProvider>
          <Layout
            language="en"
            isEditing={false}
            showHeader
            showFooter
            bottomMargin={20}
            topMargin={50}
            toast={{ message: "", status: "success" }}
          >
            <TitleBar
              title="Dashboard"
              title_ar="لوحة القيادة"
              showTitle
              showAcronym
              showButton
              buttonLabel="Menu"
              buttonLabel_ar="القائمة"
              buttonType="tertiary"
              language="en"
              onClick={() => setDrawerOpen(true)}
            />

            <OwnerSearch
              title="Owner Search"
              title_ar="بحث المالك"
              subtitle="Search for an owner or company"
              subtitle_ar="ابحث عن مالك أو شركة"
              selected={selected}
              onSubmit={setSelected}
              initialOwnerType="company"
              theme="dark"
              language="en"
              platform="mobile"
            />

            <CustomDrawer
              open={drawerOpen}
              onOpenChange={setDrawerOpen}
              size="layer2"
              dismissible
              header={<Text style={{ fontSize: 18, fontWeight: "bold" }}>Menu</Text>}
            >
              <View style={{ gap: 16 }}>
                <Text style={{ fontSize: 16 }}>Navigation Item 1</Text>
                <Text style={{ fontSize: 16 }}>Navigation Item 2</Text>
                <Text style={{ fontSize: 16 }}>Navigation Item 3</Text>
              </View>
            </CustomDrawer>
          </Layout>
        </BottomSheetModalProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}
