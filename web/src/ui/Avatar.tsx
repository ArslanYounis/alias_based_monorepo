import React from "react";
import { ProfileIconStatus } from "./ProfileIconStatus";

export type StatusType = "inProgress" | "complete" | "failed" | "pending";

export interface AvatarProps {
  imageUrl?: string;
  initials?: string;
  status?: StatusType;
  avatarSize?: number;
  badgeSize?: number;
  initialsFontSize?: number;
  initialsTextColor?: string;
  initialsBorderColor?: string;
}

export const Avatar: React.FC<AvatarProps> = ({
  imageUrl,
  initials,
  status,
  avatarSize = 32,
  badgeSize = 13.5,
  initialsFontSize = 12,
  initialsTextColor = "#12121B",
  initialsBorderColor = "#A0A0A4",
}) => {
  const isImage = !!imageUrl && imageUrl.trim() !== "";
  const hasInitials = !!initials && initials.trim() !== "";

  // Only show border if no image and initials are present
  const showBorder = !isImage && hasInitials;

  const avatarStyle: React.CSSProperties = {
    width: `${avatarSize}px`,
    height: `${avatarSize}px`,
    borderRadius: "50%",
    overflow: "hidden",
    backgroundColor: isImage ? "white" : "#fff",
    border: showBorder ? `1px solid ${initialsBorderColor}` : "none",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontWeight: 500,
    fontSize: `${initialsFontSize}px`,
    color: initialsTextColor,
    position: "relative",
  };

  return (
    <div className="relative inline-block">
      <div style={avatarStyle}>
        {isImage ? (
          <img src={imageUrl} alt="avatar" />
        ) : hasInitials ? (
          <span
            style={{
              fontSize: `${initialsFontSize}px`,
              color: initialsTextColor,
            }}
          >
            {initials.slice(0, 2).toUpperCase()}
          </span>
        ) : (
          <img
            src="https://adrec-images.mastermind-mindset.com/DefaultImg.png"
            alt="Placeholder Image"
          />
        )}
      </div>
      {status && (
        <div
          style={{
            position: "absolute",
            bottom: -2,
            right: -3,
            width: badgeSize,
            height: badgeSize,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: "50%",
            padding: 0,
          }}
        >
          <ProfileIconStatus
            status={status}
            width={badgeSize}
            height={badgeSize}
          />
        </div>
      )}
    </div>
  );
};
