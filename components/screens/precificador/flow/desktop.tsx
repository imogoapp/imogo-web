import axios from "axios";
import { router } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import { Alert, Modal, ActivityIndicator, Pressable, Text, TextInput, View } from "react-native";

import { createBaseWebNavigationItems } from "@/components/screens/home/home-tools";
import BaseWeb from "@/components/ui/base-web";
import { AuthUser } from "@/services/auth";
import { setPrecificadorResultado } from "@/app/(tabs)/(app)/precificador/state";
import { AppTheme } from "@/constants/app-theme";
import { AppInput } from "@/components/ui/app-input";
import { BaseWebButton } from "@/components/ui/base-web-button";

import { AutocompleteField } from "./components/autocomplete-field";
import { SelectField } from "./components/select-field";
import { precificadorContent } from "./content";
import styles from "./styles/web-styles";

const API_BASE = "https://gateway-laudo.vercel.app/api/laudo/enderecos/df";
const API_TIPOS = "https://gateway-laudo.vercel.app/api/laudo/tipos";
const API_ESTIMATIVA = "https://gateway-laudo.vercel.app/api/laudo/estimativa";

type PrecificadorDesktopProps = {
  user: AuthUser | null;
  onLogout: () => void;
};

type FormState = {
  tipoImovel: string;
  cidadeImovel: string;
  bairroImovel: string;
  enderecoImovel: string;
  quantidadeQuartosImovel: string;
  quantidadeSuiteImovel: string;
  quantidadeVagasImovel: string;
  padraoImovel: string;
  metragem: string;
};

type OpenMenu =
  | "tipo"
  | "cidade"
  | "bairro"
  | "endereco"
  | "quartos"
  | "suites"
  | "vagas"
  | "padrao"
  | null;

const TYPE_OPTIONS = [
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
];

const NUMBER_OPTIONS = Array.from({ length: 10 }, (_, index) => String(index));

const CONDITION_OPTIONS = [
  "ORIGINAL, REQUER MUITOS REPAROS",
  "IMÓVEL PADRÃO, COM MANUTENÇÃO EM DIA",
  "REFORMADO, EM EXCELENTE ESTADO",
];

function repairText(value: string) {
  try {
    return decodeURIComponent(escape(value));
  } catch {
    return value;
  }
}

function normalizeValue(value: string) {
  return repairText(value).trim();
}

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

