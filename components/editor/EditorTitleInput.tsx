"use client";

import { useState, useRef, useEffect } from "react";

interface EditorTitleInputProps {
  initialTitle: string;
  onAutoSave: (title: string) => void;
}

export default function EditorTitleInput({ initialTitle, onAutoSave }: EditorTitleInputProps) {
  const [title, setTitle] = useState(initialTitle);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  // 🟢 THE FIX: Sync local state when the backend finishes loading the real title
  useEffect(() => {
    setTitle(initialTitle);
  }, [initialTitle]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      onAutoSave(newTitle);
    }, 1000);
  };

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  return (
    <input
      type="text"
      value={title}
      onChange={handleChange}
      placeholder="Chapter Title"
      className="w-full bg-transparent text-3xl md:text-5xl font-bold font-serif text-foreground outline-none mb-10 placeholder:text-muted-foreground/30"
    />
  );
}