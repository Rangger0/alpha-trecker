import { memo, useState, type MouseEvent } from "react";
import {
  Edit2,
  Trash2,
  ExternalLink,
  Wallet,
  Mail,
  Star,
  ChevronDown,
  Eye,
  Layers3,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Airdrop } from "@/types";
import { cn } from "@/lib/utils";
import { getXProfileUrl } from "@/lib/project-classification";

interface MobileProjectCardProps {
  airdrops: Airdrop[];
  isDark: boolean;
  logoError: Record<string, boolean>;
  setLogoError: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  onEdit: (airdrop: Airdrop) => void;
  onDelete: (airdrop: Airdrop) => void;
  onPriority: (airdrop: Airdrop) => void;
}

type Tone = { name: string; bg: string; text: string; border: string; color: string; background: string; borderColor: string };

const TONES = {
  green: {
    name: "green",
    bg: "bg-[color:var(--alpha-success-soft)]",
    text: "text-[color:var(--alpha-success)]",
    border: "border-[color:var(--alpha-success-border)]",
    color: "var(--alpha-success)", background: "var(--alpha-success-soft)", borderColor: "var(--alpha-success-border)",
  },
  yellow: {
    name: "yellow",
    bg: "bg-[color:var(--alpha-warning-soft)]",
    text: "text-[color:var(--alpha-warning)]",
    border: "border-[color:var(--alpha-warning-border)]",
    color: "var(--alpha-warning)", background: "var(--alpha-warning-soft)", borderColor: "var(--alpha-warning-border)",
  },
  red: {
    name: "red",
    bg: "bg-[color:var(--alpha-danger-soft)]",
    text: "text-[color:var(--alpha-danger)]",
    border: "border-[color:var(--alpha-danger-border)]",
    color: "var(--alpha-danger)", background: "var(--alpha-danger-soft)", borderColor: "var(--alpha-danger-border)",
  },
  gray: {
    name: "gray",
    bg: "bg-[color:var(--alpha-hover-soft)]",
    text: "text-[color:var(--alpha-text-muted)]",
    border: "border-[color:var(--alpha-border-strong)]",
    color: "var(--alpha-text-muted)", background: "var(--alpha-hover-soft)", borderColor: "var(--alpha-border-strong)",
  },
  orange: {
    name: "orange",
    bg: "bg-[color:var(--alpha-highlight-soft)]",
    text: "text-[color:var(--alpha-highlight)]",
    border: "border-[color:var(--alpha-highlight-border)]",
    color: "var(--alpha-highlight)", background: "var(--alpha-highlight-soft)", borderColor: "var(--alpha-highlight-border)",
  },
  teal: {
    name: "teal",
    bg: "bg-[color:var(--alpha-info-soft)]",
    text: "text-[color:var(--alpha-info)]",
    border: "border-[color:var(--alpha-info-border)]",
    color: "var(--alpha-info)", background: "var(--alpha-info-soft)", borderColor: "var(--alpha-info-border)",
  },
} satisfies Record<string, Tone>;

const twitterAvatarUrl = (username: string) =>
  `https://unavatar.io/twitter/${username.replace("@", "")}`;

