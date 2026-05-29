import Link from "next/link";
import { StickyNote, Users, BookPlus, Sparkles } from "lucide-react";

export function QuickLinks() {
    const links = [
        { name: "New Chapter", icon: BookPlus, href: "/write", color: "text-indigo-500", bg: "bg-indigo-500/10" },
        { name: "Characters", icon: Users, href: "/characters", color: "text-emerald-500", bg: "bg-emerald-500/10" },
        { name: "Notes", icon: StickyNote, href: "/notes", color: "text-amber-500", bg: "bg-amber-500/10" },
        { name: "Brainstorm", icon: Sparkles, href: "/brainstorm", color: "text-purple-500", bg: "bg-purple-500/10" },
    ];

    return (
        <div className="h-full rounded-[32px] border border-border bg-background p-6 flex flex-col transition-all duration-500 hover:shadow-xl">
            <h3 className="text-sm font-bold text-foreground/50 uppercase tracking-wider mb-4 px-2">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3 flex-1">
                {links.map((link) => {
                    const Icon = link.icon;
                    return (
                        <Link
                            key={link.name}
                            href={link.href}
                            className="group flex flex-col items-center justify-center gap-3 p-4 rounded-2xl bg-foreground/[0.02] hover:bg-foreground/[0.05] border border-transparent hover:border-border/50 transition-all duration-300"
                        >
                            <div className={`w-10 h-10 rounded-full ${link.bg} flex items-center justify-center group-hover:scale-110 transition-transform duration-300 ${link.color}`}>
                                <Icon className="w-5 h-5" />
                            </div>
                            <span className="text-xs font-semibold text-foreground/70 group-hover:text-foreground transition-colors">
                                {link.name}
                            </span>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}