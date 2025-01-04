import { useState } from "react";
import {
	Alert,
	View,
	Text,
	StyleSheet,
	TouchableOpacity,
} from "react-native";
import Button from "./Button";
import { MaterialIcons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { format, parseISO, startOfWeek, endOfWeek } from "date-fns";
import { toZonedTime } from "date-fns-tz";
import { useFilterStore } from "@/store/filterStore";
import { useFormData } from "@/hooks/useFormData";
import { useFilteredTransactions } from "@/hooks/useFilteredTransactions";
import { DateRangePreset, TransactionType } from "@/utils/types";
import { getCurrentMonthYear } from "@/utils/helpers";
import { EST_TIMEZONE } from "@/utils/constants";
import BanksDropdown from "./BanksDropdown";
import CategoriesList from "@/components/CategoriesList";

export default function FiltersForm({ onClose }: { onClose: () => void }) {
	const { filters, setFilters, resetFilters } = useFilterStore();

  const [transactionType, setTransactionType] =
      useState<TransactionType>("Expense");
  const { banks, categories } = useFormData(transactionType);
	const { fetchFilteredTransactions } = useFilteredTransactions();

	const [startDate, setStartDate] = useState<Date | undefined>(
		filters.dateRange?.start ? parseISO(filters.dateRange.start) : undefined,
	);
	const [endDate, setEndDate] = useState<Date | undefined>(
		filters.dateRange?.end ? parseISO(filters.dateRange.end) : undefined,
	);
	const [singleDayDate, setSingleDayDate] = useState<Date | undefined>(
		undefined,
	);
  const [selectedBank, setSelectedBank] = useState<number | null>(filters.bankId ? filters.bankId : null);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(filters.categoryId ? filters.categoryId : null);

	const [showStartDatePicker, setShowStartDatePicker] = useState(false);
	const [showEndDatePicker, setShowEndDatePicker] = useState(false);

	const [selectedOrder, setSelectedOrder] = useState<
		"ascending" | "descending"
	>(filters.order || "descending");
	const [selectedPreset, setSelectedPreset] = useState<DateRangePreset>(
		filters.dateRangePreset ? filters.dateRangePreset : "none",
	);
	const { month, year } = getCurrentMonthYear();

	const handlePresetChange = (preset: DateRangePreset) => {
		setSelectedPreset(preset);
		const today = new Date();

		setStartDate(undefined);
		setEndDate(undefined);
		setSingleDayDate(undefined);

		switch (preset) {
			case "today":
				setStartDate(today);
				setEndDate(today);
				break;
			case "thisWeek":
				setStartDate(startOfWeek(today));
				setEndDate(endOfWeek(today));
				break;
			default:
				setStartDate(undefined);
				setEndDate(undefined);
				setSingleDayDate(undefined);
				break;
		}
	};

	const handleStartDateChange = (_: any, selectedDate?: Date) => {
		setShowStartDatePicker(false);
		if (selectedDate) {
			if (endDate && selectedDate > endDate) {
				Alert.alert(
					"Invalid Date Range",
					"Please select a valid date range. You tried to select a start date greater than the end date.",
				);
			} else {
				setStartDate(selectedDate);
			}
		}
	};

	const handleEndDateChange = (_: any, selectedDate?: Date) => {
		setShowEndDatePicker(false);
		if (selectedDate) {
			if (startDate && selectedDate < startDate) {
				Alert.alert(
					"Invalid Date Range",
					"Please select a valid date range. You tried to select an end date less than the start date.",
				);
			} else {
				setEndDate(selectedDate);
			}
		}
	};

	const handleApply = async () => {
		let title = "";
		let message = "";

		if (startDate && endDate) {
			const startDateWithoutTime = new Date(startDate);
			startDateWithoutTime.setHours(0, 0, 0, 0);
			const endDateWithoutTime = new Date(endDate);
			endDateWithoutTime.setHours(0, 0, 0, 0);

			if (startDateWithoutTime.getTime() === endDateWithoutTime.getTime()) {
				title = `${format(startDate, "MMM dd, yyyy")}`;
				message = `No transactions for ${format(startDate, "MMM dd, yyyy")}`;
			} else {
				title = `${format(startDate, "MMM dd, yyyy")} - ${format(
					endDate,
					"MMM dd, yyyy",
				)}`;
				message = `No transactions from ${format(
					startDate,
					"MMM dd, yyyy",
				)} - ${format(endDate, "MMM dd, yyyy")}`;
			}
		} else if (startDate) {
			title = `${format(startDate, "MMM dd, yyyy")} - Today`;
			message = `No transactions for ${format(
				startDate,
				"MMM dd, yyyy",
			)} - Today`;
		} else if (endDate) {
			title = `All - ${format(endDate, "MMM dd, yyyy")}`;
			message = `No transactions for All - ${format(endDate, "MMM dd, yyyy")}`;
		} else {
			title = `${month}, ${year} - Summary`;
			message = `No transactions for ${month} yet.`;
		}

		const formattedStartDate = startDate
			? format(toZonedTime(startDate, EST_TIMEZONE), "yyyy-MM-dd") + " 00:00:00"
			: undefined;
		const formattedEndDate = endDate
			? format(toZonedTime(endDate, EST_TIMEZONE), "yyyy-MM-dd") + " 23:59:59"
			: undefined;

		const newFilters = {
			dateRange: {
				start: formattedStartDate,
				end: formattedEndDate,
			},
      bankId: selectedBank ? selectedBank : undefined,
      categoryId: selectedCategory ? selectedCategory : undefined,
			order: selectedOrder,
			title,
			message,
			dateRangePreset: selectedPreset,
		};

		console.log("Filters in Form", newFilters);
		setFilters(newFilters);
		await fetchFilteredTransactions(newFilters);
		onClose();
	};

	const handleReset = async () => {
		resetFilters();
		await fetchFilteredTransactions({});
		onClose();
	};

	return (
		<View style={styles.modalContent}>
			<Text style={styles.filterText}>Date Range</Text>
      <View style={styles.filtersContainer}>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={selectedPreset}
            onValueChange={(itemValue) => handlePresetChange(itemValue)}
            style={styles.picker}
            dropdownIconColor={"#fff"}
            dropdownIconRippleColor={"#313f47"}
            mode="dropdown"
          >
            <Picker.Item style={styles.pickerItem} label="None" value="none" />
            <Picker.Item style={styles.pickerItem} label="Today" value="today" />
            <Picker.Item
              style={styles.pickerItem}
              label="Single Day"
              value="singleDay"
            />
            <Picker.Item
              style={styles.pickerItem}
              label="This Week"
              value="thisWeek"
            />
            <Picker.Item
              style={styles.pickerItem}
              label="Custom"
              value="custom"
            />
          </Picker>
        </View>
        <TouchableOpacity
          activeOpacity={1}
          style={styles.resetBtn}
          onPress={handleReset}
        >
          <MaterialIcons name="replay" size={24} color="black" />
        </TouchableOpacity>
        <Button theme="primary" label="Reset" onPress={handleReset} style={styles.resetBtn} />
      </View>

			{selectedPreset === "singleDay" && (
				<>
					<TouchableOpacity
						onPress={() => setShowStartDatePicker(true)}
						style={[styles.datePickerButton, { width: "100%" }]}
					>
						<Text style={styles.datePickerText}>
							{singleDayDate ? singleDayDate.toDateString() : "Select Date"}
						</Text>
					</TouchableOpacity>
					{showStartDatePicker && (
						<DateTimePicker
							value={singleDayDate || new Date()}
							mode="date"
							display="default"
							onChange={(_, selectedDate) => {
								setShowStartDatePicker(false);
								if (selectedDate) {
									setSingleDayDate(selectedDate);
									setStartDate(selectedDate);
									setEndDate(selectedDate);
								}
							}}
						/>
					)}
				</>
			)}

			{selectedPreset === "custom" && (
				<View style={styles.datePickerContainer}>
					<TouchableOpacity
						onPress={() => setShowStartDatePicker(true)}
						style={styles.datePickerButton}
					>
						<Text style={styles.datePickerText}>
							{startDate ? startDate.toDateString() : "Select Start Date"}
						</Text>
					</TouchableOpacity>
					{showStartDatePicker && (
						<DateTimePicker
							value={startDate || new Date()}
							mode="date"
							display="default"
							onChange={handleStartDateChange}
						/>
					)}
					<TouchableOpacity
						onPress={() => setShowEndDatePicker(true)}
						style={styles.datePickerButton}
					>
						<Text style={styles.datePickerText}>
							{endDate ? endDate.toDateString() : "Select End Date"}
						</Text>
					</TouchableOpacity>
					{showEndDatePicker && (
						<DateTimePicker
							value={endDate || new Date()}
							mode="date"
							display="default"
							onChange={handleEndDateChange}
						/>
					)}
				</View>
			)}

      <View style={styles.singleFilterContainer}>
        <Text style={styles.filterText}>Bank</Text>
        <BanksDropdown
          banks={banks}
          selectedBank={selectedBank}
          setSelectedBank={setSelectedBank}
        />
      </View>

      <View style={styles.singleFilterContainer}>
        <Text style={styles.filterText}>Category</Text>
        <CategoriesList
          categories={categories}
          currentCategorySelected={selectedCategory}
          setCurrentCategorySelected={setSelectedCategory}
          transactionType={transactionType}
        />
      </View>

      <View style={styles.singleFilterContainer}>
        <Text style={styles.filterText}>Transaction Type</Text>
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
      </View>

      <View style={styles.singleFilterContainer}>
        <Text style={styles.filterText}>Order</Text>
        <View style={styles.orderTypeContainer}>
          <TouchableOpacity
            style={[
              styles.orderTypeButton,
              selectedOrder === "ascending" && styles.orderTypeButtonSelected,
            ]}
            onPress={() => setSelectedOrder("ascending")}
          >
            <Text style={styles.orderTypeText}>Ascending</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.orderTypeButton,
              selectedOrder === "descending" && styles.orderTypeButtonSelected,
            ]}
            onPress={() => setSelectedOrder("descending")}
          >
            <Text style={styles.orderTypeText}>Descending</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <Button label="Cancel" onPress={onClose} style={styles.btn} />
        <Button theme="primary" label="Apply" onPress={handleApply} style={styles.btn} />
      </View>
		</View>
	);
}

