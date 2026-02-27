import React, { useState } from "react";
import { Container } from "@platform/Container";
import type { ICardRowProps } from "../CardRow";
import GenericCard from "../GenericCard";

export interface Plot {
  plotId: string;
  plotArgs: string;
  plotNumber: string;
  plotNumber_ar?: string;
  fields: { label: string; label_ar?: string; value: string; value_ar?: string }[];
}

export interface IPlotCardProps {
  plots: Plot[];
  title: string;
  title_ar?: string;
  showViewButton?: boolean;
  showChangePlotButton?: boolean;
  showOwnersButton?: boolean;
  onPressView?: (val: Plot) => void;
  onPressPlotChange?: (val: Plot) => void;
  onPressOwners?: (val: Plot) => void;
  language?: "en" | "ar";
  defaultShowMore?: boolean;
  defaultExpanded?: boolean;
}

const PlotCard: React.FC<IPlotCardProps> = ({
  plots,
  title,
  title_ar = "",
  showViewButton = true,
  onPressView = () => {},
  showChangePlotButton = false,
  onPressPlotChange = () => {},
  showOwnersButton = false,
  onPressOwners = () => {},
  language = "en",
  defaultShowMore = false,
  defaultExpanded = true,
}) => {
  const [expandedIndices, setExpandedIndices] = useState<number[]>(
    defaultExpanded ? plots?.map((_, idx) => idx) ?? [] : []
  );

  const toggleExpand = (index: number) => {
    setExpandedIndices((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const mapFieldsToRows = (plot: Plot): ICardRowProps[] =>
    (plot.fields || []).map((f) => ({
      label: f.label,
      label_ar: f.label_ar,
      value: f.value,
      value_ar: f.value_ar,
    }));

  const handleAction = (action: "view" | "change_plot" | "owners", plot: Plot) => {
    if (action === "view") onPressView(plot);
    else if (action === "change_plot") onPressPlotChange(plot);
    else if (action === "owners") onPressOwners(plot);
  };

  return (
    <Container className="w-full flex flex-col shrink-0">
      <Container>
        {plots?.map((plot, idx) => {
          const isExpanded = expandedIndices.includes(idx);
          const rowButtons = [
            ...(showChangePlotButton
              ? [{ title: "Change Plot", title_ar: "تغيير القطعة", onClick: () => handleAction("change_plot", plot) }]
              : []),
            ...(showOwnersButton
              ? [{ title: "Owners", title_ar: "أصحاب", onClick: () => handleAction("owners", plot) }]
              : []),
            ...(showViewButton
              ? [{ title: "View", title_ar: "عرض", onClick: () => handleAction("view", plot) }]
              : []),
          ];
          return (
            <Container key={plot.plotId ?? `${plot.plotNumber}-${idx}`}>
              <GenericCard
                showTitleSection
                title={title}
                title_ar={title_ar ?? title}
                cardTitleLabel={isExpanded ? title : "Plot Number"}
                cardTitleLabel_ar={isExpanded ? title_ar ?? title : "رقم القطعة"}
                cardTitleValue={plot.plotNumber}
                cardTitleValue_ar={plot.plotNumber_ar ?? plot.plotNumber}
                variant="small"
                isExpandable
                isExpanded={isExpanded}
                onToggleExpand={() => toggleExpand(idx)}
                subText={undefined}
                subText_ar={undefined}
                showBorder={false}
                showButtons
                buttons={rowButtons}
                language={language}
                showMoreButton={mapFieldsToRows(plot).length > 3}
                rowsData={mapFieldsToRows(plot)}
                defaultShowMore={defaultShowMore}
              />
            </Container>
          );
        })}
      </Container>
    </Container>
  );
};

export default PlotCard;
