import React from "react";
import { Container } from "@platform/Container";
import { Typography } from "@platform/Typography";

export interface ColumnDefinition {
  header: string;
  header_ar?: string;
  accessorKey: string;
}

export interface ApplicationTableProps {
  data?: unknown[];
  columns?: ColumnDefinition[];
  language?: "en" | "ar";
}

export const Table: React.FC<ApplicationTableProps> = ({
  data = [],
  columns = [],
  language = "en",
}) => {
  return (
    <Container>
      {columns.length > 0 && (
        <Container>
          {columns.map((col, idx) => (
            <Typography
              key={idx}
              variant="text-bold-md"
              text={col.header}
              text_ar={col.header_ar || col.header}
              language={language}
            />
          ))}
        </Container>
      )}
      {Array.isArray(data) && data.map((row: unknown, idx: number) => (
        <Container key={idx}>
          <Typography variant="text-md" text={JSON.stringify(row)} language={language} />
        </Container>
      ))}
    </Container>
  );
};

export default Table;