const styles = StyleSheet.create({
	modalContent: {
		borderRadius: 10,
	},
	filterText: {
		color: "#fff",
		marginBottom: 5,
	},
  filtersContainer: {
    flexDirection: "row",
    gap: 10,
    width: "100%",
  },
  singleFilterContainer: {
    flexDirection: "column",
    width: "100%",
    marginBottom: 10,
  },
  resetBtn: {
    height: 52,
    width: 52,
    backgroundColor: "#fff",
		padding: 5,
		borderRadius: 15,
		alignItems: "center",
		justifyContent: "center",
  },
	pickerContainer: {
		borderWidth: 1,
		borderColor: "#313f47",
		borderRadius: 5,
		marginBottom: 10,
		overflow: "hidden",
    width: "83%",
	},
	picker: {
		height: 52,
		width: "100%",
		color: "#fff",
	},
	pickerItem: {
		color: "#fff",
		backgroundColor: "#313f47",
		borderRadius: 15,
	},
	datePickerContainer: {
		flexDirection: "row",
		gap: 10,
		width: "95%",
	},
	datePickerButton: {
		padding: 10,
		backgroundColor: "#313f47",
		borderRadius: 5,
		alignItems: "center",
		marginBottom: 10,
		width: "51%",
	},
	datePickerText: {
		color: "#00c4c1",
	},
  transactionTypeContainer: {
		flexDirection: "row",
		justifyContent: "space-between",
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
	orderTypeContainer: {
		flexDirection: "row",
		justifyContent: "space-between",
		backgroundColor: "#313f47",
		borderRadius: 5,
		marginBottom: 20,
	},
	orderTypeButton: {
		flex: 1,
		padding: 10,
		borderRadius: 5,
		backgroundColor: "#313f47",
		alignItems: "center",
	},
	orderTypeButtonSelected: {
		backgroundColor: "#00c4c1",
	},
	orderTypeText: {
		color: "#fff",
		fontSize: 16,
	},
	buttonContainer: {
		flexDirection: "row",
	},
  btn: {
    width: "50%",
  }
});
