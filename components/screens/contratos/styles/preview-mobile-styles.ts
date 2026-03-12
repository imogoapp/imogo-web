import { Platform, StyleSheet } from 'react-native';

import { AppTheme } from '@/constants/app-theme';

export function createContratosPreviewMobileStyles() {
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
    classificacaoText: {
      fontSize: 14,
      color: '#1F2024',
      marginBottom: 10,
      marginTop: 10,
      textAlign: 'center',
      paddingLeft: 20,
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
      paddingVertical: 20,
      paddingHorizontal: 15,
      alignItems: 'center',
    },
    container: {
      width: '90%',
    },
    row: {
      marginBottom: 20,
      width: '100%',
    },
    checkboxLabel: {
      textAlign: 'justify',
      fontSize: 14,
      lineHeight: 22,
      color: '#000000',
      marginLeft: 10,
      fontFamily: AppTheme.typography.fontRegular,
    },
    buttonContainer: {
      marginTop: 40,
      alignItems: 'center',
    },
    laterButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    laterIcon: {
      width: 20,
      height: 20,
      marginRight: 8,
    },
    laterButtonText: {
      color: '#730d83',
      fontSize: Platform.select({ ios: 16, android: 16, default: 16 }) ?? 16,
      fontWeight: '600',
      fontFamily: AppTheme.typography.fontBold,
    },
    optionButtonsContainer: {
      width: '100%',
      marginTop: 20,
      alignItems: 'center',
    },
    optionButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-start',
      backgroundColor: '#F5F5F5',
      borderColor: '#D3D3D3',
      borderWidth: 1,
      borderRadius: 10,
      width: '100%',
      padding: 15,
      marginBottom: 10,
    },
    optionIcon: {
      width: 24,
      height: 24,
      marginRight: 15,
    },
    optionTextContainer: {
      flexDirection: 'column',
    },
    optionTextTitle: {
      fontSize: 12,
      fontFamily: AppTheme.typography.fontBold,
      color: '#1F2024',
    },
  });
}
