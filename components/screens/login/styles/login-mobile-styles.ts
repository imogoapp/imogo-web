import { StyleSheet } from 'react-native';

import { AppTheme } from '@/constants/app-theme';

export function createLoginMobileStyles(width: number, height: number) {
  return StyleSheet.create({
    background: {
      flex: 1,
      width: '100%',
      height: '100%',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: AppTheme.colors.background,
    },
    container: {
      flex: 1,
      justifyContent: 'flex-start',
      alignItems: 'center',
      width: '100%',
    },
    logoContainer: {
      height: height * 0.34,
      justifyContent: 'center',
      alignItems: 'center',
    },
    whiteContainer: {
      width: '100%',
      height: height * 0.66,
      backgroundColor: AppTheme.colors.card,
      borderTopLeftRadius: 30,
      borderTopRightRadius: 30,
      paddingHorizontal: width * 0.06,
      paddingVertical: height * 0.03,
      alignItems: 'center',
      justifyContent: 'flex-start',
      position: 'absolute',
      bottom: 0,
    },
    form: {
      width: '100%',
      gap: AppTheme.spacing.md,
    },
    optionsRow: {
      marginTop: 4,
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
  });
}
