import { auth } from "@/auth";
import CompressedVideoList from "@/components/CompressedVideoList";
import { prisma } from "@/lib/prisma";

export default async function PanelLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  const videoList = await prisma.record.findMany({
    where: {
      owner: session!.user!.email as string,
    },
  });

  return (
    <div className="min-h-screen bg-base-200">
      <main className="p-4">
        <div className="shadow-md bg-base-100 rounded-lg p-6 mb-6">
          <div className="flex flex-col items-center gap-6">{children}</div>
        </div>

        <div className="shadow-md bg-base-100 rounded-lg p-6 mb-6 overflow-x-auto">
          <CompressedVideoList list={videoList} />
        </div>
      </main>
    </div>
  );
}
