import React from "react";

import type { StatusBallsProps } from "@shared/types";
export type { StatusBallsProps };

const statusConfig: Record<
  string,
  { background: string; icon?: React.ReactNode }
> = {
  pending: { background: "linear-gradient(209.97deg, #D0D0D14D 12.83%, #A0A0A44D 87.17%)" },
  inProgress: { background: "linear-gradient(29.97deg, #4DABF7 12.83%, #1971C2 87.17%)" },
  complete: { background: "linear-gradient(209.97deg, #2F9E44 12.83%, #8CE99A 87.17%)" },
  failed: { background: "linear-gradient(29.97deg, #F69EA1 12.83%, #EE3E43 87.17%)" },
};

export const StatusBalls: React.FC<StatusBallsProps> = ({
  status = "pending",
  width = 16,
  height = 16,
}) => {
  if (status === "fixed") {
    return (
      <span
        data-testid={`status-ball-${status}`}
        data-status={status}
        data-width={width}
        data-height={height}
        className="inline-flex items-center justify-center rounded-full"
        style={{
          background: "linear-gradient(209.97deg, #2F9E44 12.83%, #8CE99A 87.17%)",
          width,
          height,
        }}
      >
        <span
          style={{
            width: "50%",
            height: "50%",
            background: "linear-gradient(29.97deg, #F69EA1 12.83%, #EE3E43 87.17%)",
            borderRadius: "50%",
            border: "1px solid white",
          }}
        />
      </span>
    );
  }

  if (status === "mixed") {
    return (
      <span
        data-testid={`status-ball-${status}`}
        data-status={status}
        data-width={width}
        data-height={height}
        className="inline-flex rounded-full overflow-hidden"
        style={{ width, height }}
      >
        <span style={{ width: "50%", height: "100%", background: "linear-gradient(29.97deg, #F69EA1 12.83%, #EE3E43 87.17%)" }} />
        <span style={{ width: "50%", height: "100%", background: "linear-gradient(209.97deg, #2F9E44 12.83%, #8CE99A 87.17%)" }} />
      </span>
    );
  }

  const config = statusConfig[status] || statusConfig["pending"];
  return (
    <span
      data-testid={`status-ball-${status}`}
      data-status={status}
      data-width={width}
      data-height={height}
      className="inline-flex rounded-full"
      style={{
        background: config.background,
        width,
        height,
        minWidth: width,
        minHeight: height,
      }}
    >
      {config.icon}
    </span>
  );
};
