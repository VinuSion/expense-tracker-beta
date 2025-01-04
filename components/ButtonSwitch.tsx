import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

interface ButtonOption {
  value: string;
  title: string;
  icon: any;
}

interface ButtonSwitchProps {
  options: ButtonOption[];
  selectedOption: string;
  onSelect: (option: any) => void;
}

const ButtonSwitch = ({ options, selectedOption, onSelect }: ButtonSwitchProps) => {
  return (
    <View style={styles.container}>
      {options.map((option) => (
        <TouchableOpacity
          key={option.value}
          style={[
            styles.button,
            selectedOption === option.value && styles.selectedButton,
          ]}
          onPress={() => onSelect(option.value)}
        >
          <MaterialIcons
            name={option.icon}
            size={24}
            color={selectedOption === option.value ? '#000' : '#fff'}
          />
          <Text
            style={[
              styles.buttonText,
              selectedOption === option.value && styles.selectedButtonText,
            ]}
          >
            {option.title}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  button: {
    flex: 1,
    padding: 5,
    marginHorizontal: 5,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#313f47',
    backgroundColor: '#313f47',
    alignItems: 'center',
  },
  selectedButton: {
    backgroundColor: '#00c4c1',
    borderColor: '#00c4c1',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 700,
    fontSize: 16,
  },
  selectedButtonText: {
    color: '#000',
  },
});

export default ButtonSwitch;