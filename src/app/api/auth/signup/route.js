import prisma from '../../../../../lib/prisma';

export async function POST(request) {
  const { email, name } = await request.json();

  const user = await prisma.user.upsert({
    where: { email: email },
    update: { email, name },
    create: { email: email, name },
  });

  return Response.json({ status: 200 });
}