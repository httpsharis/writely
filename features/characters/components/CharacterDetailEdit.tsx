import {
  User,
  Image as ImageIcon,
  Book,
  Eye,
  Brain,
  BookOpen,
  Loader2,
  Save,
  Upload,
} from "lucide-react";
import Image from "next/image";
import { getAvatarUrl } from "@/lib/cloudinary";

interface CharacterDetailEditProps {
  name: string;
  setName: (name: string) => void;
  role: string;
  setRole: (role: string) => void;
  avatarUrl: string;
  setAvatarUrl: (url: string) => void;
  appearance: string;
  setAppearance: (val: string) => void;
  personality: string;
  setPersonality: (val: string) => void;
  history: string;
  setHistory: (val: string) => void;
  traitsInput: string;
  setTraitsInput: (val: string) => void;
  traits: string[];
  handleAddTrait: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  removeTrait: (trait: string) => void;
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  selectedNovelId: string;
  setSelectedNovelId: (id: string) => void;
  novels: { _id: string; title: string }[];
  isLoading: boolean;
  handleSave: () => void;
  setIsEditing: (val: boolean) => void;
}

/**
 * Renders the form for editing Character Details.
 */
export function CharacterDetailEdit({
  name, setName,
  role, setRole,
  avatarUrl, setAvatarUrl,
  appearance, setAppearance,
  personality, setPersonality,
  history, setHistory,
  traitsInput, setTraitsInput,
  traits,
  handleAddTrait, removeTrait,
  handleImageUpload,
  selectedNovelId, setSelectedNovelId,
  novels,
  isLoading,
  handleSave,
  setIsEditing
}: CharacterDetailEditProps) {
  return (
    <div className="flex flex-col gap-12 sm:gap-16 mt-8 px-2 relative z-10">
      
      {/* Top Section: Avatar & Basic Info */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left: Avatar Upload */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
            <ImageIcon className="w-3.5 h-3.5 text-brand" /> Portrait Profile
          </label>

          <div className="relative w-full aspect-[3/4] rounded-2xl bg-secondary/20 border border-border flex items-center justify-center overflow-hidden shadow-inner">
            {avatarUrl ? (
              <Image
                src={getAvatarUrl(avatarUrl, 600)}
                alt="Preview"
                fill
                sizes="(max-width: 1024px) 100vw, 33vw"
                className="object-cover object-top"
              />
            ) : (
              <div className="flex flex-col items-center gap-3 text-muted-foreground p-4 text-center opacity-70">
                <User className="w-10 h-10 opacity-50" />
                <span className="text-[10px] font-bold uppercase tracking-widest">
                  No Image
                </span>
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <label className="flex-1 cursor-pointer bg-secondary/30 border border-border rounded-xl px-4 py-3 flex items-center justify-center gap-2 text-[12px] font-bold text-foreground hover:bg-secondary/60 hover:border-brand/40 transition-all group">
              <Upload className="w-4 h-4 text-muted-foreground group-hover:text-brand transition-colors" />
              <span className="uppercase tracking-wider text-[11px]">Upload Image</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>
            {avatarUrl && (
              <button
                type="button"
                onClick={() => setAvatarUrl("")}
                className="px-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-[11px] font-bold uppercase tracking-wider hover:bg-destructive/20 transition-all cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Right: Identity details */}
        <div className="lg:col-span-8 flex flex-col gap-6 w-full">
          
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
                      ? "bg-brand/15 border-brand text-brand shadow-sm"
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
              {traits.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {traits.map(trait => (
                    <span key={trait} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-brand/10 border border-brand/20 text-xs font-medium text-brand">
                      {trait}
                      <button type="button" onClick={() => removeTrait(trait)} className="text-brand hover:text-destructive transition-colors ml-1 cursor-pointer">&times;</button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* Divider */}
      <div className="w-full h-px bg-border"></div>

      {/* Bottom Section: Bio Details */}
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

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-4 pt-6 border-t border-border mt-2">
        <button
          type="button"
          onClick={() => setIsEditing(false)}
          className="px-6 py-3 rounded-full text-xs font-bold text-muted-foreground hover:text-foreground transition-colors uppercase tracking-wider cursor-pointer"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleSave}
          disabled={!name || isLoading}
          className="flex items-center gap-2 px-8 py-3 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-all font-bold shadow-md active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wider text-xs cursor-pointer"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          <span>{isLoading ? "Saving..." : "Save Profile"}</span>
        </button>
      </div>

    </div>
  );
}
