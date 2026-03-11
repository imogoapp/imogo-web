import { StyleSheet } from 'react-native';

type HomeToolsGridStylesParams = {
  width: number;
};

export function createHomeToolsGridStyles({ width }: HomeToolsGridStylesParams) {
  const responsiveFontSize = Math.max(12, Math.min(width * 0.025, 15));
  const itemWidth = width >= 1280 ? '23%' : width >= 960 ? '31%' : '48%';

  return StyleSheet.create({
    gridContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'flex-start',
      marginTop: 20,
      gap: 12,
    },
    gridItem: {
      width: itemWidth,
      alignItems: 'center',
      marginVertical: 8,
      paddingHorizontal: 16,
      paddingVertical: 20,
      minHeight: 168,
      justifyContent: 'center',
      backgroundColor: '#F5F5F5',
      borderColor: '#D3D3D3',
      borderWidth: 1,
      borderRadius: 18,
      elevation: 3,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 8,
    },
    pressedItem: {
      opacity: 0.9,
      transform: [{ scale: 0.99 }],
    },
    disabledItem: {
      opacity: 0.5,
      backgroundColor: '#F5F5F5',
    },
    icon: {
      width: 48,
      height: 48,
      marginBottom: 8,
    },
    label: {
      fontSize: responsiveFontSize,
      maxWidth: '90%',
      lineHeight: 18,
      marginTop: 8,
      fontFamily: 'Nunito_700Bold',
      color: '#333',
      textAlign: 'center',
    },
    disabledLabel: {
      color: '#666',
    },
  });
}
