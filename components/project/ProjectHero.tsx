import { ImageIcon } from "lucide-react";
import Image from "next/image";
import { getBookCoverUrl } from "@/lib/cloudinary";

export interface ProjectStats {
  chapters: number;
  words: number;
  views: number;
  followers: number;
}

export interface ProjectData {
  title: string;
  description: string;
  status: string;
  stats: ProjectStats;
  coverImage?: string | null;
  icon?: string | null;
}

interface ProjectHeroProps {
  project: ProjectData;
}

export function ProjectHero({ project }: ProjectHeroProps) {
  return (
    <div className="flex flex-col md:flex-row gap-6 md:gap-10 mb-16 items-start">
      {/* Cover Image or Placeholder */}
      <div className="relative w-32 h-48 md:w-40 md:h-56 shrink-0 rounded-xl border border-border/40 bg-secondary/20 flex items-center justify-center overflow-hidden">
        {project.coverImage ? (
          <Image
            src={getBookCoverUrl(project.coverImage, 400)}
            alt={`${project.title} cover`}
            fill
            sizes="(max-width: 768px) 128px, 160px"
            className="object-cover"
          />
        ) : (
          <div className="flex flex-col items-center text-muted-foreground">
            <ImageIcon className="w-6 h-6 mb-2 opacity-40 stroke-[1.5]" />
            <span className="text-[9px] uppercase tracking-widest font-bold opacity-40">
              No Cover
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-col flex-1 pt-2">
        <span className="w-fit mb-4 px-2 py-0.5 border border-brand/30 bg-brand/5 text-brand text-[9px] font-bold uppercase tracking-widest rounded-sm">
          {project.status}
        </span>
        <h1 className="text-3xl md:text-5xl font-serif font-bold text-foreground tracking-tight mb-4 leading-tight">
          {project.title}
        </h1>
        <p className="text-muted-foreground text-sm leading-relaxed max-w-2xl mb-8">
          {project.description}
        </p>

        <div className="flex flex-wrap items-center gap-x-12 gap-y-6 pt-6 border-t border-border/40">
          <StatBlock label="Chapters" value={project.stats.chapters} />
          <StatBlock label="Words" value={project.stats.words.toLocaleString()} />
          <StatBlock label="Views" value={project.stats.views} />
        </div>
      </div>
    </div>
  );
}

function StatBlock({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-xl md:text-2xl font-serif font-bold text-foreground tracking-tight">
        {value}
      </span>
      <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
        {label}
      </span>
    </div>
  );
}