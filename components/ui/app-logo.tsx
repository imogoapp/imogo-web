import { Image, type ImageStyle } from 'expo-image';
import {
  StyleSheet,
  useWindowDimensions,
  type ImageSourcePropType,
  type StyleProp,
} from 'react-native';

type AppLogoProps = {
  width?: number;
  height?: number;
  marginBottom?: number;
  source?: ImageSourcePropType;
  style?: StyleProp<ImageStyle>;
};

export function AppLogo({
  width,
  height,
  marginBottom = 20,
  source = require('@/assets/img/logo.png'),
  style,
}: AppLogoProps) {
  const { width: screenWidth } = useWindowDimensions();
  const responsiveWidth = Math.min(168, Math.max(120, Math.round(screenWidth * 0.34)));
  const resolvedWidth = width ?? responsiveWidth;
  const resolvedHeight = height ?? Math.round(resolvedWidth * 0.4);

  return (
    <Image
      source={source}
      style={[
        styles.logo,
        { width: resolvedWidth, height: resolvedHeight, marginBottom },
        style,
      ]}
      contentFit="contain"
    />
  );
}

const styles = StyleSheet.create({
  logo: {
    alignSelf: 'center',
  },
});
