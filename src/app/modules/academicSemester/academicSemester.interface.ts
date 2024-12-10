export type TMonth =
  | 'January'
  | 'February'
  | 'March'
  | 'April'
  | 'May'
  | 'June'
  | 'July'
  | 'August'
  | 'September'
  | 'October'
  | 'November'
  | 'December';

export type TSemester = {
  _id: string;
  name: string;
  year: Date;
  code: number;
  startMonth: TMonth;
  endMonth: TMonth;
};
