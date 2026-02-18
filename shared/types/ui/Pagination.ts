export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalCount?: number;
  onPageChange: (page: number) => void;
  showPageNumbers?: boolean;
  maxVisiblePages?: number;
  position?: "left" | "center" | "right";
  pageSize: number;
  language?: "en" | "ar";
  showBottomText?: boolean;
}
