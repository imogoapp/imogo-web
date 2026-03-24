import { router } from "expo-router";
import { Image } from "expo-image";
import { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import axios from "axios";

import { createBaseWebNavigationItems } from "@/components/screens/home/home-tools";
import BaseWeb from "@/components/ui/base-web";
import { AuthUser } from "@/services/auth";
import { AppTheme } from "@/constants/app-theme";
import styles from "../styles/web-styles";

type MinhasEmissoesDesktopProps = {
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

export default function MinhasEmissoesDesktop({
  user,
  onLogout,
}: MinhasEmissoesDesktopProps) {
  const [analyses, setAnalyses] = useState<Analise[]>([]);
  const [loading, setLoading] = useState(false);

  const navigationItems = useMemo(
    () =>
      createBaseWebNavigationItems({
        activeId: "certidoes",
        onNavigate: (path) => router.replace(path as never),
      }),
    [],
  );

  useEffect(() => {
    // using public_id as standard since that's what other flow pieces did
    if (user?.public_id) {
      fetchAnaliseData(String(user.public_id));
    }
  }, [user]);

  const fetchAnaliseData = async (usuario_id: string) => {
    setLoading(true);
    try {
      const response = await axios.get<Analise[]>(`https://analise3.imogo.com.br/analises/usuario/${usuario_id}`);
      setAnalyses(response.data);
    } catch (error) {
      console.error('Erro ao buscar os dados das emissões:', error);
    } finally {
      setLoading(false);
    }
  };

  const AnalysisCard = ({ item }: { item: Analise }) => {
    const getStatusText = (status: string) => {
      switch (status) {
        case 'em_progresso':
          return 'Em Progresso';
        case 'concluida':
          return 'Concluída';
        case 'pendente':
          return 'Pendente';
        default:
          return status;
      }
    };

    const getStatusColor = (status: string) => {
      switch (status) {
        case 'em_progresso':
          return '#FFA500';
        case 'concluida':
          return '#077755';
        case 'pendente':
          return '#A22C2C';
        default:
          return '#6F7480';
      }
    };

    const handlePress = () => {
      if (item.status === 'pendente') {
        router.push(`/certidoes/imovel/${item.id}` as never);
      } else {
        router.push(`/certidoes/analise/${item.id}` as never);
      }
    };

    const formatDate = (dateString: string) => {
      if (!dateString) return "";
      const date = new Date(dateString);
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    };

    return (
      <View style={styles.optionButtonsContainer}>
        <Pressable style={styles.optionButton} onPress={handlePress}>
          <Image
            source={require('@/assets/icons/files.png')}
            style={styles.optionIcon}
            contentFit="contain"
          />
          <View style={styles.optionTextContainer}>
            <Text style={styles.optionTextTitle} allowFontScaling={false}>
              Emissão de certidões #{item.id}
            </Text>
            <Text
              style={[localStyles.optionTextSubtitle, { color: getStatusColor(item.status) }]}
              allowFontScaling={false}
            >
              {getStatusText(item.status)}
              <Text style={localStyles.separatorText} allowFontScaling={false}>
                {' '}| {formatDate(item.data)}
              </Text>
            </Text>
          </View>
        </Pressable>
      </View>
    );
  };

  return (
    <BaseWeb user={user} navigationItems={navigationItems} onLogout={onLogout}>
      <ScrollView contentContainerStyle={styles.contentMinimal}>
        <Text style={styles.title}>Minhas Emissões</Text>

        <View style={styles.container}>
          {loading ? (
            <ActivityIndicator size="large" color={AppTheme.colors.primary} style={localStyles.loader} />
          ) : analyses.length > 0 ? (
            analyses.map((item) => <AnalysisCard key={item.id} item={item} />)
          ) : (
            <Text style={[styles.checkboxLabel, localStyles.emptyText]}>
              Nenhuma emissão encontrada.
            </Text>
          )}

          <View style={styles.buttonContainer}>
            <Pressable
              style={styles.laterButton}
              onPress={() => router.replace("/certidoes")}
            >
              <Image
                source={require("@/assets/icons/home.png")}
                style={styles.laterIcon}
                contentFit="contain"
              />
              <Text style={styles.laterButtonText} allowFontScaling={false}>
                Voltar para certidões
              </Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </BaseWeb>
  );
}

const localStyles = StyleSheet.create({
  optionTextSubtitle: {
    fontFamily: AppTheme.typography.fontBold,
    fontSize: 13,
    marginTop: 4,
  },
  separatorText: {
    color: "#6F7480",
    fontFamily: AppTheme.typography.fontRegular,
  },
  loader: {
    marginTop: 30,
  },
  emptyText: {
    marginTop: 20,
    textAlign: "center",
  },
});
