import { StyleSheet } from 'react-native';

import { AppTheme } from '@/constants/app-theme';

const loginWebStyles = StyleSheet.create({
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
  form: {
    width: '100%',
    gap: AppTheme.spacing.md,
  },
  optionsRow: {
    marginTop: 4,
    marginBottom: 4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: AppTheme.spacing.md,
  },
  forgotText: {
    color: AppTheme.colors.primary,
    fontSize: 14,
    fontFamily: AppTheme.typography.fontBold,
  },
  dividerText: {
    textAlign: 'center',
    color: '#6b7280',
    fontSize: 14,
    fontFamily: AppTheme.typography.fontRegular,
    marginVertical: 2,
  },
});

export default loginWebStyles;
