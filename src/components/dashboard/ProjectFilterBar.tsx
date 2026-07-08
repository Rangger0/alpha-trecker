import { useMemo, type ChangeEvent } from "react";
import { Search, Filter, RotateCcw } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import type { ProjectCategory } from "@/types";
import { PROJECT_CATEGORIES } from "@/types";

export type StatusFilter = "all" | "active" | "planning" | "ended" | "unknown";
export type PotentialFilter = "all" | "High" | "Medium" | "Low" | "empty";
export type FundingFilter = "all" | "with" | "without";
export type SortFilter = "newest" | "name" | "funding" | "potential" | "status";

export interface FilterState {
  search: string;
  category: ProjectCategory | "all";
  status: StatusFilter;
  potential: PotentialFilter;
  funding: FundingFilter;
  sort: SortFilter;
}

interface ProjectFilterBarProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  resultCount: number;
  totalCount: number;
  isDark: boolean;
}

const defaultFilters: FilterState = {
  search: "",
  category: "all",
  status: "all",
  potential: "all",
  funding: "all",
  sort: "newest",
};

function FilterSelect({
  value,
  onValueChange,
  placeholder,
  children,
}: {
  value: string;
  onValueChange: (value: string) => void;
  placeholder: string;
  children: React.ReactNode;
}) {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className="h-10 min-w-[132px] flex-1 rounded-lg border-alpha-border bg-[color:var(--alpha-surface)] px-3 text-[13px] font-medium alpha-text shadow-none transition-colors duration-150 hover:border-[color:var(--alpha-border-strong)] focus:ring-0 sm:flex-none">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent className="macos-popover border-alpha-border">
        {children}
      </SelectContent>
    </Select>
  );
}

export function ProjectFilterBar({
  filters,
  onFiltersChange,
  resultCount,
  totalCount,
}: ProjectFilterBarProps) {
  const hasActiveFilters = useMemo(
    () =>
      filters.search !== defaultFilters.search ||
      filters.category !== defaultFilters.category ||
      filters.status !== defaultFilters.status ||
      filters.potential !== defaultFilters.potential ||
      filters.funding !== defaultFilters.funding ||
      filters.sort !== defaultFilters.sort,
    [filters]
  );

  const handleReset = () => {
    onFiltersChange(defaultFilters);
  };

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    onFiltersChange({ ...filters, search: e.target.value });
  };

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 px-1">
        <div className="inline-flex items-center gap-2 rounded-full border border-alpha-border bg-[color:var(--alpha-hover-soft)] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] alpha-text-muted">
          <Filter className="h-3.5 w-3.5 text-[color:var(--alpha-highlight)]" />
          Project finder
        </div>
        <span className="rounded-full border border-alpha-border bg-[color:var(--alpha-hover-soft)] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] alpha-text-muted">
          {resultCount} of {totalCount}
        </span>
      </div>

      <div className="rounded-xl border border-alpha-border bg-[color:var(--alpha-panel)] p-4 shadow-[0_8px_24px_rgba(0,0,0,0.12)]">
        <div className="flex flex-col gap-3 xl:flex-row xl:items-center">
          <label className="flex h-10 min-w-0 flex-1 items-center gap-3 rounded-lg border border-alpha-border bg-[color:var(--alpha-surface)] px-3 transition-colors duration-150 focus-within:border-[color:var(--alpha-highlight-border)]">
            <Search className="h-4 w-4 shrink-0 alpha-text-muted" />
            <Input
              placeholder="Search projects, wallet, email..."
              value={filters.search}
              onChange={handleSearchChange}
              className="h-auto border-0 bg-transparent p-0 text-[13px] font-medium shadow-none alpha-text placeholder:text-[color:var(--alpha-text-muted)] focus-visible:ring-0"
            />
          </label>

          <div className="flex flex-wrap items-center gap-2">
            <FilterSelect
              value={filters.category}
              placeholder="Category"
              onValueChange={(value) =>
                onFiltersChange({
                  ...filters,
                  category: value as ProjectCategory | "all",
                })
              }
            >
              <SelectItem value="all">All Categories</SelectItem>
              {PROJECT_CATEGORIES.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </FilterSelect>

            <FilterSelect
              value={filters.status}
              placeholder="Status"
              onValueChange={(value) =>
                onFiltersChange({ ...filters, status: value as StatusFilter })
              }
            >
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="planning">Planning</SelectItem>
              <SelectItem value="ended">Ended</SelectItem>
              <SelectItem value="unknown">Unknown</SelectItem>
            </FilterSelect>

            <FilterSelect
              value={filters.potential}
              placeholder="Potential"
              onValueChange={(value) =>
                onFiltersChange({ ...filters, potential: value as PotentialFilter })
              }
            >
              <SelectItem value="all">All Potential</SelectItem>
              <SelectItem value="High">S Tier</SelectItem>
              <SelectItem value="Medium">A Tier</SelectItem>
              <SelectItem value="Low">B Tier</SelectItem>
              <SelectItem value="empty">C Tier</SelectItem>
            </FilterSelect>

            <FilterSelect
              value={filters.funding}
              placeholder="Funding"
              onValueChange={(value) =>
                onFiltersChange({ ...filters, funding: value as FundingFilter })
              }
            >
              <SelectItem value="all">All Funding</SelectItem>
              <SelectItem value="with">With Funding</SelectItem>
              <SelectItem value="without">No Funding</SelectItem>
            </FilterSelect>

            <FilterSelect
              value={filters.sort}
              placeholder="Sort"
              onValueChange={(value) =>
                onFiltersChange({ ...filters, sort: value as SortFilter })
              }
            >
              <SelectItem value="newest">Sort Newest</SelectItem>
              <SelectItem value="name">Sort Name</SelectItem>
              <SelectItem value="funding">Sort Funding</SelectItem>
              <SelectItem value="potential">Sort Potential</SelectItem>
              <SelectItem value="status">Sort Status</SelectItem>
            </FilterSelect>

            <Button
              type="button"
              variant="ghost"
              onClick={handleReset}
              disabled={!hasActiveFilters}
              className="h-10 rounded-lg border border-alpha-border bg-[color:var(--alpha-surface)] px-3 text-[13px] font-semibold alpha-text-muted transition-colors duration-150 hover:bg-[color:var(--alpha-hover-soft)] hover:alpha-text disabled:cursor-not-allowed disabled:opacity-45"
            >
              <RotateCcw className="mr-2 h-3.5 w-3.5" />
              Reset Filter
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
