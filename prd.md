# PRD.md — AI Meeting Autopsy

---

## 1. Product Overview

### 1.1 Product Name

**AI Meeting Autopsy**

### 1.2 Tagline

_Analyze. Diagnose. Improve._

### 1.3 One-Liner

An AI-powered web application that ingests meeting recordings/transcripts and produces a comprehensive "autopsy" — breaking down what went well, what was wasted, who spoke how much, what decisions were made, what action items emerged, and how to improve future meetings.

### 1.4 Core Value Proposition

Most meetings are inefficient. AI Meeting Autopsy gives teams an objective, data-driven post-mortem of every meeting, surfacing wasted time, unbalanced participation, missing action-item owners, repeated discussions, and topic drift — then provides actionable AI recommendations.

---

## 2. Target Users

| Persona                               | Description                                                                                      |
| ------------------------------------- | ------------------------------------------------------------------------------------------------ |
| **Team Leads / Engineering Managers** | Want to improve team meeting culture and ensure meetings produce decisions and clear next steps. |
| **Product Managers**                  | Need to track decisions, action items, and ensure accountability after meetings.                 |
| **Executives / Directors**            | Want a high-level meeting health score across the organization.                                  |
| **Individual Contributors**           | Want a quick summary, transcript search, and their own action items from a meeting.              |

---

## 3. Tech Stack (Recommended)

| Layer                   | Technology                                                         |
| ----------------------- | ------------------------------------------------------------------ |
| **Frontend**            | Next.js 14 (App Router), React 18, TypeScript                      |
| **Styling**             | Tailwind CSS + shadcn/ui component library                         |
| **Charts**              | Recharts (or Chart.js)                                             |
| **State Management**    | Zustand (or React Context for simpler cases)                       |
| **Backend / API**       | Next.js API Routes (or separate Express/Fastify server)            |
| **Database**            | PostgreSQL via Prisma ORM (or Supabase)                            |
| **Authentication**      | NextAuth.js (or Clerk)                                             |
| **AI / LLM**            | OpenAI GPT-4o API (for summarization, extraction, recommendations) |
| **Audio Transcription** | OpenAI Whisper API (or AssemblyAI / Deepgram)                      |
| **File Storage**        | AWS S3 / Cloudflare R2 / Supabase Storage                          |
| **Deployment**          | Vercel (frontend) + Railway/Fly.io (backend, if separate)          |
| **Background Jobs**     | Inngest / BullMQ / Trigger.dev (for async processing)              |

---

## 4. Information Architecture & Pages

### 4.1 Navigation Sidebar (persistent)

```
Logo: "AI Meeting Autopsy — Analyze. Diagnose. Improve."

├── Dashboard (home)
├── Meeting Autopsy
├── Transcript
├── Decisions (count badge)
├── Action Items (count badge)
├── Speakers
├── Topics Timeline
├── Reports
└── Settings
```

### 4.2 Top Header Bar

- **Left:** Page title + subtitle (e.g., "Dashboard — AI-powered insights from your meeting")
- **Right:**
  - `Upload New Meeting` button (primary, with ✦ icon)
  - `Export Report` button (secondary, with export icon)
  - Settings gear icon
  - User avatar with dropdown

---

## 5. Feature Specifications

---

### 5.1 Upload New Meeting (Modal / Page)

**Trigger:** "Upload New Meeting" button in header.

**Flow:**

1. User uploads an audio file (MP3, WAV, M4A, MP4, WebM) **OR** pastes a text transcript **OR** provides a meeting recording URL.
2. User fills in optional metadata:
   - Meeting title
   - Meeting type (e.g., Team Sync, Sprint Planning, 1:1, All-Hands, Custom)
   - Participants (names, optional email)
   - Date (auto-detected or manual)
3. User clicks "Analyze Meeting."
4. System shows a progress indicator with stages:
   - "Transcribing audio…" (if audio uploaded)
   - "Identifying speakers…"
   - "Extracting topics…"
   - "Detecting decisions & action items…"
   - "Calculating meeting health…"
   - "Generating AI recommendations…"
5. On completion, redirect to Dashboard for that meeting.

**Backend Processing Pipeline:**

```
Audio Upload
  → Whisper API (transcription + timestamps + speaker diarization)
    → LLM Pass 1: Topic segmentation & timeline extraction
    → LLM Pass 2: Decision extraction with owner, time, confidence
    → LLM Pass 3: Action item extraction with owner, due date, status
    → LLM Pass 4: Meeting health scoring (algorithm + LLM hybrid)
    → LLM Pass 5: AI autopsy summary & recommendations
      → Save all structured data to DB
        → Mark meeting as "ready"
```

**Accepted File Formats:** `.mp3`, `.wav`, `.m4a`, `.mp4`, `.webm`, `.ogg`, `.txt`, `.vtt`, `.srt`

**Max File Size:** 500MB (configurable)

---

### 5.2 Dashboard Page

This is the main landing page after a meeting is analyzed. It shows a comprehensive overview of the meeting analysis results.

