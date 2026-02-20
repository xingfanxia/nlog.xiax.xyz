# Blog Rewrite Plan — Agentic AI Thoughts Series

## Overview

Review found 14 issues across the 3-part series (EN + ZH). This plan covers all fixes.
Each fix must be applied to **4 locations**: nlog content/, personal_site/blog/, and both Notion pages (EN + ZH).

## Notion Page IDs

| Post | EN Page ID | ZH Page ID |
|------|-----------|-----------|
| Part 1: Companion Vision | (lookup from posts.json) | (lookup from posts.json) |
| Part 2: Wearables | 30ce3dcd-5100-8168-be22-f43786c1436f | 30ce3dcd-5100-81f7-8d1b-d323382f3195 |
| Part 3: Agent Economy | 30ce3dcd-5100-813f-8173-cbacf4bd9fdb | 30ce3dcd-5100-811c-b83c-ce71013646a4 |

---

## Fix 1: Digital twin contradiction (Part 1, HIGH)

**Problem:** Part 1 line 54 says "not a digital twin (that's someone else's idea)" but Part 3 is built around digital twins.

**Fix:** Remove the distancing parenthetical. Replace with a forward reference:

EN:
```
Think of it as building a "virtual you" — an internal model deep enough that the AI can predict not just what you'd say, but *why* you'd say it. (In Part 3, I'll explore how this same model becomes your "digital twin" — a proxy that socializes on your behalf.)
```

ZH: Equivalent change with forward reference to Part 3.

---

## Fix 2: Spatial awareness privacy dodge (Part 2, HIGH)

**Problem:** Lines 84-88 introduce camera-based environmental sensing but handwave privacy concerns with "not constant surveillance, but periodic snapshots."

**Fix:** Add 2-3 sentences after the spatial awareness intro that address the privacy boundary head-on:

EN:
```
**Spatial awareness** — a camera or sensor that occasionally scans your environment. This is where privacy gets real. The key constraint: the user must explicitly opt in and control when snapshots happen — a manual trigger, not passive collection. The raw image never leaves the device; on-device vision models extract semantic signals ("cluttered desk," "takeout containers," "dark room") and only those labels reach the companion. No photos stored, no images transmitted. This is the same privacy architecture as the biometric edge processing — raw data stays local, only meaning goes to the cloud.

Is your space getting cluttered? Are there takeout containers piling up? ...
```

ZH: Equivalent change emphasizing user control + on-device processing.

---

## Fix 3: 200K token claim outdated (Part 1, MEDIUM)

**Problem:** Line 46 says "the best ones top out at 200K tokens" — factually wrong in 2026.

**Fix:** Replace with:

EN: "Current AI models have a finite context window — even the million-token models can't hold a lifetime of conversations."

ZH: "当前最好的AI模型有有限的上下文窗口——即使是百万token的模型也装不下一个人一生的对话。"

---

## Fix 4: "Robots" out of nowhere (Part 3, MEDIUM)

**Problem:** Line 108 says "Agents and robots will take over large parts of personal life" — robots never mentioned elsewhere.

**Fix:** Remove "and robots" / "和机器人":

EN: "I think the agent economy is inevitable. Agents will take over large parts of personal life."

ZH: "我认为agent经济是必然的。Agent将接管个人生活的大部分。"

---

## Fix 5: Agents as Organs too vague (Part 1, MEDIUM)

**Problem:** Lines 70-84 list four agents but never explain how they coordinate.

**Fix:** Add a paragraph after the bullet list explaining the coordination layer:

EN:
```
Each agent owns a function, like a biological system. But what makes it an organism — not just a list of features — is how they coordinate. The Memory agent continuously feeds personality signals to the Emotion and Judgment agents. The Emotion agent adjusts the tone before any response reaches the user. The Judgment agent can override the default response — if you're spiraling, it might choose to challenge you rather than comfort you, based on what the Memory agent knows about how you handle stress. And the Initiative agent watches for moments when the system should speak first — a biometric dip, a missed check-in, a pattern that matches a past crisis. The whole system converges before every interaction: what do we know, what does this person need right now, and what's the best way to deliver it?
```

ZH: Equivalent explanation of agent coordination.

---

## Fix 6: Redistribution problem oversimplified (Part 3, MEDIUM)

**Problem:** Line 30 treats agent capability as a copyable prompt/workflow, ignoring that value comes from tool access, APIs, and data.

**Fix:** Add nuance:

EN:
```
**The redistribution problem.** Software skills are infinitely copyable — but an agent's value isn't just its instructions. It's the combination of prompts, tool access, API credentials, and proprietary data sources. A legal research agent is valuable because it has access to Westlaw, not because its prompt is clever. Still, the prompt and workflow layer *is* copyable, and that's the part that's hardest to protect. You can gate tool access, but the reasoning layer — the "how to think about this problem" part — leaks the moment someone uses your agent. There's no DRM for intelligence.
```

ZH: Equivalent nuance.

---

## Fix 7: "Big tech won't touch it" overstated (Part 2, MEDIUM)

**Problem:** Lines 96-103 claim biometric + AI is a regulatory gray zone, but Apple already collects health data.

**Fix:** Make the distinction more precise:

EN:
```
**Regulatory fear.** Big tech already collects biometric data — Apple Watch tracks your heart rate, Samsung Galaxy Ring monitors your sleep. That's not the problem. The regulatory gray zone starts when you combine that data with an AI that interprets your emotional state and gives mental health guidance. That's where it crosses from "health tracking" into "unregulated therapy," and no public company's legal team will sign off on that.
```

ZH: Equivalent precision.

---

## Fix 8: "Hijacked mid-conversation" vague (Part 3, MEDIUM)

**Problem:** Line 32 uses the phrase without explaining what it looks like.

**Fix:**

