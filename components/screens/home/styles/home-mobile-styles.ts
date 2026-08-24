import { Platform, StyleSheet, TextStyle, ViewStyle } from "react-native";
import { AppTheme } from "@/constants/app-theme";

type HomeMobileStylesParams = {
  width: number;
  height: number;
};

export function createHomeMobileStyles({ width }: HomeMobileStylesParams) {
  return StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: "#F5F5F5",
    },

    /* ── Top Header ────────────────────────── */
    headerContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 20,
      paddingTop: 16,
      paddingBottom: 14,
      backgroundColor: "#F5F5F5",
    },
    logoWrapper: {
      flexDirection: "row",
      alignItems: "center",
    },
    logo: {
      width: 115,
      height: 32,
    },
    avatarButton: {
      borderRadius: 24,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 6,
      elevation: 3,
    },
    avatarImage: {
      width: 46,
      height: 46,
      borderRadius: 23,
      borderWidth: 2,
      borderColor: "#F5F5F5",
      backgroundColor: "#E5E7EB",
    },

    /* ── Scroll Content ────────────────────── */
    scrollContent: {
      paddingHorizontal: 20,
      paddingTop: 12,
      paddingBottom: 120, // Space for floating dock
    },

    /* ── Greeting ──────────────────────────── */
    greetingText: {
      fontSize: 21,
      fontFamily: AppTheme.typography.fontBold,
      color: "#111827",
      letterSpacing: -0.3,
      marginBottom: 16,
    },

    /* ── Featured Banner Button ────────────── */
    featuredBannerButton: {
      width: "100%",
      borderRadius: 20,
      overflow: "hidden",
      marginBottom: 20,
      backgroundColor: "#730D83",
      shadowColor: "#730D83",
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.25,
      shadowRadius: 12,
      elevation: 6,
      alignItems: "center",
      justifyContent: "center",
      ...(Platform.OS === "web"
        ? ({
            outlineStyle: "none",
            outlineWidth: 0,
            cursor: "pointer",
          } as unknown as ViewStyle)
        : {}),
    },
    featuredBannerButtonPressed: {
      opacity: 0.92,
      transform: [{ scale: 0.985 }],
    },
    featuredBannerImage: {
      width: "100%",
      aspectRatio: 493 / 208,
      backgroundColor: "#730D83",
      borderRadius: 20,
    },

    /* ── Search Bar ────────────────────────── */
    searchContainer: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: "#F5F5F5",
      borderRadius: 18,
      paddingHorizontal: 16,
      height: 50,
      marginTop: 4,
      marginBottom: 16,
      borderWidth: 1.5,
      borderColor: "#E5E7EB",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.04,
      shadowRadius: 6,
      elevation: 2,
      gap: 10,
    },
    searchContainerFocused: {
      borderColor: "#730D83",
      shadowColor: "#730D83",
      shadowOpacity: 0.12,
      shadowRadius: 8,
      elevation: 4,
    },
    searchInput: {
      flex: 1,
      fontSize: 15,
      fontFamily: AppTheme.typography.fontRegular,
      color: "#1F2937",
      paddingVertical: 0,
      height: "100%",
      borderWidth: 0,
      backgroundColor: "transparent",
      ...(Platform.OS === "web"
        ? ({
            outlineStyle: "none",
            outlineWidth: 0,
            boxShadow: "none",
          } as unknown as TextStyle)
        : {}),
    },
    clearButton: {
      padding: 6,
      alignItems: "center",
      justifyContent: "center",
      ...(Platform.OS === "web"
        ? ({
            outlineStyle: "none",
            outlineWidth: 0,
          } as unknown as ViewStyle)
        : {}),
    },

    /* ── Category Chips ────────────────────── */
    categoriesContainer: {
      marginBottom: 20,
    },
    categoriesContent: {
      gap: 8,
      paddingRight: 10,
    },
    categoryChip: {
      paddingHorizontal: 16,
      paddingVertical: 9,
      borderRadius: 20,
      backgroundColor: "#F5F5F5",
      borderWidth: 1,
      borderColor: "#E5E7EB",
      ...(Platform.OS === "web"
        ? ({
            outlineStyle: "none",
            outlineWidth: 0,
          } as unknown as ViewStyle)
        : {}),
    },
    categoryChipActive: {
      backgroundColor: "#730D83",
      borderColor: "#730D83",
      shadowColor: "#730D83",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 3,
    },
    categoryChipText: {
      fontSize: 13,
      fontFamily: AppTheme.typography.fontBold,
      color: "#4B5563",
    },
    categoryChipTextActive: {
      color: "#F5F5F5",
    },

    /* ── Section Title ─────────────────────── */
    sectionHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 14,
    },
    sectionTitle: {
      fontSize: 18,
      fontFamily: AppTheme.typography.fontBold,
      color: "#111827",
      letterSpacing: -0.2,
    },
    searchBadgeContainer: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
    },
    searchCountBadge: {
      backgroundColor: "#F3E8F6",
      paddingHorizontal: 8,
      paddingVertical: 3,
      borderRadius: 10,
    },
    searchCountBadgeText: {
      fontSize: 12,
      fontFamily: AppTheme.typography.fontBold,
      color: "#730D83",
    },

    /* ── Tools List / Cards ────────────────── */
    toolsList: {
      gap: 10,
    },
    toolCard: {
      backgroundColor: "#F5F5F5",
      borderRadius: 16,
      paddingVertical: 12,
      paddingHorizontal: 14,
      flexDirection: "row",
      alignItems: "center",
      borderWidth: 1,
      borderColor: "#E5E7EB",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.04,
      shadowRadius: 4,
      elevation: 2,
      minHeight: 60,
    },
    toolCardPressed: {
      backgroundColor: "#F9FAFB",
      borderColor: "#D1D5DB",
      transform: [{ scale: 0.99 }],
    },
    toolCardDisabled: {
      opacity: 0.55,
      backgroundColor: "#FAFAFA",
    },
    toolIconBadge: {
      width: 40,
      height: 40,
      borderRadius: 12,
      backgroundColor: "#F4ECFB",
      alignItems: "center",
      justifyContent: "center",
      marginRight: 12,
    },
    toolIcon: {
      width: 22,
      height: 22,
    },
    toolInfo: {
      flex: 1,
      paddingRight: 8,
      justifyContent: "center",
    },
    toolHeaderRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
    },
    toolTitle: {
      fontSize: 14.5,
      fontFamily: AppTheme.typography.fontBold,
      color: "#111827",
      letterSpacing: -0.2,
    },
    toolTitleDisabled: {
      color: "#6B7280",
    },
    badgeSoon: {
      backgroundColor: "#F3F4F6",
      paddingHorizontal: 6,
      paddingVertical: 2,
      borderRadius: 6,
    },
    badgeSoonText: {
      fontSize: 10,
      fontFamily: AppTheme.typography.fontBold,
      color: "#6B7280",
      textTransform: "uppercase",
    },
    arrowCircle: {
      width: 28,
      height: 28,
      borderRadius: 14,
      backgroundColor: "#F3F4F6",
      alignItems: "center",
      justifyContent: "center",
    },

    /* ── Empty State ───────────────────────── */
    emptyState: {
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 44,
      paddingHorizontal: 20,
    },
    emptyStateIconBg: {
      width: 72,
      height: 72,
      borderRadius: 36,
      backgroundColor: "#F3F4F6",
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 12,
    },
    emptyStateTitle: {
      fontSize: 16,
      fontFamily: AppTheme.typography.fontBold,
      color: "#374151",
      textAlign: "center",
    },
    emptyStateSub: {
      fontSize: 13,
      fontFamily: AppTheme.typography.fontRegular,
      color: "#9CA3AF",
      marginTop: 6,
      textAlign: "center",
      lineHeight: 18,
    },
    emptyStateButton: {
      marginTop: 18,
      backgroundColor: "#730D83",
      paddingHorizontal: 20,
      paddingVertical: 10,
      borderRadius: 20,
    },
    emptyStateButtonPressed: {
      opacity: 0.85,
      transform: [{ scale: 0.98 }],
    },
    emptyStateButtonText: {
      fontSize: 13,
      fontFamily: AppTheme.typography.fontBold,
      color: "#F5F5F5",
    },
  });
}
