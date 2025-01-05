import { useCallback } from "react";
import { Alert } from "react-native";
import { useSQLiteContext } from "expo-sqlite";
import { TransactionType } from "@/utils/types";

export function useInsertCategory() {
	const db = useSQLiteContext();

	const insertCategory = useCallback(
		async (
			category_name: string,
			category_type: TransactionType = "Expense",
		) => {
			try {
				const insertQuery = `
        INSERT INTO categories (category_name, category_type) VALUES (?, ?)
        `;

				const insertResult = await db.runAsync(insertQuery, [
					category_name,
					category_type,
				]);

				console.log("Insert New Category Result", insertResult);
				Alert.alert("Success", "New Category Added Successfully");
			} catch (error) {
				console.error("Failed to insert category:", error);
				Alert.alert("Error", "Failed to add category. Please try again.");
			}
		},
		[db],
	);

	return { insertCategory };
}
