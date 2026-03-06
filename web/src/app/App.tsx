import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Layout } from "@/ui/Layout";
import GenericTableCard from "@shared/components/GenericTableCard";
import type { ICardColProps } from "@shared/components/GenericTableCard";
import type { ICardRowProps } from "@shared/components/CardRow";

const SECTION_TITLE = "text-bold-l text-text-default mb-2";

/* ── Column definitions ── */
const cols3: ICardColProps[] = [
  { label: "Plot No.", label_ar: "رقم القطعة" },
  { label: "Location", label_ar: "الموقع" },
  { label: "Status", label_ar: "الحالة" },
];

const cols4: ICardColProps[] = [
  { label: "Contract No.", label_ar: "رقم العقد" },
  { label: "Owner", label_ar: "المالك" },
  { label: "Area (m²)", label_ar: "المساحة" },
  { label: "Status", label_ar: "الحالة" },
];

const cols5: ICardColProps[] = [
  { label: "App. No.", label_ar: "رقم الطلب" },
  { label: "Type", label_ar: "النوع" },
  { label: "Date", label_ar: "التاريخ" },
  { label: "Zone", label_ar: "المنطقة" },
  { label: "Status", label_ar: "الحالة" },
];

const cols6: ICardColProps[] = [
  { label: "Ref.", label_ar: "المرجع" },
  { label: "Owner", label_ar: "المالك" },
  { label: "Plot", label_ar: "القطعة" },
  { label: "Area", label_ar: "المساحة" },
  { label: "Zone", label_ar: "المنطقة" },
  { label: "Status", label_ar: "الحالة" },
];

/* ── Row data ── */
const rows3col: ICardRowProps[] = [
  { rowVariant: "3colButton", label: "PLT-001", label_ar: "قطعة ٠٠١", extraItems: [{ value: "Abu Dhabi", value_ar: "أبوظبي" }, { value: "Active", value_ar: "نشط" }], button: { title: "View", title_ar: "عرض", type: "secondary", onClick: () => console.log("view PLT-001") } },
  { rowVariant: "3colButton", label: "PLT-002", label_ar: "قطعة ٠٠٢", extraItems: [{ value: "Al Ain", value_ar: "العين" }, { value: "Pending", value_ar: "معلق" }], button: { title: "View", title_ar: "عرض", type: "secondary", onClick: () => console.log("view PLT-002") } },
  { rowVariant: "3colButton", label: "PLT-003", label_ar: "قطعة ٠٠٣", extraItems: [{ value: "Sharjah", value_ar: "الشارقة" }, { value: "Inactive", value_ar: "غير نشط" }], button: { title: "View", title_ar: "عرض", type: "secondary", onClick: () => console.log("view PLT-003") } },
];

const rows4col: ICardRowProps[] = [
  { rowVariant: "4colButton", label: "CNT-001", extraItems: [{ value: "Mohammed Al Mansoori", value_ar: "محمد المنصوري" }, { value: "1200 m²" }, { value: "Active", value_ar: "نشط" }], button: { title: "View", title_ar: "عرض", type: "secondary", onClick: () => console.log("view CNT-001") } },
  { rowVariant: "4colButton", label: "CNT-002", extraItems: [{ value: "Fatima Al Zaabi", value_ar: "فاطمة الزعابي" }, { value: "850 m²" }, { value: "Pending", value_ar: "معلق" }], button: { title: "View", title_ar: "عرض", type: "secondary", onClick: () => console.log("view CNT-002") } },
  { rowVariant: "4colButton", label: "CNT-003", extraItems: [{ value: "Ahmed Al Rashidi", value_ar: "أحمد الرشيدي" }, { value: "2400 m²" }, { value: "Active", value_ar: "نشط" }], button: { title: "View", title_ar: "عرض", type: "secondary", onClick: () => console.log("view CNT-003") } },
];

const rows5col: ICardRowProps[] = [
  { rowVariant: "5colButton", label: "APP-2025-001", extraItems: [{ value: "Transfer", value_ar: "نقل" }, { value: "2025-01-15" }, { value: "Zone A", value_ar: "المنطقة أ" }, { value: "Approved", value_ar: "موافق عليه" }], button: { title: "View", title_ar: "عرض", type: "secondary", onClick: () => console.log("view APP-2025-001") } },
  { rowVariant: "5colButton", label: "APP-2025-002", extraItems: [{ value: "Registration", value_ar: "تسجيل" }, { value: "2025-02-10" }, { value: "Zone B", value_ar: "المنطقة ب" }, { value: "Pending", value_ar: "معلق" }], button: { title: "View", title_ar: "عرض", type: "secondary", onClick: () => console.log("view APP-2025-002") } },
  { rowVariant: "5colButton", label: "APP-2025-003", extraItems: [{ value: "Subdivision", value_ar: "تقسيم" }, { value: "2025-03-05" }, { value: "Zone C", value_ar: "المنطقة ج" }, { value: "Rejected", value_ar: "مرفوض" }], button: { title: "View", title_ar: "عرض", type: "secondary", onClick: () => console.log("view APP-2025-003") } },
];

