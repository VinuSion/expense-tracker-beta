import { useState } from "react";
import { Text, View, StyleSheet, Alert, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import * as FileSystem from "expo-file-system";
import * as SQLite from "expo-sqlite";
import { useDBStore } from "@/store/dbStore";
import { generateTimestampedFilename } from "@/utils/helpers";
import { DEFAULT_DB_PATH } from "@/utils/constants";

import Button from "@/components/Button";
import ConfirmModal from "@/components/ConfirmModal";

export default function AboutScreen() {
	const router = useRouter();
	const { dbPath, deleteDB } = useDBStore();

	const [dialogVisible, setDialogVisible] = useState(false);

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
						style={styles.optionContainer}
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
	text: {
		fontSize: 14,
		color: "#ccc",
	},
	footerContainer: {
		gap: 15,
		width: "100%",
		paddingHorizontal: 20,
	},
});
