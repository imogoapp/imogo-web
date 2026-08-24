import Ionicons from "@expo/vector-icons/Ionicons";
import { Image } from "expo-image";
import { router, type Href } from "expo-router";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Alert,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  View,
  useWindowDimensions,
} from "react-native";

import {
  HomeFeatureDefinition,
  getHomeFeatureDefinitions,
} from "@/components/screens/home/home-tools";
import { MobileBottomNav } from "@/components/ui/mobile-bottom-nav";
import {
  AuthUser,
  clearSession,
  decodeJwtPayload,
  getSession,
} from "@/services/auth";
import { createHomeMobileStyles } from "./styles/home-mobile-styles";

const DEFAULT_AVATAR = "https://juca.eu.org/img/icon_dafault.jpg";

const CATEGORIES = [
  { id: "all", label: "Todos" },
  { id: "avaliacao", label: "Avaliação & Crédito" },
  { id: "documentos", label: "Documentos" },
  { id: "marketing", label: "Marketing & IA" },
  { id: "conhecimento", label: "Conhecimento" },
];

const CATEGORY_MAP: Record<string, string[]> = {
  avaliacao: ["precificador", "credito"],
  documentos: ["certidoes", "contratos", "boletos"],
  marketing: ["staging", "planejador", "anuncios"],
  conhecimento: ["trilha"],
};

function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

function decodeUserFromSession(): AuthUser | null {
  const session = getSession();
  if (!session?.token) {
    return null;
  }

  const payload = decodeJwtPayload(session.token);
  if (!payload) {
    return null;
  }

  return payload as AuthUser;
}

type HomeMobileProps = {
  user?: AuthUser | null;
  onLogout: () => void;
};

