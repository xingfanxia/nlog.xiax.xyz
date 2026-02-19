---
title: "Day 29: What I Learned Building a Product I Know Nothing About"
date: "2026-02-18"
tags: ["panpanmao", "build-diary", "ai-development"]
series: "Building PanPanMao"
part: 7
---

# Day 29: What I Learned Building a Product I Know Nothing About

29 days. 1,134 commits. 9 product verticals. One developer who still can't explain what a 天干 is without looking it up.

This is the recap post. Not a victory lap — the product is still early, still rough around plenty of edges, still finding its market. But 29 days is enough time to have learned some things worth writing down.

## On AI-Augmented Development

39 commits per day, averaged across the entire project. That includes weekends, that includes "I'm just fixing one bug" days, that includes the days where I spent more time on product decisions than on code. On peak days, the number was closer to 100.

This velocity is only possible because of how I used AI coding agents. Not as autocomplete. Not as a chatbot I paste code into. As actual agents that read my codebase, understand the patterns, make changes across multiple files, and iterate based on test results.

The `claude/` and `codex/` branches in the git history tell the story. These are branches where AI agents proposed changes, I reviewed them, and we iterated. The workflow isn't "AI writes code, human ships it." It's more like "human architects, AI implements, human reviews, AI iterates." The human is the quality gate and the product brain. The AI is the execution engine.

Here's what surprised me: the AI was better at consistency than I am. When I established a pattern for API endpoints — input validation, credit check, AI call, response formatting — Claude applied that pattern more consistently to new endpoints than I would have. Humans get bored with repetitive patterns and start cutting corners. AI doesn't.

Where AI struggled: anything that required understanding the user's emotional state. The prompt engineering for fortune-telling is tricky because users come with real anxieties. A palm reading that's technically accurate but emotionally tone-deaf is a bad product. Getting the AI's tone right — empathetic but not patronizing, specific but not prescriptive, mystical but not absurd — required a lot of manual iteration on prompts that I couldn't fully delegate to AI agents.

## On Zero-Knowledge Domains

Can AI bridge the domain knowledge gap? After 29 days, my answer is: yes, with caveats.

The BaZi calculation engine is about 20,000 lines of TypeScript. It handles the Heavenly Stems and Earthly Branches system, the Five Elements interactions, the ten-year luck pillars, the annual fortune cycles. I built none of this from existing personal knowledge. All of it was researched, validated, and implemented through conversation with Claude.

The dream interpretation database contains over 1,000 symbolic entries — animals, objects, scenarios, cultural references — each with interpretive meanings. Claude compiled this from knowledge of both Western and Chinese dream analysis traditions.

78 tarot cards with detailed interpretive frameworks for upright and reversed positions, including Chinese cultural context.

All of this domain knowledge was acquired and implemented through AI assistance. And based on user feedback, it's credible. People who actually know BaZi have told me the calculations are correct. People familiar with tarot say the interpretations are nuanced.

**The caveat**: you need to know HOW to ask the right questions. AI can give you the knowledge, but you need enough meta-understanding of the domain to know what questions to ask. "Tell me about BaZi" gives you a Wikipedia-level overview. "Explain the interaction between the Day Master and the Month Branch in terms of element productivity cycles, and how this affects career analysis" gives you something you can actually implement.

I spent the first few days of the project just asking Claude to teach me the domain. Not to write code — to explain concepts. Once I had a mental model of how Chinese metaphysics works (even a simplified one), I could ask implementation-level questions that produced usable code.

Zero knowledge is possible. Zero curiosity is not.

## On Product vs. Engineering

I've been a professional engineer for years. I've never been a professional product person. This project forced me to be both, and the contrast was illuminating.

**Things I underestimated as an engineer:**

*Landing page iteration.* The landing page went through three major redesigns. Not because the code was wrong, but because the positioning was wrong. Purple theme: too generic. Warm brown/gold: too cute for the content's gravity. Dark luxury: right tone, wrong layout. Each redesign was a product decision, not an engineering one.

*Pricing psychology.* I spent more time on the credit package page than on any API endpoint. Which tier gets the "Most Popular" badge? What's the discount curve from small to large packages? Should the per-credit price be visible? Should the total be prominent or the per-reading cost? Every one of these decisions affects conversion, and none of them have objectively correct answers.

