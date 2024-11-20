import prisma from "../../../../lib/prisma";

export async function GET() {
  const users = await prisma.user.findMany({
    select: {
      name: true,
      score: true,
    },
    orderBy: {
      score: "desc",
    },
  });

  return Response.json({ status: 200, body: users });
}
