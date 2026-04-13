export interface ApplicationCardProps {
  onClick?: () => void;
  totalDots?: number;
  language?: "en" | "ar";
  cardsData: {
    id: string;
    title?: string;
    location?: string;
    date?: string;
    stage: { complete: number; approval: number; inprogress: number };
    remaining: string;
  };
}
