import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Linking,
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

type AnaliseDetalheMobileProps = {
  user: AuthUser | null;
  onLogout: () => void;
  analiseId: string;
};

type AnaliseData = {
  id: number;
  data: string;
  status: string;
  resumo: string | null;
  link_pdf: string | null;
  imovel: {
    endereco: string;
    matricula: string;
    cartorio: string;
    inscricao_iptu: string;
  } | null;
};

type ProprietarioData = {
  nome_razao: string;
  cpf_cnpj: string;
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
  return `${String(date.getDate()).padStart(2, "0")}/${String(date.getMonth() + 1).padStart(2, "0")}/${date.getFullYear()}`;
}

export default function AnaliseDetalheMobile({
  analiseId,
}: AnaliseDetalheMobileProps) {
  const [analiseData, setAnaliseData] = useState<AnaliseData | null>(null);
  const [proprietarios, setProprietarios] = useState<ProprietarioData[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [analiseRes, proprietariosRes] = await Promise.all([
          axios.get<AnaliseData>(
            `https://analise3.imogo.com.br/analises/full/${analiseId}`
          ),
          axios.get<ProprietarioData[]>(
            `https://analise3.imogo.com.br/analises/${analiseId}/proprietarios`
          ),
        ]);
        setAnaliseData(analiseRes.data);
        setProprietarios(proprietariosRes.data);
      } catch (error) {
        console.error("Erro ao buscar dados da análise:", error);
      } finally {
        setLoading(false);
      }
    };

    if (analiseId) {
      fetchData();
    }
  }, [analiseId]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.headerContainer}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={AppTheme.colors.primary} />
        </Pressable>
        <Text allowFontScaling={false} style={styles.headerTitle}>
          Detalhes da Solicitação
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
        ) : analiseData ? (
          <>
            {/* Status Card */}
            <View style={styles.formCard}>
              <Text allowFontScaling={false} style={styles.formTitle}>
                Emissão #{analiseId}
              </Text>
              <View style={styles.infoRow}>
                <Text allowFontScaling={false} style={styles.infoLabel}>
                  Situação:{" "}
                </Text>
                <Text
                  allowFontScaling={false}
                  style={[
                    styles.infoValue,
                    {
                      color: getStatusColor(analiseData.status),
                      fontFamily: AppTheme.typography.fontBold,
                    },
                  ]}
                >
                  {getStatusText(analiseData.status)}
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Text allowFontScaling={false} style={styles.infoLabel}>
                  Solicitada em:{" "}
                </Text>
                <Text allowFontScaling={false} style={styles.infoValue}>
                  {formatDate(analiseData.data)}
                </Text>
              </View>
            </View>

            {/* Dados do Imóvel */}
            <View style={styles.formCard}>
              <Text allowFontScaling={false} style={styles.formTitle}>
                Dados do Imóvel
              </Text>
              <View style={styles.infoRow}>
                <Text allowFontScaling={false} style={styles.infoLabel}>
                  Endereço:{" "}
                </Text>
                <Text allowFontScaling={false} style={styles.infoValue}>
                  {analiseData.imovel?.endereco || "Não informado"}
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Text allowFontScaling={false} style={styles.infoLabel}>
                  Matrícula:{" "}
                </Text>
                <Text allowFontScaling={false} style={styles.infoValue}>
                  {analiseData.imovel?.matricula || "Não informado"} do{" "}
                  {analiseData.imovel?.cartorio || "Não informado"}
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Text allowFontScaling={false} style={styles.infoLabel}>
                  IPTU:{" "}
                </Text>
                <Text allowFontScaling={false} style={styles.infoValue}>
                  {analiseData.imovel?.inscricao_iptu || "Não informado"}
                </Text>
              </View>
            </View>

            {/* Proprietários */}
            <View style={styles.formCard}>
              <Text allowFontScaling={false} style={styles.formTitle}>
                Proprietário(s)
              </Text>
              {proprietarios.length > 0 ? (
                proprietarios.map((p, index) => (
                  <View key={index} style={styles.infoRow}>
                    <Text allowFontScaling={false} style={styles.infoLabel}>
                      Nome/Razão:{" "}
                    </Text>
                    <Text allowFontScaling={false} style={styles.infoValue}>
                      {p.nome_razao}
                    </Text>
                  </View>
                ))
              ) : (
                <Text allowFontScaling={false} style={styles.infoValue}>
                  Nenhum proprietário encontrado.
                </Text>
              )}
            </View>

            {/* Resumo */}
            {analiseData.resumo && (
              <View style={styles.helperBox}>
                <Ionicons
                  name="information-circle-outline"
                  size={18}
                  color="#6F7480"
                />
                <Text allowFontScaling={false} style={styles.helperText}>
                  {analiseData.resumo}
                </Text>
              </View>
            )}

            {/* Actions */}
            <View style={styles.actionsContainer}>
              {analiseData.link_pdf ? (
                <Pressable
                  style={styles.primaryButton}
                  onPress={() => Linking.openURL(analiseData.link_pdf!)}
                >
                  <Text allowFontScaling={false} style={styles.primaryButtonText}>
                    Baixar Análise
                  </Text>
                </Pressable>
              ) : null}
              <Pressable
                style={styles.secondaryButton}
                onPress={() =>
                  router.replace("/certidoes/minhas-emissoes" as never)
                }
              >
                <Text allowFontScaling={false} style={styles.secondaryButtonText}>
                  Voltar para a lista
                </Text>
              </Pressable>
            </View>
          </>
        ) : (
          <Text allowFontScaling={false} style={styles.emptyText}>
            Não foi possível carregar os dados desta análise.
          </Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
