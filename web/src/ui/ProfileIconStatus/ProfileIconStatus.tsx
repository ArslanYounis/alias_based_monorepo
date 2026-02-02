import React from "react";
import AwaySvg from "@/assets/svg/statusSvg/Away";
import ArrowSvg from "@/assets/svg/statusSvg/Arrow";
import OnlineSvg from "@/assets/svg/statusSvg/Online";
import FailedSvg from "@/assets/svg/statusSvg/failed";

type StatusType = "inProgress" | "complete" | "failed" | "pending";

interface ProfileIconStatusProps {
  status?: StatusType;
  width?: number | string;
  height?: number | string;
}

export const ProfileIconStatus: React.FC<ProfileIconStatusProps> = ({
  status,
  width = 18,
  height = 18,
}) => {
  const renderIcon = () => {
    switch (status) {
      case "pending":
        return <AwaySvg width={width} height={height} />;
      case "inProgress":
        return <ArrowSvg width={width} height={height} />;
      case "complete":
        return <OnlineSvg width={width} height={height} />;
      case "failed":
        return <FailedSvg width={width} height={height} />;
      default:
        return null;
    }
  };

  return (
    <div
      style={{
        width,
        height,
        borderRadius: "50%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {renderIcon()}
    </div>
  );
};
