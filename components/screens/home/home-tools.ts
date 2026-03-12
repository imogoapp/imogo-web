import type { Href } from "expo-router";
import { type ImageSourcePropType } from "react-native";

import { HomeToolItem } from "@/components/screens/home/components/home-tools-grid";

export type HomeFeatureDefinition = {
  id: string;
  icon: ImageSourcePropType;
  iconDisabled?: ImageSourcePropType;
  label: string;
  navLabel?: string;
  description: string;
  accentColor: string;
  route?: Href;
  disabled?: boolean;
};

export type BaseWebNavigationConfig = {
  id: string;
  label: string;
  route?: Href;
  icon: ImageSourcePropType;
  iconDisabled?: ImageSourcePropType;
  disabled?: boolean;
  active?: boolean;
  onPress?: () => void;
};

type CreateHomeToolItemsParams = {
  onNavigate: (path: Href) => void;
};

type CreateBaseWebNavigationItemsParams = {
  activeId?: string;
  onNavigate: (path: Href) => void;
};

export function getHomeFeatureDefinitions(): HomeFeatureDefinition[] {
  return [
    {
      id: "precificador",
      icon: require("@/assets/icons/avaliador-roxo.png"),
      iconDisabled: require("@/assets/icons/home_cinza.png"),
      label: "PRECIFICADOR",
      navLabel: "PRECIFICADOR",
      description:
        "Gere uma avaliação detalhada do valor do seu imóvel em menos de 1 minuto.",
      accentColor: "#f5f5f5",
      route: "/precificador",
      disabled: false,
    },
    {
      id: "credito",
      icon: require("@/assets/icons/money.png"),
      iconDisabled: require("@/assets/icons/avaliador-cinza.png"),
      label: "SIMULADOR DE CRÉDITO IMOBILIÁRIO",
      navLabel: "CRÉDITO",
      description:
        "Faça simulações rápidas para facilitar a comparação de taxas e prazos.",
      accentColor: "#f5f5f5",
      route: "/simulador",
      disabled: false,
    },
    {
      id: "certidoes",
      icon: require("@/assets/icons/query.png"),
      iconDisabled: require("@/assets/icons/query_cinza.png"),
      label: "EMISSÃO DE CERTIDÕES",
      navLabel: "CERTIDÕES",
      description:
        "Solicite uma emissão de certidões da imoGo, você recebe, em até um dia útil, todas as certidões relativas a situação jurídica do proprietário e do imóvel.",
      accentColor: "#f5f5f5",
      route: "/certidoes",
      disabled: false,
    },
    {
      id: "staging",
      icon: require("@/assets/icons/foto_ia.png"),
      iconDisabled: require("@/assets/icons/foto_ia_cinza.png"),
      label: "HOME STAGING",
      navLabel: "STAGING",
      description:
        "Decore digitalmente os seus imóveis, criando imagens realistas e atraentes para vender mais.",
      accentColor: "#f5f5f5",
      route: "/staging",
      disabled: false,
    },
    {
      id: "planejador",
      icon: require("@/assets/icons/planejador.png"),
      iconDisabled: require("@/assets/icons/planejador_cinza.png"),
      label: "PLANEJADOR DE REDES SOCIAIS",
      navLabel: "PLANEJADOR",
      description:
        "Planeje e automatize publicações para se destacar nas redes sociais.",
      accentColor: "#f5f5f5",
      route: "/planejador",
      disabled: false,
    },

    {
      id: "trilha",
      icon: require("@/assets/icons/play.png"),
      iconDisabled: require("@/assets/icons/play_cinza.png"),
      label: "TRILHA DO CONHECIMENTO",
      navLabel: "TRILHA",
      description:
        "Fique por dentro das melhores práticas do mercado imobiliário! Aprimore suas habilidades e se diferencie.",
      accentColor: "#f5f5f5",
      route: "/trilha",
      disabled: false,
    },

    {
      id: "contratos",
      icon: require("@/assets/icons/files.png"),
      iconDisabled: require("@/assets/icons/files_cinza.png"),
      label: "GERADOR DE CONTRATOS",
      navLabel: "CONTRATOS",
      description:
        "Gere contratos com modelos validados em poucos minutos para serem assinados digitalmente.",
      accentColor: "#f5f5f5",
      route: "/contratos",
      disabled: false,
    },
    {
      id: "boletos",
      icon: require("@/assets/icons/barcode.png"),
      iconDisabled: require("@/assets/icons/barcode_cinza.png"),
      label: "PARCELAMENTO DE BOLETOS",
      navLabel: "BOLETOS",
      description:
        "Parcele o pagamento de qualquer boleto usando o limite do seu cartão de crédito!",
      accentColor: "#f5f5f5",
      disabled: true,
    },
    {
      id: "anuncios",
      icon: require("@/assets/icons/gerador.png"),
      iconDisabled: require("@/assets/icons/gerador_cinza.png"),
      label: "GERADOR DE ANÚNCIOS",
      navLabel: "ANÚNCIOS",
      description:
        "Crie anúncios profissionais usando Inteligência artificial.",
      accentColor: "#f5f5f5",
      route: "/modal",
      disabled: true,
    },
  ];
}

export function createBaseWebNavigationItems({
  activeId,
  onNavigate,
}: CreateBaseWebNavigationItemsParams): BaseWebNavigationConfig[] {
  return getHomeFeatureDefinitions().map((feature) => {
    const route = feature.route;

    return {
      id: feature.id,
      label: feature.navLabel ?? feature.label,
      route,
      icon: feature.icon,
      iconDisabled: feature.iconDisabled,
      disabled: feature.disabled,
      active: feature.id === activeId,
      onPress: route ? () => onNavigate(route) : undefined,
    };
  });
}

export function createHomeToolItems({
  onNavigate,
}: CreateHomeToolItemsParams): HomeToolItem[] {
  return getHomeFeatureDefinitions().map((feature) => {
    const route = feature.route;

    return {
      id: feature.id,
      icon: feature.disabled
        ? (feature.iconDisabled ?? feature.icon)
        : feature.icon,
      label: feature.label,
      disabled: feature.disabled,
      onPress: route ? () => onNavigate(route) : undefined,
    };
  });
}
