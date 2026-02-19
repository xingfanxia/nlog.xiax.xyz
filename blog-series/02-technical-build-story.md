---
title: "From 5 Standalone Apps to a Unified Platform in 29 Days"
date: "2026-02-18"
tags: ["panpanmao", "ai-development", "indie-hacker", "build-story"]
series: "Building PanPanMao: 1,134 Commits in 29 Days"
part: 2
---

# From 5 Standalone Apps to a Unified Platform in 29 Days

In [Part 1](/blog-series/01-why-zero-domain-knowledge), I explained why a big-tech engineer with zero knowledge of Chinese metaphysics decided to build a fortune-telling platform. Now let me tell you how it actually happened -- the technical build, the architectural decisions, the velocity data, and the AI-augmented workflow that made it all possible.

This is a story told in four phases, 1,134 commits, and a lot of dried fish treats.

## Phase 1: Monorepo Consolidation (Days 1-4) -- 188 Commits

### The Starting Point

I had five standalone Next.js apps, each in its own repo. BaZi (birth chart analysis), dream interpretation, Western astrology, a charting experiment, and Liuren divination. Each had its own Supabase setup, its own auth flow, its own Tailwind config, its own everything. If a user wanted to try both BaZi and dream interpretation, they'd need two separate accounts. That's not a platform -- that's a collection of prototypes.

Day 1 was Turborepo setup and migration. I chose Turborepo because I'd used it at Compute Labs and knew its caching model. The directory structure was standard monorepo fare:

```
panpanmao/
  apps/
    bazi/
    jiemeng/
    zhanxing/
    liuren/
    kline/
  packages/
    supabase/     # unified client + auth
    ui/           # shared components
    config/       # tailwind, eslint, tsconfig
```

Moving five apps into one workspace is conceptually simple. In practice, it took 21 commits on Day 1 just to get everything building. Import paths broke. Tailwind configs clashed. One app used `src/` directory structure, another didn't. The Supabase client was copy-pasted across all five with subtle, maddening differences.

### CSS Restoration Hell

Day 2 was 38 commits, and I'm fairly certain half of them have commit messages that say some variation of "fix css." When I unified the Tailwind configuration into `packages/config`, every app that relied on custom color tokens or non-standard extensions broke. Not in an obvious red-screen way -- in a subtle "the background is slightly wrong and why is that button 2px smaller" way. Each fix was trivial. There were dozens of them. They cascaded.

But by the end of Day 2, I'd also extracted four new shared packages: PDF generation, chat history management, shared chat UI components, and common React hooks. Watching duplicated code across five apps collapse into a single source of truth was deeply satisfying.

### The Unified API Layer

Day 4 was the big architectural win: 56 commits and the creation of `packages/api`. This was the unified API layer that standardized how all apps talk to AI models and manage server-side logic. Before this, each app had its own API routes with subtly different patterns. Some used streaming. Some didn't. Error handling was inconsistent.

The unified API package gave me:
- **52 API routes migrated** into a consistent pattern
- **SSE streaming standardization** -- every AI response now streams through the same pipeline regardless of which model is generating it
- **Unified rate limiting** based on user credits
- **Consistent error handling** with proper HTTP status codes

This was a Claude Code power move. I described the pattern I wanted, showed it one existing route as an example, and had it migrate all 52. An hour of wall-clock time. Doing this manually would have been a full day of mind-numbing copy-paste-adjust work.

By the end of Day 4, I also had GDPR compliance (data export, deletion requests), terms of service and privacy policy in both Chinese and English, and a DFA-based sensitive word filter for China-market content compliance. Four days. 188 commits. A unified platform where five separate apps had been.

## Phase 2: Testing, Branding, and Identity (Days 5-10) -- 247 Commits

### The Testing Sprint (Days 5-8)

I set up Vitest across the monorepo with Turborepo's cascading test runner. One command, every test suite. The priority order was deliberate:

