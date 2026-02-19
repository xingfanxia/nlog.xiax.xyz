---
title: "Day 27: 98 Commits and Three New Products"
date: "2026-02-15"
tags: ["panpanmao", "build-diary", "ai-development"]
series: "Building PanPanMao"
part: 6
---

# Day 27: 98 Commits and Three New Products

98 commits. One day. Three completely new products, each going from zero to production with API endpoints, UI, Hub integration, and credit integration. This was the single most productive day of the entire project, and it's worth examining closely because it illustrates what AI-augmented development looks like at peak flow.

## The Three Products

### 起名 (Qiming) — AI Child Naming

Chinese baby naming is serious business. Names in Chinese culture carry deep significance — they're connected to the child's BaZi (eight characters from birth time), the Five Elements (五行: metal, water, wood, fire, earth), stroke count numerology, and family generational naming conventions.

Most Chinese parents consult a naming master (起名师) when choosing a name for their child. It's one of the first and most important decisions a parent makes. The consultation typically costs 200-2000 RMB and involves analyzing the child's BaZi to determine which elements are strong or weak, then choosing characters that compensate.

Qiming does this with AI. You input the child's birth date and time, family name, and any preferences (desired meaning, specific characters to include or avoid, number of characters). The AI:
1. Calculates the child's BaZi and Five Elements balance
2. Identifies which elements need strengthening
3. Generates name suggestions where each character's element, stroke count, and meaning align with the analysis
4. Provides a detailed explanation of why each name was chosen

The domain knowledge here is deep. The Five Elements have productive and destructive cycles (water feeds wood, wood feeds fire, etc.). Stroke counts map to elements. Character radicals indicate elemental associations (the water radical 氵, the wood radical 木, etc.). All of this needed to be correct, and all of it was researched with Claude.

Building this product meant creating:
- API endpoint for name generation with BaZi calculation
- Input form with birth datetime picker and preference fields
- Results page showing suggested names with element analysis
- Hub card integration for daily featured names
- Credit deduction per name generation session

From zero to production in about 4 hours.

### 配对 (Peidui) — Name Compatibility Analysis

This one piggybacked on the naming logic but went in a different direction. Instead of generating names, it analyzes the compatibility between two people based on their names and birth information.

In Chinese metaphysics, compatibility analysis (合婚) looks at how two people's BaZi interact. Do their elements complement each other? Are there clashing pillars? Is there harmony in the year, month, day, and hour pillars?

Peidui takes two people's names and birth dates, runs the BaZi calculation for both, and produces a compatibility analysis. It covers:
- Five Elements compatibility (do their elemental profiles support each other?)
- Day pillar harmony (the day pillar is considered most important for romantic compatibility)
- Character analysis of their names (do the characters' elements work well together?)
- Overall compatibility score with detailed breakdown

Users love this kind of thing. It's shareable, it's fun, and it directly addresses one of the most common reasons people seek fortune-telling: relationship questions.

### 流年运程 (Liunian) — Annual Fortune Forecast for 2026

This was the most straightforward of the three. A detailed forecast for the year 2026 based on the user's BaZi. It analyzes how the year's energy (2026 is a 丙午 year in the Chinese calendar — Fire Horse) interacts with the user's personal chart.

The forecast covers:
- Overall energy theme for 2026
- Career and wealth outlook
- Relationship and family fortune
- Health considerations
- Key months to watch (favorable and challenging)
- Actionable advice based on the analysis

The prompt engineering for this was interesting because it needed to be specific to 2026 (the year's Heavenly Stem and Earthly Branch), personalized to the user (their BaZi), and structured enough to be consistently useful. Too vague and it reads like a generic horoscope. Too specific and you risk saying something that feels prescriptive about major life decisions.

I settled on a structure that provides directional guidance with explicit caveats. "This analysis suggests career opportunities may present themselves in the spring" rather than "You will get promoted in March."

## The Agentic Workflow

Looking at the git history for this day, you can see branches named `claude/...` and `codex/...` scattered throughout. These are the branches created by AI coding agents (Claude Code and OpenAI Codex) working on different parts of the codebase.

The workflow went something like this:

1. I describe the product concept and the technical requirements
2. Claude Code creates the API endpoint, following the patterns established by existing endpoints
3. While that's being reviewed, another session builds the UI components
4. I review, adjust the prompts (the domain-specific parts where accuracy matters), and merge
5. Integration testing, credit system hookup, Hub card creation
6. Deploy

Each product followed this pattern. By the third one (Liunian), the pattern was so established that it was almost mechanical. The API structure, the UI patterns, the credit integration, the Hub card format — all of these were established conventions. New products were more like filling in a template than building from scratch.

This is the compounding effect of good architecture. The first few products were hard. Each new one got easier because the patterns were set, the shared packages handled the common concerns, and the AI agents could reference existing implementations as examples.

**Conservative estimate: 95% of the code written today was AI-generated.** I directed the product decisions, reviewed the output, wrote the domain-specific prompts, and handled the integration. But the actual TypeScript? That was almost entirely Claude and Codex.

## The Referral System Update

Based on user feedback from the past week, I changed the referral bonuses from asymmetric (10 for referrer, 3 for referee) to symmetric (5 for referrer, 5 for referee).

The reasoning: users told me they felt uncomfortable sharing referral links because their friends would see they were getting a bigger bonus. It felt extractive. "I'm using my friend to get credits" rather than "we both benefit." The symmetric structure made sharing feel more like giving a gift than running a scheme.

This is the kind of insight you only get from actual users. I could have A/B tested this for weeks, but the qualitative feedback was so clear and consistent that I just made the change. Sometimes the right product decision is obvious when you actually listen to people.

## Reflections on the Day

98 commits is an absurd number for a single day. It's roughly one commit every 9 minutes for 15 hours of work. Some of those are micro-commits (fix typo, adjust padding), but many are substantial — new API endpoints, new page components, new database migrations.

The velocity isn't sustainable long-term and I know that. This was a sprint day where everything aligned: the architecture was solid, the patterns were established, the AI agents were productive, and I was in flow state for most of the day.

But even at half this pace, the throughput of one person plus AI coding agents is remarkable. Three new products in a day. Each with real business logic, real UI, real integration with the credit economy. That's not "moving fast and breaking things." It's moving fast because the foundation is strong enough to support it.

Product count: 9 verticals and counting. 小鱼干 economy humming. Users actually paying. And I still don't know how to read a palm myself.
