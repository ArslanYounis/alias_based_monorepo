import React from "react";
import type { ContainerProps } from "@shared/types";

export const Container: React.FC<ContainerProps> = ({
  children,
  className = "",
  style,
  dir,
  onClick,
}) => {
  const containerClassName = `${className}`.trim();

  return (
    <div className={containerClassName} style={style} dir={dir} onClick={onClick} role={onClick ? "button" : undefined}>
      {children}
    </div>
  );
};
