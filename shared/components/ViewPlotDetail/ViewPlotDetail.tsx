import React, { useEffect, useState } from "react";
import { Container } from "@platform/Container";
import { Text } from "@platform/Text";
import { Buttons } from "@platform/Buttons";
import SharedLanguageSwitchRenderer from "../SharedLanguageSwitchRenderer";
import useGetPlotDetail, {
  PlotDetailResponse,
} from "@shared/hooks/useGetPlotDetail";
import { useGetPlotImage } from "@shared/hooks/useGetPlotImage";

export interface PlotInfoItem {
  label: string;
  label_ar?: string;
  value: string;
  value_ar?: string;
}

export interface OwnerInfo {
  name: string;
  details: PlotInfoItem[];
}

export interface ViewPlotDetailProps {
  plotIds?: string[];
  showOwnerDetails?: boolean;
  plotCode?: string;
  plotCode_ar?: string;
  plotTitle?: string;
  plotTitle_ar?: string;
  plotImage?: string;
  plotLeftDetails?: PlotInfoItem[];
  plotBottomDetails?: PlotInfoItem[];
  owner?: OwnerInfo;
  theme?: "light" | "dark";
  language?: "en" | "ar";
  // Button labels
  viewButtonText?: string;
  viewButtonText_ar?: string;
  // Section labels
  ownerText?: string;
  ownerText_ar?: string;
  documentsText?: string;
  documentsText_ar?: string;
  // Document names
  uaeIdText?: string;
  uaeIdText_ar?: string;
  passportText?: string;
  passportText_ar?: string;
}

interface SinglePlotDetailProps {
  plotDetail: PlotDetailResponse;
  plotTitle?: string;
  plotTitle_ar?: string;
  plotLeftDetails?: PlotInfoItem[];
  plotBottomDetails?: PlotInfoItem[];
  owner?: OwnerInfo;
  theme?: "light" | "dark";
  language?: "en" | "ar";
  ownerText?: string;
  ownerText_ar?: string;
  showOwnerDetails?: boolean;
  platform?: "web" | "mobile";
}