1. **Shared packages first** -- the API layer, Supabase client, credit management. These are load-bearing walls.
2. **API route integration tests** -- actual endpoint calls with mock auth tokens.
3. **Core calculation logic** -- BaZi calculations, tarot card draws, dream symbol matching. I can't personally verify if a BaZi reading is "correct" (remember: zero domain knowledge), but I can verify deterministic outputs and that calculations match the reference materials Claude provided.

GitHub Actions CI pipeline: lint, type-check, build, test on every PR. Getting Turborepo's caching to play nice with GitHub Actions' caching was its own debugging adventure.

147 commits across four days. Not glamorous. But by the end, I had confidence the platform wouldn't explode when I started redesigning things.

### The Cat Emerges (Days 9-10)

This is where PanPanMao became PanPanMao. The product needed a name and a brand, and the cat theme emerged almost naturally.

盘盘猫: "Pan" (盘) means to analyze or calculate (as in 复盘, reviewing a game of Go). "Mao" (猫) is cat. The calculating cat. The fortune-telling cat. The cat that reads your fate.

Once the cat clicked, everything cascaded. Each app got a cat-themed name. The credit currency became 小鱼干 (dried fish treats) -- because what else would you pay a cat with? It's playful but not childish. It gives the entire platform a personality.

The landing page went through its first two iterations here. Version 1 was utilitarian: here are our products, here's pricing, sign up. Boring. I rebuilt it with a warm brown and gold palette -- earth tones that connect to Chinese metaphysics traditions -- and a tagline that Claude helped brainstorm: "千年智慧 x 现代AI" (Thousand-year wisdom times Modern AI).

Stripe integration went live. Three credit package tiers with the classic "Most Popular" badge on the middle tier and "Best Value" on the highest. Standard pricing psychology, but implementing it myself -- thinking about why these badges matter, how the price-per-credit differential affects perception -- was new territory for me.

100 commits in two days. A brand identity. A landing page. A payment system. And a name.

## Phase 3: Monetization and New Features (Days 12-19) -- ~300 Commits

### The Credit Economy Goes Live

The credit system was technically working, but "technically working" and "actually driving user behavior" are different things. This phase was about closing every gap.

**Anonymous-to-authenticated merging**: users could try one free reading without signing up, but the transition sometimes lost their history. Fixed with proper account merging -- anonymous session data migrates seamlessly to the real account.

**Cross-tab credit sync**: user buys credits in one tab, switches to another tab, sees old balance, thinks purchase failed, buys again. Fix: Supabase real-time subscriptions. When credits change in the database, every open tab updates within a second. Invisible polish that users never notice when it works.

**7 contextual upgrade triggers**: every place a user might run out of credits gets a tailored prompt. "Your free readings have been used" hits differently than "Unlock your complete analysis for 3 小鱼干." Same destination, different persuasion for different moments. Each trigger has a 24-hour cooldown to avoid being annoying.

**Referral system**: every user gets a unique referral code. Initially asymmetric rewards -- referrer gets 10 小鱼干, referee gets 3. This would change later based on user feedback, but it shipped and started driving organic signups immediately.

### Xiangshu: The Most Ambitious Feature

手相面相 (Xiangshu) -- palm reading and face reading using AI vision -- was the technical highlight of the entire project.

The stack: **MediaPipe** runs in the browser for hand landmark detection (21 points) and face mesh (468 points). No server round-trip for detection. The user sees real-time overlays -- green dots on palm lines, mesh on facial features -- providing immediate feedback that the AI is seeing them correctly. The overlay renders on a canvas layer over the video feed at 30fps, throttled to every other frame on mobile to avoid cooking older phones' CPUs.

Once the user captures an image, it goes to Claude or Gemini with an extensive prompt about what to analyze. The prompt engineering was the hardest part. You can't just send an image and say "read this palm." You need to guide the AI through the three major palm lines (life, head, heart), the mounts, finger proportions. For face reading: the 五官 (five features), face shape, proportion ratios. All of this domain knowledge was researched with Claude and then encoded into structured prompts.

Four days from zero to production. MediaPipe integration, camera handling, canvas overlays, multimodal AI analysis, and full UI with credit integration.

### The Landing Page Redesign

