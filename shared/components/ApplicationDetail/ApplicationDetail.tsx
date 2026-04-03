import React from "react";
import { Container } from "@platform/Container";
import { Text } from "@platform/Text";
import { Buttons } from "@platform/Buttons";
import { CheckIcon, SendIcon, DocumentIcon } from "@platform/icons";
import ProcessStatusRows from "../ProcessStatusRows";
import SharedLanguageSwitchRenderer from "../SharedLanguageSwitchRenderer";
import { useGetApplicationDetails } from "../../hooks/useGetApplicationDetails";
import type {
  ApplicationOwner,
  ApplicationPlot,
  ApplicationStep,
  ApplicationDocumentItem,
  ApplicationAttachment,
  ApplicationDetailProps,
} from "../../types";

interface InteractionCard {
  type: "completed" | "inProgress";
  title: string;
  author: string;
  date: string;
}

const ApplicationDetail: React.FC<ApplicationDetailProps> = ({
  applicationId,
  applicationTitle,
  applicationTitle_ar,
  language,
  onOwnerClick,
  onPlotClick,
  onDocumentOpen,
}) => {
  const { data, isLoading, isError } = useGetApplicationDetails(applicationId);

  if (isLoading) {
    return (
      <Container>
        <SharedLanguageSwitchRenderer
          value="Loading..."
          value_ar="جارٍ التحميل..."
          language={language}
        />
      </Container>
    );
  }

  if (isError || !data?.result) {
    return (
      <Container>
        <SharedLanguageSwitchRenderer
          value="Error loading application details."
          value_ar="خطأ في تحميل تفاصيل التطبيق."
          language={language}
        />
      </Container>
    );
  }

  const { application, owners, plot, steps, documents } = data.result;

  // Helper functions
  const getOwnerName = (owner: ApplicationOwner) =>
    language === "en" ? owner.ownerNameE : owner.ownerNameA;
  const getPlotName = (p: ApplicationPlot) => p.plotNumber;
  const getDocumentName = (doc: ApplicationDocumentItem) =>
    language === "en" ? doc.documentNameE : doc.documentNameA;
  const getStepTitle = (step: ApplicationStep) => step.stepConst;
  const getStepAuthor = (step: ApplicationStep) =>
    step.actionUser
      ? language === "en"
        ? step.actionUser.userNameE
        : step.actionUser.userNameA
      : "";
  const getStepDate = (step: ApplicationStep) => step.actionDate || "";

  // Map interaction cards from steps
  const interactionCards: InteractionCard[] = (steps || []).map((step) => ({
    type: step.status === 2 ? "completed" : "inProgress",
    title: getStepTitle(step),
    author: getStepAuthor(step),
    date: getStepDate(step),
  }));

  // Map document cards
  const documentCards = (documents || []).map((doc) => ({
    title: getDocumentName(doc),
    attachments: doc.attachmentList || [],
  }));

  // Render uploaded document card (read-only, clickable if attachment exists)
  const renderUploadedDocumentCard = (
    document: { title: string; attachments: ApplicationAttachment[] },
    index: number
  ) => {
    const firstAttachment =
      document.attachments && document.attachments.length > 0
        ? document.attachments[0]
        : null;

    const handleClick = () => {
      if (firstAttachment && firstAttachment.downloadUrl) {
        onDocumentOpen?.(firstAttachment.downloadUrl);
      }
    };

    return (
      <Container
        key={index}
        className="mb-xs"
      >
        <Container
          className={`w-full h-12 flex flex-row items-center px-m rounded-xxs bg-form-fields-file-upload-uploaded ${firstAttachment ? "cursor-pointer" : ""}`}
          style={{ cursor: firstAttachment ? "pointer" : "default" }}
          onClick={firstAttachment ? handleClick : undefined}
        >
          <Container className="flex-1">
            <Text className="text-m font-normal text-text-default">
              {document.title}
            </Text>
          </Container>
          <DocumentIcon />
        </Container>
      </Container>
    );
  };

  // Render detail row (label + value)
  const renderDetailRow = (label: string, value: string, isLast = false) => (
    <Container
      className={`flex flex-row items-center w-full ${!isLast ? "border-b border-text-dimmed pb-s mb-s" : ""}`}
    >
      <Container className="flex-1">
        <Text className="text-bold-m text-text-default">{label}</Text>
      </Container>
      <Container className="flex-1">
        <Text className="text-m text-text-default">{value}</Text>
      </Container>
    </Container>
  );

  // Render section card (title + content + optional action buttons)
  const renderSectionCard = (
    title: string,
    content: React.ReactNode,
    buttons?: { text: string; onClick: () => void }[]
  ) => (
    <Container className="mb-m text-text-default">
      <Container className="flex flex-row justify-between items-center mb-m">
        <Text className="text-heading-h3 font-bold text-text-default">
          {title}
        </Text>
        {buttons && (
          <Container className="flex flex-row gap-xs">
            {buttons.map((btn) => (
              <Buttons
                key={btn.text}
                title={btn.text}
                type="secondary"
                size="s"
                onClick={btn.onClick}
                language={language}
              />
            ))}
          </Container>
        )}
      </Container>
      <Container className="w-full rounded-lg px-l py-l flex flex-row items-center bg-cards-base-l1 border border-cards-stroke">
        {content}
      </Container>
    </Container>
  );

  // Render interaction card
  const renderInteractionCard = (card: InteractionCard, index: number) => {
    const isCompleted = card.type === "completed";

    return (
      <Container
        key={index}
        className={`w-full rounded-xs mb-m px-m pt-m pb-xs gap-l ${isCompleted ? "bg-green-9/10" : "bg-dark-8"} ${isCompleted ? "border border-green-9" : ""}`}
        style={{ height: 128 }}
      >
        <Container className="flex flex-row items-start gap-m" style={{ height: "100%" }}>
          {/* Status icon circle */}
          <Container
            className={`flex items-center justify-center flex-shrink-0 w-10 h-10 rounded-full border ${isCompleted ? "border-green-9" : "border-Teal-9"}`}
          >
            {isCompleted ? <CheckIcon /> : <SendIcon />}
          </Container>

          {/* Card content */}
          <Container className="flex-1 flex flex-col justify-between" style={{ height: "100%" }}>
            {/* Title + status badge/balls */}
            <Container className="flex flex-row justify-between items-start">
              <Text className="text-bold-l text-text-default">{card.title}</Text>
              {isCompleted ? (
                <Container className="px-xs py-xxs rounded-xxl gap-sm bg-status-success-solid">
                  <Text className="text-bold-xs text-Base-White">
                    <SharedLanguageSwitchRenderer
                      value="Complete"
                      value_ar="مكتمل"
                      language={language}
                    />
                  </Text>
                </Container>
              ) : (
                <ProcessStatusRows
                  totalSteps={6}
                  completedSteps={2}
                  currentStepStatus="inProgress"
                  ballSize={12}
                  gap={4}
                />
              )}
            </Container>

            {/* Author row */}
            <Container className="flex flex-row" style={{ maxWidth: 300 }}>
              <Container style={{ width: 40 }}>
                <Text className="text-bold-m text-text-default">
                  <SharedLanguageSwitchRenderer value="By" value_ar="بواسطة" language={language} />
                </Text>
              </Container>
              <Container className="flex-1">
                <Text className="text-m ml-m text-text-default">{card.author}</Text>
              </Container>
            </Container>

            {/* Divider */}
            <Container className="border-b border-Dark-7" style={{ width: "75%" }}>
              {null}
            </Container>

            {/* Date row */}
            <Container className="flex flex-row" style={{ maxWidth: 200 }}>
              <Container style={{ width: 40 }}>
                <Text className="text-bold-m text-text-default">
                  <SharedLanguageSwitchRenderer value="Date" value_ar="التاريخ" language={language} />
                </Text>
              </Container>
              <Container className="flex-1">
                <Text className="text-m ml-m text-text-default">{card.date}</Text>
              </Container>
            </Container>
          </Container>
        </Container>
      </Container>
    );
  };

  return (
    <Container className="px-l w-full" dir={language === "ar" ? "rtl" : "ltr"}>
      {/* Page title */}
      <Text className="text-heading-h1 font-bold mb-xl text-text-default">
        {language === "en" ? applicationTitle : applicationTitle_ar}
      </Text>

      {/* Application Details Card */}
      <Container className="w-full px-l py-m gap-l mb-xl rounded-xs bg-cards-base-l1 border border-cards-stroke">
        {renderDetailRow(
          language === "en" ? "Application Number" : "رقم الطلب",
          application?.applicationNumber || ""
        )}
        {renderDetailRow(
          language === "en" ? "Application Date" : "تاريخ الطلب",
          application?.applicationCreatedDate || ""
        )}
        {renderDetailRow(
          language === "en" ? "Reference Number" : "الرقم المرجعي",
          application?.applicationReferenceNumber || "",
          true
        )}
      </Container>

      {/* Owner Section */}
      {owners &&
        owners.length > 0 &&
        renderSectionCard(
          language === "en" ? "Owner" : "المالك",
          renderDetailRow(
            language === "en" ? "Name" : "الاسم",
            getOwnerName(owners[0]),
            true
          ),
          [
            {
              text: language === "en" ? "View" : "عرض",
              onClick: () =>
                onOwnerClick?.({ ownerData: owners[0], action: "view" }),
            },
            {
              text: language === "en" ? "Plots" : "القطع",
              onClick: () =>
                onOwnerClick?.({ ownerData: owners[0], action: "plot" }),
            },
            {
              text: language === "en" ? "Edit Contact" : "تعديل جهة الاتصال",
              onClick: () =>
                onOwnerClick?.({ ownerData: owners[0], action: "edit" }),
            },
          ]
        )}

      {/* Plot Section */}
      {plot &&
        renderSectionCard(
          language === "en" ? "Plot" : "قطعة الأرض",
          renderDetailRow(
            language === "en" ? "Plot Number" : "رقم القطعة",
            getPlotName(plot),
            true
          ),
          [
            {
              text: language === "en" ? "View" : "عرض",
              onClick: () =>
                onPlotClick?.({ PlotData: plot, action: "view" }),
            },
          ]
        )}

      {/* Interaction History Section */}
      <Container className="mb-m">
        <Text className="text-heading-h3 font-bold mb-m text-text-default">
          {language === "en" ? "Interaction History" : "سجل التفاعل"}
        </Text>
        {interactionCards.map(renderInteractionCard)}
      </Container>

      {/* Documents Section */}
      <Container className="mb-m">
        <Text className="text-heading-h3 font-bold mb-m text-text-default">
          {language === "en" ? "Documents" : "المستندات"}
        </Text>
        <Container className="gap-xs">
          {documentCards.map(renderUploadedDocumentCard)}
        </Container>
      </Container>
    </Container>
  );
};

export default ApplicationDetail;
