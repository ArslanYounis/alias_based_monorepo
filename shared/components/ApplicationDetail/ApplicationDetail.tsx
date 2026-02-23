import React, { type ReactNode } from "react";
import { Container } from "@platform/Container";
import { CardTitle } from "@shared/components/CardTitle";
import { Typography } from "@platform/Typography";
import { TextInput } from "@platform/TextInput";
import { Buttons } from "@platform/Buttons";

/** Single interaction row in Interaction History */
export interface ApplicationDetailInteractionItem {
  type: "inProgress" | "completed";
  title: string;
  author: string;
  date: string;
  totalSteps?: number;
  completedSteps?: number;
}

/** Single document row in Documents section */
export interface ApplicationDetailDocumentItem {
  title: string;
  title_ar?: string;
  onFileChange?: (file: File | null) => void;
}

export interface ApplicationDetailProps {
  title?: string;
  title_ar?: string;
  applicationNumber?: string;
  applicationNumber_ar?: string;
  applicationDate?: string;
  applicationDate_ar?: string;
  referenceNumber?: string;
  referenceNumber_ar?: string;
  buttonTitle?: string;
  buttonTitle_ar?: string;
  buttonType?: "primary" | "secondary" | "tertiary" | "text-link" | "delete";
  showButton?: boolean;
  onButtonClick?: () => void;
  onReferenceNumberChange?: (value: string) => void;
  language?: "en" | "ar";
  /** Owner section */
  ownerName?: string;
  ownerName_ar?: string;
  onOwnerView?: () => void;
  onPlotsClick?: () => void;
  onEditContact?: () => void;
  /** Plot section */
  plotNumber?: string;
  plotNumber_ar?: string;
  onPlotView?: () => void;
  /** Theme for section styling */
  theme?: "light" | "dark";
  /** Interaction History (optional) */
  interactionHistory?: ApplicationDetailInteractionItem[];
  /** Documents list (optional); use renderDocumentsSection to provide custom upload UI */
  documents?: ApplicationDetailDocumentItem[];
  /** Optional custom render for the entire Documents section (e.g. platform UploadDocument components) */
  renderDocumentsSection?: ReactNode;
}

const DEFAULT_INTERACTION_ITEMS: ApplicationDetailInteractionItem[] = [
  { type: "inProgress", title: "Evaluation Pending", author: "Farzana shah", date: "10:36 - 20/03/2025" },
  { type: "completed", title: "Sent for Evaluation", author: "Farzana shah", date: "10:36 - 20/03/2025" },
  { type: "completed", title: "Application created", author: "Farzana shah", date: "10:36 - 20/03/2025" },
];

const DEFAULT_DOCUMENT_ITEMS: ApplicationDetailDocumentItem[] = [
  { title: "Land free of buildings certificate" },
  { title: "Building clearance certificate" },
];

