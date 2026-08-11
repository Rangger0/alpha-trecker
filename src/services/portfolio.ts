import { supabase } from "@/lib/supabase";
import type {
  PortfolioAsset,
  PortfolioAssetInput,
  PortfolioCurrency,
  PortfolioTransaction,
  PortfolioTransactionInput,
} from "@/types";

export const PORTFOLIO_SCHEMA_WARNING =
  "Tabel Portfolio Manager belum ada di Supabase. Jalankan migration supabase/migrations/20260802000100_create_portfolio_manager.sql.";

type PortfolioTransactionRow = {
  id: string;
  owner_id: string;
  type: PortfolioTransaction["type"];
  transaction_date: string;
  category: string;
  currency: PortfolioCurrency;
  amount: number | string;
  wallet: string;
  source?: string | null;
  note?: string | null;
  attachment_url?: string | null;
  deleted_at?: string | null;
  created_at: string;
  updated_at: string;
};

type PortfolioAssetRow = {
  id: string;
  owner_id: string;
  asset_type: PortfolioAsset["assetType"];
  label: string;
  currency: PortfolioCurrency;
  balance: number | string;
  note?: string | null;
  created_at: string;
  updated_at: string;
};

export type PortfolioRateMap = Record<PortfolioCurrency, number>;

export const createPortfolioRates = (usdToIdrRate: number): PortfolioRateMap => ({
  IDR: Number.isFinite(usdToIdrRate) && usdToIdrRate > 0 ? 1 / usdToIdrRate : 1 / 16_000,
  USD: 1,
  USDT: 1,
  USDC: 1,
});

export const convertPortfolioCurrency = (
  amount: number,
  from: PortfolioCurrency,
  to: PortfolioCurrency,
  rates: PortfolioRateMap
) => {
  const amountInUsd = amount * (rates[from] ?? 1);
  const targetRate = rates[to] ?? 1;
  return targetRate === 0 ? amountInUsd : amountInUsd / targetRate;
};

const toNumber = (value: unknown) => {
  const parsed = typeof value === "number" ? value : Number(value ?? 0);
  return Number.isFinite(parsed) ? parsed : 0;
};

const normalizeOptionalText = (value?: string | null) => {
  const nextValue = value?.trim();
  return nextValue ? nextValue : null;
};

const isMissingTableError = (error: unknown) => {
  const code =
    typeof error === "object" && error !== null && "code" in error
      ? String((error as { code?: unknown }).code)
      : "";
  const message =
    typeof error === "object" && error !== null && "message" in error
      ? String((error as { message?: unknown }).message).toLowerCase()
      : "";

  return code === "PGRST205" || code === "42P01" || message.includes("portfolio_");
};

const throwSchemaAwareError = (error: unknown): never => {
  if (isMissingTableError(error)) {
    throw new Error(PORTFOLIO_SCHEMA_WARNING);
  }

  throw error;
};

