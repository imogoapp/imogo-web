import { StyleSheet } from 'react-native';

type HomeToolsGridStylesParams = {
  width: number;
};

export function createHomeToolsGridStyles({ width }: HomeToolsGridStylesParams) {
  const responsiveFontSize = Math.max(12, Math.min(width * 0.025, 15));

  return StyleSheet.create({
    gridContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      marginTop: 20,
      gap: 12,
    },
    gridItem: {
      width: '48%',
      alignItems: 'center',
      marginVertical: 8,
      padding: 12,
      backgroundColor: '#F5F5F5',
      borderColor: '#D3D3D3',
      borderRadius: 10,
      elevation: 3,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    pressedItem: {
      opacity: 0.8,
    },
    disabledItem: {
      opacity: 0.5,
      backgroundColor: '#E8E8E8',
    },
    icon: {
      width: 40,
      height: 40,
      marginBottom: 4,
    },
    label: {
      fontSize: responsiveFontSize,
      maxWidth: '90%',
      lineHeight: 16,
      marginTop: 8,
      fontWeight: 'bold',
      color: '#333',
      textAlign: 'center',
    },
    disabledLabel: {
      color: '#666',
    },
  });
}
