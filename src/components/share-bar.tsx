'use client';

import { useState } from 'react';

import { cn } from '@/utils/functions';

import { FaFacebookF, FaWhatsapp, FaXTwitter } from 'react-icons/fa6';
import { LuCheck, LuLink, LuShare2 } from 'react-icons/lu';

interface ShareBarProps {
  title: string;
  url: string;
  className?: string;
}

const shareTargets = [
  {
    name: 'WhatsApp',
    icon: FaWhatsapp,
    color: 'hover:bg-green-50 hover:text-green-600 hover:ring-green-200',
    getUrl: (url: string, title: string) =>
      `https://api.whatsapp.com/send?text=${encodeURIComponent(`${title} — ${url}`)}`,
  },
  {
    name: 'Facebook',
    icon: FaFacebookF,
    color: 'hover:bg-blue-50 hover:text-blue-600 hover:ring-blue-200',
    getUrl: (url: string) =>
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
  },
  {
    name: 'X',
    icon: FaXTwitter,
    color: 'hover:bg-gray-100 hover:text-gray-900 hover:ring-gray-300',
    getUrl: (url: string, title: string) =>
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
  },
];

export default function ShareBar({ title, url, className }: ShareBarProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
      const el = document.createElement('textarea');
      el.value = url;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className={cn('flex items-center gap-1', className)}>
      <span className="mr-1.5 flex items-center gap-1.5 text-[10px] font-bold tracking-widest text-gray-300 uppercase">
        <LuShare2 className="text-xs" />
        Share
      </span>
      <div className="mr-1 h-4 w-px bg-gray-200" aria-hidden="true" />
      {shareTargets.map((target) => (
        <a
          key={target.name}
          href={target.getUrl(url, title)}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            'flex h-8 w-8 items-center justify-center rounded-lg text-sm text-gray-400 ring-1 ring-transparent transition-all duration-200',
            target.color
          )}
          aria-label={`Share on ${target.name}`}
        >
          <target.icon />
        </a>
      ))}
      <button
        onClick={handleCopy}
        className={cn(
          'flex h-8 w-8 items-center justify-center rounded-lg text-sm ring-1 ring-transparent transition-all duration-200',
          copied
            ? 'bg-emerald-50 text-emerald-600 ring-emerald-200'
            : 'text-gray-400 hover:bg-purple-50 hover:text-purple-600 hover:ring-purple-200'
        )}
        aria-label={copied ? 'Link copied!' : 'Copy link'}
      >
        {copied ? <LuCheck /> : <LuLink />}
      </button>
    </div>
  );
}