const formatWallet = (address: string) => {
  if (!address) return "";
  if (address.length <= 14) return address;
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

const formatProjectDateTime = (value?: string) => {
  if (!value) return "--";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;

  return parsed.toLocaleString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const statusMeta = (status?: string) => {
  if (status === "Ongoing") return { label: "Active", tone: TONES.green };
  if (status === "Planning") return { label: "Planning", tone: TONES.yellow };
  if (status === "Done" || status === "Dropped") return { label: "Ended", tone: TONES.red };
  return { label: "Unknown", tone: TONES.gray };
};

const potentialMeta = (potential?: string) => {
  if (potential === "High") return { label: "S Tier", tone: TONES.orange };
  if (potential === "Medium") return { label: "A Tier", tone: TONES.teal };
  if (potential === "Low") return { label: "B Tier", tone: TONES.yellow };
  return { label: "C Tier", tone: TONES.gray };
};

const priorityMeta = (priority?: string) => {
  if (priority === "High") return { label: "High", tone: TONES.red };
  if (priority === "Medium") return { label: "Medium", tone: TONES.yellow };
  if (priority === "Low") return { label: "Low", tone: TONES.teal };
  return { label: "Unset", tone: TONES.gray };
};

const badgeClass = (tone: Tone) =>
  cn(
    `project-badge project-badge-${tone.name} inline-flex h-6 items-center rounded-full border px-2.5 text-[11px] font-semibold leading-none`,
    tone.bg,
    tone.text,
    tone.border
  );

const badgeStyle = (tone: Tone) => ({
  color: tone.color,
  backgroundColor: tone.background,
  borderColor: tone.borderColor,
});

function ProjectCardAvatar({
  airdrop,
  logoError,
  setLogoError,
}: {
  airdrop: Airdrop;
  logoError: Record<string, boolean>;
  setLogoError: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
}) {
  const [twitterError, setTwitterError] = useState(false);
  const hasLogoError = (logoError && logoError[airdrop.id]) || !airdrop.projectLogo;
  const twitterUser = airdrop.twitterUsername?.replace("@", "");
  const showTwitter = hasLogoError && twitterUser && !twitterError;

  return (
    <div
      className="flex h-12 w-12 flex-shrink-0 items-center justify-center overflow-hidden rounded-xl border border-alpha-border bg-[color:var(--alpha-surface)]"
      aria-hidden="true"
    >
      {!hasLogoError ? (
        <img
          src={airdrop.projectLogo}
          alt=""
          className="h-full w-full object-cover"
          onError={() =>
            setLogoError((prev) => ({ ...prev, [airdrop.id]: true }))
          }
        />
      ) : showTwitter ? (
        <img
          src={twitterAvatarUrl(twitterUser)}
          alt=""
          className="h-full w-full object-cover"
          onError={() => setTwitterError(true)}
        />
      ) : (
        <span className="text-lg font-semibold alpha-text">
          {airdrop.projectName[0]?.toUpperCase()}
        </span>
      )}
    </div>
  );
}

function IconAction({
  label,
  onClick,
  disabled,
  danger,
  active,
  children,
}: {
  label: string;
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  danger?: boolean;
  active?: boolean;
  children: React.ReactNode;
}) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      disabled={disabled}
      aria-label={label}
      title={label}
      onClick={onClick}
      className={cn(
        "h-9 w-9 rounded-lg border border-alpha-border bg-[color:var(--alpha-surface)] alpha-text-muted transition-all duration-150 hover:-translate-y-px hover:bg-[color:var(--alpha-hover-soft)] hover:text-[color:var(--alpha-text)] disabled:opacity-40",
        danger && "hover:border-[color:var(--alpha-danger-border)] hover:bg-[color:var(--alpha-danger-soft)] hover:text-[color:var(--alpha-danger)]",
        active && "border-[color:var(--alpha-highlight-border)] bg-[color:var(--alpha-highlight-soft)] text-[color:var(--alpha-highlight)]"
      )}
    >
      {children}
    </Button>
  );
}

function MetaRow({
  label,
  value,
  icon,
  title,
}: {
  label: string;
  value: React.ReactNode;
  icon?: React.ReactNode;
  title?: string;
}) {
  return (
    <div className="min-w-0 rounded-lg border border-alpha-border bg-[color:var(--alpha-hover-soft)] px-3 py-2">
      <div className="mb-1 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] alpha-text-muted">
        {icon}
        {label}
      </div>
      <div className="truncate text-[13px] font-semibold alpha-text" title={title}>
        {value}
      </div>
    </div>
  );
}

interface ProjectMobileCardProps {
  airdrop: Airdrop;
  index: number;
  logoError: Record<string, boolean>;
  setLogoError: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  onEdit: (airdrop: Airdrop) => void;
  onDelete: (airdrop: Airdrop) => void;
  onPriority: (airdrop: Airdrop) => void;
}

