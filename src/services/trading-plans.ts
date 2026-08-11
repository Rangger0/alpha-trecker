import { supabase } from "@/lib/supabase";
import type { TradingPlan, TradingPlanInput } from "@/types";

export const TRADING_PLANS_SCHEMA_WARNING =
  "Tabel trading_plans belum ada di Supabase. Jalankan migration supabase/migrations/20260726000100_create_trading_plans.sql agar fitur Trading Plan tersimpan real.";

type TradingPlanRow = {
  id: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  trade_date: string;
  trade_time: string;
  coin: string;
  custom_coin?: string | null;
  exchange: string;
  trading_type: string;
  direction: TradingPlan["direction"];
  timeframe: string;
  reason: string;
  additional_notes?: string | null;
  market_trend: string;
  market_structure: string;
  volume: string;
  liquidity: string;
  bias: string;
  confluences: string[] | null;
  entry_price: number | string | null;
  stop_loss: number | string | null;
  take_profit_1: number | string | null;
  take_profit_2: number | string | null;
  take_profit_3: number | string | null;
  invalidation: number | string | null;
  expected_win_rate: number | string | null;
  confidence: number | string | null;
  risk_reward: number | string | null;
  capital: number | string | null;
  risk_percent: number | string | null;
  risk_amount: number | string | null;
  position_size: number | string | null;
  leverage: number | string | null;
  margin_used: number | string | null;
  potential_profit: number | string | null;
  potential_loss: number | string | null;
  break_even_price: number | string | null;
  liquidation_price: number | string | null;
  emotion: string;
  psychology_checklist: string[] | null;
  news?: string | null;
  news_impact: string;
  trade_checklist: string[] | null;
  ai_summary: string;
  trade_status: TradingPlan["tradeStatus"];
  trade_result: TradingPlan["tradeResult"];
  pnl: number | string | null;
  profit_percent: number | string | null;
  loss_percent: number | string | null;
  lessons_learned?: string | null;
  mistakes?: string | null;
  before_screenshot?: string | null;
  after_screenshot?: string | null;
  tags: string[] | null;
  notes?: string | null;
};

