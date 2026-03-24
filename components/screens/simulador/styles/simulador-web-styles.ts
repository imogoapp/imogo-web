import { StyleSheet } from "react-native";

import { AppTheme } from "@/constants/app-theme";

const simuladorWebStyles = StyleSheet.create({
  contentMinimal: {
    flexGrow: 1,
    backgroundColor: "#f5f5f5",
    paddingHorizontal: 24,
    paddingTop: 48,
    paddingBottom: 32,
    alignItems: "center",
  },
  title: {
    fontFamily: AppTheme.typography.fontBold,
    fontSize: 22,
    fontWeight: "700",
    textAlign: "center",
    color: "#1F2024",
    marginBottom: 16,
  },
  container: {
    width: "100%",
    maxWidth: 480,
    alignItems: "center",
  },
  row: {
    width: "100%",
    marginBottom: 24,
  },
  checkboxLabel: {
    textAlign: "justify",
    fontFamily: AppTheme.typography.fontRegular,
    fontSize: 15,
    lineHeight: 22,
    color: "#1F2024",
  },
  optionButtonsContainer: {
    width: "100%",
    marginTop: 8,
  },
  optionButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    borderColor: "#E0E0E0",
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 18,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    elevation: 1,
  },
  optionIcon: {
    width: 24,
    height: 24,
    marginRight: 12,
  },
  optionTextContainer: {
    flex: 1,
  },
  optionTextTitle: {
    fontFamily: AppTheme.typography.fontBold,
    fontSize: 15,
    fontWeight: "bold",
    color: "#1F2024",
  },
  buttonContainer: {
    marginTop: 32,
    alignItems: "center",
  },
  laterButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  laterIcon: {
    width: 20,
    height: 20,
    marginRight: 8,
  },
  laterButtonText: {
    color: "#730d83",
    fontSize: 15,
    fontFamily: AppTheme.typography.fontBold,
    fontWeight: "600",
  },
});

export default simuladorWebStyles;
