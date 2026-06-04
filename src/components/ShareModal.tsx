import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import {
  Link2,
  Check,
  X,
  Share2,
  Facebook,
  Twitter,
  Mail,
  MessageCircle,
  Linkedin,
} from 'lucide-react';

export interface ShareData {
  title: string;
  description: string;
  url: string;
  image?: string;
}

interface ShareModalProps {
  open: boolean;
  onClose: () => void;
  data: ShareData;
}

const ShareModal: React.FC<ShareModalProps> = ({ open, onClose, data }) => {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  const shareUrl = data.url || (typeof window !== 'undefined' ? window.location.href : '');
  const shareText = `${data.title}\n${data.description}`;
  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedText = encodeURIComponent(shareText);
  const encodedTitle = encodeURIComponent(data.title);

  const platforms = [
    {
      name: 'WhatsApp',
      icon: <MessageCircle className="w-5 h-5" />,
      color: 'bg-green-500 hover:bg-green-600',
      url: `https://wa.me/?text=${encodedText}%20${encodedUrl}`,
    },
    {
      name: 'Twitter / X',
      icon: <Twitter className="w-5 h-5" />,
      color: 'bg-gray-900 hover:bg-gray-800 dark:bg-gray-100 dark:hover:bg-white dark:text-gray-900',
      url: `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`,
    },
    {
      name: 'Facebook',
      icon: <Facebook className="w-5 h-5" />,
      color: 'bg-blue-600 hover:bg-blue-700',
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedText}`,
    },
    {
      name: 'LinkedIn',
      icon: <Linkedin className="w-5 h-5" />,
      color: 'bg-blue-700 hover:bg-blue-800',
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    },
    {
      name: 'Email',
      icon: <Mail className="w-5 h-5" />,
      color: 'bg-amber-500 hover:bg-amber-600',
      url: `mailto:?subject=${encodedTitle}&body=${encodedText}%0A%0A${encodedUrl}`,
    },
  ];

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast({ title: 'Link copied!', description: 'Share it with your friends.' });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast({ title: 'Could not copy', description: 'Please copy the link manually.', variant: 'destructive' });
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: data.title,
          text: data.description,
          url: shareUrl,
        });
      } catch {
        // User cancelled — no toast needed
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent
        className="max-w-md p-0 overflow-hidden border-0 shadow-2xl rounded-2xl"
        data-no-translate
      >
        {/* Gradient header */}
        <div className="relative bg-gradient-to-br from-india-orange via-orange-500 to-amber-500 px-6 pt-6 pb-16 text-white">
          <DialogHeader className="space-y-1">
            <DialogTitle className="flex items-center gap-2 text-lg font-display text-white">
              <Share2 className="w-5 h-5" />
              Share with friends
            </DialogTitle>
            <p className="text-xs text-white/80">Spread the word and earn karma points</p>
          </DialogHeader>
        </div>

        <div className="px-6 -mt-12 pb-6 space-y-5">
          {/* Floating preview card */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-background rounded-xl p-4 border border-border shadow-lg"
          >
            {data.image && (
              <div className="rounded-lg overflow-hidden mb-3 aspect-video bg-muted">
                <img src={data.image} alt={data.title} className="w-full h-full object-cover" />
              </div>
            )}
            <h3 className="font-semibold text-sm line-clamp-2">{data.title}</h3>
            {data.description && (
              <p className="text-xs text-muted-foreground line-clamp-2 mt-1 whitespace-pre-line">
                {data.description}
              </p>
            )}
          </motion.div>

          {/* Social platforms — horizontal scroll on small screens */}
          <div>
            <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              Share on
            </p>
            <div className="flex justify-between gap-2">
              {platforms.map((p) => (
                <a
                  key={p.name}
                  href={p.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center gap-1.5 group flex-1 min-w-0"
                  title={p.name}
                >
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center text-white transition-all group-hover:scale-110 group-hover:shadow-lg ${p.color}`}
                  >
                    {p.icon}
                  </div>
                  <span className="text-[10px] text-muted-foreground group-hover:text-foreground transition-colors truncate w-full text-center">
                    {p.name.split(' ')[0]}
                  </span>
                </a>
              ))}
            </div>
          </div>

          {/* Copy link */}
          <div>
            <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              Or copy link
            </p>
            <div className="flex items-center gap-2 bg-muted/60 rounded-xl pl-3 pr-1 py-1 border border-border">
              <Link2 className="w-4 h-4 text-muted-foreground shrink-0" />
              <span className="text-xs text-muted-foreground truncate flex-1 min-w-0">{shareUrl}</span>
              <Button
                onClick={handleCopy}
                size="sm"
                className={`shrink-0 h-8 px-3 text-xs transition-colors ${
                  copied ? 'bg-green-600 hover:bg-green-700' : 'bg-india-orange hover:bg-india-orange/90'
                } text-white`}
              >
                <AnimatePresence mode="wait" initial={false}>
                  {copied ? (
                    <motion.span
                      key="check"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="flex items-center gap-1"
                    >
                      <Check className="w-3.5 h-3.5" /> Copied
                    </motion.span>
                  ) : (
                    <motion.span
                      key="copy"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                    >
                      Copy
                    </motion.span>
                  )}
                </AnimatePresence>
              </Button>
            </div>
          </div>

          {/* Native share button for mobile */}
          {typeof navigator !== 'undefined' && (navigator as any).share && (
            <Button onClick={handleNativeShare} variant="outline" className="w-full">
              <Share2 className="w-4 h-4 mr-2" />
              More sharing options
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShareModal;
