import { useEffect, useState } from "react";
import { CalendarDays, Coins, Loader2, ReceiptText, Sparkles, TrendingUp, WalletCards, X } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Airdrop, AirdropReward, AirdropRewardInput, RewardClaimStatus } from "@/types";

interface AirdropRewardModalProps {
  isOpen: boolean;
  onClose: () => void;
  airdrop: Airdrop | null;
  reward?: AirdropReward | null;
  onSubmit: (data: AirdropRewardInput) => Promise<void> | void;
  onDelete?: (rewardId: string) => Promise<void> | void;
}

const CLAIM_STATUSES: RewardClaimStatus[] = ["Pending TGE", "Claimed", "Missed"];

const getTodayDateInputValue = () => new Date().toISOString().slice(0, 10);

const normalizeDateInputValue = (value?: string | null) => {
  if (!value) return "";
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "";
  return parsed.toISOString().slice(0, 10);
};

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: value >= 1000 ? 0 : 2,
  }).format(value);

const formatPercent = (value: number | null) => {
  if (value == null || !Number.isFinite(value)) return "--";
  return `${value >= 0 ? "+" : ""}${value.toFixed(1)}%`;
};

const INPUT_WITH_LEADING_ICON_CLASS = "macos-input !pl-11";

export function AirdropRewardModal({
  isOpen,
  onClose,
  airdrop,
  reward,
  onSubmit,
  onDelete,
}: AirdropRewardModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [claimStatus, setClaimStatus] = useState<RewardClaimStatus>("Pending TGE");
  const [amountUsd, setAmountUsd] = useState<string>("0");
  const [capitalUsd, setCapitalUsd] = useState<string>("0");
  const [feeUsd, setFeeUsd] = useState<string>("0");
  const [tokenAmount, setTokenAmount] = useState<string>("");
  const [tokenSymbol, setTokenSymbol] = useState<string>("");
  const [tgeDate, setTgeDate] = useState<string>("");
  const [claimedAt, setClaimedAt] = useState<string>("");
  const [notes, setNotes] = useState<string>("");

  useEffect(() => {
    if (!isOpen || !airdrop) return;

    setClaimStatus(reward?.claimStatus ?? "Pending TGE");
    setAmountUsd(reward ? String(reward.amountUsd ?? 0) : "0");
    setCapitalUsd(reward ? String(reward.capitalUsd ?? 0) : "0");
    setFeeUsd(reward ? String(reward.feeUsd ?? 0) : "0");
    setTokenAmount(reward?.tokenAmount != null ? String(reward.tokenAmount) : "");
    setTokenSymbol(reward?.tokenSymbol ?? "");
    setTgeDate(normalizeDateInputValue(reward?.tgeDate ?? airdrop.deadline));
    setClaimedAt(normalizeDateInputValue(reward?.claimedAt));
    setNotes(reward?.notes ?? "");
  }, [isOpen, airdrop, reward]);

  if (!airdrop) return null;

  const amountValue = Number(amountUsd || 0);
  const capitalValue = Number(capitalUsd || 0);
  const feeValue = Number(feeUsd || 0);
  const totalCost = capitalValue + feeValue;
  const netProfit = amountValue - totalCost;
  const roi = totalCost > 0 ? (netProfit / totalCost) * 100 : null;

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    setIsLoading(true);
    try {
      await Promise.resolve(
        onSubmit({
          airdropId: airdrop.id,
          claimStatus,
          amountUsd: Number(amountUsd || 0),
          capitalUsd: Number(capitalUsd || 0),
          feeUsd: Number(feeUsd || 0),
          tokenAmount: tokenAmount ? Number(tokenAmount) : null,
          tokenSymbol: tokenSymbol || null,
          tgeDate: tgeDate || null,
          claimedAt: claimStatus === "Claimed" ? claimedAt || getTodayDateInputValue() : claimedAt || null,
          notes: notes || null,
        })
      );
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!reward?.id || !onDelete) return;

    setIsDeleting(true);
    try {
      await Promise.resolve(onDelete(reward.id));
    } catch (error) {
      console.error(error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        showCloseButton={false}
        className="max-w-2xl border-0 bg-transparent p-0 shadow-none"
      >
        <div className="macos-modal flex max-h-[92vh] flex-col">
          <div className="shrink-0 px-6 pt-6">
            <div className="flex items-start justify-between gap-4">
              <DialogHeader className="flex-1 border-0 pb-0 text-left">
                <div className="inline-flex w-fit items-center gap-2 rounded-full border border-alpha-border bg-[color:var(--alpha-hover-soft)] px-3 py-1 text-[10px] uppercase tracking-[0.24em] alpha-text-muted">
                  <Sparkles className="h-3.5 w-3.5 text-gold" />
                  Reward Vault
                </div>
                <DialogTitle className="mt-4 text-2xl font-semibold alpha-text">
                  {reward ? "Edit airdrop reward" : "Record airdrop reward"}
                </DialogTitle>
                <DialogDescription className="alpha-text-muted">
                  Simpan TGE, modal, fee, realized value, dan profit untuk <span className="font-medium alpha-text">{airdrop.projectName}</span>.
                </DialogDescription>
              </DialogHeader>

              <DialogClose asChild>
                <button
                  type="button"
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-alpha-border bg-[color:var(--alpha-surface)] alpha-text transition-[background-color,color,border-color] duration-150 hover:border-[color:var(--alpha-border-strong)] hover:bg-[color:var(--alpha-hover-soft)]"
                  aria-label="Close modal"
                >
                  <X className="h-4 w-4" />
                </button>
              </DialogClose>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="mt-5 flex min-h-0 flex-1 flex-col">
            <div className="flex-1 space-y-6 overflow-y-auto px-6 pb-6">
              <div className="rounded-2xl border border-alpha-border bg-[color:var(--alpha-hover-soft)] p-4">
                <p className="text-[11px] uppercase tracking-[0.24em] alpha-text-muted">Linked project</p>
                <div className="mt-3 flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-xl border border-alpha-border bg-[color:var(--alpha-surface)]">
                    {airdrop.projectLogo ? (
                      <img src={airdrop.projectLogo} alt={airdrop.projectName} className="h-full w-full object-cover" />
                    ) : (
                      <span className="text-lg font-semibold alpha-text">{airdrop.projectName.slice(0, 1).toUpperCase()}</span>
                    )}
                  </div>
                  <div>
                    <p className="text-lg font-semibold alpha-text">{airdrop.projectName}</p>
                    <p className="text-sm alpha-text-muted">{airdrop.type} • {airdrop.status}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="claim-status" className="alpha-text">Claim status</Label>
                  <Select value={claimStatus} onValueChange={(value) => setClaimStatus(value as RewardClaimStatus)}>
                    <SelectTrigger id="claim-status" className="macos-input">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="macos-popover">
                      {CLAIM_STATUSES.map((status) => (
                        <SelectItem key={status} value={status}>
                          {status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="amount-usd" className="alpha-text">Realized value (USD)</Label>
                  <div className="relative">
                    <Coins className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 alpha-text-muted" />
                    <Input
                      id="amount-usd"
                      type="number"
                      min="0"
                      step="0.01"
                      value={amountUsd}
                      onChange={(event) => setAmountUsd(event.target.value)}
                      className={INPUT_WITH_LEADING_ICON_CLASS}
                      placeholder="300"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="capital-usd" className="alpha-text">Capital deployed (USD)</Label>
                  <div className="relative">
                    <WalletCards className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 alpha-text-muted" />
                    <Input
                      id="capital-usd"
                      type="number"
                      min="0"
                      step="0.01"
                      value={capitalUsd}
                      onChange={(event) => setCapitalUsd(event.target.value)}
                      className={INPUT_WITH_LEADING_ICON_CLASS}
                      placeholder="50"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr,1fr,1.2fr]">
                <div className="space-y-2">
                  <Label htmlFor="fee-usd" className="alpha-text">Fees / gas (USD)</Label>
                  <div className="relative">
                    <ReceiptText className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 alpha-text-muted" />
                    <Input
                      id="fee-usd"
                      type="number"
                      min="0"
                      step="0.01"
                      value={feeUsd}
                      onChange={(event) => setFeeUsd(event.target.value)}
                      className={INPUT_WITH_LEADING_ICON_CLASS}
                      placeholder="8"
                    />
                  </div>
                </div>

                <div className="rounded-2xl border border-alpha-border bg-[color:var(--alpha-hover-soft)] p-4">
                  <p className="text-[10px] uppercase tracking-[0.22em] alpha-text-muted">Total modal</p>
                  <p className="mt-2 text-xl font-semibold alpha-text">{formatCurrency(totalCost)}</p>
                  <p className="mt-1 text-xs alpha-text-muted">Capital + fees yang sudah kamu keluarin.</p>
                </div>

                <div className="rounded-2xl border border-alpha-border bg-[color:var(--alpha-hover-soft)] p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-[10px] uppercase tracking-[0.22em] alpha-text-muted">Net profit</p>
                    <TrendingUp className={`h-4 w-4 ${netProfit >= 0 ? "text-gold" : "text-[var(--alpha-danger)]"}`} />
                  </div>
                  <p className={`mt-2 text-xl font-semibold ${netProfit >= 0 ? "text-gold" : "text-[var(--alpha-danger)]"}`}>
                    {formatCurrency(netProfit)}
                  </p>
                  <p className="mt-1 text-xs alpha-text-muted">ROI {formatPercent(roi)}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="tge-date" className="alpha-text">TGE date</Label>
                  <div className="relative">
                    <CalendarDays className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 alpha-text-muted" />
                    <Input
                      id="tge-date"
                      type="date"
                      value={tgeDate}
                      onChange={(event) => setTgeDate(event.target.value)}
                      className={INPUT_WITH_LEADING_ICON_CLASS}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="claimed-at" className="alpha-text">Claimed date</Label>
                  <div className="relative">
                    <CalendarDays className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 alpha-text-muted" />
                    <Input
                      id="claimed-at"
                      type="date"
                      value={claimedAt}
                      onChange={(event) => setClaimedAt(event.target.value)}
                      className={INPUT_WITH_LEADING_ICON_CLASS}
                      disabled={claimStatus !== "Claimed"}
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-[1fr,1fr]">
                <div className="space-y-2">
                  <Label htmlFor="token-symbol" className="alpha-text">Token symbol</Label>
                  <Input
                    id="token-symbol"
                    value={tokenSymbol}
                    onChange={(event) => setTokenSymbol(event.target.value.toUpperCase())}
                    className="macos-input"
                    placeholder="OG"
                    maxLength={16}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="token-amount" className="alpha-text">Token amount</Label>
                  <Input
                    id="token-amount"
                    type="number"
                    min="0"
                    step="0.0001"
                    value={tokenAmount}
                    onChange={(event) => setTokenAmount(event.target.value)}
                    className="macos-input"
                    placeholder="1200"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="reward-notes" className="alpha-text">Notes</Label>
                <Textarea
                  id="reward-notes"
                  value={notes}
                  onChange={(event) => setNotes(event.target.value)}
                  placeholder="OG wallet, vested schedule, sell plan, or other notes..."
                  className="macos-input min-h-[120px]"
                />
              </div>
            </div>

            <div className="shrink-0 border-t border-alpha-border bg-[color:var(--alpha-surface)] px-6 py-4">
              <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  {reward?.id && onDelete ? (
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={handleDelete}
                      disabled={isDeleting || isLoading}
                      className="text-[var(--alpha-danger)] hover:bg-[var(--alpha-danger-soft)] hover:text-[var(--alpha-danger)]"
                    >
                      {isDeleting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                      Remove record
                    </Button>
                  ) : null}
                </div>

                <div className="flex flex-col-reverse gap-3 sm:flex-row">
                  <Button type="button" variant="ghost" onClick={onClose} className="macos-btn macos-btn--ghost">
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isLoading || isDeleting} className="macos-btn macos-btn--primary">
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    {reward ? "Save reward" : "Record reward"}
                  </Button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