const rows6col: ICardRowProps[] = [
  { rowVariant: "6colButton", label: "REF-001", extraItems: [{ value: "Khalid Al Nuaimi", value_ar: "خالد النعيمي" }, { value: "PLT-101" }, { value: "500 m²" }, { value: "Zone C", value_ar: "المنطقة ج" }, { value: "Active", value_ar: "نشط" }], button: { title: "View", title_ar: "عرض", type: "secondary", onClick: () => console.log("view REF-001") } },
  { rowVariant: "6colButton", label: "REF-002", extraItems: [{ value: "Mariam Al Ketbi", value_ar: "مريم الكتبي" }, { value: "PLT-202" }, { value: "750 m²" }, { value: "Zone A", value_ar: "المنطقة أ" }, { value: "Pending", value_ar: "معلق" }], button: { title: "View", title_ar: "عرض", type: "secondary", onClick: () => console.log("view REF-002") } },
  { rowVariant: "6colButton", label: "REF-003", extraItems: [{ value: "Saeed Al Dhaheri", value_ar: "سعيد الظاهري" }, { value: "PLT-303" }, { value: "1100 m²" }, { value: "Zone B", value_ar: "المنطقة ب" }, { value: "Inactive", value_ar: "غير نشط" }], button: { title: "View", title_ar: "عرض", type: "secondary", onClick: () => console.log("view REF-003") } },
];

const manyRows3col: ICardRowProps[] = [
  ...rows3col,
  { rowVariant: "3colButton", label: "PLT-004", extraItems: [{ value: "Dubai", value_ar: "دبي" }, { value: "Active", value_ar: "نشط" }], button: { title: "View", title_ar: "عرض", type: "secondary", onClick: () => {} } },
  { rowVariant: "3colButton", label: "PLT-005", extraItems: [{ value: "Fujairah", value_ar: "الفجيرة" }, { value: "Pending", value_ar: "معلق" }], button: { title: "View", title_ar: "عرض", type: "secondary", onClick: () => {} } },
  { rowVariant: "3colButton", label: "PLT-006", extraItems: [{ value: "Ras Al Khaimah", value_ar: "رأس الخيمة" }, { value: "Active", value_ar: "نشط" }], button: { title: "View", title_ar: "عرض", type: "secondary", onClick: () => {} } },
  { rowVariant: "3colButton", label: "PLT-007", extraItems: [{ value: "Ajman", value_ar: "عجمان" }, { value: "Inactive", value_ar: "غير نشط" }], button: { title: "View", title_ar: "عرض", type: "secondary", onClick: () => {} } },
];

