import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type Language = "id" | "en";
export type DisplayCurrency = "IDR" | "USD";

type TranslationParams = Record<string, string | number>;
type CurrencyFormatOptions = {
  compact?: boolean;
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
};

interface LanguageContextType {
  language: Language;
  locale: string;
  displayCurrency: DisplayCurrency;
  displayCurrencyLabel: string;
  usdToIdrRate: number;
  setLanguage: (language: Language) => void;
  t: (key: string, params?: TranslationParams) => string;
  translateOption: (scope: string, value: string) => string;
  convertFromUsd: (value: number) => number;
  convertToUsd: (value: number) => number;
  formatCurrency: (value: number, options?: CurrencyFormatOptions) => string;
  formatCompactCurrency: (value: number, options?: CurrencyFormatOptions) => string;
  formatCurrencyInput: (value: number, options?: { maximumFractionDigits?: number }) => string;
  formatNumber: (value: number, options?: Intl.NumberFormatOptions) => string;
  formatDate: (value?: string | Date | null, options?: Intl.DateTimeFormatOptions) => string;
}

const LANGUAGE_KEY = "alpha_tracker_language";
const USD_TO_IDR_RATE_KEY = "alpha_tracker_usd_to_idr_rate";
const DEFAULT_LANGUAGE: Language = "id";
const DEFAULT_USD_TO_IDR_RATE = 16_000;

