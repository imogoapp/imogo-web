import { StyleSheet } from "react-native";
import { AppTheme } from "@/constants/app-theme";
import { createPrecificadorFlowMobileStyles } from "../../flow/styles/preview-mobile-styles";

const baseMobile = createPrecificadorFlowMobileStyles();

export const precificadorResultadoMobileStyles = StyleSheet.create({
  safeArea: {
    ...baseMobile.safeArea,
    flex: 1,
  },
  headerContainer: baseMobile.headerContainer,
  backButton: baseMobile.backButton,
  headerTitle: baseMobile.headerTitle,
  scrollContainer: {
    ...baseMobile.scrollContainer,
    flexGrow: 1,
    justifyContent: "center",
  },
  container: baseMobile.container,
  resultHeader: {
    alignItems: "center",
    marginBottom: 32,
  },
  iconSpacing: {
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontFamily: AppTheme.typography.fontBold,
    color: AppTheme.colors.text,
    marginBottom: 8,
    textAlign: "center",
  },
  description: {
    fontSize: 16,
    color: AppTheme.colors.muted,
    fontFamily: AppTheme.typography.fontRegular,
    textAlign: "center",
    lineHeight: 22,
  },
  actionsContainer: {
    alignItems: "center",
    gap: 16,
    marginTop: 16,
    width: "100%",
  },
  actionsRow: {
    flexDirection: "column",
    justifyContent: "center",
    gap: 12,
    marginTop: 24,
    width: "100%",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: AppTheme.colors.card,
    padding: 24,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: AppTheme.typography.fontBold,
    color: AppTheme.colors.text,
    marginBottom: 16,
    textAlign: "center",
  },
  modalDescription: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 16,
    textAlign: "center",
  },
  quickActions: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 8,
    marginBottom: 16,
  },
  modalButtons: {
    flexDirection: "column",
    gap: 12,
    marginTop: 24,
  },
});
