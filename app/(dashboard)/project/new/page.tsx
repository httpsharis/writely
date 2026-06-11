import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { NewProjectForm } from "../../../../components/project/NewProjectForm";

export default function NewProjectPage() {
  return (
    <div className="max-w-4xl mx-auto flex flex-col h-full w-full pb-32 md:pb-12 px-4 md:px-8 pt-6 md:pt-10">
      
      {/* Header */}
      <div className="flex items-center gap-4 mb-12">
        <Link 
          href="/project"
          className="p-2 -ml-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 stroke-[1.5]" />
        </Link>
        <div>
          <h1 className="text-2xl md:text-3xl font-serif font-bold text-foreground tracking-tight">
            The blank page awaits
          </h1>
          <p className="text-xs uppercase tracking-widest font-bold text-muted-foreground mt-2">
            Configure your new universe
          </p>
        </div>
      </div>

      {/* Form Component */}
      <NewProjectForm />
      
    </div>
  );
}