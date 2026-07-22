import { Loader2, ArrowRight } from "lucide-react";

interface SubmitButtonProps {
  isLoading: boolean;
  label: string;
}

/** Primary form submit button: spinner while pending, arrow reveal on hover otherwise. */
export function SubmitButton({ isLoading, label }: SubmitButtonProps) {
  return (
    <button
      type="submit"
      disabled={isLoading}
      className="w-full h-11 mt-2 bg-brand text-white font-bold rounded-xl flex items-center justify-center transition-all hover:bg-brand/90 disabled:opacity-50 disabled:cursor-not-allowed group"
    >
      {isLoading ? (
        <Loader2 className="w-5 h-5 animate-spin" />
      ) : (
        <>
          {label}
          <ArrowRight className="w-4 h-4 ml-2 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
        </>
      )}
    </button>
  );
}