*Conversion funnels.* I built 7 contextual upgrade triggers — moments where a user who's run out of credits sees a prompt to purchase more. Each trigger is tailored to its context. The wording, the placement, the timing. "Your free readings have been used" vs "Unlock your complete analysis" vs "Continue your reading for 3 小鱼干" — same action, different persuasion strategies for different moments.

*Retention design.* The Daily Hub exists purely for retention. It doesn't generate revenue directly. But it gives users a reason to open the app every day, and daily active usage correlates with lifetime value. This is a product insight, not an engineering one.

**Things I overestimated as an engineer:**

*Architectural perfection.* The monorepo could be cleaner. Some of the shared packages have leaky abstractions. A few API endpoints have tech debt from the early migration days. None of this matters to users. Shipping beats polish.

*Test coverage.* I set up comprehensive testing and CI. It was worth it. But I also spent four full days on it early in the project when I could have been shipping features. For a fast-moving solo project, the right testing strategy is "cover the critical paths and move on," not "aim for 80% coverage on everything."

## On Building for China

Building for the Chinese market as someone who lives in the US added some specific challenges.

**WeChat browser compatibility.** A huge percentage of Chinese users browse the web inside WeChat. The built-in WebView has quirks. Payment flows, camera access, and JavaScript APIs all behave slightly differently. Testing this requires actually being on a phone with WeChat, which I had to set up specifically for this project.

**Content filtering.** The DFA-based sensitive word filter was a must-have, not a nice-to-have. But making it work for metaphysics content — where words about fate, death, spirits, and the supernatural are legitimate terminology — required careful curation of allowlists.

**Cultural nuance in AI-generated content.** Claude's default Chinese output tends toward 书面语 (formal written Chinese). PanPanMao's target audience expects 口语 (conversational Chinese) with a mystical flavor. Getting this tone right required extensive prompt engineering and a lot of manual editing of AI output until I had example outputs that set the right style for subsequent generations.

## On Being Solo

No meetings. No standups. No alignment sessions. No "let's circle back on this." No Jira tickets. No sprint planning. Just git commit and ship.

The freedom was intoxicating. I could decide at 11 PM that the landing page needed a redesign and have it done by 2 AM. No one to convince. No design review. No stakeholder alignment.

But the flip side: no one catches your blind spots. No one asks "are you sure users want this?" No one pushes back on the third redesign of a feature that's already good enough. The discipline of knowing when to stop iterating and ship — that's harder without a team.

One interesting counterbalance: the PanPanMao Bug Reporter. I set up an automated CI bot that runs comprehensive checks and files GitHub issues for anything it finds. Over the course of the project, it filed 32 issues. AI-powered QA gave me a rudimentary version of "someone else looking at your code." It's not the same as a real human reviewer, but it caught things I would have missed.

## By the Numbers

| Metric | Value |
|--------|-------|
| Duration | 29 days |
| Total commits | 1,134 |
| Average commits/day | 39 |
| Peak day commits | 98 |
| Product verticals | 9 |
| Approximate LOC | 284K |
| API endpoints | 85 |
| Shared packages | 8+ |
| Landing page redesigns | 3 |
| GitHub PRs | 18+ |
| Automated bug reports | 32 |
| Employee headcount | 1 |
| Employee cost | $0 |
| Fortune-telling knowledge at start | 0 |
| Fortune-telling knowledge now | Still mostly 0 |

## What's Next

This was never about fortune-telling. It was about testing a hypothesis: can one engineer, augmented by AI, build a real, multi-product platform from scratch in a domain they know nothing about?

The answer, 29 days in, is yes. With nuance — you still need product taste, architectural judgment, and the ability to ask the right questions. AI doesn't replace those. But it removes the bottleneck that used to make this kind of solo ambition impossible: the sheer volume of code that needs to be written, tested, and shipped.

I'm continuing to iterate. More verticals are planned. Retention features need work. The credit economy needs tuning based on real usage data. There's a mobile app conversation starting.

But the core question has been answered. The domain knowledge gap was bridgeable. The velocity was real. And it turns out that building a product — the whole product, not just the engineering — is the most fun I've had in years.

Now if you'll excuse me, I need to go figure out what my Day Master's relationship to the Month Branch means. Apparently it's important.
