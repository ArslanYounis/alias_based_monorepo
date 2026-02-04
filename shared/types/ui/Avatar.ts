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
