import { Text, StyleSheet, type TextProps } from 'react-native';

import { AppTheme } from '@/constants/app-theme';

type AppDividerTextProps = TextProps;

export function AppDividerText({ style, children, ...props }: AppDividerTextProps) {
  return (
    <Text style={[styles.text, style]} {...props}>
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  text: {
    textAlign: 'center',
    color: AppTheme.colors.muted,
    fontSize: AppTheme.typography.bodySm,
    fontFamily: AppTheme.typography.fontRegular,
    marginVertical: 10,
  },
});
