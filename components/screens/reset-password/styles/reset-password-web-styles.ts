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
  primaryButton: {
    minHeight: 48,
  },
  disabledButton: {
    backgroundColor: '#E9E9E9',
    borderWidth: 1,
    borderColor: '#E9E9E9',
    opacity: 0.5,
  },
  backLink: {
    color: AppTheme.colors.primary,
    fontSize: 14,
    textAlign: 'center',
    fontFamily: AppTheme.typography.fontBold,
    marginTop: 4,
  },
});

export default resetPasswordWebStyles;
