import { Spinner } from "@/components/ui/Spinner"; // Adjust path if your spinner is elsewhere

export default function LoadingState() {
  return (
    <div className="flex h-dvh items-center justify-center bg-grid">
      <Spinner />
    </div>
  );
}