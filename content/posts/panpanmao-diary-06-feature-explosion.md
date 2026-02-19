---
title: "Day 27: 98 Commits and Three New Products"
date: "2026-02-15"
summary: "PanPanMao build diary Day 27: The most productive single day. 98 commits. Three new products (child naming, compatibility analysis, annual forecast) from zero to production."
tags: ["AI", "Software Development"]
series: "Building PanPanMao"
part: 6
type: "Post"
status: "Published"
---

98 commits. One day. Three completely new products from zero to production. Plus the refactoring and infrastructure work that made that velocity possible. This was the single most productive day of the entire project.

## The Refactoring That Made Velocity Possible

Before I could ship new products this fast, two refactors had to land:

### Standardizing 15 Streaming Routes (PR #16)

15 API routes migrated from custom `ReadableStream` implementations to the shared `createAIStreamResponse()` helper. 24 files changed, ~1,600 insertions, ~2,000 deletions — **net -400 lines**. The helper got lifecycle hooks: `initEvents`, `onComplete`, `onError`, `refundCreditsOnError`.

Three routes legitimately needed custom streaming: MBTI chat (accumulated-buffer-delta pattern for stripping internal signal markers from user-visible text), dream long novel (multi-step generation protocol), and daily fortune (non-streaming with server-side caching).

36 new tests. 173 total in `@panpanmao/api`.

### Centralizing Cost Logging (PR #21)

Every streaming route had the same boilerplate: create a cost logger, insert a record with `as never` type cast (working around a Supabase typing limitation). PR #21 replaced this pattern with `createRouteCostLogger()` across 20 files — centralizing the Supabase typing workaround in one place instead of duplicating it everywhere. 1,942 tests passing.

These two refactors reduced the "add a new AI-powered feature" template from ~80 lines of boilerplate per route to ~15.

## The Three New Products

### AI Child Naming (起名)

Chinese baby naming is serious business. Names connect to BaZi elements (Five Elements balance), stroke count numerology (笔画吉凶), and family naming conventions. Parents consult naming masters (200-2000 RMB per session).

The AI implementation: calculate the child's elemental profile from birth data, identify which elements need strengthening or balancing, generate names where each character's element affinity, stroke count, phonetic quality, and semantic meaning align. The domain knowledge package has lookup tables for character-to-element mapping, stroke count databases, and naming convention rules.

From zero to production in about 4 hours. The fast part wasn't the AI — it was the infrastructure. Auth, credits, streaming, error handling, content filtering, history saving all came from shared packages. The only new code was the domain knowledge and the UI.

### Name Compatibility Analysis (配对)

Analyzes compatibility between two people based on names and birth information. Five Elements compatibility scoring, Day Pillar harmony analysis, character-level element interaction. Shareable results for the most common fortune-telling use case: relationship questions.

### 流年运程 — Annual Fortune Forecast (PR #85)

The most substantial of the three. A complete new domain: `domains/liunian/` with calculators (zodiac, TaiSui analysis, annual stars, wuxing year energy), knowledge data packages (star catalog, star-year mapping, TaiSui conflict rules, zodiac personality profiles), and AI prompt templates.

48 files changed. 162 domain tests passing. The frontend has progressive rendering: TaiSui banner and annual stars appear immediately from calculations, then AI fortune content streams in progressively via SSE.

PR #96 later fixed a subtle SSE parsing bug: the liunian hook only parsed complete newline-terminated frames during the main read loop. When final frames arrived as trailing buffered data (a `chunk` + `done` without trailing newline), the hook dropped the `done` event and showed a misleading network error even though the interpretation had completed. The fix: flush decoder state and parse trailing buffered SSE events during finalization.

## The China Cities Bug

Same day, PR #34 fixed a user-reported bug: the BaZi city search only had 46 major Chinese cities. Users searching for 黔西南, 黔东南 (autonomous prefectures in Guizhou) got no results. The fix expanded the database from **46 → 379 entries**, covering all 333 prefecture-level divisions (地级市/自治州/盟/地区). Each entry includes coordinates, province, and aliases for short-name matching. 5 new geocoding tests.

This is the kind of bug that's invisible if your test users are all in Beijing and Shanghai.

## The Agentic Workflow

The git history shows `claude/` and `codex/` branches scattered throughout. The workflow:

1. I describe the product concept and requirements

1. Claude Code creates the API endpoint following the established `createAIStreamResponse()` pattern

1. Another session builds the UI components using the shared component library

1. I review, adjust the domain-specific prompts (this is always manual), and merge

1. Integration testing, credit cost registration, Hub card creation

1. Deploy

By the third product, the pattern was almost mechanical. The compounding effect of good architecture: the first few products were hard, each new one got dramatically easier.

**Conservative estimate: 95% of today's code was AI-generated.** I directed product decisions, reviewed output, wrote domain-specific prompts, and handled integration. The AI wrote the implementation. But the 5% I wrote — the prompts, the product decisions, the integration glue — is what makes it a product and not a demo.

## Reflections

98 commits is roughly one commit every 9 minutes for 15 hours. This velocity isn't sustainable long-term. But even at half this pace, three new products in a day with real business logic, real AI integration, real credit economy, real persistence — that's not "moving fast and breaking things." It's moving fast because the foundation is strong.

Product count: 9 verticals. And I still don't know how to read a palm myself.
