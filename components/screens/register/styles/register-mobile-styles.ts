import { StyleSheet } from 'react-native';

import { AppTheme } from '@/constants/app-theme';

export function createRegisterMobileStyles(width: number, height: number) {
  return StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: '#FFFFFF',
      paddingTop: 0,
    },
    container: {
      flex: 1,
      backgroundColor: '#F4F4F4',
      paddingHorizontal: width * 0.05,
      paddingTop: height * 0.05,
      paddingBottom: height * 0.03,
    },
    progressWrap: {
      marginTop: height * 0.015,
      marginBottom: height * 0.04,
    },
    content: {
      flex: 1,
    },
    title: {
      marginBottom: height * 0.015,
      textAlign: 'left',
    },
    form: {
      width: '100%',
      gap: height * 0.02,
    },
    optionsList: {
      width: '100%',
      gap: 10,
      marginTop: 8,
    },
    legalRow: {
      width: '100%',
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: 10,
    },
    helperText: {
      color: AppTheme.colors.muted,
      fontSize: width * 0.005,
      fontFamily: AppTheme.typography.fontRegular,
      marginBottom: 6,
    },
    buttonArea: {
      marginTop: height * 0.04,
    },
    primaryButton: {
      paddingVertical: height * 0.015,
      borderRadius: 30,
      width: '100%',
      alignItems: 'center',
    },
    buttonDisabled: {
      backgroundColor: '#E9E9E9',
      borderWidth: 1,
      borderColor: '#E9E9E9',
      opacity: 0.5,
    },
    successWrap: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingBottom: 24,
    },
    successImage: {
      width: width * 0.55,
      height: height * 0.26,
      marginBottom: 18,
    },
    successText: {
      color: AppTheme.colors.primary,
      fontSize: width * 0.043,
      textAlign: 'center',
      fontFamily: AppTheme.typography.fontBold,
      marginBottom: 24,
    },
  });
}
