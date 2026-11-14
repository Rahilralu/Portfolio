# Muhammed Rahil Nazar — Portfolio

Personal portfolio for **Muhammed Rahil Nazar**, full stack developer (Kochi, India). Built with **Nuxt 3 + Vue 3 + TypeScript** and generated as a **static site** for Cloudflare Pages. All content, copy and artwork are Rahil's own.

## Run it

```bash
cd new
npm install
npm run dev          # http://localhost:3000
npm run typecheck    # vue-tsc, keep it clean
npm run generate     # static build -> .output/public
npm run preview      # serve the built site
```

**Deploy to Cloudflare Pages:** build command `npm run generate`, output directory `.output/public`. Optional env var `NUXT_PUBLIC_CLARITY_ID` turns on Microsoft Clarity analytics (see `.env.example`).

## What's on the site

### Home page (`pages/index.vue`)
| Section | What it does |
|---|---|
| **Loader** | Stacked colour pills for the four doors plus a 000–100 counter, then slides away. |
| **Header** | Nav (Home, Frontend, Backend, AI & RAG, UI/UX, LeetCode, My story, Contact), a menu button for small screens, and a full-screen nav overlay. |
| **Pull cord** | A hanging cord with pendulum physics. Tap it, or flick it down, to switch light/dark mode; the new theme spreads from the bulb as a circle. |
| **Hero** | "Hi, I'm Rahil. I am a …" with a split-flap calendar that cycles Full Stack Developer, Frontend Developer, Backend Engineer, AI Builder, UI/UX Designer; portrait, Hire me / See my work / Resume buttons, status bar. |
| **Doors** | Four doors (Frontend, Backend, AI & RAG, UI/UX). Hovering fades the others and shows what's behind it; clicking presses the lever, swings the door inward and zooms you through into that skill's room. |
| **LeetCode** | Animated ring and Easy/Medium/Hard bars for `@Rahil_ralu`. The numbers refresh themselves every hour (see *LeetCode auto-sync* below). |
| **My story** | Sticky odometer year, a canvas of clock dials behind it that winds back as you scroll, a travelling dot on the timeline, and a rewinding clock icon. |
| **Footer** | "Need something built?" call to action, links, resume download, and `rahilralu` across the full width. |

### Skill rooms (`components/WorkRoom.vue`)
Full-screen pages you walk into from a door, each with the skill list and project cards (screenshot, description, stack, live link, GitHub link). The nav bar and footer stay available inside every room, and links from inside a room back out, switch rooms, or scroll home.

### Other
- **Contact modal:** five questions (what, budget with USD/GBP/INR, when, who, contact details) that end by opening the visitor's email app with the message filled in (`mailto:`). Includes a hidden spam-trap field.
- **Privacy & credits** page at `/legal`, with the same nav and footer.
- **Resume:** `public/Muhammed_Rahil_Nazar_Resume.pdf`, linked from the hero and footer.
- Back-to-top button with a scroll-progress ring; route changes fade and lift; respects `prefers-reduced-motion`.

## Projects shown

| Project | Room | Links |
|---|---|---|
| CogniHR (Cognifyr HR platform, Vue + Nuxt 3) | Frontend | — |
| cognifyr.co (company website, Vue) | Frontend | [live](https://cognifyr.co/) |
| ACES CUSAT website | Frontend | [live](https://www.acescusat.tech/) |
| Real Estate Platform (Nuxt 4, Cloudflare Workers + D1) | Frontend, Backend | [live](https://real-estate.nazarrahil0000.workers.dev/) (private repo) |
| Subscription Management System ("Brightloop") | Frontend | [live](https://15-207-220-121.sslip.io/) |
| Fundo (college event payments) | Backend | [live](https://fundo-doe.pages.dev/), [GitHub](https://github.com/Rahilralu/Fundo) |
| Centronne (ERP lead-to-cash) | Backend | — |
| FlowDesk AI (AI request routing) | AI & RAG | [live](https://flowdesk-ai-4h1.pages.dev/), [GitHub](https://github.com/Rahilralu/FlowDesk-AI) |
| Agentic Math Tutor (Hackstreet hackathon) | AI & RAG | [GitHub](https://github.com/Hackstreet-hackathon/agentic-math-tutor) (may be private) |
| Financial RAG, Echo (hackathons) | AI & RAG | — |
| osci.osconnect.org, nexfellow.com redesigns | UI/UX | — |

## Timeline

2026 — Now **Software Engineer Intern** (hybrid, part-time) at Centric Innovation · Aug 2026 — Now **DSA Tutor**, ACES CUSAT · Jun 2025 — Oct 2026 **Full Stack Web Developer Intern**, Cognifyr · Jun 2025 — May 2026 **Web Developer**, ACES CUSAT · May — Jun 2025 **UI/UX Design Intern**, PHICSIT InfoTech · 2024 — 2028 **B.Tech, Computer Science**, CUSAT (CGPA 8.82).

## Editing content

Almost everything is data in **`composables/useContent.ts`**: `profile`, `roles`, `doors` (skills and project cards), `doorInfo` (hover text), `story` (timeline) and `leetcode` (profile link and colours; its counts come from `data/leetcode.json`). Screenshots go in `public/` and are referenced by a project's `image`. A card can have a `link` (live site, opens when the screenshot is clicked) and an optional `repo` (GitHub button).

## Structure

```
new/
├─ app.vue                 global layers + the "ready" flag that starts the entrance animations
├─ pages/                  index.vue, legal.vue
├─ components/             Hero, FlipCal, Doors, WorkRoom, Story, LeetCode, Footer, TopBar,
│                          NavOverlay, PullCord, ContactModal, Loader, BackToTop
├─ composables/            useContent.ts (all content), useUi.ts (modal, nav, theme, scroll, door state)
├─ plugins/lenis.client.ts smooth scrolling
├─ assets/css/main.css     design tokens, light/dark themes, reveal system
└─ public/                 portrait, project screenshots, self-hosted Onest font, resume
```

For how the door walk-in and navigation work, and what is easy to break, see `../CLAUDE.md`.

## LeetCode auto-sync

The LeetCode numbers live in **`data/leetcode.json`** (solved, total, and Easy/Medium/Hard counts), not in code. A GitHub Actions workflow (`.github/workflows/leetcode-sync.yml`) runs every hour, runs `scripts/sync-leetcode.mjs` to read the public profile, and commits the file only if the numbers changed. That push makes Cloudflare Pages rebuild, so a new solve appears on the site within about an hour. Nothing to configure: pushing the workflow to `main` is enough.

- Run it by hand: `node scripts/sync-leetcode.mjs` (Node 20+), or Actions, *LeetCode sync*, *Run workflow*.
- The username comes from `leetcode.user` in `useContent.ts` (override with `LEETCODE_USER`).
- If LeetCode is unreachable or returns something odd, the file is left alone and the run fails, so GitHub emails you; the site keeps the last good numbers.
- GitHub pauses scheduled workflows after about 60 days without repo activity; re-enable it in the Actions tab if that happens.

## Things to know

- The Real Estate and FlowDesk screenshots are their **sign-in pages**, since the apps need an account.
- FlowDesk's backend runs on Render's free tier and **sleeps when idle**, so its live link can spin for a while on the first visit.
- The resume PDF contains a phone number.
- `repos` in `useContent.ts` holds the GitHub repo list; nothing renders it now (the standalone Projects section was removed).
- Several projects have short, generic descriptions because their repos are private or undescribed. Better one-liners can replace them in `useContent.ts`.
- Not added yet: a LeetCode streak (no figures were supplied).
