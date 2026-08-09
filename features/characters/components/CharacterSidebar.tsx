import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { 
  useGetCharacterByIdQuery, 
  useUpdateCharacterMutation,
  useCreateCharacterMutation 
} from "@/redux/features/characters/characterApi";
import { useGetDocumentsQuery } from "@/redux/features/documents/documentApi";

import { CharacterDetailView } from "./CharacterDetailView";
import { CharacterDetailEdit } from "./CharacterDetailEdit";

interface CharacterSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
  characterId: string | null; // null means create mode
}

export function CharacterSidebar({ isOpen, onClose, projectId, characterId }: CharacterSidebarProps) {
  // Queries
  const { data, isLoading: isFetching } = useGetCharacterByIdQuery(characterId as string, {
    skip: !characterId,
  });
  const [updateCharacter, { isLoading: isUpdating }] = useUpdateCharacterMutation();
  const [createCharacter, { isLoading: isCreating }] = useCreateCharacterMutation();

  const { data: novelsData } = useGetDocumentsQuery({ type: "novel" });
  const novels = novelsData?.documents || [];

  const isSaving = isUpdating || isCreating;

  // Local State
  const [isEditing, setIsEditing] = useState(!characterId);
  
  const [name, setName] = useState("");
  const [role, setRole] = useState("supporting");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [appearance, setAppearance] = useState("");
  const [personality, setPersonality] = useState("");
  const [history, setHistory] = useState("");
  const [traitsInput, setTraitsInput] = useState("");
  const [traits, setTraits] = useState<string[]>([]);
  const [selectedNovelId, setSelectedNovelId] = useState(projectId);

  // Reset or Populate state when characterId or data changes
  useEffect(() => {
    if (isOpen) {
      if (!characterId) {
        // Create Mode
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setIsEditing(true);
        setName("");
        setRole("supporting");
        setAvatarUrl("");
        setAppearance("");
        setPersonality("");
        setHistory("");
        setTraits([]);
        setSelectedNovelId(projectId);
      } else if (data?.character) {
        // View/Edit Mode
        setIsEditing(false);
        const char = data.character;
        setName(char.name || "");
        setRole(char.role || "supporting");
        setAvatarUrl(char.avatarUrl || "");
        setTraits(char.traits || []);
        
        if (char.novelId && typeof char.novelId === "object") {
          setSelectedNovelId(char.novelId._id);
        } else {
          setSelectedNovelId((char.novelId as string) || projectId);
        }
        
        if (char.bio) {
          const appearanceMatch = char.bio.match(/\*\*Physical Appearance & Body\*\*\n([\s\S]*?)(?=\*\*Personality & Flaws\*\*|$)/);
          const personalityMatch = char.bio.match(/\*\*Personality & Flaws\*\*\n([\s\S]*?)(?=\*\*Backstory & History\*\*|$)/);
          const historyMatch = char.bio.match(/\*\*Backstory & History\*\*\n([\s\S]*?)$/);

          if (appearanceMatch || personalityMatch || historyMatch) {
            setAppearance(appearanceMatch ? appearanceMatch[1].trim() : "");
            setPersonality(personalityMatch ? personalityMatch[1].trim() : "");
            setHistory(historyMatch ? historyMatch[1].trim() : "");
          } else {
            setHistory(char.bio);
          }
        } else {
          setAppearance("");
          setPersonality("");
          setHistory("");
        }
      }
    }
  }, [isOpen, characterId, data, projectId]);

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

    const compiledBio = `**Physical Appearance & Body**\n${appearance || "No appearance defined."}\n\n**Personality & Flaws**\n${personality || "No personality defined."}\n\n**Backstory & History**\n${history || "No history defined."}`.trim();

    try {
      if (characterId) {
        // Update
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
        setIsEditing(false);
      } else {
        // Create
        const targetNovelId = selectedNovelId === "global" ? "global" : selectedNovelId;
        await createCharacter({
          novelId: targetNovelId,
          data: {
            name,
            role,
            avatarUrl,
            bio: compiledBio,
            traits,
            novelId: targetNovelId === "global" ? null : targetNovelId,
          }
        }).unwrap();
        onClose(); // Close sidebar on successful creation
      }
    } catch (err: unknown) {
      console.error("Failed to save character", err);
      alert("Failed to save character. Please try again.");
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent side="right" className="w-[90vw] sm:max-w-2xl bg-[#131217] border-l border-white/10 overflow-y-auto p-0">
        <div className="flex flex-col min-h-full">
          
          <SheetHeader className="p-6 md:p-10 border-b border-white/5 shrink-0 bg-[#17161b]">
            <SheetTitle className="text-2xl font-serif text-[#ede9e2]">
              {characterId ? (isEditing ? "Edit Character" : name) : "New Character"}
            </SheetTitle>
            <SheetDescription className="text-[#948fa0] text-sm">
              {characterId && !isEditing 
                ? "View the complete dossier."
                : "Fill out the details to build the profile."
              }
            </SheetDescription>
            
            {characterId && !isEditing && (
              <div className="absolute top-8 right-16">
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-1.5 rounded-full bg-[#c9975a]/10 text-[#c9975a] hover:bg-[#c9975a] hover:text-black transition-colors text-xs font-bold uppercase tracking-wider"
                >
                  Edit
                </button>
              </div>
            )}
          </SheetHeader>

          <div className="flex-1 p-6 md:p-10 pb-32">
            {isFetching ? (
              <div className="flex h-40 w-full items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-[#c9975a]" />
              </div>
            ) : (
              <>
                {isEditing ? (
                  <CharacterDetailEdit 
                    name={name} setName={setName}
                    role={role} setRole={setRole}
                    avatarUrl={avatarUrl} setAvatarUrl={setAvatarUrl}
                    appearance={appearance} setAppearance={setAppearance}
                    personality={personality} setPersonality={setPersonality}
                    history={history} setHistory={setHistory}
                    traitsInput={traitsInput} setTraitsInput={setTraitsInput}
                    traits={traits}
                    handleAddTrait={handleAddTrait} removeTrait={removeTrait}
                    handleImageUpload={handleImageUpload}
                    selectedNovelId={selectedNovelId} setSelectedNovelId={setSelectedNovelId}
                    novels={novels}
                    isLoading={isSaving}
                    handleSave={handleSave}
                    setIsEditing={(val) => {
                      if (!characterId) onClose();
                      else setIsEditing(val);
                    }}
                  />
                ) : (
                  <CharacterDetailView 
                    avatarUrl={avatarUrl}
                    name={name}
                    traits={traits}
                    appearance={appearance}
                    personality={personality}
                    history={history}
                  />
                )}
              </>
            )}
          </div>
          
        </div>
      </SheetContent>
    </Sheet>
  );
}
