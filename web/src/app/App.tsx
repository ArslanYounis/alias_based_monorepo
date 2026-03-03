import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Layout } from "@/ui/Layout";
import Payment from "@shared/components/Payment";
import type { StepInfo } from "@shared/components/Payment";

const SECTION_TITLE = "text-bold-l text-text-default mb-2";

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

function App() {
  const [language, setLanguage] = useState<"en" | "ar">("en");

  const layoutMenuItems = [
    { label: "Profile", label_ar: "الملف الشخصي", onClick: () => {} },
    { label: "Logout", label_ar: "تسجيل الخروج", onClick: () => {} },
  ];
  const layoutBreadcrumbItems = [
    { label: "Home", label_ar: "الرئيسية", onClick: () => {} },
    { label: "Group 4", label_ar: "المجموعة ٤", onClick: () => {} },
  ];

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
    <QueryClientProvider client={new QueryClient()}>
      <Layout
        language={language}
        theme="light"
        onToggleLanguage={() => setLanguage((l) => (l === "en" ? "ar" : "en"))}
        isEditing={false}
        menuItems={layoutMenuItems}
        breadcrumbItems={layoutBreadcrumbItems}
        showHeader
        showSidebar
        showFooter
        toast={{ message: "", status: "success" }}
      >
        <div className="p-6 flex flex-col gap-10 max-w-4xl">

          {/* === G-4.4 Payment — English, New Tenancy === */}
          <section className="flex flex-col gap-6">
            <h2 className={SECTION_TITLE}>G-4.4 — Payment — English / New Tenancy</h2>
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
          </section>

          {/* === G-4.4 Payment — Arabic, New Tenancy === */}
          <section className="flex flex-col gap-6">
            <h2 className={SECTION_TITLE}>G-4.4 — Payment — Arabic / New Tenancy</h2>
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
          </section>

          {/* === G-4.4 Payment — English, Renew Tenancy === */}
          <section className="flex flex-col gap-6">
            <h2 className={SECTION_TITLE}>G-4.4 — Payment — English / Renew Tenancy</h2>
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
          </section>

          {/* === G-4.4 Payment — Arabic, Renew Tenancy === */}
          <section className="flex flex-col gap-6">
            <h2 className={SECTION_TITLE}>G-4.4 — Payment — Arabic / Renew Tenancy</h2>
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
          </section>

          {/* === G-4.4 Payment — Loading State (isStepInfoPending) === */}
          <section className="flex flex-col gap-6">
            <h2 className={SECTION_TITLE}>G-4.4 — Payment — Loading State (isStepInfoPending=true)</h2>
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
          </section>

          {/* === G-4.4 Payment — Submitting State (isPaymentSubmitting) === */}
          <section className="flex flex-col gap-6">
            <h2 className={SECTION_TITLE}>G-4.4 — Payment — Submitting State (isPaymentSubmitting=true)</h2>
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
          </section>

          {/* === G-4.4 Payment — Toggle Language === */}
          <section className="flex flex-col gap-6">
            <h2 className={SECTION_TITLE}>G-4.4 — Payment — Toggle Language ({language})</h2>
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
          </section>

        </div>
      </Layout>
    </QueryClientProvider>
  );
}

export default App;
