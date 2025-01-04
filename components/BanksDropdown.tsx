import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image, FlatList } from "react-native";
import { Bank } from "@/utils/types";

interface BanksDropdownProps {
	banks: Bank[];
	selectedBank: number | null;
  style?: object;
	setSelectedBank: (id: number | null) => void;
}

export default function BanksDropdown({
	banks,
	selectedBank,
  style,
	setSelectedBank,
}: BanksDropdownProps) {
	const [dropdownVisible, setDropdownVisible] = useState(false);

	const toggleDropdown = () => {
		setDropdownVisible(!dropdownVisible);
	};

	const selectBank = (bank: Bank) => {
		setSelectedBank(bank.id);
		setDropdownVisible(false);
	};

	return (
		<View style={[styles.container, style]}>
			<TouchableOpacity style={styles.dropdown} onPress={toggleDropdown}>
				<View style={styles.dropdownHeader}>
					<View style={styles.circle}>
						{selectedBank ? (
							<Image
								source={{
									uri: banks.find((bank) => bank.id === selectedBank)?.logo_url,
								}}
								style={styles.bankImg}
							/>
						) : (
							<View style={styles.placeholderCircle} />
						)}
					</View>
					<Text style={styles.dropdownText}>
						{selectedBank
							? banks.find((bank) => bank.id === selectedBank)?.bank_name
							: "Select a Bank"}
					</Text>
				</View>
			</TouchableOpacity>
			{dropdownVisible && (
				<View style={styles.dropdownMenu}>
					<FlatList
            data={banks}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.dropdownItem}
                onPress={() => selectBank(item)}
              >
                <View style={styles.circle}>
                  <Image source={{ uri: item.logo_url }} style={styles.bankImg} />
                </View>
                <Text style={styles.dropdownItemText}>{item.bank_name}</Text>
              </TouchableOpacity>
            )}
            ListHeaderComponent={
              <TouchableOpacity
                style={styles.dropdownItem}
                onPress={() => {
                  setSelectedBank(null);
                  setDropdownVisible(false);
                }}
              >
                <View style={styles.circle}>
                  <View style={styles.placeholderCircle} />
                </View>
                <Text style={styles.dropdownItemText}>N/A</Text>
              </TouchableOpacity>
            }
            style={styles.flatList}
          />
				</View>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		width: "100%",
	},
	dropdown: {
		backgroundColor: "#313f47",
		borderRadius: 10,
		padding: 10,
	},
	dropdownHeader: {
		flexDirection: "row",
		alignItems: "center",
	},
	circle: {
		width: 30,
		height: 30,
		borderRadius: 15,
		overflow: "hidden",
		marginRight: 10,
	},
	placeholderCircle: {
		width: "100%",
		height: "100%",
		backgroundColor: "#ccc",
	},
	bankImg: {
		width: "100%",
		height: "100%",
	},
  flatList: {
    maxHeight: 200,
  },
	dropdownText: {
		fontSize: 16,
		color: "#fff",
	},
	dropdownMenu: {
		backgroundColor: "#313f47",
		borderRadius: 10,
		marginTop: 3,
    maxHeight: 200,
	},
	dropdownItem: {
		flexDirection: "row",
		alignItems: "center",
		padding: 10,
	},
	dropdownItemText: {
		fontSize: 16,
		color: "#fff",
	},
});
