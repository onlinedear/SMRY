"use server";

import { kv } from "@vercel/kv";
import { Ratelimit } from "@upstash/ratelimit";
import { fetchWithTimeout } from "@/lib/fetch-with-timeout";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function getSummary(formData: FormData) {
  try {
    const url = formData.get("url") as string;
    const ip = formData.get("ip") as string;

    if (!url) {
      return "URL 参数缺失或无效";
    }

    const dailyRatelimit = new Ratelimit({
      redis: kv,
      limiter: Ratelimit.slidingWindow(20, "1 d"),
    });

    const minuteRatelimit = new Ratelimit({
      redis: kv,
      limiter: Ratelimit.slidingWindow(6, "1 m"),
    });

    const { success: dailySuccess } = await dailyRatelimit.limit(`ratelimit_daily_${ip}`);
    const { success: minuteSuccess } = await minuteRatelimit.limit(`ratelimit_minute_${ip}`);

    if (process.env.NODE_ENV != "development") {
      if (!dailySuccess) {
        return "您已达到每日 20 篇摘要的上限。请明天再来查看更多摘要。";
      }
      if (!minuteSuccess) {
        return "已达到每分钟 6 篇摘要的限制。请放慢速度。";
      }
    }

    const cached = (await kv.get(url)) as string | undefined;
    if (cached) {
      return cached;
    }

    const response = await fetchWithTimeout(url);
    const text = await response.text();

    if (!text) {
      return "No text found";
    }

    if (text.length < 2200) {
      return "文字短小，难以概括";
    }

    const openaiResponse = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          "role": "system",
          // @ts-ignore
          "content": [
            {
              "type": "text",
              "text": "You are an intelligent summary assistant."
            }
          ]
        },
        {
          "role": "user",
          "content": [
            {
              "type": "text",
              "text": `Create a useful summary of the following article:\n\n${text.substring(0, 4000)}\n\nOnly return the short summary and nothing else, no quotes, just a useful summary in the form of a paragraph.`
            }
          ]
        }
      ],
      temperature: 1,
      max_tokens: 1000,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    });

    const summary = openaiResponse.choices[0].message.content;

    if (!summary) {
      return null;
    }

    await kv.set(url, summary);
    return summary;
  } catch (error) {
    console.error(`Error in getSummary: ${error}`);
    return null;
  }
}
