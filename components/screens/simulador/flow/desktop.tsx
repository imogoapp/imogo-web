import axios, { isAxiosError } from "axios";
import { router } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import { Alert, Modal, ScrollView, Text, View } from "react-native";

import { createBaseWebNavigationItems } from "@/components/screens/home/home-tools";
import BaseWeb from "@/components/ui/base-web";
import { AuthUser, getSession, API_BASE_URL } from "@/services/auth";
import { setSimuladorLink } from "@/app/(tabs)/(app)/simulador/state";

import { AppInput } from "@/components/ui/app-input";
import { BaseWebButton } from "@/components/ui/base-web-button";
import { simuladorFlowContent } from "./content";
import styles from "./styles/web-styles";

type SimuladorFlowDesktopProps = {
  user: AuthUser | null;
  onLogout: () => void;
};

const session = getSession();
const Key = session?.key;

function formatCurrency(value: string) {
  const numericValue = value.replace(/\D/g, "");
  if (!numericValue) {
    return "";
  }

  const amount = Number(numericValue) / 100;
  return amount.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
  });
}

function formatPhone(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 11);

  if (digits.length <= 2) {
    return digits ? `(${digits}` : "";
  }
  if (digits.length <= 7) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  }
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
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

function getAgeValidationMessage(value: string) {
  if (value.length !== 10) {
    return "";
  }

  const [day, month, year] = value.split("/").map(Number);
  const birthDate = new Date(year, month - 1, day);

  if (
    Number.isNaN(birthDate.getTime()) ||
    birthDate.getDate() !== day ||
    birthDate.getMonth() !== month - 1 ||
    birthDate.getFullYear() !== year
  ) {
    return "Data de nascimento inválida";
  }

  const today = new Date();
  let age = today.getFullYear() - year;
  const hasBirthdayPassed =
    today.getMonth() > month - 1 ||
    (today.getMonth() === month - 1 && today.getDate() >= day);

  if (!hasBirthdayPassed) {
    age -= 1;
  }

  return age < 18 ? "Você precisa ter +18 anos" : "";
}

function currencyToNumber(value: string) {
  const digits = value.replace(/\D/g, "");
  return digits ? Number(digits) / 100 : 0;
}

