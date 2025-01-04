import { Suspense } from "react";
import { Tabs } from "expo-router";
import { SQLiteProvider } from "expo-sqlite";
import { Ionicons } from "@expo/vector-icons";
import { DB_NAME } from "@/utils/constants";

import LoadingScreen from "@/components/LoadingScreen";

export default function TabsLayout() {
	return (
		<Suspense fallback={<LoadingScreen />}>
			<SQLiteProvider databaseName={DB_NAME} useSuspense>
				<Tabs
					screenOptions={{
						tabBarActiveTintColor: "#00c4c1",
						headerStyle: {
							backgroundColor: "#25292e",
						},
						headerShadowVisible: false,
						headerTintColor: "#fff",
						tabBarStyle: { backgroundColor: "#1f2328" },
					}}
				>
					<Tabs.Screen
						name="index"
						options={{
							title: "Home",
							tabBarIcon: ({ focused, color }) => (
								<Ionicons
									name={focused ? "home-sharp" : "home-outline"}
									color={color}
									size={24}
								/>
							),
						}}
					/>
					<Tabs.Screen
						name="settings"
						options={{
							title: "Settings",
							tabBarIcon: ({ focused, color }) => (
								<Ionicons
									name={focused ? "settings-sharp" : "settings-outline"}
									color={color}
									size={24}
								/>
							),
						}}
					/>
				</Tabs>
			</SQLiteProvider>
		</Suspense>
	);
}
