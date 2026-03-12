import { StyleSheet } from "react-native";
import { AppTheme } from '@/constants/app-theme';

const TrilhaWebStyles = StyleSheet.create({
  contentMinimal: {
    flexGrow: 1,
    backgroundColor: "#f5f5f5",
    paddingHorizontal: 24,
    paddingTop: 48,
    paddingBottom: 40,
    alignItems: "center",
  },
  title: { 
    fontFamily: AppTheme.typography.fontBold,
    fontSize: 26,
    fontWeight: "700",
    textAlign: "center",
    color: "#1F2024",
    marginBottom: 12,
  },
  description: {
    width: "100%",
    maxWidth: 620,
    textAlign: "center",
    fontFamily: AppTheme.typography.fontRegular,
    fontSize: 15,
    lineHeight: 24,
    color: "#4E5160",
    marginBottom: 32,
  },
  gridSection: {
    width: "100%",
    maxWidth: 920,
    alignItems: "center",
  },
});
  
export default TrilhaWebStyles;