**Layout:** CSS Grid — responsive, 2-4 columns on desktop, single column on mobile. Dark theme by default.

#### 5.2.1 Meeting Health Score Card

| Field         | Detail                                                                |
| ------------- | --------------------------------------------------------------------- |
| **Score**     | Large number `78/100`                                                 |
| **Label**     | "Good Meeting" (dynamic: Excellent ≥90, Good ≥70, Fair ≥50, Poor <50) |
| **Subtext**   | "Better than 68% of your meetings" (percentile vs. user's history)    |
| **Visual**    | Circular progress/gauge chart, color-coded (green/yellow/orange/red)  |
| **Info icon** | Tooltip explaining how score is calculated                            |

**Health Score Algorithm (weighted):**

```
Meeting Health Score = weighted average of:
  - Decision Clarity     (20%): Were clear decisions made? Did they have owners?
  - Action Item Quality  (20%): Do action items have owners and due dates?
  - Speaking Balance     (15%): How evenly did participants speak?
  - Time Efficiency     (15%): % of time spent on-topic vs wasted
  - Topic Coverage      (10%): Were agenda items covered?
  - Engagement          (10%): Did all participants contribute?
  - Meeting Duration    (10%): Was the meeting an appropriate length?
```

#### 5.2.2 Meeting Overview Card

Display the following metadata:

| Field        | Example      |
| ------------ | ------------ |
| Duration     | 1h 24m 32s   |
| Date         | May 17, 2025 |
| Participants | 6            |
| Type         | Team Sync    |

Each field has an icon to the left.

#### 5.2.3 AI Autopsy Summary Card

- **Icon:** Brain/AI icon with star
- **Title:** "AI Autopsy Summary"
- **Body:** 2-3 sentence AI-generated narrative summary of the meeting quality. Example: _"The meeting had a good focus with clear decisions. However, too much time was spent on status updates and some action items lack ownership."_
- **CTA Button:** "View Full Autopsy →"

#### 5.2.4 Top Problems Found Card

- **Icon:** Red warning/alert icon
- **Title:** "Top Problems Found"
- **List:** Bulleted list (3-5 items) with severity color dots (red/orange/yellow):
  - 🔴 Too much time on status updates (32 min)
  - 🔴 3 action items have no owner
  - 🔴 Repeated discussion on "API Design" (3 times)
- **CTA:** "View all →"

#### 5.2.5 Stats Row (4 metric cards)

| Card                  | Value   | Subtitle              | Trend                            |
| --------------------- | ------- | --------------------- | -------------------------------- |
| Decisions Made        | 5       | ↑ 20% vs last meeting | Green up arrow                   |
| Action Items          | 7       | ↑ 16% vs last meeting | Green up arrow                   |
| Avg. Speaking Balance | Fair    | Needs improvement     | Yellow indicator                 |
| Wasted Time           | 22m 47s | 26% of total meeting  | Red indicator                    |
| Topic Drift           | 18m 12s | 21% of total meeting  | Orange indicator with swirl icon |

Each card has a distinct color accent and icon.

#### 5.2.6 Speaking Balance Chart

- **Chart Type:** Donut chart (center shows top speaker %)
- **Legend/Table:** List of speakers with:
  - Color dot
  - Name (highlight current user with "(You)")
  - Speaking time (e.g., "35m 21s (42%)")
- **Footer text:** "Ideal balance: Everyone gets a chance to speak."
- **CTA:** "View Speaker Insights →"
- **Info icon:** Tooltip explaining the metric

#### 5.2.7 Topics Timeline Chart

- **Chart Type:** Donut/ring chart showing time distribution per topic
- **Legend:** List of topics with color dots, name, and time range:
  - 🔵 Introductions — 0:00 – 5:12
  - 🟢 Project Updates — 5:12 – 32:45
  - 🟡 API Design Discussion — 32:45 – 55:20
  - 🟠 Budget Discussion — 55:20 – 1:10:15
  - 🔴 Q&A — 1:10:15 – 1:24:32
- **Off-topic / Drift:** Shown in red at bottom with total time: "18m 12s (21%)"
- **Center text:** Total meeting time "1h 24m 32s"
- **CTA:** "View Full Timeline →"
- **Info icon:** Tooltip

#### 5.2.8 Meeting Waste Heatmap

- **Chart Type:** Area/line chart across meeting timeline (x-axis = time, y-axis = value level)
- **Color coding:** Red = low value, Green = high value
- **Labels on chart regions:** "Too much status update", "Repeated discussion", "Off-topic conversation"
- **X-axis:** Time stamps (0:00, 21:00, 42:00, 1:03:00, 1:24:32)
- **Footer:** "Total wasted time: 22m 47s (26%)"
- **CTA:** "View Full Timeline →"
- **Info icon:** Tooltip

#### 5.2.9 Decisions Made Table

| Column     | Description                                                              |
| ---------- | ------------------------------------------------------------------------ |
| #          | Row number                                                               |
| Decision   | Text of the decision                                                     |
| Owner      | Person responsible                                                       |
| Time       | Timestamp in meeting                                                     |
| Confidence | AI confidence score with color-coded badge (95% green, 80% yellow, etc.) |

- Show top 5 rows with "View all decisions →" link
- **Info icon** on section title

#### 5.2.10 Action Items Table

| Column   | Description                                                           |
| -------- | --------------------------------------------------------------------- |
| #        | Row number                                                            |
| Task     | Description of the action item                                        |
| Owner    | Assigned person (show "—" if none, highlight "No Owner" in red badge) |
| Due Date | Extracted or inferred due date                                        |
| Status   | Badge: "In Progress" (blue), "To Do" (gray), "No Owner" (red)         |

- Show top 5 rows with "View all action items →" link
- **Info icon** on section title

#### 5.2.11 AI Recommendations Card

- **Icon:** Sparkle/AI icon
- **Title:** "AI Recommendations"
- **List:** Checkmark items (5-7 recommendations):
  - ✅ Limit status updates to 10 minutes.
  - ✅ Ensure every action item has an owner.
  - ✅ Avoid repeating the same discussion. Make decisions and move forward.
  - ✅ End each agenda item with a clear decision.
  - ✅ Share meeting agenda in advance.
- **CTA:** "View full recommendations →"

#### 5.2.12 Promo / CTA Card (bottom-left)

- **Background:** Gradient with illustration
- **Title:** "Next Meeting"
- **Subtitle:** "Better Meetings, Better Results."
- Small illustration of people in a meeting
- Optional: link to create a new meeting template

---

### 5.3 Meeting Autopsy Page

A deep-dive page that expands on the AI Autopsy Summary.

**Sections:**

1. **Full AI Narrative Summary** — Multi-paragraph analysis of the meeting
2. **Strengths** — What went well (bulleted, green highlights)
3. **Weaknesses** — What went poorly (bulleted, red highlights)
4. **Problem Breakdown** — Each problem with:
   - Description
   - Severity (Critical / High / Medium / Low)
   - Time impact
   - Evidence (linked transcript excerpts)
   - Recommendation
5. **Meeting Comparison** — Side-by-side comparison with previous meeting of same type:
   - Health score trend
   - Improvement areas
   - Regression areas
6. **Overall Assessment** — Final AI summary paragraph

---

### 5.4 Transcript Page

**Features:**

1. **Full Transcript View** — Scrollable transcript with:
   - Speaker labels (color-coded to match speaker chart)
   - Timestamps (clickable to jump in audio player)
   - Paragraph-level segmentation
2. **Search** — Full-text search across transcript with highlighted results
3. **Highlights / Annotations:**
   - Decisions are highlighted in blue
   - Action items are highlighted in green
   - Problems/waste highlighted in red/orange
   - Users can click any highlight to see the extracted decision/action item
4. **Audio Player** (if audio was uploaded):
   - Play/pause, seek bar, speed control (0.5x–2x)
   - Synced with transcript (auto-scroll, highlight current sentence)
5. **Copy / Export** — Copy transcript to clipboard, download as .txt/.docx/.pdf
6. **Filter by Speaker** — Show only specific speaker's contributions

---

### 5.5 Decisions Page

**Full list view of all decisions extracted from the meeting.**

| Column     | Description                               |
| ---------- | ----------------------------------------- |
| #          | Index                                     |
| Decision   | Full text                                 |
| Owner      | Assigned person                           |
| Timestamp  | When in the meeting                       |
| Confidence | AI confidence (0-100%)                    |
| Context    | Expandable — shows surrounding transcript |

**Features:**

- Sort by any column
- Filter by owner, confidence level
- Edit: Users can manually correct a decision (edit text, change owner)
- Add: Users can manually add a missed decision
- Delete: Remove false positives
- Export decisions as CSV/JSON

---

### 5.6 Action Items Page

**Full list view of all action items.**

| Column   | Description                           |
| -------- | ------------------------------------- |
| #        | Index                                 |
| Task     | Description                           |
| Owner    | Assigned person (editable)            |
| Due Date | Date (editable)                       |
| Priority | High / Medium / Low (editable)        |
| Status   | To Do / In Progress / Done / No Owner |
| Source   | Linked transcript excerpt             |

**Features:**

- Sort, filter, search
- Inline editing of all fields
- Bulk assign owner
- Export as CSV / integrate with Jira/Linear/Asana (future)
- Status toggle (checkbox to mark done)

---

### 5.7 Speakers Page

**Per-speaker analytics:**

1. **Speaker Overview Cards** — For each participant:
   - Name + avatar (or initials)
   - Total speaking time + percentage
   - Number of decisions they own
   - Number of action items assigned
   - "Interruption score" (future)
   - Sentiment indicator (positive/neutral/negative)

2. **Speaking Balance Comparison Chart** — Ideal vs actual (bar chart)

3. **Speaker Timeline** — Horizontal bar showing when each speaker talked over the meeting timeline

4. **Individual Speaker Drilldown** (click a speaker):
   - All their statements
   - Their decisions
   - Their action items
   - Talk-time trend across meetings (if historical data exists)

---

### 5.8 Topics Timeline Page

**Detailed topic analysis:**

1. **Full Timeline Visualization** — Horizontal swimlane chart showing:
   - Each topic as a colored bar
   - Duration of each topic
   - Overlaps (topic drift regions shown in red stripes)
   - Breaks/silence gaps

2. **Topic Cards** — For each topic:
   - Topic name (AI-generated)
   - Time range
   - Duration
   - Key points discussed (bulleted)
   - Decisions made during this topic
   - Action items from this topic
   - Value rating (High/Medium/Low value time)

3. **Drift / Off-Topic Segments** — Highlighted with:
   - What was discussed
   - How long it lasted
   - Which speakers drifted

4. **Agenda Compliance** (if agenda was provided):
   - Which agenda items were covered
   - Which were skipped
   - Time spent vs allocated per item

---

### 5.9 Reports Page

**Meeting analytics and historical trends:**

1. **Meeting Health Trend** — Line chart of health scores over time
2. **Meeting Frequency** — Calendar heatmap or bar chart
3. **Average Meeting Duration Trend** — Line chart
4. **Speaking Balance Trend** — Per-meeting fairness index
5. **Common Problems** — Bar chart of most frequent issues across meetings
6. **Decision & Action Item Tracking:**
   - Total decisions per meeting trend
   - Action item completion rate
   - Overdue action items
7. **Time Waste Trend** — Percentage of wasted time per meeting
8. **Report Filters:**
   - Date range
   - Meeting type
   - Participants
9. **Export:** Download PDF report, share via link

---

### 5.10 Settings Page

**Sections:**

1. **Profile** — Name, email, avatar, password
2. **Organization** — Org name, members, roles
3. **Meeting Defaults:**
   - Default meeting type
   - Default participants
   - Scoring weights customization
4. **AI Settings:**
   - LLM model selection (GPT-4o, GPT-4o-mini, etc.)
   - Transcription language preference
   - Custom prompts / analysis focus areas
5. **Integrations** (future):
   - Calendar sync (Google Calendar, Outlook)
   - Task management (Jira, Linear, Asana)
   - Communication (Slack, Teams)
   - Meeting platforms (Zoom, Google Meet, Teams)
6. **Appearance:**
   - Dark mode / Light mode toggle
   - Accent color
7. **Billing** (if SaaS):
   - Current plan
   - Usage stats (meetings analyzed, minutes transcribed)
   - Upgrade

---

## 6. Data Models

### 6.1 User

```prisma
model User {
  id          String    @id @default(cuid())
  name        String
  email       String    @unique
  password    String    // hashed
  avatar      String?
  orgId       String?
  org         Org?      @relation(fields: [orgId], references: [id])
  meetings    Meeting[] @relation("UploadedBy")
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
}
```

### 6.2 Organization

```prisma
model Org {
  id        String    @id @default(cuid())
  name      String
  members   User[]
  meetings  Meeting[]
  createdAt DateTime  @default(now())
}
```

### 6.3 Meeting

```prisma
model Meeting {
  id              String    @id @default(cuid())
  title           String
  date            DateTime
  duration        Int       // seconds
  type            String    // "Team Sync", "Sprint Planning", etc.
  audioUrl        String?
  transcriptRaw   String?   @db.Text
  status          String    // "processing", "ready", "failed"
  healthScore     Int?      // 0-100
  healthPercentile Float?   // vs user's history

  uploadedById    String
  uploadedBy      User      @relation("UploadedBy", fields: [uploadedById], references: [id])
  orgId           String?
  org             Org?      @relation(fields: [orgId], references: [id])

  participants    Participant[]
  topics          Topic[]
  decisions       Decision[]
  actionItems     ActionItem[]
  problems        Problem[]
  recommendations Recommendation[]
  transcript      TranscriptSegment[]
  wasteSegments   WasteSegment[]

  aiSummary       String?   @db.Text

  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
}
```

### 6.4 Participant

```prisma
model Participant {
  id            String    @id @default(cuid())
  name          String
  email         String?
  speakingTime  Int?      // seconds
  speakingPct   Float?    // percentage
  meetingId     String
  meeting       Meeting   @relation(fields: [meetingId], references: [id], onDelete: Cascade)
}
```

### 6.5 Topic

```prisma
model Topic {
  id          String    @id @default(cuid())
  name        String
  startTime   Int       // seconds from start
  endTime     Int
  duration    Int       // seconds
  valueRating String?   // "high", "medium", "low"
  keyPoints   String?   @db.Text  // JSON array
  isDrift     Boolean   @default(false)
  meetingId   String
  meeting     Meeting   @relation(fields: [meetingId], references: [id], onDelete: Cascade)
}
```

### 6.6 Decision

```prisma
model Decision {
  id          String    @id @default(cuid())
  text        String    @db.Text
  owner       String?
  timestamp   Int       // seconds from start
  confidence  Float     // 0-1
  context     String?   @db.Text
  meetingId   String
  meeting     Meeting   @relation(fields: [meetingId], references: [id], onDelete: Cascade)
}
```

### 6.7 ActionItem

```prisma
model ActionItem {
  id          String    @id @default(cuid())
  task        String    @db.Text
  owner       String?
  dueDate     DateTime?
  priority    String?   // "high", "medium", "low"
  status      String    @default("todo") // "todo", "in_progress", "done", "no_owner"
  source      String?   @db.Text  // transcript excerpt
  meetingId   String
  meeting     Meeting   @relation(fields: [meetingId], references: [id], onDelete: Cascade)
}
```

### 6.8 Problem

```prisma
model Problem {
  id            String    @id @default(cuid())
  description   String    @db.Text
  severity      String    // "critical", "high", "medium", "low"
  timeImpact    Int?      // seconds
  evidence      String?   @db.Text
  recommendation String?  @db.Text
  meetingId     String
  meeting       Meeting   @relation(fields: [meetingId], references: [id], onDelete: Cascade)
}
```

### 6.9 Recommendation

```prisma
model Recommendation {
  id          String    @id @default(cuid())
  text        String    @db.Text
  category    String?   // "time", "participation", "decisions", "action_items"
  meetingId   String
  meeting     Meeting   @relation(fields: [meetingId], references: [id], onDelete: Cascade)
}
```

### 6.10 TranscriptSegment

```prisma
model TranscriptSegment {
  id          String    @id @default(cuid())
  speaker     String
  text        String    @db.Text
  startTime   Int       // seconds
  endTime     Int       // seconds
  meetingId   String
  meeting     Meeting   @relation(fields: [meetingId], references: [id], onDelete: Cascade)
}
```

### 6.11 WasteSegment

```prisma
model WasteSegment {
  id          String    @id @default(cuid())
  startTime   Int
  endTime     Int
  type        String    // "status_update", "repeated_discussion", "off_topic"
  description String?
  valueLevel  Float     // 0 (no value) to 1 (high value)
  meetingId   String
  meeting     Meeting   @relation(fields: [meetingId], references: [id], onDelete: Cascade)
}
```

---

## 7. API Endpoints

### 7.1 Authentication

```
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/logout
GET    /api/auth/me
```

### 7.2 Meetings

```
POST   /api/meetings                    — Upload & create new meeting
GET    /api/meetings                    — List all meetings (paginated, filterable)
GET    /api/meetings/:id                — Get full meeting data
DELETE /api/meetings/:id                — Delete a meeting
GET    /api/meetings/:id/status         — Check processing status
```

### 7.3 Meeting Sub-Resources

```
GET    /api/meetings/:id/transcript     — Get full transcript
GET    /api/meetings/:id/decisions      — Get all decisions
PUT    /api/meetings/:id/decisions/:did — Edit a decision
POST   /api/meetings/:id/decisions      — Add manual decision
DELETE /api/meetings/:id/decisions/:did — Delete a decision

GET    /api/meetings/:id/action-items   — Get all action items
PUT    /api/meetings/:id/action-items/:aid — Edit action item
POST   /api/meetings/:id/action-items   — Add manual action item
DELETE /api/meetings/:id/action-items/:aid — Delete action item

GET    /api/meetings/:id/speakers       — Get speaker analytics
GET    /api/meetings/:id/topics         — Get topics timeline
GET    /api/meetings/:id/problems       — Get problems list
GET    /api/meetings/:id/recommendations — Get AI recommendations
GET    /api/meetings/:id/waste          — Get waste heatmap data
GET    /api/meetings/:id/summary        — Get AI autopsy summary
```

### 7.4 Reports

```
GET    /api/reports/health-trend        — Health score over time
GET    /api/reports/meeting-stats       — Aggregate statistics
GET    /api/reports/common-problems     — Most frequent problems
GET    /api/reports/action-item-tracking — Completion rates
```

### 7.5 Export

```
GET    /api/meetings/:id/export?format=pdf
GET    /api/meetings/:id/export?format=csv
GET    /api/meetings/:id/export?format=json
```

### 7.6 Settings

```
GET    /api/settings                    — Get user/org settings
PUT    /api/settings                    — Update settings
```

---

## 8. AI Processing Pipeline (Detailed)

### 8.1 Step 1: Transcription

**Input:** Audio file  
**Output:** Timestamped, speaker-diarized transcript

```json
[
  {
    "speaker": "John",
    "text": "Let's start with project updates.",
    "start": 0.0,
    "end": 3.2
  },
  {
    "speaker": "Sarah",
    "text": "Sure, the API is almost done.",
    "start": 3.5,
    "end": 7.1
  }
]
```

**Service:** OpenAI Whisper API with `--word_timestamps` + speaker diarization (or pyannote.audio / AssemblyAI)

### 8.2 Step 2: Topic Segmentation

**Prompt Strategy:** Send transcript in chunks to LLM with instructions to identify topic boundaries.

**Expected Output:**

```json
[
  {
    "name": "Introductions",
    "startTime": 0,
    "endTime": 312,
    "valueRating": "medium"
  },
  {
    "name": "Project Updates",
    "startTime": 312,
    "endTime": 1965,
    "valueRating": "medium"
  },
  {
    "name": "API Design Discussion",
    "startTime": 1965,
    "endTime": 3320,
    "valueRating": "high"
  }
]
```

### 8.3 Step 3: Decision Extraction

**Prompt:** Identify all decisions made during the meeting. For each decision, extract the exact text, who made/owns it, timestamp, and your confidence level.

**Expected Output:**

```json
[
  {
    "text": "We will release the new version on May 30.",
    "owner": "Sarah",
    "timestamp": 735,
    "confidence": 0.95,
    "context": "Sarah proposed May 30 and everyone agreed."
  }
]
```

### 8.4 Step 4: Action Item Extraction

**Prompt:** Identify all action items, tasks, and follow-ups discussed. Extract task description, owner, due date, and current status.

### 8.5 Step 5: Problem Detection

**Prompt:** Identify meeting quality problems:

- Time waste (status updates that went too long, off-topic conversations)
- Repeated discussions (same topic discussed multiple times)
- Missing ownership (decisions or action items without clear owners)
- Speaking imbalance
- Topic drift
- Unresolved items

### 8.6 Step 6: Meeting Health Scoring

**Hybrid approach:**

- Algorithmic scoring for quantitative metrics (speaking balance Gini coefficient, % wasted time, % action items with owners)
- LLM scoring for qualitative metrics (decision clarity, engagement quality)
- Combine into weighted final score

### 8.7 Step 7: AI Summary & Recommendations

**Prompt:** Based on all extracted data, write a concise 2-3 sentence autopsy summary and generate 5-7 specific, actionable recommendations for improving future meetings.

---

## 9. UI/UX Design Specifications

### 9.1 Theme

- **Default:** Dark theme (as shown in dashboard screenshot)
- **Background:** `#0f1117` (near-black) or `#1a1b2e`
- **Card backgrounds:** `#1e1f2e` or `#252636` with subtle border `#2a2b3d`
- **Text primary:** `#ffffff`
- **Text secondary:** `#8b8d9e`
- **Accent colors:**
  - Blue: `#4f7cff` (primary actions)
  - Green: `#34d399` (positive metrics, success)
  - Yellow/Amber: `#fbbf24` (warnings, medium)
  - Red: `#ef4444` (problems, critical)
  - Purple: `#a78bfa` (AI features)
  - Orange: `#fb923c` (medium severity)

### 9.2 Typography

- **Font:** Inter (or system font stack)
- **Headings:** Semibold/Bold
- **Body:** Regular 14px
- **Small/labels:** 12px

### 9.3 Card Design

- Rounded corners (`border-radius: 12px`)
- Subtle border or shadow
- Consistent padding (20-24px)
- Info icon (ℹ️) on section headers with tooltip
- Hover states with slight brightness change

### 9.4 Charts

- Donut charts for speaking balance and topics
- Area/line charts for waste heatmap and trends
- Color-coded consistently with speaker/topic colors
- Tooltips on hover
- Responsive sizing

### 9.5 Responsive Design

- **Desktop (≥1280px):** 4-column grid layout as shown
- **Tablet (768-1279px):** 2-column grid, collapsible sidebar
- **Mobile (<768px):** Single column, bottom navigation

---

## 10. Project File Structure

```
ai-meeting-autopsy/
├── prisma/
│   └── schema.prisma
├── public/
│   ├── images/
│   └── icons/
├── src/
│   ├── app/
│   │   ├── layout.tsx                  (root layout with sidebar)
│   │   ├── page.tsx                    (redirect to dashboard or landing)
│   │   ├── (auth)/
│   │   │   ├── login/page.tsx
│   │   │   └── register/page.tsx
│   │   ├── (dashboard)/
│   │   │   ├── layout.tsx              (sidebar + header layout)
│   │   │   ├── dashboard/page.tsx
│   │   │   ├── meeting-autopsy/page.tsx
│   │   │   ├── transcript/page.tsx
│   │   │   ├── decisions/page.tsx
│   │   │   ├── action-items/page.tsx
│   │   │   ├── speakers/page.tsx
│   │   │   ├── topics-timeline/page.tsx
│   │   │   ├── reports/page.tsx
│   │   │   └── settings/page.tsx
│   │   └── api/
│   │       ├── auth/[...nextauth]/route.ts
│   │       ├── meetings/
│   │       │   ├── route.ts            (GET list, POST create)
│   │       │   └── [id]/
│   │       │       ├── route.ts        (GET, DELETE)
│   │       │       ├── status/route.ts
│   │       │       ├── transcript/route.ts
│   │       │       ├── decisions/route.ts
│   │       │       ├── action-items/route.ts
│   │       │       ├── speakers/route.ts
│   │       │       ├── topics/route.ts
│   │       │       ├── problems/route.ts
│   │       │       ├── recommendations/route.ts
│   │       │       ├── waste/route.ts
│   │       │       ├── summary/route.ts
│   │       │       └── export/route.ts
│   │       ├── reports/
│   │       │   ├── health-trend/route.ts
│   │       │   ├── meeting-stats/route.ts
│   │       │   └── common-problems/route.ts
│   │       └── settings/route.ts
│   ├── components/
│   │   ├── ui/                         (shadcn/ui components)
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── badge.tsx
│   │   │   ├── table.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── tooltip.tsx
│   │   │   ├── progress.tsx
│   │   │   ├── dropdown-menu.tsx
│   │   │   └── ...
│   │   ├── layout/
│   │   │   ├── sidebar.tsx
│   │   │   ├── header.tsx
│   │   │   └── mobile-nav.tsx
│   │   ├── dashboard/
│   │   │   ├── health-score-card.tsx
│   │   │   ├── meeting-overview-card.tsx
│   │   │   ├── ai-summary-card.tsx
│   │   │   ├── top-problems-card.tsx
│   │   │   ├── stats-row.tsx
│   │   │   ├── speaking-balance-chart.tsx
│   │   │   ├── topics-timeline-chart.tsx
│   │   │   ├── waste-heatmap-chart.tsx
│   │   │   ├── decisions-table.tsx
│   │   │   ├── action-items-table.tsx
│   │   │   ├── ai-recommendations-card.tsx
│   │   │   └── promo-card.tsx
│   │   ├── meeting/
│   │   │   ├── upload-dialog.tsx
│   │   │   ├── processing-status.tsx
│   │   │   └── meeting-selector.tsx
│   │   ├── transcript/
│   │   │   ├── transcript-viewer.tsx
│   │   │   ├── transcript-search.tsx
│   │   │   └── audio-player.tsx
│   │   ├── charts/
│   │   │   ├── donut-chart.tsx
│   │   │   ├── area-chart.tsx
│   │   │   ├── bar-chart.tsx
│   │   │   ├── line-chart.tsx
│   │   │   └── gauge-chart.tsx
│   │   └── common/
│   │       ├── loading-spinner.tsx
│   │       ├── empty-state.tsx
│   │       └── error-boundary.tsx
│   ├── lib/
│   │   ├── db.ts                       (Prisma client singleton)
│   │   ├── auth.ts                     (NextAuth config)
│   │   ├── openai.ts                   (OpenAI client)
│   │   ├── utils.ts                    (utility functions)
│   │   ├── constants.ts
│   │   └── validations.ts             (Zod schemas)
│   ├── services/
│   │   ├── transcription.service.ts
│   │   ├── analysis.service.ts         (orchestrates AI pipeline)
│   │   ├── topic-extraction.service.ts
│   │   ├── decision-extraction.service.ts
│   │   ├── action-item-extraction.service.ts
│   │   ├── problem-detection.service.ts
│   │   ├── health-scoring.service.ts
│   │   ├── summary.service.ts
│   │   └── export.service.ts
│   ├── hooks/
│   │   ├── use-meeting.ts
│   │   ├── use-meetings-list.ts
│   │   ├── use-upload.ts
│   │   └── use-reports.ts
│   ├── store/
│   │   └── meeting-store.ts            (Zustand store)
│   └── types/
│       ├── meeting.ts
│       ├── transcript.ts
│       ├── analysis.ts
│       └── api.ts
├── .env.example
├── .env.local
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
├── package.json
└── README.md
```

---

## 11. Environment Variables

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/meeting_autopsy"

# Authentication
NEXTAUTH_SECRET="your-secret-here"
NEXTAUTH_URL="http://localhost:3000"

# OpenAI
OPENAI_API_KEY="sk-..."
OPENAI_MODEL="gpt-4o"
OPENAI_WHISPER_MODEL="whisper-1"

# File Storage (S3-compatible)
S3_BUCKET="meeting-audio"
S3_REGION="us-east-1"
S3_ACCESS_KEY="..."
S3_SECRET_KEY="..."
S3_ENDPOINT="..." # Optional for R2/MinIO

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"
MAX_FILE_SIZE_MB=500
```

---

## 12. Implementation Phases

### Phase 1: Foundation (Week 1-2)

- [ ] Project setup (Next.js, Tailwind, shadcn/ui, Prisma)
- [ ] Database schema & migrations
- [ ] Authentication (register, login, session)
- [ ] File upload infrastructure (S3 + API route)
- [ ] Basic layout: sidebar, header, page routing
- [ ] Dark theme setup

### Phase 2: Core Dashboard UI (Week 3-4)

- [ ] Dashboard page with all cards (use mock/seed data)
- [ ] Health Score gauge chart
- [ ] Meeting Overview card
- [ ] Stats row (4 metric cards)
- [ ] Speaking Balance donut chart
- [ ] Topics Timeline donut chart
- [ ] Waste Heatmap area chart
- [ ] Decisions table
- [ ] Action Items table
- [ ] AI Summary card
- [ ] Top Problems card
- [ ] AI Recommendations card
- [ ] Responsive layout

### Phase 3: AI Pipeline (Week 5-7)

- [ ] Audio transcription via Whisper API
- [ ] Speaker diarization
- [ ] Topic segmentation (LLM)
- [ ] Decision extraction (LLM)
- [ ] Action item extraction (LLM)
- [ ] Problem detection (LLM)
- [ ] Waste analysis (LLM)
- [ ] Health score calculation (algorithm + LLM hybrid)
- [ ] AI summary generation
- [ ] AI recommendations generation
- [ ] Processing status & progress tracking
- [ ] Background job processing (queue)

### Phase 4: Sub-Pages (Week 8-9)

- [ ] Transcript page with search, highlights, speaker filter
- [ ] Audio player with transcript sync
- [ ] Decisions page (full CRUD)
- [ ] Action Items page (full CRUD)
- [ ] Speakers page with analytics
- [ ] Topics Timeline page (detailed)
- [ ] Meeting Autopsy deep-dive page

### Phase 5: Reports & Polish (Week 10-11)

- [ ] Reports page with historical charts
- [ ] Meeting comparison
- [ ] Export functionality (PDF, CSV, JSON)
- [ ] Settings page
- [ ] Meeting list/history page
- [ ] Empty states
- [ ] Error handling
- [ ] Loading skeletons
- [ ] Tooltips & onboarding

### Phase 6: Production Readiness (Week 12)

- [ ] Performance optimization
- [ ] Rate limiting
- [ ] Input validation & sanitization
- [ ] Security audit
- [ ] Testing (unit + integration)
- [ ] Documentation
- [ ] Deployment

---

## 13. Seed Data for Development

Provide a comprehensive seed script that creates:

1. **1 demo user** — `john@example.com`
2. **1 demo meeting** — "Weekly Team Sync, May 17, 2025"
3. **6 participants** — John (You), Sarah, Mike, Emily, David, Lisa with speaking times matching the dashboard screenshot
4. **5 topics** — Introductions, Project Updates, API Design Discussion, Budget Discussion, Q&A with timestamps matching screenshot
5. **5 decisions** — Matching the decisions table in screenshot
6. **7 action items** — Matching the action items table (some with "No Owner")
7. **5 problems** — Including the "Top Problems Found" items
8. **6 recommendations** — Matching the AI Recommendations card
9. **Waste segments** — For the heatmap chart
10. **Transcript segments** — At least 50 segments covering the full meeting
11. **Meeting health score: 78**, percentile: 68%

This seed data should make the dashboard render exactly as shown in the screenshot without requiring actual AI processing.

---

## 14. Key Business Rules

1. **Health Score Range:** 0-100. Labels: Excellent (90-100), Good (70-89), Fair (50-69), Poor (0-49).
2. **Confidence Score:** AI confidence on decisions is 0-100%. Display as colored badge: ≥90% green, ≥70% yellow, <70% red.
3. **Action Item Status Flow:** `no_owner` → `todo` → `in_progress` → `done`. Items without owners auto-get `no_owner` status.
4. **Speaking Balance Rating:** Calculate Gini coefficient. "Excellent" if Gini < 0.15, "Good" < 0.25, "Fair" < 0.40, "Poor" ≥ 0.40.
5. **Wasted Time:** Sum of all waste segments. Display as both absolute time and percentage of total meeting.
6. **Topic Drift:** Time spent on segments classified as off-topic or not matching any agenda item.
7. **Trend Comparisons:** "↑ 20% vs last meeting" — compare current meeting's metric to the most recent previous meeting of the same type.
8. **Processing Timeout:** If AI processing takes >10 minutes, mark as failed and allow retry.

---

## 15. Non-Functional Requirements

| Requirement                | Target                                            |
| -------------------------- | ------------------------------------------------- |
| **Page Load Time**         | < 2s for dashboard                                |
| **AI Processing Time**     | < 5 min for 1hr meeting                           |
| **Max Concurrent Uploads** | 5 per user                                        |
| **Max Audio Duration**     | 4 hours                                           |
| **Data Retention**         | Indefinite (user can delete)                      |
| **Browser Support**        | Chrome, Firefox, Safari, Edge (latest 2 versions) |
| **Accessibility**          | WCAG 2.1 AA                                       |
| **Mobile Responsive**      | Yes, all pages                                    |

---

## 16. Future Enhancements (Out of Scope for V1)

- Real-time meeting analysis (live transcription)
- Calendar integrations (auto-import from Google Meet/Zoom)
- Slack/Teams notifications for action items
- Jira/Linear/Asana integration for action item sync
- Multi-language support for transcription
- Team/org-level analytics dashboard
- Meeting templates & agenda builder
- Sentiment analysis per speaker
- Interruption detection
- Engagement scoring (questions asked, ideas contributed)
- Automated meeting scheduling recommendations
- Compare meetings across teams
- White-label / embeddable widgets

---

_End of PRD_
