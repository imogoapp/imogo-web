import { AppTheme } from "@/constants/app-theme";
import { Platform, StyleSheet } from "react-native";

const webTextInputReset =
  Platform.OS === "web"
    ? ({ outlineStyle: "none", outlineWidth: 0 } as const)
    : undefined;

const simuladorFlowWebStyles = StyleSheet.create({
  contentMinimal: {
    flexGrow: 1,
    alignItems: "center",
    paddingVertical: 24,
    paddingHorizontal: 12,
  },
  formContainer: {
    width: "100%",
    maxWidth: 480,
  },
  title: {
    fontSize: 22,
    color: AppTheme.colors.text,
    textAlign: "center",
    fontFamily: AppTheme.typography.fontBold,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    color: "#6F7480",
    textAlign: "center",
    fontFamily: AppTheme.typography.fontRegular,
    marginBottom: 24,
  },
  row: {
    width: "100%",
    marginBottom: 20,
  },
  subLabel: {
    fontSize: 14,
    color: AppTheme.colors.text,
    fontFamily: AppTheme.typography.fontBold,
    marginBottom: 10,
  },
  areaRow: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 16,
    marginBottom: 4,
  },
  areaColumn: {
    flex: 1,
  },
  areaInput: {
    borderWidth: 1,
    borderColor: "#D3D3D3",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    color: AppTheme.colors.text,
    backgroundColor: "#F5F5F5",
    fontFamily: AppTheme.typography.fontRegular,
    ...webTextInputReset,
  },
  areaInputReadonly: {
    color: "#6F7480",
  },
  divider: {
    height: 1,
    backgroundColor: "#E0E0E0",
    marginVertical: 15,
    width: "100%",
  },
  errorText: {
    marginTop: 5,
    color: "#C62828",
    fontSize: 13,
    fontFamily: AppTheme.typography.fontRegular,
  },
  buttonContainer: {
    marginTop: 40,
    alignItems: "center",
  },
  saveButton: {
    backgroundColor: AppTheme.colors.primary,
    paddingVertical: 15,
    paddingHorizontal: 120,
    borderRadius: 25,
    alignItems: "center",
    marginBottom: 20,
  },
  saveButtonDisabled: {
    backgroundColor: "#CCCCCC",
  },
  saveButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontFamily: AppTheme.typography.fontBold,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  loadingText: {
    color: "#FFFFFF",
    marginTop: 10,
    fontSize: 16,
    fontFamily: AppTheme.typography.fontBold,
  },
});

export default simuladorFlowWebStyles;
