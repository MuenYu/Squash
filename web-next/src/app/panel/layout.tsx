import CompressedVideoList from "@/components/CompressedVideoList";

export default function PanelLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-base-200">
      <main className="p-4">
        <div className="shadow-md bg-base-100 rounded-lg p-6 mb-6">
          {children}
        </div>

        <div className="shadow-md bg-base-100 rounded-lg p-6 mb-6 overflow-x-auto">
          <CompressedVideoList />
        </div>
      </main>
    </div>
  );
}
