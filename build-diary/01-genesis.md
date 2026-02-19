---
title: "Day 1: Why I'm Building a Fortune-Telling App (And I Know Nothing About Fortune-Telling)"
date: "2026-01-21"
tags: ["panpanmao", "build-diary", "ai-development"]
series: "Building PanPanMao"
part: 1
---

# Day 1: Why I'm Building a Fortune-Telling App (And I Know Nothing About Fortune-Telling)

I pushed 21 commits today. By the end of it I had a monorepo with 5 apps, shared packages, and the skeleton of something that might actually become a product. But let me back up and explain how a CTO-type engineer who's spent his career at Airbnb, Apple, and AWS ended up deciding to build a Chinese metaphysics platform.

## The Itch

Here's the thing about being an engineer in big tech: you get really, really good at building things other people spec out. You ship infrastructure. You scale systems. You make architectural decisions that affect millions of users. But you never touch the messy parts — the GTM strategy, the pricing page copy, the "why is our conversion rate 2% and not 4%" conversations. Someone else handles that.

I've been wanting to experience the FULL product lifecycle for years. Not just the engineering. The product design. The user feedback loops. The business decisions. All of it. Solo. No PM to write the PRD. No designer to hand me Figma files. No growth team to figure out retention.

So when I was looking for a side project to scratch this itch, I had one constraint: it had to be in a domain I know absolutely nothing about. If I built another developer tool or SaaS dashboard, I'd just be doing what I already know. That defeats the purpose.

## Why Chinese Metaphysics, Specifically

I know NOTHING about 八字 (BaZi — Chinese astrology based on birth time), 占星 (Western astrology), 塔罗 (Tarot), 解梦 (dream interpretation), or 六壬 (Liuren — an ancient divination system). Zero. I couldn't tell you what a "day pillar" is or why your birth hour matters. I'd never had my fortune told. I don't even read horoscopes.

That's exactly the point.

The hypothesis I'm testing is simple: **Can AI completely bridge a domain knowledge gap?** Not "can AI help an expert work faster" — that's well-established. I mean: can someone with ZERO domain expertise build a credible, useful product in a specialized field, using AI as their entire knowledge base?

I'm the test subject. Chinese metaphysics is the domain. Let's see what happens.

There's also a pragmatic angle. The Chinese-speaking market for 命理 (fate/destiny analysis) is enormous and underserved digitally. Most existing services are either sketchy apps with generic horoscopes or expensive one-on-one consultations with masters who charge hundreds of dollars per session. There's a gap for something AI-powered that's actually good.

## The Starting Point

I didn't start completely from scratch today. Over the past few weeks, I'd been prototyping individual apps to test feasibility:

- **bazi** — BaZi (八字) birth chart analysis
- **kline** — Some charting experiments
- **jiemeng** — Dream interpretation (解梦)
- **zhanxing** — Western astrology (占星)
- **liuren** — Liuren divination (六壬)

Each was its own standalone Next.js app with its own Supabase setup, its own auth, its own everything. Five separate repos. Five separate deployment configs. Five separate chances to forget to update a shared dependency.

Today was consolidation day.

## The Monorepo Migration

First commit: "Initial monorepo setup with Turborepo." I chose Turborepo because I've used it before and it's fast. The task was conceptually simple — move 5 apps into one workspace — but in practice it was a full day of untangling.

Each app had slightly different conventions. Different Tailwind configs. Different ways of importing shared utilities. One used `src/` directory structure, another didn't. Supabase client initialization was copy-pasted across all five with subtle differences.

The process was roughly:
1. Set up the Turborepo workspace with `apps/` and `packages/`
2. Move each app into `apps/`
3. Extract shared code into `packages/` — starting with `packages/supabase`, `packages/ui`, `packages/config`
4. Fix every single import that broke
5. Verify each app still builds and runs

Steps 4 and 5 took about 80% of the time.

## The AI Workflow

Here's where it gets interesting. I'm using Claude Code as my primary development tool. Not as a chatbot I paste code into — as an actual coding agent that reads my codebase, makes changes across files, runs tests, and iterates.

For the monorepo migration, Claude handled most of the mechanical work: updating import paths, creating shared package configs, resolving TypeScript errors. I directed the architecture decisions (what goes in shared packages vs. stays app-specific) and Claude executed.

For the domain-specific stuff — the BaZi calculation logic, the dream symbol databases, the tarot card meanings — Claude is functioning as both researcher and implementer. I ask "how does BaZi day pillar calculation work?" and get back not just an explanation but working TypeScript code that implements the 天干地支 (Heavenly Stems and Earthly Branches) system.

It's a weird feeling. I'm building a product where the AI knows more about the domain than I do. I'm the engineering expert and the product owner, but the domain expert is my coding assistant.

## End of Day 1

By midnight, the monorepo builds. All 5 apps load. Shared auth works across apps. The Supabase client is unified. There's a shared UI package with common components.

It's not pretty yet — the apps still look like they were built by different people at different times (because they were, kind of). But the foundation is there.

21 commits. One monorepo. Zero knowledge of fortune-telling.

Let's see where this goes.

## Tech Stack (as of today)

- **Monorepo**: Turborepo
- **Framework**: Next.js (App Router)
- **Database/Auth**: Supabase
- **AI**: Claude (Anthropic) + Gemini (Google) — multi-model because different tasks benefit from different models
- **Styling**: Tailwind CSS
- **Language**: TypeScript throughout
- **Deployment**: Vercel

Tomorrow: making all these apps actually look like they belong together.
