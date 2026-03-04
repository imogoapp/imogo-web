import { StyleSheet } from 'react-native';

import { AppTheme } from '@/constants/app-theme';

const registerWebStyles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: AppTheme.colors.background,
  },
  card: {
    maxWidth: AppTheme.sizes.authCardMaxWidth,
  },
  content: {
    width: '100%',
    gap: AppTheme.spacing.md,
  },
  twoColumns: {
    width: '100%',
    flexDirection: 'row',
    gap: 12,
  },
  columnField: {
    flex: 1,
  },
  separator: {
    height: 1,
    backgroundColor: '#cfd2da',
    marginVertical: 2,
  },
  legalRow: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  disabledButton: {
    opacity: 0.5,
  },
  queryOverline: {
    color: AppTheme.colors.muted,
    fontSize: AppTheme.typography.overline,
    marginBottom: 6,
    fontFamily: AppTheme.typography.fontRegular,
    textAlign: 'center',
  },
  queryTitle: {
    color: AppTheme.colors.text,
    fontSize: AppTheme.typography.title,
    fontFamily: AppTheme.typography.fontBold,
    textAlign: 'center',
    marginBottom: 6,
  },
  querySubtitle: {
    color: AppTheme.colors.muted,
    fontSize: AppTheme.typography.body,
    textAlign: 'center',
    marginBottom: 8,
    fontFamily: AppTheme.typography.fontRegular,
  },
  optionsList: {
    width: '100%',
    gap: 10,
    marginBottom: 10,
  },
  authBlock: {
    width: '100%',
  },
  successText: {
    color: AppTheme.colors.muted,
    fontSize: AppTheme.typography.body,
    textAlign: 'center',
    marginBottom: 20,
    fontFamily: AppTheme.typography.fontRegular,
  },
  successImage: {
    width: 240,
    height: 240,
    marginBottom: 14,
  },
});

export default registerWebStyles;
