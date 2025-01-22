import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { GeistSans } from "geist/font/sans";
import "./globals.css";
import { GoogleAnalytics } from '@next/third-parties/google'

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  openGraph: {
    type: "website",
    title: "SoSo.Fan | AI 摘要和免费付费墙移除器",
    siteName: "soso.fan",
    url: "https://soso.fan",
    description:
      "移除付费墙并免费总结文章，涵盖纽约时报、华盛顿邮报等。无需登录即可即时访问内容，获得更快的见解。",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="bg-[#FAFAFA]">
      {/* <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head> */}
      <body
        className={`${GeistSans.className} bg-[#FAFAFA]`}
        // style={{background: "#E5EDF0"}}
        // style={{
        //   background:
        //     "radial-gradient(circle at 18.7% 37.8%, rgb(250, 250, 250) 0%, rgb(225, 234, 238) 90%);",
        // }}
      >
        <GoogleAnalytics gaId="G-RFC55FX414" />
        {children}
      </body>
    </html>
  );
}
