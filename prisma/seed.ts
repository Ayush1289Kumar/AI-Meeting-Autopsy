import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const SPEAKER_COLORS = ["#4f7cff", "#34d399", "#fbbf24", "#a78bfa", "#fb923c", "#f472b6"];

const PARTICIPANTS = [
  { name: "John", speakingTime: 2121, speakingPct: 41.8 },
  { name: "Sarah", speakingTime: 1140, speakingPct: 22.5 },
  { name: "Mike", speakingTime: 780, speakingPct: 15.4 },
  { name: "Emily", speakingTime: 545, speakingPct: 10.7 },
  { name: "David", speakingTime: 336, speakingPct: 6.6 },
  { name: "Lisa", speakingTime: 150, speakingPct: 3.0 },
];

const TOPICS = [
  {
    name: "Introductions",
    startTime: 0,
    endTime: 312,
    valueRating: "medium",
    isDrift: false,
    keyPoints: ["Attendance and agenda check", "Recap of last week's outcomes"],
  },
  {
    name: "Project Updates",
    startTime: 312,
    endTime: 1965,
    valueRating: "medium",
    isDrift: false,
    keyPoints: ["Per-person status updates", "Mobile release blocked on QA", "Analytics migration finished"],
  },
  {
    name: "API Design Discussion",
    startTime: 1965,
    endTime: 3320,
    valueRating: "high",
    isDrift: false,
    keyPoints: ["Versioning strategy", "Pagination defaults", "Auth token lifetime"],
  },
  {
    name: "Budget Discussion",
    startTime: 3320,
    endTime: 4215,
    valueRating: "high",
    isDrift: false,
    keyPoints: ["Q3 infrastructure spend", "Contractor extension"],
  },
  {
    name: "Q&A",
    startTime: 4215,
    endTime: 5072,
    valueRating: "low",
    isDrift: true,
    keyPoints: ["Open questions", "Weekend plans tangent"],
  },
];

const DECISIONS = [
  {
    text: "We will release the new version on May 30.",
    owner: "Sarah",
    timestamp: 735,
    confidence: 0.95,
    context: "Sarah proposed May 30 and everyone agreed.",
  },
  {
    text: "API v2 will use cursor-based pagination.",
    owner: "Mike",
    timestamp: 2140,
    confidence: 0.92,
    context: "Mike walked through offset pagination issues at scale.",
  },
  {
    text: "Auth tokens will expire after 24 hours instead of 7 days.",
    owner: "Emily",
    timestamp: 2680,
    confidence: 0.81,
    context: "Security review flagged the long-lived tokens.",
  },
  {
    text: "Infrastructure budget increases by 12% for Q3.",
    owner: "John",
    timestamp: 3540,
    confidence: 0.88,
    context: "John confirmed the finance approval is already in place.",
  },
  {
    text: "The contractor engagement will not be extended past June.",
    owner: "John",
    timestamp: 4010,
    confidence: 0.68,
    context: "Discussed briefly, no formal sign-off recorded.",
  },
];

const ACTION_ITEMS = [
  {
    task: "Freeze the release branch and run the full regression suite.",
    owner: "Sarah",
    dueDate: "2025-05-23",
    priority: "high",
    status: "in_progress",
    source: "Sarah: I'll freeze the branch on Friday and kick off regression.",
  },
  {
    task: "Draft the API v2 migration guide for external partners.",
    owner: "Mike",
    dueDate: "2025-05-28",
    priority: "high",
    status: "todo",
    source: "Mike: I can write the migration guide once we lock pagination.",
  },
  {
    task: "Reduce auth token lifetime in staging and monitor for breakage.",
    owner: "Emily",
    dueDate: "2025-05-21",
    priority: "medium",
    status: "in_progress",
    source: "Emily: I'll ship it to staging first.",
  },
  {
    task: "Share the Q3 infrastructure budget breakdown with the team.",
    owner: "John",
    dueDate: "2025-05-20",
    priority: "medium",
    status: "todo",
    source: "John: I'll send the breakdown after this call.",
  },
  {
    task: "Someone needs to update the on-call rotation documentation.",
    owner: null,
    dueDate: null,
    priority: "low",
    status: "no_owner",
    source: "David: Someone should really update the on-call docs.",
  },
  {
    task: "Follow up with the vendor about the delayed invoice.",
    owner: null,
    dueDate: null,
    priority: "medium",
    status: "no_owner",
    source: "Lisa: We still need to follow up with the vendor.",
  },
  {
    task: "Book a dedicated session on the analytics data model.",
    owner: null,
    dueDate: null,
    priority: "low",
    status: "no_owner",
    source: "Mike: We should book a separate session for the data model.",
  },
];

