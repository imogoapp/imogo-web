import axios from "axios";
import { router } from "expo-router";
import React, { useEffect, useMemo, useState, useRef } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  View,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { AuthUser } from "@/services/auth";
import { setPrecificadorResultado } from "@/app/(tabs)/(app)/precificador/state";
import { AppTheme } from "@/constants/app-theme";
import { AppButton } from "@/components/ui/app-button";
import Ionicons from "@expo/vector-icons/Ionicons";
import dadosLocalizacaoLocal from "@/components/screens/precificador/flow/dadosLocalizacao.json";
import { createPrecificadorFlowMobileStyles } from "./styles/preview-mobile-styles";

const API_BASE = "https://gateway-laudo.vercel.app/api/laudo/enderecos/df";
const API_TIPOS = "https://gateway-laudo.vercel.app/api/laudo/tipos";
const API_ESTIMATIVA = "https://gateway-laudo.vercel.app/api/laudo/estimativa";

const NUMBER_OPTIONS = Array.from({ length: 10 }, (_, index) => String(index));

const CONDITION_OPTIONS = [
  "ORIGINAL, REQUER MUITOS REPAROS",
  "IMÓVEL PADRÃO, COM MANUTENÇÃO EM DIA",
  "REFORMADO, EM EXCELENTE ESTADO",
];



function toIntFloor(v: string) {
  const n = parseFloat(v);
  return Number.isFinite(n) ? Math.floor(n) : 0;
}

function toIntFromOption(val: string) {
  if (!val) return 0;
  const m = String(val).match(/\d+/);
  return m ? parseInt(m[0], 10) : 0;
}

function mapPadraoToApi(label: string) {
  if (!label) return null;
  const txt = label
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toUpperCase();
  if (txt.startsWith("ORIGINAL")) return "Original";
  if (txt.startsWith("IMOVEL PADRAO") || txt.startsWith("IMÓVEL PADRÃO")) return "Padrão";
  if (txt.startsWith("REFORMADO")) return "Reformado";
  return "Padrão";
}

