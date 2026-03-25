import { StyleSheet } from 'react-native';

import { AppTheme } from '@/constants/app-theme';

const accountWebStyles = StyleSheet.create({  
  outerWrap: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 4,
  },
  contentWrap: {
    width: '100%',
    maxWidth: 640,
  },
  
  pageTitle: {
    fontSize: 28,
    color: AppTheme.colors.text,
    fontFamily: AppTheme.typography.fontBold,
    marginBottom: 4,
  },
  pageSubtitle: {
    fontSize: 15,
    color: AppTheme.colors.text,
    fontFamily: AppTheme.typography.fontRegular,
    marginBottom: 28,
  },
  
  profileCard: {
    backgroundColor: AppTheme.colors.background,
    borderRadius: 16,
    padding: 28,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: AppTheme.colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 22,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: AppTheme.colors.background,
  },
  profileMeta: {
    flex: 1,
    gap: 2,
  },
  profileName: {
    fontSize: 20,
    color: AppTheme.colors.text,
    fontFamily: AppTheme.typography.fontBold,
  },
  profileEmail: {
    fontSize: 14,
    color: AppTheme.colors.text,
    fontFamily: AppTheme.typography.fontRegular,
  },
  
  sectionCard: {
    backgroundColor: AppTheme.colors.background,
    borderRadius: 16,
    paddingVertical: 8,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: AppTheme.colors.border,
    overflow: 'hidden',
  },
  sectionTitle: {
    fontSize: 13,
    color: AppTheme.colors.text,
    fontFamily: AppTheme.typography.fontBold,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    paddingHorizontal: 28,
    paddingTop: 18,
    paddingBottom: 10,
  },
  
  divider: {
    height: 1,
    backgroundColor: AppTheme.colors.border,
    marginHorizontal: 28,
  },
  fieldRow: {
    paddingHorizontal: 28,
    paddingVertical: 16,
  },
  fieldHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  fieldLabel: {
    fontSize: 15,
    color: AppTheme.colors.text,
    fontFamily: AppTheme.typography.fontBold,
  },
  fieldAction: {
    fontSize: 14,
    color: AppTheme.colors.text,
    fontFamily: AppTheme.typography.fontRegular,
    textDecorationLine: 'underline',
  },
  fieldValue: {
    fontSize: 15,
    color: AppTheme.colors.text,
    fontFamily: AppTheme.typography.fontRegular,
    marginTop: 4,
  },
  
  editArea: {
    marginTop: 14,
    gap: 14,
  },
  editRow: {
    flexDirection: 'row',
    gap: 14,
  },
  editField: {
    flex: 1,
  },
  editInput: {
    backgroundColor: AppTheme.colors.background,
    borderWidth: 1,
    borderColor: AppTheme.colors.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: AppTheme.colors.text,
    fontFamily: AppTheme.typography.fontRegular,
  },
  editInputLabel: {
    fontSize: 13,
    color: AppTheme.colors.text,
    fontFamily: AppTheme.typography.fontBold,
    marginBottom: 6,
  },
  editInputDisabled: {
    backgroundColor: AppTheme.colors.background,
    color: '#9B9DA6', 
  },
  saveButtonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 6,
  },
  saveButton: {
    minHeight: 46,
    backgroundColor: AppTheme.colors.primary,
    borderRadius: 30,
    paddingHorizontal: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonDisabled: {
    opacity: 0.4,
  },
  saveButtonText: {
    fontSize: 15,
    color: '#FFFFFF',
    fontFamily: AppTheme.typography.fontBold,
  },
  cancelButtonText: {
    fontSize: 14,
    color: '#9B9DA6',
    fontFamily: AppTheme.typography.fontRegular,
    textDecorationLine: 'underline',
  },
  
  navRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 28,
    paddingVertical: 16,
  },
  navLabel: {
    fontSize: 15,
    color: AppTheme.colors.text,
    fontFamily: AppTheme.typography.fontBold,
  },
  navLabelDanger: {
    color: '#D9534F',
  },
  
  passwordArea: {
    paddingHorizontal: 28,
    paddingTop: 4,
    paddingBottom: 18,
    gap: 14,
  },
  
  successBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#ECFDF5',
    borderRadius: 12,
    padding: 14,
    marginBottom: 20,
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

export default accountWebStyles;
