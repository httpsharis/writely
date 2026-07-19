"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
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
  Pencil,
  X,
} from "lucide-react";
import { useUpdateCharacterMutation, useGetCharacterByIdQuery } from "@/redux/features/characters/characterApi";
import { useGetDocumentsQuery } from "@/redux/features/documents/documentApi";

export default function CharacterDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const projectId = params.projectId as string | undefined;
  const characterId = params.id as string;

  const { data, isLoading: isFetching } = useGetCharacterByIdQuery(characterId);
  const [updateCharacter, { isLoading }] = useUpdateCharacterMutation();

  const { data: novelsData } = useGetDocumentsQuery({ type: "novel" });
  const novels = novelsData?.documents || [];

  const [isEditing, setIsEditing] = useState(false);

  const [selectedNovelId, setSelectedNovelId] = useState(projectId || "global");

  const [name, setName] = useState("");
  const [role, setRole] = useState("supporting");
  const [avatarUrl, setAvatarUrl] = useState("");

  const [appearance, setAppearance] = useState("");
  const [personality, setPersonality] = useState("");
  const [history, setHistory] = useState("");
  
  const [traitsInput, setTraitsInput] = useState("");
  const [traits, setTraits] = useState<string[]>([]);

  useEffect(() => {
    if (data?.character) {
      const char = data.character;
      setName(char.name || "");
      setRole(char.role || "supporting");
      setAvatarUrl(char.avatarUrl || "");
      setTraits(char.traits || []);
      setSelectedNovelId(char.novelId || "global");
      
      if (char.bio) {
        // Attempt to parse out the bio sections if they exist
        const appearanceMatch = char.bio.match(/\*\*Physical Appearance & Body\*\*\n([\s\S]*?)(?=\*\*Personality & Flaws\*\*|$)/);
        const personalityMatch = char.bio.match(/\*\*Personality & Flaws\*\*\n([\s\S]*?)(?=\*\*Backstory & History\*\*|$)/);
        const historyMatch = char.bio.match(/\*\*Backstory & History\*\*\n([\s\S]*?)$/);

        if (appearanceMatch || personalityMatch || historyMatch) {
          setAppearance(appearanceMatch ? appearanceMatch[1].trim() : "");
          setPersonality(personalityMatch ? personalityMatch[1].trim() : "");
          setHistory(historyMatch ? historyMatch[1].trim() : "");
        } else {
          // Fallback if bio isn't structured
          setHistory(char.bio);
        }
      }
    }
  }, [data]);

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

  const handleSave = async () => {
    if (!name.trim()) {
      alert("Please enter a character designation (name).");
      return;
    }

    const compiledBio = `**Physical Appearance & Body**\n${appearance || "No appearance defined."}\n\n**Personality & Flaws**\n${personality || "No personality defined."}\n\n**Backstory & History**\n${history || "No history defined."}`.trim();

    try {
      await updateCharacter({
        characterId,
        data: {
          name,
          role,
          avatarUrl,
          bio: compiledBio,
          traits,
          novelId: selectedNovelId === "global" ? null : selectedNovelId,
        },
      }).unwrap();

      setIsEditing(false); // Switch back to view mode on success
    } catch (err: unknown) {
      console.error("Failed to update character", err);
      alert("Failed to save character. Please try again.");
    }
  };

  const backLink = projectId ? `/project/${projectId}/characters` : `/characters`;

  if (isFetching) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[#131217]">
        <Loader2 className="w-8 h-8 animate-spin text-[#c9975a]" />
      </div>
    );
  }

  const assignedNovel = novels.find(n => n._id === selectedNovelId);

  return (
    <div className="min-h-screen w-full overflow-y-auto bg-[#131217] text-[#ede9e2] px-8 py-12 pb-32 no-scrollbar font-sans">
      <div className="max-w-[800px] mx-auto flex flex-col w-full h-full gap-8">
        
        <div className="flex items-center justify-between shrink-0 mb-4">
          <Link
            href={backLink}
            className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-[#5c5868] hover:text-[#ede9e2] transition-colors w-fit group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Roster
          </Link>

          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[rgba(255,255,255,0.05)] text-[#ede9e2] hover:bg-[rgba(255,255,255,0.1)] transition-colors text-[11px] font-bold uppercase tracking-widest border border-[rgba(255,255,255,0.1)]"
            >
              <Pencil className="w-3.5 h-3.5" />
              Edit Mode
            </button>
          )}
        </div>

        <div className="bg-[#1b1a21] border border-[rgba(255,255,255,0.07)] rounded-[32px] p-8 md:p-12 flex flex-col gap-12 shadow-2xl relative overflow-hidden">
          
          {/* Header Area */}
          <div className="flex flex-col gap-3 relative z-10">
            <h1 className="font-serif text-[44px] font-medium text-[#ede9e2] tracking-tight flex items-center gap-3 leading-none">
              {isEditing ? "Edit Character" : name || "Unnamed Character"}
              {isEditing && <Sparkles className="w-8 h-8 text-[#c9975a]" />}
            </h1>
            <p className="text-[14px] text-[#948fa0] font-medium flex items-center gap-2">
              {isEditing ? "Update the core identity, roles, and narrative traits." : (
                <span className="capitalize text-[#c9975a] font-bold tracking-wider">{role} Character</span>
              )}
              {!isEditing && assignedNovel && (
                 <span className="flex items-center gap-1.5 opacity-60">
                   <span className="w-1 h-1 rounded-full bg-current" />
                   <Book className="w-3.5 h-3.5" />
                   {assignedNovel.title}
                 </span>
              )}
            </p>
          </div>

          {/* Body content switches based on isEditing */}
          {isEditing ? (
            // ==========================================
            // EDIT MODE
            // ==========================================
            <>
              <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-start relative z-10">
                <div className="md:col-span-4 flex flex-col gap-4">
                  <label className="text-[10px] font-bold text-[#5c5868] uppercase tracking-widest flex items-center gap-2">
                    <ImageIcon className="w-3 h-3" /> Portrait Profile
                  </label>

                  <div className="w-full aspect-[3/4] rounded-2xl bg-[#29272f] border border-[rgba(255,255,255,0.07)] flex items-center justify-center overflow-hidden relative">
                    {avatarUrl ? (
                      <img
                        src={avatarUrl}
                        alt="Preview"
                        className="w-full h-full object-cover object-top"
                      />
                    ) : (
                      <div className="flex flex-col items-center gap-3 text-[#5c5868] p-4 text-center">
                        <User className="w-12 h-12" />
                        <span className="text-[10px] font-bold uppercase tracking-widest">
                          No Image
                        </span>
                      </div>
                    )}
                  </div>

                  <input
                    type="text"
                    value={avatarUrl}
                    onChange={(e) => setAvatarUrl(e.target.value)}
                    placeholder="Paste Image URL..."
                    className="w-full bg-[#131217] border border-[rgba(255,255,255,0.07)] rounded-xl px-4 py-3 text-[13px] text-[#ede9e2] focus:outline-none focus:border-[#c9975a] transition-colors"
                  />
                </div>

                <div className="md:col-span-8 flex flex-col gap-8 w-full mt-2">
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
                        className="w-full bg-[#131217] border border-[rgba(255,255,255,0.07)] rounded-xl pl-12 pr-4 py-4 text-[18px] text-[#ede9e2] font-serif focus:outline-none focus:border-[#c9975a] transition-colors"
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
                        className="w-full bg-[#131217] border border-[rgba(255,255,255,0.07)] rounded-xl pl-12 pr-4 py-3.5 text-[14px] text-[#ede9e2] focus:outline-none focus:border-[#c9975a] transition-colors appearance-none cursor-pointer"
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
                              ? "bg-[rgba(201,151,90,0.1)] border-[#c9975a] text-[#c9975a]"
                              : "bg-[#131217] border-[rgba(255,255,255,0.07)] text-[#5c5868] hover:border-[rgba(255,255,255,0.15)] hover:text-[#ede9e2]"
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
                        className="w-full bg-[#131217] border border-[rgba(255,255,255,0.07)] rounded-xl px-4 py-3 text-[13px] text-[#ede9e2] focus:outline-none focus:border-[#c9975a] transition-colors"
                      />
                      <div className="flex flex-wrap gap-2 mt-1">
                        {traits.map(trait => (
                          <span key={trait} className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#29272f] border border-[rgba(255,255,255,0.05)] text-[11px] font-medium text-[#ede9e2]">
                            {trait}
                            <button onClick={() => removeTrait(trait)} className="text-[#5c5868] hover:text-red-400">&times;</button>
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="w-full h-px bg-[rgba(255,255,255,0.07)] my-2 relative z-10"></div>

              <div className="flex flex-col gap-10 relative z-10">
                <div className="flex flex-col gap-4">
                  <label className="text-[11px] font-bold text-[#5c5868] uppercase tracking-widest flex items-center gap-2">
                    <Eye className="w-4 h-4 text-[#c9975a]" /> Physical Appearance
                  </label>
                  <textarea
                    value={appearance}
                    onChange={(e) => setAppearance(e.target.value)}
                    placeholder="Detail their exact body type, facial features, scars, clothing style, and physical quirks..."
                    className="w-full min-h-[140px] bg-[#131217] border border-[rgba(255,255,255,0.07)] rounded-2xl p-5 text-[15px] font-serif italic text-[#948fa0] leading-relaxed focus:outline-none focus:border-[#c9975a] transition-colors resize-y"
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
                    className="w-full min-h-[140px] bg-[#131217] border border-[rgba(255,255,255,0.07)] rounded-2xl p-5 text-[15px] font-serif italic text-[#948fa0] leading-relaxed focus:outline-none focus:border-[#7cbf8e] transition-colors resize-y"
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
                    className="w-full min-h-[140px] bg-[#131217] border border-[rgba(255,255,255,0.07)] rounded-2xl p-5 text-[15px] font-serif italic text-[#948fa0] leading-relaxed focus:outline-none focus:border-[#e07a5f] transition-colors resize-y"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-4 pt-6 border-t border-[rgba(255,255,255,0.07)] mt-4 relative z-10">
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-6 py-3.5 rounded-full text-[13px] font-bold text-[#5c5868] hover:text-[#ede9e2] transition-colors uppercase tracking-wider"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={!name || isLoading}
                  className="flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#c9975a] text-[#131217] hover:bg-[#d8a86c] transition-all font-bold shadow-[0_0_15px_rgba(201,151,90,0.3)] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wider text-[12px]"
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  <span>{isLoading ? "Saving..." : "Save Profile"}</span>
                </button>
              </div>
            </>
          ) : (
            // ==========================================
            // VIEW MODE
            // ==========================================
            <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-start relative z-10 mt-4">
              
              {/* Left Column: Portrait and Traits */}
              <div className="md:col-span-4 flex flex-col gap-8">
                {avatarUrl ? (
                  <div className="w-full aspect-[3/4] rounded-2xl border border-[rgba(255,255,255,0.07)] overflow-hidden shadow-xl">
                    <img
                      src={avatarUrl}
                      alt={name}
                      className="w-full h-full object-cover object-top"
                    />
                  </div>
                ) : (
                  <div className="w-full aspect-[3/4] rounded-2xl bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.07)] flex flex-col items-center justify-center text-[#5c5868] gap-3">
                    <User className="w-12 h-12" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">No Portrait</span>
                  </div>
                )}

                {traits.length > 0 && (
                  <div className="flex flex-col gap-4">
                    <span className="text-[10px] font-bold text-[#5c5868] uppercase tracking-widest">Core Traits</span>
                    <div className="flex flex-wrap gap-2">
                      {traits.map(trait => (
                        <span key={trait} className="px-3 py-1.5 rounded-lg bg-[rgba(201,151,90,0.08)] border border-[rgba(201,151,90,0.3)] text-[12px] font-medium text-[#c9975a]">
                          {trait}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column: Bio Details */}
              <div className="md:col-span-8 flex flex-col gap-10">
                {/* Physical Appearance */}
                <div className="flex flex-col gap-3">
                  <h3 className="text-[12px] font-bold text-[#5c5868] uppercase tracking-widest flex items-center gap-2 border-b border-[rgba(255,255,255,0.07)] pb-2">
                    <Eye className="w-4 h-4 text-[#c9975a]" /> Physical Appearance
                  </h3>
                  <p className="font-serif text-[17px] leading-[1.75] text-[#ede9e2] whitespace-pre-wrap">
                    {appearance || <span className="italic text-[#5c5868]">No physical appearance documented.</span>}
                  </p>
                </div>

                {/* Personality & Flaws */}
                <div className="flex flex-col gap-3">
                  <h3 className="text-[12px] font-bold text-[#5c5868] uppercase tracking-widest flex items-center gap-2 border-b border-[rgba(255,255,255,0.07)] pb-2">
                    <Brain className="w-4 h-4 text-[#7cbf8e]" /> Personality & Flaws
                  </h3>
                  <p className="font-serif text-[17px] leading-[1.75] text-[#ede9e2] whitespace-pre-wrap">
                    {personality || <span className="italic text-[#5c5868]">No personality documented.</span>}
                  </p>
                </div>

                {/* Backstory & History */}
                <div className="flex flex-col gap-3">
                  <h3 className="text-[12px] font-bold text-[#5c5868] uppercase tracking-widest flex items-center gap-2 border-b border-[rgba(255,255,255,0.07)] pb-2">
                    <BookOpen className="w-4 h-4 text-[#e07a5f]" /> Backstory & History
                  </h3>
                  <p className="font-serif text-[17px] leading-[1.75] text-[#ede9e2] whitespace-pre-wrap">
                    {history || <span className="italic text-[#5c5868]">No history documented.</span>}
                  </p>
                </div>
              </div>

            </div>
          )}
        </div>
      </div>
    </div>
  );
}
