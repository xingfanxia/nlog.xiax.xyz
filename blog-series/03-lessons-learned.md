---
title: "What I Learned Shipping a Real Product as a Solo AI-Augmented Developer"
date: "2026-02-18"
tags: ["panpanmao", "ai-development", "indie-hacker", "build-story"]
series: "Building PanPanMao: 1,134 Commits in 29 Days"
part: 3
---

# What I Learned Shipping a Real Product as a Solo AI-Augmented Developer

In [Part 1](/blog-series/01-why-zero-domain-knowledge), I explained why I built PanPanMao -- an AI-powered Chinese metaphysics platform -- with zero domain knowledge. In [Part 2](/blog-series/02-technical-build-story), I broke down the technical build across 29 days and 1,134 commits. Now I want to share the honest lessons. Not the "everything went great and here's my framework" version. The real one.

Some of these lessons were humbling. Some were surprising. A few changed how I think about software development entirely.

## On AI Bridging Domain Knowledge

The core hypothesis of PanPanMao was that AI could completely bridge a domain knowledge gap. After 29 days, my answer is: **yes, with significant caveats.**

### What Worked

The BaZi calculation engine is approximately 20,000 lines of TypeScript. It handles the Heavenly Stems and Earthly Branches (天干地支) system, the Five Elements interactions (五行), the ten-year luck pillars (大运), the Day Master concept (日主), and the annual fortune cycles. I built none of this from existing personal knowledge. All of it was researched, validated, and implemented through conversation with Claude.

The dream interpretation database contains over 1,000 symbolic entries -- animals, objects, scenarios, cultural references -- each with interpretive meanings compiled from both Western and Chinese dream analysis traditions.

78 tarot cards with detailed interpretive frameworks for upright and reversed positions, including Chinese cultural context that doesn't appear in most English-language tarot resources.

Users who actually know BaZi have told me the calculations are correct. People familiar with tarot say the interpretations are nuanced. The domain knowledge is credible.

### What Required Human Judgment

You need to know HOW to ask the right questions. This is the caveat that makes "zero domain knowledge" not quite as zero as it sounds.

"Tell me about BaZi" gives you a Wikipedia-level overview. Useless for implementation. "Explain the interaction between the Day Master and the Month Branch in terms of element productivity cycles, and how this affects career analysis" gives you something you can actually turn into code.

I spent the first few days of the project asking Claude to teach me the domain. Not to write code -- to explain concepts. I built a mental model of how Chinese metaphysics works, even a simplified one. Once I had that model, I could ask implementation-level questions that produced usable output.

The meta-skill isn't domain expertise. It's the ability to rapidly build enough understanding to ask the right questions. Zero knowledge is possible. Zero curiosity is not.

### What Required External Validation

I had Chinese friends who are familiar with metaphysics sanity-check the interpretations. Not the code -- the output. Does this BaZi reading sound credible? Does this tarot interpretation make sense in a Chinese cultural context? Is the tone right -- mystical but not absurd, specific but not prescriptive?

AI can generate plausible-sounding domain content. But "plausible-sounding" and "actually good" are different things, and I couldn't personally tell the difference. External validation was essential, not optional.

## On Product vs. Engineering

This is the lesson that hit hardest. I've been a professional engineer for over a decade. I've never been a professional product person. PanPanMao forced me to be both, and the contrast was illuminating.

### Things I Severely Underestimated

**Landing page iteration.** The landing page went through three full redesigns. Not because the code was wrong -- because the positioning was wrong.

Version 1: Purple theme. Generic tech look. Could have been any SaaS product. Users looked at it and felt nothing.

Version 2: Warm brown and gold. Cat-themed. Friendly and approachable. Better, but as the product verticals got more serious -- palm reading, annual fortune forecasting, BaZi analysis -- "cozy" started undermining the gravity of what users actually cared about. People come to this platform with real questions about their careers, relationships, and health. Cute doesn't cut it.

