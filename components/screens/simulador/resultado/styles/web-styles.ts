import { StyleSheet } from "react-native";
import { AppTheme } from "@/constants/app-theme";
import precificadorStyles from "../../../precificador/flow/styles/web-styles";

export const simuladorResultadoWebStyles = StyleSheet.create({
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
    color: "#4A4A4A",
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
});
