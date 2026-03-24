import { StyleSheet } from "react-native";
import { AppTheme } from "@/constants/app-theme";
import precificadorStyles from "../../flow/styles/web-styles";

export const precificadorResultadoWebStyles = StyleSheet.create({
  contentMinimal: {
    ...precificadorStyles.contentMinimal,
    flexGrow: 1,
    justifyContent: "center",
  },
  formContainer: {
    ...precificadorStyles.formContainer,
    alignItems: "center",
  },
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
  },
  description: {
    fontSize: 16,
    color: AppTheme.colors.muted,
    fontFamily: AppTheme.typography.fontRegular,
    textAlign: "center",
    maxWidth: 400,
  },
  actionsContainer: {
    alignItems: "center",
    gap: 16,
    marginTop: 16,
    width: 250,
  },
  actionsRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 12,
    marginTop: 24,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: AppTheme.colors.background,
    padding: 32,
    borderRadius: 16,
    width: "90%",
    maxWidth: 500,
    elevation: 8,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
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
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 12,
    marginTop: 24,
  },
});
