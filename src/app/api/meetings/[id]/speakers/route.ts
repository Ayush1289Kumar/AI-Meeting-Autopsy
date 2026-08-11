import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { giniCoefficient } from "@/services/health-scoring.service";
import { balanceRating } from "@/lib/constants";

export async function GET(_request: Request, { params }: { params: { id: string } }) {
  const speakers = await prisma.participant.findMany({
    where: { meetingId: params.id },
    orderBy: { speakingTime: "desc" },
  });
  const gini = giniCoefficient(speakers.map((speaker) => speaker.speakingTime ?? 0));
  return NextResponse.json({ speakers, balance: { gini, rating: balanceRating(gini) } });
}
