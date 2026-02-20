import type { StatCardProps } from "@/types/novelDashboard";

export default function StatCard({ icon, label, value, sub }: StatCardProps) {
  return (
    <div className="border-[3px] border-black bg-white p-4 shadow-[3px_3px_0px_black]">
      <div className="mb-2 flex items-center gap-1.5 text-gray-400">
        {icon}
        <span className="font-mono text-[9px] font-bold uppercase tracking-[2px]">
          {label}
        </span>
      </div>
      <div className="text-2xl font-extrabold">{value}</div>
      {sub && (
        <div className="mt-1 font-mono text-[10px] text-gray-400">{sub}</div>
      )}
    </div>
  );
}
