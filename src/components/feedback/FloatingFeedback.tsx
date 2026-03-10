import { useState, type FormEvent } from "react";
import { useLocation } from "react-router-dom";
import { Bot, Send, Sparkles } from "lucide-react";
import { toast } from "sonner";

import { useAuth } from "@/contexts/AuthContext";
import { submitFeedback } from "@/services/feedback";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const LOCAL_FEEDBACK_QUEUE_KEY = "alpha_tracker_feedback_queue";
const MIN_FEEDBACK_MESSAGE_LENGTH = 8;

type LocalFeedbackDraft = {
  message: string;
  contact: string;
  route: string;
  pageUrl: string;
  createdAt: string;
  userEmail: string;
  userId: string | null;
};

function storeFeedbackDraft(draft: LocalFeedbackDraft) {
  const current = localStorage.getItem(LOCAL_FEEDBACK_QUEUE_KEY);
  let queue: LocalFeedbackDraft[] = [];

  if (current) {
    try {
      queue = JSON.parse(current) as LocalFeedbackDraft[];
    } catch {
      queue = [];
    }
  }

  queue.unshift(draft);
  localStorage.setItem(LOCAL_FEEDBACK_QUEUE_KEY, JSON.stringify(queue.slice(0, 25)));
}

export function FloatingFeedback() {
  const location = useLocation();
  const { session } = useAuth();
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [contact, setContact] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentRoute = `${location.pathname}${location.search}${location.hash}`;
  const currentPageUrl = typeof window !== "undefined" ? window.location.href : currentRoute;
  const userId = session?.user?.id ?? null;
  const userEmail = session?.user?.email ?? "";
  const trimmedMessageLength = message.trim().length;

  const resetForm = () => {
    setOpen(false);
    setMessage("");
    setContact("");
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedMessage = message.trim();
    const trimmedContact = contact.trim();

    if (!session?.user) {
      toast.error("Harap login dulu untuk kirim feedback.");
      return;
    }

    if (trimmedMessage.length < MIN_FEEDBACK_MESSAGE_LENGTH) {
      toast.error(
        `Feedback minimal ${MIN_FEEDBACK_MESSAGE_LENGTH} karakter. Sekarang baru ${trimmedMessage.length}.`,
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await submitFeedback({
        route: currentRoute,
        pageUrl: currentPageUrl,
        message: trimmedMessage,
        contact: trimmedContact,
        userId,
        userEmail,
      });

      if (result.notificationStatus === "sent") {
        toast.success("Feedback masuk ke inbox tim. Notifikasi Telegram juga terkirim.");
      } else if (result.notificationStatus === "failed") {
        toast.success("Feedback masuk ke inbox tim, tapi notifikasi Telegram belum terkirim.");
      } else {
        toast.success("Feedback masuk ke inbox tim.");
      }

      resetForm();
    } catch (error) {
      storeFeedbackDraft({
        message: trimmedMessage,
        contact: trimmedContact,
        route: currentRoute,
        pageUrl: currentPageUrl,
        createdAt: new Date().toISOString(),
        userEmail,
        userId,
      });

      const errorMessage =
        error instanceof Error ? error.message : "Feedback gagal dikirim ke server.";

      toast.error(`${errorMessage} Draft disimpan lokal di browser ini.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="pointer-events-none fixed bottom-4 right-4 z-[120] flex items-end justify-end sm:bottom-6 sm:right-6">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="pointer-events-auto group relative flex items-center gap-3 rounded-[1.35rem] border border-[color:var(--alpha-border-strong)] bg-[color:color-mix(in_srgb,var(--alpha-panel)_88%,transparent)] px-3 py-3 text-left shadow-[0_14px_34px_rgba(0,0,0,0.22)] backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-[color:var(--alpha-highlight-border)]"
          aria-label="Open feedback assistant"
        >
          <span className="absolute inset-0 rounded-[inherit] bg-[radial-gradient(circle_at_top_right,color-mix(in_srgb,var(--alpha-highlight)_18%,transparent),transparent_56%)] opacity-80" />
          <span className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-[1rem] border border-[color:var(--alpha-border)] bg-[color:var(--alpha-surface-soft)]">
            <span className="absolute inset-1 rounded-[0.8rem] bg-[color:color-mix(in_srgb,var(--alpha-highlight)_14%,transparent)] blur-sm transition-opacity duration-200 group-hover:opacity-100" />
            <Bot className="relative h-5 w-5 text-[color:var(--alpha-highlight)]" />
            <span className="absolute right-1.5 top-1.5 flex h-2.5 w-2.5">
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full border border-[color:var(--alpha-highlight-border)] bg-[color:var(--alpha-highlight)]" />
            </span>
          </span>

          <div className="relative hidden min-w-[150px] pr-1 sm:block">
            <p className="text-xs font-mono uppercase tracking-[0.22em] alpha-text-muted">Robot live</p>
            <p className="mt-1 text-sm font-semibold alpha-text">Feedback</p>
            <p className="text-xs alpha-text-muted">Masuk ke inbox tim</p>
          </div>
        </button>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          className="w-[min(480px,calc(100vw-24px))] max-w-[480px] max-h-[85vh] overflow-auto border-[color:var(--alpha-border)] bg-[color:var(--alpha-panel)] p-0 text-[color:var(--alpha-text)] shadow-[0_32px_80px_rgba(0,0,0,0.32)]"
          showCloseButton={false}
        >
          <div className="rounded-[inherit] border border-[color:var(--alpha-border)] bg-[linear-gradient(135deg,color-mix(in_srgb,var(--alpha-highlight)_10%,transparent),transparent_42%)] p-5">
            <DialogHeader className="text-left">
              <div className="inline-flex w-fit items-center gap-2 rounded-full border border-[color:var(--alpha-border)] bg-[color:var(--alpha-surface-soft)] px-3 py-1 text-[10px] uppercase tracking-[0.22em] alpha-text-muted">
                <Sparkles className="h-3.5 w-3.5 text-[color:var(--alpha-highlight)]" />
                Robot live
              </div>
              <DialogTitle className="mt-3 text-xl font-semibold alpha-text">Kirim feedback</DialogTitle>
              <DialogDescription className="text-sm leading-6 alpha-text-muted">
                Feedback akan masuk ke database dulu. Kalau notifikasi Telegram aktif, operator juga langsung dapat alert.
              </DialogDescription>
            </DialogHeader>

            <form className="mt-5 space-y-4" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <label className="text-[11px] font-mono uppercase tracking-[0.22em] alpha-text-muted">
                  Halaman aktif
                </label>
                <div className="rounded-[1rem] border border-[color:var(--alpha-border)] bg-[color:var(--alpha-surface-soft)] px-3 py-2.5 text-sm alpha-text">
                  {currentRoute}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-mono uppercase tracking-[0.22em] alpha-text-muted">
                  User
                </label>
                <div className="rounded-[1rem] border border-[color:var(--alpha-border)] bg-[color:var(--alpha-surface-soft)] px-3 py-2.5 text-sm alpha-text">
                  {userEmail || "Guest / belum login"}
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="feedback-contact" className="text-[11px] font-mono uppercase tracking-[0.22em] alpha-text-muted">
                  Kontak opsional
                </label>
                <Input
                  id="feedback-contact"
                  value={contact}
                  onChange={(event) => setContact(event.target.value)}
                  placeholder="Telegram, Discord, email, atau username"
                  className="h-11 rounded-[1rem] border-[color:var(--alpha-border)] bg-[color:var(--alpha-surface-soft)]"
                  disabled={isSubmitting}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="feedback-message" className="text-[11px] font-mono uppercase tracking-[0.22em] alpha-text-muted">
                  Pesan
                </label>
                <Textarea
                  id="feedback-message"
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                  placeholder="Tulis bug, ide fitur, atau hal yang terasa aneh di halaman ini..."
                  className="min-h-[140px] rounded-[1rem] border-[color:var(--alpha-border)] bg-[color:var(--alpha-surface-soft)]"
                  disabled={isSubmitting}
                />
                <p className="text-[11px] leading-5 alpha-text-muted">
                  Minimal {MIN_FEEDBACK_MESSAGE_LENGTH} karakter.
                  {trimmedMessageLength > 0 ? ` Sekarang: ${trimmedMessageLength}.` : ""}
                </p>
              </div>

              <div className="rounded-[1rem] border border-[color:var(--alpha-border)] bg-[color:var(--alpha-surface-soft)] px-3 py-3 text-xs leading-5 alpha-text-muted">
                Setelah kirim, feedback akan disimpan ke <span className="font-semibold alpha-text">feedback_messages</span>.
                Kalau edge function Telegram aktif, tim juga dapat notifikasi tanpa harus buka form ini satu-satu.
              </div>

              <div className="flex justify-end">
                <Button
                  type="submit"
                  className="h-11 rounded-[1rem] bg-[color:var(--alpha-highlight)] px-5 text-[color:var(--alpha-accent-contrast)] hover:opacity-95"
                  disabled={isSubmitting}
                >
                  <Send className="h-4 w-4" />
                  {isSubmitting ? "Mengirim..." : "Kirim feedback"}
                </Button>
              </div>
            </form>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
