import { StyleSheet } from 'react-native';

import { AppTheme } from '@/constants/app-theme';

const homeSideMenuStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  container: {
    width: '78%',
    height: '100%',
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  closeRow: {
    alignItems: 'flex-end',
    marginBottom: 20,
  },
  userBlock: {
    alignItems: 'center',
    marginBottom: 22,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#EAEAEA',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 10,
  },
  userName: {
    fontFamily: AppTheme.typography.fontBold,
    color: '#333',
    fontSize: 18,
  },
  userEmail: {
    marginTop: 4,
    color: '#666',
    fontSize: 13,
    fontFamily: AppTheme.typography.fontRegular,
  },
  menuList: {
    marginTop: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#EDEDED',
  },
  menuItemText: {
    color: '#333',
    fontSize: 16,
    fontFamily: AppTheme.typography.fontRegular,
  },
  logoutItem: {
    marginTop: 12,
    borderBottomWidth: 0,
  },
  logoutText: {
    color: '#D9534F',
    fontFamily: AppTheme.typography.fontBold,
  },
});

export default homeSideMenuStyles;
