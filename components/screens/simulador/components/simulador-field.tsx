import { Text, TextInput, View } from "react-native";

import styles from "../styles/simulador-web-styles";

type SimuladorFieldProps = {
  label: string;
  value: string;
  placeholder: string;
  onChangeText?: (value: string) => void;
  keyboardType?: "default" | "numeric" | "phone-pad" | "email-address";
  editable?: boolean;
  errorMessage?: string;
};

export function SimuladorField({
  label,
  value,
  placeholder,
  onChangeText,
  keyboardType = "default",
  editable = true,
  errorMessage,
}: SimuladorFieldProps) {
  return (
    <View style={styles.row}>
      <Text style={styles.subLabel}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#A9A9A9"
        keyboardType={keyboardType}
        editable={editable}
        style={[styles.areaInput, !editable && styles.areaInputReadonly]}
      />
      {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
    </View>
  );
}