const translations: Record<Language, Record<string, string>> = {
  id: {
    "common.loading": "Memuat...",
    "common.close": "Tutup",
    "common.cancel": "Batal",
    "common.save": "Simpan",
    "common.delete": "Hapus",
    "common.edit": "Edit",
    "common.search": "Cari",
    "common.dark": "Gelap",
    "common.light": "Terang",
    "common.theme": "Tema",
    "common.language": "Bahasa",
    "common.indonesian": "Indonesia",
    "common.english": "English",
    "common.projects": "Proyek",
    "common.status": "Status",
    "common.type": "Tipe",
    "common.notes": "Catatan",
    "common.updated": "Diperbarui",
    "common.noData": "Belum ada data",
    "common.selectProject": "Pilih proyek",
    "common.saveChanges": "Simpan perubahan",
    "common.recordSaved": "Data berhasil disimpan.",
    "common.calculator": "Kalkulator",
    "common.moneyMode": "Semua nominal mengikuti {currency}.",

    "sidebar.section.workspace": "Ruang Kerja",
    "sidebar.section.tracking": "Pelacakan",
    "sidebar.section.tools": "Alat",
    "sidebar.section.ai": "AI",
    "sidebar.section.operator": "Operator",
    "sidebar.section.preferences": "Preferensi",
    "sidebar.link.overview": "Ringkasan",
    "sidebar.link.dashboard": "Dashboard",
    "sidebar.link.priority": "Prioritas",
    "sidebar.link.ecosystem": "Ekosistem",
    "sidebar.link.screening": "Penyaringan",
    "sidebar.link.eligibility": "Cek Kelayakan",
    "sidebar.link.faucet": "Faucet",
    "sidebar.link.multiAccount": "Multi Akun",
    "sidebar.link.rewardVault": "Vault Reward",
    "sidebar.link.calculator": "Kalkulator",
    "sidebar.link.liveGasFee": "Live Gas Fee",
    "sidebar.link.tools": "Alat",
    "sidebar.link.deploy": "Deploy",
    "sidebar.link.swapBridge": "Swap & Bridge",
    "sidebar.link.aiTools": "Alat AI",
    "sidebar.link.feedbackInbox": "Kotak Masuk Feedback",
    "sidebar.link.about": "Tentang",
    "sidebar.link.logout": "Keluar",
    "sidebar.link.login": "Masuk",
    "sidebar.preference.languageLabel": "Bahasa aplikasi",
    "sidebar.preference.themeLabel": "Mode tampilan",
    "sidebar.preference.languageHint": "Pilih Indonesia atau English.",
    "sidebar.preference.themeHint": "Switch tema sekarang ada di sidebar.",

    "topbar.openSidebar": "Buka sidebar",
    "topbar.addAirdrop": "Tambah Proyek",
    "topbar.section.overview": "Ringkasan",
    "topbar.section.dashboard": "Dashboard",
    "topbar.section.priority": "Prioritas",
    "topbar.section.ecosystem": "Ekosistem",
    "topbar.section.screening": "Penyaringan",
    "topbar.section.eligibility": "Kelayakan",
    "topbar.section.faucet": "Faucet",
    "topbar.section.multiAccount": "Multi Akun",
    "topbar.section.rewardVault": "Vault Reward",
    "topbar.section.calculator": "Kalkulator",
    "topbar.section.liveGasFee": "Live Gas Fee",
    "topbar.section.tools": "Alat Riset",
    "topbar.section.deploy": "Deploy",
    "topbar.section.swapBridge": "Swap & Bridge",
    "topbar.section.aiTools": "Alat AI",
    "topbar.section.feedbackInbox": "Kotak Masuk Feedback",
    "topbar.section.about": "Tentang",
    "topbar.section.app": "Alpha Tracker",

    "airdropModal.addTitle": "Tambah Proyek",
    "airdropModal.editTitle": "Edit Proyek",
    "airdropModal.addDescription": "Buat proyek baru dengan tampilan yang lebih rapi dan ringan.",
    "airdropModal.editDescription": "Perbarui detail proyek tanpa gaya terminal lama.",
    "airdropModal.addAction": "Tambah Proyek",
    "airdropModal.editAction": "Perbarui Proyek",
    "airdropModal.adding": "Menambahkan...",
    "airdropModal.updating": "Memperbarui...",
    "airdropModal.section.basic": "Informasi Dasar",
    "airdropModal.section.links": "Tautan",
    "airdropModal.section.tasks": "Tugas",
    "airdropModal.projectName": "Nama Proyek",
    "airdropModal.projectLogo": "URL Logo Proyek",
    "airdropModal.type": "Tipe",
    "airdropModal.status": "Status",
    "airdropModal.tier": "Level",
    "airdropModal.date": "Tanggal",
    "airdropModal.priorityToggle": "Tandai sebagai proyek prioritas",
    "airdropModal.platformLink": "Tautan Platform",
    "airdropModal.twitterUsername": "Username X (Twitter)",
    "airdropModal.walletAddress": "Alamat Dompet",
    "airdropModal.notes": "Catatan",
    "airdropModal.addTask": "Tambah tugas...",
    "airdropModal.notesPlaceholder": "Tambahkan catatan tambahan...",
    "airdropModal.projectNamePlaceholder": "mis. LayerZero",
    "airdropModal.twitterPlaceholder": "username (tanpa @)",

    "rewardModal.badge": "Vault Reward",
    "rewardModal.addTitle": "Catat reward airdrop",
    "rewardModal.editTitle": "Edit reward airdrop",
    "rewardModal.description": "Simpan TGE, modal, fee, nilai realized, dan profit untuk {project}.",
    "rewardModal.linkedProject": "Proyek terhubung",
    "rewardModal.claimStatus": "Status klaim",
    "rewardModal.amountUsd": "Nilai realized",
    "rewardModal.capitalUsd": "Modal keluar",
    "rewardModal.feeUsd": "Fee / gas",
    "rewardModal.totalCost": "Total modal",
    "rewardModal.totalCostHint": "Capital + fee yang sudah kamu keluarkan.",
    "rewardModal.netProfit": "Laba bersih",
    "rewardModal.roi": "ROI {value}",
    "rewardModal.tgeDate": "Tanggal TGE",
    "rewardModal.claimedAt": "Tanggal klaim",
    "rewardModal.tokenSymbol": "Simbol token",
    "rewardModal.tokenAmount": "Jumlah token",
    "rewardModal.notes": "Catatan",
    "rewardModal.notesPlaceholder": "Dompet OG, jadwal vesting, rencana jual, atau catatan lain...",
    "rewardModal.removeRecord": "Hapus data",
    "rewardModal.saveReward": "Simpan reward",
    "rewardModal.recordReward": "Catat reward",
    "rewardModal.tokenEmpty": "Jumlah / simbol token belum diisi",
    "rewardModal.moneyHint": "Semua nominal di form ini tampil dalam {currency}.",

    "rewardVault.badge": "Modul sidebar baru",
    "rewardVault.title": "Vault Reward",
    "rewardVault.searchPlaceholder": "Cari proyek, token, atau username...",
    "rewardVault.filter.all": "Semua status",
    "rewardVault.filter.untracked": "Belum dicatat",
    "rewardVault.realizedRevenue": "Pendapatan terealisasi",
    "rewardVault.capitalDeployed": "Modal keluar",
    "rewardVault.netProfit": "Laba bersih",
    "rewardVault.pendingTge": "Pending TGE",
    "rewardVault.claimedProjects": "Proyek yang diklaim",
    "rewardVault.avgRoi": "Rata-rata ROI",
    "rewardVault.avgPayout": "Rata-rata hasil",
    "rewardVault.bestProfit": "Profit terbaik",
    "rewardVault.bestPayout": "Payout terbaik",
    "rewardVault.timelineTitle": "Timeline Arus Kas",
    "rewardVault.timelineSubtitle": "Lihat revenue claim yang sudah realized sambil tetap memantau modal dan profit.",
    "rewardVault.trackedPayouts": "Payout terpantau",
    "rewardVault.trackedCount": "{count} proyek sedang melacak revenue, modal, dan ROI.",
    "rewardVault.loading": "Memuat Vault Reward...",
    "rewardVault.emptyTitle": "Tidak ada proyek yang cocok",
    "rewardVault.emptyDescription": "Coba kata kunci lain atau ganti filter status reward.",
    "rewardVault.card.status": "Status",
    "rewardVault.card.revenue": "Pendapatan",
    "rewardVault.card.capital": "Modal",
    "rewardVault.card.profit": "Profit",
    "rewardVault.card.tokenReward": "Hadiah token",
    "rewardVault.card.untracked": "Belum dicatat",
    "rewardVault.savedCompat": "Reward tersimpan, tapi tracking finance masih berjalan dalam mode kompatibilitas schema lama.",
    "rewardVault.saved": "Reward berhasil disimpan.",
    "rewardVault.deleted": "Data reward dihapus.",
    "rewardVault.saveError": "Gagal menyimpan reward ke database.",

    "calculator.badge": "Kalkulator keuangan",
    "calculator.title": "Kalkulator Proyek",
    "calculator.subtitle": "Buka halaman khusus untuk menghitung modal, fee, token, skenario exit, dan sinkron langsung ke proyek serta hasil reward.",
    "calculator.searchPlaceholder": "Cari proyek, token, atau tipe...",
    "calculator.summary.activeProject": "Proyek aktif",
    "calculator.summary.realizedValue": "Nilai realized",
    "calculator.summary.totalCapital": "Total modal",
    "calculator.summary.netProfit": "Laba bersih",
    "calculator.summary.noProject": "Pilih satu proyek untuk mulai hitung",
    "calculator.panel.projectList": "Daftar proyek",
    "calculator.panel.projectListHint": "Klik proyek untuk membuka workspace perhitungan yang sinkron.",
    "calculator.panel.editor": "Editor perhitungan",
    "calculator.panel.editorHint": "Nilai di sini memakai field yang sama dengan Vault Reward.",
    "calculator.panel.quickCalc": "Kalkulator cepat",
    "calculator.panel.quickCalcHint": "Buat simulasi harga token, exit, dan target profit sebelum simpan.",
    "calculator.field.claimStatus": "Status klaim",
    "calculator.field.realizedValue": "Nilai realized",
    "calculator.field.capitalUsd": "Modal",
    "calculator.field.feeUsd": "Fee / gas",
    "calculator.field.tgeDate": "Tanggal TGE",
    "calculator.field.claimedAt": "Tanggal klaim",
    "calculator.field.tokenSymbol": "Simbol token",
    "calculator.field.tokenAmount": "Jumlah token",
    "calculator.field.notes": "Catatan",
    "calculator.field.notesPlaceholder": "Tambah memo eksekusi, entry plan, vesting, atau strategi sell...",
    "calculator.action.editProject": "Edit proyek",
    "calculator.action.saveFinance": "Simpan keuangan",
    "calculator.action.saving": "Menyimpan...",
    "calculator.quick.tokenPrice": "Harga token",
    "calculator.quick.exitPercent": "Persentase exit (%)",
    "calculator.quick.extraFees": "Fee tambahan",
    "calculator.quick.targetProfit": "Target profit",
    "calculator.quick.estimatedGross": "Estimasi nilai kotor",
    "calculator.quick.estimatedNet": "Estimasi laba bersih",
    "calculator.quick.estimatedRoi": "Estimasi ROI",
    "calculator.quick.breakEven": "Harga break-even token",
    "calculator.quick.targetValue": "Nilai untuk capai target",
    "calculator.quick.noToken": "Isi jumlah token dulu untuk melihat simulasi harga.",
    "calculator.state.noProjects": "Belum ada proyek. Tambah proyek dulu dari dashboard atau tombol tambah di atas.",
    "calculator.state.noMatch": "Tidak ada proyek yang cocok dengan pencarian.",
    "calculator.state.synced": "Perubahan finance di sini tetap sinkron dengan Vault Reward.",
    "calculator.state.projectMeta": "{type} • {status}",
    "calculator.toast.saved": "Perhitungan proyek berhasil disimpan.",
    "calculator.toast.saveError": "Gagal menyimpan perhitungan proyek.",
    "calculator.toast.projectUpdated": "Detail proyek berhasil diperbarui.",
    "calculator.toast.projectUpdateError": "Gagal memperbarui proyek.",
    "calculator.moneyHint": "Semua nominal pada halaman ini tampil dalam {currency}.",

    "rewardPanel.badge": "Aliran hasil premium",
    "rewardPanel.totalRealized": "Total terealisasi",
    "rewardPanel.claimedProjects": "Proyek yang diklaim",
    "rewardPanel.bestPayout": "Hasil terbaik",
    "rewardPanel.latestRealized": "Realisasi terbaru",
    "rewardPanel.noClaimYet": "Belum ada klaim",
    "rewardPanel.waitingReward": "Menunggu reward",
    "rewardPanel.noPayoutYet": "Belum ada hasil",
    "rewardPanel.recordedCount": "{count} hasil tercatat",
    "rewardPanel.windowPayout": "Jendela hasil",
    "rewardPanel.averageClaim": "Rata-rata klaim",
    "rewardPanel.peakReward": "Reward tertinggi",
    "rewardPanel.latestReward": "Reward terbaru",
    "rewardPanel.emptyTitle": "Belum ada reward yang terealisasi",
    "rewardPanel.emptyDescription": "Simpan klaim reward pertamamu untuk mulai melihat timeline pendapatan yang terealisasi di panel ini.",
    "rewardPanel.analysis": "Analisis arus kas",
    "rewardPanel.activeTimeline": "{count} hasil terealisasi dalam timeline aktif",
    "rewardPanel.realizedPayout": "Hasil terealisasi",
    "rewardPanel.trendLine": "Garis tren",
    "rewardPanel.latestDate": "Terbaru: {date}",
    "rewardPanel.avgClaimMeta": "Rata-rata {value}",

    "airdropType.Testnet": "Testnet",
    "airdropType.AI": "AI",
    "airdropType.Quest": "Quest",
    "airdropType.Daily": "Harian",
    "airdropType.Daily Quest": "Quest Harian",
    "airdropType.Retroactive": "Retroaktif",
    "airdropType.Waitlist": "Daftar Tunggu",
    "airdropType.Depin": "Depin",
    "airdropType.NFT": "NFT",
    "airdropType.Domain Name": "Nama Domain",
    "airdropType.Deploy SC": "Deploy SC",
    "airdropType.DeFi": "DeFi",
    "airdropType.Deploy NFT": "Deploy NFT",

    "airdropStatus.Planning": "Perencanaan",
    "airdropStatus.Ongoing": "Berjalan",
    "airdropStatus.Done": "Selesai",
    "airdropStatus.Dropped": "Dilepas",

    "priority.Low": "Rendah",
    "priority.Medium": "Sedang",
    "priority.High": "Tinggi",

    "rewardClaimStatus.Pending TGE": "Pending TGE",
    "rewardClaimStatus.Claimed": "Sudah Claim",
    "rewardClaimStatus.Missed": "Terlewat",
  },
  en: {
    "common.loading": "Loading...",
    "common.close": "Close",
    "common.cancel": "Cancel",
    "common.save": "Save",
    "common.delete": "Delete",
    "common.edit": "Edit",
    "common.search": "Search",
    "common.dark": "Dark",
    "common.light": "Light",
    "common.theme": "Theme",
    "common.language": "Language",
    "common.indonesian": "Indonesian",
    "common.english": "English",
    "common.projects": "Projects",
    "common.status": "Status",
    "common.type": "Type",
    "common.notes": "Notes",
    "common.updated": "Updated",
    "common.noData": "No data yet",
    "common.selectProject": "Select a project",
    "common.saveChanges": "Save changes",
    "common.recordSaved": "Data saved successfully.",
    "common.calculator": "Calculator",
    "common.moneyMode": "All amounts follow {currency}.",

    "sidebar.section.workspace": "Workspace",
    "sidebar.section.tracking": "Tracking",
    "sidebar.section.tools": "Tools",
    "sidebar.section.ai": "AI",
    "sidebar.section.operator": "Operator",
    "sidebar.section.preferences": "Preferences",
    "sidebar.link.overview": "Overview",
    "sidebar.link.dashboard": "Dashboard",
    "sidebar.link.priority": "Priority",
    "sidebar.link.ecosystem": "Ecosystem",
    "sidebar.link.screening": "Screening",
    "sidebar.link.eligibility": "Check Eligibility",
    "sidebar.link.faucet": "Faucet",
    "sidebar.link.multiAccount": "Multi Account",
    "sidebar.link.rewardVault": "Reward Vault",
    "sidebar.link.calculator": "Calculator",
    "sidebar.link.liveGasFee": "Live Gas Fee",
    "sidebar.link.tools": "Tools",
    "sidebar.link.deploy": "Deploy",
    "sidebar.link.swapBridge": "Swap & Bridge",
    "sidebar.link.aiTools": "AI Tools",
    "sidebar.link.feedbackInbox": "Feedback Inbox",
    "sidebar.link.about": "About",
    "sidebar.link.logout": "Logout",
    "sidebar.link.login": "Login",
    "sidebar.preference.languageLabel": "App language",
    "sidebar.preference.themeLabel": "Display mode",
    "sidebar.preference.languageHint": "Choose Indonesian or English.",
    "sidebar.preference.themeHint": "Theme mode now lives in the sidebar.",

    "topbar.openSidebar": "Open sidebar",
    "topbar.addAirdrop": "Add Project",
    "topbar.section.overview": "Overview",
    "topbar.section.dashboard": "Dashboard",
    "topbar.section.priority": "Priority",
    "topbar.section.ecosystem": "Ecosystem",
    "topbar.section.screening": "Screening",
    "topbar.section.eligibility": "Eligibility",
    "topbar.section.faucet": "Faucet",
    "topbar.section.multiAccount": "Multi Account",
    "topbar.section.rewardVault": "Reward Vault",
    "topbar.section.calculator": "Calculator",
    "topbar.section.liveGasFee": "Live Gas Fee",
    "topbar.section.tools": "Research Tools",
    "topbar.section.deploy": "Deploy",
    "topbar.section.swapBridge": "Swap & Bridge",
    "topbar.section.aiTools": "AI Tools",
    "topbar.section.feedbackInbox": "Feedback Inbox",
    "topbar.section.about": "About",
    "topbar.section.app": "Alpha Tracker",

    "airdropModal.addTitle": "Add Project",
    "airdropModal.editTitle": "Edit Project",
    "airdropModal.addDescription": "Create a new project with a cleaner and lighter layout.",
    "airdropModal.editDescription": "Update project details without the old terminal look.",
    "airdropModal.addAction": "Add Project",
    "airdropModal.editAction": "Update Project",
    "airdropModal.adding": "Adding...",
    "airdropModal.updating": "Updating...",
    "airdropModal.section.basic": "Basic Information",
    "airdropModal.section.links": "Links",
    "airdropModal.section.tasks": "Tasks",
    "airdropModal.projectName": "Project Name",
    "airdropModal.projectLogo": "Project Logo URL",
    "airdropModal.type": "Type",
    "airdropModal.status": "Status",
    "airdropModal.tier": "Tier",
    "airdropModal.date": "Date",
    "airdropModal.priorityToggle": "Mark as priority project",
    "airdropModal.platformLink": "Platform Link",
    "airdropModal.twitterUsername": "X (Twitter) Username",
    "airdropModal.walletAddress": "Wallet Address",
    "airdropModal.notes": "Notes",
    "airdropModal.addTask": "Add a task...",
    "airdropModal.notesPlaceholder": "Add any extra notes...",
    "airdropModal.projectNamePlaceholder": "e.g. LayerZero",
    "airdropModal.twitterPlaceholder": "username (without @)",

    "rewardModal.badge": "Reward Vault",
    "rewardModal.addTitle": "Record airdrop reward",
    "rewardModal.editTitle": "Edit airdrop reward",
    "rewardModal.description": "Save TGE, capital, fees, realized value, and profit for {project}.",
    "rewardModal.linkedProject": "Linked project",
    "rewardModal.claimStatus": "Claim status",
    "rewardModal.amountUsd": "Realized value",
    "rewardModal.capitalUsd": "Capital deployed",
    "rewardModal.feeUsd": "Fees / gas",
    "rewardModal.totalCost": "Total capital",
    "rewardModal.totalCostHint": "Capital + fees already spent.",
    "rewardModal.netProfit": "Net profit",
    "rewardModal.roi": "ROI {value}",
    "rewardModal.tgeDate": "TGE date",
    "rewardModal.claimedAt": "Claimed date",
    "rewardModal.tokenSymbol": "Token symbol",
    "rewardModal.tokenAmount": "Token amount",
    "rewardModal.notes": "Notes",
    "rewardModal.notesPlaceholder": "OG wallet, vesting schedule, sell plan, or other notes...",
    "rewardModal.removeRecord": "Remove record",
    "rewardModal.saveReward": "Save reward",
    "rewardModal.recordReward": "Record reward",
    "rewardModal.tokenEmpty": "Token amount / symbol is not filled yet",
    "rewardModal.moneyHint": "All amounts in this form are shown in {currency}.",

    "rewardVault.badge": "New sidebar module",
    "rewardVault.title": "Reward Vault",
    "rewardVault.searchPlaceholder": "Search project, token, or username...",
    "rewardVault.filter.all": "All statuses",
    "rewardVault.filter.untracked": "Not recorded",
    "rewardVault.realizedRevenue": "Realized revenue",
    "rewardVault.capitalDeployed": "Capital deployed",
    "rewardVault.netProfit": "Net profit",
    "rewardVault.pendingTge": "Pending TGE",
    "rewardVault.claimedProjects": "Claimed projects",
    "rewardVault.avgRoi": "Avg ROI",
    "rewardVault.avgPayout": "Avg payout",
    "rewardVault.bestProfit": "Best profit",
    "rewardVault.bestPayout": "Best payout",
    "rewardVault.timelineTitle": "Cashflow Timeline",
    "rewardVault.timelineSubtitle": "See realized claim revenue while still tracking capital and profit.",
    "rewardVault.trackedPayouts": "Tracked payouts",
    "rewardVault.trackedCount": "{count} projects tracking revenue, capital, and ROI.",
    "rewardVault.loading": "Loading Reward Vault...",
    "rewardVault.emptyTitle": "No matching projects",
    "rewardVault.emptyDescription": "Try another keyword or change the reward status filter.",
    "rewardVault.card.status": "Status",
    "rewardVault.card.revenue": "Revenue",
    "rewardVault.card.capital": "Capital",
    "rewardVault.card.profit": "Profit",
    "rewardVault.card.tokenReward": "Token reward",
    "rewardVault.card.untracked": "Untracked",
    "rewardVault.savedCompat": "Reward saved, but finance tracking is still running in legacy schema compatibility mode.",
    "rewardVault.saved": "Reward saved successfully.",
    "rewardVault.deleted": "Reward record removed.",
    "rewardVault.saveError": "Failed to save reward to the database.",

    "calculator.badge": "Finance calculator",
    "calculator.title": "Project Calculator",
    "calculator.subtitle": "Open a dedicated page to calculate capital, fees, token scenarios, and sync directly with project and reward results.",
    "calculator.searchPlaceholder": "Search project, token, or type...",
    "calculator.summary.activeProject": "Active project",
    "calculator.summary.realizedValue": "Realized value",
    "calculator.summary.totalCapital": "Total capital",
    "calculator.summary.netProfit": "Net profit",
    "calculator.summary.noProject": "Pick a project to start calculating",
    "calculator.panel.projectList": "Project list",
    "calculator.panel.projectListHint": "Click a project to open a synced calculation workspace.",
    "calculator.panel.editor": "Calculation editor",
    "calculator.panel.editorHint": "These values use the same fields as Reward Vault.",
    "calculator.panel.quickCalc": "Quick calculator",
    "calculator.panel.quickCalcHint": "Simulate token price, exit, and target profit before saving.",
    "calculator.field.claimStatus": "Claim status",
    "calculator.field.realizedValue": "Realized value",
    "calculator.field.capitalUsd": "Capital",
    "calculator.field.feeUsd": "Fees / gas",
    "calculator.field.tgeDate": "TGE date",
    "calculator.field.claimedAt": "Claimed date",
    "calculator.field.tokenSymbol": "Token symbol",
    "calculator.field.tokenAmount": "Token amount",
    "calculator.field.notes": "Notes",
    "calculator.field.notesPlaceholder": "Add execution notes, entry plan, vesting, or sell strategy...",
    "calculator.action.editProject": "Edit project",
    "calculator.action.saveFinance": "Save finance",
    "calculator.action.saving": "Saving...",
    "calculator.quick.tokenPrice": "Token price",
    "calculator.quick.exitPercent": "Exit percentage (%)",
    "calculator.quick.extraFees": "Extra fees",
    "calculator.quick.targetProfit": "Target profit",
    "calculator.quick.estimatedGross": "Estimated gross value",
    "calculator.quick.estimatedNet": "Estimated net profit",
    "calculator.quick.estimatedRoi": "Estimated ROI",
    "calculator.quick.breakEven": "Break-even token price",
    "calculator.quick.targetValue": "Value needed to hit target",
    "calculator.quick.noToken": "Fill in token amount first to preview price scenarios.",
    "calculator.state.noProjects": "No projects yet. Add one first from the dashboard or the add button above.",
    "calculator.state.noMatch": "No projects match your search.",
    "calculator.state.synced": "Finance changes here stay synced with Reward Vault.",
    "calculator.state.projectMeta": "{type} • {status}",
    "calculator.toast.saved": "Project calculation saved.",
    "calculator.toast.saveError": "Failed to save project calculation.",
    "calculator.toast.projectUpdated": "Project details updated.",
    "calculator.toast.projectUpdateError": "Failed to update project.",
    "calculator.moneyHint": "All amounts on this page are shown in {currency}.",

    "rewardPanel.badge": "Premium payout stream",
    "rewardPanel.totalRealized": "Total realized",
    "rewardPanel.claimedProjects": "Claimed projects",
    "rewardPanel.bestPayout": "Best payout",
    "rewardPanel.latestRealized": "Latest realized",
    "rewardPanel.noClaimYet": "No claim yet",
    "rewardPanel.waitingReward": "Waiting reward",
    "rewardPanel.noPayoutYet": "No payout yet",
    "rewardPanel.recordedCount": "{count} payouts recorded",
    "rewardPanel.windowPayout": "Window payout",
    "rewardPanel.averageClaim": "Average claim",
    "rewardPanel.peakReward": "Peak reward",
    "rewardPanel.latestReward": "Latest reward",
    "rewardPanel.emptyTitle": "No realized rewards yet",
    "rewardPanel.emptyDescription": "Save your first claimed reward to start seeing the realized income timeline on this panel.",
    "rewardPanel.analysis": "Cashflow analysis",
    "rewardPanel.activeTimeline": "{count} realized payouts in active timeline",
    "rewardPanel.realizedPayout": "Realized payout",
    "rewardPanel.trendLine": "Trend line",
    "rewardPanel.latestDate": "Latest: {date}",
    "rewardPanel.avgClaimMeta": "Avg {value}",

    "airdropType.Testnet": "Testnet",
    "airdropType.AI": "AI",
    "airdropType.Quest": "Quest",
    "airdropType.Daily": "Daily",
    "airdropType.Daily Quest": "Daily Quest",
    "airdropType.Retroactive": "Retroactive",
    "airdropType.Waitlist": "Waitlist",
    "airdropType.Depin": "Depin",
    "airdropType.NFT": "NFT",
    "airdropType.Domain Name": "Domain Name",
    "airdropType.Deploy SC": "Deploy SC",
    "airdropType.DeFi": "DeFi",
    "airdropType.Deploy NFT": "Deploy NFT",

    "airdropStatus.Planning": "Planning",
    "airdropStatus.Ongoing": "Ongoing",
    "airdropStatus.Done": "Done",
    "airdropStatus.Dropped": "Dropped",

    "priority.Low": "Low",
    "priority.Medium": "Medium",
    "priority.High": "High",

    "rewardClaimStatus.Pending TGE": "Pending TGE",
    "rewardClaimStatus.Claimed": "Claimed",
    "rewardClaimStatus.Missed": "Missed",
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const getInitialLanguage = (): Language => {
  if (typeof window === "undefined") return DEFAULT_LANGUAGE;
  const storedLanguage = localStorage.getItem(LANGUAGE_KEY);
  return storedLanguage === "en" ? "en" : DEFAULT_LANGUAGE;
};

const getInitialUsdToIdrRate = () => {
  if (typeof window === "undefined") return DEFAULT_USD_TO_IDR_RATE;
  const storedRate = Number(localStorage.getItem(USD_TO_IDR_RATE_KEY));
  return Number.isFinite(storedRate) && storedRate > 0 ? storedRate : DEFAULT_USD_TO_IDR_RATE;
};

const applyLanguageToDocument = (language: Language) => {
  document.documentElement.lang = language === "id" ? "id" : "en";
};

const interpolate = (value: string, params?: TranslationParams) => {
  if (!params) return value;

  return value.replace(/\{(\w+)\}/g, (_, key: string) => {
    const nextValue = params[key];
    return nextValue == null ? "" : String(nextValue);
  });
};

const trimTrailingZeros = (value: string) =>
  value.includes(".") ? value.replace(/\.?0+$/, "") : value;

const formatCompactMagnitude = (value: number, locale: string) =>
  new Intl.NumberFormat(locale, {
    minimumFractionDigits: 0,
    maximumFractionDigits: Math.abs(value) >= 100 ? 0 : 1,
  }).format(value);

const formatStandardCurrencyValue = (
  value: number,
  currency: DisplayCurrency,
  locale: string,
  options?: CurrencyFormatOptions
) => {
  const absoluteValue = Math.abs(value);
  const defaultMaximumFractionDigits =
    currency === "USD"
      ? absoluteValue >= 1
        ? 2
        : 4
      : absoluteValue >= 1
        ? 0
        : 2;

  const defaultMinimumFractionDigits =
    currency === "USD"
      ? absoluteValue >= 1
        ? 2
        : 2
      : absoluteValue >= 1
        ? 0
        : 0;

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: options?.minimumFractionDigits ?? defaultMinimumFractionDigits,
    maximumFractionDigits: options?.maximumFractionDigits ?? defaultMaximumFractionDigits,
  }).format(value);
};

