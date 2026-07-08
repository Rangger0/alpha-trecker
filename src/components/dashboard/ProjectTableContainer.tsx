import { useMemo, useState } from "react";
import { Search as SearchIcon } from "lucide-react";
import { useWindowSize } from "@/hooks/use-mobile";
import { ProjectFilterBar, type FilterState } from "./ProjectFilterBar";
import { DesktopProjectTable } from "./DesktopProjectTable";
import { MobileProjectCards } from "./MobileProjectCards";
import { Button } from "@/components/ui/button";
import type { Airdrop } from "@/types";

interface ProjectTableContainerProps {
  airdrops: Airdrop[];
  isDark: boolean;
  logoError: Record<string, boolean>;
  setLogoError: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  onEdit: (airdrop: Airdrop) => void;
  onDelete: (airdrop: Airdrop) => void;
  onPriority: (airdrop: Airdrop) => void;
  onAddNew: () => void;
}

export function ProjectTableContainer({
  airdrops,
  isDark,
  logoError,
  setLogoError,
  onEdit,
  onDelete,
  onPriority,
  onAddNew,
}: ProjectTableContainerProps) {
  const { width } = useWindowSize();
  const isMobile = width !== null && width < 768;

  const [filters, setFilters] = useState<FilterState>({
    search: '',
    category: 'all',
    status: 'all',
    potential: 'all',
    funding: 'all',
    sort: 'newest',
  });

  const filteredAirdrops = useMemo(() => {
    let result = [...airdrops];

    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        (a) =>
          a.projectName.toLowerCase().includes(q) ||
          (a.twitterUsername || '').toLowerCase().includes(q) ||
          (a.walletAddress || '').toLowerCase().includes(q) ||
          (a.email || '').toLowerCase().includes(q) ||
          (a.funding || '').toLowerCase().includes(q) ||
          (a.potential || '').toLowerCase().includes(q) ||
          (a.projectCategory || '').toLowerCase().includes(q) ||
          (a.farmingStrategy || '').toLowerCase().includes(q)
      );
    }

    if (filters.category !== 'all') {
      result = result.filter(
        (a) => (a.projectCategory ?? 'Other') === filters.category
      );
    }

    if (filters.status !== 'all') {
      result = result.filter((a) => {
        if (filters.status === 'active') return a.status === 'Ongoing';
        if (filters.status === 'planning') return a.status === 'Planning';
        if (filters.status === 'ended') return a.status === 'Done' || a.status === 'Dropped';
        return !a.status;
      });
    }

    if (filters.potential !== 'all') {
      result = result.filter((a) => {
        if (filters.potential === 'empty') return !a.potential;
        return a.potential === filters.potential;
      });
    }

    if (filters.funding !== 'all') {
      result = result.filter((a) => {
        const hasFunding = Boolean(a.funding?.trim());
        return filters.funding === 'with' ? hasFunding : !hasFunding;
      });
    }

    const potentialRank = { High: 3, Medium: 2, Low: 1 } as const;
    const statusRank = { Ongoing: 4, Planning: 3, Done: 2, Dropped: 1 } as const;
    const parseFundingAmount = (value?: string) => {
      if (!value?.trim()) return 0;
      const normalized = value.trim().toLowerCase().replace(/,/g, '');
      const amount = Number.parseFloat(normalized.replace(/[^0-9.]/g, ''));
      if (!Number.isFinite(amount)) return 0;
      if (normalized.includes('b')) return amount * 1_000_000_000;
      if (normalized.includes('m')) return amount * 1_000_000;
      if (normalized.includes('k')) return amount * 1_000;
      return amount;
    };

    result.sort((a, b) => {
      if (filters.sort === 'name') {
        return a.projectName.localeCompare(b.projectName);
      }
      if (filters.sort === 'funding') {
        return parseFundingAmount(b.funding) - parseFundingAmount(a.funding);
      }
      if (filters.sort === 'potential') {
        return (potentialRank[b.potential as keyof typeof potentialRank] ?? 0) - (potentialRank[a.potential as keyof typeof potentialRank] ?? 0);
      }
      if (filters.sort === 'status') {
        return (statusRank[b.status as keyof typeof statusRank] ?? 0) - (statusRank[a.status as keyof typeof statusRank] ?? 0);
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    return result;
  }, [airdrops, filters]);

  return (
    <div className="mx-auto w-full max-w-[calc(100vw-32px)] space-y-5 md:max-w-[calc(100vw-48px)] xl:max-w-[1500px] min-[1600px]:max-w-[1800px] min-[1920px]:max-w-[calc(100vw-48px)]">
      <ProjectFilterBar
        filters={filters}
        onFiltersChange={setFilters}
        resultCount={filteredAirdrops.length}
        totalCount={airdrops.length}
        isDark={isDark}
      />

      {filteredAirdrops.length === 0 ? (
        <div className="macos-card rounded-[1.1rem] p-12 text-center anim-fade shadow-none">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full border border-alpha-border opacity-50">
            <SearchIcon className="h-10 w-10 alpha-text-muted" />
          </div>
          <h3 className="mb-2 font-mono text-xl font-bold alpha-text">
            {isDark ? '> NO_DATA_FOUND' : 'No projects found'}
          </h3>
          <p className="mb-6 font-mono text-sm alpha-text-muted">
            {isDark
              ? 'Initialize new project tracking...'
              : 'Try adjusting your filters'}
          </p>
          <Button
            onClick={onAddNew}
            className="font-mono macos-btn macos-btn--primary text-[color:var(--alpha-accent-contrast)]"
          >
            {isDark ? 'INIT_PROJECT()' : 'Add Your First Project'}
          </Button>
        </div>
      ) : isMobile ? (
        <MobileProjectCards
          airdrops={filteredAirdrops}
          isDark={isDark}
          logoError={logoError}
          setLogoError={setLogoError}
          onEdit={onEdit}
          onDelete={onDelete}
          onPriority={onPriority}
        />
      ) : (
        <DesktopProjectTable
          airdrops={filteredAirdrops}
          logoError={logoError}
          setLogoError={setLogoError}
          onEdit={onEdit}
          onDelete={onDelete}
          onPriority={onPriority}
        />
      )}
    </div>
  );
}
