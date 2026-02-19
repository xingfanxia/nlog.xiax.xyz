---
title: "Day 1: Why I'm Building a Fortune-Telling App (And I Know Nothing About Fortune-Telling)"
date: "2026-01-21"
summary: "PanPanMao build diary Day 1: Starting a Chinese metaphysics AI platform with zero domain knowledge. 21 commits, monorepo setup, and the hypothesis that AI can bridge any knowledge gap."
tags: ["AI", "Software Development"]
series: "Building PanPanMao"
part: 1
type: "Post"
status: "Published"
---

I pushed 21 commits today. By the end of it I had a monorepo with 5 apps, shared packages, and the skeleton of something that might actually become a product. But let me back up and explain how a CTO-type engineer who's spent his career at Airbnb, Apple, and AWS ended up deciding to build a Chinese metaphysics platform.

## The Itch

Here's the thing about being an engineer in big tech: you get really, really good at building things other people spec out. You ship infrastructure. You scale systems. You make architectural decisions that affect millions of users. But you never touch the messy parts — the GTM strategy, the pricing page copy, the "why is our conversion rate 2% and not 4%" conversations. Someone else handles that.

I've been wanting to experience the FULL product lifecycle for years. Not just the engineering. The product design. The user feedback loops. The business decisions. All of it. Solo. No PM to write the PRD. No designer to hand me Figma files. No growth team to figure out retention.

So when I was looking for a side project, I had one constraint: it had to be in a domain I know absolutely nothing about.

## Why Chinese Metaphysics, Specifically

I know NOTHING about BaZi, astrology, tarot, dream interpretation, or Liuren. Zero. I couldn't tell you what a "day pillar" is or why your birth hour matters.

That's exactly the point.

The hypothesis: **Can AI completely bridge a domain knowledge gap?** Not "can AI help an expert work faster" — can someone with ZERO domain expertise build a credible, useful product in a specialized field, using AI as their entire knowledge base?

There's also a pragmatic angle. The Chinese-speaking market for fate analysis is enormous and digitally underserved. Most existing apps are ad farms or single-paragraph generators.

## The Monorepo Setup

First commit: "Initial monorepo setup with Turborepo." Move 5 existing Next.js apps into `apps/`. Extract shared code into `packages/`. The conceptual simplicity is deceptive — every single import path breaks. Every Tailwind config clash surfaces.

The package structure I landed on:

- `packages/api` — AI model abstraction, SSE streaming helpers

- `packages/auth` — Supabase auth context, modals, anonymous user handling

- `packages/credits` — credit deduction, balance checking, cost constants

- `packages/database` — Supabase client, generated types, SQL migrations

- `packages/ui` — shared components (AppHeader, Footer, ChatPanel)

- `packages/config` — unified Tailwind, ESLint, TypeScript configs

Steps 4 and 5 (fix imports, verify builds) took 80% of the time. But this upfront pain is the reason everything gets easier later.

## The AI Workflow

I'm using Claude Code as my primary development tool. Not as a chatbot I paste code into — as an actual coding agent that reads my codebase, understands the package structure, makes changes across files, runs tests, and iterates.

For the domain-specific stuff, Claude is functioning as both researcher and implementer. I ask "how does BaZi day pillar calculation work?" and get back not just an explanation but working TypeScript code with the Heavenly Stem and Earthly Branch cycle tables, the Five Elements interaction matrix, and edge cases for daylight saving time transitions.

It's a weird feeling. I'm building a product where the AI knows more about the domain than I do. The AI is the domain expert; I'm the product person and the architect.

## End of Day 1

By midnight, the monorepo builds. All 5 apps load. Shared auth works. The Supabase client is unified. One login, one credit balance, five products.

21 commits. One monorepo. Zero knowledge of fortune-telling.

## Tech Stack

- **Monorepo**: Turborepo

- **Framework**: Next.js (App Router)

- **Database/Auth**: Supabase (Postgres + RLS + real-time subscriptions)

- **AI**: Claude + Gemini — multi-model with PostHog feature flags per endpoint

- **Styling**: Tailwind CSS with per-app design token themes

- **Language**: TypeScript throughout (strict mode, shared types across 16 packages)

- **Deployment**: Vercel
