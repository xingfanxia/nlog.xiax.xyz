---
title: "Days 5-10: From Code to Product (Testing, Landing Page, and the Cat Theme)"
date: "2026-01-30"
tags: ["panpanmao", "build-diary", "ai-development"]
series: "Building PanPanMao"
part: 3
---

# Days 5-10: From Code to Product (Testing, Landing Page, and the Cat Theme)

The first week was infrastructure. This week was about transforming a monorepo full of apps into something that looks and feels like a real product. It went from "my side project" to "wait, I'd actually pay for this."

## Days 5-8 (Jan 25-28): The Testing Sprint — 147 Commits of Stabilization

I know, I know. Testing isn't sexy. But I've shipped enough production code to know that without tests, you're just building a house of cards that collapses the moment you refactor anything.

Set up Vitest across the monorepo. The beauty of Turborepo is that `turbo run test` cascades through all packages and apps. One command, every test suite.

The test coverage priority was:
1. **Shared packages first** — the API layer, Supabase client, credit management. These are the load-bearing walls. If a shared package breaks, every app breaks.
2. **API routes** — integration tests that actually call the endpoints with mock auth tokens and verify responses.
3. **Core calculation logic** — the BaZi calculations, the tarot card draws, the dream symbol matching. This is where domain correctness matters most. I can't personally verify if a BaZi reading is "correct" (remember: zero domain knowledge), but I can verify that the same inputs produce the same outputs, and that the calculations match the reference materials Claude provided.

GitHub Actions CI pipeline: lint, type-check, build, test. Every PR gets the full treatment. Took about a day to get the pipeline right because Turborepo's caching interacts weirdly with GitHub Actions' caching and getting them to play nice was its own debugging adventure.

147 commits across 4 days. Most of them are small — fix a test, adjust a mock, handle an edge case. Not glamorous work. But by the end I had reasonable confidence that the platform wouldn't explode when I started changing things.

## Days 9-10 (Jan 29-30): The Fun Part — 100 Commits of Branding

This is where everything changed. I went from "engineer building a side project" to "product person crafting an experience." And honestly? It was more fun than I expected.

### The Cat Theme

The product needed a name and a brand. I'd been calling it various things internally, but nothing stuck. Then the cat theme emerged.

PanPanMao. 盘盘猫. "Pan" means to analyze/calculate (as in 复盘, reviewing a game). "Mao" is cat. So: the calculating cat. The fortune-telling cat. The cat that reads your fate.

Once the cat theme clicked, everything cascaded. Each app got a cat-themed name. The credit currency became 小鱼干 — dried fish treats. Because what else would you pay a cat with? It's playful but not childish. It gives the whole platform a personality.

This is something I never would have thought about as a pure engineer. Brand isn't just a logo. It's how every element of the product feels cohesive. The cat names, the fish treats, the playful copy — it all builds a consistent personality that makes the platform memorable.

### The Landing Page

I built and rebuilt the landing page more times than I'd like to admit. The first version was utilitarian — here are our products, here's the pricing, sign up. It worked. It was boring.

The version I landed on (pun intended) has a clear pitch right at the top: "千年智慧 x 现代AI" — Thousand-year wisdom times Modern AI. It positions the product exactly where I want it: at the intersection of tradition and technology.

Below the pitch: feature cards for each product vertical. Each card has its cat-themed name, a brief description, and a clear call-to-action. The layout is responsive (mobile-first, because Chinese users are overwhelmingly on mobile).

The color scheme evolved from a generic purple to warm brown and gold tones. The reasoning: Chinese metaphysics has associations with earth tones, gold, and traditional aesthetics. Purple felt too techy. Brown/gold felt grounded and premium.

### Stripe Integration

Getting payments working was surprisingly straightforward. Stripe's API is well-documented, their Next.js integration guides are solid, and the credit purchase flow is simple:

1. User picks a credit package
2. Stripe Checkout session opens
3. Payment processes
4. Webhook fires, credits get added to user's account

The interesting part was the pricing psychology. I set up three tiers of credit packages with the classic "Most Popular" badge on the middle tier and "Best Value" on the highest tier. This is standard pricing page psychology — anchor the user to the middle option. But implementing it myself, thinking about why these badges matter, how the price-per-credit differential affects perception — this is all stuff I'd never engaged with as an engineer.

I priced the credits to make each reading cost roughly 3-8 RMB (about $0.40-$1.10 USD). Cheap enough to try casually, expensive enough to feel real. The credit abstraction is important — people are more willing to spend 5 fish treats than $0.70, even though it's the same thing. Casinos figured this out decades ago.

### The Moment It Felt Real

There's a specific commit somewhere on Day 10 where I refreshed the local dev server and actually thought: "I would use this." Not because I built it. But because the landing page looked professional. The cat theme was charming. The product descriptions were clear. The pricing felt fair.

For the first time, it stopped feeling like a side project and started feeling like a product.

100 commits in two days. A brand identity. A landing page. A payment system. And a name: PanPanMao.

## What I Learned This Week

**Testing is an investment, not a cost.** The 4 days I spent on tests paid for themselves almost immediately. When I started the branding work, I was refactoring components, moving files, changing shared packages — and the tests caught regressions that would have taken hours to debug manually.

**Brand is a product decision, not a marketing decision.** The cat theme isn't decoration. It's a core part of the user experience. It makes the platform feel approachable in a domain (fortune-telling) that can feel intimidating or scammy.

**Pricing is psychology, not math.** I spent more time thinking about credit package naming and badge placement than I did implementing the actual payment flow. The engineering was easy. The product decisions were hard.

**AI for domain branding works.** I had Claude help with the Chinese copywriting on the landing page. My written Chinese is functional but not marketing-grade. Claude's output needed editing (it tends toward formal/literary Chinese when you want conversational), but it got me 80% of the way there. The tagline "千年智慧 x 现代AI" came out of a brainstorming session with Claude where I described the vibe I wanted and it generated 20 options.

Next up: the credit economy, referral system, and the first real users.
