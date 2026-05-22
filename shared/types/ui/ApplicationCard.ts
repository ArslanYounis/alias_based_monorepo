export interface ApplicationCardProps {
  onClick?: () => void;
  totalDots?: number;
  cardsData: {
    id: string;
    title: string;
    location: string;
    date: string;
    stage: { complete: number; approval: number; inprogress: number };
    remaining: string;
  };
}
