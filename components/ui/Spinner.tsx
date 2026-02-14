import { cn } from '@/lib/utils';

export function Spinner({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'h-6 w-6 rounded-full border-[3px] border-gray-200 border-t-black animate-spin',
        className,
      )}
    />
  );
}
