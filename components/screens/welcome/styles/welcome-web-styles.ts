import { StyleSheet } from 'react-native';

import { AppTheme } from '@/constants/app-theme';

const welcomeWebStyles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: AppTheme.colors.background,
  },
  card: {
    backgroundColor: AppTheme.colors.card,
    padding: AppTheme.spacing.xxl,
    borderRadius: AppTheme.radius.xl,
    alignItems: 'center',
    width: '90%',
    maxWidth: 500,
    shadowColor: AppTheme.shadow.color,
    shadowOpacity: AppTheme.shadow.opacity,
    shadowRadius: AppTheme.shadow.radius,
    shadowOffset: { width: AppTheme.shadow.offsetX, height: AppTheme.shadow.offsetY },
    elevation: AppTheme.shadow.elevation,
  },
  actions: {
    width: '100%',
    gap: AppTheme.spacing.md,
  },
});

export default welcomeWebStyles;
