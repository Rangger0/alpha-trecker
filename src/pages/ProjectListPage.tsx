import { lazy, Suspense, useEffect, useState } from 'react';
import { List, Plus } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { ProjectTableContainer } from '@/components/dashboard/ProjectTableContainer';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { getAirdropsByUserId, updateAirdrop, createAirdrop } from '@/services/database';
import { supabase } from '@/lib/supabase';
import { AIRDROPS_SYNC_EVENT, emitAirdropsSync, setCachedAirdrops } from '@/lib/airdrops-store';
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

const normalizeAirdrops = (rows: Airdrop[]) =>
  rows.map((airdrop) => ({
    ...airdrop,
    isPriority: Boolean(airdrop.isPriority || airdrop.is_priority),
  }));

export function ProjectListPage() {
  const { session } = useAuth();
  const { theme } = useTheme();
  const user = session?.user;
  const isDark = theme === 'dark';
  const [airdrops, setAirdrops] = useState<Airdrop[]>([]);
  const [logoError, setLogoError] = useState<Record<string, boolean>>({});
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingAirdrop, setEditingAirdrop] = useState<Airdrop | null>(null);
  const [deletingAirdrop, setDeletingAirdrop] = useState<Airdrop | null>(null);
  const projectAirdrops = airdrops.filter((airdrop) => !isNftProject(airdrop));

  const syncAirdrops = (nextAirdrops: Airdrop[]) => {
    setAirdrops(nextAirdrops);
    if (user) {
      setCachedAirdrops(user.id, nextAirdrops);
    }
  };

  const reloadAirdrops = async () => {
    if (!user) return;
    const rows = await getAirdropsByUserId(user.id);
    syncAirdrops(normalizeAirdrops(rows));
  };

  useEffect(() => {
    void reloadAirdrops();
  }, [user?.id]);

  useEffect(() => {
    if (!user) return;

    const handleSync = (event: Event) => {
      const detail = (event as CustomEvent<{ userId?: string }>).detail;
      if (detail?.userId && detail.userId !== user.id) return;
      void reloadAirdrops();
    };

    window.addEventListener(AIRDROPS_SYNC_EVENT, handleSync);
    return () => window.removeEventListener(AIRDROPS_SYNC_EVENT, handleSync);
  }, [user?.id]);

  const handleAddAirdrop = async (data: Omit<Airdrop, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    if (!user) return;
    await createAirdrop(data, user.id);
    await reloadAirdrops();
    emitAirdropsSync({ userId: user.id });
    setIsAddModalOpen(false);
  };

  const handleEditAirdrop = async (data: Omit<Airdrop, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    if (!editingAirdrop) return;
    await updateAirdrop(editingAirdrop.id, data);
    await reloadAirdrops();
    if (user) emitAirdropsSync({ userId: user.id });
    setEditingAirdrop(null);
  };

  const handleDeleteAirdrop = async () => {
    if (!deletingAirdrop) return;
    const { error } = await supabase.from('airdrops').delete().eq('id', deletingAirdrop.id);
    if (error) return console.error(error);
    syncAirdrops(airdrops.filter((airdrop) => airdrop.id !== deletingAirdrop.id));
    emitAirdropsSync({ userId: user?.id });
    setDeletingAirdrop(null);
  };

  const handleTogglePriority = async (airdrop: Airdrop) => {
    const nextValue = !(airdrop.isPriority || airdrop.is_priority);
    const { error } = await supabase
      .from('airdrops')
      .update({ is_priority: nextValue, updated_at: new Date().toISOString() })
      .eq('id', airdrop.id);
    if (error) return console.error(error);
    await reloadAirdrops();
    emitAirdropsSync({ userId: user?.id });
  };

  return (
    <DashboardLayout disableMonochrome>
      <div className="macos-root macos-page-shell">
        <header className="macos-page-header macos-animate-up">
          <div className="macos-page-kicker">
            <List className="h-3.5 w-3.5" />
            Workspace directory
          </div>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="macos-page-title">Project List</h1>
              <p className="macos-page-subtitle">
                Semua project dalam satu daftar kerja. Cari, filter, edit, hapus, dan tandai prioritas dari sini.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsAddModalOpen(true)}
              className="macos-btn macos-btn--primary inline-flex h-10 items-center justify-center gap-2 rounded-[0.9rem] px-4 text-[11px] font-semibold uppercase tracking-[0.16em]"
            >
              <Plus className="h-4 w-4" />
              Add Project
            </button>
          </div>
        </header>

        <ProjectTableContainer
          airdrops={projectAirdrops}
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
          <AirdropModal
            isOpen
            onClose={() => setIsAddModalOpen(false)}
            onSubmit={handleAddAirdrop}
            mode="add"
            isDark={isDark}
            scope="project"
            isDuplicate={(identity) => hasSameProjectIdentity(identity, airdrops)}
          />
        </Suspense>
      ) : null}
      {editingAirdrop ? (
        <Suspense fallback={null}>
          <AirdropModal
            isOpen
            onClose={() => setEditingAirdrop(null)}
            onSubmit={handleEditAirdrop}
            mode="edit"
            airdrop={editingAirdrop}
            isDark={isDark}
            scope="project"
            isDuplicate={(identity) => hasSameProjectIdentity(identity, airdrops, editingAirdrop.id)}
          />
        </Suspense>
      ) : null}
      {deletingAirdrop ? (
        <Suspense fallback={null}>
          <DeleteConfirmModal
            isOpen
            onClose={() => setDeletingAirdrop(null)}
            onConfirm={handleDeleteAirdrop}
            projectName={deletingAirdrop.projectName}
            isDark={isDark}
          />
        </Suspense>
      ) : null}
    </DashboardLayout>
  );
}
