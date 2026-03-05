import { StyleSheet } from 'react-native';

import { AppTheme } from '@/constants/app-theme';

export function createResetPasswordMobileStyles(width: number, height: number) {
  return StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: '#F5F5F5',
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
    description: {
      color: AppTheme.colors.muted,
      fontFamily: AppTheme.typography.fontRegular,
      width: '100%',
      textAlign: 'left',
      marginBottom: height * 0.02,
      lineHeight: 21,
    },
    form: {
      width: '100%',
      gap: AppTheme.spacing.md,
    },
    primaryButton: {
      minHeight: 48,
      paddingVertical: 12,
    },
    buttonDisabled: {
      backgroundColor: '#E9E9E9',
      borderWidth: 1,
      borderColor: '#E9E9E9',
      opacity: 0.5,
    },
    successWrap: {
      width: '100%',
      alignItems: 'center',
    },
    successImage: {
      width: width * 0.58,
      height: height * 0.2,
      marginBottom: height * 0.02,
    },
    successText: {
      color: AppTheme.colors.muted,
      fontFamily: AppTheme.typography.fontRegular,
      textAlign: 'center',
      marginBottom: height * 0.02,
      lineHeight: 21,
      width: '100%',
    },
    backLink: {
      color: AppTheme.colors.primary,
      fontFamily: AppTheme.typography.fontBold,
      textAlign: 'center',
      marginTop: 4,
    },
  });
}
