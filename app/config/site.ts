export type SiteConfig = {
  name: string;
  description: string;
  url: string;
  ogImage: string;
  links: {
    twitter: string;
    github: string;
  };
};

export const siteConfig: SiteConfig = {
  name: "soso.fan",
  description:
    "一个开源付费墙绕过网站，具有即时人工智能摘要",
  url: "https://soso.fan",
  ogImage: "https://tx.shadcn.com/og.jpg",
  links: {
    twitter: "https://twitter.com/#",
    github: "https://github.com/#",
  },
};
