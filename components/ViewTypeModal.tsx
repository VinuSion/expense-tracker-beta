import { useState } from "react";
import { View, Text, Modal, StyleSheet, TouchableOpacity } from "react-native";
import { BlurView } from "expo-blur";
import ButtonSwitch from './ButtonSwitch';
import { useDBStore } from '@/store/dbStore';
import { viewOptions } from "@/utils/constants";

interface ViewTypeModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function ViewTypeModal({
  visible,
  onClose,
}: ViewTypeModalProps) {
  const { viewType, setViewType } = useDBStore();
  const [selectedViewType, setSelectedViewType] = useState(viewType);

  const handleConfirm = () => {
    setViewType(selectedViewType);
    onClose();
  };

  return (
    <Modal
      transparent={true}
      animationType="fade"
      visible={visible}
      onRequestClose={onClose}
    >
      <BlurView
        style={styles.overlay}
        tint="systemMaterialDark"
        intensity={30}
        experimentalBlurMethod="dimezisBlurView"
      >
        <View style={styles.modalContainer}>
          <Text style={styles.title}>Change View Type</Text>
          <ButtonSwitch
            options={viewOptions}
            selectedOption={selectedViewType}
            onSelect={setSelectedViewType}
          />
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={onClose}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, { backgroundColor: "#00c4c1" }]}
              onPress={handleConfirm}
            >
              <Text style={styles.buttonText}>Confirm</Text>
            </TouchableOpacity>
          </View>
        </View>
      </BlurView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: 300,
    padding: 20,
    backgroundColor: "#313f47",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#25292e",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 900,
    marginBottom: 10,
    color: "#fff",
  },
  message: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center",
    color: "#fff",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  button: {
    flex: 1,
    padding: 10,
    marginHorizontal: 5,
    borderRadius: 5,
    alignItems: "center",
    backgroundColor: "#25292e",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
});