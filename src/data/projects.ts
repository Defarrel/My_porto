// Urutan = urutan tampil. Isi `url` (repo / demo) kalau ada, nanti muncul tombol panah.
export type Project = {
  title: string
  year: string
  tags: string[]
  description: string
  url?: string
}

export const projects: Project[] = [
  {
    title: 'Indonesian Stock Movement Classification',
    year: '2026',
    tags: ['Python', 'XGBoost', 'Isolation Forest', 'DBSCAN'],
    description:
      'ML research: a two-stage pipeline (anomaly detection, then XGBoost) that classifies market direction for 700+ Indonesian stocks over 2 years. Up to 60% precision, +10–15% from feature engineering. Under review at INASS Journal.',
  },
  {
    title: 'Tauhid Kids',
    year: '2026',
    tags: ['Flutter', 'Dart', 'Game'],
    description:
      'Educational Flutter game for kindergarten students in Taiwan, used by 50+ kids. Built the UI, game logic and child-friendly animations; every milestone shipped on schedule.',
  },
  {
    title: 'MPP Queue App',
    year: '2025',
    tags: ['Backend', 'REST API'],
    description:
      'Backend for the public service mall queue at Diskominfo Bantul, serving hundreds of users a day. Designed 10+ REST endpoints for real-time queue operations.',
  },
  {
    title: 'Posyandu Dahlia App',
    year: '2025',
    tags: ['Flutter', 'Fullstack'],
    description:
      'Full system, frontend to database, for child health records at Posyandu Dahlia X in Karawang. 90%+ usability satisfaction in field testing.',
  },
  {
    title: 'Gloy Money',
    year: '2025',
    tags: ['Flutter', 'BLoC', 'MySQL', 'yfinance'],
    description:
      'Personal finance app with 7+ modules: budgeting, portfolios, retirement funds and real-time Indonesian stock prices.',
  },
]
