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
import { useAnalytics } from "@/hooks/use-analytics";

type CertidoesCpfDesktopProps = {
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

const FLOW_STEPS = [
  {
    id: 1,
    label: "Dados do proprietário",
  },
  {
    id: 2,
    label: "Dados do imóvel",
  },
] as const;

const EMPTY_OWNER: OwnerForm = {
  nomeCompleto: "",
  nomeMae: "",
  cpf: "",
  dataNascimento: "",
  estadoCivil: "",
  conjuge: {
    nomeCompleto: "",
    nomeMae: "",
    cpf: "",
    dataNascimento: "",
  },
};

function getUserId(user: AuthUser | null) {
  return user?.public_id == null ? null : String(user.public_id);
}

function formatCpf(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 11);

  if (digits.length <= 3) {
    return digits;
  }
  if (digits.length <= 6) {
    return `${digits.slice(0, 3)}.${digits.slice(3)}`;
  }
  if (digits.length <= 9) {
    return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
  }

  return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`;
}

function formatDate(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 8);

  if (digits.length <= 2) {
    return digits;
  }
  if (digits.length <= 4) {
    return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  }

  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
}

function convertDateToISO(dateString: string) {
  if (!/^\d{2}\/\d{2}\/\d{4}$/.test(dateString)) {
    throw new Error("Data inválida. O formato esperado é DD/MM/AAAA.");
  }

  const [day, month, year] = dateString.split("/");
  return `${year}-${month}-${day}`;
}

function isOwnerComplete(owner: OwnerForm) {
  const hasBaseFields =
    owner.nomeCompleto.trim() &&
    owner.nomeMae.trim() &&
    owner.cpf.replace(/\D/g, "").length === 11 &&
    owner.dataNascimento.length === 10 &&
    owner.estadoCivil.trim();

  if (!hasBaseFields) {
    return false;
  }

  if (owner.estadoCivil.toLowerCase() !== "casado(a)") {
    return true;
  }

  return Boolean(
    owner.conjuge.nomeCompleto.trim() &&
      owner.conjuge.nomeMae.trim() &&
      owner.conjuge.cpf.replace(/\D/g, "").length === 11 &&
      owner.conjuge.dataNascimento.length === 10,
  );
}

export default function CertidoesCpfDesktop({
  user,
  onLogout,
}: CertidoesCpfDesktopProps) {
  const { trackEvent } = useAnalytics();
  trackEvent();

  const navigationItems = useMemo(
    () =>
      createBaseWebNavigationItems({
        activeId: "certidoes",
        onNavigate: (path) => router.replace(path as never),
      }),
    [],
  );

  const [owners, setOwners] = useState<OwnerForm[]>([{ ...EMPTY_OWNER }]);
  const [openEstadoCivilIndex, setOpenEstadoCivilIndex] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const userId = getUserId(user);
  const canSubmit = owners.every(isOwnerComplete) && !!userId && !isSubmitting;

  const updateOwner = (index: number, field: keyof OwnerForm, value: string) => {
    setOwners((current) =>
      current.map((owner, ownerIndex) =>
        ownerIndex === index ? { ...owner, [field]: value } : owner,
      ),
    );
  };

  const updateSpouse = (index: number, field: keyof SpouseForm, value: string) => {
    setOwners((current) =>
      current.map((owner, ownerIndex) =>
        ownerIndex === index
          ? {
              ...owner,
              conjuge: { ...owner.conjuge, [field]: value },
            }
          : owner,
      ),
    );
  };

  const addOwner = () => {
    setOwners((current) => [...current, { ...EMPTY_OWNER, conjuge: { ...EMPTY_OWNER.conjuge } }]);
  };

  const removeOwner = (index: number) => {
    setOwners((current) => current.filter((_, ownerIndex) => ownerIndex !== index));
    setOpenEstadoCivilIndex((current) => (current === index ? null : current));
  };

  const handleCreateAnalise = async () => {
    if (!userId) {
      Alert.alert("Erro", "Não foi possível identificar o usuário logado.");
      return;
    }

    if (!owners.every(isOwnerComplete)) {
      Alert.alert("Erro", "Preencha todos os campos obrigatórios dos proprietários.");
      return;
    }

    try {
      setIsSubmitting(true);

      const proprietarios = owners.map((owner) => {
        const proprietario: Record<string, unknown> = {
          nome_completo: owner.nomeCompleto.trim(),
          nome_mae: owner.nomeMae.trim(),
          cpf: owner.cpf,
          e_empresa: false,
          data_nascimento: convertDateToISO(owner.dataNascimento),
          estado_civil: owner.estadoCivil,
        };

        if (owner.estadoCivil.toLowerCase() === "casado(a)") {
          proprietario.conjuge = {
            nome_completo: owner.conjuge.nomeCompleto.trim(),
            cpf: owner.conjuge.cpf,
            nome_mae: owner.conjuge.nomeMae.trim(),
            data_nascimento: convertDateToISO(owner.conjuge.dataNascimento),
          };
        }

        return proprietario;
      });

      const response = await axios.post<CreateAnaliseResponse>(
        `${ANALISE_API_BASE_URL}/analises/etapa1/cpf/`,
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
        Alert.alert("Erro", "A API não retornou o identificador da análise.");
        return;
      }

      router.push(`/certidoes/imovel/${analiseId}` as never);
    } catch (error) {
      if (isAxiosError(error)) {
        const message =
          (error.response?.data as { detail?: string; message?: string } | undefined)?.detail ??
          (error.response?.data as { detail?: string; message?: string } | undefined)?.message ??
          "Não foi possível enviar os dados do proprietário.";
        Alert.alert("Erro", message);
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
    <BaseWeb user={user} navigationItems={navigationItems} onLogout={onLogout}>
      <ScrollView contentContainerStyle={styles.contentMinimal}>
        <View style={styles.container}>
          <Text style={styles.title}>Emissão de certidões</Text>
          {/* <Text style={styles.subtitle}>Etapa 1 de 2: dados do proprietario pessoa fisica</Text> */}

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
              Cadastre um ou mais proprietários.
            </Text>
          </View>

          <View style={styles.formContainer}>
            <View style={styles.formHeader}>
              <Text style={styles.formTitle}>Proprietários</Text>
              
            </View>

            {owners.map((owner, index) => (
              <View key={`owner-${index}`} style={styles.ownerBlock}>
                <View style={styles.ownerHeader}>
                  <Text style={styles.ownerTitle}>Dados do {index + 1}º proprietário</Text>
                  {owners.length > 1 ? (
                    <Pressable style={styles.removeButton} onPress={() => removeOwner(index)}>
                      <Ionicons name="trash-outline" size={14} color="#A22C2C" />
                      <Text style={styles.removeButtonText}>Remover</Text>
                    </Pressable>
                  ) : null}
                </View>

                <View style={styles.fieldRow}>
                  <AppInput
                    label="Nome completo *"
                    placeholder="Informe o nome completo"
                    value={owner.nomeCompleto}
                    onChangeText={(value) => updateOwner(index, "nomeCompleto", value)}
                    containerStyle={[styles.fieldSpacing, styles.fieldHalf]}
                    wrapperBackgroundColor="#F5F5F5"
                  />

                  <AppInput
                    label="CPF *"
                    placeholder="000.000.000-00"
                    value={owner.cpf}
                    onChangeText={(value) => updateOwner(index, "cpf", formatCpf(value))}
                    keyboardType="numeric"
                    containerStyle={[styles.fieldSpacing, styles.fieldHalf]}
                    wrapperBackgroundColor="#F5F5F5"
                  />
                </View>

                <AppInput
                  label="Nome da mãe *"
                  placeholder="Informe o nome da mãe"
                  value={owner.nomeMae}
                  onChangeText={(value) => updateOwner(index, "nomeMae", value)}
                  containerStyle={styles.fieldSpacing}
                  wrapperBackgroundColor="#F5F5F5"
                />

                <View style={styles.fieldRow}>
                  <AppInput
                    label="Data de nascimento *"
                    placeholder="00/00/0000"
                    value={owner.dataNascimento}
                    onChangeText={(value) => updateOwner(index, "dataNascimento", formatDate(value))}
                    keyboardType="numeric"
                    containerStyle={[styles.fieldSpacing, styles.fieldHalf]}
                    wrapperBackgroundColor="#F5F5F5"
                  />

                  <View style={[styles.fieldHalf, styles.fieldSpacing]}>
                    <Text style={styles.selectLabel}>Estado civil *</Text>
                    <Pressable
                      style={styles.selectTrigger}
                      onPress={() =>
                        setOpenEstadoCivilIndex((current) =>
                          current === index ? null : index,
                        )
                      }
                    >
                      <Text
                        style={[
                          styles.selectValue,
                          !owner.estadoCivil ? styles.selectPlaceholder : undefined,
                        ]}
                      >
                        {owner.estadoCivil || "Selecionar estado civil"}
                      </Text>
                      <Ionicons
                        name={openEstadoCivilIndex === index ? "chevron-up" : "chevron-down"}
                        size={18}
                        color="#6F7480"
                      />
                    </Pressable>

                    {openEstadoCivilIndex === index ? (
                      <View style={styles.optionsContainer}>
                        {ESTADO_CIVIL_OPTIONS.map((option) => (
                          <Pressable
                            key={option}
                            style={({ pressed }) => [
                              styles.optionItem,
                              pressed ? styles.optionItemPressed : undefined,
                            ]}
                            onPress={() => {
                              updateOwner(index, "estadoCivil", option);
                              setOpenEstadoCivilIndex(null);
                            }}
                          >
                            <Text style={styles.optionText}>{option}</Text>
                          </Pressable>
                        ))}
                      </View>
                    ) : null}
                  </View>
                </View>

                {owner.estadoCivil === "casado(a)" ? (
                  <View style={styles.spouseBlock}>
                    <Text style={styles.spouseTitle}>Dados do cônjuge</Text>

                    <View style={styles.fieldRow}>
                      <AppInput
                        label="Nome completo do cônjuge *"
                        placeholder="Informe o nome completo"
                        value={owner.conjuge.nomeCompleto}
                        onChangeText={(value) => updateSpouse(index, "nomeCompleto", value)}
                        containerStyle={[styles.fieldSpacing, styles.fieldHalf]}
                        wrapperBackgroundColor="#F5F5F5"
                      />

                      <AppInput
                        label="CPF do cônjuge *"
                        placeholder="000.000.000-00"
                        value={owner.conjuge.cpf}
                        onChangeText={(value) => updateSpouse(index, "cpf", formatCpf(value))}
                        keyboardType="numeric"
                        containerStyle={[styles.fieldSpacing, styles.fieldHalf]}
                        wrapperBackgroundColor="#F5F5F5"
                      />
                    </View>

                    <AppInput
                      label="Nome da mãe do cônjuge *"
                      placeholder="Informe o nome da mãe"
                      value={owner.conjuge.nomeMae}
                      onChangeText={(value) => updateSpouse(index, "nomeMae", value)}
                      containerStyle={styles.fieldSpacing}
                      wrapperBackgroundColor="#F5F5F5"
                    />

                    <AppInput
                      label="Data de nascimento do cônjuge *"
                      placeholder="00/00/0000"
                      value={owner.conjuge.dataNascimento}
                      onChangeText={(value) => updateSpouse(index, "dataNascimento", formatDate(value))}
                      keyboardType="numeric"
                      containerStyle={styles.fieldSpacingLast}
                      wrapperBackgroundColor="#F5F5F5"
                    />
                  </View>
                ) : null}
              </View>
            ))}

            <Pressable style={styles.addButton} onPress={addOwner}>
              <Ionicons name="add-circle-outline" size={18} color={AppTheme.colors.primary} />
              <Text style={styles.addButtonText}>Adicionar proprietário</Text>
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


