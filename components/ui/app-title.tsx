import { StyleSheet, Text, type StyleProp, type TextProps, type TextStyle } from 'react-native';

import { AppTheme } from '@/constants/app-theme';

type AppTitleProps = TextProps & {
  size?: number;
  maxSize?: number;
  align?: 'left' | 'center' | 'right';
  marginBottom?: number;
  weight?: 'regular' | 'bold';
  color?: string;
  textStyle?: StyleProp<TextStyle>;
};

export function AppTitle({
  style,
  textStyle,
  children,
  size = AppTheme.typography.title,
  maxSize = AppTheme.typography.title,
  align = 'center',
  marginBottom = AppTheme.spacing.xl,
  weight = 'bold',
  color = AppTheme.colors.text,
  ...props
}: AppTitleProps) {
  const resolvedSize = Math.min(size, maxSize);

  return (
    <Text
      allowFontScaling={false}
      style={[
        styles.title,
        {
          fontSize: resolvedSize,
          textAlign: align,
          marginBottom,
          color,
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
