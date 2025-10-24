import { Transaction } from "@/models/Transaction";
import { Wallet } from "@/models/Wallet";
import { type SQLiteDatabase } from "expo-sqlite";

export async function migrateDbIfNeeded(db: SQLiteDatabase) {
  try {
    const DATABASE_VERSION = 5;
    const result = await db.getFirstAsync<{
      user_version: number;
    }>("PRAGMA user_version");

    if (result?.user_version === undefined) {
      return;
    }
    let currentDbVersion = result.user_version;

    console.log("DB Version:", DATABASE_VERSION);
    console.log("Current DB Version:", currentDbVersion);

    if (currentDbVersion >= DATABASE_VERSION) {
      return;
    }

    await db.execAsync(`
    PRAGMA journal_mode = WAL;
    PRAGMA foreign_keys = ON;

    DROP TABLE IF EXISTS  transactions;
    DROP TABLE IF EXISTS  wallets;

    CREATE TABLE wallets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,  
      name TEXT NOT NULL, 
      initialBalance REAL NOT NULL,
      balance REAL NOT NULL
    );

    CREATE TABLE transactions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date TEXT NOT NULL,
      amount REAL NOT NULL,
      balanceBefore REAL NOT NULL, 
      note TEXT,
      walletID INTEGER NOT NULL,
      FOREIGN KEY (walletID)
        REFERENCES wallets (id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
    );
  `);

    await db.execAsync(`PRAGMA user_version = ${DATABASE_VERSION};`);
  } catch (e) {
    console.error(e);
  }
}

export async function getWallets(db: SQLiteDatabase) {
  try {
    return await db.getAllAsync<Wallet>("SELECT * FROM wallets;");
  } catch (error) {
    throw error;
  }
}

export async function getWallet(db: SQLiteDatabase, walletID: number) {
  try {
    const statement = await db.prepareAsync(
      `SELECT * FROM wallets WHERE id = $walletID;`
    );
    const result = await statement.executeAsync<Wallet>({
      $walletID: walletID,
    });

    return await result.getFirstAsync();
  } catch (error) {
    throw error;
  }
}

export async function createWallet(
  db: SQLiteDatabase,
  name: string,
  balance: number
) {
  const statement = await db.prepareAsync(
    `INSERT INTO wallets 
      (name, initialBalance, balance) 
    VALUES 
      ($name, $initialBalance, $balance);`
  );

  try {
    const result = await statement.executeAsync<Wallet>({
      $name: name,
      $initialBalance: balance,
      $balance: balance,
    });

    return result.lastInsertRowId;
  } catch (error) {
    throw error;
  }
}

export async function getTransactions(
  db: SQLiteDatabase,
  walletID: number,
  sort: "DESC" | "ASC" = "DESC",
  limit?: number
) {
  try {
    let query = `SELECT * FROM transactions 
      WHERE walletID = $walletID 
      ORDER BY date ${sort};`;
    if (limit !== undefined) query += ` LIMIT ${limit}`;

    const statement = await db.prepareAsync(query);
    const result = await statement.executeAsync<Transaction>({
      $walletID: walletID,
    });

    return await result.getAllAsync();
  } catch (error) {
    throw error;
  }
}

export async function createTransaction(
  db: SQLiteDatabase,
  date: Date,
  amount: number,
  note: string,
  walletID: number
) {
  try {
    await db.withTransactionAsync(async () => {
      let statement = await db.prepareAsync(
        `INSERT INTO transactions
          (date, amount, note, balanceBefore, walletID) 
        SELECT
          $date,
          $amount,
          $note,
          balance - $amount AS balanceBefore,
          id
        FROM wallets
        WHERE id = $walletID;`
      );
      const result = await statement.executeAsync<Transaction>({
        $date: date.toISOString(),
        $amount: amount,
        $note: note,
        $walletID: walletID,
      });

      statement = await db.prepareAsync(
        `UPDATE wallets 
        SET balance = balance + $amount 
        WHERE id = $walletID;`
      );

      await statement.executeAsync({
        $amount: amount,
        $walletID: walletID,
      });
    });
  } catch (error) {
    throw error;
  }
}
