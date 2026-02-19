---
title: "Days 2-4: The Monorepo Migration Sprint (111 Commits in 3 Days)"
date: "2026-01-24"
tags: ["panpanmao", "build-diary", "ai-development"]
series: "Building PanPanMao"
part: 2
---

# Days 2-4: The Monorepo Migration Sprint (111 Commits in 3 Days)

Three days. 111 commits. And I'm pretty sure half of them have commit messages that just say "fix css" or "fix styling" or some variation of "why does this look wrong now."

## Day 2 (Jan 22): CSS Restoration Hell — 38 Commits

I knew the monorepo migration would break some styling. I did not expect it to break ALL the styling.

Here's what happened: each of the 5 apps was built at a different time, with slightly different Tailwind configurations. One had custom color tokens defined inline. Another had them in a shared config that I'd already moved into a package. A third was using a mix of Tailwind utility classes and inline styles because past-me apparently didn't believe in consistency.

When I unified the Tailwind config into `packages/config`, every app that relied on custom tokens or non-standard extensions just... broke. Not in an obvious "red error screen" way. In a subtle "the background is slightly wrong and the spacing looks off and why is that button 2px smaller than it should be" way.

38 commits. That's what it took. Each one fixing some CSS gap I'd missed. The frustrating part is that each fix was trivial — a missing color variable here, a wrong import path there. But there were dozens of them, and you can't catch them all at once because they cascade. Fix one thing, something else looks wrong.

By the end of the day, I'd also extracted 4 new shared packages:
- `packages/pdf` — PDF generation (for downloadable reports)
- `packages/history` — Chat/analysis history management
- `packages/chat` — Shared chat UI components
- `packages/hooks` — Common React hooks

The package extraction was the rewarding part. Seeing duplicated code across 5 apps collapse into a single source of truth is deeply satisfying to an engineer's brain. The CSS fixing was just pain.

## Day 3 (Jan 23): App #6 and WeChat Detection — 17 Commits

Added a sixth app: MBTI personality test (MBTI 性格测试). This one was easier to integrate because I built it knowing it would go into the monorepo. Clean imports, standard conventions, shared packages from day one.

The more interesting challenge was WeChat browser detection. If you're not building for Chinese users, you might not know this: a massive percentage of Chinese internet traffic goes through WeChat's built-in browser. Users share links in WeChat chats, tap them, and they open in this embedded WebView that has... quirks.

The WeChat browser has a different user agent, handles JavaScript slightly differently, and doesn't support some features that work fine in Chrome or Safari. Payment flows are particularly tricky because WeChat wants you to use WeChat Pay, not Stripe.

I added detection logic that sniffs the user agent for `MicroMessenger` (WeChat's identifier) and adjusts the UI accordingly. Some features get disabled. Payment flows route differently. It's the kind of thing you'd never think about if you're building for a Western audience, but it's table stakes for China.

## Day 4 (Jan 24): The Big Day — 56 Commits

This was the day everything came together. 56 commits. The highest single-day count so far.

### The Unified API Package

The biggest architectural win: I built `packages/api`, a unified API layer that standardizes how all apps talk to AI models and manage server-side logic. Before this, each app had its own API routes with subtly different patterns. Some used streaming. Some didn't. Error handling was inconsistent. Rate limiting was per-app.

The unified API package gave me:
- **52 API routes migrated** into a consistent pattern
- **SSE streaming standardization** — every AI response now streams through the same pipeline, regardless of which model (Claude or Gemini) is generating it
- **Rate limiting** — unified rate limiter that works across all apps, based on user credits
- **Error handling** — consistent error responses with proper HTTP status codes

This was a Claude Code power move. I described the pattern I wanted for the unified API, showed it one existing route as an example, and had it migrate all 52. It took maybe an hour of wall-clock time. Doing this manually would have been a full day of mind-numbing copy-paste-adjust work.

### GDPR and Legal

Also knocked out the boring-but-necessary stuff: GDPR compliance (data export, deletion requests), terms of service, privacy policy. Chinese internet products have their own regulatory requirements on top of GDPR-style protections, and I wanted this right from the start rather than retrofitting it later.

The legal documents are in both Chinese and English. Claude drafted them, I reviewed. Are they perfect? Probably not. But they're a hell of a lot better than "we'll add terms of service later" which is what most side projects do (i.e., never).

### The Security Package

This one was critical and specific to the China market: a DFA-based sensitive word filter.

If you're serving content in China, you need content filtering. Period. The tricky part is that metaphysics content naturally includes terms that might trigger naive keyword filters. Words related to 命 (fate/destiny), 死 (death), 鬼 (ghosts/spirits) — these are legitimate terms in our domain but could be flagged by blunt filtering approaches.

I built a DFA (Deterministic Finite Automaton) based filter that:
1. Maintains a curated list of actually-sensitive terms (political, violent, etc.)
2. Has an explicit allowlist for metaphysics terminology
3. Processes text in a single pass (O(n) time complexity, important for real-time chat)
4. Handles common evasion techniques (inserting spaces, using homoglyphs)

The allowlist was the part where I leaned heavily on Claude's domain knowledge. "Give me a comprehensive list of Chinese metaphysics terms that might be falsely flagged by content filters" is exactly the kind of question where AI's broad knowledge base shines.

### The Moment

There was this moment around 11 PM where I started all 6 apps locally, logged in with one account, and watched the credits sync across tabs. One login. One credit balance. Six different products. Shared chat history. Unified settings.

It actually worked.

Three days ago I had 5 separate apps that happened to be built by the same person. Now I had one platform. The difference is hard to overstate — it's the difference between a collection of prototypes and an actual product.

## The Commit Pattern

Looking at the git log, you can see the rhythm of these three days:

- Day 2: Lots of small "fix" commits. Cleanup work. Not glamorous.
- Day 3: Focused feature work. Fewer commits, more deliberate.
- Day 4: Explosive productivity. Big architectural changes interspersed with rapid iteration.

111 commits total. That's about 37 commits per day. I'm starting to realize that this velocity is only possible because of the AI-assisted workflow. Claude Code handles the mechanical work — the import path updates, the boilerplate, the "apply this pattern to these 50 files" tasks — and I focus on the architectural decisions and the stuff that requires human judgment.

It's not that the AI is writing all the code. It's that it's handling the parts that would normally slow me down to a crawl. The tedious parts. The parts where I'd normally open Twitter because my brain is bored.

Tomorrow: we start making this thing actually look like a product someone would pay for.
