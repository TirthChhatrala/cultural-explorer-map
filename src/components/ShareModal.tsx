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
      <DialogContent className="max-w-md sm:max-w-lg p-0 overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-2">
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2 text-xl font-display">
              <Share2 className="w-5 h-5 text-india-orange" />
              Share
            </DialogTitle>
            <button onClick={onClose} className="rounded-full p-1 hover:bg-muted transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>
        </DialogHeader>

        <div className="px-6 pb-6 space-y-6">
          {/* Preview card */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-muted/60 rounded-xl p-4 border border-border"
          >
            {data.image && (
              <div className="rounded-lg overflow-hidden mb-3 aspect-video">
                <img src={data.image} alt={data.title} className="w-full h-full object-cover" />
              </div>
            )}
            <h3 className="font-semibold text-sm line-clamp-1">{data.title}</h3>
            <p className="text-xs text-muted-foreground line-clamp-2 mt-1">{data.description}</p>
          </motion.div>

          {/* Social platforms */}
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
              Share on
            </p>
            <div className="grid grid-cols-5 gap-3">
              {platforms.map((p) => (
                <a
                  key={p.name}
                  href={p.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center gap-1.5 group"
                >
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white transition-transform group-hover:scale-110 ${p.color}`}
                  >
                    {p.icon}
                  </div>
                  <span className="text-[10px] text-muted-foreground group-hover:text-foreground transition-colors">
                    {p.name}
                  </span>
                </a>
              ))}
            </div>
          </div>

          {/* Copy link */}
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
              Or copy link
            </p>
            <div className="flex gap-2">
              <div className="flex-1 flex items-center gap-2 bg-muted rounded-lg px-3 py-2.5 border border-border overflow-hidden">
                <Link2 className="w-4 h-4 text-muted-foreground shrink-0" />
                <span className="text-sm text-muted-foreground truncate">{shareUrl}</span>
              </div>
              <Button
                onClick={handleCopy}
                variant="outline"
                className="shrink-0 px-4"
              >
                <AnimatePresence mode="wait">
                  {copied ? (
                    <motion.span
                      key="check"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="flex items-center gap-1.5"
                    >
                      <Check className="w-4 h-4 text-green-600" />
                      Copied
                    </motion.span>
                  ) : (
                    <motion.span
                      key="copy"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="flex items-center gap-1.5"
                    >
                      Copy
                    </motion.span>
                  )}
                </AnimatePresence>
              </Button>
            </div>
          </div>

          {/* Native share button for mobile */}
          {typeof navigator !== 'undefined' && navigator.share && (
            <Button onClick={handleNativeShare} className="w-full bg-india-orange hover:bg-india-orange/90">
              <Share2 className="w-4 h-4 mr-2" />
              Share via Device
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShareModal;
