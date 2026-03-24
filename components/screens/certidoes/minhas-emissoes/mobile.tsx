import { Image } from "expo-image";
import { router } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  SafeAreaView,
  ScrollView,
  Text,
  View,
} from "react-native";
import axios from "axios";

import { AuthUser } from "@/services/auth";
import { AppTheme } from "@/constants/app-theme";
import { flowMobileStyles as styles } from "../flow/styles/flow-mobile-styles";

type MinhasEmissoesMobileProps = {
  user: AuthUser | null;
  onLogout: () => void;
};

type Analise = {
  id: number;
  resumo: string | null;
  data: string;
  status: "pendente" | "concluida" | "em_progresso" | string;
  link_pdf: string | null;
  usuario_id: string;
};

function getStatusText(status: string) {
  switch (status) {
    case "em_progresso":
      return "Em Progresso";
    case "concluida":
      return "Concluída";
    case "pendente":
      return "Pendente";
    default:
      return status;
  }
}

function getStatusColor(status: string) {
  switch (status) {
    case "em_progresso":
      return "#FFA500";
    case "concluida":
      return "#077755";
    case "pendente":
      return "#A22C2C";
    default:
      return "#6F7480";
  }
}

function formatDate(dateString: string) {
  if (!dateString) return "";
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

export default function MinhasEmissoesMobile({
  user,
}: MinhasEmissoesMobileProps) {
  const [analyses, setAnalyses] = useState<Analise[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user?.public_id) {
      fetchAnaliseData(String(user.public_id));
    }
  }, [user]);

  const fetchAnaliseData = async (usuario_id: string) => {
    setLoading(true);
    try {
      const response = await axios.get<Analise[]>(
        `https://analise3.imogo.com.br/analises/usuario/${usuario_id}`
      );
      setAnalyses(response.data);
    } catch (error) {
      console.error("Erro ao buscar os dados das emissões:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCardPress = (item: Analise) => {
    if (item.status === "pendente") {
      router.push(`/certidoes/imovel/${item.id}` as never);
    } else {
      router.push(`/certidoes/analise/${item.id}` as never);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.headerContainer}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={AppTheme.colors.primary} />
        </Pressable>
        <Text allowFontScaling={false} style={styles.headerTitle}>
          Minhas Emissões
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {loading ? (
          <ActivityIndicator
            size="large"
            color={AppTheme.colors.primary}
            style={styles.loader}
          />
        ) : analyses.length > 0 ? (
          analyses.map((item) => (
            <Pressable
              key={item.id}
              style={({ pressed }) => [
                styles.analysisCard,
                pressed && { opacity: 0.75 },
              ]}
              onPress={() => handleCardPress(item)}
            >
              <Image
                source={require("@/assets/icons/files.png")}
                style={styles.analysisCardIcon}
                contentFit="contain"
              />
              <View style={styles.analysisCardContent}>
                <Text
                  allowFontScaling={false}
                  style={styles.analysisCardTitle}
                >
                  Emissão de certidões #{item.id}
                </Text>
                <Text
                  allowFontScaling={false}
                  style={[
                    styles.analysisCardStatus,
                    { color: getStatusColor(item.status) },
                  ]}
                >
                  {getStatusText(item.status)}
                  {"  "}
                  <Text style={styles.analysisCardDate}>
                    {formatDate(item.data)}
                  </Text>
                </Text>
              </View>
              <Ionicons
                name="chevron-forward"
                size={18}
                color="#6F7480"
                style={styles.analysisCardChevron}
              />
            </Pressable>
          ))
        ) : (
          <Text allowFontScaling={false} style={styles.emptyText}>
            Nenhuma emissão encontrada.
          </Text>
        )}

        <Pressable
          style={styles.linkButton}
          onPress={() => router.replace("/certidoes")}
        >
          <Ionicons name="arrow-back" size={16} color={AppTheme.colors.primary} />
          <Text allowFontScaling={false} style={styles.linkButtonText}>
            Voltar para certidões
          </Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}
