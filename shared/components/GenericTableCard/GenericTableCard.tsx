import React from "react";
import { Container } from "@platform/Container";
import { CardTitle } from "@shared/components/CardTitle";
import { Typography } from "@platform/Typography";
import { Pagination } from "@platform/Pagination";

export interface ColumnItem {
  key: string;
  label?: string;
  label_ar?: string;
}

export interface RowDataItem {
  label?: string;
  label_ar?: string;
  extraItems?: { label?: string; label_ar?: string; value?: string; value_ar?: string }[];
}

export interface GenericTableCardProps {
  showTitleSection?: boolean;
  isExpandable?: boolean;
  isExpanded?: boolean;
  showButtons?: boolean;
  defaultShowMore?: boolean;
  variant?: string;
  showRowButtons?: boolean;
  rowVariant?: string;
  title?: string;
  title_ar?: string;
  description?: string;
  description_ar?: string;
  cardTitleLabel?: string;
  cardTitleLabel_ar?: string;
  cardTitleValue?: string;
  cardTitleValue_ar?: string;
  buttons?: unknown[];
  titleButtons?: unknown[];
  columnsData?: ColumnItem[];
  rowsData?: RowDataItem[];
  showFooterButtons?: boolean;
  footerButton?: unknown[];
  showPagination?: boolean;
  handlePaginationInternally?: boolean;
  currentPage?: number;
  totalPages?: number;
  pageSize?: number;
  onToggleExpand?: () => void;
  onPageChange?: (page: number) => void;
  language?: "en" | "ar";
}

export const GenericTableCard: React.FC<GenericTableCardProps> = ({
  showTitleSection = true,
  title = "Owner Information",
  title_ar = "معلومات المالك",
  cardTitleLabel = "Name",
  cardTitleLabel_ar = "الاسم",
  cardTitleValue = "Talal Ahmed Salem",
  cardTitleValue_ar = "طلال أحمد سالم",
  columnsData = [],
  rowsData = [],
  showPagination = true,
  currentPage = 1,
  totalPages = 5,
  onPageChange,
  language = "en",
}) => {
  return (
    <Container>
      {showTitleSection && (
        <CardTitle
          title={cardTitleValue || title ?? ""}
          title_ar={cardTitleValue_ar || title_ar || title ?? ""}
          language={language}
        />
      )}
      {columnsData.length > 0 && (
        <Container>
          {columnsData.map((col, idx) => (
          <Typography
            key={idx}
            variant="text-bold-sm"
            text={col.label ?? ""}
            text_ar={col.label_ar || col.label ?? ""}
            language={language}
          />
          ))}
        </Container>
      )}
      {rowsData.map((row, idx) => (
        <Container key={idx}>
          <Typography
            variant="text-md"
            text={row.label ?? ""}
            text_ar={row.label_ar || row.label ?? ""}
            language={language}
          />
          {row.extraItems?.map((item, i) => (
            <Typography
              key={i}
              variant="text-sm"
              text={item.value ?? ""}
              text_ar={item.value_ar || item.value ?? ""}
              language={language}
            />
          ))}
        </Container>
      ))}
      {showPagination && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          pageSize={pageSize ?? 5}
          onPageChange={onPageChange ?? (() => {})}
          language={language}
        />
      )}
    </Container>
  );
};

export default GenericTableCard;
