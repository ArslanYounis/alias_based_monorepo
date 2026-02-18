export interface CustomCheckboxProps {
  id: string;
  checked?: boolean;
  onChange?: (id: string, checked: boolean) => void;
  disabled?: boolean;
  hasError?: boolean;
}
