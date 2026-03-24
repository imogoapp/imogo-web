import { StyleSheet } from "react-native";
import { AppTheme } from "@/constants/app-theme";

export const flowMobileStyles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },

  // ─── Header ────────────────────────────────────────────────────
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "#F5F5F5",
    borderBottomWidth: 1,
    borderBottomColor: "#ECECEC",
  },
  headerTitle: {
    fontSize: 16,
    fontFamily: AppTheme.typography.fontBold,
    color: "#1F2024",
    textAlign: "center",
  },
  backButton: {
    position: "absolute",
    left: 20,
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
  },

  // ─── Scroll ────────────────────────────────────────────────────
  scrollContainer: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    paddingBottom: 40,
  },

  // ─── Progress Card ─────────────────────────────────────────────
  progressCard: {
    backgroundColor: "#F5F5F5",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#ECECEC",
  },
  progressHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  progressStep: {
    flex: 1,
    position: "relative",
    alignItems: "flex-start",
  },
  progressDot: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F5F5F5",
    marginBottom: 6,
    zIndex: 1,
  },
  progressDotDone: {
    backgroundColor: "#077755",
  },
  progressDotCurrent: {
    backgroundColor: AppTheme.colors.primary,
  },
  progressDotText: {
    fontSize: 12,
    color: "#6F7480",
    fontFamily: AppTheme.typography.fontBold,
  },
  progressDotTextCurrent: {
    color: "#FFFFFF",
  },
  progressLabel: {
    fontSize: 12,
    color: "#6F7480",
    fontFamily: AppTheme.typography.fontBold,
  },
  progressLabelCurrent: {
    color: AppTheme.colors.text,
    fontSize: 12,
    fontFamily: AppTheme.typography.fontBold,
  },
  progressLine: {
    position: "absolute",
    top: 13,
    left: 34,
    right: 10,
    height: 1,
    backgroundColor: "#F5F5F5",
  },
  progressDescription: {
    fontSize: 13,
    lineHeight: 19,
    color: "#6F7480",
    fontFamily: AppTheme.typography.fontRegular,
  },

  // ─── Form Card ─────────────────────────────────────────────────
  formCard: {
    backgroundColor: "#F5F5F5",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#ECECEC",
  },
  formTitle: {
    fontSize: 17,
    fontFamily: AppTheme.typography.fontBold,
    color: AppTheme.colors.text,
    marginBottom: 16,
  },

  // ─── Owner / Company Block ─────────────────────────────────────
  ownerBlock: {
    backgroundColor: "#F5F5F5",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#EEE8F2",
    padding: 14,
    marginBottom: 14,
  },
  ownerHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  ownerTitle: {
    fontSize: 14,
    fontFamily: AppTheme.typography.fontBold,
    color: AppTheme.colors.text,
  },
  removeButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#F1D1D1",
    backgroundColor: "#F5F5F5",
  },
  removeButtonText: {
    fontSize: 12,
    color: "#A22C2C",
    fontFamily: AppTheme.typography.fontBold,
  },

  // ─── Fields ────────────────────────────────────────────────────
  fieldSpacing: {
    marginBottom: 14,
  },
  fieldSpacingLast: {
    marginBottom: 0,
  },

  // ─── Select ────────────────────────────────────────────────────
  selectLabel: {
    color: AppTheme.colors.text,
    fontSize: 15,
    fontFamily: AppTheme.typography.fontBold,
    marginBottom: 8,
  },
  selectTrigger: {
    minHeight: 50,
    borderWidth: 1.5,
    borderColor: AppTheme.colors.inputBorder,
    borderRadius: 14,
    backgroundColor: "#F5F5F5",
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },
  selectValue: {
    flex: 1,
    color: AppTheme.colors.text,
    fontSize: 15,
    fontFamily: AppTheme.typography.fontRegular,
  },
  selectPlaceholder: {
    color: "#A9A9A9",
  },
  optionsContainer: {
    marginTop: 6,
    borderWidth: 1,
    borderColor: "#D3D3D3",
    borderRadius: 14,
    backgroundColor: "#F5F5F5",
    overflow: "hidden",
  },
  optionItem: {
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  optionItemPressed: {
    backgroundColor: "#F5F5F5",
  },
  optionText: {
    color: AppTheme.colors.text,
    fontSize: 14,
    fontFamily: AppTheme.typography.fontRegular,
  },

  // ─── Spouse Block ──────────────────────────────────────────────
  spouseBlock: {
    marginTop: 12,
    borderWidth: 1,
    borderColor: "#D8D2DD",
    borderRadius: 12,
    backgroundColor: "#F5F5F5",
    padding: 12,
  },
  spouseTitle: {
    fontSize: 13,
    fontFamily: AppTheme.typography.fontBold,
    color: AppTheme.colors.text,
    marginBottom: 12,
  },

  // ─── Add Button ────────────────────────────────────────────────
  addButton: {
    minHeight: 46,
    borderWidth: 1,
    borderColor: "#D8B8E1",
    borderRadius: 12,
    borderStyle: "dashed",
    backgroundColor: "#F5F5F5",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
  },
  addButtonText: {
    fontSize: 14,
    color: AppTheme.colors.primary,
    fontFamily: AppTheme.typography.fontBold,
  },

  // ─── Actions ───────────────────────────────────────────────────
  actionsContainer: {
    gap: 10,
    marginTop: 8,
  },
  primaryButton: {
    minHeight: 50,
    backgroundColor: AppTheme.colors.primary,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  primaryButtonDisabled: {
    opacity: 0.5,
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontFamily: AppTheme.typography.fontBold,
  },
  secondaryButton: {
    minHeight: 50,
    backgroundColor: "transparent",
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: AppTheme.colors.primary,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  secondaryButtonText: {
    color: AppTheme.colors.primary,
    fontSize: 15,
    fontFamily: AppTheme.typography.fontBold,
  },

  // ─── Divider & Section ─────────────────────────────────────────
  divider: {
    height: 1,
    backgroundColor: "#E7DFEC",
    marginVertical: 8,
  },
  sectionTitle: {
    marginTop: 12,
    marginBottom: 12,
    fontSize: 15,
    color: AppTheme.colors.text,
    fontFamily: AppTheme.typography.fontBold,
  },

  // ─── Helper Box ────────────────────────────────────────────────
  helperBox: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    borderWidth: 1,
    borderColor: "#E7DFEC",
    borderRadius: 12,
    backgroundColor: "#F5F5F5",
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 14,
  },
  helperText: {
    flex: 1,
    color: "#6F7480",
    fontSize: 13,
    lineHeight: 19,
    fontFamily: AppTheme.typography.fontRegular,
  },

  // ─── Info Row (Analise Detalhe) ─────────────────────────────────
  infoRow: {
    flexDirection: "row",
    marginBottom: 8,
    flexWrap: "wrap",
    gap: 4,
  },
  infoLabel: {
    fontFamily: AppTheme.typography.fontBold,
    fontSize: 13,
    color: AppTheme.colors.text,
  },
  infoValue: {
    fontFamily: AppTheme.typography.fontRegular,
    fontSize: 13,
    color: "#6F7480",
    flex: 1,
  },

  // ─── Success Card ──────────────────────────────────────────────
  successCard: {
    backgroundColor: "#F5F5F5",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#ECECEC",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 36,
  },
  successIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#077755",
    marginBottom: 16,
  },
  successTitle: {
    fontSize: 18,
    fontFamily: AppTheme.typography.fontBold,
    color: AppTheme.colors.text,
    textAlign: "center",
    marginBottom: 8,
  },
  successText: {
    fontSize: 14,
    lineHeight: 21,
    color: "#6F7480",
    fontFamily: AppTheme.typography.fontRegular,
    textAlign: "center",
    marginBottom: 24,
  },

  // ─── Empty / Loading ───────────────────────────────────────────
  emptyText: {
    textAlign: "center",
    fontSize: 14,
    color: "#6F7480",
    fontFamily: AppTheme.typography.fontRegular,
    marginTop: 20,
  },
  loader: {
    marginTop: 40,
  },

  // ─── Analysis Card (Minhas Emissoes) ───────────────────────────
  analysisCard: {
    backgroundColor: "#F5F5F5",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#ECECEC",
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  analysisCardIcon: {
    width: 40,
    height: 40,
  },
  analysisCardContent: {
    flex: 1,
  },
  analysisCardTitle: {
    fontSize: 14,
    fontFamily: AppTheme.typography.fontBold,
    color: AppTheme.colors.text,
    marginBottom: 4,
  },
  analysisCardStatus: {
    fontSize: 13,
    fontFamily: AppTheme.typography.fontBold,
  },
  analysisCardDate: {
    fontSize: 12,
    color: "#6F7480",
    fontFamily: AppTheme.typography.fontRegular,
  },
  analysisCardChevron: {
    opacity: 0.4,
  },

  // ─── Back to link ──────────────────────────────────────────────
  linkButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    gap: 6,
  },
  linkButtonText: {
    color: AppTheme.colors.primary,
    fontSize: 14,
    fontFamily: AppTheme.typography.fontBold,
  },
});
