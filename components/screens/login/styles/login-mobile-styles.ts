import { StyleSheet } from 'react-native';

import { AppTheme } from '@/constants/app-theme';

export function createLoginMobileStyles(width: number, height: number) {
  return StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: AppTheme.colors.background,
      paddingTop: 0,
    },
    background: {
      flex: 1,
      width: '100%',
      height: '100%',
      justifyContent: 'flex-end',
      backgroundColor: AppTheme.colors.background,
    },
    container: {
      flex: 1,
      justifyContent: 'flex-end',
    },
    scrollContainer: {
      flexGrow: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    logoContainer: {
      height: height * 0.25,
      justifyContent: 'center',
      alignItems: 'center',
    },
    whiteContainer: {
      width: '100%',
      minHeight: height * 0.75,
      backgroundColor: AppTheme.colors.card,
      borderTopLeftRadius: 30,
      borderTopRightRadius: 30,
      paddingHorizontal: width * 0.05,
      paddingVertical: height * 0.03,
      alignItems: 'center',
      justifyContent: 'flex-start',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.2,
      shadowRadius: 1.41,
      elevation: 3,
      paddingBottom: height * 0.05,
      flexGrow: 1,
      flexShrink: 0,
    },
    title: {
      width: '100%',
      textAlign: 'left',
    },
    form: {
      width: '100%',
      gap: AppTheme.spacing.md,
    },
    optionsRow: {
      marginTop: height * 0.01,
      marginBottom: height * 0.01,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: AppTheme.spacing.md,
    },
    forgotText: {
      color: AppTheme.colors.primary,
      fontFamily: AppTheme.typography.fontBold,
    },
    primaryButton: {
      minHeight: 48,
      paddingVertical: 12,
      marginBottom: height * 0.01,
      color: AppTheme.colors.primaryText,
    },
    secondaryButton: {
      minHeight: 48,
      paddingVertical: 12,
      marginBottom: height * 0.012,
    },
    disabledButton: {
      backgroundColor: AppTheme.colors.backgroundDisabled,
      borderWidth: 1,
      borderColor: AppTheme.colors.backgroundDisabled,
      opacity: 0.5,
      color: AppTheme.colors.textDisabled,
    },
  });
}
