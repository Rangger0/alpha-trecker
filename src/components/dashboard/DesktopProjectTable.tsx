import { memo, useState, type MouseEvent } from "react";
import {
  Edit2,
  Trash2,
  ExternalLink,
  Wallet,
  Star,
  Eye,
  Mail,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Airdrop } from "@/types";
import { cn } from "@/lib/utils";
import { getXProfileUrl } from "@/lib/project-classification";
import { getEcosystemById } from "@/lib/ecosystems";

interface DesktopProjectTableProps {
  airdrops: Airdrop[];
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

const formatProjectDate = (value?: string) => {
  if (!value) return "--";

  const normalized = /^\d{4}-\d{2}-\d{2}$/.test(value)
    ? `${value}T00:00:00`
    : value;
  const parsed = new Date(normalized);

  if (Number.isNaN(parsed.getTime())) return value;

  return parsed.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
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
    `project-badge project-badge-${tone.name} inline-flex h-6 max-w-full items-center rounded-full border px-2.5 text-[11px] font-semibold leading-none`,
    tone.bg,
    tone.text,
    tone.border
  );

const badgeStyle = (tone: Tone) => ({
  color: tone.color,
  backgroundColor: tone.background,
  borderColor: tone.borderColor,
});

function ProjectAvatar({
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
      className="flex h-8 w-8 flex-shrink-0 items-center justify-center overflow-hidden rounded-lg border border-alpha-border bg-[color:var(--alpha-surface)]"
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
        <span className="text-[13px] font-semibold alpha-text">
          {airdrop.projectName[0]?.toUpperCase()}
        </span>
      )}
    </div>
  );
}

function ActionButton({
  label,
  onClick,
  disabled,
  children,
  danger,
  active,
}: {
  label: string;
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  children: React.ReactNode;
  danger?: boolean;
  active?: boolean;
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
        "alpha-action-button h-8 w-8 rounded-lg border border-alpha-border bg-[color:var(--alpha-surface)] text-[color:var(--alpha-text)] shadow-none transition-[background,border-color,color,transform] duration-150 hover:-translate-y-px hover:bg-[color:var(--alpha-hover-soft)] hover:text-[color:var(--alpha-text)] disabled:cursor-not-allowed disabled:opacity-40",
        danger && "hover:border-[color:var(--alpha-danger-border)] hover:bg-[color:var(--alpha-danger-soft)] hover:text-[color:var(--alpha-danger)]",
        active && "border-[color:var(--alpha-highlight-border)] bg-[color:var(--alpha-highlight-soft)] text-[color:var(--alpha-highlight)]"
      )}
    >
      {children}
    </Button>
  );
}

