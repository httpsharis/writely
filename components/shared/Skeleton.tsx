import { cn } from "@/lib/utils"; // Assuming you have standard tailwind merge utils, otherwise just use template literals

type SkeletonProps = React.HTMLAttributes<HTMLDivElement>;

export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-foreground/10", // The universal Phantom UI style
        className,
      )}
      {...props}
    />
  );
}
