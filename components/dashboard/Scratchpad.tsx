import { ArrowUp, PenLine } from "lucide-react";

export function Scratchpad() {
    return (
        <div className="group h-full rounded-[32px] border border-border bg-background flex flex-col relative overflow-hidden transition-all duration-500 hover:-translate-y-1 hover:shadow-xl focus-within:-translate-y-1 focus-within:shadow-2xl focus-within:ring-1 focus-within:ring-indigo-500/30">

            {/* Sleek Header */}
            <div className="px-6 pt-6 pb-2 flex items-center justify-between text-foreground/50 transition-colors group-focus-within:text-indigo-500">
                <div className="flex items-center gap-2">
                    <PenLine className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase tracking-wider">Quick Note</span>
                </div>
            </div>

            <div className="flex-1 px-5 pb-2">
                <textarea
                    className="w-full h-full bg-foreground/[0.02] rounded-2xl resize-none p-4 outline-none placeholder:text-foreground/30 text-foreground font-medium text-sm sm:text-base leading-relaxed border border-transparent focus:border-border/50 transition-colors"
                    placeholder="Draft a scene, log a character idea, or write a note..."
                />
            </div>

            {/* Bottom Action Bar */}
            <div className="flex justify-between items-center px-4 py-3 m-2 mt-0 bg-foreground/[0.02] rounded-2xl border border-border/50">
                <select className="bg-transparent text-xs font-semibold text-foreground/50 outline-none cursor-pointer hover:text-foreground transition-colors">
                    <option>Save to Notes</option>
                    <option>Save to Characters</option>
                </select>
                <button className="w-8 h-8 flex items-center justify-center bg-foreground text-background rounded-full hover:bg-indigo-500 hover:text-white transition-all active:scale-95">
                    <ArrowUp className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}