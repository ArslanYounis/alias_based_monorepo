import type { IconButtonProps } from "@shared/types";

export type { IconButtonProps };

export const IconButton = ({ icon }: IconButtonProps) => (
  <button className="text-black text-xl">{icon}</button>
);
