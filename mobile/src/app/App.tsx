import React, { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Plus } from "lucide-react-native";

// UI (@platform -> mobile/src/ui)
import { Buttons } from "@platform/Buttons";
import { Typography } from "@platform/Typography";
import { Breadcrumb } from "@platform/Breadcrumb";
import { Pagination } from "@platform/Pagination";
import { Prompt } from "@platform/Prompt";
import { AddMoreButton } from "@platform/AddMoreButton";
import { Container } from "@platform/Container";
import { TextInput } from "@platform/TextInput";
import { TextArea } from "@platform/TextArea";
import { RadioCard } from "@platform/RadioCard";
import { CheckboxField } from "@platform/CheckboxField";
import { RadioInput } from "@platform/RadioInput";
import { Select } from "@platform/Select";
import { Label } from "@platform/Label";
import { Footer } from "@platform/Footer";
import { CustomDrawer } from "@platform/CustomDrawer";
import { ScreenLoader } from "@platform/ScreenLoader";
import { Avatar } from "@platform/Avatar";
import { Logo } from "@platform/Logo";
import { IconButton } from "@platform/IconButton";

// Shared components (@shared -> shared)
import { CardTitle } from "@shared/components/CardTitle";
import { CardRow } from "@shared/components/CardRow";
import { GenericCard } from "@shared/components/GenericCard";
import { GenericCards } from "@shared/components/GenericCards";
import { ApplicationMessage } from "@shared/components/ApplicationMessage";
import { ApplicationDetail } from "@shared/components/ApplicationDetail";
import { Payment } from "~/src/components/Payment";
import { SearchPlot } from "~/src/components/SearchPlot";
import { ViewPlotDetail } from "~/src/components/ViewPlotDetail";
import { UploadDocuments } from "~/src/components/UploadDocuments";
import { AuditRemarks } from "~/src/components/AuditRemarks";
import { OwnerSearch } from "~/src/components/OwnerSearch";
import { PaymentDetails } from "~/src/components/PaymentDetails";
import { Signature } from "~/src/components/Signature";
import { FilterBar } from "~/src/components/FilterBar";
import { TitleBar } from "~/src/components/TitleBar";
import { NewApplicationSummary } from "~/src/components/NewApplicationSummary";
import { ApplicationSummary } from "~/src/components/ApplicationSummary";

const SectionTitle = ({ title }: { title: string }) => (
  <Typography variant="text-bold-lg" text={title} language="en" />
);

