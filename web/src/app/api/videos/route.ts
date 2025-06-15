import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();

  const list = await prisma.record.findMany({
    where: {
      owner: session!.user!.email as string,
    },
  });

  return new Response(JSON.stringify(list), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
