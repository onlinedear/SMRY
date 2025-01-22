import type { Metadata } from "next";
import Nav from "@/components/nav";

export const metadata: Metadata = {
  title: "SoSo",
  description:
    "发现 SoSo：一种 AI 工具，它不仅可以总结长篇文章以便快速理解，还可以巧妙地穿越付费墙，快速访问受限内容。",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <section><Nav />{children}</section>
}
