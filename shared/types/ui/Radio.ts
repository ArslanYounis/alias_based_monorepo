export interface RadioProps {
  id: string;
  name?: string;
  checked?: boolean;
  disabled?: boolean;
  hasError?: boolean;
  onChange?: (id: string, checked: boolean) => void;
  theme?: "light" | "dark";
}