// SinglePlotDetail component that handles its own image fetching
const SinglePlotDetail: React.FC<SinglePlotDetailProps> = ({
  plotDetail,
  plotTitle = "",
  plotTitle_ar,
  plotLeftDetails: staticPlotLeftDetails = [],
  plotBottomDetails: staticPlotBottomDetails = [],
  owner: staticOwner,
  language = "en",
  ownerText = "Owner",
  ownerText_ar = "المالك",
  showOwnerDetails = true,
  platform = "web",
}) => {
  // Fetch image for this specific plot
  const { data: imageBlob, isPending: isImagePending } = useGetPlotImage(
    plotDetail?.urlArgs
  );
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!imageBlob) return;

    // If the API returned a Blob, create a local URL for it
    if (imageBlob instanceof Blob) {
      const url = URL.createObjectURL(imageBlob);
      setImageUrl(url);

      // Cleanup when component unmounts or blob changes
      return () => URL.revokeObjectURL(url);
    }
  }, [imageBlob]);

  // Use API data if available, otherwise fallback to static props
  const plotLeftDetails: PlotInfoItem[] = plotDetail
    ? [
        {
          label: "Plot Address",
          label_ar: "عنوان القطعة",
          value: plotDetail?.plotAddress || "",
          value_ar: plotDetail?.plotAddress || "",
        },
        {
          label: "Zone/District",
          label_ar: "المنطقة / الحي",
          value: plotDetail?.district?.districtNameE || "",
          value_ar: plotDetail?.district?.districtNameA || "",
        },
        {
          label: "Sector",
          label_ar: "القطاع",
          value: plotDetail?.community?.communityNameE || "",
          value_ar: plotDetail?.community?.communityNameE || "",
        },
      ]
    : staticPlotLeftDetails;

  const plotBottomDetails: PlotInfoItem[] = plotDetail
    ? [
        {
          label: "Plot Number",
          label_ar: "رقم القطعة",
          value: plotDetail?.plotNumber || "",
          value_ar: plotDetail?.plotNumber || "",
        },
        {
          label: "Municipality",
          label_ar: "البلدية",
          value: plotDetail.municipality?.municipalityNameE || "",
          value_ar: plotDetail.municipality?.municipalityNameA || "",
        },
        {
          label: "Allocation Type",
          label_ar: "نوع التخصيص",
          value: "",
          value_ar: "",
        },
        {
          label: "Land Use",
          label_ar: "\tاستخدام الأرض",
          value: plotDetail.landUse?.landuseNameE || "",
          value_ar: plotDetail.landUse?.landuseNameA || "",
        },
        {
          label: "Investment Area Name",
          label_ar: "اسم منطقة الاستثمار",
          value: "",
          value_ar: "",
        },
        {
          label: "Expat Ownership Percentage",
          label_ar: "نسبة تملك الأجانب",
          value: "",
          value_ar: "",
        },
        {
          label: "Plot File Number",
          label_ar: "رقم ملف القطعة",
          value: plotDetail?.plotFileNumber || "",
          value_ar: plotDetail?.plotFileNumber || "",
        },
        {
          label: "Area",
          label_ar: "\tالمساحة",
          value: plotDetail?.plotAreaFeet || "",
          value_ar: plotDetail?.plotAreaFeet || "",
        },
        {
          label: "Construction Status",
          label_ar: "\tحالة البناء",
          value: plotDetail?.constructionStatusE || "",
          value_ar: plotDetail?.constructionStatusA || "",
        },
      ]
    : staticPlotBottomDetails;

  const ownerDetails: PlotInfoItem[] = plotDetail
    ? [
        {
          label: "UAE National ID",
          label_ar: "الهوية الوطنية الإماراتية",
          value: plotDetail?.ownersList?.nationalityId || "",
          value_ar: plotDetail?.ownersList?.nationalityId || "",
        },
        {
          label: "MOI Unified Number",
          label_ar: "الرقم الموحد (وزارة الداخلية)",
          value: plotDetail?.ownersList?.moiUnifiedNumber || "",
          value_ar: plotDetail?.ownersList?.moiUnifiedNumber || "",
        },
        {
          label: "Archive Number",
          label_ar: "رقم الأرشيف",
          value: plotDetail?.ownersList?.archiveFileNumberAA || "",
          value_ar: plotDetail?.ownersList?.archiveFileNumberAA || "",
        },
        {
          label: "Nationality",
          label_ar: "الجنسية",
          value: plotDetail?.ownersList?.nationalityE || "",
          value_ar: plotDetail?.ownersList?.nationalityA || "",
        },
        {
          label: "Special Nationality",
          label_ar: "جنسية خاصة",
          value: plotDetail?.ownersList?.hasSpecialNationality ? "Yes" : "No",
          value_ar: plotDetail?.ownersList?.hasSpecialNationality
            ? "نعم"
            : "لا",
        },
        {
          label: "Share",
          label_ar: "الحصة",
          value: plotDetail?.ownersList?.plotShares?.[0]?.share || "",
          value_ar: plotDetail?.ownersList?.plotShares?.[0]?.share || "",
        },
        {
          label: "Right Hold Types",
          label_ar: "أنواع أصحاب الحقوق",
          value:
            plotDetail?.ownersList?.plotShares?.[0]?.rightsHoldType
              ?.rightsHoldTypeNameE || "",
          value_ar:
            plotDetail?.ownersList?.plotShares?.[0]?.rightsHoldType
              ?.rightsHoldTypeNameA || "",
        },
      ]
    : staticOwner?.details || [];

  const ownerName = plotDetail
    ? plotDetail?.ownersList?.ownerNameE || ""
    : staticOwner?.name || "";

  return (
    <Container className="mb-xl">
      <Text
        className={`${
          platform === "web" ? "text-heading-h1" : "text-heading-h3"
        } font-bold mb-xl text-text-default`}
      >
        <SharedLanguageSwitchRenderer
          language={language}
          value={plotDetail?.plotAddress || plotLeftDetails?.[0]?.value || ""}
          value_ar={
            plotDetail?.plotAddress || plotLeftDetails?.[0]?.value_ar || ""
          }
        />
      </Text>

      <Container className="flex flex-col gap-xxs">
        <Container className="flex flex-row items-center justify-between">
          <Text
            className={`${
              platform === "web" ? "text-heading-h3" : "text-heading-h4"
            } font-bold text-text-default`}
          >
            <SharedLanguageSwitchRenderer
              language={language}
              value={plotTitle}
              value_ar={plotTitle_ar || plotTitle}
            />
          </Text>
        </Container>

        <Container
          className={`py-m px-l bg-cards-base-l2 border border-cards-stroke rounded-xs mb-xl`}
        >
          <Container className="flex flex-row gap-m mb-xs">
            <Container className="w-1/2">
              {plotLeftDetails.map((item, idx) => (
                <Container
                  key={idx}
                  className={`flex flex-col border-b border-text-dimmed pb-s mb-s gap-xxs`}
                >
                  <Text className={`text-bold-m text-text-default`}>
                    <SharedLanguageSwitchRenderer
                      language={language}
                      value={item.label}
                      value_ar={item.label_ar || item.label}
                    />
                  </Text>
                  <Text className={`text-text-default text-m`}>
                    <SharedLanguageSwitchRenderer
                      language={language}
                      value={item.value}
                      value_ar={item.value || item.value_ar}
                    />
                  </Text>
                </Container>
              ))}
            </Container>

            <Container className="w-1/2 rounded-xs flex flex-row items-stretch">
              {!isImagePending &&
                imageUrl &&
                (platform === "web" ? (
                  <img
                    src={imageUrl}
                    alt=""
                    className="w-full h-50 object-contain rounded-xs"
                  />
                ) : null)}
            </Container>
          </Container>

          {plotBottomDetails?.map((item, idx) => (
            <Container
              key={idx}
              className={`flex flex-row pb-s mb-s border-b border-border-dimmed last:border-b-none text-text-default`}
            >
              <Container className="w-[40%]">
                <Text className="text-bold-m">
                  <SharedLanguageSwitchRenderer
                    language={language}
                    value={item.label}
                    value_ar={item.label_ar || item.label}
                  />
                </Text>
              </Container>
              <Container className="flex-1">
                <Text className="text-m">
                  <SharedLanguageSwitchRenderer
                    language={language}
                    value={item.value}
                    value_ar={item.value || item.value_ar}
                  />
                </Text>
              </Container>
            </Container>
          ))}
        </Container>
      </Container>

      {/* Owner Section */}
      {showOwnerDetails && (plotDetail?.ownersList || staticOwner) && (
        <Container className={`flex flex-col gap-xxs mb-xl text-text-default`}>
          <Container className="flex flex-row items-center justify-between">
            <Text className="text-bold-m">
              <SharedLanguageSwitchRenderer
                language={language}
                value={ownerText}
                value_ar={ownerText_ar}
              />
            </Text>
            {/* <Buttons
              size="m"
              title={"View"}
              title_ar={"منظر"}
              onClick={() => {}}
              type="secondary"
              language={language}
            /> */}
          </Container>

          <Container
            className={`py-m px-l bg-cards-base-l2 border border-cards-stroke rounded-xs mb-xl`}
          >
            <Text className="text-heading-h3 pb-s mb-s">
              <SharedLanguageSwitchRenderer
                language={language}
                value={ownerName}
                value_ar={"طلال أحمد سالم"}
              />
            </Text>
            {ownerDetails?.map(({ label, label_ar, value, value_ar }, idx) => (
              <Container
                key={idx}
                className="flex flex-row pb-s mb-s border-b border-text-dimmed"
              >
                <Text className="w-[40%] text-bold-m">
                  <SharedLanguageSwitchRenderer
                    language={language}
                    value={label}
                    value_ar={label_ar || label}
                  />
                </Text>
                <Text className="w-[55%] text-m">
                  <SharedLanguageSwitchRenderer
                    language={language}
                    value={value}
                    value_ar={value_ar || value}
                  />
                </Text>
              </Container>
            ))}
          </Container>
        </Container>
      )}
    </Container>
  );
};

