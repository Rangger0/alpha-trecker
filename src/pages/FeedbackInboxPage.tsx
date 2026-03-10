import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  BellRing,
  Copy,
  Inbox,
  Link2,
  LockKeyhole,
  Mail,
  RefreshCw,
  Search,
  ShieldCheck,
  Sparkles,
  UserRound,
} from "lucide-react";
import { toast } from "sonner";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { isFeedbackInboxOwner } from "@/lib/feedback-access";
import { cn } from "@/lib/utils";
import {
  getFeedbackInbox,
  type FeedbackInboxItem,
  type FeedbackInboxStatus,
} from "@/services/feedback-inbox";

type StatusFilter = "all" | FeedbackInboxStatus;

const STATUS_COPY: Record<
  FeedbackInboxStatus,
  { label: string; chipClassName: string; dotClassName: string }
> = {
  pending: {
    label: "Pending",
    chipClassName:
      "border-[color:color-mix(in_srgb,var(--alpha-warning)_24%,transparent)] bg-[color:color-mix(in_srgb,var(--alpha-warning)_12%,transparent)] text-gold",
    dotClassName: "bg-gold",
  },
  notified: {
    label: "Notified",
    chipClassName:
      "border-[color:color-mix(in_srgb,var(--alpha-signal)_28%,transparent)] bg-[color:color-mix(in_srgb,var(--alpha-signal)_12%,transparent)] text-[color:var(--alpha-signal)]",
    dotClassName: "bg-[color:var(--alpha-signal)]",
  },
  notification_failed: {
    label: "Failed",
    chipClassName:
      "border-[color:color-mix(in_srgb,var(--alpha-danger)_24%,transparent)] bg-[color:color-mix(in_srgb,var(--alpha-danger)_12%,transparent)] text-[color:var(--alpha-danger)]",
    dotClassName: "bg-[color:var(--alpha-danger)]",
  },
};

