export interface InputProps {
  label?: string;
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  disabled?: boolean;
  hasError?: boolean;
  errorMessage?: string;
  required?: boolean;
  icon?: React.ReactNode;
  showInfoIcon?: boolean
  showAssistiveText?: boolean
  assistiveText?: string
  trailingIcon?: React.ReactNode
  EnableTrailingIcon?: boolean
  size?: 'small' | 'medium' | 'large';
  hasSuccess: boolean
  successMessage: string
  dir?: string
}

export interface TypographyProps {
  variant?: "h1" | "h2" | "h3" | "h4" | "body1" | "body2" | "caption";
  weight?: "light" | "regular" | "medium" | "semibold" | "bold";
  style?: "normal" | "italic";
  color?: string;
  family?: string;
  className?: string;
  children: React.ReactNode;
}

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  showPageNumbers?: boolean;
  maxVisiblePages?: number;
}
