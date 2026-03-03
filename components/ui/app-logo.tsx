import { Image } from 'expo-image';
import { StyleSheet, type ImageSourcePropType, type StyleProp, type ViewStyle } from 'react-native';

type AppLogoProps = {
  width?: number;
  height?: number;
  marginBottom?: number;
  source?: ImageSourcePropType;
  style?: StyleProp<ViewStyle>;
};

export function AppLogo({
  width = 150,
  height = 60,
  marginBottom = 20,
  source = require('@/assets/img/logo.png'),
  style,
}: AppLogoProps) {
  return <Image source={source} style={[styles.logo, { width, height, marginBottom }, style]} contentFit="contain" />;
}

const styles = StyleSheet.create({
  logo: {},
});
