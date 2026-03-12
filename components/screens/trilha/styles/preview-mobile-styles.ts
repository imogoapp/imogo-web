import { StyleSheet } from 'react-native';

import { AppTheme } from '@/constants/app-theme';

export function createTrilhaPreviewMobileStyles() {
  return StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: '#F5F5F5',
    },
    headerContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 20,
      paddingVertical: 16,
      backgroundColor: '#F5F5F5',
    },
    headerTitle: {
      fontSize: 16,
      fontFamily: AppTheme.typography.fontBold,
      color: '#1F2024',
      textAlign: 'center',
    },
    backButton: {
      position: 'absolute',
      left: 20,
      width: 24,
      height: 24,
      alignItems: 'center',
      justifyContent: 'center',
    },
    scrollContainer: {
      paddingVertical: 12,
      paddingHorizontal: 16,
      alignItems: 'center',
    },
    container: {
      width: '100%',
      maxWidth: 420,
      alignItems: 'center',
    },
    description: {
      width: '100%',
      textAlign: 'center',
      fontSize: 14,
      lineHeight: 22,
      color: '#4E5160',
      marginBottom: 24,
      fontFamily: AppTheme.typography.fontRegular,
      paddingHorizontal: 8,
    },
  });
}