export default function HomeMobile({
  user: initialUser,
  onLogout,
}: HomeMobileProps) {
  const { width, height } = useWindowDimensions();
  const styles = useMemo(
    () => createHomeMobileStyles({ width, height }),
    [height, width],
  );

  const [user, setUser] = useState<AuthUser | null>(initialUser ?? null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    if (initialUser) {
      setUser(initialUser);
      return;
    }

    const payloadUser = decodeUserFromSession();
    if (!payloadUser) {
      clearSession();
      onLogout();
      return;
    }

    setUser(payloadUser);
  }, [initialUser, onLogout]);

  const userName =
    typeof user?.name === "string" && user.name.trim().length > 0
      ? user.name
      : "Josue Juca";
  const userPhoto =
    typeof user?.photo === "string" && user.photo.trim().length > 0
      ? user.photo
      : DEFAULT_AVATAR;

  const allFeatures = useMemo(() => getHomeFeatureDefinitions(), []);

  // Filter features by category and search query with accent-insensitive & keyword matching
  const filteredFeatures = useMemo(() => {
    const normalizedQuery = normalizeText(searchQuery);

    return allFeatures.filter((feature) => {
      // Category filter
      if (selectedCategory !== "all") {
        const allowedIds = CATEGORY_MAP[selectedCategory] || [];
        if (!allowedIds.includes(feature.id)) {
          return false;
        }
      }

      // Search query filter
      if (normalizedQuery.length > 0) {
        const normalizedLabel = normalizeText(feature.label);
        const normalizedNavLabel = normalizeText(feature.navLabel || "");
        const normalizedDesc = normalizeText(feature.description);

        const labelMatches = normalizedLabel.includes(normalizedQuery);
        const navLabelMatches = normalizedNavLabel.includes(normalizedQuery);
        const descMatches = normalizedDesc.includes(normalizedQuery);
        const keywordMatches = feature.keywords?.some(
          (k) =>
            normalizeText(k).includes(normalizedQuery) ||
            normalizedQuery.includes(normalizeText(k)),
        );

        return labelMatches || navLabelMatches || descMatches || keywordMatches;
      }

      return true;
    });
  }, [allFeatures, selectedCategory, searchQuery]);

  const isSearching = searchQuery.trim().length > 0;
  const isFiltered = isSearching || selectedCategory !== "all";

  const handleClearSearch = useCallback(() => {
    setSearchQuery("");
  }, []);

  const handleResetFilters = useCallback(() => {
    setSearchQuery("");
    setSelectedCategory("all");
  }, []);

  const handleNavigate = useCallback(
    (route?: Href, disabled?: boolean, label?: string) => {
      if (disabled) {
        Alert.alert(
          "Em breve",
          `${label || "Este recurso"} estará disponível em breve.`,
        );
        return;
      }
      if (route) {
        router.push(route as never);
      }
    },
    [],
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#f5f5f5" />

      {/* ── Top Header ───────────────────────────────── */}
      <View style={styles.headerContainer}>
        <View style={styles.logoWrapper}>
          <Image
            source={require("@/assets/img/logo.png")}
            style={styles.logo}
            contentFit="contain"
          />
        </View>

        <Pressable
          onPress={() => router.push("/conta")}
          style={styles.avatarButton}
          accessibilityLabel="Abrir minha conta"
        >
          <Image
            source={{ uri: userPhoto }}
            style={styles.avatarImage}
            contentFit="cover"
          />
        </Pressable>
      </View>

      {/* ── Main Scrollable Content ──────────────────── */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Greeting */}
        <Text style={styles.greetingText} numberOfLines={1}>
          Bem-vindo(a), {userName} 👋
        </Text>

        {/* Featured Banner Button
        Largura: 493 px
        Altura: 208 px
        Proporção (Aspect Ratio): 493 / 208 (~2.37 : 1) */}

        {/* Search Bar */}
        <View
          style={[
            styles.searchContainer,
            (isSearchFocused || isSearching) && styles.searchContainerFocused,
          ]}
        >
          <Ionicons
            name="search-outline"
            size={20}
            color={isSearchFocused || isSearching ? "#730D83" : "#9CA3AF"}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar ferramentas e serviços..."
            placeholderTextColor="#9CA3AF"
            value={searchQuery}
            onChangeText={setSearchQuery}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
            clearButtonMode="never"
            returnKeyType="search"
            autoCorrect={false}
            autoCapitalize="none"
          />
          {isSearching && (
            <Pressable
              onPress={handleClearSearch}
              style={styles.clearButton}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              accessibilityLabel="Limpar busca"
            >
              <Ionicons name="close-circle" size={20} color="#730D83" />
            </Pressable>
          )}
        </View>

        {/* Category Chips */}
        <View style={styles.categoriesContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesContent}
          >
            {CATEGORIES.map((cat) => {
              const isActive = selectedCategory === cat.id;
              return (
                <Pressable
                  key={cat.id}
                  onPress={() => setSelectedCategory(cat.id)}
                  style={[
                    styles.categoryChip,
                    isActive && styles.categoryChipActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.categoryChipText,
                      isActive && styles.categoryChipTextActive,
                    ]}
                  >
                    {cat.label}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>

        {!isFiltered && (
          <Pressable
            style={({ pressed }) => [
              styles.featuredBannerButton,
              pressed && styles.featuredBannerButtonPressed,
            ]}
            onPress={() => handleNavigate("/precificador")}
            accessibilityRole="button"
            accessibilityLabel="Avaliar agora no Precificador de Imóveis"
          >
            <Image
              source={require("@/assets/img/banner_imovel.png")}
              style={styles.featuredBannerImage}
              contentFit="contain"
            />
          </Pressable>
        )}
        {/* Section Header */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            {isFiltered
              ? isSearching
                ? "Resultados da busca"
                : "Serviços filtrados"
              : "Serviços e Ferramentas"}
          </Text>

          {isFiltered && (
            <View style={styles.searchBadgeContainer}>
              <View style={styles.searchCountBadge}>
                <Text style={styles.searchCountBadgeText}>
                  {filteredFeatures.length}{" "}
                  {filteredFeatures.length === 1 ? "item" : "itens"}
                </Text>
              </View>
            </View>
          )}
        </View>

        {/* Tools List */}
        {filteredFeatures.length > 0 ? (
          <View style={styles.toolsList}>
            {filteredFeatures.map((feature: HomeFeatureDefinition) => {
              const isDisabled = !!feature.disabled;
              const iconSource = isDisabled
                ? (feature.iconDisabled ?? feature.icon)
                : feature.icon;

              return (
                <Pressable
                  key={feature.id}
                  onPress={() =>
                    handleNavigate(feature.route, isDisabled, feature.label)
                  }
                  style={({ pressed }) => [
                    styles.toolCard,
                    isDisabled && styles.toolCardDisabled,
                    !isDisabled && pressed && styles.toolCardPressed,
                  ]}
                >
                  <View style={styles.toolIconBadge}>
                    <Image
                      source={iconSource}
                      style={styles.toolIcon}
                      contentFit="contain"
                    />
                  </View>

                  <View style={styles.toolInfo}>
                    <View style={styles.toolHeaderRow}>
                      <Text
                        style={[
                          styles.toolTitle,
                          isDisabled && styles.toolTitleDisabled,
                        ]}
                        numberOfLines={1}
                      >
                        {feature.label}
                      </Text>
                      {isDisabled && (
                        <View style={styles.badgeSoon}>
                          <Text style={styles.badgeSoonText}>Em breve</Text>
                        </View>
                      )}
                    </View>
                  </View>

                  <View style={styles.arrowCircle}>
                    <Ionicons
                      name="chevron-forward"
                      size={18}
                      color={isDisabled ? "#9CA3AF" : "#730D83"}
                    />
                  </View>
                </Pressable>
              );
            })}
          </View>
        ) : (
          <View style={styles.emptyState}>
            <View style={styles.emptyStateIconBg}>
              <Ionicons name="search-outline" size={32} color="#9CA3AF" />
            </View>
            <Text style={styles.emptyStateTitle}>
              Nenhuma ferramenta encontrada
            </Text>
            <Text style={styles.emptyStateSub}>
              Não encontramos resultados para &quot;{searchQuery}&quot;. Tente
              buscar por outros termos como avaliação, crédito, contratos ou IA.
            </Text>
            <Pressable
              onPress={handleResetFilters}
              style={({ pressed }) => [
                styles.emptyStateButton,
                pressed && styles.emptyStateButtonPressed,
              ]}
            >
              <Text style={styles.emptyStateButtonText}>
                Ver todas as ferramentas
              </Text>
            </Pressable>
          </View>
        )}
      </ScrollView>

      {/* ── Floating Bottom Navigation Dock ──────────── */}
      <MobileBottomNav activeTab="home" user={user} onLogout={onLogout} />
    </SafeAreaView>
  );
}
