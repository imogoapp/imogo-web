import Ionicons from "@expo/vector-icons/Ionicons";
import axios, { isAxiosError } from "axios";
import { router } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Pressable,
  SafeAreaView,
  ScrollView,
  Text,
  View,
} from "react-native";

import { AppInput } from "@/components/ui/app-input";
import { AppTheme } from "@/constants/app-theme";
import { AuthUser } from "@/services/auth";
import { flowMobileStyles as styles } from "../styles/flow-mobile-styles";

type CertidoesImovelMobileProps = {
  user: AuthUser | null;
  onLogout: () => void;
  analiseId: string;
};

const ANALISE_API_BASE_URL = "https://analise3.imogo.com.br";
const VIA_CEP_BASE_URL = "https://viacep.com.br";

const CARTORIO_OPTIONS = [
  "1° Ofício de Registro de Imóveis do DF",
  "2° Ofício de Registro de Imóveis do DF",
  "3° Ofício de Registro de Imóveis do DF",
  "4° Ofício de Registro de Imóveis do DF",
  "5° Ofício de Registro de Imóveis do DF",
  "6° Ofício de Registro de Imóveis do DF",
  "7° Ofício de Registro de Imóveis do DF",
  "8° Ofício de Registro de Imóveis do DF",
  "9° Ofício de Registro de Imóveis do DF",
] as const;

function formatCep(value: string) {
  const d = value.replace(/\D/g, "").slice(0, 8);
  if (d.length <= 5) return d;
  return `${d.slice(0, 5)}-${d.slice(5)}`;
}

function isFormValid(params: {
  cep: string;
  endereco: string;
  bairro: string;
  cidadeUf: string;
  iptu: string;
  cartorio: string;
  matricula: string;
}) {
  return Boolean(
    params.cep.replace(/\D/g, "").length === 8 &&
      params.endereco.trim() &&
      params.bairro.trim() &&
      params.cidadeUf.trim() &&
      params.iptu.trim() &&
      params.cartorio.trim() &&
      params.matricula.trim()
  );
}

