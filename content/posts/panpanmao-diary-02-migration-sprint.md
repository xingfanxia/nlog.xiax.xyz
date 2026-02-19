---
title: "Days 2-4: The Monorepo Migration Sprint (111 Commits in 3 Days)"
date: "2026-01-24"
summary: "PanPanMao build diary Days 2-4: CSS restoration hell, extracting shared packages, adding MBTI app, WeChat browser detection, and the unified API layer with 52 migrated routes."
tags: ["AI", "Software Development"]
series: "Building PanPanMao"
part: 2
type: "Post"
status: "Published"
---

Three days. 111 commits. And I'm pretty sure half of them have commit messages that just say "fix css."

## Day 2: CSS Restoration Hell — 38 Commits

When I unified the Tailwind config into `packages/config`, every app that relied on custom design tokens broke. Not in an obvious "red error screen" way. In a subtle "the background is slightly wrong and why is that button 2px smaller" way.

The problem: each app had evolved its own CSS variable namespace. BaZi used `--bz-*` tokens. Tarot used `--tarot-*`. Astrology used `--zx-*`. Unifying the Tailwind config meant these all had to coexist without collision, while still allowing each app its own visual identity.

38 commits. Each one fixing some CSS gap I'd missed. But by the end I'd also extracted 4 new shared packages: PDF generation, chat history, shared chat UI, and common React hooks.

The package extraction was the real win. Three apps each had their own `ChatPanel` component with slightly different implementations. Three apps each had PDF export code with the same html2canvas workflow. Extracting these into `packages/ui` and `packages/pdf` meant a single fix would propagate everywhere.

## Day 3: App #6 and WeChat Detection — 17 Commits

Added MBTI personality test as the sixth app. Easier to integrate because I built it knowing it would go into the monorepo — it used the shared packages from day one.

The more interesting challenge was WeChat browser detection. A massive percentage of Chinese internet traffic goes through WeChat's built-in browser, which has quirks: limited `getUserMedia` support, different OAuth flow requirements, restricted `window.open` behavior. The user agent sniffing needed to check for `MicroMessenger` across Android, iOS, and desktop variants, plus the WeChat Work variant (`wxwork`).

Later (PR #41), this detection got hardened further when real devices exposed false negatives — some WeChat versions embed a different UA string than documented.

## Day 4: The Big Day — 56 Commits

### The Unified API Package

The biggest architectural win of the entire project. `packages/api` standardized how all apps talk to AI models.

Before: each app had its own streaming route with ~80 lines of boilerplate for `ReadableStream` setup, SSE event formatting, error handling, and credit deduction. Duplicated 15+ times.

After: `createAIStreamResponse()` — a single helper that takes a config object with lifecycle hooks:

- `initEvents` — emit initial data before AI streaming starts

- `onComplete` — save results, log costs

- `onError` — handle failures gracefully

- `refundCreditsOnError` — automatically refund if the stream dies

52 API routes migrated into this pattern. Claude Code did the migration by looking at one example and applying it to the rest. An hour of wall-clock time vs. what would have been a full day manually.

### The Content Filter v1

Also built on Day 4: a DFA-based sensitive word filter. This is critical for the China market. Metaphysics content naturally includes terms that trigger naive keyword filters — 算命 (fortune-telling), 破财 (wealth loss), 桃花劫 (romantic disaster). A standard profanity filter would block half our legitimate content.

The DFA (Deterministic Finite Automaton) approach builds a trie from the word list and streams through text character by character. This version blocked entire messages containing sensitive words — later iterations would get more sophisticated.

### GDPR and Legal

Knocked out bilingual terms of service and privacy policy. Not glamorous, but necessary. These would later be completely rewritten (PR #83) with separate Chinese and English versions and China AI regulatory compliance clauses.

### The Moment

Around 11 PM I started all 6 apps locally, logged in with one account, and watched credits sync across tabs. One login. One credit balance. Six products. It actually worked.

Three days ago I had 5 separate apps. Now I had one platform.
