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
import { useCreateCharacterMutation } from "@/redux/features/characters/characterApi";
import { useGetDocumentsQuery } from "@/redux/features/documents/documentApi";

export default function NewCharacterPage() {
  const router = useRouter();
  const params = useParams();
  const projectId = (params.projectId || params.id) as string;

  const { data: novelsData } = useGetDocumentsQuery({ type: "novel" });
  const novels = novelsData?.documents || [];

  const [createCharacter, { isLoading }] = useCreateCharacterMutation();

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

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert("Image size should be less than 2MB");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    if (!name.trim()) {
      alert("Please enter a character designation (name).");
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
        novelId: selectedNovelId,
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

      router.push(projectId ? `/project/${projectId}/characters` : `/characters`);
    } catch (err: unknown) {
      console.error("Failed to create character", err);
      alert("Failed to save character. Please try again.");
    }
  };

  const backLink = projectId ? `/project/${projectId}/characters` : `/characters`;

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
        </div>

        <div className="bg-[#1b1a21] border border-[rgba(255,255,255,0.07)] rounded-[32px] p-8 md:p-12 flex flex-col gap-12 shadow-2xl">
          
          <div className="flex flex-col gap-3">
            <h1 className="font-serif text-[44px] font-medium text-[#ede9e2] tracking-tight flex items-center gap-3 leading-none">
              Draft Character
              <Sparkles className="w-8 h-8 text-[#c9975a]" />
            </h1>
            <p className="text-[14px] text-[#948fa0] font-medium">
              Establish the core identity, roles, and narrative traits.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-start">
            
            <div className="md:col-span-4 flex flex-col gap-4">
              <label className="text-[10px] font-bold text-[#5c5868] uppercase tracking-widest flex items-center gap-2">
                <ImageIcon className="w-3 h-3" /> Portrait Profile
              </label>

              <div className="w-full aspect-[3/4] rounded-2xl bg-[#29272f] border border-[rgba(255,255,255,0.07)] flex items-center justify-center overflow-hidden relative">
                {avatarUrl ? (
                  <Image
                    src={avatarUrl}
                    alt="Preview"
                    fill
                    className="object-cover object-top"
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

              <div className="flex gap-2">
                <label className="flex-1 cursor-pointer bg-[#131217] border border-[rgba(255,255,255,0.07)] rounded-xl px-4 py-3 flex items-center justify-center gap-2 text-[13px] font-bold text-[#ede9e2] hover:bg-[#29272f] hover:border-[#c9975a] transition-all group">
                  <Upload className="w-4 h-4 text-[#5c5868] group-hover:text-[#c9975a] transition-colors" />
                  <span>Upload Image</span>
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
                    className="px-4 rounded-xl bg-red-400/10 text-red-400 text-[12px] font-bold hover:bg-red-400/20 transition-colors"
                  >
                    Remove
                  </button>
                )}
              </div>
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

          <div className="w-full h-px bg-[rgba(255,255,255,0.07)] my-2"></div>

          <div className="flex flex-col gap-10">
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

          <div className="flex items-center justify-end gap-4 pt-6 border-t border-[rgba(255,255,255,0.07)] mt-4">
            <Link
              href={backLink}
              className="px-6 py-3.5 rounded-full text-[13px] font-bold text-[#5c5868] hover:text-[#ede9e2] transition-colors uppercase tracking-wider"
            >
              Cancel
            </Link>
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
        </div>
      </div>
    </div>
  );
}
