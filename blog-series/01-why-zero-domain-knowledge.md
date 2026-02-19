---
title: "Why I Built an AI Fortune-Telling App With Zero Domain Knowledge"
date: "2026-02-18"
tags: ["panpanmao", "ai-development", "indie-hacker", "build-story"]
series: "Building PanPanMao: 1,134 Commits in 29 Days"
part: 1
---

# Why I Built an AI Fortune-Telling App With Zero Domain Knowledge

I can't tell you what a Day Pillar is. I don't know the difference between a Heavenly Stem and an Earthly Branch. I've never had my fortune told, never drawn a tarot card, never looked at a palm line and thought anything other than "huh, that's a crease in my hand."

And yet, over 29 days this January and February, I built PanPanMao (盘盘猫) -- an AI-powered Chinese metaphysics platform with 9 product verticals, 85 API endpoints, 284,000 lines of code, and a working credit economy with real paying users. All of it built solo.

This is the story of why.

## The Career That Didn't Scratch the Itch

My career has been a fairly standard big-tech trajectory. Airbnb, where I built fraud detection ML systems. Apple, where I worked on Siri's on-device ML pipeline, shipping BERT models to phones. AWS, where I worked on the Athena query engine and presented at re:Invent 2022. Then a leap into startup life as CTO at Compute Labs, building multi-agent AI systems for GPU infrastructure financing.

At every stop, I was the "build it" person. Someone else decided what to build. A PM wrote the PRD. A designer handed me Figma files. A growth team figured out conversion funnels. My job was to take a well-defined problem and engineer an excellent solution.

I was good at this. I enjoyed it. But something was missing.

I never touched the messy parts. The "why is our conversion rate 2% and not 4%" conversations. The pricing page agonizing. The go-to-market strategy. The moment where a user tells you your landing page makes them feel confused, and you realize the problem isn't a bug -- it's a positioning failure. These were someone else's problems.

I wanted them to be my problems. Not because I thought I'd be great at them -- honestly, I suspected I'd be terrible at some of them. But because I wanted the full experience. The complete product lifecycle, from "I have an idea" to "someone is paying me money for this," with no one else to hand the hard parts to.

So I started looking for a side project. One constraint: it had to be in a domain I know absolutely nothing about.

## Why Chinese Metaphysics, Specifically

If I built another developer tool, another SaaS dashboard, another API wrapper -- I'd just be doing what I already know. The engineering would be comfortable. The domain would be familiar. I'd learn nothing about the parts of product-building that I actually want to learn.

So: Chinese metaphysics. 命理 (fate analysis), 八字 (BaZi -- the "eight characters" system based on birth time), 占星 (astrology), 塔罗 (tarot), 解梦 (dream interpretation), 手相面相 (palm and face reading). Ancient systems for understanding destiny, personality, and fortune.

I chose this domain for three specific reasons.

**Reason 1: I literally know nothing.** This is the point, not the obstacle. My hypothesis was simple: can AI completely bridge a domain knowledge gap? Not "can AI help an expert work faster" -- that's been proven. I mean something more radical: can someone with zero domain expertise build a credible, useful product in a specialized field, using AI as their entire knowledge base?

I'm the test subject. Chinese metaphysics is the domain. If this works, it says something profound about where software development is heading.

**Reason 2: It's not a toy domain.** Chinese metaphysics isn't astrology memes and fortune cookies. It's a system of knowledge refined over thousands of years, with deep structure and internal logic. The BaZi system alone has layers upon layers -- the interaction of Five Elements (五行: metal, water, wood, fire, earth), the Heavenly Stems and Earthly Branches (天干地支), the ten-year luck pillars, the concept of a Day Master, the relationships between pillars. It's a genuine knowledge domain with real depth.

If I'd picked something shallow -- say, random motivational quotes -- the test would be meaningless. The whole point is to see if AI can handle a domain that actually requires understanding, not just pattern-matching.

**Reason 3: There's real, underserved demand.** Hundreds of millions of Chinese-speaking people engage with metaphysics services. It's woven into the culture in ways that don't have a direct Western parallel. People consult BaZi masters before naming their children. Couples check compatibility charts before getting married. Business owners choose opening dates based on auspicious timing.

The existing digital options are mostly terrible. Sketchy apps with generic horoscopes. Expensive one-on-one consultations with masters who charge hundreds of dollars per session. There's a gap for something AI-powered that's actually good -- that takes the depth of traditional metaphysics and makes it accessible, affordable, and beautifully designed.

