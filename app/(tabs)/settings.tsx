import { useState } from "react";
import {
	Text,
	TextInput,
	View,
	StyleSheet,
	Alert,
	TouchableOpacity,
	FlatList,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import * as FileSystem from "expo-file-system";
import * as SQLite from "expo-sqlite";
import { useDBStore } from "@/store/dbStore";
import { useFetchCategories } from "@/hooks/useFetchCategories";
import { useInsertCategory } from "@/hooks/useInsertCategory";
import { generateTimestampedFilename } from "@/utils/helpers";
import { DEFAULT_DB_PATH } from "@/utils/constants";

import ConfirmModal from "@/components/ConfirmModal";

export default function AboutScreen() {
	const router = useRouter();
	const { dbPath, deleteDB } = useDBStore();
	const { categories, refreshCategories } = useFetchCategories();
	const { insertCategory } = useInsertCategory();

	const [dialogVisible, setDialogVisible] = useState(false);
	const [newCategory, setNewCategory] = useState<string>("");

	const handleExportDB = async () => {
		try {
			// Resolve dbPath, falling back to a default path if null
			const resolvedDbPath = dbPath ?? DEFAULT_DB_PATH;

			// Check if database exists
			const fileInfo = await FileSystem.getInfoAsync(resolvedDbPath);
			if (!fileInfo.exists) {
				Alert.alert("Export Failed", "No database found to export.");
				return;
			}

			// Close any open DB connections
			const db = await SQLite.openDatabaseAsync(resolvedDbPath);
			await db.closeAsync();

			// Request permission to save the file
			const permissions =
				await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();
			if (!permissions.granted) {
				Alert.alert(
					"Permission Denied",
					"Permission is required to save the database.",
				);
				return;
			}

			// Read database file as Base64
			const base64Data = await FileSystem.readAsStringAsync(resolvedDbPath, {
				encoding: FileSystem.EncodingType.Base64,
			});

			// Create a new file in the selected directory
			const destinationUri =
				await FileSystem.StorageAccessFramework.createFileAsync(
					permissions.directoryUri,
					generateTimestampedFilename("expense_tracker", "db"),
					"application/octet-stream",
				);

			// Write Base64 data to the new file
			await FileSystem.StorageAccessFramework.writeAsStringAsync(
				destinationUri,
				base64Data,
				{ encoding: FileSystem.EncodingType.Base64 },
			);

			Alert.alert("Success", "Database exported successfully!");
		} catch (error) {
			console.error("Error exporting database:", error);
			Alert.alert(
				"Export Failed",
				"An error occurred while exporting the database.",
			);
		}
	};

	const confirmDelete = () => {
		setDialogVisible(false);
		deleteDB();
		console.log("Database Deleted");
		router.replace("../welcome");
	};

	const handleAddCategory = async () => {
		if (!newCategory) {
			Alert.alert("Input Error", "Please fill in all required fields.");
			return;
		}

		if (newCategory.length > 25) {
			Alert.alert(
				"Input Error",
				"Category name must not exceed 25 characters.",
			);
			return;
		}

		const isValid = /^[a-zA-Z\s]+$/.test(newCategory);
		if (!isValid) {
			Alert.alert(
				"Input Error",
				"Category name must only contain letters and spaces.",
			);
			return;
		}

		console.log("New Category Form Input:", newCategory);
		await insertCategory(newCategory.trim());
		refreshCategories();

		setNewCategory("");
	};

	return (
		<View style={styles.container}>
			<Text style={styles.title}>Your Data</Text>
			<View style={styles.wrapperContainer}>
				<View style={styles.optionsWrapper}>
					<TouchableOpacity
						activeOpacity={1}
						style={styles.optionContainer}
						onPress={handleExportDB}
					>
						<View style={styles.optionContent}>
							<View style={styles.optionLeft}>
								<Text style={styles.optionHeader}>Export Database</Text>
								<Text style={styles.text}>
									Export your database to a file for backup. Choose somewhere
									safe to store it.
								</Text>
							</View>
							<MaterialIcons
								name="save-alt"
								size={35}
								color="white"
								style={styles.optionIcon}
							/>
						</View>
					</TouchableOpacity>

					<TouchableOpacity
						activeOpacity={1}
						style={[styles.optionContainer, { borderBottomWidth: 0 }]}
						onPress={() => setDialogVisible(true)}
					>
						<View style={styles.optionContent}>
							<View style={styles.optionLeft}>
								<Text style={[styles.optionHeader, { color: "#e82e44" }]}>
									Delete Data
								</Text>
								<Text style={styles.text}>
									Deleting your data is permanent and cannot be undone. Please
									export your data first if you want to keep a backup.
								</Text>
							</View>
							<MaterialIcons
								name="delete"
								size={35}
								color="#e82e44"
								style={styles.optionIcon}
							/>
						</View>
					</TouchableOpacity>
				</View>
			</View>
			<Text style={[styles.title, { marginVertical: 10 }]}>Add Categories</Text>
			<View style={styles.wrapperContainer}>
				<Text style={styles.text}>
					You can only create "Expense" categories right now because they're
					more common than "Income" categories. However, you can't delete or
					edit categories, so choose their names carefully!
				</Text>
				<View style={styles.categoryForm}>
					<TextInput
						style={styles.input}
						placeholder="Add New Category..."
						placeholderTextColor="#ccc"
						value={newCategory}
						onChangeText={setNewCategory}
					/>
					<TouchableOpacity
						activeOpacity={1}
						style={styles.addBtn}
						onPress={handleAddCategory}
					>
						<MaterialIcons name="add" size={28} color="black" />
					</TouchableOpacity>
				</View>
				<FlatList
					data={categories}
					keyExtractor={(item) => item.id.toString()}
					numColumns={3}
					columnWrapperStyle={styles.columnWrapper}
					contentContainerStyle={styles.listContainer}
					style={{
						backgroundColor: "#1b2026",
						borderRadius: 10,
						borderWidth: 1,
						borderColor: "#45576d",
						maxHeight: 220,
						flexGrow: 0,
					}}
					renderItem={({ item }) => (
						<View style={styles.categoryItem}>
							<Text style={styles.categoryName}>{item.category_name}</Text>
						</View>
					)}
				/>
			</View>
			<ConfirmModal
				visible={dialogVisible}
				title="Delete My Data"
				description="This action cannot be undone. Are you sure you want to delete your data? Before you proceed, we recommend to export your data first."
				confirmButtonText="Delete"
				confirmButtonStyle={{ backgroundColor: "#e82e44" }}
				onClose={() => {
					setDialogVisible(false);
				}}
				onConfirm={confirmDelete}
			/>
		</View>
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
	text: {
		fontSize: 14,
		color: "#ccc",
	},
	wrapperContainer: {
		width: "100%",
		paddingHorizontal: 10,
		marginBottom: 10,
	},
	optionsWrapper: {
		backgroundColor: "#1b2026",
		borderWidth: 1,
		borderRadius: 10,
		borderColor: "#45576d",
	},
	optionContainer: {
		padding: 15,
		borderBottomWidth: 1,
		borderBottomColor: "#45576d",
	},
	optionContent: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
	},
	optionLeft: {
		flex: 1,
		marginRight: 10,
	},
	optionHeader: {
		fontSize: 18,
		color: "#fff",
		fontWeight: 900,
		marginBottom: 5,
	},
	optionIcon: {
		flexShrink: 0,
	},
	categoryForm: {
		width: "100%",
		flexDirection: "row",
		gap: 10,
		marginVertical: 10,
	},
	input: {
		borderWidth: 1,
		borderColor: "#45576d",
		borderRadius: 5,
		padding: 10,
		marginBottom: 10,
		color: "#fff",
		width: "82%",
		height: 50,
	},
	addBtn: {
		backgroundColor: "#fff",
		padding: 5,
		borderRadius: 15,
		width: 50,
		height: 50,
		alignItems: "center",
		justifyContent: "center",
	},
	listContainer: {
		gap: 8,
		padding: 5,
	},
	columnWrapper: {
		justifyContent: "flex-start",
    flexWrap: "wrap",
		gap: 8,
	},
	categoryItem: {
		paddingVertical: 5,
		paddingHorizontal: 13,
		borderRadius: 25,
		backgroundColor: "#313f47",
	},
	categoryName: {
		color: "#fff",
	},
});
