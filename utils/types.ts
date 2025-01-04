export type TransactionType = "Expense" | "Income";
export type DateRangePreset = 'none' | 'today' | 'singleDay' | 'singleMonth' | 'singleYear' | 'thisWeek' | 'custom'
export type TransactionsViewType = 'default' | 'bankGrouped' | 'categoryGrouped'

export interface Bank {
	id: number;
	bank_name: string;
	logo_url: string;
}

export interface Category {
	id: number;
	category_name: string;
	category_type: TransactionType;
}

export interface Transaction {
	id: number;
	amount: number;
	transaction_date: string;
	transaction_description: string;
	category_id: number;
	bank_id: number;
	transaction_type: TransactionType;
}

export interface NewTransaction {
	amount: number;
	transaction_date: string;
	transaction_description: string;
	category_id: number;
	bank_id: number;
	transaction_type: TransactionType;
}

export interface UpdateTransaction extends NewTransaction {
  id: number;
}

export interface TransactionWithDetails extends Transaction {
	category_name: string;
	category_type: TransactionType;
	bank_name: string;
	logo_url: string;
}

export interface TransactionsSummary {
  totalExpenses: number;
  totalIncome: number;
}

export interface TransformedTransaction {
	id: number;
	amount: number;
	transaction_date: string;
	transaction_description: string;
	transaction_type: TransactionType;
	category: {
		category_id: number;
		category_name: string;
		category_type: string;
	};
	bank: {
		bank_id: number;
		bank_name: string;
		logo_url: string;
	};
}

export interface GroupedTransactionsByBank {
  bank_id: number;
  bank_name: string;
  logo_url: string;
  expenseAmount: number;
  incomeAmount: number;
  transactions: TransformedTransaction[];
}

export interface GroupedTransactionsByCategory {
  category_id: number;
  category_name: string;
  category_type: string;
  expenseAmount?: number;
  incomeAmount?: number;
  transactions: TransformedTransaction[];
}

export interface Filters {
  dateRange?: { start?: string; end?: string }
  month?: string
  year?: string
  bankId?: number
  categoryId?: number
  transactionType?: TransactionType
  order?: 'ascending' | 'descending'
  title?: string
  message?: string
  dateRangePreset?: DateRangePreset
}
