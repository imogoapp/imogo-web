import Ionicons from "@expo/vector-icons/Ionicons";
import { Pressable, ScrollView, Text, View } from "react-native";

import { AppTheme } from "@/constants/app-theme";

import styles from "../styles/web-styles";

type SelectFieldProps = {
  label: string;
  value: string;
  placeholder: string;
  options: string[];
  isOpen: boolean;
  disabled?: boolean;
  onToggle: () => void;
  onSelect: (value: string) => void;
};

export function SelectField({
  label,
  value,
  placeholder,
  options,
  isOpen,
  disabled = false,
  onToggle,
  onSelect,
}: SelectFieldProps) {
  return (
    <View style={styles.row as any}>
      <Text style={styles.subLabel as any}>{label}</Text>
      <Pressable
        onPress={onToggle}
        disabled={disabled}
        style={[
          styles.areaInput,
          styles.selectTrigger,
          disabled && (styles.inputDisabled as any),
        ] as any}
      >
        <Text
          style={[
            styles.inputValue,
            !value && (styles.placeholderText as any),
            disabled && (styles.disabledText as any),
          ] as any}
        >
          {value || placeholder}
        </Text>
        <Ionicons
          name={isOpen ? "chevron-up" : "chevron-down"}
          size={18}
          color={disabled ? "#A9A9A9" : AppTheme.colors.primary}
        />
      </Pressable>

      {isOpen ? (
        <View style={styles.optionsContainer as any}>
          <ScrollView
            nestedScrollEnabled
            style={styles.optionsScroll as any}
            showsVerticalScrollIndicator={options.length > 6}
          >
            {options.map((option) => (
              <Pressable
                key={option}
                onPress={() => onSelect(option)}
                style={({ pressed }) => [
                  styles.optionItem,
                  pressed && (styles.optionItemPressed as any),
                ] as any}
              >
                <Text style={styles.optionText as any}>{option}</Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>
      ) : null}
    </View>
  );
}