export default function PrecificadorFlowMobile({ user }: { user?: AuthUser | null }) {
  
  const styles = createPrecificadorFlowMobileStyles();

  const [isLoadingData, setIsLoadingData] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [tipoImovel, setTipoImovel] = useState("");
  const [showTipoOptions, setShowTipoOptions] = useState(false);
  const [cidadeImovel, setCidadeImovel] = useState("");
  const [showCidadeOptions, setShowCidadeOptions] = useState(false);
  const [bairroImovel, setBairroImovel] = useState("");
  const [showBairroOptions, setShowBairroOptions] = useState(false);
  const [enderecoImovel, setEnderecoImovel] = useState("");
  const [showEnderecoOptions, setShowEnderecoOptions] = useState(false);

  const [quantidadeQuartosImovel, setQuantidadeQuartosImovel] = useState("");
  const [showQuantidadeQuartosOptions, setShowQuantidadeQuartosOptions] = useState(false);
  const [quantidadeSuiteImovel, setQuantidadeSuiteImovel] = useState("");
  const [showQuantidadeSuiteOptions, setShowQuantidadeSuiteOptions] = useState(false);
  const [quantidadeVagasImovel, setQuantidadeVagasImovel] = useState("");
  const [showQuantidadeVagasOptions, setShowQuantidadeVagasOptions] = useState(false);

  const [padraoImovel, setPadraoImovel] = useState("");
  const [showPadraoOptions, setShowPadraoOptions] = useState(false);

  const [metragem, setMetragem] = useState("");
  const enderecoInputRef = useRef<TextInput>(null);
  const metragemInputRef = useRef<TextInput>(null);

  // Fallback data
  const [dadosLocalizacao, setDadosLocalizacao] = useState<any>(null);
  const [tiposDisponiveis, setTiposDisponiveis] = useState<any[] | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setIsLoadingData(true);
      try {
        const [locRes, tiposRes] = await Promise.allSettled([
          axios.get(API_BASE, { timeout: 10000 }),
          axios.get(API_TIPOS, { timeout: 10000 }),
        ]);

        if (!mounted) return;

        if (locRes.status === "fulfilled" && locRes.value.data?.enderecos) {
          setDadosLocalizacao(locRes.value.data.enderecos);
        } else {
          setDadosLocalizacao(dadosLocalizacaoLocal);
        }

        if (tiposRes.status === "fulfilled" && Array.isArray(tiposRes.value.data?.tipos)) {
          setTiposDisponiveis(tiposRes.value.data.tipos);
        } else {
          setTiposDisponiveis([]);
        }
      } catch (err) {
        console.warn("Failed to load initial data", err);
      } finally {
        if (mounted) setIsLoadingData(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const [bairrosDisponiveis, setBairrosDisponiveis] = useState<string[]>([]);
  const [enderecosDisponiveis, setEnderecosDisponiveis] = useState<string[]>([]);

  const canSubmit = useMemo(() => {
    return Boolean(
      tipoImovel &&
      cidadeImovel &&
      bairroImovel &&
      enderecoImovel &&
      padraoImovel &&
      metragem
    );
  }, [
    tipoImovel,
    cidadeImovel,
    bairroImovel,
    enderecoImovel,
    padraoImovel,
    metragem
  ]);

  const handleGerarLaudo = async () => {
    if (!canSubmit) {
      Alert.alert("Atenção", "Preencha todos os campos obrigatórios.");
      return;
    }

    const metragemNum = parseFloat(String(metragem).replace(",", "."));
    if (!metragemNum || Number.isNaN(metragemNum) || metragemNum <= 0) {
      Alert.alert("Atenção", "Informe uma metragem válida.");
      return;
    }

    const params = {
      cidade: cidadeImovel,
      bairro: bairroImovel,
      endereco: enderecoImovel,
      tipo: tipoImovel,
      limite: 20,
      quartos: toIntFromOption(quantidadeQuartosImovel),
      vagas: toIntFromOption(quantidadeVagasImovel),
      suites: toIntFromOption(quantidadeSuiteImovel),
      metragem: metragemNum,
      estado_conservacao: mapPadraoToApi(padraoImovel),
      tolerancia_m2_pct: 0.1,
      tipo_negocio: "Venda",
    };

    setIsSubmitting(true);
    try {
      const { data, status } = await axios.get(API_ESTIMATIVA, {
        params,
        headers: { accept: "application/json" },
        timeout: 15000,
      });

      if (status === 200) {
        try {
          const resultado = data?.resultado || {};
          const valorM2Int = toIntFloor(resultado?.valor_m2_ponderado);

          await axios.post(
            "https://gateway-laudo.vercel.app/api/laudo/historico/salvar",
            {
              nome: user?.name || "",
              email: user?.email || "",
              whatsapp: "", // Ignorado na nova versão web/app (não pedimos mais se não existe)
              sucess: true,
              success: true,
              json_imovel: {
                bairro: bairroImovel,
                cidade: cidadeImovel,
                endereco: enderecoImovel,
                estado_conservacao: mapPadraoToApi(padraoImovel) || "Padrão",
                tipo: tipoImovel,
                quartos: params.quartos,
                suites: params.suites,
                vagas: params.vagas,
                metragem: params.metragem,
                valor_m2_ponderado: valorM2Int,
                valor_imovel: resultado?.valor_estimado ? String(resultado.valor_estimado) : "",
                valor_estimado: resultado?.valor_estimado ? String(resultado.valor_estimado) : "",
              },
              json_user: {
                nome: user?.name || "",
                email: user?.email || "",
                whatsapp: "",
              },
              json_api: data,
              origem: "mobile-app",
            },
            {
              headers: { "Content-Type": "application/json", Accept: "application/json" },
              timeout: 12000,
            }
          );
        } catch (e) {
          console.warn("Falha ao salvar historico", e);
        }

        setPrecificadorResultado(data);
        router.push("/precificador/resultado");
      } else {
        Alert.alert("Erro", "Não foi possível obter a estimativa.");
      }
    } catch (err) {
      console.error(err);
      Alert.alert("Erro", "Falha ao consultar a API de estimativa.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const OptionList = ({
    items,
    onSelect,
    visible,
    emptyMessage = "Nenhuma opção",
    maxHeight = 200,
  }: {
    items: string[];
    onSelect: (item: string) => void;
    visible: boolean;
    emptyMessage?: string;
    maxHeight?: number;
  }) => {
    if (!visible) return null;
    return (
      <View style={[styles.optionsContainer, { maxHeight }]}>
        <ScrollView nestedScrollEnabled keyboardShouldPersistTaps="handled">
          {items.length > 0 ? (
            items.map((item) => (
              <Pressable
                key={item}
                style={({ pressed }) => [
                  styles.optionItem,
                  pressed && { backgroundColor: "rgba(0,0,0,0.05)" }
                ]}
                onPress={() => onSelect(item)}
              >
                <Text style={styles.optionText}>{item}</Text>
              </Pressable>
            ))
          ) : (
            <View style={styles.optionItem}>
              <Text style={[styles.optionText, { color: AppTheme.colors.muted }]}>{emptyMessage}</Text>
            </View>
          )}
        </ScrollView>
      </View>
    );
  };

  if (isLoadingData) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: AppTheme.colors.background }}>
          <ActivityIndicator size="large" color={AppTheme.colors.primary} />
          <Text style={{ marginTop: 12, color: AppTheme.colors.text, fontFamily: AppTheme.typography.fontRegular }}>
            Carregando dados...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.headerContainer}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={AppTheme.colors.primary} />
        </Pressable>
        <Text allowFontScaling={false} style={styles.headerTitle}>
          Precificador
        </Text>
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
          <TouchableWithoutFeedback onPress={() => { 
            setShowTipoOptions(false);
            setShowCidadeOptions(false);
            setShowBairroOptions(false);
            setShowEnderecoOptions(false);
            setShowQuantidadeQuartosOptions(false);
            setShowQuantidadeSuiteOptions(false);
            setShowQuantidadeVagasOptions(false);
            setShowPadraoOptions(false);
            Keyboard.dismiss(); 
          }}>
            <View style={styles.container}>
              
              <Text allowFontScaling={false} style={styles.classificacaoText}>
                Avaliação precisa
              </Text>

              {/* Tipo de imovel */}
              <View style={styles.row}>
                <Text style={styles.subLabel} allowFontScaling={false}>Tipo de imóvel *</Text>
                <TouchableWithoutFeedback onPress={() => setShowTipoOptions(!showTipoOptions)}>
                  <View style={[styles.areaInput, { justifyContent: "center" }]}>
                    <Text style={{ color: tipoImovel ? AppTheme.colors.text : AppTheme.colors.muted, fontFamily: AppTheme.typography.fontRegular }}>
                      {tipoImovel || "Selecionar"}
                    </Text>
                  </View>
                </TouchableWithoutFeedback>
                <OptionList
                  visible={showTipoOptions}
                  items={(Array.isArray(tiposDisponiveis) && tiposDisponiveis.length > 0
                    ? tiposDisponiveis.map(t => (t.tipo || "").toUpperCase())
                    : [
                      "APARTAMENTO",
                      "KITNET/STUDIO",
                      "FLAT/APART-HOTEL",
                      "CASA",
                      "RURAL",
                      "LOTE",
                      "PRÉDIO",
                      "LOJA",
                      "SALA COMERCIAL",
                      "GALPÃO",
                    ])}
                  onSelect={(v) => {
                    setTipoImovel(v);
                    setShowTipoOptions(false);
                  }}
                />
              </View>

              {/* Cidade */}
              <View style={styles.row}>
                <Text style={styles.subLabel} allowFontScaling={false}>Cidade *</Text>
                <TouchableWithoutFeedback onPress={() => setShowCidadeOptions(!showCidadeOptions)}>
                  <View style={[styles.areaInput, { justifyContent: "center" }]}>
                    <Text style={{ color: cidadeImovel ? AppTheme.colors.text : AppTheme.colors.muted, fontFamily: AppTheme.typography.fontRegular }}>
                      {cidadeImovel || "Selecionar"}
                    </Text>
                  </View>
                </TouchableWithoutFeedback>
                <OptionList
                  visible={showCidadeOptions}
                  items={[
                    "AGUAS CLARAS",
                    "ALPHAVILLE",
                    "BRASILIA",
                    "BRAZLANDIA",
                    "CANDANGOLANDIA",
                    "CEILANDIA",
                    "CRUZEIRO",
                    "GAMA",
                    "GUARA",
                    "NUCLEO BANDEIRANTE",
                    "PARANOA",
                    "PLANALTINA",
                    "RECANTO DAS EMAS",
                    "RIACHO FUNDO",
                    "SAMAMBAIA",
                    "SANTA MARIA",
                    "SAO SEBASTIAO",
                    "SETOR INDUSTRIAL",
                    "SOBRADINHO",
                    "TAGUATINGA",
                    "VARJAO",
                    "VICENTE PIRES",
                    "VILA ESTRUTURAL",
                  ]}
                  onSelect={(v) => {
                    setCidadeImovel(v);
                    setShowCidadeOptions(false);
                    setBairroImovel("");
                    setEnderecoImovel("");
                    setBairrosDisponiveis(Object.keys(dadosLocalizacao?.[v] || {}));
                    setEnderecosDisponiveis([]);
                  }}
                />
              </View>

              {/* Bairro */}
              <View style={styles.row}>
                <Text style={styles.subLabel} allowFontScaling={false}>Bairro *</Text>
                <TouchableWithoutFeedback onPress={() => setShowBairroOptions(!showBairroOptions)}>
                  <View style={[styles.areaInput, { justifyContent: "center" }]}>
                    <Text style={{ color: bairroImovel ? AppTheme.colors.text : AppTheme.colors.muted, fontFamily: AppTheme.typography.fontRegular }}>
                      {bairroImovel || "Selecionar"}
                    </Text>
                  </View>
                </TouchableWithoutFeedback>
                <OptionList
                  visible={showBairroOptions}
                  items={bairrosDisponiveis}
                  emptyMessage={cidadeImovel ? "Nenhum bairro disponível" : "Selecione a cidade primeiro"}
                  onSelect={(v) => {
                    setBairroImovel(v);
                    setShowBairroOptions(false);
                    const enderecos = dadosLocalizacao?.[cidadeImovel]?.[v] || [];
                    setEnderecosDisponiveis(enderecos);
                    setEnderecoImovel("");
                  }}
                />
              </View>

              {/* Endereço */}
              <View style={styles.row}>
                <Text style={styles.subLabel}>Endereço *</Text>
                <TouchableWithoutFeedback onPress={() => enderecoInputRef.current?.focus()}>
                   <View style={styles.inputContainer}>
                    <TextInput
                      ref={enderecoInputRef}
                      allowFontScaling={false}
                      style={styles.areaInput as any}
                      placeholder="Digite o endereço (sugestões aparecerão abaixo)"
                      placeholderTextColor={AppTheme.colors.muted}
                      value={enderecoImovel}
                      onFocus={() => setShowEnderecoOptions(true)}
                      onChangeText={(text) => {
                        setEnderecoImovel(text);
                        setShowEnderecoOptions(true);
                      }}
                      returnKeyType="done"
                    />
                  </View>
                </TouchableWithoutFeedback>
                <OptionList
                  visible={showEnderecoOptions}
                  items={enderecosDisponiveis.filter(opt => {
                    if (!enderecoImovel) return true;
                    return opt.toLowerCase().includes(enderecoImovel.toLowerCase());
                  }).slice(0, 50)}
                  emptyMessage={cidadeImovel && bairroImovel ? "Nenhum endereço disponível" : "Selecione cidade e bairro primeiro"}
                  onSelect={(v) => {
                    setEnderecoImovel(v);
                    setShowEnderecoOptions(false);
                    Keyboard.dismiss();
                  }}
                />
              </View>

              <View style={styles.divider} />

              {/* Quartos */}
              <View style={styles.row}>
                <Text style={styles.subLabel} allowFontScaling={false}>Nº de quartos (opcional)</Text>
                <TouchableWithoutFeedback onPress={() => setShowQuantidadeQuartosOptions(!showQuantidadeQuartosOptions)}>
                  <View style={[styles.areaInput, { justifyContent: "center" }]}>
                    <Text style={{ color: quantidadeQuartosImovel ? "#1F2024" : "#A9A9A9", fontFamily: AppTheme.typography.fontRegular }}>
                      {quantidadeQuartosImovel || "Selecionar"}
                    </Text>
                  </View>
                </TouchableWithoutFeedback>
                <OptionList
                  visible={showQuantidadeQuartosOptions}
                  items={NUMBER_OPTIONS}
                  onSelect={(v) => { setQuantidadeQuartosImovel(v); setShowQuantidadeQuartosOptions(false); }}
                />
              </View>

              {/* Suites */}
              <View style={styles.row}>
                <Text style={styles.subLabel} allowFontScaling={false}>Nº de suítes (opcional)</Text>
                <TouchableWithoutFeedback onPress={() => setShowQuantidadeSuiteOptions(!showQuantidadeSuiteOptions)}>
                  <View style={[styles.areaInput, { justifyContent: "center" }]}>
                    <Text style={{ color: quantidadeSuiteImovel ? "#1F2024" : "#A9A9A9", fontFamily: AppTheme.typography.fontRegular }}>
                      {quantidadeSuiteImovel || "Selecionar"}
                    </Text>
                  </View>
                </TouchableWithoutFeedback>
                <OptionList
                  visible={showQuantidadeSuiteOptions}
                  items={NUMBER_OPTIONS}
                  onSelect={(v) => { setQuantidadeSuiteImovel(v); setShowQuantidadeSuiteOptions(false); }}
                />
              </View>

              {/* Vagas */}
              <View style={styles.row}>
                <Text style={styles.subLabel} allowFontScaling={false}>Nº de vagas (opcional)</Text>
                <TouchableWithoutFeedback onPress={() => setShowQuantidadeVagasOptions(!showQuantidadeVagasOptions)}>
                  <View style={[styles.areaInput, { justifyContent: "center" }]}>
                    <Text style={{ color: quantidadeVagasImovel ? "#1F2024" : "#A9A9A9", fontFamily: AppTheme.typography.fontRegular }}>
                      {quantidadeVagasImovel || "Selecionar"}
                    </Text>
                  </View>
                </TouchableWithoutFeedback>
                <OptionList
                  visible={showQuantidadeVagasOptions}
                  items={NUMBER_OPTIONS}
                  onSelect={(v) => { setQuantidadeVagasImovel(v); setShowQuantidadeVagasOptions(false); }}
                />
              </View>

              {/* Metragem */}
              <View style={styles.row}>
                <Text style={styles.subLabel} allowFontScaling={false}>Metragem útil *</Text>
                <TouchableWithoutFeedback onPress={() => metragemInputRef.current?.focus()}>
                  <View style={styles.inputContainer}>
                    <TextInput
                      ref={metragemInputRef}
                      keyboardType="numeric"
                      allowFontScaling={false}
                      style={styles.areaInput as any}
                      placeholder="Informar a metragem útil em m²"
                      placeholderTextColor="#A9A9A9"
                      value={metragem}
                      onChangeText={(val) => setMetragem(val.replace(/[^0-9,.]/g, ""))}
                    />
                  </View>
                </TouchableWithoutFeedback>
              </View>

              {/* Padrao */}
              <View style={styles.row}>
                <Text style={styles.subLabel} allowFontScaling={false}>Padrão atual do imóvel *</Text>
                <TouchableWithoutFeedback onPress={() => setShowPadraoOptions(!showPadraoOptions)}>
                  <View style={[styles.areaInput, { justifyContent: "center" }]}>
                    <Text style={{ color: padraoImovel ? AppTheme.colors.text : AppTheme.colors.muted, fontFamily: AppTheme.typography.fontRegular }}>
                      {padraoImovel || "Selecionar"}
                    </Text>
                  </View>
                </TouchableWithoutFeedback>
                <OptionList
                  visible={showPadraoOptions}
                  items={CONDITION_OPTIONS}
                  onSelect={(v) => { setPadraoImovel(v); setShowPadraoOptions(false); }}
                />
              </View>

              <View style={styles.divider} />

              <View style={styles.actionsRow}>
                <AppButton
                  label="Gerar Laudo"
                  onPress={handleGerarLaudo}
                  disabled={!canSubmit || isSubmitting}
                  fullWidth
                />
              </View>

              <View style={styles.footerLink}>
                <Pressable onPress={() => router.replace("/precificador")}>
                  <Text allowFontScaling={false} style={styles.footerLinkText}>
                    Voltar para o início
                  </Text>
                </Pressable>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </ScrollView>
      </KeyboardAvoidingView>

      <Modal transparent animationType="fade" visible={isSubmitting}>
        <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "center", alignItems: "center" }}>
          <View style={{ backgroundColor: AppTheme.colors.card, padding: 32, borderRadius: 16, alignItems: "center", minWidth: 200 }}>
            <ActivityIndicator size="large" color={AppTheme.colors.primary} />
            <Text style={{ marginTop: 16, color: AppTheme.colors.text, fontFamily: AppTheme.typography.fontBold }}>Calculando...</Text>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
