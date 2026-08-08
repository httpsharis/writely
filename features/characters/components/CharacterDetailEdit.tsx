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
  setTraits: (traits: string[]) => void;
  handleAddTrait: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  removeTrait: (trait: string) => void;
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  selectedNovelId: string;
  setSelectedNovelId: (id: string) => void;
  novels: any[];
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
  traits, setTraits,
  handleAddTrait, removeTrait,
  handleImageUpload,
  selectedNovelId, setSelectedNovelId,
  novels,
  isLoading,
  handleSave,
  setIsEditing
}: CharacterDetailEditProps) {
  return (
    <div className="flex flex-col gap-16 mt-10 px-2 relative z-10">
      
      {/* Top Section: Avatar & Basic Info */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left: Avatar Upload */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          <label className="text-[10px] font-bold text-[#5c5868] uppercase tracking-widest flex items-center gap-2">
            <ImageIcon className="w-3 h-3" /> Portrait Profile
          </label>

          <div className="w-full aspect-[3/4] rounded-2xl bg-[#17161b] border border-[rgba(255,255,255,0.05)] flex items-center justify-center overflow-hidden relative shadow-inner">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt="Preview"
                className="w-full h-full object-cover object-top"
              />
            ) : (
              <div className="flex flex-col items-center gap-3 text-[#5c5868] p-4 text-center opacity-70">
                <User className="w-10 h-10" />
                <span className="text-[10px] font-bold uppercase tracking-widest">
                  No Image
                </span>
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <label className="flex-1 cursor-pointer bg-[#17161b] border border-[rgba(255,255,255,0.05)] rounded-xl px-4 py-3 flex items-center justify-center gap-2 text-[12px] font-bold text-[#ede9e2] hover:bg-[#201f25] hover:border-[#c9975a] transition-all group">
              <Upload className="w-4 h-4 text-[#5c5868] group-hover:text-[#c9975a] transition-colors" />
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
                onClick={() => setAvatarUrl("")}
                className="px-4 rounded-xl bg-red-400/5 border border-red-400/10 text-red-400 text-[11px] font-bold uppercase tracking-wider hover:bg-red-400/15 hover:border-red-400/20 transition-all"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Right: Identity details */}
        <div className="lg:col-span-8 flex flex-col gap-8 w-full mt-2">
          
          <div className="flex flex-col gap-3">
            <label className="text-[10px] font-bold text-[#5c5868] uppercase tracking-widest">
              Designation <span className="text-[#c9975a]">*</span>
            </label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#5c5868]" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Character Name"
                className="w-full bg-[#17161b] border border-[rgba(255,255,255,0.05)] rounded-xl pl-12 pr-4 py-4 text-[18px] text-[#ede9e2] font-serif focus:outline-none focus:border-[#c9975a] transition-colors shadow-inner"
              />
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <label className="text-[10px] font-bold text-[#5c5868] uppercase tracking-widest">
              Assigned Novel
            </label>
            <div className="relative">
              <Book className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#5c5868]" />
              <select
                value={selectedNovelId}
                onChange={(e) => setSelectedNovelId(e.target.value)}
                className="w-full bg-[#17161b] border border-[rgba(255,255,255,0.05)] rounded-xl pl-12 pr-4 py-3.5 text-[14px] text-[#ede9e2] focus:outline-none focus:border-[#c9975a] transition-colors appearance-none cursor-pointer shadow-inner"
              >
                <option value="global">Global Cast (Not attached to a novel)</option>
                {novels.map(novel => (
                  <option key={novel._id} value={novel._id}>{novel.title}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <label className="text-[10px] font-bold text-[#5c5868] uppercase tracking-widest">
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
                  onClick={() => setRole(r.id)}
                  className={`px-4 py-2.5 rounded-xl text-[11px] font-bold tracking-wider uppercase transition-all border flex-1 min-w-[120px] ${
                    role === r.id
                      ? "bg-[rgba(201,151,90,0.1)] border-[#c9975a] text-[#c9975a] shadow-sm"
                      : "bg-[#17161b] border-[rgba(255,255,255,0.03)] text-[#5c5868] hover:border-[rgba(255,255,255,0.1)] hover:text-[#ede9e2]"
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <label className="text-[10px] font-bold text-[#5c5868] uppercase tracking-widest">
              Traits (Press Enter)
            </label>
            <div className="flex flex-col gap-2">
              <input
                type="text"
                value={traitsInput}
                onChange={(e) => setTraitsInput(e.target.value)}
                onKeyDown={handleAddTrait}
                placeholder="e.g. Stubborn, Brilliant..."
                className="w-full bg-[#17161b] border border-[rgba(255,255,255,0.05)] rounded-xl px-4 py-3.5 text-[14px] text-[#ede9e2] focus:outline-none focus:border-[#c9975a] transition-colors shadow-inner"
              />
              {traits.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {traits.map(trait => (
                    <span key={trait} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[rgba(201,151,90,0.08)] border border-[rgba(201,151,90,0.2)] text-[11px] font-bold tracking-wide text-[#c9975a]">
                      {trait}
                      <button onClick={() => removeTrait(trait)} className="text-[#c9975a] hover:text-red-400 transition-colors ml-1">&times;</button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* Divider */}
      <div className="w-full h-px bg-[rgba(255,255,255,0.03)]"></div>

      {/* Bottom Section: Bio Details */}
      <div className="flex flex-col gap-12">
        <div className="flex flex-col gap-4">
          <label className="text-[11px] font-bold text-[#5c5868] uppercase tracking-widest flex items-center gap-2">
            <Eye className="w-4 h-4 text-[#c9975a]" /> Physical Appearance
          </label>
          <textarea
            value={appearance}
            onChange={(e) => setAppearance(e.target.value)}
            placeholder="Detail their exact body type, facial features, scars, clothing style, and physical quirks..."
            className="w-full min-h-[140px] bg-[#17161b] border border-[rgba(255,255,255,0.03)] rounded-2xl p-6 text-[16px] font-serif italic text-[#ede9e2]/80 leading-[1.8] focus:outline-none focus:border-[#c9975a] transition-colors resize-y shadow-inner"
          />
        </div>

        <div className="flex flex-col gap-4">
          <label className="text-[11px] font-bold text-[#5c5868] uppercase tracking-widest flex items-center gap-2">
            <Brain className="w-4 h-4 text-[#7cbf8e]" /> Personality & Flaws
          </label>
          <textarea
            value={personality}
            onChange={(e) => setPersonality(e.target.value)}
            placeholder="Describe their fears, desires, how they speak, and their moral alignment..."
            className="w-full min-h-[140px] bg-[#17161b] border border-[rgba(255,255,255,0.03)] rounded-2xl p-6 text-[16px] font-serif italic text-[#ede9e2]/80 leading-[1.8] focus:outline-none focus:border-[#7cbf8e] transition-colors resize-y shadow-inner"
          />
        </div>

        <div className="flex flex-col gap-4">
          <label className="text-[11px] font-bold text-[#5c5868] uppercase tracking-widest flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-[#e07a5f]" /> Backstory & History
          </label>
          <textarea
            value={history}
            onChange={(e) => setHistory(e.target.value)}
            placeholder="Where did they come from? What past events shaped who they are today?"
            className="w-full min-h-[140px] bg-[#17161b] border border-[rgba(255,255,255,0.03)] rounded-2xl p-6 text-[16px] font-serif italic text-[#ede9e2]/80 leading-[1.8] focus:outline-none focus:border-[#e07a5f] transition-colors resize-y shadow-inner"
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-4 pt-8 border-t border-[rgba(255,255,255,0.03)] mt-2">
        <button
          onClick={() => setIsEditing(false)}
          className="px-6 py-3.5 rounded-full text-[12px] font-bold text-[#5c5868] hover:text-[#ede9e2] hover:bg-[rgba(255,255,255,0.03)] transition-colors uppercase tracking-wider"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          disabled={!name || isLoading}
          className="flex items-center gap-2.5 px-8 py-3.5 rounded-full bg-[#c9975a] text-[#131217] hover:bg-[#d8a86c] transition-all font-bold shadow-[0_0_15px_rgba(201,151,90,0.3)] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wider text-[11px]"
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