export const ApplicationDetail: React.FC<ApplicationDetailProps> = ({
  title = "Application Detail",
  title_ar = "تفاصيل الطلب",
  applicationNumber = "100101255",
  applicationNumber_ar,
  applicationDate = "13:00 - 28/03/2025",
  applicationDate_ar,
  referenceNumber = "",
  referenceNumber_ar,
  buttonTitle = "View",
  buttonTitle_ar,
  buttonType = "secondary",
  showButton = true,
  onButtonClick,
  onReferenceNumberChange,
  language = "en",
  ownerName = "Talal ahmed al Shamsi",
  ownerName_ar,
  onOwnerView,
  onPlotsClick,
  onEditContact,
  plotNumber = "C107",
  plotNumber_ar,
  onPlotView,
  theme = "dark",
  interactionHistory = DEFAULT_INTERACTION_ITEMS,
  documents = DEFAULT_DOCUMENT_ITEMS,
  renderDocumentsSection,
}) => {
  const hasDate = Boolean(applicationDate || applicationDate_ar);
  const hasReference = Boolean(referenceNumber || referenceNumber_ar);
  const applicationNumberDisplay =
    language === "ar" ? (applicationNumber_ar ?? applicationNumber) : applicationNumber;
  const applicationDateDisplay =
    language === "ar" ? (applicationDate_ar ?? applicationDate) : applicationDate;
  const referenceNumberDisplay =
    language === "ar" ? (referenceNumber_ar ?? referenceNumber) : referenceNumber;
  const ownerNameDisplay =
    language === "ar" ? (ownerName_ar ?? ownerName) : ownerName;
  const plotNumberDisplay =
    language === "ar" ? (plotNumber_ar ?? plotNumber) : plotNumber;

  const isDark = theme === "dark";
  const textClass = isDark ? "text-[#ffffff]" : "text-[#12121B]";
  const borderClass = isDark ? "border-[#59595F]" : "border-[#E7E7E8]";
  const cardBgClass = isDark ? "bg-[#2A2A32]" : "bg-transparent border border-[#E7E7E8]";
  const inputClass = isDark
    ? "bg-[#717176] border-[#717176]"
    : "bg-[#F0F3F5] border-[#E7E7E8]";
  const sectionContentClass = isDark
    ? "text-[#ffffff] bg-[#2A2A32]"
    : "text-[#12121B] bg-transparent border border-[#E7E7E8]";
  const completedBgClass = isDark ? "#141e1e" : "#2B8A3E1A";
  const inProgressBgClass = isDark ? "#2A2A32" : "transparent";
  const completeBadgeClass = isDark
    ? "bg-[#2B8A3E] text-[#ffffff]"
    : "bg-[#D3F9D8] text-[#2B8A3E]";

  return (
    <Container className={`px-6 ${textClass}`}>
      <Container className={`text-[32px] sm:text-[48px] font-bold mb-8 ${textClass}`}>
        <Typography variant="h3" text="Application Details" text_ar="تفاصيل الطلب" language={language} />
      </Container>

      {/* Application Details Card */}
      <Container className={`w-full px-6 py-4 mb-8 rounded-lg ${cardBgClass}`}>
        <Container className={`flex flex-row items-center border-b ${borderClass} pb-2 mb-2 ${textClass}`}>
          <Container className="w-[200px]">
            <Typography variant="text-bold-md" text="Application Number" text_ar="رقم الطلب" language={language} />
          </Container>
          <Container className="flex-1">
            <Typography variant="text-md" text={applicationNumberDisplay} language={language} />
          </Container>
        </Container>
        {hasDate && (
          <Container className={`flex flex-row items-center border-b ${borderClass} pb-2 mb-2 ${textClass}`}>
            <Container className="w-[200px]">
              <Typography variant="text-bold-md" text="Application Date" text_ar="تاريخ الطلب" language={language} />
            </Container>
            <Container className="flex-1">
              <Typography variant="text-md" text={applicationDateDisplay} language={language} />
            </Container>
          </Container>
        )}
        {hasReference && (
          <Container className={`flex flex-row items-center ${textClass}`}>
            <Container className="w-[200px]">
              <Typography variant="text-bold-md" text="Reference Number" text_ar="رقم المرجع" language={language} />
            </Container>
            <Container className={`flex-1 max-w-[266px]`}>
              <TextInput
                label=""
                value={referenceNumberDisplay}
                onChange={(v) => onReferenceNumberChange?.(v)}
                language={language}
              />
            </Container>
          </Container>
        )}
      </Container>

      {/* Owner Section */}
      {(ownerName || ownerName_ar) && (
        <Container className={`mb-4 ${textClass}`}>
          <Container className="flex justify-between items-center mb-4">
            <Typography variant="text-bold-lg" text="Owner" text_ar="المالك" language={language} />
            <Container className="flex gap-2">
              <Buttons title="View" title_ar="منظر" type="secondary" size="s" onClick={onOwnerView} language={language} />
              <Buttons title="Plots" title_ar="القطع" type="secondary" size="s" onClick={onPlotsClick} language={language} />
              <Buttons title="Edit Contact" title_ar="تعديل جهة الاتصال" type="secondary" size="s" onClick={onEditContact} language={language} />
            </Container>
          </Container>
          <Container className={`w-full rounded-lg min-h-[52px] px-6 py-4 flex items-center ${sectionContentClass}`}>
            <Container className={`flex flex-row items-center w-full`}>
              <Container className="w-[200px]">
                <Typography variant="text-bold-md" text="Name" text_ar="الاسم" language={language} />
              </Container>
              <Container className="flex-1">
                <Typography variant="text-md" text={ownerNameDisplay ?? ""} language={language} />
              </Container>
            </Container>
          </Container>
        </Container>
      )}

      {/* Plot Section */}
      {(plotNumber || plotNumber_ar) && (
        <Container className={`mb-4 ${textClass}`}>
          <Container className="flex justify-between items-center mb-4">
            <Typography variant="text-bold-lg" text="Plot" text_ar="القطعة" language={language} />
            <Buttons title="View" title_ar="منظر" type="secondary" size="s" onClick={onPlotView} language={language} />
          </Container>
          <Container className={`w-full rounded-lg min-h-[52px] px-6 py-4 flex items-center ${sectionContentClass}`}>
            <Container className="flex flex-row items-center w-full">
              <Container className="w-[200px]">
                <Typography variant="text-bold-md" text="Plot Number" text_ar="رقم القطعة" language={language} />
              </Container>
              <Container className="flex-1">
                <Typography variant="text-md" text={plotNumberDisplay ?? ""} language={language} />
              </Container>
            </Container>
          </Container>
        </Container>
      )}

      {/* Optional title from props */}
      {(title || title_ar) && (
        <Container className={`mb-4 ${textClass}`}>
          <Typography variant="text-md" text={title} text_ar={title_ar ?? title} language={language} />
        </Container>
      )}
      {showButton && (
        <Container className="mb-4">
          <Buttons
            title={buttonTitle}
            title_ar={buttonTitle_ar ?? buttonTitle}
            type={buttonType}
            size="s"
            onClick={onButtonClick}
            language={language}
          />
        </Container>
      )}

      {/* Interaction History Section */}
      {interactionHistory.length > 0 && (
        <Container className={`mb-4 ${textClass}`}>
          <Container className="mb-4">
            <Typography variant="text-bold-lg" text="Interaction History" text_ar="سجل التفاعل" language={language} />
          </Container>
          {interactionHistory.map((card, index) => {
            const isCompleted = card.type === "completed";
            const cardBg = isCompleted ? completedBgClass : inProgressBgClass;
            const cardBorder = isCompleted ? "1px solid #2B8A3E" : `1px solid ${isDark ? "#59595F" : "#E7E7E8"}`;
            const iconBorder = isCompleted ? "#2B8A3E" : "#169F9F";
            return (
              <Container
                key={index}
                className="w-full rounded-lg mb-4"
                style={{
                  minHeight: 128,
                  padding: "16px 16px 8px 16px",
                  backgroundColor: cardBg,
                  border: cardBorder,
                }}
              >
                <Container className="flex flex-row items-start gap-4">
                  <Container
                    className="flex-shrink-0 items-center justify-center rounded-full border-2"
                    style={{ width: 40, height: 40, borderColor: iconBorder }}
                  >
                    <Typography variant="text-bold-md" text={isCompleted ? "✓" : "→"} language="en" />
                  </Container>
                  <Container className="flex-1 flex flex-col justify-between">
                    <Container className="flex justify-between items-start">
                      <Typography variant="text-md" text={card.title} language={language} />
                      {isCompleted ? (
                        <Container className={`px-3 py-1 rounded-full ${completeBadgeClass}`}>
                          <Typography variant="text-sm" text="Complete" text_ar="مكتمل" language={language} />
                        </Container>
                      ) : (
                        <Typography
                          variant="text-sm"
                          text={card.completedSteps != null && card.totalSteps != null ? `Steps ${card.completedSteps}/${card.totalSteps}` : "In progress"}
                          text_ar={card.completedSteps != null && card.totalSteps != null ? `الخطوات ${card.completedSteps}/${card.totalSteps}` : "قيد التنفيذ"}
                          language={language}
                        />
                      )}
                    </Container>
                    <Container className="flex flex-row max-w-[200px] mt-2">
                      <Typography variant="text-sm" text="By" text_ar="بواسطة" language={language} />
                      <Typography variant="text-sm" text={card.author} language={language} />
                    </Container>
                    <Container className="border-t border-gray-600 w-[75%] my-2" />
                    <Container className="flex flex-row max-w-[200px]">
                      <Typography variant="text-sm" text="Date" text_ar="التاريخ" language={language} />
                      <Typography variant="text-sm" text={card.date} language={language} />
                    </Container>
                  </Container>
                </Container>
              </Container>
            );
          })}
        </Container>
      )}

      {/* Documents Section */}
      <Container className={`mb-4 ${textClass}`}>
        <Container className="mb-4">
          <Typography variant="text-bold-lg" text="Documents" text_ar="المستندات" language={language} />
        </Container>
        {renderDocumentsSection != null ? (
          renderDocumentsSection
        ) : (
          <Container className="space-y-2">
            {documents.map((doc, index) => (
              <Container key={index} className="mb-2">
                <Typography
                  variant="text-md"
                  text={language === "ar" ? doc.title_ar ?? doc.title : doc.title}
                  language={language}
                />
              </Container>
            ))}
          </Container>
        )}
      </Container>
    </Container>
  );
};

export default ApplicationDetail;
