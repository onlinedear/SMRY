"use client";

import { useEffect, useRef, useState } from "react";
import {
  ExclamationCircleIcon,
  DocumentTextIcon,
  LightBulbIcon,
  ClockIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import { CornerDownLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { CardSpotlight } from "@/components/card-spotlight";
import { Unlock, Globe } from "lucide-react";
import { z } from "zod";
import Github from "@/components/github";
import { Fira_Code } from "next/font/google";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Banner } from "@/components/banner";
import { SiteFooter } from "@/components/site-footer";
import { BookmarkletComponent } from "@/components/bookmarklet";
import {PaperAirplaneIcon} from "@heroicons/react/24/solid"
import clsx from "clsx";

const fira = Fira_Code({
  subsets: ["latin"],
});

const urlSchema = z.object({
  url: z.string().url().min(1),
});

export default function Home() {
  const [url, setUrl] = useState("");
  const [urlError, setUrlError] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const router = useRouter();

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();

    try {
      urlSchema.parse({ url });
      setUrlError(false);
      router.push(`/proxy?url=${encodeURIComponent(url)}`);
    } catch (error) {
      setUrlError(true);
      console.error(error);
    }
  };

  const isValidUrl = (url: string) => {
    const { success } = urlSchema.safeParse({ url });
    return success;
  };

  const [isHovered, setIsHovered] = useState(false);

  return (
    <>
      <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-24 text-black mt-28 sm:mt-0 bg-[#FAFAFA]">
        <div className="flex flex-col items-center justify-center w-full max-w-lg mx-auto z-10 sm:mt-16">

          <h1 className="text-4xl font-semibold text-center text-black md:text-5xl">
            <Image
              src="/logo.svg"
              width={280}
              height={280}
              alt={"soso logo"}
              className="-ml-4"
            />
          </h1>

          <form onSubmit={handleSubmit} className="mt-6 w-full">
            <div
              className={`${
                urlError ? "border-red-500" : ""
              } flex rounded-lg overflow-hidden bg-white shadow-sm border border-[#E5E5E5] focus-within:ring-offset-0 focus-within:ring-4 focus-within:ring-purple-200 focus-within:border-purple-500`}
            >
              <input
                className="w-full px-4 py-3 bg-transparent rounded-l-lg focus:outline-none shadow-lg p-4"
                ref={inputRef}
                autoComplete="off"
                placeholder="https://example.com/page"
                name="url"
                value={url}
                onChange={(e) => {
                  setUrl(e.target.value);
                  if (urlError) setUrlError(false);
                }}
              />
              <button
                className="px-4 py-2 font-mono transition-all duration-300 ease-in-out rounded-r-lg cursor-pointer"
                type="submit"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              >
                {/* Icon here */}

                <div className="hidden sm:block">
                  <CornerDownLeft
                    className={clsx(
                      "w-4 h-4 transition-transform duration-300 ease-in-out",
                      {
                        "text-black transform scale-110": isHovered,
                        "text-gray-800": isValidUrl(url),
                        "text-gray-400": !isValidUrl(url),
                      }
                    )}
                  />
                </div>
                <div className="sm:hidden">
                  <PaperAirplaneIcon
                    className={clsx(
                      "w-5 h-5 transition-transform duration-300 ease-in-out",
                      {
                        "text-black transform scale-110": isHovered,
                        "text-purple-500": isValidUrl(url),
                        "text-gray-400": !isValidUrl(url),
                      }
                    )}
                  />
                </div>
              </button>
            </div>
          </form>
          <h2 className="w-full text-center text-stone-700 mt-4">
            立即获得删除任何网站的付费墙、广告和弹出窗口
          </h2>

          <h3 className="mt-24 text-center text-lg font-semibold text-gray-800">
            OR
            <span className="ml-3 text-gray-700 hover:text-gray-900 inline-block">
              <span
                className={cn(
                  "bg-white text-gray-700 font-mono py-2 px-4 rounded-md border border-zinc-200",
                  fira.className
                )}
                style={{
                  lineHeight: "1.4",
                  fontSize: "0.875rem",
                }}
              >
                https://soso.fan/
                <span
                  className="bg-[#FBF719] text-gray-700 px-2 py-1 rounded"
                  style={{ fontWeight: "500" }}
                >
                  &lt;URL&gt;
                </span>
              </span>
            </span>
          </h3>

          {urlError && (
            <p
              className="text-red-500 mt-2 flex items-center animate-fade-in"
              role="alert"
            >
              <ExclamationCircleIcon className="h-5 w-5 mr-2 text-red-500" />
              请输入有效的 URL（例如，https://example.com）。
            </p>
          )}
        </div>
        <BookmarkletComponent />

        <Banner />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <CardSpotlight
            heading="快速摘要"
            body="几秒钟内获取长文章的简洁摘要。"
            icon={<DocumentTextIcon className="h-4 w-4 text-neutral-600" />}
          />
          <CardSpotlight
            heading="绕开付费"
            body="无需烦恼即可访问付费墙后的内容。"
            icon={<Unlock className="h-4 w-4 text-neutral-600" />}
          />
          <CardSpotlight
            heading="AI 驱动"
            body="利用先进的 AI 理解内容上下文。"
            icon={<LightBulbIcon className="h-4 w-4 text-neutral-600" />}
          />
          <CardSpotlight
            heading="浏览器友好"
            body="轻松使用您喜欢的网络浏览器使用我们的工具。"
            icon={<Globe className="h-4 w-4 text-neutral-600" />}
          />
          <CardSpotlight
            heading="节省时间"
            body="阅读更少，学习更多。节省大量文章的时间。"
            icon={<ClockIcon className="h-4 w-4 text-neutral-600" />}
          />
          <CardSpotlight
            heading="用户友好界面"
            body="享受无缝直观的界面，轻松导航。"
            icon={<UserCircleIcon className="h-4 w-4 text-neutral-600" />}
          />
        </div>
      </main>

      <div className="container flex-1 bg-[#FAFAFA]">
        <SiteFooter className="border-t" />
      </div>
    </>
  );
}
