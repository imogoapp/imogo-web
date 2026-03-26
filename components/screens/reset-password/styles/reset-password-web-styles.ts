import { StyleSheet } from 'react-native';

import { AppTheme } from '@/constants/app-theme';

const resetPasswordWebStyles = StyleSheet.create({
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
    maxWidth: 560,
    shadowColor: AppTheme.shadow.color,
    shadowOpacity: AppTheme.shadow.opacity,
    shadowRadius: AppTheme.shadow.radius,
    shadowOffset: { width: AppTheme.shadow.offsetX, height: AppTheme.shadow.offsetY },
    elevation: AppTheme.shadow.elevation,
  },
  content: {
    width: '100%',
    gap: AppTheme.spacing.md,
  },
  description: {
    color: AppTheme.colors.muted,
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
    fontFamily: AppTheme.typography.fontRegular,
    marginBottom: AppTheme.spacing.sm,
  },
  successWrap: {
    alignItems: 'center',
    width: '100%',
  },
  successImage: {
    width: 220,
    height: 150,
    marginBottom: AppTheme.spacing.md,
  },
  successText: {
    color: AppTheme.colors.muted,
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
    fontFamily: AppTheme.typography.fontRegular,
    marginBottom: AppTheme.spacing.lg,
  },
  backLink: {
    color: AppTheme.colors.primary,
    fontSize: 14,
    textAlign: 'center',
    fontFamily: AppTheme.typography.fontBold,
    marginTop: 4,
  },
  primaryButton: {
    minHeight: 48,
    color: AppTheme.colors.primaryText,
  },
  disabledButton: {
    backgroundColor: AppTheme.colors.backgroundDisabled,
    borderWidth: 1,
    borderColor: AppTheme.colors.backgroundDisabled,
    opacity: 0.5,
    color: AppTheme.colors.textDisabled,
  },
});

export default resetPasswordWebStyles;
