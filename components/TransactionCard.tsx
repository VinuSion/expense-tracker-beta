import { useState, useEffect } from "react";
import {
	View,
	Text,
	Image,
	StyleSheet,
	TouchableOpacity,
	Animated,
} from "react-native";
import { BlurView } from "expo-blur";
import { LongPressGestureHandler, State } from "react-native-gesture-handler";
import { MaterialIcons } from "@expo/vector-icons";
import { TransformedTransaction } from "@/utils/types";
import { formatDate, formatAmount } from "@/utils/helpers";
import { useDeleteTransaction } from "@/hooks/useDeleteTransaction";
import BottomModal from "@/components/BottomModal";
import ConfirmModal from "./ConfirmModal";
import UpdateTransactionForm from "./UpdateTransactionForm";

interface TransactionCardProps {
	transaction: TransformedTransaction;
	showBank?: boolean;
	showCategory?: boolean;
	isActive: boolean;
	setActiveCardId: (id: number | null) => void;
}

export default function TransactionCard({
	transaction,
	isActive,
	showBank = false,
	showCategory = false,
	setActiveCardId,
}: TransactionCardProps) {
	const {
		id,
		amount,
		transaction_type,
		transaction_description,
		transaction_date,
		category,
		bank,
	} = transaction;

	const formattedAmount = `${
		transaction_type === "Expense" ? "-" : "+"
	}$${formatAmount(amount)}`;

	const { deleteTransaction } = useDeleteTransaction();
	const [showWidgets, setShowWidgets] = useState(false);
	const [modalVisible, setModalVisible] = useState(false);
	const [dialogVisible, setDialogVisible] = useState(false);
	const scale = useState(new Animated.Value(1))[0];

	useEffect(() => {
		if (!isActive) {
			Animated.spring(scale, {
				toValue: 1,
				useNativeDriver: true,
			}).start();
			setShowWidgets(false);
		}
	}, [isActive]);

	const handleLongPress = ({ nativeEvent }: any) => {
		if (nativeEvent.state === State.ACTIVE) {
			Animated.spring(scale, {
				toValue: 0.95,
				useNativeDriver: true,
			}).start();
			setShowWidgets(true);
			setActiveCardId(transaction.id);
		}
	};

	const confirmDelete = () => {
		console.log("Deleted transaction:", transaction.id);
		deleteTransaction(transaction.id);

		setDialogVisible(false);
		setActiveCardId(null);
	};

	return (
		<TouchableOpacity activeOpacity={1} onPress={() => setActiveCardId(null)}>
			<LongPressGestureHandler
				onHandlerStateChange={handleLongPress}
				minDurationMs={300}
			>
				<View style={{ position: "relative" }}>
					<Animated.View style={[styles.container, { transform: [{ scale }] }]}>
						<View style={styles.row}>
							<Text
								style={[
									styles.amount,
									{
										color:
											transaction_type === "Expense" ? "#e82e44" : "#2bc444",
									},
								]}
							>
								{formattedAmount}
							</Text>
							{showBank && (
								<View style={styles.infoSection}>
									<Image
										source={{ uri: bank.logo_url }}
										style={styles.bankLogo}
									/>
									<Text style={styles.infoText}>{bank.bank_name}</Text>
								</View>
							)}
							{showCategory && (
								<View style={styles.infoSection}>
									<Text style={styles.infoText}>{category.category_name}</Text>
								</View>
							)}
						</View>
						<View style={styles.row}>
							{transaction_description && (
								<Text style={styles.description}>
									{transaction_description}
								</Text>
							)}
							<View style={styles.infoSection}>
								<Text style={styles.infoText}>
									{formatDate(transaction_date)}
								</Text>
							</View>
						</View>
					</Animated.View>
					{showWidgets && (
						<View style={styles.widgetsContainer}>
							<TouchableOpacity
								activeOpacity={1}
								style={styles.widget}
								onPress={() => setModalVisible(true)}
							>
								<MaterialIcons name="edit" size={24} color="white" />
							</TouchableOpacity>
							<TouchableOpacity
								activeOpacity={1}
								style={styles.widget}
								onPress={() => setDialogVisible(true)}
							>
								<MaterialIcons name="delete" size={24} color="white" />
							</TouchableOpacity>
						</View>
					)}
					{showWidgets && (
						<BlurView
							style={styles.blurContainer}
							tint="systemMaterialDark"
							intensity={10}
							experimentalBlurMethod="dimezisBlurView"
						/>
					)}
					<BottomModal
						visible={modalVisible}
						onClose={() => {
							setModalVisible(false);
							setActiveCardId(null);
						}}
						title="Update Transaction"
					>
						<UpdateTransactionForm
							transaction={transaction}
							onClose={() => {
								setModalVisible(false);
								setActiveCardId(null);
							}}
						/>
					</BottomModal>
					<ConfirmModal
						visible={dialogVisible}
						title="Delete Transaction"
						description="Are you sure you want to delete this transaction?"
						confirmButtonText="Delete"
						confirmButtonStyle={{ backgroundColor: "#e82e44" }}
						onClose={() => {
							setDialogVisible(false);
							setActiveCardId(null);
						}}
						onConfirm={confirmDelete}
					/>
				</View>
			</LongPressGestureHandler>
		</TouchableOpacity>
	);
}

const styles = StyleSheet.create({
	container: {
		backgroundColor: "#313f47",
		padding: 10,
		borderRadius: 10,
		width: "100%",
	},
	blurContainer: {
		flex: 1,
		width: "100%",
		height: "100%",
		borderRadius: 10,
		position: "absolute",
		overflow: "hidden",
	},
	row: {
		flexDirection: "row",
		alignItems: "center",
		flexWrap: "wrap",
		marginBottom: 5,
		gap: 10,
	},
	amount: {
		fontSize: 18,
		fontWeight: 900,
	},
	infoSection: {
		backgroundColor: "#1b2026",
		flexDirection: "row",
		alignItems: "center",
		padding: 3,
		height: 25,
		borderRadius: 15,
	},
	infoText: {
		fontSize: 14,
		color: "#fff",
		paddingHorizontal: 5,
	},
	bankLogo: {
		width: 20,
		height: 20,
		borderRadius: 25,
	},
	categoryName: {
		fontSize: 14,
		color: "#fff",
	},
	description: {
		fontSize: 15,
		color: "#fff",
	},
	date: {
		fontSize: 14,
		color: "#fff",
	},
	widgetsContainer: {
		position: "absolute",
		zIndex: 5,
		top: "50%",
		transform: [{ translateY: "-50%" }],
		right: 15,
		flexDirection: "row",
		gap: 10,
	},
	widget: {
		backgroundColor: "#25292e",
		padding: 5,
		borderRadius: 10,
		borderColor: "#00c4c1",
		borderWidth: 1,
	},
});
