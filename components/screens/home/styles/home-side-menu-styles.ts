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
    width: '80%',
    maxWidth: 320,
    height: '100%',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  closeRow: {
    alignItems: 'flex-end',
    marginBottom: 16,
  },

  /* ── User ─────────────────────────── */
  userBlock: {
    alignItems: 'center',
    marginBottom: 24,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  avatar: {
    width: 68,
    height: 68,
    borderRadius: 34,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#F2E6F6',
  },
  userName: {
    fontFamily: AppTheme.typography.fontBold,
    color: AppTheme.colors.text,
    fontSize: 18,
  },
  userEmail: {
    marginTop: 3,
    color: '#9B9DA6',
    fontSize: 13,
    fontFamily: AppTheme.typography.fontRegular,
  },

  /* ── Menu items ───────────────────── */
  menuList: {
    gap: 4,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 14,
    paddingHorizontal: 4,
    borderRadius: 12,
  },
  menuIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#F2E6F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuItemText: {
    flex: 1,
    color: AppTheme.colors.text,
    fontSize: 16,
    fontFamily: AppTheme.typography.fontBold,
  },
  menuChevron: {
    marginLeft: 'auto' as any,
  },

  /* ── Logout ───────────────────────── */
  logoutRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 14,
    paddingHorizontal: 4,
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  logoutIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#FEF2F2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutText: {
    color: '#D9534F',
    fontSize: 16,
    fontFamily: AppTheme.typography.fontBold,
  },

  /* ── Version footer ───────────────── */
  versionFooter: {
    marginTop: 'auto' as any,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    alignItems: 'center' as const,
  },
  versionText: {
    fontSize: 12,
    color: '#C4C4C4',
    fontFamily: AppTheme.typography.fontRegular,
  },
});

export default homeSideMenuStyles;
