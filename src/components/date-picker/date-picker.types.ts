export type DateRange = {
  start: Date | undefined;
  end: Date | undefined;
};

export type Props = {
  label: string;
  placeholder: string;
  dates: DateRange;
  setDates: (v: DateRange) => void;
  clearable?: boolean;
};