const toNumber = (value: unknown) => {
  if (value == null || value === "") return 0;
  const parsed = typeof value === "number" ? value : Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const toArray = (value: unknown) => (Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : []);

const mapTradingPlanRow = (row: TradingPlanRow): TradingPlan => ({
  id: row.id,
  userId: row.user_id,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
  tradeDate: row.trade_date,
  tradeTime: row.trade_time,
  coin: row.coin,
  customCoin: row.custom_coin ?? null,
  exchange: row.exchange,
  tradingType: row.trading_type,
  direction: row.direction,
  timeframe: row.timeframe,
  reason: row.reason,
  additionalNotes: row.additional_notes ?? null,
  marketTrend: row.market_trend,
  marketStructure: row.market_structure,
  volume: row.volume,
  liquidity: row.liquidity,
  bias: row.bias,
  confluences: toArray(row.confluences),
  entryPrice: toNumber(row.entry_price),
  stopLoss: toNumber(row.stop_loss),
  takeProfit1: toNumber(row.take_profit_1),
  takeProfit2: toNumber(row.take_profit_2),
  takeProfit3: toNumber(row.take_profit_3),
  invalidation: toNumber(row.invalidation),
  expectedWinRate: toNumber(row.expected_win_rate),
  confidence: toNumber(row.confidence),
  riskReward: toNumber(row.risk_reward),
  capital: toNumber(row.capital),
  riskPercent: toNumber(row.risk_percent),
  riskAmount: toNumber(row.risk_amount),
  positionSize: toNumber(row.position_size),
  leverage: toNumber(row.leverage),
  marginUsed: toNumber(row.margin_used),
  potentialProfit: toNumber(row.potential_profit),
  potentialLoss: toNumber(row.potential_loss),
  breakEvenPrice: toNumber(row.break_even_price),
  liquidationPrice: toNumber(row.liquidation_price),
  emotion: row.emotion,
  psychologyChecklist: toArray(row.psychology_checklist),
  news: row.news ?? null,
  newsImpact: row.news_impact,
  tradeChecklist: toArray(row.trade_checklist),
  aiSummary: row.ai_summary,
  tradeStatus: row.trade_status,
  tradeResult: row.trade_result,
  pnl: toNumber(row.pnl),
  profitPercent: toNumber(row.profit_percent),
  lossPercent: toNumber(row.loss_percent),
  lessonsLearned: row.lessons_learned ?? null,
  mistakes: row.mistakes ?? null,
  beforeScreenshot: row.before_screenshot ?? null,
  afterScreenshot: row.after_screenshot ?? null,
  tags: toArray(row.tags),
  notes: row.notes ?? null,
});

const buildTradingPlanPayload = (userId: string, plan: TradingPlanInput) => ({
  user_id: userId,
  trade_date: plan.tradeDate,
  trade_time: plan.tradeTime,
  coin: plan.coin,
  custom_coin: plan.customCoin || null,
  exchange: plan.exchange,
  trading_type: plan.tradingType,
  direction: plan.direction,
  timeframe: plan.timeframe,
  reason: plan.reason,
  additional_notes: plan.additionalNotes || null,
  market_trend: plan.marketTrend,
  market_structure: plan.marketStructure,
  volume: plan.volume,
  liquidity: plan.liquidity,
  bias: plan.bias,
  confluences: plan.confluences,
  entry_price: plan.entryPrice,
  stop_loss: plan.stopLoss,
  take_profit_1: plan.takeProfit1,
  take_profit_2: plan.takeProfit2,
  take_profit_3: plan.takeProfit3,
  invalidation: plan.invalidation,
  expected_win_rate: plan.expectedWinRate,
  confidence: plan.confidence,
  risk_reward: plan.riskReward,
  capital: plan.capital,
  risk_percent: plan.riskPercent,
  risk_amount: plan.riskAmount,
  position_size: plan.positionSize,
  leverage: plan.leverage,
  margin_used: plan.marginUsed,
  potential_profit: plan.potentialProfit,
  potential_loss: plan.potentialLoss,
  break_even_price: plan.breakEvenPrice,
  liquidation_price: plan.liquidationPrice,
  emotion: plan.emotion,
  psychology_checklist: plan.psychologyChecklist,
  news: plan.news || null,
  news_impact: plan.newsImpact,
  trade_checklist: plan.tradeChecklist,
  ai_summary: plan.aiSummary,
  trade_status: plan.tradeStatus,
  trade_result: plan.tradeResult,
  pnl: plan.pnl,
  profit_percent: plan.profitPercent,
  loss_percent: plan.lossPercent,
  lessons_learned: plan.lessonsLearned || null,
  mistakes: plan.mistakes || null,
  before_screenshot: plan.beforeScreenshot || null,
  after_screenshot: plan.afterScreenshot || null,
  tags: plan.tags,
  notes: plan.notes || null,
  updated_at: new Date().toISOString(),
});

const isMissingTableError = (error: unknown) => {
  const code =
    typeof error === "object" && error !== null && "code" in error
      ? String((error as { code?: unknown }).code)
      : "";
  const message =
    typeof error === "object" && error !== null && "message" in error
      ? String((error as { message?: unknown }).message).toLowerCase()
      : "";

  return code === "PGRST205" || code === "42P01" || message.includes("trading_plans");
};

const throwSchemaAwareError = (error: unknown): never => {
  if (isMissingTableError(error)) {
    throw new Error(TRADING_PLANS_SCHEMA_WARNING);
  }

  throw error;
};

export async function getTradingPlansByUserId(userId: string): Promise<TradingPlan[]> {
  const { data, error } = await supabase
    .from("trading_plans")
    .select("*")
    .eq("user_id", userId)
    .order("trade_date", { ascending: false })
    .order("trade_time", { ascending: false });

  if (error) throwSchemaAwareError(error);

  return (data || []).map((row) => mapTradingPlanRow(row as TradingPlanRow));
}

export async function createTradingPlan(userId: string, plan: TradingPlanInput): Promise<TradingPlan> {
  const { data, error } = await supabase
    .from("trading_plans")
    .insert(buildTradingPlanPayload(userId, plan))
    .select()
    .single();

  if (error) throwSchemaAwareError(error);

  return mapTradingPlanRow(data as TradingPlanRow);
}

export async function updateTradingPlan(id: string, userId: string, plan: TradingPlanInput): Promise<TradingPlan> {
  const { data, error } = await supabase
    .from("trading_plans")
    .update(buildTradingPlanPayload(userId, plan))
    .eq("id", id)
    .eq("user_id", userId)
    .select()
    .single();

  if (error) throwSchemaAwareError(error);

  return mapTradingPlanRow(data as TradingPlanRow);
}

export async function deleteTradingPlan(id: string, userId: string) {
  const { error } = await supabase
    .from("trading_plans")
    .delete()
    .eq("id", id)
    .eq("user_id", userId);

  if (error) throwSchemaAwareError(error);
}