function App() {
  const [language, setLanguage] = useState<"en" | "ar">("en");
  const [externalPage, setExternalPage] = useState(1);
  const [isExpanded, setIsExpanded] = useState(false);

  const layoutMenuItems = [
    { label: "Profile", label_ar: "الملف الشخصي", onClick: () => {} },
    { label: "Logout", label_ar: "تسجيل الخروج", onClick: () => {} },
  ];
  const layoutBreadcrumbItems = [
    { label: "Home", label_ar: "الرئيسية", onClick: () => {} },
    { label: "G-5.8 GenericTableCard", label_ar: "بطاقة الجدول العامة ٥.٨", onClick: () => {} },
  ];

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
        <div className="p-6 flex flex-col gap-10 max-w-5xl">

          {/* === 1. rowVariant="3colButton" (default) === */}
          <section className="flex flex-col gap-4">
            <h2 className={SECTION_TITLE}>G-5.8 — rowVariant="3colButton" (default), showRowButtons=true</h2>
            <GenericTableCard
              language={language}
              title="Plots"
              title_ar="القطع"
              cardTitleValue="Plots List"
              cardTitleValue_ar="قائمة القطع"
              rowVariant="3colButton"
              columnsData={cols3}
              rowsData={rows3col}
              showRowButtons
              isExpanded
              currentPage={1}
              totalPages={1}
              pageSize={10}
              onPageChange={() => {}}
            />
          </section>

          {/* === 2. rowVariant="4colButton" === */}
          <section className="flex flex-col gap-4">
            <h2 className={SECTION_TITLE}>G-5.8 — rowVariant="4colButton"</h2>
            <GenericTableCard
              language={language}
              title="Contracts"
              title_ar="العقود"
              cardTitleValue="Contracts List"
              cardTitleValue_ar="قائمة العقود"
              rowVariant="4colButton"
              columnsData={cols4}
              rowsData={rows4col}
              showRowButtons
              isExpanded
              currentPage={1}
              totalPages={1}
              pageSize={10}
              onPageChange={() => {}}
            />
          </section>

          {/* === 3. rowVariant="5colButton" === */}
          <section className="flex flex-col gap-4">
            <h2 className={SECTION_TITLE}>G-5.8 — rowVariant="5colButton"</h2>
            <GenericTableCard
              language={language}
              title="Applications"
              title_ar="الطلبات"
              cardTitleValue="Applications List"
              cardTitleValue_ar="قائمة الطلبات"
              rowVariant="5colButton"
              columnsData={cols5}
              rowsData={rows5col}
              showRowButtons
              isExpanded
              currentPage={1}
              totalPages={1}
              pageSize={10}
              onPageChange={() => {}}
            />
          </section>

          {/* === 4. rowVariant="6colButton" === */}
          <section className="flex flex-col gap-4">
            <h2 className={SECTION_TITLE}>G-5.8 — rowVariant="6colButton"</h2>
            <GenericTableCard
              language={language}
              title="References"
              title_ar="المراجع"
              cardTitleValue="References List"
              cardTitleValue_ar="قائمة المراجع"
              rowVariant="6colButton"
              columnsData={cols6}
              rowsData={rows6col}
              showRowButtons
              isExpanded
              currentPage={1}
              totalPages={1}
              pageSize={10}
              onPageChange={() => {}}
            />
          </section>

          {/* === 5. showRowButtons=false === */}
          <section className="flex flex-col gap-4">
            <h2 className={SECTION_TITLE}>G-5.8 — showRowButtons=false (no row action buttons)</h2>
            <GenericTableCard
              language={language}
              title="Plots"
              title_ar="القطع"
              cardTitleValue="Plots (No Row Buttons)"
              cardTitleValue_ar="القطع (بدون أزرار صف)"
              rowVariant="3colButton"
              columnsData={cols3}
              rowsData={rows3col}
              showRowButtons={false}
              isExpanded
              currentPage={1}
              totalPages={1}
              pageSize={10}
              onPageChange={() => {}}
            />
          </section>

          {/* === 6. showButtons=true — header action buttons === */}
          <section className="flex flex-col gap-4">
            <h2 className={SECTION_TITLE}>G-5.8 — showButtons=true (header action buttons: Add + Export)</h2>
            <GenericTableCard
              language={language}
              title="Plots"
              title_ar="القطع"
              cardTitleValue="Plots List"
              cardTitleValue_ar="قائمة القطع"
              rowVariant="3colButton"
              columnsData={cols3}
              rowsData={rows3col}
              showRowButtons
              showButtons
              buttons={[
                { title: "Add", title_ar: "إضافة", type: "secondary", onClick: () => console.log("add") },
                { title: "Export", title_ar: "تصدير", type: "secondary", onClick: () => console.log("export") },
              ]}
              isExpanded
              currentPage={1}
              totalPages={1}
              pageSize={10}
              onPageChange={() => {}}
            />
          </section>

          {/* === 7. showFooterButtons=true === */}
          <section className="flex flex-col gap-4">
            <h2 className={SECTION_TITLE}>G-5.8 — showFooterButtons=true (Save + Cancel)</h2>
            <GenericTableCard
              language={language}
              title="Plots"
              title_ar="القطع"
              cardTitleValue="Plots List"
              cardTitleValue_ar="قائمة القطع"
              rowVariant="3colButton"
              columnsData={cols3}
              rowsData={rows3col}
              showRowButtons
              showFooterButtons
              footerButton={[
                { title: "Save", title_ar: "حفظ", type: "primary", onClick: () => console.log("save") },
                { title: "Cancel", title_ar: "إلغاء", type: "delete", onClick: () => console.log("cancel") },
              ]}
              isExpanded
              currentPage={1}
              totalPages={1}
              pageSize={10}
              onPageChange={() => {}}
            />
          </section>

          {/* === 8. showPagination=true, handlePaginationInternally=true (7 rows, 3/page) === */}
          <section className="flex flex-col gap-4">
            <h2 className={SECTION_TITLE}>G-5.8 — showPagination=true, handlePaginationInternally=true (7 rows, 3/page, internal state)</h2>
            <GenericTableCard
              language={language}
              title="All Plots"
              title_ar="جميع القطع"
              cardTitleValue="7 Plots"
              cardTitleValue_ar="٧ قطع"
              rowVariant="3colButton"
              columnsData={cols3}
              rowsData={manyRows3col}
              showRowButtons
              showPagination
              handlePaginationInternally
              isExpanded
              currentPage={1}
              totalPages={3}
              pageSize={3}
              onPageChange={() => {}}
            />
          </section>

          {/* === 9. showPagination=true, handlePaginationInternally=false (external page state) === */}
          <section className="flex flex-col gap-4">
            <h2 className={SECTION_TITLE}>G-5.8 — showPagination=true, handlePaginationInternally=false (external page state)</h2>
            <GenericTableCard
              language={language}
              title="All Plots"
              title_ar="جميع القطع"
              cardTitleValue={`Page ${externalPage} of ${Math.ceil(manyRows3col.length / 3)}`}
              cardTitleValue_ar={`صفحة ${externalPage} من ${Math.ceil(manyRows3col.length / 3)}`}
              rowVariant="3colButton"
              columnsData={cols3}
              rowsData={manyRows3col.slice((externalPage - 1) * 3, externalPage * 3)}
              showRowButtons
              showPagination
              handlePaginationInternally={false}
              isExpanded
              currentPage={externalPage}
              totalPages={Math.ceil(manyRows3col.length / 3)}
              pageSize={3}
              onPageChange={setExternalPage}
            />
          </section>

          {/* === 10. isExpandable=true — controlled expand/collapse === */}
          <section className="flex flex-col gap-4">
            <h2 className={SECTION_TITLE}>G-5.8 — isExpandable=true, controlled expand/collapse (cardTitleLabel + cardTitleValue shown when collapsed)</h2>
            <GenericTableCard
              language={language}
              title="Plots"
              title_ar="القطع"
              cardTitleLabel="Plots Summary"
              cardTitleLabel_ar="ملخص القطع"
              cardTitleValue="3 Plots"
              cardTitleValue_ar="٣ قطع"
              rowVariant="3colButton"
              columnsData={cols3}
              rowsData={rows3col}
              showRowButtons
              isExpandable
              isExpanded={isExpanded}
              onToggleExpand={() => setIsExpanded((v) => !v)}
              currentPage={1}
              totalPages={1}
              pageSize={10}
              onPageChange={() => {}}
            />
          </section>

          {/* === 11. showTitleSection=false === */}
          <section className="flex flex-col gap-4">
            <h2 className={SECTION_TITLE}>G-5.8 — showTitleSection=false (no outer CardTitle header)</h2>
            <GenericTableCard
              language={language}
              title="Plots"
              title_ar="القطع"
              cardTitleValue="Plots (No Section Header)"
              cardTitleValue_ar="القطع (بدون رأس قسم)"
              rowVariant="3colButton"
              columnsData={cols3}
              rowsData={rows3col}
              showRowButtons
              showTitleSection={false}
              isExpanded
              currentPage={1}
              totalPages={1}
              pageSize={10}
              onPageChange={() => {}}
            />
          </section>

          {/* === 12. title + description === */}
          <section className="flex flex-col gap-4">
            <h2 className={SECTION_TITLE}>G-5.8 — title + description</h2>
            <GenericTableCard
              language={language}
              title="Plot Registry"
              title_ar="سجل القطع"
              description="All registered plots in the system"
              description_ar="جميع القطع المسجلة في النظام"
              cardTitleValue="3 Records"
              cardTitleValue_ar="٣ سجلات"
              rowVariant="3colButton"
              columnsData={cols3}
              rowsData={rows3col}
              showRowButtons
              isExpanded
              currentPage={1}
              totalPages={1}
              pageSize={10}
              onPageChange={() => {}}
            />
          </section>

          {/* === 13. language="ar" RTL === */}
          <section className="flex flex-col gap-4">
            <h2 className={SECTION_TITLE}>G-5.8 — language="ar" RTL, showButtons=true</h2>
            <GenericTableCard
              language="ar"
              title="القطع"
              title_ar="القطع"
              cardTitleValue="قائمة القطع"
              cardTitleValue_ar="قائمة القطع"
              rowVariant="3colButton"
              columnsData={cols3}
              rowsData={rows3col}
              showRowButtons
              showButtons
              buttons={[
                { title: "إضافة", title_ar: "إضافة", type: "secondary", onClick: () => console.log("ar add") },
              ]}
              isExpanded
              currentPage={1}
              totalPages={1}
              pageSize={10}
              onPageChange={() => {}}
            />
          </section>

        </div>
      </Layout>
    </QueryClientProvider>
  );
}

export default App;
