export const precificadorContent = {
  title: "Precificador imobiliário",
  shortTitle: "Precificador",
  shortSubtitle: "Avaliação precisa (BETA)",
  previewActionLabel: "Gerar laudo avaliativo",
  previewText:
    "Descubra o valor estimado do imóvel com base em dados reais do mercado, comparativos da região e características do bem.",
  flowIntroText:
    "Preencha os dados do imóvel em etapas curtas para gerar uma estimativa mais precisa.",
  flowSteps: [
    {
      id: "localizacao",
      label: "Localização",
      title: "Onde fica o imóvel?",
      description:
        "Selecione cidade, bairro e endereço a partir da base disponível.",
    },
    {
      id: "caracteristicas",
      label: "Características",
      title: "Detalhes do imóvel",
      description:
        "Tipo, metragem e padrão ajudam a calibrar melhor a análise.",
    },
    {
      id: "contato",
      label: "Contato",
      title: "Dados para envio",
      description: "Usamos esses dados apenas para identificar e enviar o laudo.",
    },
  ],
  flowNextLabel: "Avançar",
  flowBackLabel: "Voltar",
  flowPrimaryActionLabel: "Gerar laudo",
} as const;
