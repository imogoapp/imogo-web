export const simuladorContent = {
  title: "Simulador de crédito imobiliário",
  previewActionLabel: "Gerar uma simulação em vários bancos",
  previewText:
    "Faça agora uma simulação de crédito imobiliário e compare as melhores opções de financiamento dos principais bancos.",
  primaryActionLabel: "Fazer Simulação",
  externalSimulators: [
    {
      id: "brb",
      label: "Simulador do BRB",
      url: "https://sfhsimulador.brb.com.br/simuladorbrb/",
    },
    {
      id: "caixa",
      label: "Simulador da CAIXA",
      url: "https://simuladorhabitacao.caixa.gov.br/home",
    },
    {
      id: "bradesco",
      label: "Simulador do Bradesco",
      url: "https://banco.bradesco/html/classic/produtos-servicos/emprestimo-e-financiamento/encontre-seu-credito/simuladores-imoveis.shtm",
    },
  ],
} as const;
