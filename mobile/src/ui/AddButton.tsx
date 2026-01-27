import { TouchableOpacity, View } from "react-native";
import PlusIcon from "~/assets/svg/icons/Plus";

export interface AddButtonProps {
  disabled?: boolean;
  onPress?: () => void;
}

export const AddButton = ({
  disabled = false,
  onPress = () => null,
}: AddButtonProps) => {
  const borderClass = disabled
    ? "border-button-primary-disabled cursor-not-allowed"
    : "border-button-primary-default-bg cursor-pointer";

  const iconClass = disabled
    ? "text-button-primary-disabled"
    : "text-button-primary-default-bg";

  return (
    <View>
      <TouchableOpacity
        onPress={onPress}
        disabled={disabled}
        className={`flex items-center justify-center rounded-xs gap-sm py-xs px-l w-[66px] h-[50px] border ${borderClass}`}
      >
        {/* color needs to apply here */}
        <PlusIcon width={18} height={18} />
      </TouchableOpacity>
    </View>
  );
};
