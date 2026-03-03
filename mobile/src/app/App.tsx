import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  View,
  Text,
  Pressable,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Payment from "@shared/components/Payment";
import type { StepInfo } from "@shared/components/Payment";

const sectionTitleStyle = {
  marginBottom: 8,
  fontSize: 18,
  fontWeight: "600" as const,
};

const stepInfo: StepInfo = {
  result: {
    tenancyContract: {
      type: "New Tenancy",
      contractDate: "2024-01-01",
      contractNumber: "CONTRACT-123",
      ranchTenancyRegistrationFee: "500",
      ranchTenancyRegistrationFeeInWord: "Five Hundred",
      startDate: "2024-01-01",
      endDate: "2024-12-31",
      unitTypeValue: "M",
      requestLandClassificationId: 1,
      plotId: 1,
      tenancyContractId: 1,
      contractDuration: 12,
    },
    ranchInsuranceFee: "100",
    ranchInsuranceFeeInWord: "One Hundred",
  },
};

const renewStepInfo: StepInfo = {
  result: {
    tenancyContract: {
      type: "Renew Tenancy",
      contractDate: "2023-06-15",
      contractNumber: "CONTRACT-789",
      ranchTenancyRegistrationFee: "750",
      ranchTenancyRegistrationFeeInWord: "Seven Hundred Fifty",
      startDate: "2023-06-15",
      endDate: "2025-06-14",
      unitTypeValue: "M",
      requestLandClassificationId: 2,
      plotId: 5,
      tenancyContractId: 3,
      contractDuration: 24,
    },
    ranchInsuranceFee: "200",
    ranchInsuranceFeeInWord: "Two Hundred",
  },
};

export default function App() {
  const [language, setLanguage] = useState<"en" | "ar">("en");

  const handleSubmit = (data: unknown) => {
    console.log("Payment submit:", data);
  };

  const handlePaymentSubmit = (val: unknown) => {
    console.log("Payment API payload:", val);
  };

  const handleSaveDraft = () => {
    console.log("Save draft clicked");
  };

  return (
    <GestureHandlerRootView style={{ flex: 1, marginTop: 50 }}>
      <BottomSheetModalProvider>
        <QueryClientProvider client={new QueryClient()}>
          <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
          >
            <Pressable
              style={[styles.toggleBtn, { marginBottom: 16 }]}
              onPress={() => setLanguage((l) => (l === "en" ? "ar" : "en"))}
            >
              <Text style={styles.toggleBtnText}>
                Toggle Language ({language})
              </Text>
            </Pressable>

            {/* G-4.4 Payment — English, New Tenancy */}
            <View style={styles.section}>
              <Text style={sectionTitleStyle}>
                G-4.4 — Payment — English / New Tenancy
              </Text>
              <Payment
                language="en"
                applicationId="APP-001"
                stepInfo={stepInfo}
                isStepInfoPending={false}
                isPaymentSubmitting={false}
                onSubmit={handleSubmit}
                onPaymentSubmit={handlePaymentSubmit}
                onSaveDraft={handleSaveDraft}
              />
            </View>

            {/* G-4.4 Payment — Arabic, New Tenancy */}
            <View style={styles.section}>
              <Text style={sectionTitleStyle}>
                G-4.4 — Payment — Arabic / New Tenancy
              </Text>
              <Payment
                language="ar"
                applicationId="APP-002"
                stepInfo={stepInfo}
                isStepInfoPending={false}
                isPaymentSubmitting={false}
                onSubmit={handleSubmit}
                onPaymentSubmit={handlePaymentSubmit}
                onSaveDraft={handleSaveDraft}
              />
            </View>

            {/* G-4.4 Payment — English, Renew Tenancy */}
            <View style={styles.section}>
              <Text style={sectionTitleStyle}>
                G-4.4 — Payment — English / Renew Tenancy
              </Text>
              <Payment
                language="en"
                applicationId="APP-003"
                stepInfo={renewStepInfo}
                isStepInfoPending={false}
                isPaymentSubmitting={false}
                onSubmit={handleSubmit}
                onPaymentSubmit={handlePaymentSubmit}
                onSaveDraft={handleSaveDraft}
              />
            </View>

            {/* G-4.4 Payment — Arabic, Renew Tenancy */}
            <View style={styles.section}>
              <Text style={sectionTitleStyle}>
                G-4.4 — Payment — Arabic / Renew Tenancy
              </Text>
              <Payment
                language="ar"
                applicationId="APP-004"
                stepInfo={renewStepInfo}
                isStepInfoPending={false}
                isPaymentSubmitting={false}
                onSubmit={handleSubmit}
                onPaymentSubmit={handlePaymentSubmit}
                onSaveDraft={handleSaveDraft}
              />
            </View>

            {/* G-4.4 Payment — Loading State (isStepInfoPending) */}
            <View style={styles.section}>
              <Text style={sectionTitleStyle}>
                G-4.4 — Payment — Loading State (isStepInfoPending=true)
              </Text>
              <Payment
                language={language}
                applicationId="APP-005"
                stepInfo={undefined}
                isStepInfoPending={true}
                isPaymentSubmitting={false}
                onSubmit={handleSubmit}
                onPaymentSubmit={handlePaymentSubmit}
                onSaveDraft={handleSaveDraft}
              />
            </View>

            {/* G-4.4 Payment — Submitting State (isPaymentSubmitting) */}
            <View style={styles.section}>
              <Text style={sectionTitleStyle}>
                G-4.4 — Payment — Submitting State (isPaymentSubmitting=true)
              </Text>
              <Payment
                language={language}
                applicationId="APP-006"
                stepInfo={stepInfo}
                isStepInfoPending={false}
                isPaymentSubmitting={true}
                onSubmit={handleSubmit}
                onPaymentSubmit={handlePaymentSubmit}
                onSaveDraft={handleSaveDraft}
              />
            </View>

            {/* G-4.4 Payment — Toggle Language */}
            <View style={styles.section}>
              <Text style={sectionTitleStyle}>
                G-4.4 — Payment — Toggle Language ({language})
              </Text>
              <Payment
                language={language}
                applicationId="APP-007"
                stepInfo={stepInfo}
                isStepInfoPending={false}
                isPaymentSubmitting={false}
                onSubmit={handleSubmit}
                onPaymentSubmit={handlePaymentSubmit}
                onSaveDraft={handleSaveDraft}
              />
            </View>

          </ScrollView>
        </QueryClientProvider>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  content: { padding: 16, paddingBottom: 48 },
  section: { marginBottom: 40 },
  toggleBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
  },
  toggleBtnText: { fontSize: 12 },
});
