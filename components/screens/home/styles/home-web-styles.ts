import { StyleSheet } from 'react-native';

import { AppTheme } from '@/constants/app-theme';

const homeWebStyles = StyleSheet.create({
  heroCard: {
    backgroundColor: '#f5f5f5',
    paddingVertical: 4,
    paddingHorizontal: 0,
    marginBottom: 20,
  },
  welcomeMinimal: {
    fontSize: 24,
    lineHeight: 30,
    color: AppTheme.colors.text,
    fontFamily: AppTheme.typography.fontBold,
  },
  desktopDescription: {
    marginTop: 6,
    maxWidth: 680,
    color: '#5E6272',
    fontSize: 14,
    lineHeight: 22,
    fontFamily: AppTheme.typography.fontRegular,
  },
  desktopGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'stretch',
    marginHorizontal: -8,
  },
  desktopGridItem: {
    paddingHorizontal: 8,
    paddingBottom: 16,
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
