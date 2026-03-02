// src/hooks/use-usage-limits.ts
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

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

const DEFAULT_LIMITS: UsageLimits = {
  documents: { used: 27, limit: 200 },
  ecosystem: { used: 10, limit: 20 },
  priorities: { used: 3, limit: 15 },
  reminderDaily: { used: 0, limit: 4 },
  reminderOnce: { used: 0, limit: 3 },
  notesPerDoc: { used: 0, limit: 4 },
  tasksPerDoc: { used: 0, limit: 5 },
  multipleAccounts: { used: 0, limit: 5 },
  retroactive: { used: 0, limit: 2 },
};

export function useUsageLimits() {
  const { session } = useAuth();
  const [limits] = useState<UsageLimits>(DEFAULT_LIMITS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In real app, fetch from API
    // For now, use mock data
    setLoading(false);
  }, [session]);

  return { limits, loading };
}