export default function App() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [language, setLanguage] = useState<"en" | "ar">("en");

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BottomSheetModalProvider>
        <QueryClientProvider client={new QueryClient()}>
          <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
          >
            {/* ——— Buttons ——— */}
            <View style={styles.section}>
              <SectionTitle title="Buttons" />
              <Buttons title="Primary" type="primary" size="m" onClick={() => {}} language={language} />
              <View style={styles.row}>
                <Buttons title="Secondary" type="secondary" size="m" onClick={() => {}} language={language} />
                <Buttons title="Delete" type="delete" size="m" onClick={() => {}} language={language} />
              </View>
              <Buttons title="Full width" fullWidth onClick={() => {}} language={language} />
            </View>

            {/* ——— Typography ——— */}
            <View style={styles.section}>
              <SectionTitle title="Typography" />
              <Typography variant="h1" text="Heading 1" text_ar="عنوان ١" language={language} />
              <Typography variant="h1-hero" text="Hero" language={language} />
              <Typography variant="text-lg" text="Text large" language={language} />
              <Typography variant="text-md" text="Text medium" language={language} />
              <Typography variant="text-sm" text="Text small" language={language} />
            </View>

            {/* ——— Container, CardTitle, CardRow ——— */}
            <View style={styles.section}>
              <SectionTitle title="Container / CardTitle / CardRow" />
              <Container dir={language === "ar" ? "rtl" : "ltr"} className="p-4 border border-neutral-200 rounded-lg">
                <CardTitle title="Card title" title_ar="عنوان البطاقة" subText="Step 1 of 4" language={language} showBorder={false} />
                <CardRow label="Label" label_ar="التسمية" value="Value" value_ar="القيمة" language={language} />
                <CardRow rowVariant="moreLink" isMoreShown={false} onToggleMore={() => {}} language={language} />
              </Container>
            </View>

            {/* ——— Form inputs ——— */}
            <View style={styles.section}>
              <SectionTitle title="Form inputs" />
              <TextInput label="Text" placeholder="Enter text" value="" onChange={() => {}} language={language} />
              <TextArea label="Remarks" label_ar="ملاحظات" placeholder="Write here…" value="" onChange={() => {}} language={language} />
              <CheckboxField label="Accept terms" label_ar="قبول الشروط" checked={false} onChange={() => {}} language={language} />
              <RadioInput label="Type" options={[{ label: "A", value: "a" }, { label: "B", value: "b" }]} value="a" onChange={() => {}} language={language} />
              <Select label="Select" placeholder="Choose" options={[{ label: "Option 1", value: "1" }]} value="" onChange={() => {}} language={language} />
              <Label label="Label only" label_ar="تسمية فقط" language={language} />
            </View>

            {/* ——— RadioCard ——— */}
            <View style={styles.section}>
              <SectionTitle title="RadioCard" />
              <View style={styles.row}>
                <RadioCard id="a" label="Option A" label_ar="الخيار أ" iconLocation="left" language={language} clicked={true} onClick={() => {}} />
                <RadioCard id="b" label="Option B" label_ar="الخيار ب" iconLocation="left" language={language} clicked={false} onClick={() => {}} />
              </View>
            </View>

            {/* ——— Breadcrumb, Pagination, Prompt, AddMoreButton ——— */}
            <View style={styles.section}>
              <SectionTitle title="Breadcrumb / Pagination / Prompt / AddMore" />
              <Breadcrumb items={[{ label: "Home", onClick: () => {} }, { label: "Page", label_ar: "صفحة", onClick: () => {} }]} language={language} />
              <Pagination currentPage={1} pageSize={10} totalPages={5} onPageChange={() => {}} language={language} />
              <Prompt title="Confirm" subtiltle="Do you want to continue?" onYesClick={() => {}} onNoClick={() => {}} language={language} />
              <AddMoreButton title="Add item" plusIcon={<Plus />} onClick={() => {}} language={language} />
            </View>

            {/* ——— GenericCard ——— */}
            <View style={styles.section}>
              <SectionTitle title="GenericCard" />
              <GenericCard
                title="Card title"
                title_ar="عنوان البطاقة"
                cardTitleLabel="Summary"
                cardTitleValue="Value"
                rowsData={[
                  { label: "Row 1", value: "V1" },
                  { label: "Row 2", value: "V2" },
                ]}
                showMoreButton
                defaultShowMore={false}
                hasDocuments
                documents={[{ id: "1", documentName: "Doc.pdf", isUploaded: true, onDownloadClick: () => {} }]}
                documentTitle="Documents"
                language={language}
                showBorder={false}
              />
            </View>

            {/* ——— GenericCards ——— */}
            <View style={styles.section}>
              <SectionTitle title="GenericCards" />
              <GenericCards
                title="Cards list"
                cardsData={[
                  { cardTitleLabel: "Card 1", cardTitleValue: "Val 1", rowsData: [{ label: "A", value: "1" }] },
                  { cardTitleLabel: "Card 2", cardTitleValue: "Val 2", rowsData: [{ label: "B", value: "2" }] },
                ]}
                itemsPerRow="1"
                language={language}
                buttons={[{ title: "View", onClick: (_card, _index) => {} }]}
              />
            </View>

            {/* ——— ApplicationMessage ——— */}
            <View style={styles.section}>
              <SectionTitle title="ApplicationMessage" />
              <ApplicationMessage status="success" title="Success" description="Done." language={language} />
              <ApplicationMessage status="error" title="Error" description="Something failed." language={language} />
              <ApplicationMessage status="information" title="Info" description="Note." buttonTitle="OK" onClick={() => {}} language={language} />
            </View>

            {/* ——— ApplicationDetail ——— */}
            <View style={styles.section}>
              <SectionTitle title="ApplicationDetail" />
              <ApplicationDetail
                title="Application Detail"
                applicationNumber="100101255"
                applicationDate="13:00 - 28/03/2025"
                ownerName="Talal Ahmed"
                plotNumber="Plot 123"
                interactionHistory={[
                  { type: "inProgress", title: "Evaluation Pending", author: "Agent", date: "20/03/2025" },
                  { type: "completed", title: "Submitted", author: "Agent", date: "19/03/2025" },
                ]}
                documents={[{ title: "Certificate" }, { title: "ID" }]}
                language={language}
                onButtonClick={() => {}}
                onOwnerView={() => {}}
                onPlotView={() => {}}
              />
            </View>

            {/* ——— Payment ——— */}
            <View style={styles.section}>
              <SectionTitle title="Payment" />
              <Payment
                applicationId="app-1"
                stepInfo={undefined}
                isStepInfoPending={false}
                isPaymentSubmitting={false}
                onSubmit={() => {}}
                onSaveDraft={() => {}}
                onPaymentSubmit={() => {}}
                language={language}
              />
            </View>

            {/* ——— SearchPlot ——— */}
            <View style={styles.section}>
              <SectionTitle title="SearchPlot" />
              <SearchPlot
                title="Search Plot"
                subtitle="Choose by type"
                initialOwnerType="plot"
                enabledTabs={{ plot: true, company: true, owner: true, randomAllocation: false }}
                onSubmit={() => {}}
                language={language}
              />
            </View>

            {/* ——— ViewPlotDetail ——— */}
            <View style={styles.section}>
              <SectionTitle title="ViewPlotDetail" />
              <ViewPlotDetail
                plotIds={[]}
                plotTitle="Plot detail"
                plotLeftDetails={[{ label: "Area", value: "100" }]}
                owner={{ name: "Owner Name", details: [] }}
                language={language}
                showOwnerDetails
              />
            </View>

            {/* ——— UploadDocuments ——— */}
            <View style={styles.section}>
              <SectionTitle title="UploadDocuments" />
              <UploadDocuments
                documents={[{ documentName: "Doc 1", isUploaded: false }, { documentName: "Doc 2", isUploaded: true }]}
                onFileChange={() => {}}
                language={language}
                theme="dark"
              />
            </View>

            {/* ——— AuditRemarks ——— */}
            <View style={styles.section}>
              <SectionTitle title="AuditRemarks" />
              <AuditRemarks
                title="Audit Remarks"
                agent={{ name: "Agent", email: "a@b.com", phone: "" }}
                applicationDetails={[{ applicationNumber: "101", applicationDate: "", referenceNumber: "ref-1" }]}
                plots={[{ code: "P1", municipality: "", zone: "", sector: "", address: "Addr 1" }]}
                owners={[{ name: "Owner 1", familyBook: "", city: "", propertyCard: "" }]}
                value=""
                onChange={() => {}}
                language={language}
                onPlotClick={() => {}}
                onOwnerClick={() => {}}
              />
            </View>

            {/* ——— OwnerSearch ——— */}
            <View style={styles.section}>
              <SectionTitle title="OwnerSearch" />
              <OwnerSearch
                title="Search owner"
                ownerTypeOptions={{ company: "By Company", owner: "By Owner" }}
                selected={[]}
                onSubmit={() => {}}
                language={language}
              />
            </View>

            {/* ——— PaymentDetails ——— */}
            <View style={styles.section}>
              <SectionTitle title="PaymentDetails" />
              <PaymentDetails
                applicationId="app-1"
                payments={[
                  { applicationPaymentId: 1, municipalityId: 1, paymentDescriptionE: "Fee", paymentDescriptionA: "رسوم", amountDue: "100", municipalityNameE: "Dubai", paidByName: "", receiptNumber: "", receiptDate: "", amountInWords: "", vatAmount: "" },
                ]}
                showButtons
                buttons={[{ title: "Pay", type: "primary", onClick: () => {} }]}
                language={language}
              />
            </View>

            {/* ——— Signature ——— */}
            <View style={styles.section}>
              <SectionTitle title="Signature" />
              <Signature onSubmit={() => {}} language={language} />
            </View>

            {/* ——— FilterBar ——— */}
            <View style={styles.section}>
              <SectionTitle title="FilterBar" />
              <FilterBar sortOptions={["Newest", "Oldest"]} applicationOptions={["My Apps", "All"]} onSearchChange={() => {}} onReset={() => {}} language={language} />
            </View>

            {/* ——— TitleBar ——— */}
            <View style={styles.section}>
              <SectionTitle title="TitleBar" />
              <TitleBar title="Screen title" title_ar="عنوان الشاشة" language={language} />
            </View>

            {/* ——— NewApplicationSummary / ApplicationSummary ——— */}
            <View style={styles.section}>
              <SectionTitle title="Summaries" />
              <NewApplicationSummary title="New application" applicationId="app-1" onPressPlotView={() => {}} onPressOwnerAction={() => {}} language={language} />
              <ApplicationSummary title="Application Summary" data={[[{ type: "section" }]]} language={language} />
            </View>

            {/* ——— ScreenLoader, Avatar, Logo, IconButton ——— */}
            <View style={styles.section}>
              <SectionTitle title="ScreenLoader / Avatar / Logo / IconButton" />
              <ScreenLoader isLoading={false} alt="Loading…" />
              <Avatar initials="U" avatarSize={40} />
              <Logo type="icon" width={32} height={32} />
              <IconButton icon={<Plus />} />
            </View>

            {/* ——— Footer ——— */}
            <View style={styles.section}>
              <SectionTitle title="Footer" />
              <Footer showLogo showBot language={language} botMessage="Help?" botMessage_ar="مساعدة؟" />
            </View>

            {/* ——— CustomDrawer ——— */}
            <View style={styles.section}>
              <SectionTitle title="CustomDrawer" />
              <Buttons title="Open drawer" type="secondary" onClick={() => setDrawerOpen(true)} language={language} />
              <CustomDrawer
                open={drawerOpen}
                onOpenChange={setDrawerOpen}
                size="layer2"
                dismissible
                showCloseButton
                language={language}
                header={<Typography variant="text-bold-lg" text="Drawer" language={language} />}
              >
                <Typography variant="text-md" text="Drawer content" language={language} />
                <Buttons title="Close" type="primary" onClick={() => setDrawerOpen(false)} language={language} />
              </CustomDrawer>
            </View>

            <View style={{ height: 48 }} />
          </ScrollView>
        </QueryClientProvider>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  content: { padding: 16, paddingBottom: 48 },
  section: { marginTop: 24 },
  row: { flexDirection: "row", flexWrap: "wrap", gap: 12, marginTop: 8 },
});
