import { StyleSheet } from 'react-native';

import { AppTheme } from '@/constants/app-theme';

export function createAccountMobileStyles(width: number, _height: number) {
  const pad = width * 0.06;
  const clamp = (min: number, val: number, max: number) => Math.min(max, Math.max(min, val));

  return StyleSheet.create({
    /* ═══════ LAYOUT ═══════════════════════════════════ */
    safeArea: {
      flex: 1,
      backgroundColor: AppTheme.colors.background,
    },
// teste 


// teste 
    /* ═══════ HEADER ═══════════════════════════════════ */
    headerContainer: {
      height: 56,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 20,
      paddingVertical: 16,
      backgroundColor: AppTheme.colors.background,
    },
    backButton: {
      position: 'absolute',
      left: 20,
      width: 24,
      height: 24,
      alignItems: 'center',
      justifyContent: 'center',
    },
    headerTitle: {
      fontSize: clamp(17, width * 0.045, 20),
      color: AppTheme.colors.text,
      fontFamily: AppTheme.typography.fontBold,
      textAlign: 'center',
    },
    headerDivider: {
      height: 1,
      backgroundColor: '#E9E9E9',
    },

    /* ═══════ SCROLL ═══════════════════════════════════ */
    scrollContent: {
      paddingBottom: 40,
    },

    /* ═══════ PROFILE ══════════════════════════════════ */
    profileSection: {
      alignItems: 'center',
      paddingTop: 28,
      paddingBottom: 24,
    },
    avatar: {
      width: clamp(72, width * 0.2, 90),
      height: clamp(72, width * 0.2, 90),
      borderRadius: clamp(36, width * 0.1, 45),
      backgroundColor: AppTheme.colors.background,
    },
    profileName: {
      fontSize: clamp(17, width * 0.046, 20),
      color: AppTheme.colors.text,
      fontFamily: AppTheme.typography.fontBold,
      marginTop: 14,
      textAlign: 'center',
    },
    profileEmail: {
      fontSize: clamp(13, width * 0.035, 15),
      color: '#9B9DA6',
      fontFamily: AppTheme.typography.fontRegular,
      marginTop: 3,
      textAlign: 'center',
    },

    /* ═══════ FIELD ROW ════════════════════════════════ */
    divider: {
      height: 1,
      backgroundColor: '#ECECEC',
      marginHorizontal: pad,
    },
    fieldRow: {
      paddingHorizontal: pad,
      paddingVertical: 16,
    },
    fieldHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    fieldLabel: {
      fontSize: clamp(15, width * 0.04, 17),
      color: AppTheme.colors.text,
      fontFamily: AppTheme.typography.fontBold,
    },
    fieldAction: {
      fontSize: clamp(13, width * 0.035, 15),
      color: AppTheme.colors.text,
      fontFamily: AppTheme.typography.fontRegular,
      textDecorationLine: 'underline',
    },
    fieldValue: {
      fontSize: clamp(14, width * 0.038, 16),
      color: AppTheme.colors.text,
      fontFamily: AppTheme.typography.fontRegular,
      marginTop: 6,
    },

    /* ═══════ EDIT STATE ═══════════════════════════════ */
    editArea: {
      marginTop: 12,
      gap: 12,
    },
    editInput: {
      backgroundColor: AppTheme.colors.background,
      borderWidth: 1,
      borderColor: AppTheme.colors.border,
      borderRadius: 12,
      paddingHorizontal: 16,
      paddingVertical: 14,
      fontSize: clamp(14, width * 0.038, 16),
      color: AppTheme.colors.text,
      fontFamily: AppTheme.typography.fontRegular,
    },
    saveButton: {
      minHeight: 48,
      backgroundColor: AppTheme.colors.primary,
      borderRadius: 30,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 6,
    },
    saveButtonDisabled: {
      opacity: 0.4,
    },
    saveButtonText: {
      fontSize: clamp(15, width * 0.04, 17),
      color: '#FFFFFF',
      fontFamily: AppTheme.typography.fontBold,
    },

    /* ═══════ NAV ROW (Alterar senha, Sair, etc.) ═════ */
    navRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: pad,
      paddingVertical: 18,
    },
    navLabel: {
      fontSize: clamp(15, width * 0.04, 17),
      color: AppTheme.colors.text,
      fontFamily: AppTheme.typography.fontBold,
    },
    navLabelDanger: {
      color: '#D9534F',
    },
    navChevron: {
      color: '#C4C4C4',
    },

    /* ═══════ PASSWORD SECTION (expanded) ═════════════ */
    passwordSection: {
      paddingHorizontal: pad,
      paddingTop: 4,
      paddingBottom: 16,
      gap: 12,
    },

    /* ═══════ SUCCESS ═════════════════════════════════ */
    successBanner: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      backgroundColor: '#ECFDF5',
      borderRadius: 12,
      padding: 14,
      marginHorizontal: pad,
      marginTop: 12,
      borderWidth: 1,
      borderColor: '#A7F3D0',
    },
    successText: {
      fontSize: 14,
      color: '#065F46',
      fontFamily: AppTheme.typography.fontBold,
      flex: 1,
    },
  });
}
