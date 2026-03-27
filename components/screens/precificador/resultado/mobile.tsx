import { router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Linking,
  Modal,
  Platform,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import axios from "axios";
import { Ionicons } from "@expo/vector-icons";  
import { AppButton } from "@/components/ui/app-button";
import { AppInput } from "@/components/ui/app-input";
import { AppTheme } from "@/constants/app-theme";
import { precificadorResultadoMobileStyles as styles } from "./styles/mobile-styles";
import { useAnalytics } from "@/hooks/use-analytics";

type PrecificadorResultadoMobileProps = {
  resultado: any;
};

function formatCurrencyBR(value = 0) {
  const n = Math.round(value || 0);
  try {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(n);
  } catch {
    const v = String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    return `R$ ${v}`;
  }
}

function parseBRLCurrencyToNumber(text = "") {
  const digits = String(text).replace(/\D/g, "");
  return Number(digits || 0);
}

export default function PrecificadorResultadoMobile({ resultado }: PrecificadorResultadoMobileProps) {
  const { trackEvent } = useAnalytics();
  trackEvent();
  
  const estimativa = resultado?.resultado;
  const [estimativaLocal, setEstimativaLocal] = useState(estimativa || null);

  const valorEstimadoOriginalRef = useRef(
    typeof estimativa?.valor_estimado === "number" ? estimativa.valor_estimado : 0,
  );

  const [valorEditModalVisible, setValorEditModalVisible] = useState(false);
  const [valorEditNumero, setValorEditNumero] = useState(
    typeof estimativa?.valor_estimado === "number" ? estimativa.valor_estimado : 0,
  );
  const [valorEditTexto, setValorEditTexto] = useState(
    formatCurrencyBR(typeof estimativa?.valor_estimado === "number" ? estimativa.valor_estimado : 0),
  );

  const [gerandoLaudo, setGerandoLaudo] = useState(false);

  useEffect(() => {
    if (typeof estimativa?.valor_estimado === "number") {
      setEstimativaLocal(estimativa);
      setValorEditNumero(estimativa.valor_estimado);
      setValorEditTexto(formatCurrencyBR(estimativa.valor_estimado));
      valorEstimadoOriginalRef.current = estimativa.valor_estimado;
    }
  }, [estimativa]);

  const precoFormatado =
    estimativaLocal?.formatado_ptbr?.valor_estimado ??
    (typeof estimativaLocal?.valor_estimado === "number"
      ? formatCurrencyBR(estimativaLocal.valor_estimado)
      : "—");

  const onChangeValorText = (text: string) => {
    const number = parseBRLCurrencyToNumber(text);
    setValorEditNumero(number);
    setValorEditTexto(formatCurrencyBR(number));
  };

  const confirmarEdicao = () => {
    if (!Number.isFinite(valorEditNumero) || valorEditNumero <= 0) {
      Alert.alert("Valor inválido", "Por favor, insira um valor maior que zero.");
      return;
    }
    setEstimativaLocal((prev: any) => ({
      ...prev,
      valor_estimado: valorEditNumero,
      formatado_ptbr: {
        ...(prev?.formatado_ptbr || {}),
        valor_estimado: formatCurrencyBR(valorEditNumero),
      },
    }));
    setValorEditModalVisible(false);
  };

  const adjustBy = (delta: number) => {
    const v = Math.max(0, (valorEditNumero || 0) + delta);
    setValorEditNumero(v);
    setValorEditTexto(formatCurrencyBR(v));
  };

  const adjustByPercent = (pct: number) => {
    const base = valorEditNumero || 0;
    const v = Math.max(0, Math.round(base * (1 + pct)));
    setValorEditNumero(v);
    setValorEditTexto(formatCurrencyBR(v));
  };

  const baseValor = estimativaLocal?.valor_estimado || 0;
  const deltaValor = (valorEditNumero || 0) - baseValor;
  const deltaPct = baseValor > 0 ? deltaValor / baseValor : 0;
  
  const formatSignedCurrency = (n: number) => {
    const sign = n > 0 ? "+" : n < 0 ? "-" : "";
    return `${sign}${formatCurrencyBR(Math.abs(n))}`;
  };
  
  const formatSignedPercent = (ratio: number) => {
    const pct = Math.round((ratio || 0) * 100);
    const sign = pct > 0 ? "+" : pct < 0 ? "-" : "";
    return `${sign}${Math.abs(pct)}%`;
  };

  const handleBaixarLaudo = async () => {
    try {
      setGerandoLaudo(true);
      const imovel = resultado?.imovel || resultado?.dados_imovel || {};
      const payload = {
        bairro: imovel.bairro ?? "",
        cidade: imovel.cidade ?? "",
        endereco: imovel.endereco ?? "",
        estado_conservacao: imovel.estado_conservacao ?? "",
        tipo: imovel.tipo ?? "",
        quartos: Number(imovel.quartos ?? 0),
        suites: Number(imovel.suites ?? 0),
        vagas: Number(imovel.vagas ?? 0),
        metragem: String(imovel.metragem_param ?? ""),
        valor_m2_ponderado: String(estimativa?.valor_m2_ponderado ?? ""),
        valor_imovel: formatCurrencyBR(estimativaLocal?.valor_estimado || 0),
        valor_estimado: formatCurrencyBR(valorEstimadoOriginalRef.current || 0),
      };

      const { data } = await axios.post(
        "https://gateway-laudo.vercel.app/api/laudo/gerar",
        payload,
        { headers: { "Content-Type": "application/json" }, timeout: 60000 }
      );

      if (data?.ok && data?.docx_response) {
        const pdflink = data.docx_response.pdf_url;
        if (pdflink) {
          if (Platform.OS === "web") {
            window.open(pdflink, "_blank", "noopener,noreferrer");
          } else {
            if (await Linking.canOpenURL(pdflink)) await Linking.openURL(pdflink);
          }
        }
      } else {
        Alert.alert("Erro", data?.mensagem || "Não foi possível gerar.");
      }
    } catch (err: any) {
      Alert.alert("Erro", err?.response?.data?.mensagem || "Erro ao gerar o laudo.");
    } finally {
      setGerandoLaudo(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => router.replace("/precificador")} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#730d83" />
        </TouchableOpacity>
        <Text allowFontScaling={false} style={styles.headerTitle}>Resultado</Text>
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.container}>
            {resultado?.ok === false ? (
              <View style={{ backgroundColor: AppTheme.colors.card, padding: 24, borderRadius: 16, marginBottom: 16, borderWidth: 1, borderColor: AppTheme.colors.inputBorder }}>
                <Text style={{ fontSize: 18, fontFamily: AppTheme.typography.fontBold, color: AppTheme.colors.text }}>Não foi possível gerar</Text>
                <Text style={{ marginTop: 12, color: AppTheme.colors.muted, fontSize: 15 }}>{resultado?.mensagem || "Sem amostras suficientes."}</Text>
              </View>
            ) : (
              <>
                <View style={{ backgroundColor: AppTheme.colors.card, padding: 32, borderRadius: 20, alignItems: "center", marginBottom: 24, borderWidth: 1, borderColor: AppTheme.colors.inputBorder, shadowColor: "#000", shadowOpacity: 0.04, shadowRadius: 10, shadowOffset: { width: 0, height: 4 } }}>
                  <Image
                    source={require("@/assets/img/money.png")}
                    style={{ width: 140, height: 140, marginBottom: 20 }}
                    resizeMode="contain"
                  />
                  <Text style={{ fontSize: 18, fontFamily: AppTheme.typography.fontBold, textAlign: "center", marginBottom: 8, color: AppTheme.colors.text }}>Precificação Concluída!</Text>
                  <Text style={{ color: AppTheme.colors.muted, textAlign: "center", marginBottom: 20, fontSize: 14 }}>O valor estimado para este imóvel é:</Text>
                  <Text style={{ fontSize: 40, fontFamily: AppTheme.typography.fontBold, color: AppTheme.colors.primary }}>{precoFormatado}</Text>
                </View>

                <View style={styles.actionsRow}>
                  <TouchableOpacity 
                    style={{ 
                      flexDirection: 'row', 
                      alignItems: 'center', 
                      backgroundColor: AppTheme.colors.card, 
                      borderColor: AppTheme.colors.inputBorder, 
                      borderWidth: 1, 
                      borderRadius: 12, 
                      padding: 16, 
                      marginBottom: 12,
                      width: '100%' 
                    }} 
                    onPress={() => setValorEditModalVisible(true)}
                  >
                    <Image
                      source={require("@/assets/icons/avaliador-roxo.png")}
                      style={{ width: 24, height: 24, marginRight: 16 }}
                    />
                    <Text style={{ fontSize: 16, fontFamily: AppTheme.typography.fontBold, color: AppTheme.colors.text }}>Ajustar Valor</Text>
                  </TouchableOpacity>

                  <TouchableOpacity 
                    style={{ 
                      flexDirection: 'row', 
                      alignItems: 'center', 
                      backgroundColor: AppTheme.colors.card, 
                      borderColor: AppTheme.colors.inputBorder, 
                      borderWidth: 1, 
                      borderRadius: 12, 
                      padding: 16, 
                      marginBottom: 12,
                      width: '100%' 
                    }} 
                    onPress={handleBaixarLaudo}
                  >
                    <Image
                      source={require("@/assets/icons/download.png")}
                      style={{ width: 24, height: 24, marginRight: 16 }}
                    />
                    <Text style={{ fontSize: 16, fontFamily: AppTheme.typography.fontBold, color: AppTheme.colors.text }}>Baixar Laudo (PDF)</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}

            <View style={{ marginTop: 24, alignItems: 'center' }}>
              <TouchableOpacity 
                style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }} 
                onPress={() => router.replace("/precificador")}
              >
                <Image
                  source={require("@/assets/icons/home.png")}
                  style={{ width: 20, height: 20, marginRight: 8 }}
                />
                <Text style={{ color: AppTheme.colors.primary, fontSize: 16, fontFamily: AppTheme.typography.fontBold }}>
                  Voltar para o início
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <Modal transparent visible={valorEditModalVisible} animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
              <Text style={styles.modalTitle}>Ajustar valor estimado</Text>
              <TouchableOpacity onPress={() => setValorEditModalVisible(false)} style={{ padding: 8, backgroundColor: "rgba(0,0,0,0.05)", borderRadius: 20 }}>
                <Image
                  source={require("@/assets/icons/close.png")}
                  style={{ width: 14, height: 14 }}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            </View>
            
            <View style={{ marginBottom: 24, backgroundColor: AppTheme.colors.card, padding: 16, borderRadius: 16, borderWidth: 1, borderColor: "#E0E0E0" }}>
              <Text style={{ fontSize: 11, color: "#9A9A9A", fontFamily: AppTheme.typography.fontBold, marginBottom: 4 }}>VALOR ATUAL</Text>
              <Text style={{ fontSize: 24, fontFamily: AppTheme.typography.fontBold, color: AppTheme.colors.primary }}>{precoFormatado}</Text>
            </View>

            <AppInput
              label="Novo valor proposto"
              value={valorEditTexto}
              onChangeText={onChangeValorText}
              keyboardType="numeric"
            />
            
            <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "center", gap: 12, marginBottom: 24, marginTop: 24 }}>
              <TouchableOpacity onPress={() => adjustBy(-5000)} style={{ backgroundColor: "#F5F5F5", paddingVertical: 12, paddingHorizontal: 20, borderRadius: 16, borderWidth: 1, borderColor: "#E0E0E0", minWidth: 75, alignItems: "center" }}>
                <Text style={{ fontFamily: AppTheme.typography.fontBold, fontSize: 14, color: AppTheme.colors.text }}>-5k</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => adjustBy(5000)} style={{ backgroundColor: "#F5F5F5", paddingVertical: 12, paddingHorizontal: 20, borderRadius: 16, borderWidth: 1, borderColor: "#E0E0E0", minWidth: 75, alignItems: "center" }}>
                <Text style={{ fontFamily: AppTheme.typography.fontBold, fontSize: 14, color: AppTheme.colors.text }}>+5k</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => adjustByPercent(-0.05)} style={{ backgroundColor: "#F5F5F5", paddingVertical: 12, paddingHorizontal: 20, borderRadius: 16, borderWidth: 1, borderColor: "#E0E0E0", minWidth: 75, alignItems: "center" }}>
                <Text style={{ fontFamily: AppTheme.typography.fontBold, fontSize: 14, color: AppTheme.colors.text }}>-5%</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => adjustByPercent(0.05)} style={{ backgroundColor: "#F5F5F5", paddingVertical: 12, paddingHorizontal: 20, borderRadius: 16, borderWidth: 1, borderColor: "#E0E0E0", minWidth: 75, alignItems: "center" }}>
                <Text style={{ fontFamily: AppTheme.typography.fontBold, fontSize: 14, color: AppTheme.colors.text }}>+5%</Text>
              </TouchableOpacity>
            </View>
            
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", marginBottom: 24, paddingVertical: 14, borderRadius: 16, backgroundColor: deltaValor > 0 ? "rgba(76, 175, 80, 0.08)" : deltaValor < 0 ? "rgba(244, 67, 54, 0.08)" : "rgba(0,0,0,0.03)" }}>              
              <Text style={{ color: deltaValor > 0 ? "#4CAF50" : deltaValor < 0 ? "#F44336" : "#9A9A9A", fontFamily: AppTheme.typography.fontBold, fontSize: 15 }}>
                {deltaValor === 0 ? "Sem alteração" : `Variação: ${formatSignedCurrency(deltaValor)} (${formatSignedPercent(deltaPct)})`}
              </Text>
            </View>

            <View style={styles.modalButtons}>
              <AppButton label="Salvar Novo Valor" onPress={confirmarEdicao} fullWidth />
              <AppButton label="Cancelar" variant="secondary" onPress={() => setValorEditModalVisible(false)} fullWidth />
            </View>
          </View>
        </View>
      </Modal>

      <Modal transparent visible={gerandoLaudo} animationType="fade">
        <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "center", alignItems: "center" }}>
          <View style={{ backgroundColor: AppTheme.colors.card, padding: 24, borderRadius: 12, alignItems: "center", maxWidth: 300 }}>
            <ActivityIndicator size="large" color={AppTheme.colors.primary} />
            <Text style={{ marginTop: 12, fontFamily: AppTheme.typography.fontBold, color: AppTheme.colors.text }}>Gerando PDF...</Text>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}
