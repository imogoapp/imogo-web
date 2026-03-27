import { router } from "expo-router";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Linking,
  Modal,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import axios from "axios";

import { createBaseWebNavigationItems } from "@/components/screens/home/home-tools";
import BaseWeb from "@/components/ui/base-web";
import { BaseWebButton } from "@/components/ui/base-web-button";
import { AppInput } from "@/components/ui/app-input";
import { AuthUser } from "@/services/auth";
import { AppTheme } from "@/constants/app-theme";
import { precificadorResultadoWebStyles as styles } from "./styles/web-styles";
import { useAnalytics } from "@/hooks/use-analytics";

type PrecificadorResultadoDesktopProps = {
  user: AuthUser | null;
  onLogout: () => void;
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

export default function PrecificadorResultadoDesktop({
  user,
  onLogout,
  resultado,
}: PrecificadorResultadoDesktopProps) {
  const { trackEvent } = useAnalytics();
  trackEvent();

  const navigationItems = useMemo(
    () =>
      createBaseWebNavigationItems({
        activeId: "precificador",
        onNavigate: (path) => router.replace(path as never),
      }),
    [],
  );

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
      Alert.alert("Valor inválido", "Informe um valor maior que zero.");
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

  const isErroAmostra = resultado?.ok === false;

  const handleBaixarLaudo = async () => {
    try {
      setGerandoLaudo(true);

      const imovel =
        resultado?.imovel ||
        resultado?.dados_imovel ||
        resultado?.entrada ||
        resultado?.input ||
        {};

      const valorM2Number =
        typeof estimativa?.valor_m2_ponderado === "number"
          ? estimativa.valor_m2_ponderado
          : typeof estimativa?.valor_m2_medio === "number"
          ? estimativa.valor_m2_medio
          : undefined;

      const payload = {
        bairro: imovel.bairro ?? "",
        cidade: imovel.cidade ?? "",
        endereco: imovel.endereco ?? imovel.logradouro ?? "",
        estado_conservacao: imovel.estado_conservacao ?? imovel.estado ?? "",
        tipo: imovel.tipo ?? imovel.tipo_imovel ?? "",
        quartos: Number(imovel.quartos ?? imovel.qtd_quartos ?? 0),
        suites: Number(imovel.suites ?? imovel.qtd_suites ?? 0),
        vagas: Number(imovel.vagas ?? imovel.qtd_vagas ?? 0),
        metragem: String(imovel.metragem_param ?? imovel.area ?? imovel.metros_quadrados ?? ""),
        valor_m2_ponderado:
          typeof valorM2Number === "number"
            ? formatCurrencyBR(valorM2Number)
            : String(estimativa?.valor_m2_ponderado ?? ""),
        valor_imovel: formatCurrencyBR(estimativaLocal?.valor_estimado || 0),
        valor_estimado: formatCurrencyBR(valorEstimadoOriginalRef.current || 0),
      };

      const { data } = await axios.post(
        "https://gateway-laudo.vercel.app/api/laudo/gerar",
        payload,
        { headers: { "Content-Type": "application/json" }, timeout: 60000 }
      );

      if (data?.ok && data?.docx_response) {
        const pdflink = data.docx_response.pdf_url || data.docx_response.pptx_url;
        if (pdflink) {
          if (Platform.OS === "web") {
            window.open(pdflink, "_blank", "noopener,noreferrer");
          } else {
            const supported = await Linking.canOpenURL(pdflink);
            if (supported) await Linking.openURL(pdflink);
            else alert("Laudo gerado, mas não foi possível abrir o link.");
          }
        }
      Alert.alert("Erro", data?.mensagem || "Não foi possível gerar o laudo.");
    }
  } catch (err: any) {
    Alert.alert("Erro", err?.response?.data?.mensagem || err?.message || "Erro ao gerar o laudo.");
  } finally {
      setGerandoLaudo(false);
    }
  };

  return (
    <BaseWeb user={user} navigationItems={navigationItems} onLogout={onLogout}>
      <ScrollView contentContainerStyle={styles.contentMinimal}>
        <View style={styles.formContainer}>
          <View style={{ width: "100%", flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
            <Text style={styles.title}>Precificador</Text>
            <TouchableOpacity 
              style={{ flexDirection: 'row', alignItems: 'center' }} 
              onPress={() => router.replace("/precificador")}
            >
              <Image
                source={require("@/assets/icons/home.png")}
                style={{ width: 18, height: 18, marginRight: 8 }}
              />
              <Text style={{ color: AppTheme.colors.primary, fontFamily: AppTheme.typography.fontBold }}>Nova consulta</Text>
            </TouchableOpacity>
          </View>

          {isErroAmostra ? (
            <View style={{ backgroundColor: AppTheme.colors.background, padding: 24, borderRadius: 16, borderWidth: 1, borderColor: AppTheme.colors.inputBorder, marginTop: 20 }}>
              <Text style={{ fontSize: 20, fontFamily: AppTheme.typography.fontBold, color: AppTheme.colors.text }}>Não foi possível gerar o laudo</Text>
              <Text style={{ marginTop: 12, color: AppTheme.colors.muted, fontSize: 16 }}>{resultado?.mensagem || "A quantidade de amostras para a região informada é insuficiente."}</Text>
            </View>
          ) : (
            <>
              <View style={{ width: "100%", alignItems: "center", backgroundColor: AppTheme.colors.card, padding: 48, borderRadius: 16, borderWidth: 1, borderColor: AppTheme.colors.inputBorder, marginVertical: 24, shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 10, shadowOffset: { width: 0, height: 4 } }}>
                <Image
                  source={require("@/assets/img/money.png")}
                  style={{ width: 180, height: 180, marginBottom: 24 }}
                  resizeMode="contain"
                />
                <Text style={{ fontSize: 24, fontFamily: AppTheme.typography.fontBold, textAlign: "center", marginBottom: 16, color: AppTheme.colors.text }}>
                  Obrigado por realizar a sua solicitação do imóvel conosco!
                </Text>
                <Text style={{ fontSize: 16, textAlign: "center", color: AppTheme.colors.muted, marginBottom: 24, maxWidth: 600 }}>
                  Com base nos valores que os imóveis similares foram negociados recentemente, a nossa IA precificou o seu imóvel no valor de:
                </Text>
                <Text style={{ color: AppTheme.colors.primary, fontSize: 56, fontFamily: AppTheme.typography.fontBold, marginTop: 8 }}>
                  {precoFormatado}
                </Text>
              </View>

              <View style={[styles.actionsRow, { width: "100%" }]}>
                <BaseWebButton
                  label="Ajustar Valor"
                  variant="secondary"
                  leftIconSource={require("@/assets/icons/avaliador-roxo.png")}
                  onPress={() => setValorEditModalVisible(true)}
                />
                <BaseWebButton
                  label="Baixar Laudo (PDF)"
                  leftIconSource={require("@/assets/icons/download.png")}
                  onPress={handleBaixarLaudo}
                />
              </View>
            </>
          )}

          {/* Modal Edição */}
          <Modal transparent visible={valorEditModalVisible} animationType="fade">
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <TouchableOpacity onPress={() => setValorEditModalVisible(false)} style={{ position: "absolute", top: 20, right: 20, padding: 8, backgroundColor: "rgba(0,0,0,0.05)", borderRadius: 20, zIndex: 10 }}>
                  <Image
                    source={require("@/assets/icons/close.png")}
                    style={{ width: 14, height: 14 }}
                    resizeMode="contain"
                  />
                </TouchableOpacity>
                
                <Text style={styles.modalTitle}>Ajustar valor do laudo</Text>
                
                <View style={{ marginBottom: 24, backgroundColor: "rgba(0,0,0,0.02)", padding: 16, borderRadius: 12 }}>
                  <Text style={{ color: AppTheme.colors.muted, fontSize: 11, fontFamily: AppTheme.typography.fontBold, marginBottom: 4 }}>VALOR ATUAL</Text>
                  <Text style={{ color: AppTheme.colors.primary, fontSize: 24, fontFamily: AppTheme.typography.fontBold }}>{precoFormatado}</Text>
                </View>
                
                <AppInput
                  label="Novo valor"
                  value={valorEditTexto}
                  onChangeText={onChangeValorText}
                  keyboardType="numeric"
                />
                
                <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "center", gap: 12, marginBottom: 24, marginTop: 24 }}>
                  <TouchableOpacity onPress={() => adjustBy(-5000)} style={{ backgroundColor: "#f5f5f5", paddingVertical: 14, paddingHorizontal: 20, borderRadius: 16, borderWidth: 1, borderColor: "#E0E0E0", minWidth: 80, alignItems: "center" }}>
                    <Text style={{ fontFamily: AppTheme.typography.fontBold, fontSize: 14, color: AppTheme.colors.text }}>-5k</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => adjustBy(5000)} style={{ backgroundColor: "#f5f5f5", paddingVertical: 14, paddingHorizontal: 20, borderRadius: 16, borderWidth: 1, borderColor: "#E0E0E0", minWidth: 80, alignItems: "center" }}>
                    <Text style={{ fontFamily: AppTheme.typography.fontBold, fontSize: 14, color: AppTheme.colors.text }}>+5k</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => adjustByPercent(-0.05)} style={{ backgroundColor: "#f5f5f5", paddingVertical: 14, paddingHorizontal: 20, borderRadius: 16, borderWidth: 1, borderColor: "#E0E0E0", minWidth: 80, alignItems: "center" }}>
                    <Text style={{ fontFamily: AppTheme.typography.fontBold, fontSize: 14, color: AppTheme.colors.text }}>-5%</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => adjustByPercent(0.05)} style={{ backgroundColor: "#f5f5f5", paddingVertical: 14, paddingHorizontal: 20, borderRadius: 16, borderWidth: 1, borderColor: "#E0E0E0", minWidth: 80, alignItems: "center" }}>
                    <Text style={{ fontFamily: AppTheme.typography.fontBold, fontSize: 14, color: AppTheme.colors.text }}>+5%</Text>
                  </TouchableOpacity>
                </View>

                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", marginBottom: 24, paddingVertical: 14, borderRadius: 16, backgroundColor: deltaValor > 0 ? "rgba(76, 175, 80, 0.08)" : deltaValor < 0 ? "rgba(244, 67, 54, 0.08)" : "rgba(0,0,0,0.03)" }}>
              
                  <Text style={{ color: deltaValor > 0 ? "#4CAF50" : deltaValor < 0 ? "#F44336" : "#9A9A9A", fontFamily: AppTheme.typography.fontBold, fontSize: 15 }}>
                    {deltaValor === 0 ? "Sem alteração" : `Variação: ${formatSignedCurrency(deltaValor)} (${formatSignedPercent(deltaPct)})`}
                  </Text>
                </View>

                <View style={styles.modalButtons}>
                  <BaseWebButton label="Cancelar" variant="secondary" onPress={() => setValorEditModalVisible(false)} />
                  <BaseWebButton label="Salvar" onPress={confirmarEdicao} />
                </View>
              </View>
            </View>
          </Modal>

          {/* Modal Carregando PDF */}
          <Modal transparent visible={gerandoLaudo} animationType="fade">
            <View style={styles.modalOverlay}>
              <View style={[styles.modalContent, { maxWidth: 300, alignItems: "center" }]}>
                <ActivityIndicator size="large" color={AppTheme.colors.primary} />
                <Text style={{ marginTop: 16, fontFamily: AppTheme.typography.fontBold, color: AppTheme.colors.text }}>Criando laudo...</Text>
                <Text style={{ marginTop: 4, color: "#6b7280", textAlign: "center" }}>Isso pode levar alguns segundos.</Text>
              </View>
            </View>
          </Modal>

        </View>
      </ScrollView>
    </BaseWeb>
  );
}
