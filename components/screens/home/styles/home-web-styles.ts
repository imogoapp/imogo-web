import { StyleSheet } from 'react-native';

import { AppTheme } from '@/constants/app-theme';

const homeWebStyles = StyleSheet.create({
  heroCard: {
    backgroundColor: '#f5f5f5',
    padding: 28,
    marginBottom: 24
  },
  welcomeMinimal: {
    fontSize: 32,
    color: AppTheme.colors.text,
    fontFamily: AppTheme.typography.fontBold,
  },
  desktopDescription: {
    marginTop: 10,
    maxWidth: 760,
    color: '#5E6272',
    fontSize: 16,
    lineHeight: 26,
    fontFamily: AppTheme.typography.fontRegular,
  },
  desktopGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -8,
  },
  desktopGridItem: {
    width: '33.3333%',
    paddingHorizontal: 8,
    paddingBottom: 16,
    minWidth: 280,
  },
  desktopSection: {
    marginBottom: 24,
  },
  desktopHighlightCard: {
    width: '100%',
    alignItems: 'flex-start',
    marginTop: 24,
  },
  desktopCardTitle: {
    color: AppTheme.colors.text,
    fontSize: 22,
    marginBottom: 10,
    fontFamily: AppTheme.typography.fontBold,
  },
  desktopCardText: {
    color: '#5E6272',
    fontSize: 15,
    lineHeight: 22,
    fontFamily: AppTheme.typography.fontRegular,
  },
  desktopActionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 20,
  },
});

export default homeWebStyles;