Version 3: Dark luxury. Deep blacks, gold accents, elegant typography. The cat branding stayed, but the cat became a mysterious oracle instead of a cute mascot. Users described this version as "trustworthy" and "professional." For a fortune-telling platform, "trustworthy" is the highest compliment.

Each redesign was a full day of work. Not because the CSS was hard, but because I had to rethink the entire value proposition and how it's visually communicated. These are not engineering problems. These are positioning problems that happen to require engineering to fix.

**Pricing psychology.** I spent more time on the credit package page than on any API endpoint. Which tier gets the "Most Popular" badge? What's the discount curve from small to large packages? Should the per-credit price be visible or the per-reading cost? Should the total be prominent?

The decision to name credits "小鱼干" (dried fish treats) instead of something generic like "tokens" was a product decision, not an engineering one. But it matters. People are more willing to spend 5 fish treats than $0.70, even though it's the same thing. The abstraction reduces the psychological pain of spending. Casinos figured this out decades ago. I had to learn it from scratch.

**Conversion funnels.** I built 7 contextual upgrade triggers -- moments where a user who's out of credits sees a prompt to purchase more. Each trigger is tailored to its context. "You've used your free readings. Get more 小鱼干 to continue" is different from "Unlock your complete analysis for 3 小鱼干." Same destination, different persuasion strategies for different emotional moments. Each trigger has a 24-hour cooldown to avoid feeling aggressive.

Getting these right required thinking about user psychology, not code. When is a user most willing to pay? Right after they've seen enough of a reading to be curious about the full version. Where should the upgrade prompt appear? Inline, not in a modal, because modals feel like interruptions. What language converts best? Specific amounts ("3 小鱼干") outperform vague ("get more credits").

None of this was intuitive to me as an engineer. I learned all of it through iteration and user feedback.

**Retention design.** The Daily Hub exists purely for retention. It doesn't generate revenue directly. But it gives users a reason to open the app every day, and daily active usage correlates with lifetime value. Pre-generating content at midnight via cron so it loads instantly was an engineering decision in service of a product insight: if the Hub feels slow, people won't come back.

### Things I Overestimated

**Architectural perfection.** The monorepo has leaky abstractions. Some shared packages could be cleaner. A few API endpoints carry tech debt from the early migration days. None of this matters to users. Shipping beats polish, every time.

**Test coverage.** I invested four full days in testing early in the project. It was worth it -- tests caught regressions during the branding redesigns. But 80% coverage on everything was overkill for a solo project moving at this speed. The right strategy was "cover the critical paths aggressively and accept that some UI components don't need unit tests."

## On the Agentic Coding Workflow

Here's the misconception I want to correct: **97% AI-generated code does not mean 97% less work.** It means 97% less typing and roughly 10x more shipping.

My role shifted from "writer of code" to "director of code." On any given day, I was:

- **Architecting**: deciding what to build, how it should be structured, which patterns to follow
- **Reviewing**: reading every AI-generated change, checking for correctness, consistency, and security issues
- **Prompt engineering**: writing and tuning the domain-specific prompts that determine the quality of fortune readings
- **Course-correcting**: when Claude went down a wrong path (over-engineering a simple endpoint, misunderstanding a UI requirement), redirecting quickly
- **Testing**: running the product, trying edge cases, checking that the user experience felt right

The `claude/` and `codex/` branches in the git history are the visible proof of this workflow. These aren't branches where I typed code. They're branches where AI agents proposed changes and I reviewed, adjusted, and merged them.

The surprising insight: **AI is better at consistency than humans.** When I established a pattern for API endpoints -- input validation, credit check, AI call, response formatting -- Claude applied that pattern more uniformly to new endpoints than I would have. Humans get bored with repetitive patterns. We start cutting corners, taking shortcuts, introducing subtle inconsistencies. AI applies the same pattern with the same care on the 50th endpoint as it did on the first.

