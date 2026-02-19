import React from "react";
import { GenericCard } from "@shared/components/GenericCard";
import { Buttons } from "@platform/Buttons";

export interface OwnerCardProps {
  title?: string;
  title_ar?: string;
  isExpandable?: boolean;
  showViewButton?: boolean;
  showPlotsButton?: boolean;
  showEditButton?: boolean;
  showDeleteButton?: boolean;
  itemsPerRow?: string;
  owners?: { name?: string; fields?: { label?: string; value?: string; label_ar?: string; value_ar?: string }[] }[];
  defaultShowMore?: boolean;
  onPressAction?: (eventData: unknown) => void;
  language?: "en" | "ar";
}

export const OwnerCard: React.FC<OwnerCardProps> = ({
  title = "Owner",
  title_ar = "Owner",
  owners = [],
  isExpandable = true,
  showViewButton = false,
  showPlotsButton = false,
  showEditButton = false,
  showDeleteButton = false,
  onPressAction,
  language = "en",
}) => {
  return (
    <>
      {owners.map((owner, idx) => (
        <GenericCard
          key={idx}
          title={owner.name ?? title}
          title_ar={title_ar}
          rowsData={
            owner.fields?.map((f) => ({
              label: f.label,
              label_ar: f.label_ar,
              value: f.value,
              value_ar: f.value_ar,
            })) ?? []
          }
          isExpandable={isExpandable}
          language={language}
          showButtons={showViewButton || showPlotsButton || showEditButton || showDeleteButton}
          buttons={[
            ...(showViewButton ? [{ title: "View", onClick: () => onPressAction?.(owner) }] : []),
            ...(showPlotsButton ? [{ title: "Plots", onClick: () => onPressAction?.(owner) }] : []),
            ...(showEditButton ? [{ title: "Edit", onClick: () => onPressAction?.(owner) }] : []),
            ...(showDeleteButton ? [{ title: "Delete", onClick: () => onPressAction?.(owner) }] : []),
          ]}
        />
      ))}
    </>
  );
};

export default OwnerCard;
