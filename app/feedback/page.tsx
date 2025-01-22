"use client";

import { useState } from "react";
import { sendEmail } from "../actions/send-email";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import TopBar from "@/components/top-bar";
import { ClientOnly } from "@/components/client-only";

export default function Page() {
  const [emailData, setEmailData] = useState({
    from: "",
    subject: "",
    message: "",
  });

  const handleChange = (e: { target: { name: any; value: any } }) => {
    setEmailData({ ...emailData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    const response = await sendEmail(emailData);
    if (response.success) {
      alert("电子邮件发送成功！");
    } else {
      alert(response.error || "发送电子邮件失败");
    }
  };

  return (
    // This is a hack
    <ClientOnly>
      <div className="bg-zinc-50">
        <TopBar />
        <div className="flex items-center justify-center min-h-screen">
          <div className="p-6 max-w-sm mx-auto bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="space-y-8">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold">I value your feedback</h2>
                <p className="text-zinc-700 dark:text-zinc-400">
嗨！我是 Mike。
我很想听听你的想法——每一点都很重要！想要查看整页而不是片段？更清楚地了解信息来源？也许是一些很酷的 AI 技巧，或者只是更可靠的体验？告诉我你的想法；这一切都会有所不同！
                </p>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">
                    电子邮件（可选。仅当您需要回复时）
                  </Label>
                  <Input
                    id="email"
                    name="from"
                    placeholder="输入您的电子邮件（可选）"
                    type="email"
                    value={emailData.from}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subject">主题</Label>
                  <Input
                    id="subject"
                    name="subject"
                    placeholder="输入主题"
                    value={emailData.subject}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">内容</Label>
                  <Textarea
                    className="min-h-[100px]"
                    id="message"
                    name="message"
                    placeholder="输入你的内容"
                    value={emailData.message}
                    onChange={handleChange}
                  />
                </div>
                <Button className="w-full" type="submit">
                  提交
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </ClientOnly>
  );
}
