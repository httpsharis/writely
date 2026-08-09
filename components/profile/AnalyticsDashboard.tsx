import { UserProfileResponse } from "@/redux/features/users/userApi";
import { Flame, Trophy, Target, TrendingUp } from "lucide-react";

export function AnalyticsDashboard({ 
  analyticsData, 
  stats 
}: { 
  analyticsData?: UserProfileResponse;
  stats?: { totalWords: number; currentStreak: number; activeProjects: number };
}) {
  const currentStreak = analyticsData?.analytics?.currentStreak || stats?.currentStreak || 0;
  const longestStreak = analyticsData?.analytics?.longestStreak || 0;
  const heatmap = analyticsData?.analytics?.heatmap || [];
  const goals = analyticsData?.goals || [];

  // Generate the last 30 days for the heatmap
  const last30Days = Array.from({ length: 30 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (29 - i));
    const dateStr = d.toISOString().split("T")[0];
    const dataForDay = heatmap.find(h => h._id === dateStr);
    return {
      date: dateStr,
      count: dataForDay ? dataForDay.dailyMax : 0,
    };
  });

  const getHeatmapColor = (count: number) => {
    if (count === 0) return "bg-white/5 border border-white/5";
    if (count < 500) return "bg-emerald-500/20 border border-emerald-500/30";
    if (count < 1000) return "bg-emerald-500/40 border border-emerald-500/50";
    if (count < 2000) return "bg-emerald-500/60 border border-emerald-500/70";
    return "bg-emerald-500 border border-emerald-400";
  };

  return (
    <div className="space-y-10">
      
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-card border border-border flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-orange-500/10 text-orange-500 flex items-center justify-center shrink-0">
            <Flame className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Current Streak</p>
            <p className="text-2xl font-black text-foreground">{currentStreak} Days</p>
          </div>
        </div>
        <div className="p-5 rounded-3xl bg-card border border-border flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-yellow-500/10 text-yellow-500 flex items-center justify-center shrink-0">
            <Trophy className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Longest Streak</p>
            <p className="text-2xl font-black text-foreground">{longestStreak} Days</p>
          </div>
        </div>
        <div className="p-5 rounded-3xl bg-card border border-border flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center shrink-0">
            <Target className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Active Goals</p>
            <p className="text-2xl font-black text-foreground">{goals.length}</p>
          </div>
        </div>
        <div className="p-5 rounded-3xl bg-card border border-border flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Total Words</p>
            <p className="text-2xl font-black text-foreground">{stats?.totalWords?.toLocaleString() || 0}</p>
          </div>
        </div>
      </div>

      {/* Heatmap Section */}
      <section className="bg-card border border-border rounded-3xl p-6 md:p-8">
        <h3 className="text-sm font-bold tracking-widest text-foreground uppercase mb-6 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-emerald-500" /> Writing Consistency (30 Days)
        </h3>
        
        <div className="flex flex-wrap gap-2 md:gap-3">
          {last30Days.map((day, idx) => (
            <div 
              key={idx} 
              title={`${day.count} words on ${day.date}`}
              className={`w-6 h-6 md:w-8 md:h-8 rounded-md transition-all duration-300 hover:scale-110 cursor-help ${getHeatmapColor(day.count)}`} 
            />
          ))}
        </div>
        <div className="flex items-center gap-2 mt-6 text-xs font-semibold text-muted-foreground">
          <span>Less</span>
          <div className="flex gap-1">
            <div className="w-3 h-3 rounded-sm bg-white/5 border border-white/5" />
            <div className="w-3 h-3 rounded-sm bg-emerald-500/20 border border-emerald-500/30" />
            <div className="w-3 h-3 rounded-sm bg-emerald-500/40 border border-emerald-500/50" />
            <div className="w-3 h-3 rounded-sm bg-emerald-500/60 border border-emerald-500/70" />
            <div className="w-3 h-3 rounded-sm bg-emerald-500 border border-emerald-400" />
          </div>
          <span>More</span>
        </div>
      </section>

      {/* Goals Section */}
      <section>
        <h3 className="text-sm font-bold tracking-widest text-foreground uppercase mb-4 flex items-center gap-2">
          <Target className="w-4 h-4 text-blue-500" /> Writing Goals
        </h3>
        
        {goals.length === 0 ? (
          <div className="py-12 rounded-3xl border border-dashed border-border bg-card/50 flex flex-col items-center justify-center text-center">
            <p className="text-sm font-medium text-muted-foreground mb-4">You haven&apos;t set any active writing goals.</p>
            <button className="px-6 py-2 rounded-full bg-primary/20 text-primary font-bold text-sm hover:bg-primary/30 transition-colors">
              Set a Goal
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {goals.map(goal => {
              const current = goal.currentWords || 0;
              const target = goal.targetWords || 1; // prevent div by zero
              const progress = Math.min((current / target) * 100, 100);
              return (
                <div key={goal._id} className="p-6 rounded-3xl bg-card border border-border shadow-sm">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="font-bold text-foreground capitalize">{goal.type} Goal</h4>
                      <p className="text-xs text-muted-foreground mt-1 font-medium tracking-wide">
                        {current.toLocaleString()} / {target.toLocaleString()} words
                      </p>
                    </div>
                    <span className="px-2 py-1 rounded bg-blue-500/10 text-blue-500 text-xs font-bold uppercase tracking-wider">
                      {Math.floor(progress)}%
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-secondary/50 overflow-hidden">
                    <div 
                      className="h-full bg-blue-500 rounded-full transition-all duration-1000 ease-out" 
                      style={{ width: `${progress}%` }}
                    />
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
