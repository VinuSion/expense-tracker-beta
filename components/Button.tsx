import { FontAwesome } from "@expo/vector-icons";
import {
	StyleSheet,
	View,
	Pressable,
	Text,
	GestureResponderEvent,
} from "react-native";

type BtnProps = {
	label: string;
	theme?: "primary";
	icon?: keyof typeof FontAwesome.glyphMap;
	style?: object;
	onPress?: (event: GestureResponderEvent) => void;
};

export default function Button({
	label,
	theme,
	icon,
	style,
	onPress,
}: BtnProps) {
	if (theme === "primary") {
		return (
			<View style={[styles.btnContainer, style]}>
				<Pressable
					style={[
						styles.button,
						{
							backgroundColor: "#fff",
						},
					]}
					onPress={onPress}
				>
					{icon && (
						<FontAwesome
							name={icon}
							size={18}
							color="#25292e"
							style={styles.btnIcon}
						/>
					)}
					<Text style={[styles.btnLabel, { color: "#25292e", fontWeight: 800 }]}>{label}</Text>
				</Pressable>
			</View>
		);
	} else {
		return (
			<View style={[styles.btnContainer, style]}>
				<Pressable style={styles.button} onPress={onPress}>
					<Text style={styles.btnLabel}>{label}</Text>
				</Pressable>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	btnContainer: {
		width: "100%",
		height: 50,
		alignItems: "center",
		justifyContent: "center",
	},
	button: {
		borderRadius: 15,
		width: "100%",
		height: "100%",
		justifyContent: "center",
		alignItems: "center",
		flexDirection: "row",
	},
	btnIcon: {
		paddingRight: 8,
	},
	btnLabel: {
		color: "#fff",
		fontSize: 16,
	},
});
