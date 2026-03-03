import {
  StyleSheet,
  Text,
  TouchableOpacity,
  type StyleProp,
  type TextStyle,
  type TouchableOpacityProps,
  type ViewStyle,
} from 'react-native';

import { AppTheme } from '@/constants/app-theme';

type AppButtonVariant = 'primary' | 'secondary';
type AppButtonSize = 'sm' | 'md' | 'lg';

type AppButtonProps = TouchableOpacityProps & {
  label: string;
  variant?: AppButtonVariant;
  size?: AppButtonSize;
  fullWidth?: boolean;
  radius?: number;
  labelStyle?: StyleProp<TextStyle>;
  containerStyle?: StyleProp<ViewStyle>;
};

const sizeStyles: Record<AppButtonSize, { paddingVertical: number; paddingHorizontal: number }> = {
  sm: { paddingVertical: 10, paddingHorizontal: 16 },
  md: { paddingVertical: 14, paddingHorizontal: 24 },
  lg: { paddingVertical: 16, paddingHorizontal: 28 },
};

export function AppButton({
  label,
  variant = 'primary',
  size = 'md',
  fullWidth = true,
  radius = AppTheme.radius.lg,
  style,
  containerStyle,
  labelStyle,
  ...props
}: AppButtonProps) {
  const isPrimary = variant === 'primary';

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      style={[
        styles.base,
        sizeStyles[size],
        { borderRadius: radius },
        fullWidth ? styles.fullWidth : undefined,
        isPrimary ? styles.primaryButton : styles.secondaryButton,
        containerStyle,
        style,
      ]}
      {...props}>
      <Text style={[isPrimary ? styles.primaryButtonText : styles.secondaryButtonText, labelStyle]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullWidth: {
    width: '100%',
  },
  primaryButton: {
    backgroundColor: AppTheme.colors.primary,
  },
  primaryButtonText: {
    color: AppTheme.colors.primaryText,
    fontSize: AppTheme.typography.button,
    fontFamily: AppTheme.typography.fontBold,
  },
  secondaryButton: {
    borderColor: AppTheme.colors.border,
    borderWidth: 1.5,
    backgroundColor: AppTheme.colors.card,
  },
  secondaryButtonText: {
    color: AppTheme.colors.text,
    fontSize: AppTheme.typography.button,
    fontFamily: AppTheme.typography.fontBold,
  },
});
