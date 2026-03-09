import { StyleSheet } from 'react-native';

import { AppTheme } from '@/constants/app-theme';

const homePwaBannerStyles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: '#BBD8FF',
    backgroundColor: '#EAF3FF',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 14,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 10,
  },
  textBlock: {
    flex: 1,
  },
  title: {
    color: '#0E3A74',
    fontSize: 13,
    lineHeight: 17,
    fontFamily: AppTheme.typography.fontBold,
    marginBottom: 3,
  },
  message: {
    color: '#1E4A84',
    fontSize: 12,
    lineHeight: 16,
    fontFamily: AppTheme.typography.fontRegular,
  },
  closeButton: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
  },
  actionRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    gap: 8,
    marginTop: 10,
  },
  installButton: {
    backgroundColor: '#0E5CC0',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  installButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontFamily: AppTheme.typography.fontBold,
  },
  guideButton: {
    borderWidth: 1,
    borderColor: '#0E5CC0',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 7,
    backgroundColor: '#F4F8FF',
  },
  guideButtonText: {
    color: '#0E5CC0',
    fontSize: 12,
    fontFamily: AppTheme.typography.fontBold,
  },
});

export default homePwaBannerStyles;
