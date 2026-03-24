import { StyleSheet } from "react-native";
import { AppTheme } from "@/constants/app-theme";
import { createPrecificadorFlowMobileStyles } from "../../../precificador/flow/styles/preview-mobile-styles";

const baseMobile = createPrecificadorFlowMobileStyles();

export const simuladorResultadoMobileStyles = StyleSheet.create({
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
    color: "#4A4A4A",
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
});