const formatCompactCurrencyValue = (
  value: number,
  currency: DisplayCurrency,
  locale: string,
  options?: CurrencyFormatOptions
) => {
  const absoluteValue = Math.abs(value);

  if (currency === "IDR") {
    const sign = value < 0 ? "-" : "";

    if (absoluteValue >= 1_000_000_000) {
      return `${sign}Rp${formatCompactMagnitude(absoluteValue / 1_000_000_000, locale)} miliar`;
    }

    if (absoluteValue >= 1_000_000) {
      return `${sign}Rp${formatCompactMagnitude(absoluteValue / 1_000_000, locale)} jt`;
    }

    if (absoluteValue >= 1_000) {
      return `${sign}Rp${formatCompactMagnitude(absoluteValue / 1_000, locale)} rb`;
    }
  }

  if (currency === "USD" && absoluteValue >= 1_000) {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
      notation: "compact",
      minimumFractionDigits: options?.minimumFractionDigits ?? 0,
      maximumFractionDigits: options?.maximumFractionDigits ?? 1,
    }).format(value);
  }

  return formatStandardCurrencyValue(value, currency, locale, options);
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(getInitialLanguage);
  const [usdToIdrRate, setUsdToIdrRate] = useState<number>(getInitialUsdToIdrRate);

  useLayoutEffect(() => {
    applyLanguageToDocument(language);
    localStorage.setItem(LANGUAGE_KEY, language);
  }, [language]);

  useEffect(() => {
    if (typeof window === "undefined") return undefined;

    const controller = new AbortController();

    const syncUsdToIdrRate = async () => {
      try {
        const response = await fetch("https://api.frankfurter.app/latest?from=USD&to=IDR", {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch USD/IDR rate: ${response.status}`);
        }

        const payload = (await response.json()) as { rates?: { IDR?: number } };
        const nextRate = payload.rates?.IDR;

        if (typeof nextRate === "number" && Number.isFinite(nextRate) && nextRate > 0) {
          setUsdToIdrRate(nextRate);
          localStorage.setItem(USD_TO_IDR_RATE_KEY, String(nextRate));
        }
      } catch (error) {
        if ((error as { name?: string })?.name !== "AbortError") {
          console.warn("Failed to refresh USD/IDR rate, using cached fallback.", error);
        }
      }
    };

    void syncUsdToIdrRate();

    return () => controller.abort();
  }, []);

  const setLanguage = useCallback((nextLanguage: Language) => {
    setLanguageState(nextLanguage);
    applyLanguageToDocument(nextLanguage);
    localStorage.setItem(LANGUAGE_KEY, nextLanguage);
  }, []);

  const t = useCallback(
    (key: string, params?: TranslationParams) => {
      const dictionary = translations[language];
      const fallbackDictionary = translations.en;
      const template = dictionary[key] ?? fallbackDictionary[key] ?? key;
      return interpolate(template, params);
    },
    [language]
  );

  const translateOption = useCallback(
    (scope: string, value: string) => {
      const key = `${scope}.${value}`;
      const dictionary = translations[language];
      const fallbackDictionary = translations.en;
      return dictionary[key] ?? fallbackDictionary[key] ?? value;
    },
    [language]
  );

  const locale = language === "id" ? "id-ID" : "en-US";
  const displayCurrency: DisplayCurrency = language === "id" ? "IDR" : "USD";
  const displayCurrencyLabel = language === "id" ? "Rupiah" : "USD";

  const convertFromUsd = useCallback(
    (value: number) => (displayCurrency === "IDR" ? value * usdToIdrRate : value),
    [displayCurrency, usdToIdrRate]
  );

  const convertToUsd = useCallback(
    (value: number) => (displayCurrency === "IDR" ? value / usdToIdrRate : value),
    [displayCurrency, usdToIdrRate]
  );

  const formatCurrency = useCallback(
    (value: number, options?: CurrencyFormatOptions) => {
      const displayValue = convertFromUsd(value);

      if (!Number.isFinite(displayValue)) {
        return "--";
      }

      if (options?.compact) {
        return formatCompactCurrencyValue(displayValue, displayCurrency, locale, options);
      }

      return formatStandardCurrencyValue(displayValue, displayCurrency, locale, options);
    },
    [convertFromUsd, displayCurrency, locale]
  );

  const formatCompactCurrency = useCallback(
    (value: number, options?: CurrencyFormatOptions) => {
      const displayValue = convertFromUsd(value);

      if (!Number.isFinite(displayValue)) {
        return "--";
      }

      return formatCompactCurrencyValue(displayValue, displayCurrency, locale, options);
    },
    [convertFromUsd, displayCurrency, locale]
  );

  const formatCurrencyInput = useCallback(
    (value: number, options?: { maximumFractionDigits?: number }) => {
      const displayValue = convertFromUsd(value);

      if (!Number.isFinite(displayValue)) {
        return "0";
      }

      const absoluteValue = Math.abs(displayValue);
      const maximumFractionDigits =
        options?.maximumFractionDigits ??
        (displayCurrency === "USD"
          ? absoluteValue >= 1
            ? 2
            : 4
          : absoluteValue >= 1
            ? 0
            : 2);

      return trimTrailingZeros(displayValue.toFixed(maximumFractionDigits));
    },
    [convertFromUsd, displayCurrency]
  );

  const formatNumber = useCallback(
    (value: number, options?: Intl.NumberFormatOptions) =>
      new Intl.NumberFormat(locale, options).format(value),
    [locale]
  );

  const formatDate = useCallback(
    (value?: string | Date | null, options?: Intl.DateTimeFormatOptions) => {
      if (!value) return "--";
      const parsed = value instanceof Date ? value : new Date(value);

      if (Number.isNaN(parsed.getTime())) {
        return String(value);
      }

      return parsed.toLocaleDateString(locale, {
        day: "2-digit",
        month: "short",
        year: "numeric",
        ...options,
      });
    },
    [locale]
  );

  const value = useMemo(
    () => ({
      language,
      locale,
      displayCurrency,
      displayCurrencyLabel,
      usdToIdrRate,
      setLanguage,
      t,
      translateOption,
      convertFromUsd,
      convertToUsd,
      formatCurrency,
      formatCompactCurrency,
      formatCurrencyInput,
      formatNumber,
      formatDate,
    }),
    [
      convertFromUsd,
      convertToUsd,
      displayCurrency,
      displayCurrencyLabel,
      formatCompactCurrency,
      formatCurrency,
      formatCurrencyInput,
      formatDate,
      formatNumber,
      language,
      locale,
      setLanguage,
      t,
      translateOption,
      usdToIdrRate,
    ]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useI18n() {
  const context = useContext(LanguageContext);

  if (context === undefined) {
    throw new Error("useI18n must be used within a LanguageProvider");
  }

  return context;
}
