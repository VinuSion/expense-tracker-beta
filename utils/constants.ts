import * as FileSystem from "expo-file-system";

export const DB_NAME = "user.db";
export const DEFAULT_DB_PATH = `${FileSystem.documentDirectory}SQLite/${DB_NAME}`;

export const EST_TIMEZONE = "America/New_York";

export const schemaStatements = [
  `CREATE TABLE IF NOT EXISTS banks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    bank_name TEXT NOT NULL,
    logo_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`,
  `CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    category_name TEXT NOT NULL,
    category_type TEXT NOT NULL CHECK(category_type IN ('Expense', 'Income')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`,
  `CREATE TABLE IF NOT EXISTS transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    amount DECIMAL(10, 2) NOT NULL,
    transaction_date DATE NOT NULL,
    transaction_description TEXT,
    category_id INTEGER,
    bank_id INTEGER,
    transaction_type TEXT NOT NULL CHECK(transaction_type IN ('Expense', 'Income')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories (id) ON DELETE SET NULL,
    FOREIGN KEY (bank_id) REFERENCES banks (id) ON DELETE SET NULL
  )`,
  `INSERT INTO banks (bank_name, logo_url) VALUES 
    ('Bancolombia', 'https://res.cloudinary.com/stkv2/image/upload/v1735163181/banks/bwbo3c6g1qsjistcgmgq.png'),
    ('Cash', 'https://res.cloudinary.com/stkv2/image/upload/v1735163181/banks/hpb1twaaan4sb5kxupz2.png'),
    ('Global66', 'https://res.cloudinary.com/stkv2/image/upload/v1735163181/banks/eibkudsc6prz4du3jzxn.png'),
    ('Nequi', 'https://res.cloudinary.com/stkv2/image/upload/v1735163181/banks/wxbpieywd8xo9ynhgcbt.png'),
    ('NuBank', 'https://res.cloudinary.com/stkv2/image/upload/v1735163181/banks/zitxlmfeongnfm0kejss.png')`,
  `INSERT INTO categories (category_name, category_type) VALUES
    ('Food', 'Expense'),
    ('Clothes', 'Expense'),
    ('House Bills', 'Expense'),
    ('Self Hygiene', 'Expense'),
    ('Transport', 'Expense'),
    ('Subscriptions', 'Expense'),
    ('Tech', 'Expense'),
    ('Salary', 'Income')`,
  `PRAGMA foreign_keys = ON`
];

export const viewOptions = [
  { value: 'default', title: 'Default', icon: 'view-list' },
  { value: 'bankGrouped', title: 'Bank', icon: 'account-balance' },
  { value: 'categoryGrouped', title: 'Category', icon: 'category' },
];

export const categoryIconMap: Record<string, string> = {
  'Food': 'restaurant',
  'Clothes': 'shopping-bag',
  'House Bills': 'home',
  'Self Hygiene': 'spa',
  'Transport': 'directions-car',
  'Subscriptions': 'subscriptions',
  'Tech': 'devices',
  'Salary': 'attach-money',
};