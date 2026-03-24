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
import { flowMobileStyles as styles } from "../../styles/flow-mobile-styles";

type CertidoesCnpjMobileProps = {
  user: AuthUser | null;
  onLogout: () => void;
};

type CompanyForm = {
  razaoSocial: string;
  nomeFantasia: string;
  cnpj: string;
};

type CreateAnaliseResponse = {
  analise_id?: number | string;
  id?: number | string;
};

const ANALISE_API_BASE_URL = "https://analise3.imogo.com.br";

const EMPTY_COMPANY: CompanyForm = {
  razaoSocial: "",
  nomeFantasia: "",
  cnpj: "",
};

function formatCnpj(value: string) {
  const d = value.replace(/\D/g, "").slice(0, 14);
  if (d.length <= 2) return d;
  if (d.length <= 5) return `${d.slice(0, 2)}.${d.slice(2)}`;
  if (d.length <= 8) return `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5)}`;
  if (d.length <= 12)
    return `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5, 8)}/${d.slice(8)}`;
  return `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5, 8)}/${d.slice(8, 12)}-${d.slice(12)}`;
}

function getUserId(user: AuthUser | null) {
  return user?.public_id == null ? null : String(user.public_id);
}

function isFormValid(companies: CompanyForm[]) {
  return companies.every(
    (c) =>
      c.razaoSocial.trim().length > 0 && c.cnpj.replace(/\D/g, "").length === 14
  );
}

export default function CertidoesCnpjMobile({
  user,
}: CertidoesCnpjMobileProps) {
  const [companies, setCompanies] = useState<CompanyForm[]>([
    { ...EMPTY_COMPANY },
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const userId = getUserId(user);
  const canSubmit = isFormValid(companies) && !!userId && !isSubmitting;

  const updateCompany = (
    index: number,
    field: keyof CompanyForm,
    value: string
  ) =>
    setCompanies((curr) =>
      curr.map((c, i) => (i === index ? { ...c, [field]: value } : c))
    );

  const addCompany = () =>
    setCompanies((curr) => [...curr, { ...EMPTY_COMPANY }]);

  const removeCompany = (index: number) =>
    setCompanies((curr) => curr.filter((_, i) => i !== index));

  const handleSubmit = async () => {
    if (!userId) {
      Alert.alert("Erro", "Não foi possível identificar o usuário logado.");
      return;
    }
    try {
      setIsSubmitting(true);
      const proprietarios = companies.map((c) => ({
        razao_social: c.razaoSocial.trim(),
        nome_fansasia: c.nomeFantasia.trim(),
        cnpj: c.cnpj,
        e_empresa: true,
      }));

      const response = await axios.post<CreateAnaliseResponse>(
        `${ANALISE_API_BASE_URL}/analises/etapa1/cnpj/`,
        [{ usuario_id: userId, proprietarios }],
        { headers: { Accept: "application/json", "Content-Type": "application/json" } }
      );

      const analiseId = response.data?.analise_id ?? response.data?.id;
      if (!analiseId) {
        Alert.alert("Erro", "Não foi possível seguir com a solicitação.");
        return;
      }
      router.push(`/certidoes/imovel/${analiseId}` as never);
    } catch (error) {
      if (isAxiosError(error)) {
        const msg =
          (error.response?.data as { detail?: string } | undefined)?.detail ??
          "Não foi possível enviar os dados da empresa.";
        Alert.alert("Erro", msg);
      } else {
        Alert.alert("Erro", "Não foi possível enviar os dados da empresa.");
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
              <View style={[styles.progressDot, styles.progressDotCurrent]}>
                <Text
                  style={[styles.progressDotText, styles.progressDotTextCurrent]}
                >
                  1
                </Text>
              </View>
              <Text style={styles.progressLabelCurrent}>Dados da empresa</Text>
              <View style={styles.progressLine} />
            </View>
            <View style={styles.progressStep}>
              <View style={styles.progressDot}>
                <Text style={styles.progressDotText}>2</Text>
              </View>
              <Text style={styles.progressLabel}>Dados do imóvel</Text>
            </View>
          </View>
          <Text allowFontScaling={false} style={styles.progressDescription}>
            Cadastre uma ou mais empresas.
          </Text>
        </View>

        {/* Form */}
        <View style={styles.formCard}>
          <Text allowFontScaling={false} style={styles.formTitle}>
            Dados da empresa
          </Text>

          {companies.map((company, index) => (
            <View key={`company-${index}`} style={styles.ownerBlock}>
              <View style={styles.ownerHeader}>
                <Text allowFontScaling={false} style={styles.ownerTitle}>
                  {index + 1}ª empresa
                </Text>
                {companies.length > 1 && (
                  <Pressable
                    style={styles.removeButton}
                    onPress={() => removeCompany(index)}
                  >
                    <Ionicons name="trash-outline" size={14} color="#A22C2C" />
                    <Text
                      allowFontScaling={false}
                      style={styles.removeButtonText}
                    >
                      Remover
                    </Text>
                  </Pressable>
                )}
              </View>

              <AppInput
                label="Razão social *"
                placeholder="Informe a razão social"
                value={company.razaoSocial}
                onChangeText={(v) => updateCompany(index, "razaoSocial", v)}
                containerStyle={styles.fieldSpacing}
                wrapperBackgroundColor="#F5F5F5"
              />
              <AppInput
                label="CNPJ *"
                placeholder="00.000.000/0000-00"
                value={company.cnpj}
                onChangeText={(v) =>
                  updateCompany(index, "cnpj", formatCnpj(v))
                }
                keyboardType="numeric"
                containerStyle={styles.fieldSpacing}
                wrapperBackgroundColor="#F5F5F5"
              />
              <AppInput
                label="Nome fantasia"
                placeholder="Nome fantasia (opcional)"
                value={company.nomeFantasia}
                onChangeText={(v) => updateCompany(index, "nomeFantasia", v)}
                containerStyle={styles.fieldSpacingLast}
                wrapperBackgroundColor="#F5F5F5"
              />
            </View>
          ))}

          <Pressable style={styles.addButton} onPress={addCompany}>
            <Ionicons
              name="add-circle-outline"
              size={18}
              color={AppTheme.colors.primary}
            />
            <Text allowFontScaling={false} style={styles.addButtonText}>
              Adicionar empresa
            </Text>
          </Pressable>
        </View>

        {/* Actions */}
        <View style={styles.actionsContainer}>
          <Pressable
            style={[
              styles.primaryButton,
              !canSubmit && styles.primaryButtonDisabled,
            ]}
            onPress={handleSubmit}
            disabled={!canSubmit}
          >
            <Text allowFontScaling={false} style={styles.primaryButtonText}>
              {isSubmitting ? "Criando solicitação..." : "Criar solicitação"}
            </Text>
          </Pressable>
          <Pressable
            style={styles.secondaryButton}
            onPress={() => router.replace("/certidoes")}
          >
            <Text allowFontScaling={false} style={styles.secondaryButtonText}>
              Voltar
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
