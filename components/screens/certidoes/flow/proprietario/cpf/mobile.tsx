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
import { useAnalytics } from "@/hooks/use-analytics";

type CertidoesCpfMobileProps = {
  user: AuthUser | null;
  onLogout: () => void;
};

type SpouseForm = {
  nomeCompleto: string;
  nomeMae: string;
  cpf: string;
  dataNascimento: string;
};

type OwnerForm = {
  nomeCompleto: string;
  nomeMae: string;
  cpf: string;
  dataNascimento: string;
  estadoCivil: string;
  conjuge: SpouseForm;
};

type CreateAnaliseResponse = {
  analise_id?: number | string;
  id?: number | string;
};

const ANALISE_API_BASE_URL = "https://analise3.imogo.com.br";

const ESTADO_CIVIL_OPTIONS = [
  "solteiro(a)",
  "casado(a)",
  "viuvo(a)",
  "divorciado(a)",
  "separado(a)",
] as const;

const EMPTY_OWNER: OwnerForm = {
  nomeCompleto: "",
  nomeMae: "",
  cpf: "",
  dataNascimento: "",
  estadoCivil: "",
  conjuge: { nomeCompleto: "", nomeMae: "", cpf: "", dataNascimento: "" },
};

function formatCpf(value: string) {
  const d = value.replace(/\D/g, "").slice(0, 11);
  if (d.length <= 3) return d;
  if (d.length <= 6) return `${d.slice(0, 3)}.${d.slice(3)}`;
  if (d.length <= 9) return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6)}`;
  return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6, 9)}-${d.slice(9)}`;
}

function formatDate(value: string) {
  const d = value.replace(/\D/g, "").slice(0, 8);
  if (d.length <= 2) return d;
  if (d.length <= 4) return `${d.slice(0, 2)}/${d.slice(2)}`;
  return `${d.slice(0, 2)}/${d.slice(2, 4)}/${d.slice(4)}`;
}

function convertDateToISO(dateString: string) {
  const [day, month, year] = dateString.split("/");
  return `${year}-${month}-${day}`;
}

function getUserId(user: AuthUser | null) {
  return user?.public_id == null ? null : String(user.public_id);
}

function isOwnerComplete(owner: OwnerForm) {
  const base =
    owner.nomeCompleto.trim() &&
    owner.nomeMae.trim() &&
    owner.cpf.replace(/\D/g, "").length === 11 &&
    owner.dataNascimento.length === 10 &&
    owner.estadoCivil.trim();

  if (!base) return false;
  if (owner.estadoCivil.toLowerCase() !== "casado(a)") return true;

  return Boolean(
    owner.conjuge.nomeCompleto.trim() &&
      owner.conjuge.nomeMae.trim() &&
      owner.conjuge.cpf.replace(/\D/g, "").length === 11 &&
      owner.conjuge.dataNascimento.length === 10
  );
}

