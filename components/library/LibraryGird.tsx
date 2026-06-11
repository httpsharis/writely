import type { NovelDocument } from "@/hooks/useLibraryData";
import { ProjectCard } from "@/components/shared/ProjectCard";

interface LibraryGridProps {
  projects: NovelDocument[];
}

export function LibraryGrid({ projects }: LibraryGridProps) {
  if (projects.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center animate-in fade-in duration-700">
        <p className="font-serif text-2xl text-muted-foreground mb-6">
          No manuscripts found.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
      {projects.map((project) => (
        <ProjectCard key={project._id} project={project} />
      ))}
    </div>
  );
}