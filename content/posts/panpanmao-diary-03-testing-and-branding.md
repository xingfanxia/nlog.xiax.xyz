---
title: "Days 5-10: From Code to Product (Testing, Landing Page, and the Cat Theme)"
date: "2026-01-30"
summary: "PanPanMao build diary Days 5-10: Vitest testing sprint, the birth of the PanPanMao cat brand, landing page design, Stripe integration, and credit economy with dried fish treats."
tags: ["AI", "Software Development"]
series: "Building PanPanMao"
part: 3
type: "Post"
status: "Published"
---

The first week was infrastructure. This week was about transforming a monorepo into something that looks and feels like a real product.

## Days 5-8: The Testing Sprint — 147 Commits

Set up Vitest across the monorepo. My testing priority order was deliberate:

**1. Shared packages first** — the API streaming helper, Supabase client, credit management. These are load-bearing walls. If `createAIStreamResponse()` has a bug, all 15 streaming routes break. If credit deduction races, users get free readings or double-charged. 36 tests for the streaming helper alone, covering every code path: successful stream completion, mid-stream errors with credit refund, content filter truncation, SSE event formatting.

**2. Domain calculation logic** — BaZi calculations, tarot card draws, Liuren divination rolls. I can't personally verify correctness (zero domain knowledge), but I can verify deterministic behavior: same birth data always produces same chart, same deck shuffle always produces expected distribution, same hexagram always maps to same meaning.

**3. API route integration tests** — mock auth tokens, verify credit deduction, confirm SSE event format matches frontend expectations.

GitHub Actions CI pipeline: lint → type-check → build → test. Every PR gets the full treatment. This sounds standard, but for a solo developer it's the difference between "I think this works" and "I know this works."

147 commits across 4 days. Not glamorous. By the end I had confidence the platform wouldn't explode when I started making changes faster.

## Days 9-10: Branding and Monetization — 100 Commits

### The Cat Theme

PanPanMao (盼盼猫). The calculating cat. The fortune-telling cat.

Once the cat theme clicked, everything cascaded. Each app got a cat-themed treatment. The credit currency became dried fish treats (小鱼干). Because what else would you pay a fortune-telling cat with?

The brand decision was a product decision, not a marketing decision. Fortune-telling can feel intimidating or scammy. The cat makes it approachable. Users share results because they're fun, not because they're "accurate." This distinction matters for virality.

### Stripe Integration

Four credit packages with the classic pricing psychology:

- 10 credits / $6.99 (entry tier)

- 50 credits / $24.99 (volume discount)

- 150 credits / $59.99 — **Most Popular** badge (anchor tier)

- 500 credits / $149.99 (power user)

The "Most Popular" badge isn't just a label — it's a pricing anchor. When I later tested removing it, conversion on that tier dropped noticeably. Bundle psychology is real.

I priced credits so each reading costs roughly $0.40-$1.10 USD. The credit abstraction matters: people are more willing to spend 5 fish treats than $0.70. The currency rename from "credits" to "小鱼干" reduced perceived spending friction.

### The Landing Page v1

Warm brown and gold tones. Mobile-first. "Thousand-year wisdom x Modern AI" tagline. Claude helped with Chinese copywriting — the tagline came from a brainstorming session where I evaluated 20 options.

This landing page would later be completely redesigned to dark luxury (Days 12-19) because "cozy" undermined the gravity users expected from a fortune-telling platform.

## What I Learned This Week

**Testing is an investment, not a cost.** It paid for itself immediately during the branding refactors. Changing themes, renaming credit currencies, updating UI copy across 6 apps — the test suite caught three regression bugs I would have shipped.

**Brand is a product decision.** The cat theme made the platform approachable in a domain that can feel intimidating. It changed how users interacted with the product.

**Pricing is psychology, not math.** I spent more time on credit package naming than on the payment flow code.

**AI for domain branding works.** Claude generated Chinese copywriting I couldn't have written myself. The bilingual (zh-CN/zh-TW/en) i18n support across the entire platform was AI-translated and human-reviewed.
