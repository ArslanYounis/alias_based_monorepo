import React from "react";
import { GenericCard } from "@shared/components/GenericCard";
import { Buttons } from "@platform/Buttons";

export interface PlotCardProps {
  title?: string;
  title_ar?: string;
  showViewButton?: boolean;
  showOwnersButton?: boolean;
  showChangePlotButton?: boolean;
  plots?: { plotNumber?: string; fields?: { label?: string; value?: string }[] }[];
  defaultShowMore?: boolean;
  onPressView?: (eventData: unknown) => void;
  onPressPlotChange?: (eventData: unknown) => void;
  onPressOwners?: (eventData: unknown) => void;
  language?: "en" | "ar";
}

export const PlotCard: React.FC<PlotCardProps> = ({
  title = "Plot",
  title_ar = "Plot",
  plots = [],
  showViewButton = false,
  showOwnersButton = false,
  showChangePlotButton = false,
  onPressView,
  onPressPlotChange,
  onPressOwners,
  language = "en",
}) => {
  return (
    <>
      {plots.map((plot, idx) => (
        <GenericCard
          key={idx}
          title={plot.plotNumber ?? title}
          title_ar={title_ar}
          rowsData={
            plot.fields?.map((f) => ({
              label: f.label,
              value: f.value,
            })) ?? []
          }
          language={language}
          showButtons={showViewButton || showOwnersButton || showChangePlotButton}
          buttons={[
            ...(showViewButton ? [{ title: "View", onClick: () => onPressView?.(plot) }] : []),
            ...(showOwnersButton ? [{ title: "Owners", onClick: () => onPressOwners?.(plot) }] : []),
            ...(showChangePlotButton ? [{ title: "Change Plot", onClick: () => onPressPlotChange?.(plot) }] : []),
          ]}
        />
      ))}
    </>
  );
};

export default PlotCard;
