import React from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Layout } from "@platform/Layout";
import Table from "@shared/components/Table/Table";
import { FilterBar } from "~/src/ui/FilterBar";
import TitleBar from "~/src/ui/TitleBar";

const queryClient = new QueryClient();

const tableColumns = [
  { header: "Details", header_ar: "تفاصيل", accessorKey: "details" },
  { header: "Owner", header_ar: "المالك", accessorKey: "owner" },
  { header: "Plot", header_ar: "قطعة أرض", accessorKey: "plot" },
  { header: "Approval", header_ar: "الموافقة", accessorKey: "approval" },
  { header: "Payment", header_ar: "الدفع", accessorKey: "payment" },
  { header: "Print", header_ar: "طباعة", accessorKey: "print" },
];

const tableData = [
  {
    applicationTitle: "New / Racing",
    applicationTitle_ar: "جديد / سباق",
    location: "Abu Dhabi City",
    location_ar: "مدينة أبوظبي",
    timeDate: "13:51 - 21/06/2025",
    daysRemaining: "5 Days Remaining",
    daysRemaining_ar: "٥ أيام متبقية",
    id: "202500268615",
    currentStep: 3,
    additionalColumns: [
      {
        action: "Ahmed Mohammed",
        action_ar: "أحمد محمد",
        stepName: "Al Ketbi",
        stepName_ar: "الكتبي",
        userName: "Username",
        userName_ar: "اسم المستخدم",
        role: "Role",
        role_ar: "الدور",
        type: "success",
        version: "single-row",
      },
      {
        action: "Sara Ali",
        action_ar: "سارة علي",
        stepName: "Review",
        stepName_ar: "مراجعة",
        userName: "Username",
        userName_ar: "اسم المستخدم",
        role: "Reviewer",
        role_ar: "مراجع",
        type: "action",
        version: "single-row",
      },
      {
        action: "Pending",
        action_ar: "قيد الانتظار",
        stepName: "Approval",
        stepName_ar: "الموافقة",
        type: "pending",
        version: "single-row",
      },
      {
        action: "Not Started",
        action_ar: "لم يبدأ",
        stepName: "Payment",
        stepName_ar: "الدفع",
        type: "pending",
        version: "single-row",
      },
      {
        action: "Not Started",
        action_ar: "لم يبدأ",
        stepName: "Print",
        stepName_ar: "طباعة",
        type: "pending",
        version: "single-row",
      },
    ],
  },
  {
    applicationTitle: "Renewal / Commercial",
    applicationTitle_ar: "تجديد / تجاري",
    location: "Al Ain",
    location_ar: "العين",
    timeDate: "09:30 - 15/06/2025",
    daysRemaining: "12 Days Remaining",
    daysRemaining_ar: "١٢ يوم متبقي",
    id: "202500268616",
    currentStep: 1,
    additionalColumns: [
      {
        action: "Mohammed Hassan",
        action_ar: "محمد حسن",
        stepName: "Inspection",
        stepName_ar: "تفتيش",
        userName: "Inspector",
        userName_ar: "مفتش",
        role: "Field Officer",
        role_ar: "ضابط ميداني",
        type: "action",
        version: "single-row",
      },
      {
        action: "Pending",
        action_ar: "قيد الانتظار",
        stepName: "Review",
        stepName_ar: "مراجعة",
        type: "pending",
        version: "single-row",
      },
      {
        action: "Pending",
        action_ar: "قيد الانتظار",
        stepName: "Approval",
        stepName_ar: "الموافقة",
        type: "pending",
        version: "single-row",
      },
      {
        action: "Not Started",
        action_ar: "لم يبدأ",
        stepName: "Payment",
        stepName_ar: "الدفع",
        type: "pending",
        version: "single-row",
      },
      {
        action: "Not Started",
        action_ar: "لم يبدأ",
        stepName: "Print",
        stepName_ar: "طباعة",
        type: "pending",
        version: "single-row",
      },
    ],
  },
];

export default function App() {
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
              title="Land Allocation"
              title_ar="تخصيص الأراضي"
              showTitle
              showAcronym
              showButton
              buttonLabel="New Application"
              buttonLabel_ar="طلب جديد"
              buttonType="primary"
              language="en"
            />
            <FilterBar
              language="en"
              theme="dark"
              searchPlaceholder="Search applications"
              searchPlaceholder_ar="بحث التطبيقات"
              filterOptions={["Status", "Type", "Date"]}
              sortOptions={["Newest First", "Oldest First"]}
              applicationOptions={["My Applications", "All Applications"]}
              searchColumns={["Details", "Owner", "Plot", "Approval", "Payment", "Print"]}
            />
            <Table
              columns={tableColumns}
              data={tableData}
              language="en"
              platform="mobile"
            />
          </Layout>
        </BottomSheetModalProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}
