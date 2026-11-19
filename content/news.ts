export type NewsStory = {
  id: string;
  title: string;
  place: string;
  date: string;
  body: string;
  image: string;
  href: string;
};

const body =
  "We specialize in a wide range of amusement equipments, including redemption machines, arcade games, video simulator games. Our bestsellers, such as large LCD screen 4-player water shooting games, car racing games, gun shooting games, basketball games, bowling games, and prize machines, are popular worldwide.";

export const newsStories = [
  {
    id: "zhongshan-exhibition-2022",
    title: "Zhongshan Exhibition 2022",
    place: "Zhongshan, China",
    date: "Aug 13, 2024",
    body,
    image: "/ace/news-zhongshan-booth.webp",
    href: "https://substack.com",
  },
  {
    id: "zhongshan-exhibition-november-2022",
    title: "Zhongshan Exhibition in November 2022",
    place: "Zhongshan, China",
    date: "Aug 13, 2024",
    body,
    image: "/ace/news-zhongshan-floor.webp",
    href: "https://substack.com",
  },
  {
    id: "aaa-guangzhou-august-2022",
    title: "AAA Guangzhou Exhibition in August 2022",
    place: "Zhongshan, China",
    date: "Aug 13, 2024",
    body,
    image: "/ace/news-guangzhou-arcade.webp",
    href: "https://substack.com",
  },
  {
    id: "iaapa-orlando-2023",
    title: "IAAPA Expo Orlando 2023",
    place: "Orlando, USA",
    date: "Nov 14, 2023",
    body,
    image: "/ace/news-zhongshan-floor.webp",
    href: "https://substack.com",
  },
  {
    id: "deal-dubai-2024",
    title: "DEAL Dubai 2024",
    place: "Dubai, UAE",
    date: "May 8, 2024",
    body,
    image: "/ace/news-guangzhou-arcade.webp",
    href: "https://substack.com",
  },
  {
    id: "gti-asia-china-2024",
    title: "GTI Asia China Expo 2024",
    place: "Guangzhou, China",
    date: "Sep 2, 2024",
    body,
    image: "/ace/news-zhongshan-booth.webp",
    href: "https://substack.com",
  },
] as const satisfies readonly NewsStory[];
