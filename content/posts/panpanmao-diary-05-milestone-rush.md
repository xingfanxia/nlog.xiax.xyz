---
title: "Days 20-23: Shipping M1, M2, M3 in Four Days"
date: "2026-02-12"
summary: "PanPanMao build diary Days 20-23: 166 commits, 3 formal milestones, 17 PRs. Credit economy foundation, Daily Hub with pre-generated content, and PostHog analytics."
tags: ["AI", "Software Development"]
series: "Building PanPanMao"
part: 5
type: "Post"
status: "Published"
---

166 commits in four days. Three formal milestones shipped. 17 PRs merged. This was the stretch where the project stopped being about building features and started being about building a business.

## The Milestone Framework

I introduced milestones — coherent, shippable increments with clear before/after states. Also started using PRs properly. Solo developer reviewing own PRs sounds silly, but they serve three real purposes: documentation of intent, diffable change history, and a forcing function to articulate what you're shipping and why.

Every PR got a structured description: Summary, Changes table, Test plan with checkboxes. The discipline pays off when you need to understand "why did I change this" three weeks later.

## M1: Credit Economy Foundation (PR #2 — 100 files changed)

The transition from "free product" to "free trial with purchase option." The hardest technical challenges:

### Anonymous-to-Authenticated Merging

New users start as anonymous Supabase users — no signup friction. They can browse, use free credits, save readings. When they later sign in (Google OAuth, email, or redeem code), everything needs to merge: credit balance, saved readings, chat history, referral associations.

The redeem code flow is a state machine: `idle → checking → redeeming/logging_in → success/error`. The `RedeemCodeInput` component auto-formats `PPM-XXXX-XXXX` input and handles the full lifecycle. When an anonymous user enters a code, the backend sets code-as-password credentials on their anonymous account — the code IS their login for returning later.

PR #103 later fixed a race condition: the `liunian` app type was missing from the `llm_costs_app_check` constraint, causing INSERT failures in production when users tried the annual fortune feature.

### Cross-Tab Credit Sync

The bug: buy credits in one tab, switch to another tab, see old balance, think purchase failed, buy again. Double charge.

The fix: Supabase real-time subscriptions. Every tab subscribes to the user's credit balance changes. When one tab deducts or adds credits, every other tab updates within a second. Sounds simple, but getting the subscription lifecycle right (subscribe on mount, unsubscribe on unmount, handle reconnection after tab sleep) required careful state management.

### 7 Contextual Upgrade Triggers

The `UpgradePrompt` component has 7 trigger types, each tailored to its emotional moment:

- Credit-depleted mid-reading (high urgency, high intent)

- Daily hub browse with low balance (low urgency, awareness)

- Post-reading satisfaction (positive moment, upsell)

- Referral prompt (social, give-a-gift framing)

- First-time feature discovery (curiosity, trial-to-paid)

Plus card and banner variants, and a 24-hour dismiss cooldown so users don't feel harassed.

## M2: Daily Hub (PR #4 — 100 files changed)

The engagement architecture. Fortune-telling is event-driven: users come when they have a question, get an answer, leave. The Daily Hub gives a reason to come back every day.

Five cards: BaZi day-pillar fortune, zodiac horoscope, tarot card-of-the-day, Chinese almanac, divination prompt. Each with custom CSS theme classes.

### The Pre-Generation Architecture

Key decision: **generate content at midnight Beijing time via cron, not on-demand.** The `/api/cron/daily-content` endpoint generates BaZi and zodiac fortunes via Gemini AI, stores them in a `daily_content` table with 7-day auto-cleanup.

When a user opens the Hub at 8 AM, the content is already there. Instant load. No spinner. The perceived quality difference between instant and a 3-second loading state was dramatic. This is a product insight disguised as an architecture decision.

The cron endpoint uses constant-time XOR for secret comparison (security audit finding), IP-based rate limiting (30 req/min), and Asia/Shanghai timezone consistency.

### Zhanxing (Astrology) Overhaul

Also in this PR: complete i18n overhaul for the astrology module. A 347-line trilingual dictionary (zh-CN/zh-TW/en) for planets, signs, aspects, houses, and 70+ result page strings. The natal chart wheel was redesigned with gold-on-dark aesthetic, degree tick marks, Chinese planet/sign labels, and interactive tooltips. 78 tests for chart math and placement functions.

### Synastry (Compatibility) Persistence

New `synastry_readings` table with encrypted birth info, full save/load/chat flow, and history API integration. Birth data encryption was a security requirement — synastry readings contain two people's birth information.

## M3: Distribution (PR #10 — 11 files changed)

PostHog integration. Event tracking for code redemption with `after()` to avoid blocking the redemption response. Cleaned up stale admin routes that had been superseded by the admin dashboard.

The smaller PR, but the one that closed the feedback loop: now I could see what users actually did, not what I assumed they did.

## The Shift

Before M1-M3: "What feature should I build next?"

After M1-M3: "What behavior should I drive next?"

Conversion funnels. Retention hooks. Daily engagement. Referral incentives. These aren't engineering problems. They're business problems that happen to require engineering. And for the first time, I'm thinking about user retention instead of feature lists.
