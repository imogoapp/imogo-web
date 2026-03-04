import Ionicons from '@expo/vector-icons/Ionicons';
import { useMemo, useState } from 'react';
import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  type StyleProp,
  type TextInputProps,
  type TextStyle,
  type ViewStyle,
} from 'react-native';

import { AppTheme } from '@/constants/app-theme';

const webInputReset =
  Platform.OS === 'web'
    ? ({ outlineStyle: 'none', outlineWidth: 0, borderWidth: 0 } as unknown as TextStyle)
    : undefined;

type AppInputProps = TextInputProps & {
  label?: string;
  errorMessage?: string;
  leadingIconName?: keyof typeof Ionicons.glyphMap;
  trailingIconName?: keyof typeof Ionicons.glyphMap;
  onTrailingIconPress?: () => void;
  secureToggle?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
  inputWrapperStyle?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
};

export function AppInput({
  label,
  errorMessage,
  leadingIconName,
  trailingIconName,
  onTrailingIconPress,
  secureToggle = false,
  secureTextEntry,
  containerStyle,
  inputWrapperStyle,
  inputStyle,
  onFocus,
  onBlur,
  ...props
}: AppInputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const isSecure = secureToggle || secureTextEntry;

  const resolvedSecureTextEntry = useMemo(() => {
    if (!isSecure) {
      return false;
    }

    return !showPassword;
  }, [isSecure, showPassword]);

  const rightIconName = secureToggle
    ? showPassword
      ? 'eye-off-outline'
      : 'eye-outline'
    : trailingIconName;

  const handlePressRightIcon = () => {
    if (secureToggle) {
      setShowPassword((state) => !state);
      return;
    }

    onTrailingIconPress?.();
  };

  return (
    <View style={containerStyle}>
      {label ? <Text style={styles.label}>{label}</Text> : null}

      <View
        style={[
          styles.inputWrapper,
          isFocused && styles.inputWrapperFocused,
          !!errorMessage && styles.inputWrapperError,
          inputWrapperStyle,
        ]}>
        {leadingIconName ? <Ionicons name={leadingIconName} size={18} color="#7b8190" /> : null}

        <TextInput
          placeholderTextColor="#A9A9A9"
          autoCapitalize="none"
          style={[styles.input, webInputReset, inputStyle]}
          secureTextEntry={resolvedSecureTextEntry}
          onFocus={(event) => {
            setIsFocused(true);
            onFocus?.(event);
          }}
          onBlur={(event) => {
            setIsFocused(false);
            onBlur?.(event);
          }}
          {...props}
        />

        {rightIconName ? (
          <Pressable hitSlop={8} onPress={handlePressRightIcon}>
            <Ionicons name={rightIconName} size={18} color="#7b8190" />
          </Pressable>
        ) : null}
      </View>

      {!!errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    color: AppTheme.colors.text,
    fontSize: 15,
    fontFamily: AppTheme.typography.fontBold,
    marginBottom: AppTheme.spacing.xs,
  },
  inputWrapper: {
    width: '100%',
    borderRadius: AppTheme.radius.md,
    borderWidth: 1.5,
    borderColor: '#d7d9df',
    backgroundColor: '#ffffff',
    minHeight: 50,
    paddingHorizontal: AppTheme.spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  inputWrapperError: {
    borderColor: '#c62828',
  },
  inputWrapperFocused: {
    borderColor: AppTheme.colors.primary,
  },
  input: {
    flex: 1,
    color: AppTheme.colors.text,
    fontSize: AppTheme.typography.body,
    fontFamily: AppTheme.typography.fontRegular,
    paddingVertical: 12,
  },
  errorText: {
    marginTop: 6,
    color: '#c62828',
    fontSize: 13,
    fontFamily: AppTheme.typography.fontRegular,
  },
});