## The Thesis

Here's what I was really testing, stated plainly:

**If one engineer, augmented by AI tools, can build a real, monetized, multi-product platform in a domain they know nothing about -- in under 30 days -- that says something fundamental about the future of software.**

Not "AI can write code." That's old news. I'm talking about something bigger: AI as the universal domain expert. AI as the thing that lets a single builder operate in any domain, not just the one they trained for.

If the thesis holds, the implications are significant. It means the barrier to building software products is no longer domain expertise -- it's taste, judgment, and the ability to ask the right questions. It means solo builders can compete in markets that used to require specialized teams. It means the era of the AI-augmented indie hacker isn't coming. It's here.

## The Stack

I went with tools I know well for the engineering layer, so I could focus my learning energy on the domain and product sides:

- **Monorepo**: Turborepo -- because I'd be managing multiple apps and shared packages, and I've used it before
- **Framework**: Next.js 16, App Router -- the current best option for full-stack React with server-side capabilities
- **Database and Auth**: Supabase -- Postgres, auth, real-time subscriptions, row-level security, all in one
- **AI Models**: Claude (Anthropic) + Gemini (Google) -- multi-model because different tasks benefit from different models. Gemini excels at extraction and structured data. Claude excels at nuanced analysis and long-form generation.
- **Payments**: Stripe -- because it works and I don't want to think about payments infrastructure
- **Language**: TypeScript throughout -- type safety matters when you're moving fast
- **AI Development Tools**: Claude Code and OpenAI Codex as pair programmers -- visible in the git history as `claude/` and `codex/` branch prefixes

The AI development workflow deserves its own post (coming in Part 2), but the short version: Claude Code doesn't just autocomplete my code. It reads my codebase, understands the patterns, makes changes across multiple files, runs tests, and iterates. It's an agent, not a chatbot. And for this project, it also served as my domain expert -- the entity that knew everything about BaZi, tarot, palmistry, and dream interpretation that I did not.

## The Approach

My plan was simple and probably naive:

1. **Prototype fast.** Build standalone apps for each metaphysics vertical to test feasibility. Can the AI actually generate credible BaZi readings? Can it interpret dreams meaningfully? Can it analyze a palm photo?
2. **Consolidate.** Once prototypes prove the concept, merge everything into a unified platform with shared auth, shared credits, shared UI.
3. **Monetize.** Build a credit economy. Users buy "小鱼干" (dried fish treats -- because the whole platform is cat-themed, and what else would you pay a cat with?) and spend them on readings.
4. **Iterate.** Watch what users do. Listen to what they say. Ship improvements daily.

I'd already spent a few weeks prototyping individual apps before deciding to go all-in. I had five standalone Next.js apps for BaZi, dream interpretation, astrology, a charting experiment, and Liuren divination. Each had its own repo, its own Supabase setup, its own everything. Five separate islands of code.

The real project started when I decided to unify them.

## January 21, 2026

On that day, I made my first commit to the unified monorepo. "Initial monorepo setup with Turborepo." 21 commits by the end of Day 1. Five apps migrated into one workspace. Shared packages for auth, database, UI.

It was ugly. The apps still looked like they'd been built by different people at different times. The Tailwind configs clashed. The import paths were a mess. But the foundation was there.

Over the next 28 days, the project would grow to 1,134 commits. 9 product verticals. A complete credit economy with referral system. A dark luxury landing page that went through three full redesigns. MediaPipe-powered palm reading. Cron-generated daily content. PostHog analytics. DFA-based content filtering for the China market. Admin dashboards. Legal documents in Chinese and English.

All of it built by one person who still, to this day, cannot explain what a 天干 (Heavenly Stem) actually represents without looking it up.

This is Part 1 of a three-part series. In [Part 2](/blog-series/02-technical-build-story), I'll break down the technical build: how five prototypes became a unified platform, how the AI-augmented development workflow actually functions in practice, and what 39 commits per day looks like when you're building at the edge of what's possible for a solo developer.

In [Part 3](/blog-series/03-lessons-learned), I'll share the honest lessons -- what worked, what didn't, and what I'd tell any engineer thinking about making the leap from "build it" person to "build the whole thing" person.

But for now, here's where it started: one engineer, zero domain knowledge, and a bet that AI could bridge the gap.

Let's see how that bet played out.
