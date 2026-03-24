import Ionicons from "@expo/vector-icons/Ionicons";
import axios, { isAxiosError } from "axios";
import { router } from "expo-router";
import { useMemo, useState } from "react";
import { Alert, Pressable, ScrollView, Text, View } from "react-native";

import { createBaseWebNavigationItems } from "@/components/screens/home/home-tools";
import BaseWeb from "@/components/ui/base-web";
import { BaseWebButton } from "@/components/ui/base-web-button";
import { AppInput } from "@/components/ui/app-input";
import { AppTheme } from "@/constants/app-theme";
import { AuthUser } from "@/services/auth";
import { styles } from "../../styles";

type CertidoesCnpjDesktopProps = {
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

const FLOW_STEPS = [
  {
    id: 1,
    label: "Dados da empresa",
    description: "Cadastre uma ou mais empresas proprietárias para iniciar a solicitação.",
  },
  {
    id: 2,
    label: "Dados do imóvel",
    description: "Cadastre as informações do imóvel.",
  },
] as const;

function formatCnpj(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 14);

  if (digits.length <= 2) {
    return digits;
  }
  if (digits.length <= 5) {
    return `${digits.slice(0, 2)}.${digits.slice(2)}`;
  }
  if (digits.length <= 8) {
    return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5)}`;
  }
  if (digits.length <= 12) {
    return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5, 8)}/${digits.slice(8)}`;
  }

  return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5, 8)}/${digits.slice(8, 12)}-${digits.slice(12)}`;
}

function getUserId(user: AuthUser | null) {
  return user?.public_id == null ? null : String(user.public_id);
}

function isFormValid(companies: CompanyForm[]) {
  return companies.every(
    (company) =>
      company.razaoSocial.trim().length > 0 &&
      company.cnpj.replace(/\D/g, "").length === 14,
  );
}

export default function CertidoesCnpjDesktop({
  user,
  onLogout,
}: CertidoesCnpjDesktopProps) {
  const navigationItems = useMemo(
    () =>
      createBaseWebNavigationItems({
        activeId: "certidoes",
        onNavigate: (path) => router.replace(path as never),
      }),
    [],
  );

  const [companies, setCompanies] = useState<CompanyForm[]>([{ ...EMPTY_COMPANY }]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const userId = getUserId(user);
  const canSubmit = isFormValid(companies) && !!userId && !isSubmitting;

  const updateCompany = (
    index: number,
    field: keyof CompanyForm,
    value: string,
  ) => {
    setCompanies((current) =>
      current.map((company, companyIndex) =>
        companyIndex === index ? { ...company, [field]: value } : company,
      ),
    );
  };

  const addCompany = () => {
    setCompanies((current) => [...current, { ...EMPTY_COMPANY }]);
  };

  const removeCompany = (index: number) => {
    setCompanies((current) => current.filter((_, companyIndex) => companyIndex !== index));
  };

  const handleCreateAnalise = async () => {
    if (!userId) {
      Alert.alert("Erro", "Não foi possível identificar o usuário logado.");
      return;
    }

    if (!isFormValid(companies)) {
      Alert.alert("Erro", "Preencha a razão social e o CNPJ de todas as empresas.");
      return; 
    }

    try {
      setIsSubmitting(true);

      const proprietarios = companies.map((company) => ({
        razao_social: company.razaoSocial.trim(),
        nome_fansasia: company.nomeFantasia.trim(),
        cnpj: company.cnpj,
        e_empresa: true,
      }));

      const response = await axios.post<CreateAnaliseResponse>(
        `${ANALISE_API_BASE_URL}/analises/etapa1/cnpj/`,
        [
          {
            usuario_id: userId,
            proprietarios,
          },
        ],
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        },
      );

      if (response.status !== 200) {
        Alert.alert("Erro", "Não foi possível criar a solicitação.");
        return;
      }

      const analiseId = response.data?.analise_id ?? response.data?.id;

      if (!analiseId) {
        Alert.alert("Erro", "Não foi possível seguir com a solicitação.");
        return;
      }

      router.push(`/certidoes/imovel/${analiseId}` as never);
    } catch (error) {
      if (isAxiosError(error)) {
        const message =
          (error.response?.data as { detail?: string; message?: string } | undefined)?.detail ??
          (error.response?.data as { detail?: string; message?: string } | undefined)?.message ??
          "Não foi possível enviar os dados da empresa.";
        Alert.alert("Erro", message);
      } else {
        Alert.alert("Erro", "Não foi possível enviar os dados da empresa.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <BaseWeb user={user} navigationItems={navigationItems} onLogout={onLogout}>
      <ScrollView contentContainerStyle={styles.contentMinimal}>
        <View style={styles.container}>
          <Text style={styles.title}>Emissão de certidões</Text>
          {/* <Text style={styles.subtitle}>Etapa 1 de 2: dados do proprietario pessoa juridica</Text> */}

          <View style={styles.progressCard}>
            <View style={styles.progressHeader}>
              {FLOW_STEPS.map((step) => {
                const isCurrent = step.id === 1;

                return (
                  <View key={step.id} style={styles.progressStep}>
                    <View
                      style={[
                        styles.progressDot,
                        isCurrent ? styles.progressDotCurrent : undefined,
                      ]}
                    >
                      <Text
                        style={[
                          styles.progressDotText,
                          isCurrent ? styles.progressDotTextCurrent : undefined,
                        ]}
                      >
                        {step.id}
                      </Text>
                    </View>
                    <Text
                      style={[
                        styles.progressLabel,
                        isCurrent ? styles.progressLabelCurrent : undefined,
                      ]}
                    >
                      {step.label}
                    </Text>
                    {step.id !== FLOW_STEPS.length ? <View style={styles.progressLine} /> : null}
                  </View>
                );
              })}
            </View>

            <Text style={styles.progressDescription}>
              Cadastre uma ou mais empresas.
            </Text>
          </View>

          <View style={styles.formContainer}>
            <View style={styles.formHeader}>
              <Text style={styles.formTitle}>Dados da empresa</Text>
              
            </View>

            {companies.map((company, index) => (
              <View key={`company-${index}`} style={styles.ownerBlock}>
                <View style={styles.ownerHeader}>
                  <Text style={styles.ownerTitle}>Dados da {index + 1}º empresa</Text>
                  {companies.length > 1 ? (
                    <Pressable style={styles.removeButton} onPress={() => removeCompany(index)}>
                      <Ionicons name="trash-outline" size={14} color="#A22C2C" />
                      <Text style={styles.removeButtonText}>Remover</Text>
                    </Pressable>
                  ) : null}
                </View>

                <View style={styles.fieldRow}>
                  <AppInput
                    label="Razão social *"
                    placeholder="Informe a razão social"
                    value={company.razaoSocial}
                    onChangeText={(value) => updateCompany(index, "razaoSocial", value)}
                    containerStyle={[styles.fieldSpacing, styles.fieldHalf]}
                    wrapperBackgroundColor="#F5F5F5"
                  />

                  <AppInput
                    label="CNPJ *"
                    placeholder="00.000.000/0000-00"
                    value={company.cnpj}
                    onChangeText={(value) => updateCompany(index, "cnpj", formatCnpj(value))}
                    keyboardType="numeric"
                    containerStyle={[styles.fieldSpacing, styles.fieldHalf]}
                    wrapperBackgroundColor="#F5F5F5"
                  />
                </View>

                <AppInput
                  label="Nome fantasia"
                  placeholder="Nome fantasia (opcional)"
                  value={company.nomeFantasia}
                  onChangeText={(value) => updateCompany(index, "nomeFantasia", value)}
                  containerStyle={styles.fieldSpacingLast}
                  wrapperBackgroundColor="#F5F5F5"
                />
              </View>
            ))}

            <Pressable style={styles.addButton} onPress={addCompany}>
              <Ionicons name="add-circle-outline" size={18} color={AppTheme.colors.primary} />
              <Text style={styles.addButtonText}>Adicionar empresa</Text>
            </Pressable>

            <View style={styles.actionsRow}>
              <BaseWebButton
                label="Voltar"
                variant="secondary"
                onPress={() => router.replace("/certidoes")}
              />
              <BaseWebButton
                label={isSubmitting ? "Criando solicitação..." : "Criar solicitação"}
                onPress={handleCreateAnalise}
                disabled={!canSubmit}
              />
            </View>
          </View>
        </View>
      </ScrollView>
    </BaseWeb>
  );
}
