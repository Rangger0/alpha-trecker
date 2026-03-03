// src/hooks/use-usage-limits.ts
import { useMemo } from "react";
import { useAirdrops } from "@/hooks/use-airdrops";

interface UsageLimit {
  used: number;
  limit: number;
}

interface UsageLimits {
  documents: UsageLimit;
  ecosystem: UsageLimit;
  priorities: UsageLimit;
  reminderDaily: UsageLimit;
  reminderOnce: UsageLimit;
  notesPerDoc: UsageLimit;
  tasksPerDoc: UsageLimit;
  multipleAccounts: UsageLimit;
  retroactive: UsageLimit;
}

export function useUsageLimits() {
  const { airdrops } = useAirdrops();

  const limits: UsageLimits = useMemo(() => {
    const totalProjects = airdrops.length;

    const prioritiesUsed = airdrops.filter(
      (a) => a.isPriority === true
    ).length;

    return {
      documents: { used: totalProjects, limit: 200 },
      ecosystem: { used: totalProjects, limit: 20 },
      priorities: { used: prioritiesUsed, limit: 15 },
      reminderDaily: { used: 0, limit: 4 },
      reminderOnce: { used: 0, limit: 3 },
      notesPerDoc: { used: 0, limit: 4 },
      tasksPerDoc: { used: 0, limit: 5 },
      multipleAccounts: { used: 0, limit: 5 },
      retroactive: { used: 0, limit: 2 },
    };
  }, [airdrops]);

  return { limits, loading: false };
}