import { Configuration, OpenAIApi } from "openai-edge";
import { kv } from "@vercel/kv";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { encode, decode } from "gpt-tokenizer";
import { Ratelimit } from "@upstash/ratelimit";
import { headers } from "next/headers";
import ArrowTabs from "@/components/arrow-tabs";
import { ArticleContent } from "@/components/article-content";
import { ArticleLength } from "@/components/article-length";
import Loading from "./loading";
import { ResponsiveDrawer } from "@/components/responsiveDrawer";
import { GoogleGenerativeAI } from "@google/generative-ai";
import ReactMarkdown from "react-markdown";
import gfm from "remark-gfm"; // GitHub flavored markdown
import Ad from "@/components/ad";
import SummaryForm from "@/components/summary-form";
import ErrorBoundary from "@/components/error";

export const dynamic = "force-dynamic";

const adCopies = [
  {
    onClickTrack:
      "享受无障碍阅读的自由，请我喝杯咖啡！点击",
    adStart: "享受无障碍阅读的自由， ",
    adEnd: "请我喝杯咖啡！",
    link: "https://buymeacoffee.com/moodist",
  },
  {
    onClickTrack: "喜欢即时摘要？喝杯咖啡，让我们继续前进！点击",
    adStart: "喜欢即时摘要吗？ ",
    adEnd: "喝杯咖啡让我们继续前行！",
    link: "https://buymeacoffee.com/moodist",
  },
  {
    onClickTrack: "轻松解锁优质内容，请我喝杯咖啡！点击",
    adStart: "轻松解锁优质内容， ",
    adEnd: "请我喝杯咖啡！",
    link: "https://buymeacoffee.com/moodist",
  },
  {
    onClickTrack: "支持我们的无广告体验，请我喝杯咖啡！点击",
    adStart: "支持我们的无广告体验， ",
    adEnd: "请我喝杯咖啡！",
    link: "https://buymeacoffee.com/moodist",
  },
  {
    onClickTrack:
      "继续享受简洁的摘要，请我喝杯咖啡！点击",
    adStart: "继续享受简洁的摘要， ",
    adEnd: "请我喝杯咖啡！",
    link: "https://buymeacoffee.com/moodist",
  },
  {
    onClickTrack: "想享受无广告摘要吗？请我喝杯咖啡！点击",
    adStart: "享受无广告的摘要吗？",
    adEnd: "请我喝杯咖啡！",
    link: "https://buymeacoffee.com/moodist",
  },
  {
    onClickTrack: "帮助我们消除付费墙，请我喝杯咖啡！点击",
    adStart: "帮助我们消除付费墙， ",
    adEnd: "请我喝杯咖啡！",
    link: "https://buymeacoffee.com/moodist",
  },
  {
    onClickTrack: "支持无缝阅读，请我喝杯咖啡！点击",
    adStart: "支持无缝阅读， ",
    adEnd: "请我喝杯咖啡！",
    link: "https://buymeacoffee.com/moodist",
  },
  {
    onClickTrack: "想不受干扰地阅读？请我喝杯咖啡！点击",
    adStart: "享受不间断的阅读吗？ ",
    adEnd: "请我喝杯咖啡！",
    link: "https://buymeacoffee.com/moodist",
  },
  {
    onClickTrack: "继续快速获取摘要，请我喝杯咖啡！点击",
    adStart: "继续快速获取摘要, ",
    adEnd: "请我喝杯咖啡！",
    link: "https://buymeacoffee.com/moodist",
  },
];

type Article = {
  title: string;
  byline: null | string;
  dir: null | string;
  lang: null | string;
  content: string;
  textContent: string;
  length: number;
  siteName: null | string;
};

export type ResponseItem = {
  source: string;
  article?: Article;
  status?: string; // Assuming 'status' is optional and a string
  error?: string;
  cacheURL: string;
};

