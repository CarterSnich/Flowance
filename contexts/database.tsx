import { Transaction } from "@/models/Transaction";
import { Wallet } from "@/models/Wallet";
import * as DB from "@/services/database";
import {
  SQLiteDatabase,
  SQLiteProvider,
  SQLiteProviderProps,
  openDatabaseSync,
} from "expo-sqlite";
import React, { createContext, useContext } from "react";

type DatabaseQuery = {
  db: SQLiteDatabase;
  getWallets: () => Promise<Wallet[]>;
  getWallet: (walletID: number) => Promise<Wallet | null>;
  createWallet: (name: string, balance: number) => Promise<number>;
  getTransactions: (
    walletID: number,
    sort?: "DESC" | "ASC",
    limit?: number
  ) => Promise<Transaction[]>;
  createTransaction: (
    date: Date,
    amount: number,
    note: string,
    walletID: number
  ) => Promise<void>;
};
type DatabaseProviderProps = SQLiteProviderProps & {};

const DatabaseContext = createContext<DatabaseQuery | null>(null);

function DatabaseProvider({ ...props }: DatabaseProviderProps) {
  const db = openDatabaseSync(props.databaseName);

  const foos: DatabaseQuery = {
    db,
    getWallets: async () => DB.getWallets(db),
    getWallet: async (walletID: number) => DB.getWallet(db, walletID),
    createWallet: async (name: string, balance: number) =>
      DB.createWallet(db, name, balance),
    getTransactions: async (walletID: number) =>
      DB.getTransactions(db, walletID),
    createTransaction: async (
      date: Date,
      amount: number,
      note: string,
      walletID: number
    ) => DB.createTransaction(db, date, amount, note, walletID),
  };

  return (
    <SQLiteProvider {...props}>
      <DatabaseContext.Provider value={foos}>
        {props.children}
      </DatabaseContext.Provider>
    </SQLiteProvider>
  );
}

const useDatabaseContext = (): DatabaseQuery => {
  const context = useContext(DatabaseContext);
  if (!context) {
    throw new Error(
      "`useDatabaseContext` must be used within an DatabaseProvider"
    );
  }
  return context;
};

export { DatabaseProvider, useDatabaseContext };
