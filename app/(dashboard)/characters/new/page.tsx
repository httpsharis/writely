"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  User,
  Image as ImageIcon,
  Sparkles,
  Save,
  Eye,
  Brain,
  BookOpen,
  Loader2,
  Book,
  Upload,
} from "lucide-react";
import { toast } from "sonner";
import { useCreateCharacterMutation } from "@/redux/features/characters/characterApi";
import { useGetDocumentsQuery } from "@/redux/features/documents/documentApi";
import { uploadToCloudinary } from "@/lib/uploadImage";
import { getAvatarUrl } from "@/lib/cloudinary";

export default function NewCharacterPage() {
  const router = useRouter();
  const params = useParams();
  const projectId = (params.projectId || params.id) as string;

  const { data: novelsData } = useGetDocumentsQuery({ type: "novel" });
  const novels = novelsData?.documents || [];

  const [createCharacter, { isLoading }] = useCreateCharacterMutation();
  const [isUploading, setIsUploading] = useState(false);

  const [selectedNovelId, setSelectedNovelId] = useState(projectId || "global");

  const [name, setName] = useState("");
  const [role, setRole] = useState("supporting");
  const [avatarUrl, setAvatarUrl] = useState("");

  const [appearance, setAppearance] = useState("");
  const [personality, setPersonality] = useState("");
  const [history, setHistory] = useState("");
  
  const [traitsInput, setTraitsInput] = useState("");
  const [traits, setTraits] = useState<string[]>([]);

  const handleAddTrait = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && traitsInput.trim()) {
      e.preventDefault();
      if (!traits.includes(traitsInput.trim())) {
        setTraits([...traits, traitsInput.trim()]);
      }
      setTraitsInput("");
    }
  };

  const removeTrait = (traitToRemove: string) => {
    setTraits(traits.filter(t => t !== traitToRemove));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5MB");
      return;
    }

    try {
      setIsUploading(true);
      toast.loading("Uploading portrait to Cloudinary...", { id: "char-upload" });
      const uploadedUrl = await uploadToCloudinary(file);
      setAvatarUrl(uploadedUrl);
      toast.success("Portrait uploaded successfully!", { id: "char-upload" });
    } catch (err: unknown) {
      console.error("Cloudinary upload failed", err);
      const msg = err instanceof Error ? err.message : "Failed to upload portrait to Cloudinary.";
      toast.error(msg, { id: "char-upload" });
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async () => {
    if (!name.trim()) {
      toast.error("Please enter a character designation (name).");
      return;
    }

    const compiledBio = `**Physical Appearance & Body**
${appearance || "No appearance defined."}

**Personality & Flaws**
${personality || "No personality defined."}

**Backstory & History**
${history || "No history defined."}`.trim();

    try {
      await createCharacter({
        novelId: selectedNovelId || "global",
        data: {
          name,
          role,
          avatarUrl,
          bio: compiledBio,
          status: "alive",
          traits,
          aliases: [],
        },
      }).unwrap();

      toast.success(`Character "${name}" created!`);
      router.push(projectId ? `/project/${projectId}/characters` : `/characters`);
    } catch (err: unknown) {
      console.error("Failed to create character", err);
      toast.error("Failed to save character. Please try again.");
    }
  };

  const backLink = projectId ? `/project/${projectId}/characters` : `/characters`;

  return (
    <div className="min-h-screen w-full overflow-y-auto bg-background text-foreground px-4 sm:px-8 py-8 sm:py-12 pb-32 no-scrollbar font-sans">
      <div className="max-w-[800px] mx-auto flex flex-col w-full h-full gap-8">
        
        <div className="flex items-center justify-between shrink-0 mb-4">
          <Link
            href={backLink}
            className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors w-fit group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Roster
          </Link>
        </div>

        <div className="bg-card border border-border rounded-3xl p-6 sm:p-10 flex flex-col gap-10 sm:gap-12 shadow-xl">
          
          <div className="flex flex-col gap-2">
            <h1 className="font-serif text-3xl sm:text-4xl font-medium text-foreground tracking-tight flex items-center gap-3 leading-none">
              Draft Character
              <Sparkles className="w-7 h-7 text-brand" />
            </h1>
            <p className="text-sm text-muted-foreground font-medium">
              Establish the core identity, narrative roles, and unique traits.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 sm:gap-10 items-start">
            
            <div className="md:col-span-4 flex flex-col gap-4">
              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                <ImageIcon className="w-3.5 h-3.5 text-brand" /> Portrait Profile
              </label>

              <div className="relative w-full aspect-[3/4] rounded-2xl bg-secondary/30 border border-border flex items-center justify-center overflow-hidden shadow-inner">
                {avatarUrl ? (
                  <Image
                    src={getAvatarUrl(avatarUrl, 400)}
                    alt="Preview"
                    fill
                    sizes="(max-width: 768px) 100vw, 250px"
                    className="object-cover object-top"
                  />
                ) : (
                  <div className="flex flex-col items-center gap-3 text-muted-foreground p-4 text-center">
                    <User className="w-12 h-12 opacity-40" />
                    <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">
                      No Image
                    </span>
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <label className="flex-1 cursor-pointer bg-secondary/40 border border-border rounded-xl px-4 py-3 flex items-center justify-center gap-2 text-xs font-bold text-foreground hover:bg-secondary/70 hover:border-brand/40 transition-all group">
                  <Upload className="w-4 h-4 text-muted-foreground group-hover:text-brand transition-colors" />
                  <span>{isUploading ? "Uploading..." : "Upload Image"}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={isUploading}
                    className="hidden"
                  />
                </label>
                {avatarUrl && (
                  <button
                    type="button"
                    onClick={() => setAvatarUrl("")}
                    className="px-4 rounded-xl bg-destructive/10 text-destructive text-xs font-bold hover:bg-destructive/20 transition-colors cursor-pointer"
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>

            <div className="md:col-span-8 flex flex-col gap-6 w-full">
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                  Designation <span className="text-brand">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Character Name"
                    className="w-full bg-secondary/30 border border-border rounded-xl pl-11 pr-4 py-3.5 text-base text-foreground font-serif focus:outline-none focus:border-brand transition-colors"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                  Assigned Novel
                </label>
                <div className="relative">
                  <Book className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <select
                    value={selectedNovelId}
                    onChange={(e) => setSelectedNovelId(e.target.value)}
                    className="w-full bg-secondary/30 border border-border rounded-xl pl-11 pr-4 py-3 text-sm text-foreground focus:outline-none focus:border-brand transition-colors appearance-none cursor-pointer"
                  >
                    <option value="global">Global Cast (Not attached to a novel)</option>
                    {novels.map(novel => (
                      <option key={novel._id} value={novel._id}>{novel.title}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                  Narrative Role
                </label>
                <div className="flex flex-wrap gap-2">
                  {[
                    { id: "protagonist", label: "Protagonist" },
                    { id: "antagonist", label: "Antagonist" },
                    { id: "supporting", label: "Supporting" },
                    { id: "minor", label: "Minor" },
                  ].map((r) => (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => setRole(r.id)}
                      className={`px-4 py-2.5 rounded-xl text-[11px] font-bold tracking-wider uppercase transition-all border flex-1 min-w-[100px] cursor-pointer ${
                        role === r.id
                          ? "bg-brand/15 border-brand text-brand"
                          : "bg-secondary/20 border-border text-muted-foreground hover:border-border hover:text-foreground"
                      }`}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                  Traits (Press Enter)
                </label>
                <div className="flex flex-col gap-2">
                  <input
                    type="text"
                    value={traitsInput}
                    onChange={(e) => setTraitsInput(e.target.value)}
                    onKeyDown={handleAddTrait}
                    placeholder="e.g. Stubborn, Brilliant, Cynical..."
                    className="w-full bg-secondary/30 border border-border rounded-xl px-4 py-3 text-sm text-foreground focus:outline-none focus:border-brand transition-colors"
                  />
                  <div className="flex flex-wrap gap-2 mt-1">
                    {traits.map(trait => (
                      <span key={trait} className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-secondary/60 border border-border text-xs font-medium text-foreground">
                        {trait}
                        <button type="button" onClick={() => removeTrait(trait)} className="text-muted-foreground hover:text-destructive cursor-pointer">&times;</button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>

            </div>
          </div>

          <div className="w-full h-px bg-border my-1"></div>

          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-2">
              <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                <Eye className="w-4 h-4 text-brand" /> Physical Appearance
              </label>
              <textarea
                value={appearance}
                onChange={(e) => setAppearance(e.target.value)}
                placeholder="Detail their exact body type, facial features, scars, clothing style, and physical quirks..."
                className="w-full min-h-[120px] bg-secondary/20 border border-border rounded-2xl p-4 text-sm font-serif text-foreground leading-relaxed focus:outline-none focus:border-brand transition-colors resize-y"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                <Brain className="w-4 h-4 text-emerald-500" /> Personality & Flaws
              </label>
              <textarea
                value={personality}
                onChange={(e) => setPersonality(e.target.value)}
                placeholder="Describe their fears, desires, how they speak, and their moral alignment..."
                className="w-full min-h-[120px] bg-secondary/20 border border-border rounded-2xl p-4 text-sm font-serif text-foreground leading-relaxed focus:outline-none focus:border-emerald-500 transition-colors resize-y"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-amber-500" /> Backstory & History
              </label>
              <textarea
                value={history}
                onChange={(e) => setHistory(e.target.value)}
                placeholder="Where did they come from? What past events shaped who they are today?"
                className="w-full min-h-[120px] bg-secondary/20 border border-border rounded-2xl p-4 text-sm font-serif text-foreground leading-relaxed focus:outline-none focus:border-amber-500 transition-colors resize-y"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-4 pt-6 border-t border-border mt-2">
            <Link
              href={backLink}
              className="px-6 py-3 rounded-full text-xs font-bold text-muted-foreground hover:text-foreground transition-colors uppercase tracking-wider"
            >
              Cancel
            </Link>
            <button
              onClick={handleSave}
              disabled={!name || isLoading || isUploading}
              className="flex items-center gap-2 px-8 py-3 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-all font-bold shadow-md active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wider text-xs cursor-pointer"
            >
              {isLoading || isUploading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              <span>{isLoading ? "Saving..." : isUploading ? "Uploading..." : "Save Profile"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
