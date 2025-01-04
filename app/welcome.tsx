import { View, Text, StyleSheet, Alert } from "react-native";
import Button from "@/components/Button";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";
import * as SQLite from "expo-sqlite";
import { useRouter } from "expo-router";
import { useDBStore } from "@/store/dbStore";
import { restartApp } from "@/utils/helpers";
import { schemaStatements, DEFAULT_DB_PATH } from "@/utils/constants";

export default function WelcomeScreen() {
	const router = useRouter();
	const { dbPath, setDBExists } = useDBStore();

	async function handleImportDatabase() {
		try {
			// Pick document
			const result = await DocumentPicker.getDocumentAsync({
				type: "application/octet-stream", // SQLite files
				copyToCacheDirectory: false,
			});

			if (result.canceled) {
				return;
			}

			const { uri, name } = result.assets[0];

			// Verify file extension
			if (!name.endsWith(".db")) {
				Alert.alert(
					"Invalid File",
					"Please select a valid SQLite database file.",
				);
				return;
			}

			// Read file content
			const fileInfo = await FileSystem.getInfoAsync(uri);
			if (!fileInfo.exists) {
				Alert.alert("File Not Found", "The selected file does not exist.");
				return;
			}

			// Copy file to app's document directory
			await FileSystem.copyAsync({
				from: uri,
				to: DEFAULT_DB_PATH,
			});

			// Verify database by opening it
			const db = await SQLite.openDatabaseAsync(DEFAULT_DB_PATH);
			await db.closeAsync();

			// Update state
			setDBExists(true);

			console.log("Database imported:", DEFAULT_DB_PATH);
			Alert.alert("Success", "Database imported successfully!");
			router.replace("/(tabs)"); // Navigate to the main app
			await restartApp();
		} catch (error) {
			console.error("Error importing database:", error);
			Alert.alert("Import Failed", "Failed to import database.");
		}
	}

	async function handleCreateDatabase() {
		// Ensure dbPath has a value, falling back to a default path if null
		const resolvedDbPath = dbPath ?? DEFAULT_DB_PATH;

		let db: SQLite.SQLiteDatabase | null = null;
		try {
			db = await SQLite.openDatabaseAsync(resolvedDbPath);

			// Execute schema statements
			for (const statement of schemaStatements) {
				await db.execAsync(statement);
			}

			// Close connection before proceeding
			await db.closeAsync();

			console.log("Database created at:", resolvedDbPath);
			Alert.alert("Success", "Database created successfully!");

			setDBExists(true);
			router.replace("/(tabs)");
			await restartApp();
		} catch (error) {
			console.error("Error creating database:", error);
		} finally {
			// Ensure connection is closed even if error occurs
			if (db) {
				await db.closeAsync();
			}
		}
	}

	return (
		<View style={styles.container}>
			<Text style={styles.title}>Welcome to your Expense Tracker</Text>
			<Text style={styles.subtitle}>
				Let's get started by setting up your database.
			</Text>

			<View style={styles.buttonContainer}>
				<Button
					theme="primary"
					label="Import Database"
					onPress={handleImportDatabase}
				/>
				<Button
					theme="primary"
					label="Create New Database"
					onPress={handleCreateDatabase}
				/>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "#25292e",
		padding: 20,
	},
	title: {
		fontSize: 24,
		fontWeight: 900,
		color: "#fff",
		marginBottom: 10,
		textAlign: "center",
	},
	subtitle: {
		fontSize: 16,
		color: "#ccc",
		textAlign: "center",
		marginBottom: 20,
	},
	buttonContainer: {
		width: "100%",
		gap: 10,
		marginTop: 20,
	},
});
