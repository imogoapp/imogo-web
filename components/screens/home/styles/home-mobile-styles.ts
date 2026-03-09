import { StyleSheet } from 'react-native';

type HomeMobileStylesParams = {
  width: number;
  height: number;
};

export function createHomeMobileStyles({ width, height }: HomeMobileStylesParams) {
  return StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: '#F5F5F5',
    },
    headerContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: width * 0.05,
      paddingVertical: height * 0.02,
      backgroundColor: '#F5F5F5',
    },
    menuButton: {
      width: 24,
      height: 24,
      alignItems: 'center',
      justifyContent: 'center',
    },
    menuIcon: {
      width: 24,
      height: 24,
    },
    logoWrapper: {
      flex: 1,
      alignItems: 'center',
    },
    logo: {
      width: width * 0.55,
      height: height * 0.05,
    },
    headerRightSpacer: {
      width: 24,
      height: 24,
    },
    headerDivider: {
      height: 1,
      backgroundColor: '#E9E9E9',
    },
    content: {
      paddingHorizontal: 16,
      paddingTop: 20,
      paddingBottom: 24,
    },
  });
}
