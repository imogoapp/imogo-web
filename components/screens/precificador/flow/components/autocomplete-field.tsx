import { ScrollView, Text, TextInput, View } from "react-native";

import styles from "../styles/web-styles";

type AutocompleteFieldProps = {
  label: string;
  value: string;
  placeholder: string;
  options: string[];
  isOpen: boolean;
  disabled?: boolean;
  onFocus: () => void;
  onChangeText: (value: string) => void;
  onSelect: (value: string) => void;
};

export function AutocompleteField({
  label,
  value,
  placeholder,
  options,
  isOpen,
  disabled = false,
  onFocus,
  onChangeText,
  onSelect,
}: AutocompleteFieldProps) {
  return (
    <View style={styles.row as any}>
      <Text style={styles.subLabel as any}>{label}</Text>
      <TextInput
        value={value}
        onFocus={onFocus}
        onChangeText={onChangeText}
        editable={!disabled}
        placeholder={placeholder}
        placeholderTextColor="#A9A9A9"
        style={[
          styles.areaInput,
          styles.textInput,
          disabled && (styles.inputDisabled as any),
        ] as any}
      />

      {isOpen ? (
        <View style={styles.optionsContainer as any}>
          <ScrollView
            nestedScrollEnabled
            style={styles.optionsScroll as any}
            showsVerticalScrollIndicator={options.length > 6}
          >
            {options.length > 0 ? (
              options.map((option) => (
                <Text
                  key={option}
                  onPress={() => onSelect(option)}
                  style={styles.optionItem as any}
                >
                  {option}
                </Text>
              ))
            ) : (
              <View style={styles.optionItem as any}>
                <Text style={styles.emptyOptionText as any}>
                  {disabled
                    ? "Selecione cidade e bairro primeiro"
                    : "Nenhum endereço disponível"}
                </Text>
              </View>
            )}
          </ScrollView>
        </View>
      ) : null}
    </View>
  );
}