export default function CertidoesCpfMobile({ user }: CertidoesCpfMobileProps) {
  const { trackEvent } = useAnalytics();
  trackEvent();
  const [owners, setOwners] = useState<OwnerForm[]>([{ ...EMPTY_OWNER }]);
  const [openEstadoCivilIndex, setOpenEstadoCivilIndex] = useState<
    number | null
  >(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const userId = getUserId(user);
  const canSubmit = owners.every(isOwnerComplete) && !!userId && !isSubmitting;

  const updateOwner = (index: number, field: keyof OwnerForm, value: string) =>
    setOwners((curr) =>
      curr.map((o, i) => (i === index ? { ...o, [field]: value } : o))
    );

  const updateSpouse = (
    index: number,
    field: keyof SpouseForm,
    value: string
  ) =>
    setOwners((curr) =>
      curr.map((o, i) =>
        i === index ? { ...o, conjuge: { ...o.conjuge, [field]: value } } : o
      )
    );

  const addOwner = () =>
    setOwners((curr) => [
      ...curr,
      { ...EMPTY_OWNER, conjuge: { ...EMPTY_OWNER.conjuge } },
    ]);

  const removeOwner = (index: number) => {
    setOwners((curr) => curr.filter((_, i) => i !== index));
    setOpenEstadoCivilIndex((curr) => (curr === index ? null : curr));
  };

  const handleSubmit = async () => {
    if (!userId) {
      Alert.alert("Erro", "Não foi possível identificar o usuário logado.");
      return;
    }
    try {
      setIsSubmitting(true);
      const proprietarios = owners.map((owner) => {
        const p: Record<string, unknown> = {
          nome_completo: owner.nomeCompleto.trim(),
          nome_mae: owner.nomeMae.trim(),
          cpf: owner.cpf,
          e_empresa: false,
          data_nascimento: convertDateToISO(owner.dataNascimento),
          estado_civil: owner.estadoCivil,
        };
        if (owner.estadoCivil.toLowerCase() === "casado(a)") {
          p.conjuge = {
            nome_completo: owner.conjuge.nomeCompleto.trim(),
            cpf: owner.conjuge.cpf,
            nome_mae: owner.conjuge.nomeMae.trim(),
            data_nascimento: convertDateToISO(owner.conjuge.dataNascimento),
          };
        }
        return p;
      });

      const response = await axios.post<CreateAnaliseResponse>(
        `${ANALISE_API_BASE_URL}/analises/etapa1/cpf/`,
        [{ usuario_id: userId, proprietarios }],
        { headers: { Accept: "application/json", "Content-Type": "application/json" } }
      );

      const analiseId = response.data?.analise_id ?? response.data?.id;
      if (!analiseId) {
        Alert.alert("Erro", "A API não retornou o identificador da análise.");
        return;
      }
      router.push(`/certidoes/imovel/${analiseId}` as never);
    } catch (error) {
      if (isAxiosError(error)) {
        const msg =
          (error.response?.data as { detail?: string } | undefined)?.detail ??
          "Não foi possível enviar os dados do proprietário.";
        Alert.alert("Erro", msg);
      } else if (error instanceof Error) {
        Alert.alert("Erro", error.message);
      } else {
        Alert.alert("Erro", "Não foi possível enviar os dados do proprietário.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.headerContainer}>
        <Pressable onPress={() => router.replace("/certidoes")} style={styles.backButton}>
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
                <Text style={[styles.progressDotText, styles.progressDotTextCurrent]}>
                  1
                </Text>
              </View>
              <Text style={styles.progressLabelCurrent}>
                Dados do proprietário
              </Text>
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
            Cadastre um ou mais proprietários.
          </Text>
        </View>

        {/* Form */}
        <View style={styles.formCard}>
          <Text allowFontScaling={false} style={styles.formTitle}>
            Proprietários
          </Text>

          {owners.map((owner, index) => (
            <View key={`owner-${index}`} style={styles.ownerBlock}>
              <View style={styles.ownerHeader}>
                <Text allowFontScaling={false} style={styles.ownerTitle}>
                  {index + 1}º proprietário
                </Text>
                {owners.length > 1 && (
                  <Pressable
                    style={styles.removeButton}
                    onPress={() => removeOwner(index)}
                  >
                    <Ionicons name="trash-outline" size={14} color="#A22C2C" />
                    <Text allowFontScaling={false} style={styles.removeButtonText}>
                      Remover
                    </Text>
                  </Pressable>
                )}
              </View>

              <AppInput
                label="Nome completo *"
                placeholder="Informe o nome completo"
                value={owner.nomeCompleto}
                onChangeText={(v) => updateOwner(index, "nomeCompleto", v)}
                containerStyle={styles.fieldSpacing}
                wrapperBackgroundColor="#F5F5F5"
              />
              <AppInput
                label="CPF *"
                placeholder="000.000.000-00"
                value={owner.cpf}
                onChangeText={(v) => updateOwner(index, "cpf", formatCpf(v))}
                keyboardType="numeric"
                containerStyle={styles.fieldSpacing}
                wrapperBackgroundColor="#F5F5F5"
              />
              <AppInput
                label="Nome da mãe *"
                placeholder="Informe o nome da mãe"
                value={owner.nomeMae}
                onChangeText={(v) => updateOwner(index, "nomeMae", v)}
                containerStyle={styles.fieldSpacing}
                wrapperBackgroundColor="#F5F5F5"
              />
              <AppInput
                label="Data de nascimento *"
                placeholder="00/00/0000"
                value={owner.dataNascimento}
                onChangeText={(v) =>
                  updateOwner(index, "dataNascimento", formatDate(v))
                }
                keyboardType="numeric"
                containerStyle={styles.fieldSpacing}
                wrapperBackgroundColor="#F5F5F5"
              />

              {/* Estado Civil Select */}
              <View style={styles.fieldSpacing}>
                <Text allowFontScaling={false} style={styles.selectLabel}>
                  Estado civil *
                </Text>
                <Pressable
                  style={styles.selectTrigger}
                  onPress={() =>
                    setOpenEstadoCivilIndex((curr) =>
                      curr === index ? null : index
                    )
                  }
                >
                  <Text
                    allowFontScaling={false}
                    style={[
                      styles.selectValue,
                      !owner.estadoCivil && styles.selectPlaceholder,
                    ]}
                  >
                    {owner.estadoCivil || "Selecionar estado civil"}
                  </Text>
                  <Ionicons
                    name={
                      openEstadoCivilIndex === index
                        ? "chevron-up"
                        : "chevron-down"
                    }
                    size={18}
                    color="#6F7480"
                  />
                </Pressable>
                {openEstadoCivilIndex === index && (
                  <View style={styles.optionsContainer}>
                    {ESTADO_CIVIL_OPTIONS.map((option) => (
                      <Pressable
                        key={option}
                        style={({ pressed }) => [
                          styles.optionItem,
                          pressed && styles.optionItemPressed,
                        ]}
                        onPress={() => {
                          updateOwner(index, "estadoCivil", option);
                          setOpenEstadoCivilIndex(null);
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

              {/* Conjuge */}
              {owner.estadoCivil === "casado(a)" && (
                <View style={styles.spouseBlock}>
                  <Text allowFontScaling={false} style={styles.spouseTitle}>
                    Dados do cônjuge
                  </Text>
                  <AppInput
                    label="Nome completo do cônjuge *"
                    placeholder="Informe o nome completo"
                    value={owner.conjuge.nomeCompleto}
                    onChangeText={(v) => updateSpouse(index, "nomeCompleto", v)}
                    containerStyle={styles.fieldSpacing}
                    wrapperBackgroundColor="#F5F5F5"
                  />
                  <AppInput
                    label="CPF do cônjuge *"
                    placeholder="000.000.000-00"
                    value={owner.conjuge.cpf}
                    onChangeText={(v) =>
                      updateSpouse(index, "cpf", formatCpf(v))
                    }
                    keyboardType="numeric"
                    containerStyle={styles.fieldSpacing}
                    wrapperBackgroundColor="#F5F5F5"
                  />
                  <AppInput
                    label="Nome da mãe do cônjuge *"
                    placeholder="Informe o nome da mãe"
                    value={owner.conjuge.nomeMae}
                    onChangeText={(v) => updateSpouse(index, "nomeMae", v)}
                    containerStyle={styles.fieldSpacing}
                    wrapperBackgroundColor="#F5F5F5"
                  />
                  <AppInput
                    label="Data de nascimento do cônjuge *"
                    placeholder="00/00/0000"
                    value={owner.conjuge.dataNascimento}
                    onChangeText={(v) =>
                      updateSpouse(index, "dataNascimento", formatDate(v))
                    }
                    keyboardType="numeric"
                    containerStyle={styles.fieldSpacingLast}
                    wrapperBackgroundColor="#F5F5F5"
                  />
                </View>
              )}
            </View>
          ))}

          <Pressable style={styles.addButton} onPress={addOwner}>
            <Ionicons
              name="add-circle-outline"
              size={18}
              color={AppTheme.colors.primary}
            />
            <Text allowFontScaling={false} style={styles.addButtonText}>
              Adicionar proprietário
            </Text>
          </Pressable>
        </View>

        {/* Action buttons */}
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
