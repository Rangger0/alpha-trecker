import { useEffect, useMemo, useState, type ReactNode } from "react";
import {
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  Calculator,
  Download,
  FileSpreadsheet,
  History,
  LineChart,
  Pencil,
  Plus,
  Printer,
  RotateCcw,
  Search,
  Trash2,
  WalletCards,
  type LucideIcon,
} from "lucide-react";
import { toast } from "sonner";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";
import { useI18n } from "@/contexts/LanguageContext";
import {
  convertPortfolioCurrency,
  createPortfolioAsset,
  createPortfolioRates,
  createPortfolioTransaction,
  deletePortfolioAsset,
  getPortfolioAssets,
  getPortfolioTransactions,
  softDeletePortfolioTransaction,
  undoDeletePortfolioTransaction,
  updatePortfolioAsset,
  updatePortfolioTransaction,
} from "@/services/portfolio";
import type {
  PortfolioAsset,
  PortfolioAssetInput,
  PortfolioAssetType,
  PortfolioCurrency,
  PortfolioTransaction,
  PortfolioTransactionInput,
  PortfolioTransactionType,
} from "@/types";

type PortfolioTab = "overview" | "income" | "expense" | "assets" | "history" | "calculator";
type SortKey = "date" | "amount" | "category" | "type";
type SortDirection = "asc" | "desc";

const today = () => new Date().toISOString().slice(0, 10);

const CURRENCIES: PortfolioCurrency[] = ["IDR", "USD", "USDT", "USDC"];
const ASSET_TYPES: PortfolioAssetType[] = ["cash", "bank", "idr", "usd", "usdt", "usdc", "btc", "eth", "sol"];
const TRANSACTION_TYPES: PortfolioTransactionType[] = ["income", "expense"];

const defaultTransactionInput = (type: PortfolioTransactionType): PortfolioTransactionInput => ({
  type,
  transactionDate: today(),
  category: "",
  currency: "USD",
  amount: 0,
  wallet: "",
  source: "",
  note: "",
  attachmentUrl: "",
});

const defaultAssetInput = (): PortfolioAssetInput => ({
  assetType: "cash",
  label: "",
  currency: "USD",
  balance: 0,
  note: "",
});

const numberValue = (value: string) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const escapeCsvValue = (value: string | number | null | undefined) => {
  const text = String(value ?? "");
  return `"${text.replace(/"/g, '""')}"`;
};

function Panel({
  title,
  description,
  icon: Icon,
  action,
  children,
}: {
  title: string;
  description?: string;
  icon?: LucideIcon;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="rounded-[1.2rem] border border-[color:var(--alpha-border)] bg-[color:var(--alpha-card)] p-4 shadow-[var(--alpha-shadow)]">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 items-start gap-3">
          {Icon ? (
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[0.9rem] border border-[color:var(--alpha-border)] bg-[color:var(--alpha-surface-2)]">
              <Icon className="h-5 w-5 text-[color:var(--alpha-accent)]" />
            </div>
          ) : null}
          <div className="min-w-0">
            <h2 className="text-lg font-display font-bold alpha-text">{title}</h2>
            {description ? <p className="mt-1 text-sm alpha-text-muted">{description}</p> : null}
          </div>
        </div>
        {action ? <div className="flex shrink-0 flex-wrap gap-2">{action}</div> : null}
      </div>
      {children}
    </section>
  );
}

function MetricCard({
  label,
  value,
  hint,
  tone = "neutral",
}: {
  label: string;
  value: string;
  hint?: string;
  tone?: "neutral" | "success" | "warning" | "danger" | "accent";
}) {
  const toneClass = {
    neutral: "border-[color:var(--alpha-border)] bg-[color:var(--alpha-surface)]",
    success: "border-[color:var(--alpha-success-border)] bg-[color:var(--alpha-success-soft)]",
    warning: "border-[color:var(--alpha-warning-border)] bg-[color:var(--alpha-warning-soft)]",
    danger: "border-[color:var(--alpha-danger-border)] bg-[color:var(--alpha-danger-soft)]",
    accent: "border-[color:var(--alpha-highlight-border)] bg-[color:var(--alpha-highlight-soft)]",
  }[tone];

  return (
    <div className={`rounded-[1.05rem] border p-4 ${toneClass}`}>
      <p className="text-[11px] font-display font-bold uppercase tracking-[0.18em] alpha-text-muted">{label}</p>
      <p className="mt-2 text-2xl font-display font-bold alpha-text">{value}</p>
      {hint ? <p className="mt-1 text-xs alpha-text-muted">{hint}</p> : null}
    </div>
  );
}

function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-[1rem] border border-dashed border-[color:var(--alpha-border)] bg-[color:var(--alpha-surface)] p-6 text-center">
      <p className="font-display font-semibold alpha-text">{title}</p>
      <p className="mt-1 text-sm alpha-text-muted">{description}</p>
    </div>
  );
}

function SkeletonGrid() {
  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className="h-28 animate-pulse rounded-[1.05rem] bg-[color:var(--alpha-surface)]" />
      ))}
    </div>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="space-y-2">
      <Label className="text-xs font-display font-bold uppercase tracking-[0.16em] alpha-text-muted">
        {label}
      </Label>
      {children}
    </div>
  );
}

