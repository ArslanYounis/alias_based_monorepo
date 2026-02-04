import type { IconButtonProps } from "@shared/types";
import React from "react";

export type { IconButtonProps };

export const IconButton = ({ icon }: IconButtonProps) => (
  <button className="text-black text-xl">{icon}</button>
);