export default function SimuladorFlowDesktop({
  user,
  onLogout,
}: SimuladorFlowDesktopProps) {
  
  const navigationItems = useMemo(
    () =>
      createBaseWebNavigationItems({
        activeId: "credito",
        onNavigate: (path) => router.replace(path as never),
      }),
    [],
  );

  const [loading, setLoading] = useState(false);
  const [nomeCompleto, setNomeCompleto] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");
  const [phone, setPhone] = useState("");
  const [valorVendaImovel, setValorVendaImovel] = useState("");
  const [valorFinanciamentoImovel, setValorFinanciamentoImovel] = useState("");
  const [valorFGTS, setValorFGTS] = useState("");
  const [rendaBruta, setRendaBruta] = useState("");
  const [rendaLiq, setRendaLiq] = useState("");
  const [prazo, setPrazo] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (user?.name) {
      setNomeCompleto(user.name);
    }
  }, [user]);

  const valorEntrada = useMemo(() => {
    const venda = currencyToNumber(valorVendaImovel);
    const financiamento = currencyToNumber(valorFinanciamentoImovel);
    const entrada = venda - financiamento;
    return entrada > 0 ? formatCurrency(String(Math.round(entrada * 100))) : "";
  }, [valorFinanciamentoImovel, valorVendaImovel]);

  const isFormValid = Boolean(
    nomeCompleto &&
      dataNascimento &&
      phone &&
      valorVendaImovel &&
      valorFinanciamentoImovel &&
      rendaBruta &&
      rendaLiq &&
      prazo &&
      !errorMessage,
  );

  const handleBirthDateChange = (value: string) => {
    const formattedValue = formatDate(value);
    setDataNascimento(formattedValue);
    setErrorMessage(getAgeValidationMessage(formattedValue));
  };

  const handleFinancingChange = (value: string) => {
    const formattedValue = formatCurrency(value);
    const venda = currencyToNumber(valorVendaImovel);
    const financiamento = currencyToNumber(formattedValue);
    const maxValue = venda * 0.8;

    if (maxValue > 0 && financiamento > maxValue) {
      setValorFinanciamentoImovel(
        formatCurrency(String(Math.round(maxValue * 100))),
      );
      return;
    }

    setValorFinanciamentoImovel(formattedValue);
  };

  const handlePrazoChange = (value: string) => {
    const digits = value.replace(/\D/g, "");
    if (!digits) {
      setPrazo("");
        return;
    }

    const limitedValue = Math.min(Number(digits), 420);
    setPrazo(String(limitedValue));
  };

  const handleSubmit = async () => {
    if (!isFormValid) {
      return;
    }

    setLoading(true);

    try {
      const payload = {
        nome: nomeCompleto,
        data_nascimento: dataNascimento,
        telefone: phone,
        email: user?.email || "",
        valor_imovel: valorVendaImovel.replace(/[^\d]/g, "").slice(0, -2) || "0",
        valor_afinanciar: valorFinanciamentoImovel.replace(/[^\d]/g, "").slice(0, -2) || "0",
        valor_renda_bruta: rendaBruta.replace(/[^\d]/g, "").slice(0, -2) || "0",
        valor_renda_liquida: rendaLiq.replace(/[^\d]/g, "").slice(0, -2) || "0",
        valor_fgts: valorFGTS.replace(/[^\d]/g, "").slice(0, -2) || "0",
        qtd_parcelas: prazo,
      };

      const response = await axios.post(`${API_BASE_URL}/api/v2/quadracred/simulador`, payload, {
        headers: {
          Accept: "application/json",
          "X-API-Key": Key,
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200 && response.data?.imprimir_link) {
        setSimuladorLink(response.data.imprimir_link);
        router.push("/simulador/resultado");
      } else {
        Alert.alert("Erro", "Ocorreu um erro ao gerar a simulação.");
      }
    } catch (error) {
      if (isAxiosError(error)) {
        Alert.alert("Erro", error.response?.data?.message || "Não foi possível enviar os dados da simulação.");
      } else {
        Alert.alert("Erro", "Ocorreu um erro inesperado.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <BaseWeb user={user} navigationItems={navigationItems} onLogout={onLogout}>
      <ScrollView contentContainerStyle={styles.contentMinimal}>
        <View style={styles.formContainer}>
          <Text style={styles.title}>{simuladorFlowContent.title}</Text>
          <Text style={styles.subtitle}>{simuladorFlowContent.description}</Text>

          <AppInput
            label="Nome Completo *"
            value={nomeCompleto}
            onChangeText={setNomeCompleto}
            placeholder="Nome Completo"
          />

          <View style={styles.areaRow}>
            <View style={styles.areaColumn}>
              <AppInput
                label="Data de nascimento *"
                value={dataNascimento}
                onChangeText={handleBirthDateChange}
                placeholder="00/00/0000"
                keyboardType="numeric"
                errorMessage={errorMessage}
              />
            </View>
            <View style={styles.areaColumn}>
              <AppInput
                label="Telefone *"
                value={phone}
                onChangeText={(value) => setPhone(formatPhone(value))}
                placeholder="(00) 00000-0000"
                keyboardType="phone-pad"
              />
            </View>
          </View>

          <View style={styles.divider} />

          <AppInput
            label="Valor de venda do imóvel *"
            value={valorVendaImovel}
            onChangeText={(value) => setValorVendaImovel(formatCurrency(value))}
            placeholder="R$"
            keyboardType="numeric"
          />

          <View style={styles.areaRow}>
            <View style={styles.areaColumn}>
              <AppInput
                label="Valor que deseja financiar *"
                value={valorFinanciamentoImovel}
                onChangeText={handleFinancingChange}
                placeholder="R$"
                keyboardType="numeric"
              />
            </View>
            <View style={styles.areaColumn}>
              <AppInput
                label="Prazo *"
                value={prazo}
                onChangeText={handlePrazoChange}
                placeholder="420x"
                keyboardType="numeric"
              />
            </View>
          </View>

          <View style={styles.areaRow}>
            <View style={styles.areaColumn}>
              <AppInput
                label="Valor da entrada"
                value={valorEntrada}
                placeholder="R$"
                editable={false}
              />
            </View>
            <View style={styles.areaColumn}>
              <AppInput
                label="Valor do FGTS *"
                value={valorFGTS}
                onChangeText={(value) => setValorFGTS(formatCurrency(value))}
                placeholder="R$"
                keyboardType="numeric"
              />
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.areaRow}>
            <View style={styles.areaColumn}>
              <AppInput
                label="Renda Bruta *"
                value={rendaBruta}
                onChangeText={(value) => setRendaBruta(formatCurrency(value))}
                placeholder="R$"
                keyboardType="numeric"
              />
            </View>
            <View style={styles.areaColumn}>
              <AppInput
                label="Renda Líquida *"
                value={rendaLiq}
                onChangeText={(value) => setRendaLiq(formatCurrency(value))}
                placeholder="R$"
                keyboardType="numeric"
              />
            </View>
          </View>

          <View style={styles.buttonContainer}>
            <BaseWebButton
              label={simuladorFlowContent.primaryActionLabel}
              onPress={handleSubmit}
              disabled={!isFormValid}
            />
          </View>

          <Modal transparent animationType="fade" visible={loading}>
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>Gerando Simulação...</Text>
            </View>
          </Modal>
        </View>
      </ScrollView>
    </BaseWeb>
  );
}