const ProjectMobileCard = memo(function ProjectMobileCard({
  airdrop,
  index,
  logoError,
  setLogoError,
  onEdit,
  onDelete,
  onPriority,
}: ProjectMobileCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const isPriority = Boolean(airdrop.isPriority || airdrop.is_priority);
  const status = statusMeta(airdrop.status);
  const potential = potentialMeta(airdrop.potential);
  const priority = priorityMeta(airdrop.priority);
  const officialLink = airdrop.platformLink?.trim();
  const xLink = getXProfileUrl(airdrop.twitterUsername);
  const wallet = airdrop.walletAddress?.trim();
  const email = airdrop.email?.trim();

  return (
    <article
      className="overflow-hidden rounded-xl border border-alpha-border bg-[color:var(--alpha-panel)] shadow-[0_8px_24px_rgba(0,0,0,0.14)] transition-[border-color,transform,background] duration-200 hover:-translate-y-0.5 hover:border-[color:var(--alpha-border-strong)]"
      style={{ animationDelay: `${Math.min(index, 6) * 24}ms` }}
    >
      <div className="space-y-4 p-4">
        <div className="flex items-start gap-3">
          <ProjectCardAvatar
            airdrop={airdrop}
            logoError={logoError}
            setLogoError={setLogoError}
          />
          <div className="min-w-0 flex-1">
            <div className="flex min-w-0 items-center gap-2">
              <h3 className="truncate text-[15px] font-semibold leading-5 alpha-text" title={airdrop.projectName}>
                {airdrop.projectName}
              </h3>
              {isPriority && (
                <Star className="h-3.5 w-3.5 flex-shrink-0" style={{ color: 'var(--alpha-highlight)', fill: 'var(--alpha-highlight)' }} />
              )}
            </div>
            <p className="mt-0.5 truncate text-[12px] alpha-text-muted" title={airdrop.twitterUsername || undefined}>
              {airdrop.twitterUsername ? `@${airdrop.twitterUsername.replace("@", "")}` : airdrop.projectCategory ?? "Other"}
            </p>
            <p className="mt-1 truncate text-[10px] alpha-text-muted" title="Tanggal dan waktu dibuat">
              {formatProjectDateTime(airdrop.createdAt)}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <span className={badgeClass(status.tone)} style={badgeStyle(status.tone)} title={airdrop.status}>
            {status.label}
          </span>
          <span className={badgeClass(potential.tone)} style={badgeStyle(potential.tone)} title={airdrop.potential ?? "No potential set"}>
            {potential.label}
          </span>
          <span className={badgeClass(priority.tone)} style={badgeStyle(priority.tone)} title={airdrop.priority ?? "No priority set"}>
            {priority.label}
          </span>
          <Badge
            variant="outline"
            className="h-6 max-w-full truncate border-alpha-border bg-[color:var(--alpha-hover-soft)] text-[11px] font-semibold text-[color:var(--alpha-text-muted)]"
          >
            {airdrop.projectCategory ?? "Other"}
          </Badge>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <MetaRow label="Funding" value={airdrop.funding?.trim() || "--"} title={airdrop.funding || undefined} />
          <MetaRow
            label="Wallet"
            value={wallet ? formatWallet(wallet) : "--"}
            title={wallet || undefined}
            icon={<Wallet className="h-3 w-3" />}
          />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap gap-1.5">
            <IconAction label="View" onClick={() => onEdit(airdrop)}>
              <Eye className="h-3.5 w-3.5" />
            </IconAction>
            <IconAction
              label={isPriority ? "Remove from priority" : "Add to priority"}
              active={isPriority}
              onClick={(event) => {
                event.stopPropagation();
                onPriority(airdrop);
              }}
            >
              <Star className="h-3.5 w-3.5" style={isPriority ? { color: 'var(--alpha-highlight)', fill: 'var(--alpha-highlight)' } : undefined} />
            </IconAction>
            <IconAction label="Edit" onClick={() => onEdit(airdrop)}>
              <Edit2 className="h-3.5 w-3.5" />
            </IconAction>
            <IconAction label="Delete" danger onClick={() => onDelete(airdrop)}>
              <Trash2 className="h-3.5 w-3.5" />
            </IconAction>
            <IconAction
              label="Open X profile"
              disabled={!xLink}
              onClick={() => {
                if (xLink) window.open(xLink, "_blank", "noopener,noreferrer");
              }}
            >
              <span className="text-[13px] font-semibold leading-none" aria-hidden="true">𝕏</span>
            </IconAction>
            <IconAction
              label="Open Link"
              disabled={!officialLink}
              onClick={() => {
                if (officialLink) window.open(officialLink, "_blank", "noopener,noreferrer");
              }}
            >
              <ExternalLink className="h-3.5 w-3.5" />
            </IconAction>
          </div>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded((value) => !value)}
            aria-expanded={isExpanded}
            className="h-9 rounded-lg border border-alpha-border bg-[color:var(--alpha-surface)] px-3 text-[12px] font-semibold alpha-text-muted hover:bg-[color:var(--alpha-hover-soft)] hover:alpha-text"
          >
            More
            <ChevronDown
              className={cn(
                "ml-1.5 h-3.5 w-3.5 transition-transform duration-200",
                isExpanded && "rotate-180"
              )}
            />
          </Button>
        </div>
      </div>

      <div
        className="overflow-hidden border-t border-alpha-border transition-[max-height,opacity] duration-200"
        style={{ maxHeight: isExpanded ? 420 : 0, opacity: isExpanded ? 1 : 0 }}
      >
        <div className="grid gap-2 p-4 pt-3">
          <MetaRow
            label="Email"
            value={email || "--"}
            title={email || undefined}
            icon={<Mail className="h-3 w-3" />}
          />
          <MetaRow
            label="Strategy"
            value={airdrop.farmingStrategy ?? "Unknown"}
            title={airdrop.farmingStrategy ?? "Unknown"}
            icon={<Layers3 className="h-3 w-3" />}
          />
          <MetaRow
            label="Waitlist"
            value={airdrop.waitlistCount != null ? airdrop.waitlistCount : "--"}
          />
          <MetaRow
            label="Metadata"
            value={airdrop.deadline ? `Due ${airdrop.deadline}` : airdrop.airdropConfirmed ? "Airdrop confirmed" : "No extra metadata"}
            title={airdrop.notes || undefined}
          />
        </div>
      </div>
    </article>
  );
});

export function MobileProjectCards({
  airdrops,
  logoError,
  setLogoError,
  onEdit,
  onDelete,
  onPriority,
}: MobileProjectCardProps) {
  return (
    <div className="space-y-3 md:hidden">
      {airdrops.map((airdrop, index) => (
        <ProjectMobileCard
          key={airdrop.id}
          airdrop={airdrop}
          index={index}
          logoError={logoError}
          setLogoError={setLogoError}
          onEdit={onEdit}
          onDelete={onDelete}
          onPriority={onPriority}
        />
      ))}
    </div>
  );
}