export default function PrecificadorDesktop({
  user,
  onLogout,
}: PrecificadorDesktopProps) {
  const navigationItems = useMemo(
    () =>
      createBaseWebNavigationItems({
        activeId: "precificador",
        onNavigate: (path) => router.replace(path as never),
      }),
    [],
  );

  const [openMenu, setOpenMenu] = useState<OpenMenu>(null);
  const [form, setForm] = useState<FormState>({
    tipoImovel: "",
    cidadeImovel: "",
    bairroImovel: "",
    enderecoImovel: "",
    quantidadeQuartosImovel: "",
    quantidadeSuiteImovel: "",
    quantidadeVagasImovel: "",
    padraoImovel: "",
    metragem: "",
  });

  const [isLoadingData, setIsLoadingData] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [locationData, setLocationData] = useState<Record<string, Record<string, string[]>>>({});
  const [availableTypes, setAvailableTypes] = useState<string[]>(TYPE_OPTIONS);

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
          const raw = locRes.value.data.enderecos;
          const processed = Object.entries(raw).reduce<Record<string, Record<string, string[]>>>(
            (acc, [city, value]) => {
              if (city === "processado_em" || typeof value !== "object") return acc;
              acc[normalizeValue(city)] = Object.entries(value as any).reduce<Record<string, string[]>>(
                (groupAcc, [neighborhood, addresses]) => {
                  groupAcc[normalizeValue(neighborhood)] = Array.isArray(addresses)
                    ? addresses.map(normalizeValue)
                    : [];
                  return groupAcc;
                },
                {}
              );
              return acc;
            },
            {}
          );
          setLocationData(processed);
        }

        if (tiposRes.status === "fulfilled" && Array.isArray(tiposRes.value.data?.tipos)) {
          setAvailableTypes(tiposRes.value.data.tipos.map((t: any) => (t.tipo || "").toUpperCase()));
        }
      } finally {
        if (mounted) setIsLoadingData(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  const cityOptions = useMemo(
    () => Object.keys(locationData).sort((a, b) => a.localeCompare(b, "pt-BR")),
    [locationData],
  );

  const neighborhoodOptions = useMemo(() => {
    if (!form.cidadeImovel) {
      return [];
    }

    return Object.keys(locationData[form.cidadeImovel] ?? {}).sort((a, b) =>
      a.localeCompare(b, "pt-BR"),
    );
  }, [form.cidadeImovel, locationData]);

  const addressOptions = useMemo(() => {
    if (!form.cidadeImovel || !form.bairroImovel) {
      return [];
    }

    const addresses =
      locationData[form.cidadeImovel]?.[form.bairroImovel] ?? [];
    const query = form.enderecoImovel.trim().toLocaleLowerCase("pt-BR");

    if (!query) {
      return addresses.slice(0, 50);
    }

    return addresses
      .filter((item) => item.toLocaleLowerCase("pt-BR").includes(query))
      .slice(0, 50);
  }, [form.bairroImovel, form.cidadeImovel, form.enderecoImovel, locationData]);

  const updateField = (key: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const isFormValid = Boolean(
    form.tipoImovel &&
      form.cidadeImovel &&
      form.bairroImovel &&
      form.enderecoImovel &&
      form.padraoImovel &&
      form.metragem,
  );

  const handleSubmit = async () => {
    if (!isFormValid) {
      Alert.alert("Atenção", "Preencha todos os campos obrigatórios.");
      return;
    }

    const metragemNum = parseFloat(form.metragem.replace(",", "."));
    if (!metragemNum || Number.isNaN(metragemNum) || metragemNum <= 0) {
      Alert.alert("Atenção", "Informe uma metragem válida.");
      return;
    }

    const params = {
      cidade: form.cidadeImovel,
      bairro: form.bairroImovel,
      endereco: form.enderecoImovel,
      tipo: form.tipoImovel,
      limite: 20,
      quartos: toIntFromOption(form.quantidadeQuartosImovel),
      vagas: toIntFromOption(form.quantidadeVagasImovel),
      suites: toIntFromOption(form.quantidadeSuiteImovel),
      metragem: metragemNum,
      estado_conservacao: mapPadraoToApi(form.padraoImovel),
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
              whatsapp: "",
              sucess: true,
              json_imovel: {
                bairro: form.bairroImovel,
                cidade: form.cidadeImovel,
                endereco: form.enderecoImovel,
                estado_conservacao: mapPadraoToApi(form.padraoImovel) || "Padrão",
                tipo: form.tipoImovel,
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
              origem: "mobile-app-desktop-web",
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

  return (
    <BaseWeb user={user} navigationItems={navigationItems} onLogout={onLogout}>
      <View style={styles.contentMinimal as any}>
        <View style={styles.formContainer as any}>
          <Text style={styles.title as any}>{precificadorContent.shortTitle}</Text>
          <Text style={styles.subtitle as any}>{precificadorContent.shortSubtitle}</Text>

          <SelectField
            label="Tipo de imóvel *"
            value={form.tipoImovel}
            placeholder="Selecionar"
            options={availableTypes}
            isOpen={openMenu === "tipo"}
            onToggle={() => setOpenMenu((current) => (current === "tipo" ? null : "tipo"))}
            onSelect={(value) => {
              updateField("tipoImovel", value);
              setOpenMenu(null);
            }}
          />

          <SelectField
            label="Cidade *"
            value={form.cidadeImovel}
            placeholder="Selecionar"
            options={cityOptions}
            isOpen={openMenu === "cidade"}
            onToggle={() =>
              setOpenMenu((current) => (current === "cidade" ? null : "cidade"))
            }
            onSelect={(value) => {
              setForm((prev) => ({
                ...prev,
                cidadeImovel: value,
                bairroImovel: "",
                enderecoImovel: "",
              }));
              setOpenMenu(null);
            }}
          />

          <SelectField
            label="Bairro *"
            value={form.bairroImovel}
            placeholder="Selecionar"
            options={neighborhoodOptions}
            isOpen={openMenu === "bairro"}
            disabled={!form.cidadeImovel}
            onToggle={() =>
              setOpenMenu((current) => (current === "bairro" ? null : "bairro"))
            }
            onSelect={(value) => {
              setForm((prev) => ({
                ...prev,
                bairroImovel: value,
                enderecoImovel: "",
              }));
              setOpenMenu(null);
            }}
          />

          <AutocompleteField
            label="Endereço *"
            value={form.enderecoImovel}
            placeholder="Digite o endereço (sugestões aparecerão abaixo)"
            options={addressOptions}
            isOpen={openMenu === "endereco"}
            disabled={!form.cidadeImovel || !form.bairroImovel}
            onFocus={() => setOpenMenu("endereco")}
            onChangeText={(value) => {
              updateField("enderecoImovel", value);
              setOpenMenu("endereco");
            }}
            onSelect={(value) => {
              updateField("enderecoImovel", value);
              setOpenMenu(null);
            }}
          />

          <View style={styles.divider as any} />

          <SelectField
            label="Nº de quartos (opcional)"
            value={form.quantidadeQuartosImovel}
            placeholder="Selecionar"
            options={NUMBER_OPTIONS}
            isOpen={openMenu === "quartos"}
            onToggle={() =>
              setOpenMenu((current) => (current === "quartos" ? null : "quartos"))
            }
            onSelect={(value) => {
              updateField("quantidadeQuartosImovel", value);
              setOpenMenu(null);
            }}
          />

          <SelectField
            label="Nº de suítes (opcional)"
            value={form.quantidadeSuiteImovel}
            placeholder="Selecionar"
            options={NUMBER_OPTIONS}
            isOpen={openMenu === "suites"}
            onToggle={() =>
              setOpenMenu((current) => (current === "suites" ? null : "suites"))
            }
            onSelect={(value) => {
              updateField("quantidadeSuiteImovel", value);
              setOpenMenu(null);
            }}
          />

          <SelectField
            label="Nº de vagas (opcional)"
            value={form.quantidadeVagasImovel}
            placeholder="Selecionar"
            options={NUMBER_OPTIONS}
            isOpen={openMenu === "vagas"}
            onToggle={() =>
              setOpenMenu((current) => (current === "vagas" ? null : "vagas"))
            }
            onSelect={(value) => {
              updateField("quantidadeVagasImovel", value);
              setOpenMenu(null);
            }}
          />

          <AppInput
            label="Metragem útil *"
            value={form.metragem}
            onChangeText={(value) => updateField("metragem", value)}
            keyboardType="numeric"
            placeholder="Informar a metragem útil em m²"
            containerStyle={{ marginBottom: 16 }}
          />

          <SelectField
            label="Padrão atual do imóvel *"
            value={form.padraoImovel}
            placeholder="Selecionar"
            options={CONDITION_OPTIONS}
            isOpen={openMenu === "padrao"}
            onToggle={() =>
              setOpenMenu((current) => (current === "padrao" ? null : "padrao"))
            }
            onSelect={(value) => {
              updateField("padraoImovel", value);
              setOpenMenu(null);
            }}
          />

          <View style={styles.divider as any} />

          <View style={styles.buttonContainer as any}>
            <BaseWebButton
              label={isSubmitting ? "Enviando..." : precificadorContent.flowPrimaryActionLabel}
              onPress={handleSubmit}
              disabled={!isFormValid || isSubmitting}
            />
          </View>

          <Modal transparent animationType="fade" visible={isLoadingData || isSubmitting}>
            <View
              style={{
                flex: 1,
                backgroundColor: "rgba(0,0,0,0.5)",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <View
                style={{
                  backgroundColor: AppTheme.colors.card,
                  padding: 32,
                  borderRadius: 16,
                  alignItems: "center",
                  minWidth: 280,
                  shadowColor: AppTheme.shadow.color,
                  shadowOffset: { width: AppTheme.shadow.offsetX, height: AppTheme.shadow.offsetY },
                  shadowOpacity: AppTheme.shadow.opacity,
                  shadowRadius: AppTheme.shadow.radius,
                  elevation: AppTheme.shadow.elevation,
                }}
              >
                <ActivityIndicator size="large" color={AppTheme.colors.primary} />
                <Text
                  style={{
                    marginTop: 16,
                    fontSize: 16,
                    color: AppTheme.colors.text,
                    fontFamily: AppTheme.typography.fontBold,
                  }}
                >
                  {isLoadingData ? "Carregando dados..." : "Calculando..."}
                </Text>
              </View>
            </View>
          </Modal>
        </View>
      </View>
    </BaseWeb>
  );
}
