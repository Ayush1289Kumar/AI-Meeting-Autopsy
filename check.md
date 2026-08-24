# Task: Fix Timestamp Parsing, Decision/Action Item Disambiguation, and Score Consistency

Please review and fix the following issues in the **AI Meeting Autopsy** codebase across transcription, extraction, utility, and analysis services.

---

### Issue 1: Fix Timestamp Clock Parsing & Rendering
**Files to inspect/modify:**
- `src/services/transcription.service.ts` (`parseClock()`, `parseTranscriptText()`)
- `src/lib/date-utils.ts` (`formatTimestamp()`, `formatDuration()`)

**Problems:**
- Decision timestamps in the generated report output inflated values (e.g., `[26:55]`, `[52:12]`, `[1:05:10]`) on an 11-minute meeting transcript.
- `[00:01:45]` was parsed/formatted as `[26:55]`, and `[00:03:22]` was parsed/formatted as `[52:12]`.

**Requirements:**
1. Check `parseClock()` in `src/services/transcription.service.ts`. Ensure regex handles both `[HH:MM:SS]` and `[MM:SS]` formats without accidental minute/second offset transposition or duplicate multiplications.
2. In `src/lib/date-utils.ts`, verify that `formatTimestamp(seconds)` takes raw seconds correctly and computes:
   - `hours = Math.floor(totalSeconds / 3600)`
   - `minutes = Math.floor((totalSeconds % 3600) / 60)`
   - `secs = Math.floor(totalSeconds % 60)`
3. Ensure no millisecond-to-second unit mismatch occurs across the pipeline.

---

### Issue 2: Refine Decision vs Proposal vs Action Item Disambiguation
**Files to inspect/modify:**
- `src/services/decision-extraction.service.ts` (`extractDecisions()`, `heuristicDecisions()`)
- `src/services/action-item-extraction.service.ts` (`extractActionItems()`, `heuristicActionItems()`)
- `src/services/analysis.service.ts` (`analyzeTranscript()`)

**Problems:**
- **Proposals Marked as Decisions:** Monologue brainstorming lines like *"I think we need to apply a log-smoothing function..."* and *"If we adjust the balance rating weight..."* were extracted as official decisions.
- **Cross-Category Duplicate:** *"Update securityHeaders and fix rateLimitMap memory leak logic..."* was extracted as both a Decision and an Action Item with different owners.

**Requirements:**
1. In `src/services/decision-extraction.service.ts`:
   - Update prompt / heuristics to only extract finalized group agreements (e.g., lines containing *"Decision X:"*, *"Agreed"*, *"Let's make an official decision"*, *"We agreed to"*).
   - Ignore speculative proposals (*"I think we need to"*, *"If we adjust"*, *"What if"*).
2. In `src/services/analysis.service.ts`:
   - Add cross-deduplication between `decisions` and `actionItems`. If an extracted decision sentence strongly overlaps with an action item or is clearly an assigned task with an owner/deadline, keep it under `actionItems` only.

---

### Issue 3: Ensure Strict Speaker Attribution for Action Items
**Files to inspect/modify:**
- `src/services/action-item-extraction.service.ts` (`extractActionItems()`, `OWNERLESS_HINTS`)

**Problems:**
- When Speaker A says *"Action Item: Nina will update X by Wednesday"*, the extractor previously assigned the owner to Speaker A instead of Nina.

**Requirements:**
1. Ensure entity extraction / regex logic prioritizes the explicit assignee named inside the task statement (e.g., `[Name] will [task]`) over the speaker speaking the line.
2. If no inner name is found, only then fall back to the speaking turn participant.

---

### Issue 4: Deterministic LLM Sampling & Waste Detection Variance
**Files to inspect/modify:**
- `src/lib/openai.ts` (`chatModel()`, `jsonCompletion()`)
- `src/services/problem-detection.service.ts` (`detectWasteSegments()`, `detectProblems()`)

**Problems:**
- Same transcript produced fluctuating health scores (73/100 vs 89/100) and topic drift times (5m 07s vs 2m 27s) across multiple runs.

**Requirements:**
1. In `src/lib/openai.ts` or `src/services/analysis.service.ts`, set `temperature: 0.0` or `0.1` and ensure a fixed seed for structured JSON extraction completions.
2. In `src/services/problem-detection.service.ts`, tighten the boundaries for `detectWasteSegments()` so deterministic segment ranges are detected for known drift keywords and conversational tangents.

---

### Verification
Run `npm run typecheck`, execute tests (or seed verification via `prisma/seed.ts`), and verify the parsing on the sample transcript to confirm:
- [x] Timestamps align strictly with the transcript (under 11m 19s).
- [x] Decisions contain only confirmed agreements.
- [x] Action items contain accurate assignees without overlap in Decisions.