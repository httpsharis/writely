import { useState, useRef, useEffect } from "react";

interface EditorTitleInputProps {
  initialTitle: string;
  onAutoSave: (title: string) => void;
}

export default function EditorTitleInput({ initialTitle, onAutoSave }: EditorTitleInputProps) {
  const [title, setTitle] = useState(initialTitle);
  // 👇 Add `null` inside the parentheses and handle null type explicitly
  const debounceRef = useRef<NodeJS.Timeout | null>(null); 

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