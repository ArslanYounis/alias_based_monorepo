import type { IconButtonProps } from "@shared/types";
import React from "react";

export type { IconButtonProps };

export const IconButton = ({ icon }: IconButtonProps) => (
  <button className="text-text-default text-l">{icon}</button>
);
