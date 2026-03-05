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
import Table from "@shared/components/Table";
import type { ApplicationData, ColumnDefinition } from "@shared/components/Table";

const sectionTitleStyle = {
  marginBottom: 8,
  fontSize: 18,
  fontWeight: "600" as const,
};

/* ── Column definitions ── */
const columns3: ColumnDefinition[] = [
  { header: "Application", header_ar: "الطلب", accessorKey: "application" },
  { header: "Status", header_ar: "الحالة", accessorKey: "status" },
  { header: "Payment", header_ar: "الدفع", accessorKey: "payment" },
];

const columns5: ColumnDefinition[] = [
  { header: "Application", header_ar: "الطلب", accessorKey: "application" },
  { header: "Process", header_ar: "الإجراء", accessorKey: "process" },
  { header: "Review", header_ar: "المراجعة", accessorKey: "review" },
  { header: "Approval", header_ar: "الموافقة", accessorKey: "approval" },
  { header: "Payment", header_ar: "الدفع", accessorKey: "payment" },
];

/* ── Sample data: all card type/version combos ── */
const sampleDataAllTypes: ApplicationData[] = [
  {
    applicationTitle: "Pending Status Card",
    applicationTitle_ar: "بطاقة حالة معلقة",
    location: "Abu Dhabi, Zone A",
    location_ar: "أبوظبي، المنطقة أ",
    timeDate: "2025-01-15",
    daysRemaining: "5 days",
    daysRemaining_ar: "٥ أيام",
    id: "APP-001",
    currentStep: 2,
    onCardClick: () => console.log("Clicked APP-001"),
    additionalColumns: [
      {
        type: "pending",
        action: "Awaiting Review",
        action_ar: "في انتظار المراجعة",
        stepName: "Step 1: Submit",
        stepName_ar: "الخطوة ١: تقديم",
        userName: "Ahmed Ali",
        userName_ar: "أحمد علي",
        role: "Reviewer",
        role_ar: "مراجع",
      },
      {
        type: "action",
        action: "Action Required",
        action_ar: "إجراء مطلوب",
        stepName: "Step 2: Verify",
        stepName_ar: "الخطوة ٢: تحقق",
        userName: "Sara Khan",
        userName_ar: "سارة خان",
        role: "Verifier",
        role_ar: "محقق",
      },
    ],
  },
  {
    applicationTitle: "Success & Failed Cards",
    applicationTitle_ar: "بطاقات ناجحة وفاشلة",
    location: "Dubai, Block B",
    location_ar: "دبي، القطاع ب",
    timeDate: "2025-02-20",
    daysRemaining: "12 days",
    daysRemaining_ar: "١٢ يوم",
    id: "APP-002",
    currentStep: 4,
    additionalColumns: [
      {
        type: "success",
        action: "Approved",
        action_ar: "تمت الموافقة",
        stepName: "Step 1: Review",
        stepName_ar: "الخطوة ١: مراجعة",
        userName: "Omar Nasser",
        userName_ar: "عمر ناصر",
        role: "Manager",
        role_ar: "مدير",
      },
      {
        type: "failed",
        action: "Rejected",
        action_ar: "مرفوض",
        stepName: "Step 2: Approval",
        stepName_ar: "الخطوة ٢: موافقة",
        userName: "Fatima Zahra",
        userName_ar: "فاطمة الزهراء",
        role: "Director",
        role_ar: "مديرة",
      },
    ],
  },
  {
    applicationTitle: "Action-Other Card Type",
    applicationTitle_ar: "بطاقة إجراء آخر",
    location: "Sharjah, Sector C",
    location_ar: "الشارقة، القطاع ج",
    timeDate: "2025-03-01",
    daysRemaining: "3 days",
    daysRemaining_ar: "٣ أيام",
    id: "APP-003",
    currentStep: 1,
    additionalColumns: [
      {
        type: "action-other",
        action: "Pending Other Action",
        action_ar: "بانتظار إجراء آخر",
        stepName: "Step 1: External Review",
        stepName_ar: "الخطوة ١: مراجعة خارجية",
        userName: "Khalid Bin",
        userName_ar: "خالد بن",
        role: "External Reviewer",
        role_ar: "مراجع خارجي",
      },
      {
        type: "pending",
        action: "Not Started",
        action_ar: "لم يبدأ",
        stepName: "Step 2: Internal",
        stepName_ar: "الخطوة ٢: داخلي",
      },
    ],
  },
];

