import { View, StyleSheet, type ViewProps } from 'react-native';

import { AppTheme } from '@/constants/app-theme';

type AppCardProps = ViewProps & {
  maxWidth?: number;
};

export function AppCard({ style, maxWidth = AppTheme.sizes.authCardMaxWidth, ...props }: AppCardProps) {
  return <View style={[styles.card, { maxWidth }, style]} {...props} />;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: AppTheme.colors.card,
    padding: AppTheme.spacing.xxl,
    borderRadius: AppTheme.radius.xl,
    alignItems: 'center',
    width: '90%',
    shadowColor: AppTheme.shadow.color,
    shadowOpacity: AppTheme.shadow.opacity,
    shadowRadius: AppTheme.shadow.radius,
    shadowOffset: { width: AppTheme.shadow.offsetX, height: AppTheme.shadow.offsetY },
    elevation: AppTheme.shadow.elevation,
  },
});
