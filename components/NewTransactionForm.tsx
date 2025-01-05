import React, { useState } from "react";
import {
	View,
	Text,
	TouchableOpacity,
	StyleSheet,
	TextInput,
	Alert,
} from "react-native";
import CurrencyInput from "react-native-currency-input";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useFormData } from "@/hooks/useFormData";
import { useInsertTransaction } from "@/hooks/useInsertTransaction";
import { TransactionType, NewTransaction } from "@/utils/types";
import { formatDateToISO } from "@/utils/helpers";
import Button from "./Button";
import CategoriesList from "@/components/CategoriesList";
import BanksDropdown from "@/components/BanksDropdown";

export default function NewTransactionForm({
	onClose,
}: {
	onClose: () => void;
}) {
	const [transactionType, setTransactionType] =
		useState<TransactionType>("Expense");
	const { banks, categories } = useFormData(transactionType);
	const { insertTransaction } = useInsertTransaction();

	const [transactionDescription, setTransactionDescription] =
		useState<string>("");
	const [amount, setAmount] = useState<number | null>(null);
	const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
	const [selectedBank, setSelectedBank] = useState<number | null>(null);
	const [transactionDate, setTransactionDate] = useState<Date>(new Date());
	const [showDatePicker, setShowDatePicker] = useState<boolean>(false);

	const handleDateChange = (_: any, selectedDate?: Date) => {
		const currentDate = selectedDate || transactionDate;
		setShowDatePicker(false);
		setTransactionDate(currentDate);
	};

	const handleSubmit = async () => {
		if (!amount || !selectedCategory || !selectedBank) {
			Alert.alert("Input Error", "Please fill in all required fields.");
			return;
		}

		const newTransaction: NewTransaction = {
			amount: amount,
			transaction_date: formatDateToISO(transactionDate),
			transaction_description: transactionDescription,
			category_id: selectedCategory,
			bank_id: selectedBank,
			transaction_type: transactionType,
		};

		console.log("New Transaction Form Input", newTransaction);
		await insertTransaction(newTransaction);

		onClose();
	};

	return (
		<View style={styles.modalContent}>
			<View style={styles.transactionTypeContainer}>
				<TouchableOpacity
					style={[
						styles.transactionTypeButton,
						transactionType === "Expense" &&
							styles.transactionTypeButtonSelected,
					]}
					onPress={() => setTransactionType("Expense")}
				>
					<Text style={styles.transactionTypeText}>Expense</Text>
				</TouchableOpacity>
				<TouchableOpacity
					style={[
						styles.transactionTypeButton,
						transactionType === "Income" &&
							styles.transactionTypeButtonSelected,
					]}
					onPress={() => setTransactionType("Income")}
				>
					<Text style={styles.transactionTypeText}>Income</Text>
				</TouchableOpacity>
			</View>
			<TextInput
				style={styles.input}
				placeholder="Description (optional)"
				placeholderTextColor="#ccc"
				value={transactionDescription}
				onChangeText={setTransactionDescription}
			/>
			<CurrencyInput
				value={amount}
				onChangeValue={setAmount}
				style={styles.input}
				prefix="$"
				delimiter="."
				separator=","
				precision={0}
				placeholder="Amount"
				placeholderTextColor="#ccc"
			/>
			<TouchableOpacity
				onPress={() => setShowDatePicker(true)}
				style={styles.datePickerButton}
			>
				<Text style={styles.datePickerText}>
					Choose Date: {transactionDate.toLocaleDateString()}
				</Text>
			</TouchableOpacity>
			{showDatePicker && (
				<DateTimePicker
					value={transactionDate}
					mode="date"
					display="default"
					onChange={handleDateChange}
				/>
			)}
			<CategoriesList
				categories={categories}
				currentCategorySelected={selectedCategory}
				setCurrentCategorySelected={setSelectedCategory}
				transactionType={transactionType}
				style={{ marginVertical: 10 }}
			/>
			<BanksDropdown
				banks={banks}
				selectedBank={selectedBank}
				setSelectedBank={setSelectedBank}
				style={{ marginVertical: 10 }}
			/>
			<Button
				theme="primary"
				label="Add Transaction"
				onPress={handleSubmit}
				style={{ marginTop: 10 }}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	modalContent: {
		backgroundColor: "#1b2026",
	},
	modalTitle: {
		fontSize: 20,
		fontWeight: "bold",
		marginBottom: 20,
		marginLeft: 10,
		marginTop: 10,
		color: "#fff",
	},
	transactionTypeContainer: {
		flexDirection: "row",
		justifyContent: "space-between",
		marginBottom: 20,
	},
	transactionTypeButton: {
		flex: 1,
		padding: 10,
		marginHorizontal: 5,
		borderRadius: 5,
		backgroundColor: "#313f47",
		alignItems: "center",
	},
	transactionTypeButtonSelected: {
		backgroundColor: "#00c4c1",
	},
	transactionTypeText: {
		color: "#fff",
	},
	input: {
		borderWidth: 1,
		borderColor: "#45576d",
		borderRadius: 5,
		padding: 10,
		marginBottom: 10,
		color: "#fff",
	},
	datePickerButton: {
		padding: 10,
		backgroundColor: "#313f47",
		borderRadius: 5,
		alignItems: "center",
		marginBottom: 10,
	},
	datePickerText: {
		color: "#00c4c1",
	},
});
