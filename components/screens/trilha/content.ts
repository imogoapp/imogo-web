import { type Href } from "expo-router";

export type TrilhaCardItem = {
  id: string;
  image: string;
  locked: boolean;
  unlockDate?: string;
  link: Href;
};

export const trilhaCards: TrilhaCardItem[] = [
  {
    id: "1",
    image: "https://cdn.imogo.com.br/img/evento-trilha/13.png",
    locked: false,
    unlockDate: "25/02 as 9h",
    link: "https://juk.re/live-25-02",
  },
  {
    id: "2",
    image: "https://cdn.imogo.com.br/img/evento-trilha/10.png",
    locked: false,
    unlockDate: "01/04 as 9h",
    link: "https://juk.re/live-01-04",
  },
  {
    id: "3",
    image: "https://cdn.imogo.com.br/img/evento-trilha/11.png",
    locked: false,
    unlockDate: "30/04 as 9h",
    link: "https://juk.re/live-30-04",
  },
  {
    id: "4",
    image: "https://cdn.imogo.com.br/img/evento-trilha/12.png",
    locked: false,
    unlockDate: "29/05 as 9h",
    link: "https://juk.re/live-29-05",
  },
  {
    id: "5",
    image: "https://cdn.imogo.com.br/img/evento-trilha/14.png",
    locked: false,
    unlockDate: "24/06 as 9h",
    link: "https://juk.re/live-24-06",
  },
];

export const TrilhaContent = {
  title: "Trilha do conhecimento",
  previewText:
    "Acompanhe os encontros da trilha e acesse os conteudos disponiveis em cada etapa.",
} as const;
