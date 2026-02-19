---
title: "Why I Built an AI Fortune-Telling App With Zero Domain Knowledge"
date: "2026-02-18"
summary: "Part 1 of 3: A big-tech engineer's journey into building PanPanMao -- an AI-powered Chinese metaphysics platform with 9 verticals, 1,134 commits in 29 days, and zero domain knowledge."
tags: ["AI", "Software Development", "LLM", "Agents"]
series: "The PanPanMao Story"
part: 1
type: "Post"
status: "Published"
---

I can't tell you what a Day Pillar is. I don't know the difference between a Heavenly Stem and an Earthly Branch. I've never had my fortune told, never drawn a tarot card, never looked at a palm line and thought anything other than "huh, that's a crease in my hand."

And yet, over 29 days this January and February, I built PanPanMao — an AI-powered Chinese metaphysics platform with 9 product verticals, 85 API endpoints, 284,000 lines of code, and a working credit economy. All of it built solo, with AI coding agents as my pair programmers.

This is the story of why.

## The Career That Didn't Scratch the Itch

I've spent my career shipping other people's specs. Airbnb: fraud detection ML systems, writing the models but not deciding what fraud meant to the business. Apple: Siri's on-device ML pipeline, optimizing inference but never touching user-facing product decisions. AWS: the Athena query engine, scaling systems for millions of queries but never fielding a single customer complaint myself.

I was the "build it" person. Never the "decide what to build" person.

After going startup as CTO at Compute Labs — building multi-agent AI systems for GPU infrastructure financing — I still hadn't touched the really messy stuff. The pricing page copy. The "why is our conversion rate 2% and not 4%" conversations. The landing page that gets rebuilt three times because the positioning is wrong, not the code.

I wanted the full lifecycle. Product design, user feedback loops, business decisions, and yes, the engineering. All of it. Solo.

## Why Chinese Metaphysics

I needed a domain where I had zero existing expertise. Building another developer tool would just exercise muscles I already had.

Chinese metaphysics — BaZi (四柱八字), astrology, tarot, dream interpretation, palm and face reading, Liuren divination — gave me three things:

**1. A genuine domain knowledge gap to test against.**

My hypothesis wasn't "can AI write code." That's old news. The hypothesis: can someone with zero domain expertise build a credible, useful product in a specialized field, using AI as their entire knowledge base?

The BaZi system alone has real depth. Five Elements (五行) interactions. Heavenly Stems (天干) and Earthly Branches (地支). Ten-year luck pillars (大运). Day Master (日主) personality theory. There are 20,000 lines of BaZi calculation logic in the codebase now — all AI-researched, all user-validated as correct by people who actually practice this stuff.

**2. A real market that's digitally underserved.**

Hundreds of millions of Chinese-speaking people engage with fortune-telling services. Most digital options are either scammy ad farms or basic "enter your birthday, get a paragraph" generators. Nobody had built a multi-vertical platform with real AI interpretation depth.

**3. A domain where tone matters as much as correctness.**

This turned out to be the hardest challenge — not getting the calculations right (AI handled that), but getting the interpretive tone right. Fortune readings that are too positive feel fake. Too negative feels cruel. Finding "honest but constructive" required extensive manual prompt iteration — the one thing AI couldn't do on its own.

## The Stack

Here's what I chose and why each piece matters:

- **Turborepo monorepo** — 9 apps sharing auth, credits, AI providers, UI components. The marginal cost of adding a new vertical became almost zero.

- **Next.js (App Router)** — Server components for SEO, client components for interactive readings, API routes for SSE streaming.

- **Supabase** — Auth (including anonymous-to-authenticated merging), Postgres with Row Level Security, real-time subscriptions for cross-tab credit sync.

- **Claude + Gemini** — Multi-model AI. Claude for nuanced interpretation. Gemini Flash for high-volume daily content generation. PostHog feature flags for model A/B testing per endpoint.

- **Stripe** — Credit packages. Four tiers, classic "Most Popular" anchor pricing.

- **TypeScript throughout** — Shared types between 16 packages. Type errors caught at build time across the entire monorepo.

## The Approach

I didn't plan 29 days. I planned one day at a time:

1. **Days 1-4**: Prototype fast. Move 5 standalone apps into a monorepo. Extract shared packages.

1. **Days 5-10**: Test the foundation. Brand the product. Build the landing page.

1. **Days 12-19**: Monetize. Build the credit economy. Ship the most technically ambitious feature (palm/face reading with in-browser ML).

1. **Days 20-29**: Milestones. Formal PRs. Ship three milestone releases. Three more product verticals. Resilient streaming infrastructure.

## January 21, 2026

On that day, I made my first commit. 21 commits by end of Day 1. Over the next 28 days: 1,134 commits. 109 pull requests. 66 merged PRs with detailed descriptions. 9 product verticals. A credit economy. In-browser palm reading. Server-side stream buffering. China AI regulatory compliance. A content filter that masks sensitive words without killing user experience.

All built by one person who still cannot explain what a Heavenly Stem represents.

This is Part 1. In Part 2, I break down the actual technical build — the architecture, the hardest bugs, the infrastructure that made velocity possible. In Part 3, the honest lessons about product vs. engineering.