Midway through building Xiangshu, I looked at the warm brown/gold landing page and realized it was wrong. The products were getting more serious -- palm reading, BaZi analysis, annual fortune forecasting. Users come with real life questions. Career decisions. Relationship anxieties. "Cozy" undermined the gravity of what they cared about.

Full redesign to dark luxury. Deep blacks and dark grays. Gold accents. Elegant typography. High contrast. The cat branding stayed, but the cat now felt like a mysterious oracle, not a cute mascot. Every component rebuilt in a day.

## Phase 4: The Milestone Rush (Days 20-27) -- ~400 Commits

This is where things got intense.

### Three Milestones in Four Days (Days 20-23)

I introduced formal milestones and a PR workflow. PRs #2 through #18 happened in a four-day window. 166 commits. Each milestone was a coherent, shippable increment:

- **M1: Credit Economy Foundation** -- Auth fixes, cross-tab sync, payment gates, redeem codes, referral finalization
- **M2: Daily Hub** -- Pre-generated daily content (tarot card, zodiac fortune, BaZi day pillar) via midnight cron job. This was the retention play. Fortune-telling apps are event-driven -- users come when they have a question, then leave. The Hub gives them a reason to open the app every day.
- **M3: Distribution** -- PostHog analytics integration, admin dashboard, monitoring tools

The architectural decision in M2 deserves attention: **pre-generation, not on-demand**. Content is generated at midnight Beijing time and stored in Supabase. When a user opens the Hub at 8 AM, it's instant. No spinner. The difference between "instant content" and a 3-second loading state was dramatic for perceived quality. Instant feels authoritative. Loading feels like the app is making things up.

### Peak Day: 98 Commits and Three New Products (Day 27)

This was the single most productive day. One commit every 9 minutes for 15 hours. Three completely new products went from zero to production:

**起名 (Qiming) -- AI Child Naming.** Chinese baby naming is serious business. Names connect to the child's BaZi, Five Elements balance, stroke count numerology, and family naming conventions. The AI calculates the child's elemental profile, identifies which elements need strengthening, and generates name suggestions where each character's element, stroke count, and meaning align. About 4 hours from concept to production.

**配对 (Peidui) -- Name Compatibility Analysis.** Analyzes compatibility between two people based on their names and birth information. BaZi interaction, Five Elements compatibility, Day Pillar harmony. Shareable, fun, and addresses the most common fortune-telling use case: relationship questions.

**流年运程 (Liunian) -- Annual Fortune Forecast.** Personalized 2026 forecast based on the user's BaZi and how the year's energy (丙午, Fire Horse) interacts with their personal chart.

By the third product, the pattern was almost mechanical. The API structure, UI patterns, credit integration, Hub card format -- all established conventions. New products were like filling in a template. This is the compounding effect of good architecture: the first few products are hard, each new one gets easier.

## The AI-Augmented Workflow

The `claude/` and `codex/` branches scattered throughout the git history are the visible proof of how this was built. These are branches where AI coding agents proposed changes that I reviewed and merged.

The workflow was not "AI writes code, human ships it." It was:

1. **I describe** the product concept and technical requirements
2. **Claude Code creates** the API endpoint, following established patterns
3. **While reviewing**, another session builds UI components
4. **I adjust** the domain-specific parts -- prompts where accuracy and tone matter
5. **Integration testing**, credit hookup, Hub card creation
6. **Deploy**

My role shifted from "writer of code" to "director of code." I was architecting, reviewing, testing, and course-correcting. The AI was the execution engine. The human was the quality gate and the product brain.

**Conservative estimate: 97% of the code was AI-assisted.** That's visible in the git history. But "AI-assisted" does not mean "AI-autonomous." Every line passed through my review. Every architectural decision was mine. Every domain-specific prompt was hand-tuned. The AI multiplied my ability to explore, iterate, and ship. It did not replace the need for judgment.

Here's an insight that surprised me: the AI was more consistent than I am. When I established a pattern for API endpoints -- input validation, credit check, AI call, response formatting -- Claude applied that pattern more uniformly to new endpoints than I would have. Humans get bored with repetitive patterns and start cutting corners. AI doesn't.

## The Multi-Model AI Pipeline

