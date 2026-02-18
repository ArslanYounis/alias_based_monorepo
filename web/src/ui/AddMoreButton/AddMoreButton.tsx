import React from "react";
import type { AddMoreButtonProps } from "@shared/types";
import { Plus } from "lucide-react";
import SharedLanguageSwitchRenderer from "@/components/shared/SharedLanguageSwitchRenderer";

export type { AddMoreButtonProps };

const AddMoreButton: React.FC<AddMoreButtonProps> = ({
  title = "",
  title_ar = "",
  language = "en",
  onClick = () => {},
  plusIcon = <Plus size={18} />,
}) => {
  return (
    <div className="flex flex-1 items-center gap-s">
      <div
        className={`w-full h-12 flex items-center px-4 font-bold text-base rounded-[5px] cursor-pointer bg-form-fields-file-upload-default
            focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2
            focus-within:ring-form-fields-file-upload-uploaded
          `}
        onClick={onClick}
      >
        <div className="mr-2 text-m text-text-default">{plusIcon}</div>
        <div className="flex-grow text-m font-normal text-text-default">
          <SharedLanguageSwitchRenderer
            language={language}
            value={title}
            value_ar={title_ar || title}
          />
        </div>
      </div>
    </div>
  );
};

export default AddMoreButton;
