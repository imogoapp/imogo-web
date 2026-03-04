import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { AppTheme } from '@/constants/app-theme';

type AppOptionCardProps = {
  label: string;
  selected: boolean;
  onPress: () => void;
};

export function AppOptionCard({ label, selected, onPress }: AppOptionCardProps) {
  return (
    <Pressable style={[styles.optionButton, selected && styles.optionButtonSelected]} onPress={onPress}>
      <View style={styles.row}>
        <Text style={[styles.optionText, selected && styles.optionTextSelected]}>{label}</Text>
        {selected ? <Ionicons name="checkmark" size={18} color={AppTheme.colors.primary} /> : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  optionButton: {
    backgroundColor: AppTheme.colors.card,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#d2d6df',
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  optionButtonSelected: {
    borderColor: AppTheme.colors.primary,
    backgroundColor: '#f5eaf7',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  optionText: {
    color: AppTheme.colors.text,
    fontSize: AppTheme.typography.body,
    fontFamily: AppTheme.typography.fontRegular,
  },
  optionTextSelected: {
    color: AppTheme.colors.primary,
    fontFamily: AppTheme.typography.fontBold,
  },
});