const mapTransactionRow = (row: PortfolioTransactionRow): PortfolioTransaction => ({
  id: row.id,
  ownerId: row.owner_id,
  type: row.type,
  transactionDate: row.transaction_date,
  category: row.category,
  currency: row.currency,
  amount: toNumber(row.amount),
  wallet: row.wallet,
  source: row.source ?? null,
  note: row.note ?? null,
  attachmentUrl: row.attachment_url ?? null,
  deletedAt: row.deleted_at ?? null,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

const mapAssetRow = (row: PortfolioAssetRow): PortfolioAsset => ({
  id: row.id,
  ownerId: row.owner_id,
  assetType: row.asset_type,
  label: row.label,
  currency: row.currency,
  balance: toNumber(row.balance),
  note: row.note ?? null,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

const buildTransactionPayload = (ownerId: string, input: PortfolioTransactionInput) => ({
  owner_id: ownerId,
  type: input.type,
  transaction_date: input.transactionDate,
  category: input.category.trim(),
  currency: input.currency,
  amount: input.amount,
  wallet: input.wallet.trim(),
  source: input.type === "income" ? normalizeOptionalText(input.source) : null,
  note: normalizeOptionalText(input.note),
  attachment_url: normalizeOptionalText(input.attachmentUrl),
  updated_at: new Date().toISOString(),
});

const buildAssetPayload = (ownerId: string, input: PortfolioAssetInput) => ({
  owner_id: ownerId,
  asset_type: input.assetType,
  label: input.label.trim(),
  currency: input.currency,
  balance: input.balance,
  note: normalizeOptionalText(input.note),
  updated_at: new Date().toISOString(),
});

export async function getPortfolioTransactions(ownerId: string, includeDeleted = false) {
  let query = supabase
    .from("portfolio_transactions")
    .select("*")
    .eq("owner_id", ownerId)
    .order("transaction_date", { ascending: false })
    .order("created_at", { ascending: false });

  if (!includeDeleted) {
    query = query.is("deleted_at", null);
  }

  const { data, error } = await query;
  if (error) throwSchemaAwareError(error);

  return (data || []).map((row) => mapTransactionRow(row as PortfolioTransactionRow));
}

export async function createPortfolioTransaction(ownerId: string, input: PortfolioTransactionInput) {
  const { data, error } = await supabase
    .from("portfolio_transactions")
    .insert(buildTransactionPayload(ownerId, input))
    .select()
    .single();

  if (error) throwSchemaAwareError(error);
  return mapTransactionRow(data as PortfolioTransactionRow);
}

export async function updatePortfolioTransaction(
  id: string,
  ownerId: string,
  input: PortfolioTransactionInput
) {
  const { data, error } = await supabase
    .from("portfolio_transactions")
    .update(buildTransactionPayload(ownerId, input))
    .eq("id", id)
    .eq("owner_id", ownerId)
    .select()
    .single();

  if (error) throwSchemaAwareError(error);
  return mapTransactionRow(data as PortfolioTransactionRow);
}

export async function softDeletePortfolioTransaction(id: string, ownerId: string) {
  const { error } = await supabase
    .from("portfolio_transactions")
    .update({ deleted_at: new Date().toISOString(), updated_at: new Date().toISOString() })
    .eq("id", id)
    .eq("owner_id", ownerId);

  if (error) throwSchemaAwareError(error);
}

export async function undoDeletePortfolioTransaction(id: string, ownerId: string) {
  const { error } = await supabase
    .from("portfolio_transactions")
    .update({ deleted_at: null, updated_at: new Date().toISOString() })
    .eq("id", id)
    .eq("owner_id", ownerId);

  if (error) throwSchemaAwareError(error);
}

export async function deletePortfolioTransaction(id: string, ownerId: string) {
  const { error } = await supabase
    .from("portfolio_transactions")
    .delete()
    .eq("id", id)
    .eq("owner_id", ownerId);

  if (error) throwSchemaAwareError(error);
}

export async function getPortfolioAssets(ownerId: string) {
  const { data, error } = await supabase
    .from("portfolio_assets")
    .select("*")
    .eq("owner_id", ownerId)
    .order("asset_type", { ascending: true })
    .order("label", { ascending: true });

  if (error) throwSchemaAwareError(error);
  return (data || []).map((row) => mapAssetRow(row as PortfolioAssetRow));
}

export async function createPortfolioAsset(ownerId: string, input: PortfolioAssetInput) {
  const { data, error } = await supabase
    .from("portfolio_assets")
    .insert(buildAssetPayload(ownerId, input))
    .select()
    .single();

  if (error) throwSchemaAwareError(error);
  return mapAssetRow(data as PortfolioAssetRow);
}

export async function updatePortfolioAsset(id: string, ownerId: string, input: PortfolioAssetInput) {
  const { data, error } = await supabase
    .from("portfolio_assets")
    .update(buildAssetPayload(ownerId, input))
    .eq("id", id)
    .eq("owner_id", ownerId)
    .select()
    .single();

  if (error) throwSchemaAwareError(error);
  return mapAssetRow(data as PortfolioAssetRow);
}

export async function deletePortfolioAsset(id: string, ownerId: string) {
  const { error } = await supabase
    .from("portfolio_assets")
    .delete()
    .eq("id", id)
    .eq("owner_id", ownerId);

  if (error) throwSchemaAwareError(error);
}
