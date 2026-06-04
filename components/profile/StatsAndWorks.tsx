import { Flame, PenTool, BookOpen, Clock, FileText, Hash } from "lucide-react";

interface Project {
  _id: string;
  title: string;
  type: string;
  status: string;
  chapters: number;
  wordCount: number;
  updatedAt: string;
}

interface StatsAndWorksProps {
  stats:
    | {
        totalWords: number;
        currentStreak: number;
        activeProjects: number;
      }
    | undefined;
  projects: Project[] | undefined;
}

export function StatsAndWorks({ stats, projects }: StatsAndWorksProps) {
  // Safe fallbacks while loading
  const totalWords = stats?.totalWords || 0;
  const currentStreak = stats?.currentStreak || 0;
  const activeProjectsCount = stats?.activeProjects || 0;
  const activeProjectsList = projects || [];

  const AUTHOR_STATS = [
    {
      label: "Total Words",
      value: totalWords.toLocaleString(),
      icon: PenTool,
      color: "text-primary",
      bg: "bg-primary/10",
    },
    {
      label: "Current Streak",
      value: `${currentStreak} Days`,
      icon: Flame,
      color: "text-amber-500",
      bg: "bg-amber-500/10",
    },
    {
      label: "Projects",
      value: `${activeProjectsCount} Active`,
      icon: BookOpen,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
    },
  ];

  return (
    <div className="space-y-10">
      <section>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {AUTHOR_STATS.map((stat, idx) => (
            <div
              key={idx}
              className="flex items-center gap-4 p-5 rounded-3xl bg-card border border-border shadow-sm"
            >
              <div
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${stat.bg} ${stat.color}`}
              >
                <stat.icon className="w-6 h-6 stroke-[1.5]" />
              </div>
              <div>
                <p className="text-xs font-bold tracking-widest text-muted-foreground uppercase mb-1">
                  {stat.label}
                </p>
                <p className="text-xl font-bold text-foreground tracking-tight">
                  {stat.value}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <div className="flex items-center gap-2 mb-4 px-2">
          <BookOpen className="w-5 h-5 text-primary" />
          <h2 className="text-sm font-bold tracking-widest text-foreground uppercase">
            Active Projects
          </h2>
        </div>

        {activeProjectsList.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 rounded-3xl border border-dashed border-border bg-card/50">
            <p className="text-sm font-medium text-muted-foreground">
              No active projects yet.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeProjectsList.map((work) => {
              // Basic date formatting
              const dateObj = new Date(work.updatedAt);
              const updatedStr = dateObj.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              });

              return (
                <div
                  key={work._id}
                  className="group flex flex-col justify-between p-6 rounded-3xl bg-card border border-border hover:border-border/80 transition-all duration-300 shadow-sm min-h-[160px]"
                >
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h3 className="text-lg font-bold text-foreground mb-1 group-hover:text-primary transition-colors">
                        {work.title}
                      </h3>
                      <p className="text-sm font-medium text-muted-foreground">
                        {work.type || "Manuscript"}
                      </p>
                    </div>
                    <span className="px-3 py-1 rounded-md bg-secondary text-foreground text-xs font-bold uppercase tracking-wider">
                      {work.status || "Drafting"}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 pt-4 border-t border-border/50">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
                      <Hash className="w-3.5 h-3.5" />
                      {work.chapters || 0} {work.chapters === 1 ? "Ch" : "Chs"}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
                      <FileText className="w-3.5 h-3.5" />
                      {(work.wordCount || 0).toLocaleString()} words
                    </div>
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground ml-auto">
                      <Clock className="w-3.5 h-3.5" />
                      {updatedStr}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