export function DesktopProjectTable({
  airdrops,
  logoError,
  setLogoError,
  onEdit,
  onDelete,
  onPriority,
}: DesktopProjectTableProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-alpha-border bg-[color:var(--alpha-panel)] shadow-[0_8px_28px_rgba(0,0,0,0.16)]">
        <div className="overflow-x-auto project-list-scroll">
        <table className="w-full min-w-[1040px] table-fixed border-separate border-spacing-0 min-[1600px]:min-w-[1540px] min-[1920px]:min-w-[1760px]">
          <colgroup>
            <col className="w-[260px] min-[1600px]:w-[300px] min-[1920px]:w-[340px]" />
            <col className="w-[136px] min-[1600px]:w-[156px]" />
            <col className="w-[136px] min-[1600px]:w-[156px]" />
            <col className="w-[116px] min-[1600px]:w-[124px]" />
            <col className="w-[116px] min-[1600px]:w-[128px]" />
            <col className="w-[116px] min-[1600px]:w-[128px]" />
            <col className="w-[128px] min-[1600px]:w-[146px]" />
            <col className="w-[150px] min-[1600px]:w-[178px] min-[1920px]:w-[210px]" />
            <col className="hidden w-[150px] min-[1600px]:table-column min-[1920px]:w-[180px]" />
            <col className="hidden w-[190px] min-[1600px]:table-column min-[1920px]:w-[240px]" />
            <col className="hidden w-[108px] min-[1600px]:table-column" />
            <col className="w-[228px]" />
          </colgroup>
          <thead>
            <tr className="sticky top-0 z-30 h-11 bg-[color:var(--alpha-surface-strong)]">
              {[
                "Project",
                "Ecosystem",
                "Category",
                "Status",
                "Potential",
                "Priority",
                "Funding",
                "Wallet",
                "Strategy",
                "Email",
                "Waitlist",
                "Actions",
              ].map((heading, index) => (
                <th
                  key={heading}
                  className={cn(
                    "border-b border-alpha-border px-4 text-left text-[13px] font-semibold leading-none alpha-text-muted",
                    index === 0 && "sticky left-0 z-40 border-r border-alpha-border bg-[color:var(--alpha-surface-strong)]",
                    index >= 7 && index <= 9 && "hidden min-[1600px]:table-cell",
                    index === 10 && "text-center"
                  )}
                >
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {airdrops.map((airdrop, index) => (
              <DesktopTableRow
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
          </tbody>
        </table>
      </div>
    </div>
  );
}

interface DesktopTableRowProps {
  airdrop: Airdrop;
  index: number;
  logoError: Record<string, boolean>;
  setLogoError: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  onEdit: (airdrop: Airdrop) => void;
  onDelete: (airdrop: Airdrop) => void;
  onPriority: (airdrop: Airdrop) => void;
}

const DesktopTableRow = memo(function DesktopTableRow({
  airdrop,
  index,
  logoError,
  setLogoError,
  onEdit,
  onDelete,
  onPriority,
}: DesktopTableRowProps) {
  const isPriority = Boolean(airdrop.isPriority || airdrop.is_priority);
  const status = statusMeta(airdrop.status);
  const potential = potentialMeta(airdrop.potential);
  const priority = priorityMeta(airdrop.priority);
  const officialLink = airdrop.platformLink?.trim();
  const xLink = getXProfileUrl(airdrop.twitterUsername);
  const wallet = airdrop.walletAddress?.trim();
  const funding = airdrop.funding?.trim();
  const ecosystem = airdrop.ecosystemId ? getEcosystemById(airdrop.ecosystemId)?.name : undefined;
  const category = airdrop.projectCategory ?? "Other";
  const strategy = airdrop.farmingStrategy ?? "Unknown";
  const email = airdrop.email?.trim();

  return (
    <tr
      className={cn(
        "group h-12 border-b border-alpha-border transition-colors duration-150 hover:bg-[color:var(--alpha-hover-soft)]",
        index % 2 === 1 && "bg-white/[0.015]"
      )}
    >
      <td className="sticky left-0 z-20 border-b border-r border-alpha-border bg-[color:var(--alpha-panel)] px-4 py-2 transition-colors duration-150 group-hover:bg-[color:var(--alpha-surface-soft)]">
        <div className="flex min-w-0 items-center gap-3">
          <ProjectAvatar
            airdrop={airdrop}
            logoError={logoError}
            setLogoError={setLogoError}
          />
          <div className="min-w-0 flex-1">
            <div className="flex min-w-0 items-center gap-2">
              <p className="truncate text-[13px] font-semibold leading-5 alpha-text" title={airdrop.projectName}>
                {airdrop.projectName}
              </p>
              {isPriority && <Star className="h-3.5 w-3.5 flex-shrink-0" style={{ color: 'var(--alpha-highlight)', fill: 'var(--alpha-highlight)' }} />}
            </div>
            <p className="truncate text-[11px] leading-4 alpha-text-muted" title={airdrop.twitterUsername || undefined}>
              {airdrop.twitterUsername ? `@${airdrop.twitterUsername.replace("@", "")}` : formatProjectDate(airdrop.deadline ?? airdrop.createdAt)}
            </p>
            <p className="truncate text-[10px] leading-4 alpha-text-muted" title="Tanggal dan waktu dibuat">
              {formatProjectDateTime(airdrop.createdAt)}
            </p>
          </div>
        </div>
      </td>

      <td className="border-b border-alpha-border px-4 py-2">
        <span className="block truncate text-[12px] font-semibold alpha-text" title={ecosystem}>
          {ecosystem || "--"}
        </span>
      </td>

      <td className="border-b border-alpha-border px-4 py-2">
        <Badge
          variant="outline"
          title={category}
          className="max-w-full truncate border-alpha-border bg-[color:var(--alpha-hover-soft)] text-[11px] font-semibold text-[color:var(--alpha-text-muted)]"
        >
          {category}
        </Badge>
      </td>

      <td className="border-b border-alpha-border px-4 py-2">
        <span className={badgeClass(status.tone)} style={badgeStyle(status.tone)} title={airdrop.status}>
          {status.label}
        </span>
      </td>

      <td className="border-b border-alpha-border px-4 py-2">
        <span className={badgeClass(potential.tone)} style={badgeStyle(potential.tone)} title={airdrop.potential ?? "No potential set"}>
          {potential.label}
        </span>
      </td>

      <td className="border-b border-alpha-border px-4 py-2">
        <span className={badgeClass(priority.tone)} style={badgeStyle(priority.tone)} title={airdrop.priority ?? "No priority set"}>
          {priority.label}
        </span>
      </td>

      <td className="border-b border-alpha-border px-4 py-2">
        <span className="block truncate text-[13px] font-semibold tabular-nums alpha-text" title={funding || undefined}>
          {funding || "--"}
        </span>
      </td>

      <td className="border-b border-alpha-border px-4 py-2">
        {wallet ? (
          <span className="flex min-w-0 items-center gap-1.5 text-[12px] font-medium alpha-text" title={wallet}>
            <Wallet className="h-3.5 w-3.5 flex-shrink-0 alpha-text-muted" />
            <span className="truncate">{formatWallet(wallet)}</span>
          </span>
        ) : (
          <span className="text-[12px] alpha-text-muted">--</span>
        )}
      </td>

      <td className="hidden border-b border-alpha-border px-4 py-2 min-[1600px]:table-cell">
        <Badge
          variant="outline"
          title={strategy}
          className="max-w-full truncate border-alpha-border bg-[color:var(--alpha-hover-soft)] text-[11px] font-semibold text-[color:var(--alpha-text-muted)]"
        >
          {strategy}
        </Badge>
      </td>

      <td className="hidden border-b border-alpha-border px-4 py-2 min-[1600px]:table-cell">
        {email ? (
          <span className="flex min-w-0 items-center gap-1.5 text-[12px] alpha-text" title={email}>
            <Mail className="h-3.5 w-3.5 flex-shrink-0 alpha-text-muted" />
            <span className="truncate">{email}</span>
          </span>
        ) : (
          <span className="text-[12px] alpha-text-muted">--</span>
        )}
      </td>

      <td className="hidden border-b border-alpha-border px-4 py-2 min-[1600px]:table-cell">
        <span className="text-[13px] font-semibold tabular-nums alpha-text">
          {airdrop.waitlistCount != null ? airdrop.waitlistCount : "--"}
        </span>
      </td>

      <td className="border-b border-alpha-border px-4 py-2">
        <div className="flex items-center justify-center gap-1.5">
          <ActionButton
            label="View"
            onClick={() => onEdit(airdrop)}
          >
            <Eye className="h-3.5 w-3.5" />
          </ActionButton>
          <ActionButton
            label={isPriority ? "Remove from priority" : "Add to priority"}
            active={isPriority}
            onClick={(event) => {
              event.stopPropagation();
              onPriority(airdrop);
            }}
          >
            <Star className="h-3.5 w-3.5" style={isPriority ? { color: 'var(--alpha-highlight)', fill: 'var(--alpha-highlight)' } : undefined} />
          </ActionButton>
          <ActionButton label="Edit" onClick={() => onEdit(airdrop)}>
            <Edit2 className="h-3.5 w-3.5" />
          </ActionButton>
          <ActionButton label="Delete" danger onClick={() => onDelete(airdrop)}>
            <Trash2 className="h-3.5 w-3.5" />
          </ActionButton>
          <ActionButton
            label="Open X profile"
            disabled={!xLink}
            onClick={() => {
              if (xLink) window.open(xLink, "_blank", "noopener,noreferrer");
            }}
          >
            <span className="text-[13px] font-semibold leading-none" aria-hidden="true">𝕏</span>
          </ActionButton>
          <ActionButton
            label="Open Link"
            disabled={!officialLink}
            onClick={() => {
              if (officialLink) window.open(officialLink, "_blank", "noopener,noreferrer");
            }}
          >
            <ExternalLink className="h-3.5 w-3.5" />
          </ActionButton>
        </div>
      </td>
    </tr>
  );
});
