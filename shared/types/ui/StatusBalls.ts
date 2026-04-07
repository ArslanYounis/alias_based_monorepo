export interface StatusBallsProps {
  status?: "pending" | "inProgress" | "complete" | "fixed" | "failed" | "mixed";
  width?: number | string;
  height?: number | string;
}
