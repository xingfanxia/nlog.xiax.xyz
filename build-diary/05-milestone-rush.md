---
title: "Days 20-23: Shipping M1, M2, M3 in Four Days"
date: "2026-02-12"
tags: ["panpanmao", "build-diary", "ai-development"]
series: "Building PanPanMao"
part: 5
---

# Days 20-23: Shipping M1, M2, M3 in Four Days

166 commits in four days. Three formal milestones shipped. This was the stretch where the project stopped being about building features and started being about building a business.

## The Milestone Framework

Up until now I'd been committing directly to main, building whatever felt right, and shipping when things worked. That's fine for prototyping. It's not fine for a product that real people are starting to use.

So I introduced milestones. Not because I needed project management (it's just me), but because I needed to think in terms of complete, shippable increments. Each milestone is a coherent set of features that, together, make the product meaningfully better for users.

I also started using PRs properly. PRs #2 through #18 happened in this four-day window. Before this, the codebase was "mature enough that things work." After this, it was "mature enough that I can review changes before they merge."

It might seem silly for a solo developer to review their own PRs. But I use them as a forcing function for documentation. Every PR has a description of what changed and why. When future-me is debugging something at 2 AM, those PR descriptions will be invaluable.

## M1: Credit Economy Foundation (Days 20-21)

The credit system technically worked, but it had gaps that would bite real users. M1 was about closing every single gap.

**Auth fixes.** Anonymous authentication was half-implemented. Users could try one free reading without signing up, but the transition from anonymous to authenticated (when they decided to sign up) sometimes lost their history. Fixed this by implementing proper anonymous-to-authenticated account merging: the anonymous session's data gets migrated to the real account, seamlessly.

**Cross-tab sync.** This was a subtle bug that drove me crazy. User buys credits in one tab, switches to another tab where they have an app open, and the credit balance shows the old value. They think the purchase failed. They buy again. Now they've been charged twice and they're angry.

The fix: Supabase real-time subscriptions on the credit balance. When credits change in the database, every open tab gets the update within a second. It's the kind of invisible polish that users never notice when it works but absolutely notice when it doesn't.

**Payment gate.** The free tier gives users a few initial 小鱼干 to try things out. But once those are spent, every action needs to check credits, show a clear "you need more credits" message, and direct users to the purchase page. This sounds trivial. It's not. The payment gate needs to appear in different contexts — mid-conversation in a chat, when starting a new reading, when viewing results that require credits. Each context has different UI requirements.

I ended up with 7 contextual upgrade triggers throughout the app. Each one is tailored to where the user is and what they're doing. "You've used your free readings. Get more 小鱼干 to continue" hits different than "Unlock your complete analysis for 3 小鱼干." Same destination, different persuasion.

**Redeem codes.** Built a code redemption system for promotions and partnerships. Admin can generate batches of codes with configurable credit amounts and expiration dates. Users enter a code and get credits. Simple feature, but it opens up distribution channels — I can give codes to influencers, include them in marketing campaigns, or use them as customer support gestures.

**Asymmetric referral bonuses.** Finalized the referral reward structure: referrer gets 10 小鱼干, referee gets 3. The asymmetry is intentional — the referrer is providing more value (actively promoting the product) so they get more reward. This would later change to a symmetric 5/5 split based on user feedback, but the asymmetric version shipped first.

## M2: Daily Hub (Day 22)

This was the engagement play. The problem with fortune-telling apps is that they're inherently event-driven — you use them when you have a specific question, then you leave and might not come back for weeks. The Daily Hub was designed to give users a reason to come back every single day.

The Hub is a page with daily content cards:
- **Tarot card of the day** — a randomly drawn card with interpretation
- **Zodiac daily fortune** — based on the user's Western zodiac sign
- **BaZi day pillar** — the Heavenly Stem and Earthly Branch for today, with analysis

The key architectural decision: **pre-generation**. These cards are NOT generated on-demand when a user visits. They're generated at midnight via a cron job. When a user opens the Hub at 8 AM, the content is already there. Instant load. No spinner. No waiting for AI to generate a response.

This matters more than you'd think. In testing, the difference between "instant content" and "loading... 3 seconds... here's your content" was dramatic for perceived quality. The instant version feels like the app knows what it's doing. The loading version feels like it's making stuff up on the spot (even though the result is identical).

The cron job runs as a Vercel cron function. At midnight (Beijing time, since that's the target market), it generates the next day's content for all zodiac signs and stores it in Supabase. Each card is generated once and served to all users of that zodiac sign. Cost-efficient and fast.

The Hub also became the natural home screen for the app. Instead of landing on a product list, users land on the Hub with fresh daily content. It feels alive. It feels like the app has something new for you every day.

## M3: Distribution (Day 23)

With the product stabilized (M1) and engagement designed (M2), M3 was about measurement and distribution prep.

**PostHog integration.** Added event tracking across the entire platform. Page views, feature usage, credit purchases, conversion funnel events. PostHog was the right choice here — it's self-serve, generous free tier, and the event tracking API is clean.

The events I'm tracking tell the story of user behavior:
- Which products do users try first?
- What's the conversion rate from free readings to credit purchases?
- How many referrals does an average user generate?
- What's the daily return rate for Hub visitors vs non-Hub visitors?

I can't answer most of these questions yet (not enough users), but the instrumentation is in place for when I can.

**Admin cleanup.** Built out the admin dashboard with tools for managing users, viewing credit transactions, generating redeem codes, and monitoring system health. Not glamorous, but essential for operating a real product.

## The Shift

These four days marked a clear shift in how I think about PanPanMao. Before M1-M3, I was thinking like an engineer: "What feature should I build next?" After M1-M3, I'm thinking like a product person: "What behavior should I drive next?"

Conversion funnels. Retention hooks. Daily engagement. Referral incentives. These aren't engineering problems. They're business problems that happen to require engineering to implement.

The PR workflow also changed my relationship with the codebase. PRs #2 through #18 each tell a story. I can trace the evolution of the product through them. And when something breaks, I can bisect to a specific PR rather than scrolling through 166 individual commits.

166 commits. 3 milestones. 17 PRs. And for the first time, I'm thinking about user retention instead of feature lists. The product is growing up.
