import { StyleSheet } from 'react-native';

import { AppTheme } from '@/constants/app-theme';

const homeWebStyles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  content: {
    flexGrow: 1,
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: '100%',
    maxWidth: 560,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    color: AppTheme.colors.text,
    fontFamily: AppTheme.typography.fontBold,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: '#333',
    fontFamily: AppTheme.typography.fontBold,
    marginBottom: 6,
  },
  email: {
    fontSize: 14,
    color: '#666',
    fontFamily: AppTheme.typography.fontRegular,
    marginBottom: 18,
  },
  message: {
    textAlign: 'center',
    color: '#555',
    fontSize: 14,
    marginBottom: 16,
    fontFamily: AppTheme.typography.fontRegular,
  },
});

export default homeWebStyles;
