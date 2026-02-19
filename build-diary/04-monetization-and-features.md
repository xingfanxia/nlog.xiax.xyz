---
title: "Days 12-19: Credit Economy, New Features, and the Feature Explosion"
date: "2026-02-08"
tags: ["panpanmao", "build-diary", "ai-development"]
series: "Building PanPanMao"
part: 4
---

# Days 12-19: Credit Economy, New Features, and the Feature Explosion

This was the week PanPanMao went from "interesting prototype" to "platform with multiple product verticals, a working economy, and a visual identity I'm actually proud of." It was also the week where the scope of what one person + AI can build started to genuinely surprise me.

## Days 12-14 (Feb 1-3): The Credit Economy Goes Live

The credit system was working technically since the Stripe integration on Day 10, but "technically working" and "actually driving user behavior" are different things.

### Referral System

Built the referral system from scratch. Every user gets a unique referral code. Share it, and when someone signs up through your link: referrer gets bonus credits, referee gets a welcome bonus. Simple mechanism, powerful incentive.

The initial structure was asymmetric: referrer gets 10 小鱼干, referee gets 3. The logic was that the referrer is doing the heavy lifting (actively sharing), so they should get more. This would change later based on user feedback, but it was a reasonable starting point.

The implementation touched more files than I expected. Referral tracking needs to persist across the signup flow (user clicks link -> lands on page -> signs up -> credits must be attributed). I stored the referral code in a URL parameter, persisted it in localStorage as a fallback, and validated it server-side during account creation. Three layers of persistence for one piece of data. Classic frontend reliability engineering.

### Testimonials

Added real user testimonials to the landing page. Even in these early days, a few friends had tried the platform and given feedback. Having actual quotes from actual people (with their permission) makes a landing page feel dramatically more credible.

This is another thing I wouldn't have thought about from a pure engineering perspective. Social proof isn't a feature — it's a trust signal. And for a platform that's asking people to share personal information (birth dates, dreams, palm photos), trust is everything.

## Days 16-19 (Feb 5-8): Building Xiangshu — Palm and Face Reading

This was the most technically ambitious feature yet, and also the most fun to build.

手相面相 (Xiangshu) — palm reading and face reading using AI vision. The user points their camera at their hand or face, the app detects landmarks, and AI provides a reading based on the features it sees.

### The Technical Stack

**MediaPipe** for detection. Google's MediaPipe provides pre-trained models for hand landmark detection and face mesh that run entirely in the browser. No server round-trip for the detection itself. The models identify 21 hand landmarks (including finger joints, palm center) and 468 face landmarks.

Getting MediaPipe to work reliably in a Next.js app was its own adventure. The library expects a specific loading environment, has WASM dependencies that need to be served correctly, and the camera access flow has different permission models across browsers (especially WeChat's browser, which of course handles it differently).

**Camera capture with live overlays.** When the user opens the camera, they see their hand or face with highlighted landmark points in real-time. Green dots on palm lines. Mesh overlay on facial features. It gives immediate visual feedback that "yes, the AI is seeing your hand/face correctly."

The overlay rendering uses a canvas layer on top of the video feed. Frame rate was a concern — you need smooth 30fps rendering while running the MediaPipe model, all in the browser. On older phones this was genuinely challenging. I ended up throttling the detection to every other frame on mobile devices, which gives a smooth visual experience without cooking the CPU.

**Multimodal AI prompts.** Here's where it gets magical. Once the user captures an image, it gets sent to the AI (Claude or Gemini, depending on the model the user selects) along with a detailed prompt about palm reading or face reading analysis. The AI sees the actual image and provides a reading based on what it observes.

The prompt engineering for this was extensive. You can't just send an image and say "read this palm." You need to tell the AI what to look for — the three major palm lines (life line, head line, heart line), the mounts of the palm, finger proportions. For face reading: the 五官 (five features), face shape, proportion ratios. Claude helped me research all of this — remember, I know nothing about palmistry — and then I used that research to build prompts that guide the AI's analysis.

### The Magic Moment

The first time I pointed my phone camera at my hand, saw the green landmark dots appear on my palm lines, tapped capture, and got back a detailed reading about my life line suggesting strong vitality and my head line indicating analytical thinking... I just sat there for a minute.

This is genuinely something that would have been impossible to build as a solo developer even two years ago. The combination of browser-based ML models (MediaPipe), multimodal AI that can see and reason about images, and the domain knowledge to know what to analyze — each of these is a recent capability. Together they enable a product that feels like magic.

I sent the prototype to a few friends. The reaction was unanimously "wait, this is real?" Yes. It's real. And it took about four days to build.

## The Landing Page Redesign

Somewhere in the middle of building Xiangshu, I looked at the landing page with fresh eyes and realized the warm brown/gold theme wasn't working anymore.

The original warm palette was cozy. Cat-themed. Friendly. But as the platform grew and the product verticals got more serious — palm reading, BaZi analysis, annual fortune forecasting — "cozy" started feeling wrong. People are coming to this platform with real life questions. Career decisions. Relationship anxieties. Health concerns. The warm, cute vibe undermined the gravity of what users actually cared about.

I redesigned the entire landing page with a dark luxury aesthetic. Deep blacks and very dark grays as the base. Gold accents for emphasis. Elegant typography. High contrast. The cat branding stayed, but now the cat felt more like a mysterious oracle than a cute mascot.

The redesign was a full day of work. Every component on the landing page — hero section, feature cards, pricing table, testimonials, footer — got rebuilt. The new version looks like it belongs to a premium product. Something you'd trust with your personal questions.

Was this the right call? I think so. The user feedback after the switch was consistently positive. People described it as "more professional" and "feels trustworthy." For a fortune-telling platform, "trustworthy" is the highest compliment.

## Running Totals

By the end of Day 19:
- **7 product verticals** (BaZi, astrology, tarot, dream interpretation, Liuren, MBTI, palm/face reading)
- **Working credit economy** with Stripe payments
- **Referral system** driving organic growth
- **Dark luxury landing page** that actually converts
- Somewhere around 700 commits

This was the week where the velocity of AI-assisted development really became apparent. Building Xiangshu — with MediaPipe integration, camera handling, canvas overlays, multimodal AI prompts, and a full UI — in four days as a solo developer is absurd. It's the kind of feature that would be scoped as a 2-3 sprint effort at a mid-size company with a dedicated team.

I'm starting to understand that the bottleneck isn't engineering anymore. It's product decisions. What to build next. How to position it. What price to charge. The engineering can keep up with whatever I decide — the hard part is deciding well.
