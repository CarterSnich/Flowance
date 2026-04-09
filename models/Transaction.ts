export interface Transaction {
  walletID: number;
  date: Date;
  amount: number;
  note: string;
  balanceBefore: number;
}
