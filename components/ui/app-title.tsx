import { StyleSheet, Text, type StyleProp, type TextProps, type TextStyle } from 'react-native';

import { AppTheme } from '@/constants/app-theme';

type AppTitleProps = TextProps & {
  size?: number;
  align?: 'left' | 'center' | 'right';
  marginBottom?: number;
  weight?: 'regular' | 'bold';
  textStyle?: StyleProp<TextStyle>;
};

export function AppTitle({
  style,
  textStyle,
  children,
  size = AppTheme.typography.title,
  align = 'center',
  marginBottom = AppTheme.spacing.xl,
  weight = 'bold',
  ...props
}: AppTitleProps) {
  return (
    <Text
      style={[
        styles.title,
        {
          fontSize: size,
          textAlign: align,
          marginBottom,
          fontFamily: weight === 'bold' ? AppTheme.typography.fontBold : AppTheme.typography.fontRegular,
        },
        textStyle,
        style,
      ]}
      {...props}>
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  title: {
    color: AppTheme.colors.text,
  },
});
