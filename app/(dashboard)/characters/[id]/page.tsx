"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Loader2 } from "lucide-react";

import { useUpdateCharacterMutation, useGetCharacterByIdQuery } from "@/redux/features/characters/characterApi";
import { useGetDocumentsQuery } from "@/redux/features/documents/documentApi";

import { CharacterDetailHeader } from "@/features/characters/components/CharacterDetailHeader";
import { CharacterDetailView } from "@/features/characters/components/CharacterDetailView";
import { CharacterDetailEdit } from "@/features/characters/components/CharacterDetailEdit";

export default function CharacterDetailsPage() {
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
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setName(char.name || "");
      setRole(char.role || "supporting");
      setAvatarUrl(char.avatarUrl || "");
      setTraits(char.traits || []);
      
      // Handle the populated novelId structure OR string fallback
      if (char.novelId && typeof char.novelId === "object") {
        setSelectedNovelId(char.novelId._id);
      } else {
        setSelectedNovelId((char.novelId as string) || "global");
      }
      
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
    <div className="min-h-screen w-full overflow-y-auto bg-[#131217] text-[#ede9e2] px-8 md:px-12 py-12 pb-32 no-scrollbar font-sans">
      <div className="max-w-[900px] mx-auto flex flex-col w-full h-full gap-8">
        
        {/* Minimalist container */}
        <div className="bg-transparent flex flex-col gap-8 relative overflow-hidden">
          
          <CharacterDetailHeader 
            backLink={backLink}
            isEditing={isEditing}
            setIsEditing={setIsEditing}
            name={name}
            role={role}
            assignedNovel={assignedNovel}
          />

          <div className="w-full h-px bg-[rgba(255,255,255,0.03)] my-2"></div>

          {isEditing ? (
            <CharacterDetailEdit 
              name={name} setName={setName}
              role={role} setRole={setRole}
              avatarUrl={avatarUrl} setAvatarUrl={setAvatarUrl}
              appearance={appearance} setAppearance={setAppearance}
              personality={personality} setPersonality={setPersonality}
              history={history} setHistory={setHistory}
              traitsInput={traitsInput} setTraitsInput={setTraitsInput}
              traits={traits} setTraits={setTraits}
              handleAddTrait={handleAddTrait} removeTrait={removeTrait}
              handleImageUpload={handleImageUpload}
              selectedNovelId={selectedNovelId} setSelectedNovelId={setSelectedNovelId}
              novels={novels}
              isLoading={isLoading}
              handleSave={handleSave}
              setIsEditing={setIsEditing}
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

        </div>
      </div>
    </div>
  );
}
