import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { AppTheme } from '@/constants/app-theme';

type AppCheckboxProps = {
  checked: boolean;
  label?: string;
  onToggle: () => void;
};

export function AppCheckbox({ checked, label, onToggle }: AppCheckboxProps) {
  return (
    <Pressable style={styles.group} onPress={onToggle}>
      <View style={[styles.checkbox, checked && styles.checkboxChecked]}>
        {checked ? <Ionicons name="checkmark" size={13} color={AppTheme.colors.primaryText} /> : null}
      </View>
      {label ? <Text style={styles.label}>{label}</Text> : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  group: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: AppTheme.spacing.xs,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: '#b8bcc9',
    backgroundColor: AppTheme.colors.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    borderColor: AppTheme.colors.primary,
    backgroundColor: AppTheme.colors.primary,
  },
  label: {
    color: AppTheme.colors.text,
    fontSize: 14,
    fontFamily: AppTheme.typography.fontRegular,
  },
});