export default function CertidoesImovelMobile({
  analiseId,
}: CertidoesImovelMobileProps) {
  const [cep, setCep] = useState("");
  const [endereco, setEndereco] = useState("");
  const [complemento, setComplemento] = useState("");
  const [bairro, setBairro] = useState("");
  const [cidadeUf, setCidadeUf] = useState("");
  const [iptu, setIptu] = useState("");
  const [cartorio, setCartorio] = useState("");
  const [matricula, setMatricula] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLookingUpCep, setIsLookingUpCep] = useState(false);
  const [showCartorioOptions, setShowCartorioOptions] = useState(false);
  const [finished, setFinished] = useState(false);

  const canSubmit =
    isFormValid({ cep, endereco, bairro, cidadeUf, iptu, cartorio, matricula }) &&
    !isSubmitting;

  const handleCepLookup = async (formattedCep: string) => {
    const numericCep = formattedCep.replace(/\D/g, "");
    if (numericCep.length !== 8) return;

    try {
      setIsLookingUpCep(true);
      const response = await axios.get<{
        erro?: boolean;
        logradouro?: string;
        bairro?: string;
        localidade?: string;
        uf?: string;
      }>(`${VIA_CEP_BASE_URL}/ws/${numericCep}/json/`);

      if (response.data?.erro) {
        Alert.alert("CEP não encontrado", "Não foi possível localizar esse CEP.");
        return;
      }
      setEndereco(response.data.logradouro ?? "");
      setBairro(response.data.bairro ?? "");
      setCidadeUf(
        response.data.localidade && response.data.uf
          ? `${response.data.localidade}/${response.data.uf}`
          : ""
      );
    } catch {
      Alert.alert("Erro", "Não foi possível buscar o CEP informado.");
    } finally {
      setIsLookingUpCep(false);
    }
  };

  const handleCepChange = (value: string) => {
    const formatted = formatCep(value);
    setCep(formatted);
    if (formatted.length === 9) {
      void handleCepLookup(formatted);
    }
  };

  const handleSave = async () => {
    if (!canSubmit) {
      Alert.alert("Erro", "Preencha todos os campos obrigatórios do imóvel.");
      return;
    }
    try {
      setIsSubmitting(true);
      const payload = {
        cep: cep.replace(/\D/g, ""),
        endereco: complemento.trim()
          ? `${endereco.trim()}, ${complemento.trim()}`
          : endereco.trim(),
        status: 10,
        inscricao_iptu: iptu.trim(),
        cartorio: cartorio.trim(),
        matricula: matricula.trim(),
      };

      const response = await axios.put(
        `${ANALISE_API_BASE_URL}/analises/etapa2/${analiseId}/`,
        payload,
        { headers: { Accept: "application/json", "Content-Type": "application/json" } }
      );

      if (response.status !== 200) {
        Alert.alert("Erro", "Não foi possível atualizar os dados do imóvel.");
        return;
      }
      setFinished(true);
    } catch (error) {
      if (isAxiosError(error)) {
        const msg =
          (error.response?.data as { detail?: string } | undefined)?.detail ??
          "Não foi possível atualizar os dados do imóvel.";
        Alert.alert("Erro", msg);
      } else {
        Alert.alert("Erro", "Não foi possível atualizar os dados do imóvel.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.headerContainer}>
        <Pressable
          onPress={() => router.replace("/certidoes")}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color={AppTheme.colors.primary} />
        </Pressable>
        <Text allowFontScaling={false} style={styles.headerTitle}>
          Emissão de certidões
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Progress */}
        <View style={styles.progressCard}>
          <View style={styles.progressHeader}>
            <View style={styles.progressStep}>
              <View style={[styles.progressDot, styles.progressDotDone]}>
                <Ionicons name="checkmark" size={14} color="#FFFFFF" />
              </View>
              <Text style={styles.progressLabelCurrent}>
                Dados do proprietário
              </Text>
              <View style={styles.progressLine} />
            </View>
            <View style={styles.progressStep}>
              <View style={[styles.progressDot, styles.progressDotCurrent]}>
                <Text
                  style={[styles.progressDotText, styles.progressDotTextCurrent]}
                >
                  2
                </Text>
              </View>
              <Text style={styles.progressLabelCurrent}>Dados do imóvel</Text>
            </View>
          </View>
          <Text allowFontScaling={false} style={styles.progressDescription}>
            Preencha com as informações do imóvel para emitir as certidões.
          </Text>
        </View>

        {!finished ? (
          <>
            {/* Form */}
            <View style={styles.formCard}>
              <Text allowFontScaling={false} style={styles.formTitle}>
                Dados do imóvel
              </Text>

              <AppInput
                label="CEP *"
                value={cep}
                onChangeText={handleCepChange}
                placeholder="00000-000"
                keyboardType="numeric"
                containerStyle={styles.fieldSpacing}
                wrapperBackgroundColor="#F5F5F5"
                trailingIconName={isLookingUpCep ? "reload-outline" : undefined}
              />
              <AppInput
                label="Endereço *"
                value={endereco}
                onChangeText={setEndereco}
                placeholder="Rua, avenida ou condomínio"
                containerStyle={styles.fieldSpacing}
                wrapperBackgroundColor="#F5F5F5"
              />
              <AppInput
                label="Complemento"
                value={complemento}
                onChangeText={setComplemento}
                placeholder="Apto, bloco, lote ou sala"
                containerStyle={styles.fieldSpacing}
                wrapperBackgroundColor="#F5F5F5"
              />
              <AppInput
                label="Bairro *"
                value={bairro}
                onChangeText={setBairro}
                placeholder="Bairro"
                containerStyle={styles.fieldSpacing}
                wrapperBackgroundColor="#F5F5F5"
              />
              <AppInput
                label="Cidade/UF *"
                value={cidadeUf}
                onChangeText={setCidadeUf}
                placeholder="Cidade/UF"
                containerStyle={styles.fieldSpacing}
                wrapperBackgroundColor="#F5F5F5"
              />

              <View style={styles.divider} />
              <Text allowFontScaling={false} style={styles.sectionTitle}>
                Informações adicionais
              </Text>

              <AppInput
                label="Matrícula *"
                value={matricula}
                onChangeText={setMatricula}
                placeholder="Ex: 12345"
                containerStyle={styles.fieldSpacing}
                wrapperBackgroundColor="#F5F5F5"
              />
              <AppInput
                label="Inscrição do IPTU *"
                value={iptu}
                onChangeText={setIptu}
                placeholder="Número da inscrição"
                containerStyle={styles.fieldSpacing}
                wrapperBackgroundColor="#F5F5F5"
              />

              {/* Cartório Select */}
              <View style={styles.fieldSpacing}>
                <Text allowFontScaling={false} style={styles.selectLabel}>
                  Cartório de Registro do Imóvel *
                </Text>
                <Pressable
                  style={styles.selectTrigger}
                  onPress={() => setShowCartorioOptions((c) => !c)}
                >
                  <Text
                    allowFontScaling={false}
                    style={[
                      styles.selectValue,
                      !cartorio && styles.selectPlaceholder,
                    ]}
                  >
                    {cartorio || "Selecionar cartório"}
                  </Text>
                  <Ionicons
                    name={showCartorioOptions ? "chevron-up" : "chevron-down"}
                    size={18}
                    color="#6F7480"
                  />
                </Pressable>
                {showCartorioOptions && (
                  <View style={styles.optionsContainer}>
                    {CARTORIO_OPTIONS.map((option) => (
                      <Pressable
                        key={option}
                        style={({ pressed }) => [
                          styles.optionItem,
                          pressed && styles.optionItemPressed,
                        ]}
                        onPress={() => {
                          setCartorio(option);
                          setShowCartorioOptions(false);
                        }}
                      >
                        <Text
                          allowFontScaling={false}
                          style={styles.optionText}
                        >
                          {option}
                        </Text>
                      </Pressable>
                    ))}
                  </View>
                )}
              </View>
            </View>

            {/* Actions */}
            <View style={styles.actionsContainer}>
              <Pressable
                style={[
                  styles.primaryButton,
                  !canSubmit && styles.primaryButtonDisabled,
                ]}
                onPress={handleSave}
                disabled={!canSubmit}
              >
                <Text allowFontScaling={false} style={styles.primaryButtonText}>
                  {isSubmitting ? "Finalizando..." : "Finalizar solicitação"}
                </Text>
              </Pressable>
              <Pressable
                style={styles.secondaryButton}
                onPress={() => router.replace("/certidoes")}
              >
                <Text
                  allowFontScaling={false}
                  style={styles.secondaryButtonText}
                >
                  Voltar para certidões
                </Text>
              </Pressable>
            </View>
          </>
        ) : (
          <View style={styles.successCard}>
            <View style={styles.successIcon}>
              <Ionicons name="checkmark" size={28} color="#FFFFFF" />
            </View>
            <Text allowFontScaling={false} style={styles.successTitle}>
              Solicitação concluída com sucesso
            </Text>
            <Text allowFontScaling={false} style={styles.successText}>
              Os dados do proprietário e do imóvel foram enviados. Agora, você
              pode voltar para a área de certidões.
            </Text>
            <Pressable
              style={styles.primaryButton}
              onPress={() => router.replace("/certidoes")}
            >
              <Text allowFontScaling={false} style={styles.primaryButtonText}>
                Voltar para certidões
              </Text>
            </Pressable>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