Where AI struggled: anything requiring emotional intelligence. The tone of fortune readings was the hardest thing to get right. Users come with real anxieties. A palm reading that's technically accurate but emotionally tone-deaf is a bad product. Getting the AI's output to feel empathetic but not patronizing, specific but not prescriptive, mystical but not absurd -- that required extensive manual prompt iteration that I could not delegate.

## On Regulatory Compliance for the China Market

This one blindsided me.

**Content filtering is mandatory, not optional.** If you're serving content to Chinese users, you need a sensitive word filter. I built a DFA (Deterministic Finite Automaton) based system that processes text in a single pass -- O(n) time complexity, which matters for real-time chat.

The hard part wasn't building the filter. It was the allowlist. Chinese metaphysics content naturally includes terms that trigger naive keyword filters. Words related to 命 (fate/destiny), 死 (death), 鬼 (ghosts/spirits) are legitimate terminology in this domain. The term 麻衣相法 (a classical face-reading text) contains character sequences that set off filters. I needed a carefully curated allowlist that lets metaphysics terminology through while still catching genuinely problematic content.

**WeChat browser compatibility is table stakes.** A massive percentage of Chinese internet traffic goes through WeChat's built-in WebView. Users share links in WeChat chats, tap them, and land in a browser that has... quirks. Different user agent, different JavaScript behavior, different camera access flow. Payment flows are particularly tricky because WeChat wants you to use WeChat Pay, not Stripe.

I added `MicroMessenger` user agent detection that adjusts the UI accordingly. Some features disable. Payment flows route differently. You'd never think about this building for a Western audience. For a Chinese audience, it's non-negotiable.

**Legal documents in two languages.** Terms of service, privacy policy, data handling disclosures. Chinese internet regulation has its own requirements on top of GDPR-style protections. Claude drafted both versions. Are they perfect? Probably not. But they're better than "we'll add terms of service later" -- which is what most side projects do, meaning never.

## On Being Solo

No meetings. No standups. No alignment sessions. No "let's circle back." No Jira tickets. No sprint planning. Just git commit and ship.

The freedom was intoxicating. I could decide at 11 PM that the landing page needed a redesign and have it done by 2 AM. No one to convince. No design review. No stakeholder alignment.

**The downside: no one catches your blind spots.** No one asks "are you sure users want this?" No one pushes back on the third redesign of a feature that's already good enough. The discipline of knowing when to stop iterating and ship -- that's harder without a team pushing you toward deadlines.

One interesting counterbalance: the **PanPanMao Bug Reporter**. I set up an automated CI bot that runs comprehensive checks and files GitHub issues for anything it finds. Over the course of the project, it filed 32 issues. AI-powered QA gave me a rudimentary version of "someone else looking at your code." It's not a human reviewer. But it caught things I would have missed, particularly edge cases in the credit flow and inconsistencies in API response formats.

The honest assessment: being solo is faster for building and slower for quality. I shipped more in 29 days than I would have with a team, because there was zero coordination overhead. But a team would have caught problems I didn't find until users reported them.

## On Credit Economies and Incentive Design

Building a freemium model from scratch taught me more about user psychology than any A/B test at a big-tech company.

**The referral system was a real-time lesson in incentive design.** The initial structure was asymmetric: referrer gets 10 小鱼干, referee gets 3. My logic was sound -- the referrer is doing the heavy lifting by actively sharing, so they deserve more reward.

Users disagreed. They told me sharing the referral link felt extractive. "I'm using my friend to get credits" rather than "we both benefit." The asymmetry made them uncomfortable.

I changed it to a symmetric 5/5 split. Sharing immediately felt like giving a gift instead of running a scheme. Referral volume went up. The insight is simple but easy to miss: incentive structures aren't just about maximizing the action you want. They're about how the action feels to the person doing it.

**The credit abstraction matters more than the price.** Charging $0.70 per reading would feel more expensive than charging 5 小鱼干, even at the same actual price point. The abstraction creates psychological distance from real money. It also enables granular pricing -- some readings cost 3 fish treats, others cost 8 -- without requiring users to think in fractional dollars.

