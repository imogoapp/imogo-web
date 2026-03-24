import { AppTheme } from "@/constants/app-theme";
import { Platform, StyleSheet } from "react-native";

const webTextInputReset =
  Platform.OS === "web"
    ? ({ outlineStyle: "none", outlineWidth: 0 } as any)
    : undefined;

const PrecificadorWebStyles = StyleSheet.create({
  contentMinimal: {
    paddingVertical: 20,
    paddingHorizontal: 12,
    alignItems: "center",
  },
  formContainer: {
    width: "100%",
    maxWidth: 860,
  },
  title: {
    fontSize: 22,
    color: AppTheme.colors.text,
    fontFamily: AppTheme.typography.fontBold,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: AppTheme.colors.text,
    fontFamily: AppTheme.typography.fontBold,
    marginBottom: 16,
  },
  row: {
    width: "100%",
    marginBottom: 18,
    position: "relative",
  },
  subLabel: {
    fontSize: 14,
    color: AppTheme.colors.text,
    fontFamily: AppTheme.typography.fontBold,
    marginBottom: 8,
  },
  areaInput: {
    borderWidth: 1,
    borderColor: AppTheme.colors.inputBorder,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 14,
    fontSize: 15,
    backgroundColor: AppTheme.colors.card,
    color: AppTheme.colors.text,
    fontFamily: AppTheme.typography.fontRegular,
  },
  textInput: {
    ...webTextInputReset,
  },
  selectTrigger: {
    minHeight: 46,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  inputValue: {
    flex: 1,
    fontSize: 15,
    color: AppTheme.colors.text,
    fontFamily: AppTheme.typography.fontRegular,
  },
  placeholderText: {
    color: AppTheme.colors.muted,
  },
  inputDisabled: {
    opacity: 0.6,
  },
  disabledText: {
    color: AppTheme.colors.muted,
  },
  divider: {
    height: 1,
    width: "100%",
    backgroundColor: "#E0E0E0",
    marginVertical: 24,
  },
  optionsContainer: {
    marginTop: 6,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: AppTheme.colors.inputBorder,
    backgroundColor: AppTheme.colors.card,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  optionsScroll: {
    maxHeight: 220,
  },
  optionItem: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    fontSize: 15,
    color: AppTheme.colors.text,
    fontFamily: AppTheme.typography.fontRegular,
  },
  optionItemPressed: {
    backgroundColor: "rgba(0,0,0,0.05)",
  },
  optionText: {
    fontSize: 15,
    color: AppTheme.colors.text,
    fontFamily: AppTheme.typography.fontRegular,
  },
  emptyOptionText: {
    fontSize: 15,
    color: AppTheme.colors.muted,
    fontFamily: AppTheme.typography.fontRegular,
  },
  buttonContainer: {
    marginTop: 24,
    alignItems: "center",
  },
  saveButton: {
    minWidth: 220,
    backgroundColor: AppTheme.colors.primary,
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 24,
    alignItems: "center",
  },
  saveButtonDisabled: {
    backgroundColor: "#C6C6C6",
  },
  saveButtonText: {
    color: AppTheme.colors.primaryText,
    fontSize: 16,
    fontFamily: AppTheme.typography.fontBold,
  },
});

export default PrecificadorWebStyles;