function formatTimestamp(value: string) {
  return new Date(value).toLocaleString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatRelative(value: string) {
  const createdAt = new Date(value).getTime();
  const diff = Date.now() - createdAt;
  const minute = 60_000;
  const hour = minute * 60;
  const day = hour * 24;

  if (diff < hour) {
    return `${Math.max(1, Math.round(diff / minute))}m ago`;
  }

  if (diff < day) {
    return `${Math.round(diff / hour)}h ago`;
  }

  return `${Math.round(diff / day)}d ago`;
}

function getSearchText(item: FeedbackInboxItem) {
  return [
    item.route,
    item.pageUrl,
    item.message,
    item.contact,
    item.userEmail,
    item.id,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

async function copyText(value: string, label: string) {
  if (!navigator.clipboard?.writeText) {
    toast.error(`Clipboard browser tidak tersedia untuk ${label}.`);
    return;
  }

  try {
    await navigator.clipboard.writeText(value);
    toast.success(`${label} berhasil dicopy.`);
  } catch {
    toast.error(`Gagal copy ${label}.`);
  }
}

export function FeedbackInboxPage() {
  const { session } = useAuth();
  const [items, setItems] = useState<FeedbackInboxItem[]>([]);
  const [ownerEmail, setOwnerEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [accessDenied, setAccessDenied] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const stats = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return {
      total: items.length,
      notified: items.filter((item) => item.status === "notified").length,
      failed: items.filter((item) => item.status === "notification_failed").length,
      pending: items.filter((item) => item.status === "pending").length,
      today: items.filter((item) => new Date(item.createdAt).getTime() >= today.getTime()).length,
      uniqueReporters: new Set(items.map((item) => item.userEmail || item.contact || item.id)).size,
    };
  }, [items]);

  const loadInbox = async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await getFeedbackInbox();
      setItems(result.items);
      setOwnerEmail(result.ownerEmail);
      setSelectedId((current) => current ?? result.items[0]?.id ?? null);
      setAccessDenied(false);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Feedback inbox gagal dimuat.";
      const code = error instanceof Error && "code" in error ? String((error as { code?: string }).code) : "";

      setError(message);
      setAccessDenied(code === "FORBIDDEN");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!session?.user) {
      return;
    }

    if (!isFeedbackInboxOwner(session.user.email)) {
      setAccessDenied(true);
      setLoading(false);
      setError("Feedback inbox is restricted to the owner account.");
      return;
    }

    void loadInbox();
  }, [session?.user?.id]);

  const filteredItems = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return items.filter((item) => {
      const matchesStatus = statusFilter === "all" || item.status === statusFilter;
      const matchesQuery = !query || getSearchText(item).includes(query);
      return matchesStatus && matchesQuery;
    });
  }, [items, searchQuery, statusFilter]);

  const selectedItem = useMemo(() => {
    return (
      filteredItems.find((item) => item.id === selectedId) ||
      filteredItems[0] ||
      null
    );
  }, [filteredItems, selectedId]);

  useEffect(() => {
    if (!filteredItems.length) {
      return;
    }

    if (!filteredItems.some((item) => item.id === selectedId)) {
      setSelectedId(filteredItems[0].id);
    }
  }, [filteredItems, selectedId]);

  const summaryCards = [
    {
      key: "total",
      label: "Total inbox",
      value: String(stats.total).padStart(2, "0"),
      icon: Inbox,
    },
    {
      key: "notified",
      label: "Telegram sent",
      value: String(stats.notified).padStart(2, "0"),
      icon: BellRing,
    },
    {
      key: "today",
      label: "Today",
      value: String(stats.today).padStart(2, "0"),
      icon: Sparkles,
    },
    {
      key: "owners",
      label: "Unique senders",
      value: String(stats.uniqueReporters).padStart(2, "0"),
      icon: ShieldCheck,
    },
  ];

  return (
    <DashboardLayout>
      <div className="macos-root macos-page-shell">
        <div className="macos-page-header">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="space-y-3">
              <div className="macos-page-kicker">
                <LockKeyhole className="h-3.5 w-3.5" />
                Private Operator Console
              </div>
              <div>
                <h1 className="macos-page-title">Feedback Inbox</h1>
                <p className="macos-page-subtitle">
                  Inbox premium untuk review bug, ide fitur, dan sinyal aneh dari user. Jalur baca
                  dibatasi khusus owner lewat edge function.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center gap-2 rounded-full border border-[color:var(--alpha-border)] bg-[color:var(--alpha-surface-soft)] px-3 py-2 text-[11px] font-mono uppercase tracking-[0.22em] alpha-text-muted">
                <ShieldCheck className="h-3.5 w-3.5 text-[color:var(--alpha-signal)]" />
                {ownerEmail || session?.user?.email || "Owner check"}
              </div>
              <Button
                type="button"
                variant="outline"
                className="h-10 rounded-[1rem] border-[color:var(--alpha-border)] bg-[color:var(--alpha-surface-soft)] alpha-text"
                onClick={() => {
                  void loadInbox();
                }}
                disabled={loading}
              >
                <RefreshCw className={cn("h-4 w-4", loading ? "animate-spin" : "")} />
                Refresh
              </Button>
            </div>
          </div>
        </div>

        {accessDenied ? (
          <div className="macos-premium-card p-6 sm:p-8">
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-[1.4rem] border border-[color:color-mix(in_srgb,var(--alpha-danger)_22%,transparent)] bg-[color:color-mix(in_srgb,var(--alpha-danger)_10%,transparent)]">
                <LockKeyhole className="h-6 w-6 text-[color:var(--alpha-danger)]" />
              </div>
              <div className="space-y-3">
                <p className="text-[11px] font-mono uppercase tracking-[0.24em] alpha-text-muted">
                  Owner Only
                </p>
                <h2 className="text-2xl font-semibold alpha-text">Akses inbox ditolak</h2>
                <p className="max-w-2xl text-sm leading-7 alpha-text-muted">
                  Data feedback cuma dibuka untuk owner yang sudah di-allow di backend function.
                  Login kamu saat ini: <span className="font-semibold alpha-text">{session?.user?.email || "-"}</span>.
                </p>
                <p className="text-xs leading-6 alpha-text-muted">
                  Kalau email login owner kamu berbeda, set secret
                  <span className="font-semibold alpha-text"> FEEDBACK_INBOX_OWNER_EMAILS</span> di Supabase
                  atau update daftar owner di frontend untuk menampilkan menu ini.
                </p>
                {error ? (
                  <div className="rounded-[1rem] border border-[color:color-mix(in_srgb,var(--alpha-danger)_22%,transparent)] bg-[color:color-mix(in_srgb,var(--alpha-danger)_8%,transparent)] px-4 py-3 text-xs leading-6 alpha-text-muted">
                    {error}
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        ) : null}

        {!accessDenied ? (
          <>
            <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
              {summaryCards.map((card, index) => {
                const Icon = card.icon;

                return (
                  <div
                    key={card.key}
                    className="macos-premium-card p-5"
                    style={{ animationDelay: `${index * 60}ms` }}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-[11px] font-mono uppercase tracking-[0.22em] alpha-text-muted">
                          {card.label}
                        </p>
                        <p className="mt-3 text-[2rem] font-semibold leading-none alpha-text">
                          {card.value}
                        </p>
                      </div>
                      <div className="flex h-11 w-11 items-center justify-center rounded-[1rem] border border-[color:var(--alpha-border)] bg-[color:var(--alpha-surface-soft)]">
                        <Icon className="h-5 w-5 text-[color:var(--alpha-highlight)]" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mb-5 grid gap-3 lg:grid-cols-[1fr_180px]">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 alpha-text-muted" />
                <Input
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Cari route, email, kontak, isi pesan, atau id..."
                  className="h-11 rounded-[1rem] border-[color:var(--alpha-border)] bg-[color:var(--alpha-surface-soft)] pl-10"
                />
              </div>

              <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as StatusFilter)}>
                <SelectTrigger className="h-11 w-full rounded-[1rem] border-[color:var(--alpha-border)] bg-[color:var(--alpha-surface-soft)] px-3 alpha-text">
                  <SelectValue placeholder="Filter status" />
                </SelectTrigger>
                <SelectContent className="rounded-[1rem] border-[color:var(--alpha-border)] bg-[color:var(--alpha-panel)]">
                  <SelectItem value="all">Semua status</SelectItem>
                  <SelectItem value="notified">Notified</SelectItem>
                  <SelectItem value="notification_failed">Failed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid items-stretch gap-5 xl:grid-cols-2">
              <section className="macos-premium-card flex min-h-[560px] flex-col overflow-hidden">
                <div className="flex min-h-[88px] items-center border-b border-[color:var(--alpha-border)] px-5 py-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-[11px] font-mono uppercase tracking-[0.22em] alpha-text-muted">
                        Feed
                      </p>
                      <p className="mt-1 text-sm alpha-text-muted">
                        {loading ? "Loading inbox..." : `${filteredItems.length} item cocok dengan filter.`}
                      </p>
                    </div>
                    <div className="inline-flex items-center gap-2 rounded-full border border-[color:var(--alpha-border)] bg-[color:var(--alpha-surface-soft)] px-3 py-1 text-[10px] uppercase tracking-[0.22em] alpha-text-muted">
                      <Mail className="h-3.5 w-3.5 text-[color:var(--alpha-highlight)]" />
                      owner only
                    </div>
                  </div>
                </div>

                <div className="flex min-h-0 flex-1 flex-col p-3">
                  {error && !loading ? (
                    <div className="rounded-[1.4rem] border border-[color:color-mix(in_srgb,var(--alpha-danger)_24%,transparent)] bg-[color:color-mix(in_srgb,var(--alpha-danger)_8%,transparent)] p-4 text-sm alpha-text-muted">
                      {error}
                    </div>
                  ) : null}

                  {!loading && !filteredItems.length ? (
                    <div className="mt-3 rounded-[1.4rem] border border-[color:var(--alpha-border)] bg-[color:var(--alpha-surface-soft)] px-4 py-6 text-sm alpha-text-muted">
                      Belum ada feedback yang cocok dengan filter sekarang.
                    </div>
                  ) : null}

                  <div className="mt-3 flex-1 space-y-3 overflow-y-auto pr-1">
                    {filteredItems.map((item) => {
                      const statusMeta = STATUS_COPY[item.status];
                      const isActive = selectedItem?.id === item.id;

                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setSelectedId(item.id)}
                          className={cn(
                            "w-full rounded-[1.45rem] border px-4 py-4 text-left transition-[transform,border-color,background-color,box-shadow] duration-200 hover:-translate-y-0.5",
                            isActive
                              ? "border-[color:var(--alpha-highlight-border)] bg-[color:color-mix(in_srgb,var(--alpha-highlight)_10%,var(--alpha-surface-soft))] shadow-[0_18px_36px_rgba(0,0,0,0.08)]"
                              : "border-[color:var(--alpha-border)] bg-[color:var(--alpha-surface-soft)]",
                          )}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="space-y-2">
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="text-sm font-semibold alpha-text">
                                  {item.userEmail || item.contact || "Guest / anonymous"}
                                </span>
                                <span
                                  className={cn(
                                    "inline-flex items-center gap-2 rounded-full border px-2.5 py-1 text-[10px] font-mono uppercase tracking-[0.22em]",
                                    statusMeta.chipClassName,
                                  )}
                                >
                                  <span className={cn("h-1.5 w-1.5 rounded-full", statusMeta.dotClassName)} />
                                  {statusMeta.label}
                                </span>
                              </div>
                              <p className="font-mono text-[11px] uppercase tracking-[0.18em] alpha-text-muted">
                                {item.route}
                              </p>
                            </div>
                            <p className="text-[11px] font-mono alpha-text-muted">
                              {formatRelative(item.createdAt)}
                            </p>
                          </div>

                          <p className="mt-3 line-clamp-3 text-sm leading-7 alpha-text-muted">
                            {item.message}
                          </p>

                          <div className="mt-4 flex flex-wrap items-center gap-3 text-[11px] font-mono alpha-text-muted">
                            <span>ID {item.id.slice(0, 8)}</span>
                            <span>Attempt {item.notificationAttempts}</span>
                            {item.contact ? <span>{item.contact}</span> : null}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </section>

              <section className="macos-premium-card flex min-h-[560px] flex-col overflow-hidden">
                <div className="flex min-h-[88px] items-center border-b border-[color:var(--alpha-border)] px-5 py-4">
                  <div>
                    <p className="text-[11px] font-mono uppercase tracking-[0.22em] alpha-text-muted">
                      Detail
                    </p>
                    <p className="mt-1 text-sm alpha-text-muted">
                      Message preview khusus operator. Cocok buat review cepat tanpa buka database.
                    </p>
                  </div>
                </div>

                <div className="min-h-0 flex-1 overflow-y-auto p-5">
                  {selectedItem ? (
                    <div className="space-y-5">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <p className="text-xs font-mono uppercase tracking-[0.22em] alpha-text-muted">
                            Reporter
                          </p>
                          <h2 className="mt-2 text-2xl font-semibold alpha-text">
                            {selectedItem.userEmail || selectedItem.contact || "Guest / anonymous"}
                          </h2>
                        </div>
                        <span
                          className={cn(
                            "inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[10px] font-mono uppercase tracking-[0.22em]",
                            STATUS_COPY[selectedItem.status].chipClassName,
                          )}
                        >
                          <span className={cn("h-1.5 w-1.5 rounded-full", STATUS_COPY[selectedItem.status].dotClassName)} />
                          {STATUS_COPY[selectedItem.status].label}
                        </span>
                      </div>

                      <div className="grid gap-3 sm:grid-cols-2">
                        <div className="rounded-[1.2rem] border border-[color:var(--alpha-border)] bg-[color:var(--alpha-surface-soft)] p-3.5">
                          <p className="text-[10px] font-mono uppercase tracking-[0.22em] alpha-text-muted">
                            Created
                          </p>
                          <p className="mt-2 text-sm alpha-text">{formatTimestamp(selectedItem.createdAt)}</p>
                        </div>
                        <div className="rounded-[1.2rem] border border-[color:var(--alpha-border)] bg-[color:var(--alpha-surface-soft)] p-3.5">
                          <p className="text-[10px] font-mono uppercase tracking-[0.22em] alpha-text-muted">
                            Notified
                          </p>
                          <p className="mt-2 text-sm alpha-text">
                            {selectedItem.notifiedAt ? formatTimestamp(selectedItem.notifiedAt) : "Belum ada"}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="rounded-[1.2rem] border border-[color:var(--alpha-border)] bg-[color:var(--alpha-surface-soft)] p-4">
                          <div className="flex items-center justify-between gap-3">
                            <p className="text-[10px] font-mono uppercase tracking-[0.22em] alpha-text-muted">
                              Route
                            </p>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon-sm"
                              className="rounded-[0.9rem]"
                              onClick={() => {
                                void copyText(selectedItem.route, "Route");
                              }}
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                          </div>
                          <p className="mt-3 break-all text-sm alpha-text">{selectedItem.route}</p>
                        </div>

                        <div className="rounded-[1.2rem] border border-[color:var(--alpha-border)] bg-[color:var(--alpha-surface-soft)] p-4">
                          <div className="flex items-center justify-between gap-3">
                            <p className="text-[10px] font-mono uppercase tracking-[0.22em] alpha-text-muted">
                              URL
                            </p>
                            <div className="flex items-center gap-2">
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon-sm"
                                className="rounded-[0.9rem]"
                                onClick={() => {
                                  void copyText(selectedItem.pageUrl, "URL");
                                }}
                              >
                                <Copy className="h-4 w-4" />
                              </Button>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon-sm"
                                className="rounded-[0.9rem]"
                                asChild
                              >
                                <a href={selectedItem.pageUrl} target="_blank" rel="noreferrer">
                                  <Link2 className="h-4 w-4" />
                                </a>
                              </Button>
                            </div>
                          </div>
                          <p className="mt-3 break-all text-sm alpha-text">{selectedItem.pageUrl}</p>
                        </div>

                        <div className="rounded-[1.2rem] border border-[color:var(--alpha-border)] bg-[color:var(--alpha-surface-soft)] p-4">
                          <p className="text-[10px] font-mono uppercase tracking-[0.22em] alpha-text-muted">
                            Message
                          </p>
                          <p className="mt-3 whitespace-pre-wrap text-sm leading-7 alpha-text">
                            {selectedItem.message}
                          </p>
                        </div>
                      </div>

                      <div className="grid gap-3 sm:grid-cols-2">
                        <div className="rounded-[1.2rem] border border-[color:var(--alpha-border)] bg-[color:var(--alpha-surface-soft)] p-4">
                          <p className="text-[10px] font-mono uppercase tracking-[0.22em] alpha-text-muted">
                            Contact
                          </p>
                          <div className="mt-3 flex items-center gap-2 text-sm alpha-text">
                            <UserRound className="h-4 w-4 alpha-text-muted" />
                            {selectedItem.contact || "-"}
                          </div>
                        </div>

                        <div className="rounded-[1.2rem] border border-[color:var(--alpha-border)] bg-[color:var(--alpha-surface-soft)] p-4">
                          <p className="text-[10px] font-mono uppercase tracking-[0.22em] alpha-text-muted">
                            Reporter email
                          </p>
                          <div className="mt-3 flex items-center gap-2 text-sm alpha-text">
                            <Mail className="h-4 w-4 alpha-text-muted" />
                            {selectedItem.userEmail || "-"}
                          </div>
                        </div>
                      </div>

                      {selectedItem.notificationError ? (
                        <div className="rounded-[1.2rem] border border-[color:color-mix(in_srgb,var(--alpha-danger)_26%,transparent)] bg-[color:color-mix(in_srgb,var(--alpha-danger)_9%,transparent)] p-4">
                          <div className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-[0.22em] text-[color:var(--alpha-danger)]">
                            <AlertTriangle className="h-4 w-4" />
                            Notification error
                          </div>
                          <p className="mt-3 break-all text-sm leading-7 alpha-text">
                            {selectedItem.notificationError}
                          </p>
                        </div>
                      ) : null}
                    </div>
                  ) : (
                    <div className="flex h-full min-h-[420px] items-center">
                      <div className="w-full rounded-[1.4rem] border border-[color:var(--alpha-border)] bg-[color:var(--alpha-surface-soft)] p-5 text-sm alpha-text-muted">
                        Pilih satu feedback di sisi kiri untuk lihat detail lengkapnya.
                      </div>
                    </div>
                  )}
                </div>
              </section>
            </div>
          </>
        ) : null}

        {!accessDenied && !loading && !isFeedbackInboxOwner(session?.user?.email) ? (
          <p className="mt-4 text-xs alpha-text-muted">
            Menu ini tetap dijaga oleh backend. Kalau mau sidebar khusus owner juga konsisten, set
            <span className="font-semibold alpha-text"> VITE_FEEDBACK_INBOX_OWNER_EMAILS</span> dengan email login owner kamu.
          </p>
        ) : null}
      </div>
    </DashboardLayout>
  );
}
