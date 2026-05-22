import React, { useState, useEffect } from "react";
import { Container } from "@platform/Container";
import GenericCard from "../GenericCard";
import type { ButtonType } from "../CardTitle";
import type { ICardRowProps } from "../CardRow";
import CardTitle from "../CardTitle";

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
    action: "view" | "plot" | "edit" | "delete" | "changeOwner";
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
  showChangeOwnerButton = false,
  isExpandable = true,
  onPressAction = () => {},
  language = "en",
  itemsPerRow = "1",
  defaultShowMore = false,
  platform,
}) => {
  const [expandedIndices, setExpandedIndices] = useState<number[]>(
    owners?.map((_, idx) => idx) ?? [],
  );

  // Effect to expand newly added owners
  useEffect(() => {
    if (owners && owners.length > 0) {
      const newIndices = owners.map((_, idx) => idx);
      setExpandedIndices((prev) => {
        // Find new indices that weren't previously expanded
        const newExpandedIndices = newIndices.filter(
          (idx) => !prev.includes(idx),
        );
        // If there are new owners, expand them along with existing expanded ones
        if (newExpandedIndices.length > 0) {
          return [...prev, ...newExpandedIndices];
        }
        return prev;
      });
    }
  }, [owners]); // Trigger when the owners array changes

  const handleAction = (
    action: "view" | "plot" | "edit" | "delete" | "changeOwner",
    owner: Owner,
  ) => {
    onPressAction({ action, owner });
  };

  const allExpanded =
    !!owners?.length && expandedIndices.length === owners.length;

  const toggleMaster = () => {
    if (!owners?.length) return;
    if (allExpanded) {
      setExpandedIndices([]);
    } else {
      setExpandedIndices(owners.map((_, idx) => idx));
    }
  };

  const toggleExpand = (index: number) => {
    setExpandedIndices((prev) => {
      if (prev.length === 0) {
        return [index];
      }
      return prev.includes(index)
        ? prev.filter((i) => i !== index)
        : [...prev, index];
    });
  };

  const showButton =
    showViewButton ||
    showPlotsButton ||
    showEditButton ||
    showDeleteButton ||
    showChangeOwnerButton;

  return (
    <Container className="w-full flex flex-col shrink-0">
      <Container
        className={`grid gap-xl ${
          itemsPerRow === "2" ? "grid-cols-2" : "grid-cols-1"
        }`}
        style={itemsPerRow === "2" ? { gridAutoFlow: "dense" } : undefined}
      >
        {isExpandable && owners && owners.length > 0 ? (
          <Container
            className={
              platform === "mobile"
                ? "w-full min-w-0 mb-[-15px]"
                : itemsPerRow === "2"
                ? "col-span-2 w-full min-w-0 mb-[-30px]"
                : "w-full min-w-0 mb-[-30px]"
            }
          >
            <CardTitle
              title={title}
              title_ar={title_ar}
              variant="small"
              isExpandable
              isExpanded={allExpanded}
              onToggleExpand={toggleMaster}
              language={language}
              showBorder={false}
            />
          </Container>
        ) : null}
        {owners?.map((owner, idx) => {
          const isExpanded = expandedIndices.includes(idx);
          const buttons: ButtonType[] = [
            ...(showViewButton
              ? [
                  {
                    title: "View",
                    title_ar: "المشاهدة",
                    onClick: () => handleAction("view", owner),
                    mobileIcon: {
                      iconName: "Eye",
                      iconColor: "#0066cc",
                      iconType: "lucide" as const,
                      iconWidth: 16,
                      iconHeight: 16,
                    },
                  },
                ]
              : []),
            ...(showPlotsButton
              ? [
                  {
                    title: "Plots",
                    title_ar: "قطعة الأرض",
                    onClick: () => handleAction("plot", owner),
                    mobileIcon: {
                      iconName: "MapPin",
                      iconColor: "#0066cc",
                      iconType: "lucide" as const,
                      iconWidth: 16,
                      iconHeight: 16,
                    },
                  },
                ]
              : []),
            ...(showEditButton
              ? [
                  {
                    title: "Edit",
                    title_ar: "تعديل",
                    onClick: () => handleAction("edit", owner),
                    mobileIcon: {
                      iconName: "Pencil",
                      iconColor: "#0066cc",
                      iconType: "lucide" as const,
                      iconWidth: 16,
                      iconHeight: 16,
                    },
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
                    mobileIcon: {
                      iconName: "Trash2",
                      iconColor: "#cc0000",
                      iconType: "lucide" as const,
                      iconWidth: 16,
                      iconHeight: 16,
                    },
                  },
                ]
              : []),
            ...(showChangeOwnerButton
              ? [
                  {
                    title: "Change Owner",
                    title_ar: "تغيير المالك",
                    mobileIcon: {
                      iconName: "UserRoundPen",
                      iconColor: "#0066cc",
                      iconType: "lucide" as const,
                      iconWidth: 16,
                      iconHeight: 16,
                    },
                    onClick: () => handleAction("changeOwner", owner),
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
              cardTitleLabel={owner?.name}
              cardTitleLabel_ar={owner?.name_ar || owner?.name}
              rowsData={owner?.fields}
              language={language}
              showTitleSection={false}
              handleToggleInternally={!isExpandable}
              isExpanded={isExpandable ? isExpanded : true}
              onToggleExpand={isExpandable ? () => toggleExpand(idx) : () => {}}
              showMoreButton={owner?.fields?.length > 3}
              showButtons={showButton}
              buttons={showButton ? buttons : []}
              showBorder={true}
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