/* ── Image-row version ── */
const sampleDataImageRow: ApplicationData[] = [
  {
    applicationTitle: "Image Row Version",
    applicationTitle_ar: "نسخة صف الصور",
    location: "Al Ain, District D",
    location_ar: "العين، المنطقة د",
    timeDate: "2025-01-28",
    daysRemaining: "7 days",
    daysRemaining_ar: "٧ أيام",
    id: "APP-004",
    currentStep: 3,
    additionalColumns: [
      {
        type: "action",
        version: "image-row",
        action: "Photo Verification",
        action_ar: "التحقق من الصورة",
        stepName: "Step 1: Upload",
        stepName_ar: "الخطوة ١: رفع",
        imageURL: "https://i.pravatar.cc/96?img=12",
      },
      {
        type: "pending",
        version: "image-row",
        action: "Pending Photo",
        action_ar: "صورة معلقة",
        stepName: "Step 2: Review",
        stepName_ar: "الخطوة ٢: مراجعة",
      },
    ],
  },
];

/* ── Hybrid / multi-row (PaymentCard) version ── */
const sampleDataHybrid: ApplicationData[] = [
  {
    applicationTitle: "Hybrid PaymentCard",
    applicationTitle_ar: "بطاقة دفع هجينة",
    location: "Fujairah, Zone E",
    location_ar: "الفجيرة، المنطقة هـ",
    timeDate: "2025-02-10",
    daysRemaining: "10 days",
    daysRemaining_ar: "١٠ أيام",
    id: "APP-005",
    currentStep: 2,
    additionalColumns: [
      {
        type: "action",
        version: "hybrid",
        action: "Payment Processing",
        action_ar: "معالجة الدفع",
        stepName: "Step 1: Pay",
        stepName_ar: "الخطوة ١: دفع",
        userName: "Layla Mahmoud",
        userName_ar: "ليلى محمود",
        role: "Cashier",
        role_ar: "أمين صندوق",
        totalSteps: 4,
        completedSteps: 2,
        currentStepStatus: "inProgress",
        onCardClick: () => console.log("Clicked hybrid card"),
      },
      {
        type: "success",
        version: "multi-row",
        action: "Payment Complete",
        action_ar: "اكتمل الدفع",
        stepName: "Step 2: Confirm",
        stepName_ar: "الخطوة ٢: تأكيد",
        userName: "Nadia Salem",
        userName_ar: "نادية سالم",
        role: "Accountant",
        role_ar: "محاسبة",
        totalSteps: 3,
        completedSteps: 3,
        currentStepStatus: "complete",
      },
    ],
  },
];

/* ── Vertical direction cards ── */
const sampleDataVertical: ApplicationData[] = [
  {
    applicationTitle: "Vertical Direction",
    applicationTitle_ar: "اتجاه عمودي",
    location: "RAK, Block F",
    location_ar: "رأس الخيمة، القطاع و",
    timeDate: "2025-03-05",
    daysRemaining: "2 days",
    daysRemaining_ar: "٢ يوم",
    id: "APP-006",
    currentStep: 5,
    additionalColumns: [
      {
        type: "success",
        direction: "vertical",
        action: "Completed",
        action_ar: "مكتمل",
        stepName: "Final Review",
        stepName_ar: "المراجعة النهائية",
        imageURL: "https://i.pravatar.cc/96?img=5",
      },
      {
        type: "action",
        direction: "vertical",
        action: "In Progress",
        action_ar: "قيد التنفيذ",
        stepName: "Signing",
        stepName_ar: "التوقيع",
      },
    ],
  },
];

/* ── Cards with avatar images ── */
const sampleDataWithAvatars: ApplicationData[] = [
  {
    applicationTitle: "Cards with Avatars",
    applicationTitle_ar: "بطاقات مع صور",
    location: "Ajman, Zone G",
    location_ar: "عجمان، المنطقة ز",
    timeDate: "2025-02-25",
    daysRemaining: "8 days",
    daysRemaining_ar: "٨ أيام",
    id: "APP-007",
    currentStep: 3,
    additionalColumns: [
      {
        type: "action",
        action: "Reviewing",
        action_ar: "مراجعة",
        stepName: "Step 1",
        stepName_ar: "الخطوة ١",
        userName: "Ali Hassan",
        userName_ar: "علي حسن",
        role: "Analyst",
        role_ar: "محلل",
        imageURL: "https://i.pravatar.cc/96?img=8",
      },
      {
        type: "success",
        action: "Done",
        action_ar: "تم",
        stepName: "Step 2",
        stepName_ar: "الخطوة ٢",
        imageURL: "https://i.pravatar.cc/96?img=15",
      },
    ],
  },
];

