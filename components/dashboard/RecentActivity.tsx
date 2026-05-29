import { BookOpen, Users, StickyNote, MoreHorizontal } from "lucide-react";

export function RecentActivity() {
    const activities = [
        { title: "Chapter 4: The Silent City", type: "Chapter", time: "2 hours ago", icon: BookOpen, color: "text-blue-500" },
        { title: "Arthur Pendragon", type: "Character", time: "Yesterday", icon: Users, color: "text-emerald-500" },
        { title: "Magic System Rules", type: "Note", time: "2 days ago", icon: StickyNote, color: "text-amber-500" },
    ];

    return (
        <div className="h-full rounded-[32px] border border-border bg-background p-8 flex flex-col transition-all duration-500 hover:-translate-y-1 hover:shadow-xl">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-foreground">Recent Activity</h3>
                <button className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-foreground/5 transition-colors text-foreground/50">
                    <MoreHorizontal className="w-5 h-5" />
                </button>
            </div>

            <div className="flex flex-col gap-4">
                {activities.map((item, i) => {
                    const Icon = item.icon;
                    return (
                        <div key={i} className="group flex items-center gap-4 p-2 -mx-2 rounded-2xl hover:bg-foreground/5 transition-all duration-300 cursor-pointer">
                            <div className="w-12 h-12 rounded-xl bg-foreground/5 flex items-center justify-center text-foreground/50 group-hover:bg-background group-hover:shadow-sm transition-all duration-300">
                                <Icon className={`w-5 h-5 ${item.color}`} />
                            </div>
                            <div className="flex flex-col flex-1">
                                <span className="font-semibold text-sm text-foreground">{item.title}</span>
                                <span className="text-xs text-foreground/50 font-medium">
                                    Edited {item.type} • {item.time}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}