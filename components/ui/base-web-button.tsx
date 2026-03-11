import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable, StyleSheet, Text, View, type PressableProps } from 'react-native';

import { AppTheme } from '@/constants/app-theme';

type BaseWebButtonVariant = 'primary' | 'secondary' | 'disabled';

type BaseWebButtonProps = PressableProps & {
  label: string;
  variant?: BaseWebButtonVariant;
  leftIconName?: keyof typeof Ionicons.glyphMap;
};

export function BaseWebButton({ label, variant = 'primary', leftIconName, style, disabled, ...props }: BaseWebButtonProps) {
  const isDisabled = disabled || variant === 'disabled';
  const labelColor = isDisabled
    ? '#8F8A95'
    : variant === 'secondary'
      ? AppTheme.colors.text
      : AppTheme.colors.primaryText;

  return (
    <Pressable
      disabled={isDisabled}
      style={(state) => [
        styles.button,
        variant === 'primary' ? styles.buttonPrimary : undefined,
        variant === 'secondary' ? styles.buttonSecondary : undefined,
        isDisabled ? styles.buttonDisabled : undefined,
        !isDisabled && state.pressed ? styles.buttonPressed : undefined,
        typeof style === 'function' ? style(state) : style,
      ]}
      {...props}>
      <View style={styles.content}>
        {leftIconName ? <Ionicons name={leftIconName} size={18} color={labelColor} /> : null}
        <Text
          style={[
            styles.label,
            { color: labelColor },
            variant === 'secondary' ? styles.labelSecondary : undefined,
            isDisabled ? styles.labelDisabled : undefined,
          ]}>
          {label}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 46,
    borderRadius: 14,
    paddingHorizontal: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonPrimary: {
    backgroundColor: AppTheme.colors.primary,
  },
  buttonSecondary: {
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#D8D2DD',
  },
  buttonDisabled: {
    backgroundColor: '#e3e3e3',
    borderColor: '#e3e3e3',
  },
  buttonPressed: {
    opacity: 0.92,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  label: {
    fontSize: 15,
    fontFamily: AppTheme.typography.fontBold,
  },
  labelSecondary: {
    color: AppTheme.colors.text,
  },
  labelDisabled: {
    color: '#8F8A95',
  },
});
