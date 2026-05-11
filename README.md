# pod Admin Dashboard

A production-ready Next.js 14 admin dashboard with full light/dark mode support, built with Tailwind CSS.

## Tech Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS** (with custom design tokens)
- **Recharts** (for analytics charts)
- **Lucide React** (icons)

## Getting Started

### 1. Install dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
```

### 2. Add fonts (optional but recommended)

Download Geist fonts from [vercel.com/font](https://vercel.com/font) and place them at:
- `app/fonts/GeistVF.woff`
- `app/fonts/GeistMonoVF.woff`

Or swap to Google Fonts in `app/layout.tsx` — just replace the `localFont` config with a `next/font/google` import.

### 3. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — it redirects to `/dashboard`.

---

## Project Structure

```
pod-dashboard/
├── app/
│   ├── globals.css           # Design tokens, base styles
│   ├── layout.tsx            # Root layout with ThemeProvider
│   ├── page.tsx              # Redirects to /dashboard
│   └── dashboard/
│       ├── page.tsx          # Main dashboard page
│       ├── analytics/
│       ├── users/
│       ├── orders/
│       └── ... (all sections)
│
├── components/
│   ├── layout/
│   │   ├── ThemeProvider.tsx  # Light/dark theme context
│   │   ├── Sidebar.tsx        # Collapsible sidebar navigation
│   │   ├── Topbar.tsx         # Header with search, theme toggle, notifications
│   │   └── DashboardShell.tsx # Layout wrapper
│   │
│   ├── dashboard/
│   │   ├── VisitorChart.tsx   # Area chart for traffic
│   │   ├── TopPages.tsx       # Top pages table
│   │   ├── VisitorsByCountry.tsx
│   │   └── LiveVisitors.tsx   # Real-time visitor counter
│   │
│   └── ui/
│       ├── Logo.tsx           # pod logo (light + dark variants)
│       ├── StatCard.tsx       # Reusable metric card
│       └── PlaceholderPage.tsx
│
├── lib/
│   └── utils.ts              # cn(), formatCurrency, formatNumber
│
└── tailwind.config.ts        # Custom tokens, animations
```

---

## Customisation

### Colors

The green accent (`#22c55e`) and purple chart color (`#a855f7`) match the original pod design. Change them in:
- `tailwind.config.ts` → `theme.extend.colors`
- `app/globals.css` → CSS variables (`--accent`, `--purple`)

### Logo

Two variants are exported from `components/ui/Logo.tsx`:
- `<Logo />` — adapts to light/dark theme automatically
- `<LogoDark />` — always white text (for dark backgrounds)

Props: `variant="full" | "icon"`, `size="sm" | "md" | "lg"`

### Adding new nav sections

Edit the `navSections` array in `components/layout/Sidebar.tsx`. Each item supports:
```ts
{ label: string, href: string, icon: LucideIcon, badge?: number | string }
```

### Theme

Theme is persisted in `localStorage` under the key `pod-theme`. It also respects the OS preference on first load.

---

## Building for Production

```bash
npm run build
npm start
```

---

## License

MIT
