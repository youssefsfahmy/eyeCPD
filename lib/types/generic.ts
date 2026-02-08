export interface CPDCycle {
  startDate: Date;
  endDate: Date;
  label: string;
  value: string;
  isCurrent: boolean;
  year: string; // Year field for easier filtering
}
