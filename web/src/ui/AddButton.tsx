import { Plus } from "lucide-react";

export interface AddButtonProps {
  disabled?: boolean;
  onClick?: () => void;
}

export const AddButton = ({
  disabled = false,
  onClick = () => null,
}: AddButtonProps) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      type="button"
      className={`flex items-center justify-center rounded-xs gap-sm py-xs px-l w-[66px] h-[50px] border ${
        disabled
          ? "cursor-not-allowed border-button-primary-disabled"
          : "cursor-pointer border-button-primary-default-bg"
      }`}
    >
      <Plus
        width={18}
        height={18}
        className={`${
          disabled
            ? "text-button-primary-disabled"
            : "text-button-primary-default-bg"
        }`}
      />
    </button>
  );
};
