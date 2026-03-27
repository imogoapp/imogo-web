import { router } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Linking, ScrollView, StyleSheet, Text, View } from "react-native";
import axios from "axios";
import Ionicons from "@expo/vector-icons/Ionicons";

import { createBaseWebNavigationItems } from "@/components/screens/home/home-tools";
import BaseWeb from "@/components/ui/base-web";
import { BaseWebButton } from "@/components/ui/base-web-button";
import { AuthUser } from "@/services/auth";
import { AppTheme } from "@/constants/app-theme";
import { styles } from "../flow/styles";
import { useAnalytics } from "@/hooks/use-analytics";

type AnaliseDetalheDesktopProps = {
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

export default function AnaliseDetalheDesktop({
  user,
  onLogout,
  analiseId,
}: AnaliseDetalheDesktopProps) {
  const { trackEvent } = useAnalytics();
  trackEvent();
  const [analiseData, setAnaliseData] = useState<AnaliseData | null>(null);
  const [proprietarios, setProprietarios] = useState<ProprietarioData[]>([]);
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
    const fetchData = async () => {
      setLoading(true);
      try {
        const analiseResponse = await axios.get<AnaliseData>(`https://analise3.imogo.com.br/analises/full/${analiseId}`);
        setAnaliseData(analiseResponse.data);

        const proprietariosResponse = await axios.get<ProprietarioData[]>(`https://analise3.imogo.com.br/analises/${analiseId}/proprietarios`);
        setProprietarios(proprietariosResponse.data);
      } catch (error) {
        console.error('Erro ao buscar dados da análise:', error);
      } finally {
        setLoading(false);
      }
    };

    if (analiseId) {
      fetchData();
    }
  }, [analiseId]);

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

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return (
    <BaseWeb user={user} navigationItems={navigationItems} onLogout={onLogout}>
      <ScrollView contentContainerStyle={styles.contentMinimal}>
        <View style={styles.container}>
          <Text style={styles.title}>Emissão de certidões</Text>
          <Text style={styles.subtitle}>Detalhes da solicitação #{analiseId}</Text>

          {loading ? (
             <ActivityIndicator size="large" color={AppTheme.colors.primary} style={{ marginTop: 40 }} />
          ) : analiseData ? (
             <View style={styles.formContainer}>
               <View style={styles.formHeader}>
                 <Text style={styles.formTitle}>Situação: <Text style={{ color: getStatusColor(analiseData.status) }}>{getStatusText(analiseData.status)}</Text></Text>
                 <Text style={styles.formSubtitle}>
                   Solicitada em {formatDate(analiseData.data)}
                 </Text>
               </View>

               <View style={styles.ownerBlock}>
                 <Text style={[styles.sectionTitle, { marginTop: 0 }]}>Dados do Imóvel</Text>
                 <View style={localStyles.infoRow}>
                   <Text style={localStyles.infoLabel}>Endereço:</Text>
                   <Text style={localStyles.infoValue}>{analiseData.imovel?.endereco || "Não informado"}</Text>
                 </View>
                 <View style={localStyles.infoRow}>
                   <Text style={localStyles.infoLabel}>Matrícula e Cartório:</Text>
                   <Text style={localStyles.infoValue}>{analiseData.imovel?.matricula || "Não informado"} do {analiseData.imovel?.cartorio || "Não informado"}</Text>
                 </View>
                 <View style={localStyles.infoRow}>
                   <Text style={localStyles.infoLabel}>Inscrição do IPTU:</Text>
                   <Text style={localStyles.infoValue}>{analiseData.imovel?.inscricao_iptu || "Não informado"}</Text>
                 </View>
               </View>

               <View style={styles.ownerBlock}>
                 <Text style={[styles.sectionTitle, { marginTop: 0 }]}>Proprietário(s)</Text>
                 {proprietarios.length > 0 ? proprietarios.map((p, index) => (
                   <View key={index} style={localStyles.infoRow}>
                     <Text style={localStyles.infoLabel}>Nome/Razão:</Text>
                     <Text style={localStyles.infoValue}>{p.nome_razao}</Text>
                   </View>
                 )) : (
                   <Text style={localStyles.infoValue}>Nenhum proprietário encontrado.</Text>
                 )}
               </View>

               {analiseData.resumo && (
                 <View style={styles.helperBox}>
                   <Ionicons name="information-circle-outline" size={18} color="#6F7480" />
                   <Text style={styles.helperText}>
                     {analiseData.resumo}
                   </Text>
                 </View>
               )}

               <View style={styles.actionsRow}>
                 <BaseWebButton
                   label="Voltar para a lista"
                   variant="secondary"
                   onPress={() => router.replace("/certidoes/minhas-emissoes" as never)}
                 />
                 {analiseData.link_pdf ? (
                   <BaseWebButton
                     label="Baixar Análise"
                     onPress={() => Linking.openURL(analiseData.link_pdf!)}
                   />
                 ) : null}
               </View>
             </View>
          ) : (
            <Text style={{ marginTop: 20, textAlign: 'center' }}>Não foi possível carregar os dados desta análise.</Text>
          )}
        </View>
      </ScrollView>
    </BaseWeb>
  );
}

const localStyles = StyleSheet.create({
  infoRow: {
    flexDirection: 'row',
    marginBottom: 8,
    flexWrap: 'wrap',
  },
  infoLabel: {
    fontFamily: AppTheme.typography.fontBold,
    fontSize: 14,
    color: AppTheme.colors.text,
    marginRight: 6,
  },
  infoValue: {
    fontFamily: AppTheme.typography.fontRegular,
    fontSize: 14,
    color: '#6F7480',
    flex: 1,
  },
});
