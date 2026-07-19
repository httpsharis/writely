export default function ReaderLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen w-full bg-[#131217]">
      <main className="flex-1 w-full">
        {children}
      </main>
    </div>
  );
}
