import { lazy, Suspense, useMemo, useState } from 'react';
import { Image, Users, WalletCards } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { ProjectTableContainer } from '@/components/dashboard/ProjectTableContainer';
import { useAirdrops } from '@/hooks/use-airdrops';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { createAirdrop, updateAirdrop } from '@/services/database';
import { supabase } from '@/lib/supabase';
import { emitAirdropsSync, invalidateAirdropsCache } from '@/lib/airdrops-store';
import { hasSameProjectIdentity, isNftProject } from '@/lib/project-classification';
import type { Airdrop } from '@/types';

const AirdropModal = lazy(async () => {
  const module = await import('@/components/modals/AirdropModal');
  return { default: module.AirdropModal };
});

const DeleteConfirmModal = lazy(async () => {
  const module = await import('@/components/modals/DeleteConfirmModal');
  return { default: module.DeleteConfirmModal };
});

export function NFTWaitlistPage() {
  const { theme } = useTheme();
  const { session } = useAuth();
  const { airdrops, deleteAirdrop, refetch } = useAirdrops();
  const isDark = theme === 'dark';
  const [logoError, setLogoError] = useState<Record<string, boolean>>({});
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingAirdrop, setEditingAirdrop] = useState<Airdrop | null>(null);
  const [deletingAirdrop, setDeletingAirdrop] = useState<Airdrop | null>(null);

  const nftProjects = useMemo(() => airdrops.filter(isNftProject), [airdrops]);
  const waitlistTotal = nftProjects.reduce((sum, project) => sum + (project.waitlistCount ?? 0), 0);
  const trackedWaitlists = nftProjects.filter((project) => project.waitlistCount != null).length;
  const activeProjects = nftProjects.filter((project) => project.status === 'Ongoing').length;

  const handleEdit = async (data: Omit<Airdrop, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    if (!editingAirdrop) return;
    await updateAirdrop(editingAirdrop.id, data);
    await refetch();
    setEditingAirdrop(null);
  };

  const handleAdd = async (data: Omit<Airdrop, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    if (!session?.user) return;
    await createAirdrop(data, session.user.id);
    await refetch();
    setIsAddModalOpen(false);
  };

  const handleDelete = async () => {
    if (!deletingAirdrop) return;
    await deleteAirdrop(deletingAirdrop.id);
    setDeletingAirdrop(null);
  };

  const handleTogglePriority = async (airdrop: Airdrop) => {
    const { error } = await supabase
      .from('airdrops')
      .update({
        is_priority: !(airdrop.isPriority || airdrop.is_priority),
        updated_at: new Date().toISOString(),
      })
      .eq('id', airdrop.id);
    if (error) return console.error(error);
    invalidateAirdropsCache(session?.user?.id);
    emitAirdropsSync({ userId: session?.user?.id });
    await refetch();
  };

  return (
    <DashboardLayout disableMonochrome>
      <div className="macos-root macos-page-shell">
        <header className="macos-page-header macos-animate-up">
          <div className="macos-page-kicker">
            <Image className="h-3.5 w-3.5" />
            NFT opportunity desk
          </div>
          <h1 className="macos-page-title">NFT Waitlist</h1>
          <p className="macos-page-subtitle">
            Pantau project NFT dan waitlist dalam format project list yang sama, lengkap dengan filter, status, dan priority.
          </p>
          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="macos-btn macos-btn--primary mt-4 inline-flex h-10 items-center justify-center rounded-[0.9rem] px-4 text-[11px] font-semibold uppercase tracking-[0.16em]"
          >
            Add NFT Project
          </button>
        </header>

        <div className="mb-5 grid gap-3 sm:grid-cols-3">
          {[
            { label: 'NFT Projects', value: nftProjects.length, icon: Image, accent: 'var(--alpha-danger)' },
            { label: 'Waitlist Entries', value: waitlistTotal.toLocaleString('id-ID'), icon: Users, accent: 'var(--alpha-info)' },
            { label: 'Active Lanes', value: activeProjects, icon: WalletCards, accent: 'var(--alpha-highlight)' },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.label} className="macos-card rounded-[1rem] border border-alpha-border bg-[color:var(--alpha-surface)] px-4 py-3">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-[10px] uppercase tracking-[0.18em] alpha-text-muted">{item.label}</p>
                  <Icon className="h-4 w-4" style={{ color: item.accent }} />
                </div>
                <p className="mt-2 text-2xl font-semibold alpha-text">{item.value}</p>
                <p className="mt-1 text-[11px] alpha-text-muted">{item.label === 'Waitlist Entries' ? `${trackedWaitlists} project punya data waitlist` : 'Live dari workspace'}</p>
              </div>
            );
          })}
        </div>

        <ProjectTableContainer
          airdrops={nftProjects}
          isDark={isDark}
          logoError={logoError}
          setLogoError={setLogoError}
          onEdit={setEditingAirdrop}
          onDelete={setDeletingAirdrop}
          onPriority={handleTogglePriority}
          onAddNew={() => setIsAddModalOpen(true)}
        />
      </div>

      {isAddModalOpen ? (
        <Suspense fallback={null}>
          <AirdropModal isOpen onClose={() => setIsAddModalOpen(false)} onSubmit={handleAdd} mode="add" isDark={isDark} scope="nft" isDuplicate={(identity) => hasSameProjectIdentity(identity, nftProjects)} />
        </Suspense>
      ) : null}
      {editingAirdrop ? (
        <Suspense fallback={null}>
          <AirdropModal isOpen onClose={() => setEditingAirdrop(null)} onSubmit={handleEdit} mode="edit" airdrop={editingAirdrop} isDark={isDark} scope="nft" isDuplicate={(identity) => hasSameProjectIdentity(identity, nftProjects, editingAirdrop.id)} />
        </Suspense>
      ) : null}
      {deletingAirdrop ? (
        <Suspense fallback={null}>
          <DeleteConfirmModal isOpen onClose={() => setDeletingAirdrop(null)} onConfirm={handleDelete} projectName={deletingAirdrop.projectName} isDark={isDark} />
        </Suspense>
      ) : null}
    </DashboardLayout>
  );
}