PanPanMao uses both Claude and Gemini, and the model selection isn't arbitrary:

- **Gemini** for extraction and structured data. When a user uploads a palm photo, Gemini handles the initial visual analysis and landmark identification. It's fast and good at structured output.
- **Claude** for deep analysis and nuanced generation. The actual fortune readings, the BaZi interpretations, the dream analysis -- these need the kind of nuanced, contextual generation that Claude excels at.

Model selection is managed through PostHog feature flags, which means I can A/B test model combinations and switch between them without code changes. Some users get Claude-only readings. Some get the Gemini-extraction-then-Claude-analysis pipeline. I track quality feedback to determine which pipeline produces better user satisfaction.

## The Velocity Numbers

Here's the raw data:

| Metric | Value |
|--------|-------|
| Total duration | 29 days |
| Total commits | 1,134 |
| Average commits/day | 39 |
| Peak day commits | 98 |
| Zero-commit days | 0 |
| Product verticals shipped | 9 |
| API endpoints | 85 |
| Approximate LOC | 284,000 |
| Shared monorepo packages | 8+ |
| API routes migrated in consolidation | 52 |
| Landing page redesigns | 3 |
| GitHub PRs | 18+ |

The commit type breakdown tells its own story: roughly 23% are `feat` (new features), 38% are `fix` (bug fixes and adjustments), and the rest are refactors, docs, chores, and tests. That 38% fix ratio might look high, but it's normal for rapid iteration. You ship fast, you find issues fast, you fix them fast. The ratio would be concerning in a slow-moving project. In a 39-commits-per-day project, it means the feedback loop is tight.

Zero "zero days" across 29 consecutive days. Some days were 17 commits (focused feature work). Some were 98 (sprint days). But every single day moved the product forward. That consistency matters more than the peaks.

## Architecture at a Glance

By the end of Day 29, the system looked like this:

```
panpanmao/
  apps/
    bazi/          # BaZi birth chart analysis
    jiemeng/       # Dream interpretation
    zhanxing/      # Western astrology + tarot
    liuren/        # Liuren divination
    kline/         # Life K-line chart
    mbti/          # MBTI personality analysis
    xiangshu/      # Palm + face reading
    qiming/        # Child naming
    peidui/        # Name compatibility
  packages/
    api/           # Unified API layer (85 endpoints)
    supabase/      # DB client, auth, real-time
    ui/            # Shared UI components
    config/        # Tailwind, ESLint, TypeScript configs
    credits/       # Credit economy logic
    ai-providers/  # Claude + Gemini abstraction
    security/      # DFA content filter, rate limiting
    pdf/           # Report generation
    chat/          # Shared chat components
    hooks/         # Common React hooks
    history/       # Conversation history
```

The shared packages are the secret weapon. When I add a new product vertical, I get auth, credits, AI model selection, content filtering, streaming, error handling, and UI components for free. The marginal cost of a new product is almost entirely prompt engineering and domain-specific UI. The infrastructure cost is zero.

This is why three products could ship in a single day. Not because the code was simple -- each product has real business logic, real AI pipelines, real database operations. But because the platform handles the cross-cutting concerns, and the AI handles the boilerplate.

## What Made This Possible

Let me be direct about what enabled this velocity. It wasn't genius architecture. It wasn't heroic effort. It was three things:

1. **A mature AI coding workflow.** Claude Code and Codex aren't autocomplete. They're agents that read context, follow patterns, and execute across files. The difference between "AI writes a function" and "AI migrates 52 API routes to a new pattern" is the difference between a toy and a tool.

2. **A good monorepo foundation.** The investment in shared packages during Phase 1 paid compound returns. Every new feature benefited from every previous feature's infrastructure.

3. **Willingness to ship imperfect.** The first version of everything was rough. The first landing page was boring. The first credit flow had bugs. The first BaZi reading prompts were too formal. But each version shipped, got feedback, and improved. Shipping beats polish, always.

In [Part 3](/blog-series/03-lessons-learned), I'll share the honest lessons -- what surprised me about product work, what I got wrong about AI-augmented development, and what this project taught me about the future of solo building.
