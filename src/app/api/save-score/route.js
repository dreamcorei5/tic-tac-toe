import prisma from "../../../../lib/prisma";

export async function POST(request) {
  const { email, score } = await request.json();

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });
  
  const newScore = existingUser ? parseInt(existingUser.score, 10) + parseInt(score, 10) : parseInt(score, 10);

  const updatedScore = await prisma.user.upsert({
    where: { email },
    update: { score: newScore },
    create: { email, score: newScore },
  });

  return Response.json({ status: 200, body: updatedScore.score });
}