/* ── 5-column row ── */
const sampleData5Columns: ApplicationData[] = [
  {
    applicationTitle: "5-Column Layout",
    applicationTitle_ar: "تخطيط ٥ أعمدة",
    location: "UAQ, Area H",
    location_ar: "أم القيوين، المنطقة ح",
    timeDate: "2025-01-05",
    daysRemaining: "15 days",
    daysRemaining_ar: "١٥ يوم",
    id: "APP-008",
    currentStep: 1,
    additionalColumns: [
      {
        type: "pending",
        action: "Waiting",
        action_ar: "انتظار",
        stepName: "Review",
        stepName_ar: "مراجعة",
      },
      {
        type: "action",
        action: "Processing",
        action_ar: "معالجة",
        stepName: "Verify",
        stepName_ar: "تحقق",
      },
      {
        type: "success",
        action: "Approved",
        action_ar: "موافق",
        stepName: "Approve",
        stepName_ar: "موافقة",
      },
      {
        type: "failed",
        action: "Rejected",
        action_ar: "مرفوض",
        stepName: "Final",
        stepName_ar: "نهائي",
      },
    ],
  },
];

export default function App() {
  const [language, setLanguage] = useState<"en" | "ar">("en");

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

            {/* 1. All card types */}
            <View style={styles.section}>
              <Text style={sectionTitleStyle}>G-5.1 — All Card Types (pending, action, success, failed, action-other)</Text>
              <Table
                data={sampleDataAllTypes}
                columns={columns3}
                language={language}
              />
            </View>

            {/* 2. Image-row version */}
            <View style={styles.section}>
              <Text style={sectionTitleStyle}>G-5.1 — Image-Row Version</Text>
              <Table
                data={sampleDataImageRow}
                columns={columns3}
                language={language}
              />
            </View>

            {/* 3. Hybrid & multi-row (PaymentCard) */}
            <View style={styles.section}>
              <Text style={sectionTitleStyle}>G-5.1 — Hybrid & Multi-Row (PaymentCard)</Text>
              <Table
                data={sampleDataHybrid}
                columns={columns3}
                language={language}
              />
            </View>

            {/* 4. Vertical direction */}
            <View style={styles.section}>
              <Text style={sectionTitleStyle}>G-5.1 — Vertical Direction Cards</Text>
              <Table
                data={sampleDataVertical}
                columns={columns3}
                language={language}
              />
            </View>

            {/* 5. Cards with avatars */}
            <View style={styles.section}>
              <Text style={sectionTitleStyle}>G-5.1 — Cards with Avatar Images</Text>
              <Table
                data={sampleDataWithAvatars}
                columns={columns3}
                language={language}
              />
            </View>

            {/* 6. 5-column layout */}
            <View style={styles.section}>
              <Text style={sectionTitleStyle}>G-5.1 — 5-Column Layout</Text>
              <Table
                data={sampleData5Columns}
                columns={columns5}
                language={language}
              />
            </View>

            {/* 7. Empty data */}
            <View style={styles.section}>
              <Text style={sectionTitleStyle}>G-5.1 — Empty Data (no rows)</Text>
              <Table
                data={[]}
                columns={columns3}
                language={language}
              />
            </View>

            {/* 8. Arabic RTL */}
            <View style={styles.section}>
              <Text style={sectionTitleStyle}>G-5.1 — Arabic RTL</Text>
              <Table
                data={sampleDataAllTypes}
                columns={columns3}
                language="ar"
              />
            </View>

            {/* 9. Multiple rows mixed */}
            <View style={styles.section}>
              <Text style={sectionTitleStyle}>G-5.1 — Multiple Rows (mixed types)</Text>
              <Table
                data={[
                  ...sampleDataAllTypes,
                  ...sampleDataHybrid,
                  ...sampleDataWithAvatars,
                ]}
                columns={columns3}
                language={language}
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
