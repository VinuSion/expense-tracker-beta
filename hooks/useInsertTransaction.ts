import { useCallback } from "react";
import { Alert } from "react-native";
import { useSQLiteContext } from "expo-sqlite";
import { useFetchTransactions } from "./useFetchTransactions";
import { useFilterStore } from '@/store/filterStore'
import { NewTransaction } from "@/utils/types";

export const useInsertTransaction = () => {
	const db = useSQLiteContext();
	const { fetchCurrentTransactions } = useFetchTransactions();
  const { resetFilters } = useFilterStore()

	const insertTransaction = useCallback(
		async (transaction: NewTransaction) => {
			try {
				const {
					amount,
					transaction_date,
					transaction_description,
					category_id,
					bank_id,
					transaction_type,
				} = transaction;

				const insertQuery = `
        INSERT INTO transactions (amount, transaction_date, transaction_description, category_id, bank_id, transaction_type)
        VALUES (?, ?, ?, ?, ?, ?)
        `;
				const insertResult = await db.runAsync(insertQuery, [
					amount,
					transaction_date,
					transaction_description,
					category_id,
					bank_id,
					transaction_type,
				]);

				console.log("Insert New Transaction Result", insertResult);
        resetFilters()
				await fetchCurrentTransactions();

				Alert.alert("Success", "New transaction inserted successfully");
			} catch (error) {
				console.error("Failed to insert transaction:", error);
				Alert.alert("Error", "Failed to insert transaction. Please try again.");
			}
		},
		[db],
	);

	return { insertTransaction };
};