const ViewPlotDetail: React.FC<ViewPlotDetailProps> = ({
  plotIds = [],
  plotTitle = "",
  plotTitle_ar,
  language = "en",
  theme = "dark",
  ownerText = "Owner",
  ownerText_ar = "المالك",
  plotLeftDetails: staticPlotLeftDetails = [],
  plotBottomDetails: staticPlotBottomDetails = [],
  owner: staticOwner,
  showOwnerDetails = true,
}) => {
  // Fetch all plots using the updated hook
  const plotDetailsResult = useGetPlotDetail(plotIds);
  const plotDetails = Array.isArray(plotDetailsResult.data)
    ? plotDetailsResult.data
    : plotDetailsResult.data
    ? [plotDetailsResult.data]
    : [];
  const isDetailPending = plotDetailsResult.isPending;

  return (
    <Container className="flex flex-col w-full">
      {isDetailPending && (
        <Container className="h-full flex flex-row items-center justify-center text-text-default text-m font-bold">
          <Text>
            <SharedLanguageSwitchRenderer
              language={language}
              value={"Loading..."}
              value_ar={"جارٍ التحميل"}
            />
          </Text>
        </Container>
      )}
      <Container
        className="w-full"
        style={{ direction: language === "ar" ? "rtl" : "ltr" }}
      >
        {plotDetails.length === 0 && !isDetailPending && (
          <Container className="h-full flex flex-row items-center justify-center text-text-default text-m font-bold">
            <Text>
              <SharedLanguageSwitchRenderer
                language={language}
                value={"No plots found"}
                value_ar={"لم يتم العثور على قطع"}
              />
            </Text>
          </Container>
        )}
        {plotDetails.map((plotDetail: PlotDetailResponse, index: number) => (
          <SinglePlotDetail
            key={index}
            plotDetail={plotDetail}
            plotTitle={plotTitle}
            plotTitle_ar={plotTitle_ar}
            plotLeftDetails={staticPlotLeftDetails}
            plotBottomDetails={staticPlotBottomDetails}
            owner={staticOwner}
            language={language}
            theme={theme}
            ownerText={ownerText}
            ownerText_ar={ownerText_ar}
            showOwnerDetails={showOwnerDetails}
          />
        ))}
      </Container>
    </Container>
  );
};

export default ViewPlotDetail;
