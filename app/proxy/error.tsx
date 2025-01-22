"use client";

import TopBar from "@/components/top-bar";
import UnderlineLink from "@/components/underline-link";
import { useRouter } from "next/navigation";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter()

  // useEffect(() => {
  //   // Log the error to an error reporting service
  //   track('Proxy error', { location: pathname });
  // }, [error, pathname])

  return (
    <div className="bg-zinc-50">
      <TopBar />
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex h-screen flex-col items-center justify-center bg-zinc-50 dark:bg-zinc-800">
          <div className="mx-auto max-w-md rounded-lg border bg-white p-8 text-center dark:bg-zinc-900">
            <h2
              id="error-title"
              className="mb-4 text-xl font-semibold tracking-tight text-zinc-800 dark:text-zinc-100"
            >
              哎呀！出事了
            </h2>
            <p className="text-sm leading-7 text-zinc-600 dark:text-zinc-300">
              我们已经记录了该问题并正在处理。点击{" "}
              <button
                className={`cursor-pointer underline decoration-from-font underline-offset-2 hover:opacity-80`}
                onClick={() => {
                  router.refresh();
                  reset();
                }}
              >
                这里
              </button>{" "}
              尝试重试或者{" "}
              <UnderlineLink href="/" text="read something else" />.
            </p>
            <p className="text-sm leading-7 text-zinc-600 dark:text-zinc-300 mt-3">
              一些提供商仍然无法与 SoSo.Fan 合作。我们每天都在改进，但如果您尝试阅读的网站或许{" "}
              <UnderlineLink
                href="https://www.zuora.com/guides/what-is-a-hard-paywall/"
                text="hard paywall"
              />{" "}
              我们无能为力。
            </p>
            <p className="mt-6 text-sm leading-7 text-zinc-800 dark:text-zinc-100">
              反馈意见?{" "}
              <UnderlineLink href="/feedback" text="send us feedback" />.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