export default async function Page({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const headersList = headers();
  const ip = headersList.get("x-real-ip") || "default_ip";

  // 此处出现错误，生产中的 searchParams 为空

  const url = searchParams?.url as string;

  if (!url) {
    // 处理未提供 URL 或不是字符串的情况
    console.error(
      "URL parameter is missing or invalid",
      url,
      searchParams["url"],
      searchParams
    );
  }

  // 如果 URL 包含“orlandosentinel.com”，那么我们不应该返回任何内容，并让用户知道 orlando sentinel 文章不可用

  if (url?.includes("orlandosentinel.com")) {
    return (
      <div className="mt-20">
        抱歉，来自 orlando sentinel 的文章不可用
      </div>
    );
  }

  const sources = ["smry", "archive", "wayback", "jina.ai"];

  const adSelection = Math.floor(Math.random() * 10);

  return (
    <div className="mt-20">
      <Ad
        link={adCopies[adSelection].link}
        onClickTrack={adCopies[adSelection].onClickTrack}
        adStart={adCopies[adSelection].adStart}
        adEnd={adCopies[adSelection].adEnd}
      />

      <div className="px-4 py-8 md:py-12 mt-20">
        <div className="mx-auto space-y-10 max-w-prose">
          <main className="prose">
            {url ? (
              <>
                <div className="flex items-center justify-between bg-[#FBF8FB] p-2 rounded-lg shadow-sm mb-4 border-zinc-100 border">
                  <h2 className="ml-4 mt-0 mb-0 text-sm font-semibold text-gray-600">
                    了解文章概要
                  </h2>
                  <ResponsiveDrawer>
                    <Suspense
                      key={"summary"}
                      fallback={
                        <Skeleton
                          className="h-32 rounded-lg animate-pulse bg-zinc-200"
                          style={{ width: "100%" }}
                        />
                      }
                    >
                      <div className="remove-all">
                        <SummaryForm urlProp={url} ipProp={ip} />
                      </div>
                    </Suspense>
                  </ResponsiveDrawer>
                </div>
                <ArrowTabs
                  sources={sources}
                  lengthDirect={
                    <ErrorBoundary
                      fallback={
                        <div>
                          无法从直接来源获取，请刷新页面重试
                        </div>
                      }
                    >
                      <Suspense key={"direct"} fallback={null}>
                        <ArticleLength url={url} source={"direct"} />
                      </Suspense>
                    </ErrorBoundary>
                  }
                  lengthWayback={
                    <ErrorBoundary
                      fallback={
                        <div>
                          无法从直接来源获取，请刷新页面重试
                        </div>
                      }
                    >
                      <Suspense key={"wayback"} fallback={null}>
                        <ArticleLength url={url} source={"wayback"} />
                      </Suspense>
                    </ErrorBoundary>
                  }
                  lengthJina={
                    <ErrorBoundary
                      fallback={
                        <div>
                          无法从直接来源获取，请刷新页面重试
                        </div>
                      }
                    >
                      <Suspense key={"jina.ai"} fallback={null}>
                        <ArticleLength url={url} source={"jina.ai"} />
                      </Suspense>
                    </ErrorBoundary>
                  }
                  lengthArchive={
                    <ErrorBoundary
                      fallback={
                        <div>
                          无法从直接来源获取，请刷新页面重试
                        </div>
                      }
                    >
                      <Suspense key={"archive"} fallback={null}>
                        <ArticleLength url={url} source={"archive"} />
                      </Suspense>
                    </ErrorBoundary>
                  }
                  innerHTMLDirect={
                    <ErrorBoundary
                      fallback={
                        <div>
                          无法从直接来源获取，请刷新页面重试
                        </div>
                      }
                    >
                      <Suspense key={"direct"} fallback={<Loading />}>
                        <ArticleContent url={url} source={"direct"} />
                      </Suspense>
                    </ErrorBoundary>
                  }
                  innerHTMLWayback={
                    <ErrorBoundary
                      fallback={
                        <div>
                          无法从直接来源获取，请刷新页面重试
                        </div>
                      }
                    >
                      <Suspense key={"wayback"} fallback={<Loading />}>
                        <ArticleContent url={url} source={"wayback"} />
                      </Suspense>
                    </ErrorBoundary>
                  }
                  innerHTMLGoogle={
                    <ErrorBoundary
                      fallback={
                        <div>
                          无法从直接来源获取，请刷新页面重试
                        </div>
                      }
                    >
                      <Suspense key={"jina.ai"} fallback={<Loading />}>
                        <ArticleContent url={url} source={"jina.ai"} />
                      </Suspense>
                    </ErrorBoundary>
                  }
                  innerHTMLArchive={
                    <ErrorBoundary
                      fallback={
                        <div>
                          无法从直接来源获取，请刷新页面重试
                        </div>
                      }
                    >
                      <Suspense key={"archive.is"} fallback={<Loading />}>
                        <ArticleContent url={url} source={"archive"} />
                      </Suspense>
                    </ErrorBoundary>
                  }
                />
              </>
            ) : (
              <Skeleton />
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
