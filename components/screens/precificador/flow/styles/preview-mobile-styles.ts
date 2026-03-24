import { Platform, StyleSheet } from "react-native";

import { AppTheme } from "@/constants/app-theme";

export function createPrecificadorFlowMobileStyles() {
  return StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: AppTheme.colors.background,
    },
    headerContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: 20,
      paddingVertical: 16,
      backgroundColor: AppTheme.colors.background,
    },
    headerTitle: {
      fontSize: 16,
      fontFamily: AppTheme.typography.fontBold,
      color: AppTheme.colors.text,
      textAlign: "center",
    },
    backButton: {
      position: "absolute",
      left: 20,
      width: 24,
      height: 24,
      alignItems: "center",
      justifyContent: "center",
    },
    scrollContainer: {
      paddingVertical: 20,
      paddingHorizontal: 16,
      alignItems: "center",
    },
    container: {
      width: "94%",
    },
    introText: {
      fontSize: 14,
      lineHeight: 20,
      color: "#2F3036",
      textAlign: "left",
      marginBottom: 16,
      fontFamily: AppTheme.typography.fontRegular,
    },
    stepperRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 16,
    },
    stepItem: {
      alignItems: "center",
      flex: 1,
    },
    stepCircle: {
      width: 28,
      height: 28,
      borderRadius: 14,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "#E0E0E0",
      marginBottom: 4,
    },
    stepCircleActive: {
      backgroundColor: "#730D83",
    },
    stepNumber: {
      fontSize: 12,
      fontFamily: AppTheme.typography.fontBold,
      color: "#4A4A4A",
    },
    stepNumberActive: {
      color: AppTheme.colors.background,
    },
    stepLabel: {
      fontSize: 10,
      color: "#7A7A7A",
      textAlign: "center",
      fontFamily: AppTheme.typography.fontRegular,
    },
    stepLabelActive: {
      color: "#1F2024",
      fontFamily: AppTheme.typography.fontBold,
    },
    stepLine: {
      height: 2,
      backgroundColor: "#E0E0E0",
      flex: 1,
      marginTop: 12,
    },
    stepLineActive: {
      backgroundColor: "#730D83",
    },
    sectionTitle: {
      fontSize: 18,
      color: AppTheme.colors.text,
      fontFamily: AppTheme.typography.fontBold,
      marginBottom: 6,
    },
    sectionSubtitle: {
      fontSize: 13,
      color: "#7A7A7A",
      fontFamily: AppTheme.typography.fontRegular,
      marginBottom: 16,
    },
    fieldGroup: {
      marginBottom: 14,
    },
    fieldLabel: {
      fontSize: 13,
      color: "#1F2024",
      fontFamily: AppTheme.typography.fontBold,
      marginBottom: 6,
    },
    input: {
      borderWidth: 1,
      borderColor: AppTheme.colors.inputBorder,
      borderRadius: 10,
      paddingHorizontal: 14,
      paddingVertical:
        Platform.select({ ios: 12, android: 10, default: 12 }) ?? 12,
      fontSize: 14,
      backgroundColor: AppTheme.colors.card,
      fontFamily: AppTheme.typography.fontRegular,
      color: AppTheme.colors.text,
    },
    inputRow: {
      flexDirection: "row",
      gap: 12,
    },
    inputHalf: {
      flex: 1,
    },
    chipRow: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 8,
    },
    chip: {
      borderWidth: 1,
      borderColor: "#D3D3D3",
      backgroundColor: AppTheme.colors.background,
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 16,
    },
    chipActive: {
      backgroundColor: "#730D83",
      borderColor: "#730D83",
    },
    chipText: {
      fontSize: 12,
      color: "#1F2024",
      fontFamily: AppTheme.typography.fontBold,
    },
    chipTextActive: {
      color: AppTheme.colors.background,
    },
    summaryCard: {
      backgroundColor: AppTheme.colors.background,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: "#E6E6E6",
      padding: 14,
      marginTop: 8,
    },
    summaryTitle: {
      fontSize: 14,
      color: "#1F2024",
      fontFamily: AppTheme.typography.fontBold,
      marginBottom: 8,
    },
    summaryText: {
      fontSize: 12,
      color: "#4A4A4A",
      marginBottom: 4,
      fontFamily: AppTheme.typography.fontRegular,
    },
    actionsRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      marginTop: 20,
    },
    primaryButton: {
      flex: 1,
      backgroundColor: "#730D83",
      paddingVertical: 14,
      borderRadius: 24,
      alignItems: "center",
    },
    primaryButtonDisabled: {
      backgroundColor: "#C6C6C6",
    },
    primaryButtonText: {
      color: "#F5F5F5",
      fontFamily: AppTheme.typography.fontBold,
      fontSize: 14,
    },
    secondaryButton: {
      flex: 1,
      borderWidth: 1,
      borderColor: "#D3D3D3",
      paddingVertical: 14,
      borderRadius: 24,
      alignItems: "center",
      backgroundColor: AppTheme.colors.background,
    },
    secondaryButtonText: {
      color: "#1F2024",
      fontFamily: AppTheme.typography.fontBold,
      fontSize: 14,
    },
    footerLink: {
      marginTop: 24,
      alignItems: "center",
    },
    footerLinkText: {
      color: "#730D83",
      fontSize: 14,
      fontFamily: AppTheme.typography.fontBold,
    },
    classificacaoText: {
      fontSize: 16,
      fontFamily: AppTheme.typography.fontBold,
      color: "#1F2024",
      marginBottom: 10,
      textAlign: "left",
      paddingLeft: 20,
    },
    divider: {
      height: 1,
      backgroundColor: "#E0E0E0",
      marginVertical: 15,
      width: "100%",
    },
    row: {
      marginBottom: 20,
      width: "100%",
    },
    subLabel: {
      fontSize: 14,
      fontFamily: AppTheme.typography.fontBold,
      color: "#1F2024",
      marginBottom: 10,
    },
    areaInput: {
      borderWidth: 1,
      borderColor: AppTheme.colors.inputBorder,
      borderRadius: 10,
      paddingVertical: 10,
      paddingHorizontal: 15,
      fontSize: 14,
      backgroundColor: AppTheme.colors.card,
      minHeight: 48,
    },
    optionsContainer: {
      backgroundColor: AppTheme.colors.card,
      borderColor: AppTheme.colors.inputBorder,
      borderWidth: 1,
      borderRadius: 10,
      marginTop: 5,
      elevation: 3,
      shadowColor: "#000",
      shadowOpacity: 0.1,
      shadowRadius: 4,
      shadowOffset: { width: 0, height: 2 },
    },
    optionItem: {
      paddingVertical: 12,
      paddingHorizontal: 15,
      borderBottomWidth: 1,
      borderBottomColor: "#EAEAEA",
    },
    optionText: {
      fontSize: 14,
      color: "#1F2024",
      fontFamily: AppTheme.typography.fontRegular,
    },
    inputContainer: {
      width: "100%",
    },
  });
}