EN:
```
**The identity problem.** How do you know an agent is who it claims to be? Identity verification for humans is hard enough. For agents, it's a whole new dimension. Agents can be cloned or spoofed outright. Worse, they can be hijacked mid-conversation through prompt injection — a malicious input that overrides the agent's instructions and makes it serve a different master, all while the user thinks they're still talking to the original.
```

ZH: Equivalent with prompt injection explanation.

---

## Fix 9: Infrastructure Layer section repeats (Part 3, MEDIUM)

**Problem:** Lines 94-104 restate concepts already covered in detail without adding new insight.

**Fix:** Reframe the section to tie together marketplace + digital twins + social networks, rather than just restating marketplace needs:

EN:
```
## The Infrastructure Layer

The marketplace, the digital twin network, and the companion economy all converge on the same missing infrastructure:

**Agent identity** — the marketplace needs to know what an agent can do. The social network needs to verify that a digital twin actually represents who it claims. The companion needs to prove it hasn't been tampered with. Same primitive, three use cases.

**Agent payment rails** — marketplace agents need to pay each other for tasks. But digital twins also need to transact — your twin might pay for premium introductions, or compensate another twin's owner for their time. Micropayments between agents, from $0.02 for a quick lookup to $200 for a deep analysis, without human approval for each one.

**Agent reputation** — behavioral, not survey-based. Version-aware, because Claude 4 and Claude 5 might have completely different reliability profiles. And cross-context: an agent's marketplace track record should inform how much you trust it as a social proxy.

**Agent sandboxing** — execution environments where agents can work without exfiltrating data, manipulating context, or coordinating to game the system. Critical for all three layers — you can't have a social network of digital twins if one compromised twin can poison the whole graph.
```

ZH: Equivalent rewrite tying the three themes together.

---

## Fix 10: OpenClaw description vague (Part 1, LOW)

**Problem:** Line 86 describes SOUL.md/HEARTBEAT.md/MEMORY.md without concrete explanation.

**Fix:** Add one sentence each:

EN:
```
SOUL.md defines the personality — not just traits, but ambitions, flaws, emotional range. It's a structured document that the AI references before every response to stay in character. HEARTBEAT.md controls autonomous initiative — a scheduling system where the agent evaluates whether to reach out based on time elapsed, conversation patterns, and detected emotional state. MEMORY.md handles continuity across conversations — extracting personality signals and storing them as retrievable context for future sessions.
```

ZH: Equivalent.

---

## Fix 11: Name-drops without context (Part 1, LOW)

**Problem:** Lines 116-117 reference Noah Smith and Matt Shumer without links or context.

**Fix:** Either add brief context or remove:

EN:
```
Noah Smith, the economics writer, argued that we're no longer the smartest type of thing on Earth. Matt Shumer, CEO of HyperWrite, says the biggest change in human history is happening and most people don't see it.
```

ZH: Equivalent with brief descriptions.

---

## Fix 12: ZH code-switching (Part 1 ZH, LOW)

**Problem:** Line 108 uses English "stigma" without explanation. Line 32 uses "roleplay" and "fantasy."

**Fix:**
- Line 108: Replace "有更多的stigma" with "有更多的心理包袱"
- Line 32: Replace "在模拟、在roleplay、在满足人的fantasy" with "在模拟、在角色扮演、在满足人的幻想"

---

## Fix 13: "My Bet" endings repetitive (cross-article, LOW)

**Problem:** All three articles end with same structure.

**Fix:** Keep Part 3's ending as-is (it works as a series closer). Vary Parts 1 and 2:
- Part 1: End with the question ("can AI make you feel understood") — drop the "I'm building it" line
- Part 2: End with a forward-looking challenge rather than a statement — e.g., "The question is whether we build the sensing layer before the companion AI outgrows it"

---

## Fix 14: Memory orchestration depth mismatch (cross-article, LOW)

**Problem:** Part 1 calls memory orchestration the "hard problem" and "moat" but stays abstract. Part 2 delivers the concrete details.

**Fix:** In Part 1's memory section, add a brief concrete example to make the moat claim credible on its own:

EN:
```
What I want to build is memory that captures **the essence of who you are**. Each conversation adds another layer to a virtual model of you — not a summary of facts, but a growing understanding of your personality, your values, your contradictions, your growth.

Here's a concrete example: you mention three different career frustrations over three months. A summary-based system stores "user is frustrated with career." A personality-model system notices that all three frustrations share a pattern — you're not actually unhappy with the work, you're unhappy with not being recognized. That insight changes the advice the companion gives. That's the difference between remembering what you said and understanding who you are.
```

ZH: Equivalent concrete example.

---

## Execution Order

1. Fixes 1, 2, 4 (High + easy Medium) — structural/factual, no judgment needed
2. Fixes 3, 8, 12 (Quick text swaps)
3. Fixes 5, 6, 7, 9 (Paragraph rewrites — more substantial)
4. Fixes 10, 11, 13, 14 (Low priority polish)

After each batch: update all 4 locations (nlog content/, personal_site/blog/, Notion EN, Notion ZH), re-export, verify build.

---

## Files to Touch

| File | Fixes |
|------|-------|
| content/posts/the-companion-vision.md | 1, 3, 5, 10, 11, 13, 14 |
| content/posts/the-companion-vision-zh.md | 1, 3, 5, 10, 11, 12, 13, 14 |
| content/posts/wearables-and-companions.md | 2, 7, 13 |
| content/posts/wearables-and-companions-zh.md | 2, 7, 13 |
| content/posts/the-agent-economy.md | 4, 6, 8, 9 |
| content/posts/the-agent-economy-zh.md | 4, 6, 8, 9 |
| personal_site/blog/* | All 6 corresponding files |
| Notion pages | All 6 pages via MCP |
