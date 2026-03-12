import Ionicons from "@expo/vector-icons/Ionicons";
import { Image } from "expo-image";
import { StyleSheet, Text, View, useWindowDimensions } from "react-native";

import { ExternalLink } from "@/components/external-link";
import { AppTheme } from "@/constants/app-theme";
import type { TrilhaCardItem } from "@/components/screens/trilha/content";

type TrilhaCardGridProps = {
  items: TrilhaCardItem[];
  maxWidth?: number;
};

export function TrilhaCardGrid({
  items,
  maxWidth = 920,
}: TrilhaCardGridProps) {
  const { width } = useWindowDimensions();
  const isCompactMobile = width < 768;
  const horizontalPadding = isCompactMobile ? 32 : 48;
  const availableWidth = Math.min(width - horizontalPadding, maxWidth);
  const columns = width < 768 ? 3 : width < 1080 ? 4 : 5;
  const gap = isCompactMobile ? 10 : 18;
  const cardWidth = Math.max(
    isCompactMobile ? 84 : 92,
    Math.floor((availableWidth - gap * (columns - 1)) / columns),
  );
  const cardHeight = Math.round(cardWidth * (isCompactMobile ? 1.32 : 1.38));

  return (
    <View style={[styles.grid, { maxWidth, gap }]}>
      {items.map((item) => {
        const cardStyle = StyleSheet.flatten([
          styles.card,
          { width: cardWidth, height: cardHeight },
          item.locked ? styles.cardLocked : undefined,
        ]);

        const cardContent = (
          <>
            <Image
              source={{ uri: item.image }}
              style={styles.image}
              contentFit="cover"
            />

            {item.locked ? (
              <View style={styles.lockOverlay}>
                <Ionicons name="lock-closed-outline" size={28} color="#FFFFFF" />
                {item.unlockDate ? (
                  <Text allowFontScaling={false} style={styles.unlockDateText}>
                    {item.unlockDate}
                  </Text>
                ) : null}
              </View>
            ) : null}
          </>
        );

        if (item.locked) {
          return (
            <View key={item.id} style={cardStyle}>
              {cardContent}
            </View>
          );
        }

        return (
          <ExternalLink key={item.id} href={item.link} style={cardStyle}>
            <View style={styles.cardContent}>{cardContent}</View>
          </ExternalLink>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    width: "100%",
    flexDirection: "row",
    flexWrap: "wrap",
    alignSelf: "center",
    justifyContent: "center",
  },
  card: {
    borderRadius: 14,
    overflow: "hidden",
    backgroundColor: "#FFFFFF",
    shadowColor: "#000000",
    shadowOpacity: 0.12,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 12,
    elevation: 5,
    display: "flex",
  },
  cardContent: {
    flex: 1,
  },
  cardLocked: {
    backgroundColor: "#E6E6E6",
  },
  image: {
    width: "100%",
    height: "100%",
    backgroundColor: "#F0F0F0",
  },
  lockOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(31, 32, 36, 0.62)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  unlockDateText: {
    marginTop: 8,
    color: "#FFFFFF",
    fontSize: 13,
    lineHeight: 18,
    textAlign: "center",
    fontFamily: AppTheme.typography.fontBold,
  },
});
