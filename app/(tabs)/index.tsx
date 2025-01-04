import { useState, useEffect } from "react";
import {
	View,
	StyleSheet,
	Text,
	FlatList,
	TouchableOpacity,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { MaterialIcons } from "@expo/vector-icons";
import { useDBStore } from "@/store/dbStore";
import { useFilterStore } from "@/store/filterStore";
import { useFetchTransactions } from "@/hooks/useFetchTransactions";
import {
	formatAmount,
	groupTransactionsByBank,
	groupTransactionsByCategory,
} from "@/utils/helpers";
import {
	TransformedTransaction,
	GroupedTransactionsByBank,
	GroupedTransactionsByCategory,
} from "@/utils/types";

import Button from "@/components/Button";
import FiltersForm from "@/components/FiltersForm";
import NewTransactionForm from "@/components/NewTransactionForm";
import BottomModal from "@/components/BottomModal";
import ViewTypeModal from "@/components/ViewTypeModal";
import TransactionCard from "@/components/TransactionCard";
import BankGroup from "@/components/BankGroup";
import CategoryGroup from "@/components/CategoryGroup";

export default function Index() {
	const { fetchCurrentTransactions } = useFetchTransactions();
	const { currentTransactions, transactionsSummary, dbExists, viewType } =
		useDBStore();
	const { filters } = useFilterStore();
	const [modalVisible, setModalVisible] = useState(false);
	const [filtersModalVisible, setFiltersModalVisible] = useState(false);
	const [viewTypeModalVisible, setViewTypeModalVisible] = useState(false);
	const [activeCardId, setActiveCardId] = useState<number | null>(null);

	const groupedTransactions = groupTransactionsByBank(currentTransactions);
	const groupedTransactionsByCategory =
		groupTransactionsByCategory(currentTransactions);

	useEffect(() => {
		if (dbExists) {
			console.warn("Calling Fetch Transactions...");
			fetchCurrentTransactions();
		}
	}, [dbExists]);

	return (
		<GestureHandlerRootView style={{ flex: 1 }}>
			<TouchableOpacity
				activeOpacity={1}
				onPress={() => setActiveCardId(null)}
				style={{ flex: 1 }}
			>
				<View style={styles.container}>
					<Text style={styles.title}>{filters.title}</Text>
					<View style={styles.wrapperCard}>
						<View style={styles.summaryCard}>
							<Text style={[styles.summaryText, { color: "#2bc444" }]}>
								+${formatAmount(transactionsSummary.totalIncome)}
							</Text>
							<Text style={[styles.summaryText, { color: "#e82e44" }]}>
								-${formatAmount(transactionsSummary.totalExpenses)}
							</Text>
						</View>
					</View>
					<View style={[styles.wrapperCard, { flexDirection: "row", gap: 10 }]}>
						<Button
							theme="primary"
							label="New Transaction"
							onPress={() => {
								setModalVisible(true);
								setActiveCardId(null);
							}}
							style={{ width: "66%" }}
						/>
						<TouchableOpacity
							activeOpacity={1}
							style={styles.filterButton}
							onPress={() => setViewTypeModalVisible(true)}
						>
							<MaterialIcons name="view-module" size={24} color="black" />
						</TouchableOpacity>
						<TouchableOpacity
							activeOpacity={1}
							style={styles.filterButton}
							onPress={() => setFiltersModalVisible(true)}
						>
							<MaterialIcons name="filter-list" size={24} color="black" />
						</TouchableOpacity>
					</View>
					<View style={[styles.wrapperCard, { flex: 1, marginBottom: 0 }]}>
						{currentTransactions.length === 0 ? (
							<Text style={styles.noTransactions}>{filters.message}</Text>
						) : viewType === "bankGrouped" ? (
							<FlatList
								data={groupedTransactions}
								keyExtractor={(item) => item.bank_id.toString()}
								renderItem={({ item }: { item: GroupedTransactionsByBank }) => (
									<BankGroup
										item={item}
										activeCardId={activeCardId}
										setActiveCardId={setActiveCardId}
									/>
								)}
								contentContainerStyle={styles.specialList}
							/>
						) : viewType === "categoryGrouped" ? (
							<FlatList
								data={groupedTransactionsByCategory}
								keyExtractor={(item) => item.category_id.toString()}
								renderItem={({
									item,
								}: {
									item: GroupedTransactionsByCategory;
								}) => (
									<CategoryGroup
										item={item}
										activeCardId={activeCardId}
										setActiveCardId={setActiveCardId}
									/>
								)}
								contentContainerStyle={styles.specialList}
							/>
						) : (
							<FlatList
								data={currentTransactions}
								keyExtractor={(item) => item.id.toString()}
								renderItem={({ item }: { item: TransformedTransaction }) => (
									<TransactionCard
										transaction={item}
										isActive={item.id === activeCardId}
										showBank
										showCategory
										setActiveCardId={setActiveCardId}
									/>
								)}
								contentContainerStyle={styles.defaultList}
							/>
						)}
					</View>
					<BottomModal
						visible={modalVisible}
						onClose={() => setModalVisible(false)}
						title="New Transaction"
					>
						<NewTransactionForm onClose={() => setModalVisible(false)} />
					</BottomModal>
					<ViewTypeModal
						visible={viewTypeModalVisible}
						onClose={() => setViewTypeModalVisible(false)}
					/>
					<BottomModal
						visible={filtersModalVisible}
						onClose={() => setFiltersModalVisible(false)}
						title="Filters"
					>
						<FiltersForm onClose={() => setFiltersModalVisible(false)} />
					</BottomModal>
				</View>
			</TouchableOpacity>
		</GestureHandlerRootView>
	);
}

const styles = StyleSheet.create({
	container: {
		backgroundColor: "#25292e",
		flex: 1,
	},
	title: {
		fontSize: 24,
		color: "#fff",
		fontWeight: 900,
		marginBottom: 10,
		paddingLeft: 15,
		alignItems: "flex-start",
	},
	wrapperCard: {
		width: "100%",
		paddingHorizontal: 10,
		marginBottom: 10,
	},
	filterButton: {
		backgroundColor: "#fff",
		padding: 5,
		borderRadius: 15,
		width: 50,
		height: 50,
		alignItems: "center",
		justifyContent: "center",
	},
	summaryCard: {
		backgroundColor: "#313f47",
		padding: 15,
		borderRadius: 10,
	},
	summaryText: {
		fontSize: 28,
		fontWeight: "900",
		color: "#fff",
	},
	defaultList: {
		gap: 10,
		paddingBottom: 10,
	},
	specialList: {
		gap: 15,
		paddingBottom: 10,
	},
	noTransactions: {
		fontSize: 18,
		color: "#fff",
		textAlign: "center",
		marginTop: 15,
	},
});
