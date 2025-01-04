import { useCallback } from "react";
import { Alert } from "react-native";
import { useSQLiteContext } from "expo-sqlite";
import { useFetchTransactions } from "./useFetchTransactions";
import { useFilterStore } from '@/store/filterStore'
import { UpdateTransaction } from "@/utils/types";

export const useUpdateTransaction = () => {
	const db = useSQLiteContext();
	const { fetchCurrentTransactions } = useFetchTransactions();
  const { resetFilters } = useFilterStore()

	const updateTransaction = useCallback(
		async (transaction: UpdateTransaction) => {
			try {
				const {
					id,
					amount,
					transaction_date,
					transaction_description,
					category_id,
					bank_id,
					transaction_type,
				} = transaction;

				const updateQuery = `
        UPDATE transactions
        SET amount = ?, transaction_date = ?, transaction_description = ?, category_id = ?, bank_id = ?, transaction_type = ?
        WHERE id = ?
        `;
				const updateResult = await db.runAsync(updateQuery, [
					amount,
					transaction_date,
					transaction_description,
					category_id,
					bank_id,
					transaction_type,
					id,
				]);

				console.log("Update Transaction Result", updateResult);
        resetFilters()
				await fetchCurrentTransactions();

				Alert.alert("Success", "Transaction updated successfully");
			} catch (error) {
				console.error("Failed to update transaction:", error);
				Alert.alert("Error", "Failed to update transaction");
			}
		},
		[db],
	);

	return { updateTransaction };
};