function PortfolioManagerPage() {
  const { session } = useAuth();
  const { t, formatDate, formatNumber, usdToIdrRate } = useI18n();
  const [activeTab, setActiveTab] = useState<PortfolioTab>("overview");
  const [transactions, setTransactions] = useState<PortfolioTransaction[]>([]);
  const [assets, setAssets] = useState<PortfolioAsset[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingTransaction, setEditingTransaction] = useState<PortfolioTransaction | null>(null);
  const [editingAsset, setEditingAsset] = useState<PortfolioAsset | null>(null);
  const [transactionForm, setTransactionForm] = useState(defaultTransactionInput("income"));
  const [assetForm, setAssetForm] = useState(defaultAssetInput);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<PortfolioTransactionType | "all">("all");
  const [currencyFilter, setCurrencyFilter] = useState<PortfolioCurrency | "all">("all");
  const [sortKey, setSortKey] = useState<SortKey>("date");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [page, setPage] = useState(1);
  const [calculatorInputs, setCalculatorInputs] = useState({
    a: "0",
    b: "0",
    percent: "0",
    revenue: "0",
    cost: "0",
    initial: "0",
    final: "0",
    principal: "0",
    rate: "0",
    years: "0",
    monthly: "0",
    convertAmount: "0",
    convertFrom: "USD" as PortfolioCurrency,
    convertTo: "IDR" as PortfolioCurrency,
    capital: "0",
    riskPercent: "1",
    entry: "0",
    stop: "0",
    feeAmount: "0",
    feePercent: "0",
    targetCapital: "0",
    targetPercent: "0",
  });

  const ownerId = session?.user?.id;
  const rates = useMemo(() => createPortfolioRates(usdToIdrRate), [usdToIdrRate]);

  const formatPortfolioCurrency = (value: number, currency: PortfolioCurrency = "USD") =>
    new Intl.NumberFormat(currency === "IDR" ? "id-ID" : "en-US", {
      style: "currency",
      currency: currency === "USDT" || currency === "USDC" ? "USD" : currency,
      maximumFractionDigits: currency === "IDR" ? 0 : 2,
    })
      .format(value)
      .replace("$", currency === "USDT" || currency === "USDC" ? `${currency} ` : "$");

  const toUsd = (amount: number, currency: PortfolioCurrency) =>
    convertPortfolioCurrency(amount, currency, "USD", rates);

  const loadPortfolio = async () => {
    if (!ownerId) return;

    setIsLoading(true);
    setError(null);
    try {
      const [nextTransactions, nextAssets] = await Promise.all([
        getPortfolioTransactions(ownerId, true),
        getPortfolioAssets(ownerId),
      ]);
      setTransactions(nextTransactions);
      setAssets(nextAssets);
    } catch (nextError) {
      const message = nextError instanceof Error ? nextError.message : t("portfolio.error.load");
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadPortfolio();
  }, [ownerId]);

  useEffect(() => {
    if ((activeTab === "income" || activeTab === "expense") && !editingTransaction) {
      setTransactionForm((current) =>
        current.type === activeTab ? current : defaultTransactionInput(activeTab)
      );
    }
  }, [activeTab, editingTransaction]);

  const activeTransactions = useMemo(
    () => transactions.filter((transaction) => !transaction.deletedAt),
    [transactions]
  );

  const deletedTransactions = useMemo(
    () => transactions.filter((transaction) => transaction.deletedAt),
    [transactions]
  );

  const totals = useMemo(() => {
    const income = activeTransactions
      .filter((transaction) => transaction.type === "income")
      .reduce((sum, transaction) => sum + toUsd(transaction.amount, transaction.currency), 0);
    const expense = activeTransactions
      .filter((transaction) => transaction.type === "expense")
      .reduce((sum, transaction) => sum + toUsd(transaction.amount, transaction.currency), 0);
    const totalAssets = assets.reduce((sum, asset) => sum + toUsd(asset.balance, asset.currency), 0);
    return {
      income,
      expense,
      totalAssets,
      cashFlow: income - expense,
      netProfit: income - expense,
    };
  }, [activeTransactions, assets, rates]);

  const monthlySummary = useMemo(() => {
    const groups = new Map<string, { income: number; expense: number }>();
    activeTransactions.forEach((transaction) => {
      const key = transaction.transactionDate.slice(0, 7);
      const current = groups.get(key) ?? { income: 0, expense: 0 };
      current[transaction.type] += toUsd(transaction.amount, transaction.currency);
      groups.set(key, current);
    });

    return Array.from(groups.entries())
      .sort(([a], [b]) => b.localeCompare(a))
      .slice(0, 6)
      .map(([month, value]) => ({ month, ...value, net: value.income - value.expense }));
  }, [activeTransactions, rates]);

  const filteredTransactions = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    const filtered = activeTransactions.filter((transaction) => {
      const matchesQuery =
        !query ||
        [
          transaction.category,
          transaction.wallet,
          transaction.source,
          transaction.note,
          transaction.currency,
          transaction.type,
        ]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(query));

      const matchesType = typeFilter === "all" || transaction.type === typeFilter;
      const matchesCurrency = currencyFilter === "all" || transaction.currency === currencyFilter;
      return matchesQuery && matchesType && matchesCurrency;
    });

    return filtered.sort((first, second) => {
      const direction = sortDirection === "asc" ? 1 : -1;
      if (sortKey === "amount") {
        return (toUsd(first.amount, first.currency) - toUsd(second.amount, second.currency)) * direction;
      }
      if (sortKey === "category") {
        return first.category.localeCompare(second.category) * direction;
      }
      if (sortKey === "type") {
        return first.type.localeCompare(second.type) * direction;
      }
      return first.transactionDate.localeCompare(second.transactionDate) * direction;
    });
  }, [activeTransactions, currencyFilter, rates, searchQuery, sortDirection, sortKey, typeFilter]);

  const pageSize = 8;
  const totalPages = Math.max(1, Math.ceil(filteredTransactions.length / pageSize));
  const paginatedTransactions = filteredTransactions.slice((page - 1) * pageSize, page * pageSize);

  useEffect(() => {
    setPage(1);
  }, [searchQuery, typeFilter, currencyFilter, sortKey, sortDirection]);

  useEffect(() => {
    setPage((currentPage) => Math.min(currentPage, totalPages));
  }, [totalPages]);

  const syncTransactionType = (type: PortfolioTransactionType) => {
    setEditingTransaction(null);
    setTransactionForm(defaultTransactionInput(type));
    setActiveTab(type);
  };

  const editTransaction = (transaction: PortfolioTransaction) => {
    setEditingTransaction(transaction);
    setTransactionForm({
      type: transaction.type,
      transactionDate: transaction.transactionDate,
      category: transaction.category,
      currency: transaction.currency,
      amount: transaction.amount,
      wallet: transaction.wallet,
      source: transaction.source ?? "",
      note: transaction.note ?? "",
      attachmentUrl: transaction.attachmentUrl ?? "",
    });
    setActiveTab(transaction.type);
  };

  const saveTransaction = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!ownerId) return;

    try {
      const payload = {
        ...transactionForm,
        category: transactionForm.category.trim(),
        wallet: transactionForm.wallet.trim(),
        amount: Math.max(0, transactionForm.amount),
      };

      if (!payload.category || !payload.wallet) {
        toast.error(t("portfolio.toast.required"));
        return;
      }

      if (editingTransaction) {
        await updatePortfolioTransaction(editingTransaction.id, ownerId, payload);
        toast.success(t("portfolio.toast.updated"));
      } else {
        await createPortfolioTransaction(ownerId, payload);
        toast.success(t("portfolio.toast.created"));
      }

      setEditingTransaction(null);
      setTransactionForm(defaultTransactionInput(transactionForm.type));
      await loadPortfolio();
    } catch (nextError) {
      toast.error(nextError instanceof Error ? nextError.message : t("portfolio.error.save"));
    }
  };

  const saveAsset = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!ownerId) return;

    try {
      const payload = {
        ...assetForm,
        label: assetForm.label.trim(),
        balance: Math.max(0, assetForm.balance),
      };

      if (!payload.label) {
        toast.error(t("portfolio.toast.required"));
        return;
      }

      if (editingAsset) {
        await updatePortfolioAsset(editingAsset.id, ownerId, payload);
        toast.success(t("portfolio.toast.updated"));
      } else {
        await createPortfolioAsset(ownerId, payload);
        toast.success(t("portfolio.toast.created"));
      }

      setEditingAsset(null);
      setAssetForm(defaultAssetInput());
      await loadPortfolio();
    } catch (nextError) {
      toast.error(nextError instanceof Error ? nextError.message : t("portfolio.error.save"));
    }
  };

  const removeTransaction = async (transaction: PortfolioTransaction) => {
    if (!ownerId) return;
    try {
      await softDeletePortfolioTransaction(transaction.id, ownerId);
      toast.success(t("portfolio.toast.deleted"));
      await loadPortfolio();
    } catch (nextError) {
      toast.error(nextError instanceof Error ? nextError.message : t("portfolio.error.save"));
    }
  };

  const undoDelete = async (transaction: PortfolioTransaction) => {
    if (!ownerId) return;
    try {
      await undoDeletePortfolioTransaction(transaction.id, ownerId);
      toast.success(t("portfolio.toast.undo"));
      await loadPortfolio();
    } catch (nextError) {
      toast.error(nextError instanceof Error ? nextError.message : t("portfolio.error.save"));
    }
  };

  const removeAsset = async (asset: PortfolioAsset) => {
    if (!ownerId) return;
    try {
      await deletePortfolioAsset(asset.id, ownerId);
      toast.success(t("portfolio.toast.deleted"));
      await loadPortfolio();
    } catch (nextError) {
      toast.error(nextError instanceof Error ? nextError.message : t("portfolio.error.save"));
    }
  };

  const exportRows = filteredTransactions.map((transaction) => ({
    date: transaction.transactionDate,
    type: t(`portfolio.type.${transaction.type}`),
    category: transaction.category,
    currency: transaction.currency,
    amount: transaction.amount,
    wallet: transaction.wallet,
    source: transaction.source ?? "",
    note: transaction.note ?? "",
    attachment: transaction.attachmentUrl ?? "",
  }));

  const exportCsv = () => {
    const headers = ["date", "type", "category", "currency", "amount", "wallet", "source", "note", "attachment"];
    const csv = [
      headers.map((header) => escapeCsvValue(t(`portfolio.export.${header}`))).join(","),
      ...exportRows.map((row) => headers.map((header) => escapeCsvValue(row[header as keyof typeof row])).join(",")),
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "portfolio-history.csv";
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const exportExcel = () => {
    const headers = ["date", "type", "category", "currency", "amount", "wallet", "source", "note", "attachment"];
    const escapeHtml = (value: unknown) =>
      String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
    const table = `<table><thead><tr>${headers
      .map((header) => `<th>${escapeHtml(t(`portfolio.export.${header}`))}</th>`)
      .join("")}</tr></thead><tbody>${exportRows
      .map(
        (row) =>
          `<tr>${headers
            .map((header) => `<td>${escapeHtml(row[header as keyof typeof row])}</td>`)
            .join("")}</tr>`
      )
      .join("")}</tbody></table>`;
    const blob = new Blob([table], { type: "application/vnd.ms-excel" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "portfolio-history.xls";
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const printHistory = () => window.print();

  const renderTransactionForm = (type: PortfolioTransactionType) => (
    <Panel
      title={t(`portfolio.${type}.formTitle`)}
      description={t(`portfolio.${type}.formDescription`)}
      icon={type === "income" ? ArrowUpRight : ArrowDownRight}
    >
      <form onSubmit={saveTransaction} className="grid gap-4 lg:grid-cols-2">
        <Field label={t("portfolio.field.date")}>
          <Input
            type="date"
            value={transactionForm.transactionDate}
            onChange={(event) => setTransactionForm((value) => ({ ...value, transactionDate: event.target.value }))}
            required
          />
        </Field>
        <Field label={t("portfolio.field.category")}>
          <Input
            value={transactionForm.category}
            onChange={(event) => setTransactionForm((value) => ({ ...value, category: event.target.value }))}
            placeholder={t("portfolio.placeholder.category")}
            required
          />
        </Field>
        <Field label={t("portfolio.field.currency")}>
          <Select
            value={transactionForm.currency}
            onValueChange={(value) =>
              setTransactionForm((current) => ({ ...current, currency: value as PortfolioCurrency }))
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CURRENCIES.map((currency) => (
                <SelectItem key={currency} value={currency}>
                  {currency}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
        <Field label={t("portfolio.field.amount")}>
          <Input
            type="number"
            min="0"
            step="0.000001"
            value={transactionForm.amount}
            onChange={(event) => setTransactionForm((value) => ({ ...value, amount: numberValue(event.target.value) }))}
            required
          />
        </Field>
        <Field label={t("portfolio.field.wallet")}>
          <Input
            value={transactionForm.wallet}
            onChange={(event) => setTransactionForm((value) => ({ ...value, wallet: event.target.value }))}
            placeholder={t("portfolio.placeholder.wallet")}
            required
          />
        </Field>
        {type === "income" ? (
          <Field label={t("portfolio.field.source")}>
            <Input
              value={transactionForm.source ?? ""}
              onChange={(event) => setTransactionForm((value) => ({ ...value, source: event.target.value }))}
              placeholder={t("portfolio.placeholder.source")}
            />
          </Field>
        ) : null}
        <Field label={t("portfolio.field.attachment")}>
          <Input
            type="url"
            value={transactionForm.attachmentUrl ?? ""}
            onChange={(event) => setTransactionForm((value) => ({ ...value, attachmentUrl: event.target.value }))}
            placeholder={t("portfolio.placeholder.attachment")}
          />
        </Field>
        <div className="lg:col-span-2">
          <Field label={t("portfolio.field.note")}>
            <Textarea
              value={transactionForm.note ?? ""}
              onChange={(event) => setTransactionForm((value) => ({ ...value, note: event.target.value }))}
              placeholder={t("portfolio.placeholder.note")}
            />
          </Field>
        </div>
        <div className="flex flex-wrap gap-2 lg:col-span-2">
          <Button type="submit">
            {editingTransaction ? <Pencil className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
            {editingTransaction ? t("common.saveChanges") : t("portfolio.action.add")}
          </Button>
          {editingTransaction ? (
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setEditingTransaction(null);
                setTransactionForm(defaultTransactionInput(type));
              }}
            >
              {t("common.cancel")}
            </Button>
          ) : null}
        </div>
      </form>
    </Panel>
  );

  const renderTransactionsTable = (items: PortfolioTransaction[]) => (
    <div className="overflow-x-auto rounded-[1rem] border border-[color:var(--alpha-border)]">
      <table className="w-full min-w-[760px] text-left text-sm">
        <thead className="bg-[color:var(--alpha-surface-2)] text-xs uppercase tracking-[0.14em] alpha-text-muted">
          <tr>
            <th className="px-3 py-3">{t("portfolio.field.date")}</th>
            <th className="px-3 py-3">{t("portfolio.field.type")}</th>
            <th className="px-3 py-3">{t("portfolio.field.category")}</th>
            <th className="px-3 py-3">{t("portfolio.field.amount")}</th>
            <th className="px-3 py-3">{t("portfolio.field.wallet")}</th>
            <th className="px-3 py-3">{t("portfolio.field.note")}</th>
            <th className="px-3 py-3 text-right">{t("portfolio.field.actions")}</th>
          </tr>
        </thead>
        <tbody>
          {items.map((transaction) => (
            <tr key={transaction.id} className="border-t border-[color:var(--alpha-border)] hover:bg-[color:var(--alpha-hover-soft)]">
              <td className="px-3 py-3 alpha-text-muted">{formatDate(transaction.transactionDate)}</td>
              <td className="px-3 py-3">
                <span
                  className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${
                    transaction.type === "income"
                      ? "border-[color:var(--alpha-success-border)] bg-[color:var(--alpha-success-soft)] text-[color:var(--alpha-success)]"
                      : "border-[color:var(--alpha-danger-border)] bg-[color:var(--alpha-danger-soft)] text-[color:var(--alpha-danger)]"
                  }`}
                >
                  {t(`portfolio.type.${transaction.type}`)}
                </span>
              </td>
              <td className="px-3 py-3 alpha-text">{transaction.category}</td>
              <td className="px-3 py-3 font-semibold alpha-text">
                {formatPortfolioCurrency(transaction.amount, transaction.currency)}
              </td>
              <td className="px-3 py-3 alpha-text-muted">{transaction.wallet}</td>
              <td className="max-w-[220px] truncate px-3 py-3 alpha-text-muted">{transaction.note || "--"}</td>
              <td className="px-3 py-3">
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="ghost" size="icon-sm" onClick={() => editTransaction(transaction)} aria-label={t("common.edit")}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button type="button" variant="ghost" size="icon-sm" onClick={() => void removeTransaction(transaction)} aria-label={t("common.delete")}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderOverview = () => (
    <div className="space-y-5">
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        <MetricCard label={t("portfolio.metric.totalAssets")} value={formatPortfolioCurrency(totals.totalAssets)} tone="accent" />
        <MetricCard label={t("portfolio.metric.totalIncome")} value={formatPortfolioCurrency(totals.income)} tone="success" />
        <MetricCard label={t("portfolio.metric.totalExpense")} value={formatPortfolioCurrency(totals.expense)} tone="danger" />
        <MetricCard label={t("portfolio.metric.cashFlow")} value={formatPortfolioCurrency(totals.cashFlow)} tone={totals.cashFlow >= 0 ? "success" : "warning"} />
        <MetricCard label={t("portfolio.metric.netProfit")} value={formatPortfolioCurrency(totals.netProfit)} tone={totals.netProfit >= 0 ? "success" : "danger"} />
      </div>

      <div className="grid gap-5 xl:grid-cols-[1fr_1.1fr]">
        <Panel title={t("portfolio.overview.monthlySummary")} icon={BarChart3}>
          {monthlySummary.length ? (
            <div className="space-y-3">
              {monthlySummary.map((item) => {
                const maxValue = Math.max(item.income, item.expense, 1);
                return (
                  <div key={item.month} className="space-y-2">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-sm font-semibold alpha-text">{item.month}</span>
                      <span className="text-sm alpha-text-muted">{formatPortfolioCurrency(item.net)}</span>
                    </div>
                    <div className="grid gap-2">
                      <div className="h-2 overflow-hidden rounded-full bg-[color:var(--alpha-surface)]">
                        <div className="h-full rounded-full bg-[color:var(--alpha-success)]" style={{ width: `${(item.income / maxValue) * 100}%` }} />
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-[color:var(--alpha-surface)]">
                        <div className="h-full rounded-full bg-[color:var(--alpha-danger)]" style={{ width: `${(item.expense / maxValue) * 100}%` }} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <EmptyState title={t("portfolio.empty.monthlyTitle")} description={t("portfolio.empty.monthlyDescription")} />
          )}
        </Panel>

        <Panel title={t("portfolio.overview.charts")} icon={LineChart}>
          <div className="grid gap-3 sm:grid-cols-3">
            <MetricCard label={t("portfolio.type.income")} value={formatPortfolioCurrency(totals.income)} />
            <MetricCard label={t("portfolio.type.expense")} value={formatPortfolioCurrency(totals.expense)} />
            <MetricCard label={t("portfolio.assets.title")} value={formatNumber(assets.length)} />
          </div>
          <div className="mt-4 grid h-56 grid-cols-3 items-end gap-3 rounded-[1rem] border border-[color:var(--alpha-border)] bg-[color:var(--alpha-surface)] p-4">
            {[
              { key: "assets", value: totals.totalAssets, color: "var(--alpha-accent)" },
              { key: "income", value: totals.income, color: "var(--alpha-success)" },
              { key: "expense", value: totals.expense, color: "var(--alpha-danger)" },
            ].map((item) => {
              const height = Math.max(8, (item.value / Math.max(totals.totalAssets, totals.income, totals.expense, 1)) * 100);
              return (
                <div key={item.key} className="flex h-full flex-col justify-end gap-2">
                  <div className="rounded-t-[0.8rem]" style={{ height: `${height}%`, background: item.color }} />
                  <p className="text-center text-xs alpha-text-muted">{t(`portfolio.chart.${item.key}`)}</p>
                </div>
              );
            })}
          </div>
        </Panel>
      </div>

      <Panel title={t("portfolio.overview.recentTransactions")} icon={History}>
        {activeTransactions.length ? (
          renderTransactionsTable(activeTransactions.slice(0, 5))
        ) : (
          <EmptyState title={t("portfolio.empty.transactionsTitle")} description={t("portfolio.empty.transactionsDescription")} />
        )}
      </Panel>
    </div>
  );

  const renderTransactionTab = (type: PortfolioTransactionType) => {
    const items = activeTransactions.filter((transaction) => transaction.type === type).slice(0, 8);
    return (
      <div className="space-y-5">
        {renderTransactionForm(type)}
        <Panel title={t(`portfolio.${type}.listTitle`)} icon={History}>
          {items.length ? renderTransactionsTable(items) : <EmptyState title={t(`portfolio.${type}.emptyTitle`)} description={t(`portfolio.${type}.emptyDescription`)} />}
        </Panel>
      </div>
    );
  };

  const renderAssets = () => (
    <div className="space-y-5">
      <Panel title={t("portfolio.assets.formTitle")} description={t("portfolio.assets.formDescription")} icon={WalletCards}>
        <form onSubmit={saveAsset} className="grid gap-4 lg:grid-cols-2">
          <Field label={t("portfolio.field.assetType")}>
            <Select
              value={assetForm.assetType}
              onValueChange={(value) => setAssetForm((current) => ({ ...current, assetType: value as PortfolioAssetType }))}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ASSET_TYPES.map((assetType) => (
                  <SelectItem key={assetType} value={assetType}>
                    {t(`portfolio.assetType.${assetType}`)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field label={t("portfolio.field.label")}>
            <Input value={assetForm.label} onChange={(event) => setAssetForm((value) => ({ ...value, label: event.target.value }))} required />
          </Field>
          <Field label={t("portfolio.field.currency")}>
            <Select value={assetForm.currency} onValueChange={(value) => setAssetForm((current) => ({ ...current, currency: value as PortfolioCurrency }))}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CURRENCIES.map((currency) => (
                  <SelectItem key={currency} value={currency}>
                    {currency}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field label={t("portfolio.field.balance")}>
            <Input type="number" min="0" step="0.000001" value={assetForm.balance} onChange={(event) => setAssetForm((value) => ({ ...value, balance: numberValue(event.target.value) }))} required />
          </Field>
          <div className="lg:col-span-2">
            <Field label={t("portfolio.field.note")}>
              <Textarea value={assetForm.note ?? ""} onChange={(event) => setAssetForm((value) => ({ ...value, note: event.target.value }))} />
            </Field>
          </div>
          <div className="flex flex-wrap gap-2 lg:col-span-2">
            <Button type="submit">{editingAsset ? t("common.saveChanges") : t("portfolio.action.add")}</Button>
            {editingAsset ? (
              <Button type="button" variant="secondary" onClick={() => { setEditingAsset(null); setAssetForm(defaultAssetInput()); }}>
                {t("common.cancel")}
              </Button>
            ) : null}
          </div>
        </form>
      </Panel>

      <Panel title={t("portfolio.assets.listTitle")} icon={WalletCards}>
        {assets.length ? (
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {assets.map((asset) => (
              <div key={asset.id} className="rounded-[1rem] border border-[color:var(--alpha-border)] bg-[color:var(--alpha-surface)] p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-display font-bold alpha-text">{asset.label}</p>
                    <p className="mt-1 text-xs alpha-text-muted">{t(`portfolio.assetType.${asset.assetType}`)}</p>
                  </div>
                  <div className="flex gap-1">
                    <Button type="button" size="icon-sm" variant="ghost" onClick={() => { setEditingAsset(asset); setAssetForm({ assetType: asset.assetType, label: asset.label, currency: asset.currency, balance: asset.balance, note: asset.note ?? "" }); }}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button type="button" size="icon-sm" variant="ghost" onClick={() => void removeAsset(asset)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <p className="mt-4 text-2xl font-display font-bold alpha-text">{formatPortfolioCurrency(asset.balance, asset.currency)}</p>
                {asset.note ? <p className="mt-2 text-sm alpha-text-muted">{asset.note}</p> : null}
              </div>
            ))}
          </div>
        ) : (
          <EmptyState title={t("portfolio.assets.emptyTitle")} description={t("portfolio.assets.emptyDescription")} />
        )}
      </Panel>
    </div>
  );

  const renderHistory = () => (
    <div className="space-y-5">
      <Panel
        title={t("portfolio.history.title")}
        description={t("portfolio.history.description")}
        icon={History}
        action={
          <>
            <Button type="button" variant="secondary" size="sm" onClick={exportCsv}><Download className="h-4 w-4" />{t("portfolio.action.csv")}</Button>
            <Button type="button" variant="secondary" size="sm" onClick={exportExcel}><FileSpreadsheet className="h-4 w-4" />{t("portfolio.action.excel")}</Button>
            <Button type="button" variant="secondary" size="sm" onClick={printHistory}><Printer className="h-4 w-4" />{t("portfolio.action.print")}</Button>
          </>
        }
      >
        <div className="grid gap-3 lg:grid-cols-[1fr_160px_160px_160px_160px]">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 alpha-text-muted" />
            <Input className="pl-9" value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder={t("portfolio.history.search")} />
          </div>
          <Select value={typeFilter} onValueChange={(value) => setTypeFilter(value as PortfolioTransactionType | "all")}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("portfolio.filter.allTypes")}</SelectItem>
              {TRANSACTION_TYPES.map((type) => <SelectItem key={type} value={type}>{t(`portfolio.type.${type}`)}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={currencyFilter} onValueChange={(value) => setCurrencyFilter(value as PortfolioCurrency | "all")}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("portfolio.filter.allCurrencies")}</SelectItem>
              {CURRENCIES.map((currency) => <SelectItem key={currency} value={currency}>{currency}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={sortKey} onValueChange={(value) => setSortKey(value as SortKey)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="date">{t("portfolio.sort.date")}</SelectItem>
              <SelectItem value="amount">{t("portfolio.sort.amount")}</SelectItem>
              <SelectItem value="category">{t("portfolio.sort.category")}</SelectItem>
              <SelectItem value="type">{t("portfolio.sort.type")}</SelectItem>
            </SelectContent>
          </Select>
          <Select value={sortDirection} onValueChange={(value) => setSortDirection(value as SortDirection)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="desc">{t("portfolio.sort.desc")}</SelectItem>
              <SelectItem value="asc">{t("portfolio.sort.asc")}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="mt-4">
          {paginatedTransactions.length ? renderTransactionsTable(paginatedTransactions) : <EmptyState title={t("portfolio.empty.transactionsTitle")} description={t("portfolio.empty.transactionsDescription")} />}
        </div>

        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm alpha-text-muted">{t("portfolio.history.page", { page, total: totalPages })}</p>
          <div className="flex gap-2">
            <Button type="button" variant="secondary" size="sm" onClick={() => setPage((value) => Math.max(1, value - 1))} disabled={page <= 1}>{t("portfolio.action.previous")}</Button>
            <Button type="button" variant="secondary" size="sm" onClick={() => setPage((value) => Math.min(totalPages, value + 1))} disabled={page >= totalPages}>{t("portfolio.action.next")}</Button>
          </div>
        </div>
      </Panel>

      {deletedTransactions.length ? (
        <Panel title={t("portfolio.history.deleted")} icon={RotateCcw}>
          <div className="grid gap-2">
            {deletedTransactions.slice(0, 5).map((transaction) => (
              <div key={transaction.id} className="flex flex-col gap-2 rounded-[0.9rem] border border-[color:var(--alpha-border)] bg-[color:var(--alpha-surface)] p-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-semibold alpha-text">{transaction.category}</p>
                  <p className="text-sm alpha-text-muted">{formatDate(transaction.transactionDate)} · {formatPortfolioCurrency(transaction.amount, transaction.currency)}</p>
                </div>
                <Button type="button" variant="secondary" size="sm" onClick={() => void undoDelete(transaction)}><RotateCcw className="h-4 w-4" />{t("portfolio.action.undoDelete")}</Button>
              </div>
            ))}
          </div>
        </Panel>
      ) : null}
    </div>
  );

  const calc = useMemo(() => {
    const a = numberValue(calculatorInputs.a);
    const b = numberValue(calculatorInputs.b);
    const revenue = numberValue(calculatorInputs.revenue);
    const cost = numberValue(calculatorInputs.cost);
    const initial = numberValue(calculatorInputs.initial);
    const final = numberValue(calculatorInputs.final);
    const principal = numberValue(calculatorInputs.principal);
    const rate = numberValue(calculatorInputs.rate) / 100;
    const years = numberValue(calculatorInputs.years);
    const monthly = numberValue(calculatorInputs.monthly);
    const capital = numberValue(calculatorInputs.capital);
    const riskPercent = numberValue(calculatorInputs.riskPercent);
    const entry = numberValue(calculatorInputs.entry);
    const stop = numberValue(calculatorInputs.stop);
    const feeAmount = numberValue(calculatorInputs.feeAmount);
    const feePercent = numberValue(calculatorInputs.feePercent);
    const targetCapital = numberValue(calculatorInputs.targetCapital);
    const targetPercent = numberValue(calculatorInputs.targetPercent);
    const riskAmount = capital * (riskPercent / 100);
    const stopDistance = Math.abs(entry - stop);
    const monthlyRate = rate / 12;
    const periods = years * 12;
    const compoundGrowth = Math.pow(1 + monthlyRate, periods);

    return {
      sum: a + b,
      difference: a - b,
      product: a * b,
      quotient: b === 0 ? 0 : a / b,
      percent: a * (numberValue(calculatorInputs.percent) / 100),
      pnl: revenue - cost,
      roi: initial === 0 ? 0 : ((final - initial) / initial) * 100,
      compound: principal * compoundGrowth + (monthlyRate === 0 ? monthly * periods : monthly * ((compoundGrowth - 1) / monthlyRate)),
      converted: convertPortfolioCurrency(numberValue(calculatorInputs.convertAmount), calculatorInputs.convertFrom, calculatorInputs.convertTo, rates),
      positionSize: stopDistance === 0 ? 0 : riskAmount / stopDistance,
      tradingFee: feeAmount * (feePercent / 100),
      targetProfit: targetCapital * (targetPercent / 100),
    };
  }, [calculatorInputs, rates]);

  const setCalcValue = (key: keyof typeof calculatorInputs, value: string) =>
    setCalculatorInputs((current) => ({ ...current, [key]: value }));

  const calcInput = (key: keyof typeof calculatorInputs, label: string) => (
    <Field label={label}>
      <Input type="number" step="0.000001" value={String(calculatorInputs[key])} onChange={(event) => setCalcValue(key, event.target.value)} />
    </Field>
  );

  const renderCalculator = () => (
    <div className="grid gap-5 xl:grid-cols-2">
      <Panel title={t("portfolio.calculator.basic")} icon={Calculator}>
        <div className="grid gap-4 sm:grid-cols-2">
          {calcInput("a", t("portfolio.calculator.valueA"))}
          {calcInput("b", t("portfolio.calculator.valueB"))}
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-4">
          <MetricCard label={t("portfolio.calculator.sum")} value={formatNumber(calc.sum)} />
          <MetricCard label={t("portfolio.calculator.difference")} value={formatNumber(calc.difference)} />
          <MetricCard label={t("portfolio.calculator.product")} value={formatNumber(calc.product)} />
          <MetricCard label={t("portfolio.calculator.quotient")} value={formatNumber(calc.quotient)} />
        </div>
      </Panel>

      <Panel title={t("portfolio.calculator.percentage")} icon={Calculator}>
        <div className="grid gap-4 sm:grid-cols-2">
          {calcInput("a", t("portfolio.calculator.base"))}
          {calcInput("percent", t("portfolio.calculator.percent"))}
        </div>
        <MetricCard label={t("portfolio.calculator.result")} value={formatNumber(calc.percent)} />
      </Panel>

      <Panel title={t("portfolio.calculator.pnl")} icon={LineChart}>
        <div className="grid gap-4 sm:grid-cols-2">
          {calcInput("revenue", t("portfolio.calculator.revenue"))}
          {calcInput("cost", t("portfolio.calculator.cost"))}
        </div>
        <MetricCard label={t("portfolio.calculator.pnl")} value={formatPortfolioCurrency(calc.pnl)} tone={calc.pnl >= 0 ? "success" : "danger"} />
      </Panel>

      <Panel title={t("portfolio.calculator.roi")} icon={LineChart}>
        <div className="grid gap-4 sm:grid-cols-2">
          {calcInput("initial", t("portfolio.calculator.initial"))}
          {calcInput("final", t("portfolio.calculator.final"))}
        </div>
        <MetricCard label={t("portfolio.calculator.roi")} value={`${formatNumber(calc.roi, { maximumFractionDigits: 2 })}%`} />
      </Panel>

      <Panel title={t("portfolio.calculator.compound")} icon={LineChart}>
        <div className="grid gap-4 sm:grid-cols-2">
          {calcInput("principal", t("portfolio.calculator.principal"))}
          {calcInput("rate", t("portfolio.calculator.rate"))}
          {calcInput("years", t("portfolio.calculator.years"))}
          {calcInput("monthly", t("portfolio.calculator.monthly"))}
        </div>
        <MetricCard label={t("portfolio.calculator.futureValue")} value={formatPortfolioCurrency(calc.compound)} />
      </Panel>

      <Panel title={t("portfolio.calculator.converter")} icon={Calculator}>
        <div className="grid gap-4 sm:grid-cols-3">
          {calcInput("convertAmount", t("portfolio.field.amount"))}
          <Field label={t("portfolio.calculator.from")}>
            <Select value={calculatorInputs.convertFrom} onValueChange={(value) => setCalculatorInputs((current) => ({ ...current, convertFrom: value as PortfolioCurrency }))}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{CURRENCIES.map((currency) => <SelectItem key={currency} value={currency}>{currency}</SelectItem>)}</SelectContent>
            </Select>
          </Field>
          <Field label={t("portfolio.calculator.to")}>
            <Select value={calculatorInputs.convertTo} onValueChange={(value) => setCalculatorInputs((current) => ({ ...current, convertTo: value as PortfolioCurrency }))}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{CURRENCIES.map((currency) => <SelectItem key={currency} value={currency}>{currency}</SelectItem>)}</SelectContent>
            </Select>
          </Field>
        </div>
        <MetricCard label={t("portfolio.calculator.converted")} value={formatPortfolioCurrency(calc.converted, calculatorInputs.convertTo)} />
      </Panel>

      <Panel title={t("portfolio.calculator.positionSize")} icon={WalletCards}>
        <div className="grid gap-4 sm:grid-cols-2">
          {calcInput("capital", t("portfolio.calculator.capital"))}
          {calcInput("riskPercent", t("portfolio.calculator.riskPercent"))}
          {calcInput("entry", t("portfolio.calculator.entry"))}
          {calcInput("stop", t("portfolio.calculator.stop"))}
        </div>
        <MetricCard label={t("portfolio.calculator.positionSize")} value={formatNumber(calc.positionSize, { maximumFractionDigits: 6 })} />
      </Panel>

      <Panel title={t("portfolio.calculator.fee")} icon={Calculator}>
        <div className="grid gap-4 sm:grid-cols-2">
          {calcInput("feeAmount", t("portfolio.field.amount"))}
          {calcInput("feePercent", t("portfolio.calculator.feePercent"))}
        </div>
        <MetricCard label={t("portfolio.calculator.fee")} value={formatPortfolioCurrency(calc.tradingFee)} />
      </Panel>

      <Panel title={t("portfolio.calculator.targetProfit")} icon={LineChart}>
        <div className="grid gap-4 sm:grid-cols-2">
          {calcInput("targetCapital", t("portfolio.calculator.capital"))}
          {calcInput("targetPercent", t("portfolio.calculator.targetPercent"))}
        </div>
        <MetricCard label={t("portfolio.calculator.targetProfit")} value={formatPortfolioCurrency(calc.targetProfit)} />
      </Panel>
    </div>
  );

  const tabContent = {
    overview: renderOverview,
    income: () => renderTransactionTab("income"),
    expense: () => renderTransactionTab("expense"),
    assets: renderAssets,
    history: renderHistory,
    calculator: renderCalculator,
  }[activeTab];

  return (
    <DashboardLayout>
      <div className="space-y-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-[11px] font-display font-bold uppercase tracking-[0.22em] text-[color:var(--alpha-accent)]">
              {t("portfolio.badge")}
            </p>
            <h1 className="mt-2 text-3xl font-display font-bold alpha-text">{t("portfolio.title")}</h1>
            <p className="mt-2 max-w-3xl text-sm alpha-text-muted">{t("portfolio.subtitle")}</p>
          </div>
          <Button type="button" onClick={() => syncTransactionType("income")}>
            <Plus className="h-4 w-4" />
            {t("portfolio.action.newIncome")}
          </Button>
        </div>

        <div className="flex gap-2 overflow-x-auto rounded-[1rem] border border-[color:var(--alpha-border)] bg-[color:var(--alpha-surface)] p-1">
          {(["overview", "income", "expense", "assets", "history", "calculator"] as PortfolioTab[]).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`shrink-0 rounded-[0.8rem] px-3 py-2 text-sm font-display font-semibold transition-colors ${
                activeTab === tab
                  ? "bg-[color:var(--alpha-highlight)] text-[color:var(--alpha-accent-contrast)]"
                  : "alpha-text-muted hover:bg-[color:var(--alpha-hover-soft)] hover:text-[color:var(--alpha-text)]"
              }`}
            >
              {t(`portfolio.tab.${tab}`)}
            </button>
          ))}
        </div>

        {isLoading ? <SkeletonGrid /> : error ? <EmptyState title={t("portfolio.error.title")} description={error} /> : tabContent()}
      </div>
    </DashboardLayout>
  );
}

export { PortfolioManagerPage };
