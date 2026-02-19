---
title: "Days 12-19: Credit Economy, New Features, and the Feature Explosion"
date: "2026-02-08"
summary: "PanPanMao build diary Days 12-19: Referral system, palm reading with MediaPipe, landing page dark luxury redesign, and the realization that engineering is the easy part now."
tags: ["AI", "Software Development"]
series: "Building PanPanMao"
part: 4
type: "Post"
status: "Published"
---

This was the week PanPanMao went from "interesting prototype" to "platform with multiple product verticals, a working economy, and a visual identity I'm actually proud of."

## Days 12-14: The Credit Economy Gets Real

### The Referral System

Every user gets a unique referral code. Referrer gets bonus credits, referee gets a welcome bonus. Sounds simple. Three implementation layers for one piece of data:

1. **URL parameter** — `?ref=PPM-XXXX-XXXX` captured on landing page

1. **localStorage fallback** — persists the code across the signup flow (user might browse before creating an account)

1. **Server-side validation** — Supabase RPC `claim_referral_bonus()` with max referral limits, race condition guards, and fraud detection

The referral amounts went through a real product iteration. Initially asymmetric (10 for referrer, 3 for referee). Users said it felt extractive — "I'm using my friend to get credits." Changed to symmetric (5/5) and referral volume increased. Incentive design is harder than it looks.

PR #59 later fixed a bug where `link_referral()` rejected valid new users because it checked `usage_log` before the user had any usage records. The guard was protecting against something that couldn't happen yet.

### User Profile and Onboarding

PR #41 was a significant UX overhaul: editable user profile fields (name, gender, birthday, birth time, birth place, locale preference), a global onboarding modal that blocks authenticated users until profile completion, and a "quick-fill" button (一键带入我的出生资料) that auto-populates BaZi, astrology, and K-line input forms from saved profile data.

The locale priority system was nuanced: profile `localePreference` overrides browser locale for logged-in users, but the locale switcher stays synced back to the profile. Anonymous users get browser detection only.

## Days 16-19: Building Xiangshu — Palm and Face Reading

The most technically ambitious feature in the entire project. PR #1: 56 files changed, 6,881 lines added, 15 commits.

### MediaPipe In-Browser ML

The detection pipeline runs entirely client-side. No server round-trip for the computer vision part:

- **`useMediaPipeLoader`** — lazy WASM loading (~3MB binary) with module-level cache. First load is slow; subsequent loads are instant.

- **`useFaceDetector`** — BlazeFace model running at 60fps during camera preview. This gives users real-time feedback that the camera can see their face.

- **`useFaceLandmarker`** — 478-point face mesh. Only runs once, on the captured photo. Extracts measurements for the three sections (三停), five officials (五官), twelve palaces (十二宫位).

- **`useHandLandmarker`** — 21-point hand skeleton. Identifies the three major lines (三大主线), auxiliary lines, and mount positions.

- **`useCameraCapture`** — `getUserMedia` with 8-second timeout for mobile browser compatibility.

Live overlays: green dots on palm lines, mesh on facial features. Canvas layer over the video feed, throttled to every other frame on mobile to keep the frame rate usable.

PR #35 later added GPU→CPU fallback for palm detection. Some devices have WebGL support that reports as available but actually fails during inference. The fallback detects the failure and retries with CPU-only mode. PR #50 localized all WASM and model files to app-hosted assets because users in China couldn't reliably reach [cdn.jsdelivr.net](http://cdn.jsdelivr.net/).

### Multimodal AI Interpretation

The captured image goes to Claude or Gemini via a multimodal prompt. But "read this palm" produces generic output. The prompt has four layers:

1. **Role definition** — you are a master of Chinese physiognomy with 30 years of experience

1. **Knowledge injection** — the five officials, three sections, twelve palaces, face shapes, line meanings, mount interpretation rules

1. **Cross-validation** — check your analysis against multiple physiognomy systems

1. **Structured output** — specific sections, confidence levels, actionable advice

30 domain tests verify the knowledge package. The prompt templates inject gender-specific knowledge conditionally: female users get additional analysis for 旺夫/克夫 (husband-supporting/husband-harming) patterns, 柳庄四件 (Liu Zhuang's four criteria), and female-specific palm patterns.

Four days from zero to production. Each capability is individually recent — in-browser ML, multimodal LLMs, structured AI output — but combining them creates something that genuinely feels like magic.

## The Landing Page Redesign

The warm brown/gold theme wasn't working. Products were getting serious — users come with real life questions about career, relationships, health. "Cozy" undermined gravity.

Redesigned to dark luxury. Deep blacks. Gold accents. The cat went from cute mascot to mysterious oracle. Users described it as "trustworthy" and "professional." Same product, different positioning, dramatically different perception.

## Running Totals

By Day 19: 7 product verticals, working credit economy, referral system, dark luxury landing page, in-browser palm/face reading. Around 700 commits.

The bottleneck flipped. It's not engineering anymore. It's product decisions. What to build next. How to position it. What price to charge. The engineering can keep up with whatever I decide — the hard part is deciding well.
