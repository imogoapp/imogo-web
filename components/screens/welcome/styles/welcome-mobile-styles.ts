import { StyleSheet } from 'react-native';

import { AppTheme } from '@/constants/app-theme';

export function createWelcomeMobileStyles(width: number, height: number) {
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
      height: height * 0.5,
      justifyContent: 'center',
      alignItems: 'center',
    },
    whiteContainer: {
      width: '100%',
      height: height * 0.5,
      backgroundColor: AppTheme.colors.card,
      borderTopLeftRadius: 30,
      borderTopRightRadius: 30,
      paddingHorizontal: width * 0.06,
      paddingVertical: height * 0.02,
      alignItems: 'center',
      justifyContent: 'center',
      position: 'absolute',
      bottom: 0,
    },
    actions: {
      width: '100%',
      gap: height * 0.012,
    },
  });
}