const PROBLEMS = [
  {
    description: "Too much time on status updates (32 min)",
    severity: "critical",
    timeImpact: 1920,
    evidence: "Six consecutive per-person updates between 5:12 and 32:45 produced no decisions.",
    recommendation: "Timebox status updates to 10 minutes or collect them async before the call.",
  },
  {
    description: "3 action items have no owner",
    severity: "high",
    timeImpact: null,
    evidence: "On-call docs, vendor follow-up and analytics session were all left unassigned.",
    recommendation: "Assign a named owner before closing each agenda item.",
  },
  {
    description: 'Repeated discussion on "API Design" (3 times)',
    severity: "high",
    timeImpact: 840,
    evidence: "Pagination was reopened at 21:40, 38:10 and 44:05.",
    recommendation: "Close the topic with an explicit decision the first time.",
  },
  {
    description: "Speaking time is unbalanced — John spoke 42% of the time",
    severity: "medium",
    timeImpact: null,
    evidence: "John: 35m 21s of 1h 24m 32s total speaking time.",
    recommendation: "Round-robin key questions and invite quieter participants directly.",
  },
  {
    description: "Off-topic conversation during Q&A (18 min)",
    severity: "medium",
    timeImpact: 1092,
    evidence: "Weekend plans and an unrelated hiring thread dominated the final segment.",
    recommendation: "Use a parking lot and end the meeting once the agenda is done.",
  },
];

const RECOMMENDATIONS = [
  { text: "Limit status updates to 10 minutes.", category: "time" },
  { text: "Ensure every action item has an owner.", category: "action_items" },
  { text: "Avoid repeating the same discussion. Make decisions and move forward.", category: "decisions" },
  { text: "End each agenda item with a clear decision.", category: "decisions" },
  { text: "Share meeting agenda in advance.", category: "time" },
  { text: "Invite quieter participants such as Lisa and David to contribute directly.", category: "participation" },
];

const WASTE_SEGMENTS = [
  { startTime: 312, endTime: 1965, type: "status_update", description: "Extended status updates", valueLevel: 0.35 },
  { startTime: 2280, endTime: 2560, type: "repeated_discussion", description: 'Repeated discussion on "API Design"', valueLevel: 0.25 },
  { startTime: 2645, endTime: 2920, type: "repeated_discussion", description: 'Repeated discussion on "API Design"', valueLevel: 0.25 },
  { startTime: 4215, endTime: 5072, type: "off_topic", description: "Off-topic conversation", valueLevel: 0.1 },
];

const SCRIPT: [string, string][] = [
  ["John", "Morning everyone, let's get started with the weekly team sync."],
  ["John", "Quick agenda check: project updates, API design, budget, then Q&A."],
  ["Sarah", "Sounds good. I have a hard stop at the top of the hour."],
  ["Mike", "Same here, I'll keep my update short."],
  ["Emily", "I joined a couple of minutes late, can someone recap last week?"],
  ["John", "Last week we agreed to push the mobile release and unblock QA."],
  ["Lisa", "Thanks, that helps."],
  ["John", "Let's start with project updates. Sarah, go ahead."],
  ["Sarah", "My update: the API is almost done, we're finishing the last endpoints."],
  ["Sarah", "Last week I worked on the payments integration and it's now in review."],
  ["Sarah", "We will release the new version on May 30."],
  ["John", "May 30 works for me. Everyone agreed?"],
  ["Mike", "Agreed."],
  ["Emily", "Agreed."],
  ["Sarah", "I'll freeze the branch on Friday and kick off regression."],
  ["Mike", "My update: analytics migration is finished and deployed."],
  ["Mike", "Last week I worked on cleaning up the legacy event pipeline."],
  ["Emily", "Quick update from me: security review is done, one finding on tokens."],
  ["David", "My update is short, mostly bug fixes and support rotations."],
  ["David", "Last week I worked on the flaky integration tests."],
  ["Lisa", "My update: design handoff for the settings screens is complete."],
  ["John", "Great. Any blockers on the mobile release?"],
  ["Sarah", "QA is the only blocker and they're catching up."],
  ["Mike", "One more status update: the data warehouse costs went up again."],
  ["John", "We'll come back to costs in the budget section."],
  ["Emily", "Can we talk about the API design now? We keep pushing it."],
  ["John", "Yes, moving on to API design."],
  ["Mike", "The main question is versioning and pagination for v2."],
  ["Mike", "Offset pagination breaks down badly past a few hundred thousand rows."],
  ["Mike", "API v2 will use cursor-based pagination."],
  ["Sarah", "Agreed, cursors are the right call."],
  ["Emily", "What about the auth token lifetime? Seven days is too long."],
  ["Emily", "Auth tokens will expire after 24 hours instead of 7 days."],
  ["John", "Agreed. Emily, can you take that?"],
  ["Emily", "I'll ship it to staging first."],
  ["Mike", "Coming back to pagination for a second — what about sorting stability?"],
  ["Sarah", "We already decided on cursors, let's not reopen it."],
  ["Mike", "Fair, I just want the sort key documented."],
  ["Mike", "I can write the migration guide once we lock pagination."],
  ["Mike", "We should book a separate session for the data model."],
  ["John", "Let's move to the budget."],
  ["John", "Infrastructure budget increases by 12% for Q3."],
  ["John", "Finance already approved it, so this is confirmed."],
  ["Sarah", "Does that cover the warehouse overage Mike mentioned?"],
  ["John", "It should, with a small buffer."],
  ["John", "I'll send the breakdown after this call."],
  ["Lisa", "We still need to follow up with the vendor about the invoice."],
  ["John", "The contractor engagement will not be extended past June."],
  ["David", "Someone should really update the on-call docs."],
  ["John", "Alright, opening it up for questions."],
  ["David", "Nothing from me. Anyone doing anything fun this weekend?"],
  ["Lisa", "I'm going to the coast, weather looks great."],
  ["Mike", "I finally started that Netflix series everyone talks about."],
  ["Sarah", "I'm mostly catching up on sleep after this release push."],
  ["David", "We should do a team lunch when the release ships."],
  ["John", "Good idea. Let's wrap here, thanks everyone."],
];

