import React, { useState, useEffect } from "react";
import { Container } from "@platform/Container";
import GenericCard from "../GenericCard";
import type { ButtonType } from "../CardTitle";
import type { ICardRowProps } from "../CardRow";

export interface Owner {
  ownerId: string;
  ownerArgs: string;
  name: string;
  name_ar?: string;
  fields: ICardRowProps[];
}

export interface IOwnerCardProps {
  owners: Owner[];
  title: string;
  title_ar?: string;
  showViewButton?: boolean;
  showPlotsButton?: boolean;
  showEditButton?: boolean;
  showDeleteButton?: boolean;
  showChangeOwnerButton?: boolean;
  onPressAction?: (params: {
    action: "view" | "plot" | "edit" | "delete";
    owner: Owner;
  }) => void;
  language?: "en" | "ar";
  itemsPerRow?: "1" | "2";
  defaultShowMore?: boolean;
  isExpandable?: boolean;
  platform?: "web" | "mobile";
}

const OwnerCard: React.FC<IOwnerCardProps> = ({
  owners,
  title,
  title_ar = "",
  showViewButton = true,
  showPlotsButton = true,
  showEditButton = true,
  showDeleteButton = false,
  isExpandable = true,
  onPressAction = () => {},
  language = "en",
  itemsPerRow = "1",
  defaultShowMore = false,
  platform,
}) => {
  const [expandedIndices, setExpandedIndices] = useState<number[]>(
    owners?.map((_, idx) => idx) ?? []
  );

  useEffect(() => {
    if (owners?.length) {
      const newIndices = owners.map((_, idx) => idx);
      setExpandedIndices((prev) => {
        const added = newIndices.filter((idx) => !prev.includes(idx));
        return added.length ? [...prev, ...added] : prev;
      });
    }
  }, [owners]);

  const handleAction = (
    action: "view" | "plot" | "edit" | "delete",
    owner: Owner
  ) => {
    onPressAction({ action, owner });
  };

  const toggleExpand = (index: number) => {
    setExpandedIndices((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const showButton =
    showViewButton || showPlotsButton || showEditButton || showDeleteButton;

  return (
    <Container className="w-full flex flex-col shrink-0">
      <Container
        className={`grid gap-8 ${
          itemsPerRow === "2" ? "grid-cols-2" : "grid-cols-1"
        }`}
        style={itemsPerRow === "2" ? { gridAutoFlow: "dense" } : undefined}
      >
        {owners?.map((owner, idx) => {
          const isExpanded = expandedIndices.includes(idx);
          const buttons: ButtonType[] = [
            ...(showViewButton
              ? [
                  {
                    title: "View",
                    title_ar: "المشاهدة",
                    onClick: () => handleAction("view", owner),
                  },
                ]
              : []),
            ...(showPlotsButton
              ? [
                  {
                    title: "Plots",
                    title_ar: "قطعة الأرض",
                    onClick: () => handleAction("plot", owner),
                  },
                ]
              : []),
            ...(showEditButton
              ? [
                  {
                    title: "Edit",
                    title_ar: "تعديل",
                    onClick: () => handleAction("edit", owner),
                  },
                ]
              : []),
            ...(showDeleteButton
              ? [
                  {
                    title: "Delete",
                    title_ar: "حذف",
                    type: "delete" as ButtonType["type"],
                    onClick: () => handleAction("delete", owner),
                  },
                ]
              : []),
          ];
          return (
            <GenericCard
              key={idx}
              title={title}
              title_ar={title_ar}
              variant="small"
              cardTitleValue={owner.name}
              cardTitleValue_ar={owner.name_ar ?? owner.name}
              cardTitleLabel="Name"
              cardTitleLabel_ar="الاسم"
              rowsData={owner.fields}
              language={language}
              showTitleSection={isExpandable}
              isExpanded={isExpanded}
              onToggleExpand={() => toggleExpand(idx)}
              showMoreButton={owner.fields.length > 3}
              showButtons={showButton}
              buttons={showButton ? buttons : []}
              showBorder
              defaultShowMore={defaultShowMore}
              platform={platform}
            />
          );
        })}
      </Container>
    </Container>
  );
};

export default OwnerCard;
