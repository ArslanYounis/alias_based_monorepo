import React from "react";
import { some } from "lodash";
import { Container } from "@platform/Container";
import { Text } from "@platform/Text";
import { Radio } from "@platform/Radio";
import { Buttons } from "@platform/Buttons";
import { CustomDrawer } from "@platform/CustomDrawer";
import SharedLanguageSwitchRenderer from "../SharedLanguageSwitchRenderer";
import ViewPlotDetail from "../ViewPlotDetail/ViewPlotDetail";

export interface IOwnerPlotsSearchResult {
  id?: string;
  plotId?: string | number;
  communityName?: string;
  districtname?: string;
  landuseName?: string;
}

interface SearchOwnerPlotsResultProps {
  plotArgs?: string;
  plots?: IOwnerPlotsSearchResult[];
  isLoading: boolean;
  language: "en" | "ar";
  onCloseDrawer?: () => void;
  selectedPlots?: IOwnerPlotsSearchResult[];
  onSelectPlot?: (plot: IOwnerPlotsSearchResult) => void;
  onSubmit?: (plot: IOwnerPlotsSearchResult) => void;
}

const SearchOwnerPlotsResult: React.FC<SearchOwnerPlotsResultProps> = ({
  plots = [],
  isLoading,
  language,
  selectedPlots = [],
  onSelectPlot,
  onSubmit,
  onCloseDrawer,
}) => {
  const [isDetailsDrawerOpen, setIsDetailsDrawerOpen] = React.useState(false);
  const [selectedPlotForDetails, setSelectedPlotForDetails] =
    React.useState<IOwnerPlotsSearchResult | null>(null);

  if (isLoading) {
    return (
      <Container className="flex items-center justify-center">
        <Text className="text-m text-text-dimmed">
          <SharedLanguageSwitchRenderer
            value="Loading..."
            value_ar="جارٍ التحميل..."
            language={language}
          />
        </Text>
      </Container>
    );
  }

  if (!plots.length) {
    return (
      <Container className="text-text-default text-center">
        <Text className="text-m text-text-dimmed">
          <SharedLanguageSwitchRenderer
            language={language}
            value="No plots found"
            value_ar="لم يتم العثور على قطع"
          />
        </Text>
      </Container>
    );
  }

  const handleSelectPlotSubmit = () => {
    const selectedPlot = selectedPlots?.[0];
    if (!selectedPlot?.plotId) return;
    if (onSubmit) {
      onSubmit?.(selectedPlot);
      onCloseDrawer?.();
    }
  };

  return (
    <>
      <Container className="flex flex-col gap-s">
        <Text className={`text-heading-h1 font-bold pb-xl text-text-default`}>
          <SharedLanguageSwitchRenderer
            language={language}
            value="Select Plot"
            value_ar="اختر القطعة"
          />
        </Text>
        {plots?.map((plot) => {
          const isSelected = some(selectedPlots, (p) => p.plotId === plot.plotId);

          return (
            <Container
              key={String(plot.plotId)}
              className={`mb-m rounded-xs px-l py-m w-full min-h-[136px] flex flex-col justify-between cursor-pointer border border-cards-stroke ${
                isSelected
                  ? "bg-cards-searchResult-selected"
                  : "bg-cards-searchResult"
              }`}
              onClick={() => onSelectPlot?.(plot)}
            >
              <Container className="flex justify-between mb-s">
                <Text className="text-bold-l text-text-default line-clamp-2 min-w-0 flex-1 me-xxs">
                  <SharedLanguageSwitchRenderer
                    language={language}
                    value={plot.communityName}
                    value_ar={plot.communityName}
                  />
                </Text>
                <Container className="flex items-center gap-m shrink-0">
                  <Buttons
                    title="Details"
                    title_ar="التفاصيل"
                    size="s"
                    type="secondary"
                    language={language}
                    onClick={() => {
                      setSelectedPlotForDetails(plot);
                      setIsDetailsDrawerOpen(true);
                    }}
                  />
                  <Radio
                    id={String(plot.plotId ?? "")}
                    checked={isSelected}
                    onChange={() => onSelectPlot?.(plot)}
                  />
                </Container>
              </Container>

              {[
                {
                  label: "District Name",
                  label_ar: "المنطقة",
                  value: plot.districtname,
                  value_ar: plot.districtname,
                },
                {
                  label: "Land Use",
                  label_ar: "استخدام الأرض",
                  value: plot.landuseName,
                  value_ar: plot.landuseName,
                },
              ].map(({ label, label_ar, value, value_ar }, index, array) => (
                <Container
                  key={label}
                  className={`flex ${
                    index !== array.length - 1
                      ? "border-b pb-xs border-text-dimmed mb-xs"
                      : ""
                  }`}
                >
                  <Container className="sm:w-1/2 w-full">
                    <Text className="text-bold-m text-text-default">
                      <SharedLanguageSwitchRenderer
                        language={language}
                        value={label}
                        value_ar={label_ar}
                      />
                    </Text>
                  </Container>
                  <Container className="sm:w-1/2 w-full">
                    <Text className="text-m break-words text-text-default">
                      <SharedLanguageSwitchRenderer
                        language={language}
                        value={value || ""}
                        value_ar={value_ar || value}
                      />
                    </Text>
                  </Container>
                </Container>
              ))}
            </Container>
          );
        })}
        <Container className="flex justify-between items-start">
          <Buttons
            title="Select Plot"
            title_ar="اختر القطعة"
            disabled={!selectedPlots?.length}
            size="l"
            onClick={handleSelectPlotSubmit}
            language={language}
          />
        </Container>
      </Container>

      <CustomDrawer
        size="layer3"
        language={language}
        open={isDetailsDrawerOpen}
        onOpenChange={setIsDetailsDrawerOpen}
      >
        {selectedPlotForDetails?.plotId && (
          <ViewPlotDetail
            language={language}
            plotIds={[String(selectedPlotForDetails.plotId)]}
          />
        )}
      </CustomDrawer>
    </>
  );
};

export default SearchOwnerPlotsResult;