**Bundle psychology is real.** The "Most Popular" badge on the middle credit package isn't just a label. It's an anchor. Users don't evaluate the middle option in isolation. They evaluate it relative to the cheapest option (less value per credit) and the most expensive option (more commitment than they want). The badge gives them permission to choose the middle. Removing it, even temporarily during A/B testing, decreased conversion on that tier significantly.

## The Meta-Lesson

This project isn't really about fortune-telling. I want to be clear about that.

PanPanMao is a proof of concept for a bigger idea: **the era of the solo AI-augmented builder is here.** One engineer plus AI tools can build what used to require a team of 5-10 people. The velocity numbers are the evidence:

- 1,134 commits in 29 days
- 9 product verticals, each with real business logic and AI pipelines
- 284,000 lines of code
- 85 API endpoints
- Working credit economy with real paying users
- Built in a domain the developer knew nothing about
- $0 in employee costs

This doesn't mean teams are dead. Teams bring diverse perspectives, quality assurance, specialized expertise, and the ability to ship on multiple fronts simultaneously. What it means is that the minimum viable team for a real, multi-product platform has collapsed from "5 engineers, 1 PM, 1 designer" to "1 engineer with good taste and good AI tools."

The implications for indie hackers are obvious: you can now compete in markets that used to require venture funding and a team. The implications for the industry are more subtle: if one person can do what ten people used to do, the value per skilled engineer goes up, not down. The engineers who thrive won't be the ones who type the fastest. They'll be the ones who architect the best, review the most critically, and ask the sharpest questions.

## What's Next for PanPanMao

The platform is live. Users are paying. The credit economy is functioning. But "live" and "successful" are different things, and I have a long way to go on the second one.

**Short-term priorities:**
- Retention optimization. The Daily Hub drives daily visits, but I need to convert daily visitors into paying users more effectively.
- Content quality. The AI-generated readings are good. They need to be great. This means more prompt iteration, more user feedback, more domain validation.
- Mobile experience. Chinese users are overwhelmingly mobile. The responsive design works, but a dedicated mobile experience would be better.

**Medium-term:**
- New verticals. There are more metaphysics domains to cover -- Zi Wei Dou Shu (紫微斗数), Feng Shui (风水), I Ching (易经). Each is a new product that can leverage the existing platform infrastructure.
- Community features. Fortune-telling is inherently social -- people want to share readings, compare charts, discuss interpretations. Building community features could dramatically improve retention.
- WeChat Mini Program. For the China market, a WeChat Mini Program might reach users more effectively than a web app.

**The bigger picture:**

The playbook I developed building PanPanMao -- AI for domain knowledge, AI for code generation, human for architecture and product -- is repeatable. The specific domain doesn't matter. What matters is the approach: pick a domain with real demand and bad existing solutions, use AI to bridge the knowledge gap, ship fast, iterate on user feedback.

I came into this project wanting to learn what it's like to build a complete product -- not just the engineering, but the GTM, the pricing, the user psychology, the business. I got what I wanted, and then some.

The most surprising thing I learned? The engineering was the easy part. Not because engineering is easy -- it's not. But because AI has made the execution of engineering dramatically faster. The hard parts are now the parts that AI can't do for you: deciding what to build, understanding why users behave the way they do, designing incentives that feel right, and having the taste to know when something is good enough to ship.

Those are human problems. And they're the most interesting problems I've worked on in years.

---

*PanPanMao (盘盘猫) is live. If you want to see what one engineer plus AI built in 29 days, check it out. And if you're thinking about building your own AI-augmented solo project -- do it. The tools are ready. The question is whether you are.*

*Find me at [ax0x.ai](https://ax0x.ai). The git history speaks for itself: 1,134 commits, 97% AI-assisted, and I still can't read a palm.*
