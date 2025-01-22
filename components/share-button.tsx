"use client";

import React from 'react';
import { Button } from './ui/button'; // 使用正确的导入路径进行更新
import { Share2 as ShareIcon, Copy as CopyIcon, Mail as EmailIcon, Facebook as FacebookIcon, X as CloseIcon, MessageCircle as TelegramIcon } from 'lucide-react';
import { Popover, PopoverTrigger, PopoverContent } from './ui/popover'; // 使用正确的导入路径进行更新

interface ShareButtonProps {
    url: string;    
}

const ShareButton: React.FC<ShareButtonProps> = ({ url }) => {
  // 定义每个社交媒体平台的共享功能
  const socialShare = (platform: string) => {
    let shareUrl = '';
    switch (platform) {
      case 'email':
        shareUrl = `mailto:?subject=我想和你分享这个网址&body=${url}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
        break;
      case 'telegram':
        shareUrl = `https://telegram.me/share/url?url=${url}`;
        break;
      default:
        break;
    }
    if (shareUrl) {
      window.open(shareUrl, '_blank');
    }
  };

  // Function to copy the link to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(url);
    alert('链接已复制到剪贴板！');
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="flex items-center rounded-full">
          <ShareIcon className="h-3 w-3" />
          <span className="ml-2">分享</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="rounded-lg shadow-lg p-2 flex flex-col bg-white text-black">
        <div className="text-sm mb-2 ml-2 font-semibold">Share article cache</div>
        <Button variant="outline" className="flex items-center justify-start p-2 m-1 text-xs" onClick={copyToClipboard}>
          <CopyIcon className="h-4 w-4 mr-2" />
          复制链接
        </Button>
        <Button variant="outline" className="flex items-center justify-start p-2 m-1 text-xs" onClick={() => socialShare('email')}>
          <EmailIcon className="h-4 w-4 mr-2" />
          Email
        </Button>
        <Button variant="outline" className="flex items-center justify-start p-2 m-1 text-xs" onClick={() => socialShare('facebook')}>
          <FacebookIcon className="h-4 w-4 mr-2" />
          Facebook
        </Button>
        <Button variant="outline" className="flex items-center justify-start p-2 m-1 text-xs" onClick={() => socialShare('telegram')}>
          <TelegramIcon className="h-4 w-4 mr-2" />
          Telegram
        </Button>
      </PopoverContent>
    </Popover>
  );
};

export default ShareButton;

