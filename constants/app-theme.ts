export const AppTheme = {
  colors: {
    background: '#f4f7fb',
    card: '#ffffff',
    text: '#1F2024',
    primary: '#730d83',
    primaryText: '#ffffff',
    border: '#1F2024',
  },
  spacing: {
    xs: 8,
    sm: 12,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 40,
  },
  radius: {
    md: 16,
    lg: 25,
    xl: 32,
  },
  typography: {
    title: 24,
    body: 16,
    button: 16,
    fontRegular: 'Nunito_400Regular',
    fontBold: 'Nunito_700Bold',
  },
  shadow: {
    color: '#000',
    opacity: 0.1,
    radius: 12,
    offsetX: 0,
    offsetY: 4,
    elevation: 8,
  },
} as const;
