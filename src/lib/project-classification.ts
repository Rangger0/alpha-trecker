import type { Airdrop } from '@/types';

export const isNftProject = (airdrop: Airdrop) =>
  airdrop.type === 'NFT' ||
  airdrop.type === 'Deploy NFT' ||
  airdrop.type === 'Waitlist' ||
  airdrop.projectCategory === 'NFT' ||
  airdrop.farmingStrategy === 'Waitlist';

export const normalizeProjectKey = (value?: string) =>
  value?.trim().toLowerCase().replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '') ?? '';

export const getXProfileUrl = (value?: string) => {
  const normalized = value?.trim();
  if (!normalized) return '';
  if (/^https?:\/\//i.test(normalized)) {
    return normalized.replace(/^https?:\/\/(www\.)?twitter\.com/i, 'https://x.com');
  }
  return `https://x.com/${normalized.replace(/^@/, '')}`;
};

export const hasSameProjectIdentity = (
  candidate: Pick<Airdrop, 'projectName' | 'platformLink' | 'twitterUsername'>,
  existing: Airdrop[],
  editingId?: string,
) => {
  const candidateName = normalizeProjectKey(candidate.projectName);
  const candidateLinks = [candidate.platformLink, candidate.twitterUsername]
    .map(normalizeProjectKey)
    .filter(Boolean);

  return existing.some((project) => {
    if (project.id === editingId) return false;

    const sameName = candidateName && normalizeProjectKey(project.projectName) === candidateName;
    const existingLinks = [project.platformLink, project.twitterUsername]
      .map(normalizeProjectKey)
      .filter(Boolean);
    const sameLink = candidateLinks.some((link) => existingLinks.includes(link));

    return Boolean(sameName || sameLink);
  });
};