function buildTranscript() {
  const segments: { speaker: string; text: string; startTime: number; endTime: number }[] = [];
  const total = 5072;
  const step = Math.floor(total / SCRIPT.length);
  SCRIPT.forEach(([speaker, text], index) => {
    const startTime = index * step;
    segments.push({ speaker, text, startTime, endTime: startTime + Math.max(8, step - 12) });
  });
  return segments;
}

const HISTORY = [
  { title: "Weekly Team Sync", date: "2025-04-26", duration: 4320, healthScore: 64, decisions: 3, actionItems: 5 },
  { title: "Weekly Team Sync", date: "2025-05-03", duration: 3900, healthScore: 71, decisions: 4, actionItems: 6 },
  { title: "Weekly Team Sync", date: "2025-05-10", duration: 4500, healthScore: 69, decisions: 4, actionItems: 6 },
];

async function main() {
  await prisma.meeting.deleteMany({});
  await prisma.settings.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.org.deleteMany({});

  const org = await prisma.org.create({ data: { name: "Acme Product Team" } });

  const user = await prisma.user.create({
    data: {
      name: "John",
      email: "john@example.com",
      password: await bcrypt.hash("password123", 10),
      orgId: org.id,
      settings: { create: {} },
    },
  });

  for (const previous of HISTORY) {
    const meeting = await prisma.meeting.create({
      data: {
        title: previous.title,
        type: "Team Sync",
        date: new Date(previous.date),
        duration: previous.duration,
        status: "ready",
        healthScore: previous.healthScore,
        healthPercentile: 50,
        uploadedById: user.id,
        orgId: org.id,
        aiSummary: `${previous.title} on ${previous.date} scored ${previous.healthScore}/100.`,
        aiNarrative: `${previous.title} on ${previous.date} scored ${previous.healthScore}/100.`,
        strengths: JSON.stringify(["Meeting finished on time"]),
        weaknesses: JSON.stringify(["Status updates ran long"]),
      },
    });

    await prisma.participant.createMany({
      data: PARTICIPANTS.map((participant, index) => ({
        meetingId: meeting.id,
        name: participant.name,
        speakingTime: Math.round(participant.speakingTime * 0.85),
        speakingPct: participant.speakingPct,
        sentiment: "neutral",
        color: SPEAKER_COLORS[index % SPEAKER_COLORS.length],
      })),
    });

    await prisma.decision.createMany({
      data: DECISIONS.slice(0, previous.decisions).map((decision) => ({
        meetingId: meeting.id,
        text: decision.text,
        owner: decision.owner,
        timestamp: decision.timestamp,
        confidence: decision.confidence,
        context: decision.context,
      })),
    });

    await prisma.actionItem.createMany({
      data: ACTION_ITEMS.slice(0, previous.actionItems).map((item) => ({
        meetingId: meeting.id,
        task: item.task,
        owner: item.owner,
        dueDate: item.dueDate ? new Date(item.dueDate) : null,
        priority: item.priority,
        status: item.status,
        source: item.source,
      })),
    });

    await prisma.problem.createMany({
      data: PROBLEMS.slice(0, 3).map((problem) => ({
        meetingId: meeting.id,
        description: problem.description,
        severity: problem.severity,
        timeImpact: problem.timeImpact,
        evidence: problem.evidence,
        recommendation: problem.recommendation,
      })),
    });

    await prisma.wasteSegment.createMany({
      data: WASTE_SEGMENTS.slice(0, 2).map((segment) => ({
        meetingId: meeting.id,
        startTime: segment.startTime,
        endTime: segment.endTime,
        type: segment.type,
        description: segment.description,
        valueLevel: segment.valueLevel,
      })),
    });
  }

  const meeting = await prisma.meeting.create({
    data: {
      title: "Weekly Team Sync",
      type: "Team Sync",
      date: new Date("2025-05-17"),
      duration: 5072,
      status: "ready",
      healthScore: 78,
      healthPercentile: 68,
      uploadedById: user.id,
      orgId: org.id,
      aiSummary:
        "The meeting had a good focus with clear decisions. However, too much time was spent on status updates and some action items lack ownership.",
      aiNarrative: [
        "The meeting had a good focus with clear decisions. However, too much time was spent on status updates and some action items lack ownership.",
        "Five decisions were captured, the most consequential being the May 30 release date and the move to cursor-based pagination for API v2. The API design segment was the highest-value part of the call, though pagination was reopened twice after it had already been settled.",
        "The biggest drags on the score were 32 minutes of sequential status updates, three unowned action items, and an 18-minute off-topic stretch during Q&A. Fixing those three things alone would push this meeting into the excellent band.",
      ].join("\n\n"),
      strengths: JSON.stringify([
        "5 clear decisions were captured with named owners",
        "4 of 7 action items have owners and due dates",
        "The API design discussion produced concrete, documented outcomes",
      ]),
      weaknesses: JSON.stringify([
        "32 minutes spent on sequential status updates",
        "3 action items have no owner",
        "API design was re-litigated after a decision was made",
        "John spoke 42% of the time while Lisa spoke 3%",
      ]),
    },
  });

  await prisma.participant.createMany({
    data: PARTICIPANTS.map((participant, index) => ({
      meetingId: meeting.id,
      name: participant.name,
      speakingTime: participant.speakingTime,
      speakingPct: participant.speakingPct,
      sentiment: index % 3 === 0 ? "positive" : "neutral",
      color: SPEAKER_COLORS[index % SPEAKER_COLORS.length],
    })),
  });

  await prisma.topic.createMany({
    data: TOPICS.map((topic) => ({
      meetingId: meeting.id,
      name: topic.name,
      startTime: topic.startTime,
      endTime: topic.endTime,
      duration: topic.endTime - topic.startTime,
      valueRating: topic.valueRating,
      keyPoints: JSON.stringify(topic.keyPoints),
      isDrift: topic.isDrift,
    })),
  });

  await prisma.decision.createMany({
    data: DECISIONS.map((decision) => ({
      meetingId: meeting.id,
      text: decision.text,
      owner: decision.owner,
      timestamp: decision.timestamp,
      confidence: decision.confidence,
      context: decision.context,
    })),
  });

  await prisma.actionItem.createMany({
    data: ACTION_ITEMS.map((item) => ({
      meetingId: meeting.id,
      task: item.task,
      owner: item.owner,
      dueDate: item.dueDate ? new Date(item.dueDate) : null,
      priority: item.priority,
      status: item.status,
      source: item.source,
    })),
  });

  await prisma.problem.createMany({
    data: PROBLEMS.map((problem) => ({
      meetingId: meeting.id,
      description: problem.description,
      severity: problem.severity,
      timeImpact: problem.timeImpact,
      evidence: problem.evidence,
      recommendation: problem.recommendation,
    })),
  });

  await prisma.recommendation.createMany({
    data: RECOMMENDATIONS.map((recommendation) => ({
      meetingId: meeting.id,
      text: recommendation.text,
      category: recommendation.category,
    })),
  });

  await prisma.wasteSegment.createMany({
    data: WASTE_SEGMENTS.map((segment) => ({
      meetingId: meeting.id,
      startTime: segment.startTime,
      endTime: segment.endTime,
      type: segment.type,
      description: segment.description,
      valueLevel: segment.valueLevel,
    })),
  });

  await prisma.transcriptSegment.createMany({
    data: buildTranscript().map((segment) => ({ meetingId: meeting.id, ...segment })),
  });

  console.log(`Seeded demo user ${user.email} with ${HISTORY.length + 1} meetings.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
