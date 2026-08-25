"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { 
  ImagePlus, 
  Target, 
  AlignLeft, 
  Tag, 
  Loader2, 
  X, 
  Sparkles, 
  BookOpen, 
  CornerDownLeft,
  Check
} from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import { useCreateDocumentMutation } from "@/redux/features/documents/documentApi";
import { getErrorMessage } from "@/lib/getErrorMessage"; 
import { uploadToCloudinary } from "@/lib/uploadImage";

const GENRE_SUGGESTIONS = [
  "High Fantasy",
  "Sci-Fi",
  "Psychological Thriller",
  "Gothic Horror",
  "Cyberpunk",
  "Romance",
  "Historical Fiction",
  "Mystery",
  "Literary Fiction",
  "Dystopian"
];

const WORD_COUNT_PRESETS = [
  { label: "Short Story", words: 5000, desc: "5k" },
  { label: "Novella", words: 25000, desc: "25k" },
  { label: "Standard Novel", words: 50000, desc: "50k" },
  { label: "Epic Novel", words: 80000, desc: "80k" },
  { label: "Tome", words: 120000, desc: "120k+" },
];

export function NewProjectForm() {
  const router = useRouter();
  const [createDocument, { isLoading: isCreating, error }] = useCreateDocumentMutation();

  const [title, setTitle] = useState("");
  const [tags, setTags] = useState("");
  const [synopsis, setSynopsis] = useState("");
  const [targetWords, setTargetWords] = useState("50000");
  
  // Image Upload State
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle file selection and create a temporary URL for preview
  const processFile = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file (JPEG, PNG, or WebP).");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Cover image is too large. Maximum size is 5MB.");
      return;
    }
    setCoverFile(file);
    setCoverPreview(URL.createObjectURL(file));
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  const handleRemoveImage = (e: React.MouseEvent) => {
    e.stopPropagation(); 
    setCoverFile(null);
    setCoverPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Quick tag toggle
  const toggleGenre = (genre: string) => {
    const currentTags = tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    let nextTags: string[];
    if (currentTags.includes(genre)) {
      nextTags = currentTags.filter((t) => t !== genre);
    } else {
      nextTags = [...currentTags, genre];
    }
    setTags(nextTags.join(", "));
  };

  const handleSubmit = useCallback(async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!title.trim()) {
      toast.error("Please provide a title for your manuscript.");
      return;
    }

    const parsedTarget = targetWords.trim() ? parseInt(targetWords, 10) : undefined;
    const finalTarget = parsedTarget !== undefined && !isNaN(parsedTarget) ? parsedTarget : undefined;

    let uploadedImageUrl: string | undefined = undefined;

    if (coverFile) {
      setIsUploadingImage(true);
      try {
        uploadedImageUrl = await uploadToCloudinary(coverFile);
      } catch (uploadErr) {
        console.error("Cloudinary upload failed:", uploadErr);
        toast.error("Cover image upload failed. Continuing with project creation...");
      } finally {
        setIsUploadingImage(false);
      }
    }

    try {
      const response = await createDocument({
        title: title.trim(),
        type: "novel",
        tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
        targetWords: finalTarget,
        synopsis: synopsis.trim() || undefined,
        coverImage: uploadedImageUrl, 
      }).unwrap();

      toast.success(`"${title.trim()}" created successfully!`);
      const targetId = response.document?._id || response.document?.slug;
      router.push(`/project/${targetId}`);
    } catch (err) {
      console.error("Create document failed:", err);
      const errMsg = getErrorMessage(err) || "Failed to create novel. Please try again.";
      toast.error(errMsg);
    }
  }, [title, targetWords, coverFile, tags, synopsis, createDocument, router]);

  // Keyboard shortcut: Cmd+Enter / Ctrl+Enter to submit
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
        e.preventDefault();
        handleSubmit();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleSubmit]);

  const isLoading = isCreating || isUploadingImage;
  const currentTagsList = tags.split(",").map((t) => t.trim()).filter(Boolean);

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8 md:gap-10">
      {error && (
        <div className="p-4 text-xs font-medium text-rose-500 bg-rose-500/10 rounded-2xl border border-rose-500/20 flex items-center justify-between shadow-sm">
          <span>{getErrorMessage(error)}</span>
        </div>
      )}

      {/* Mobile Top Quick Action Bar (Visible immediately at the top on mobile) */}
      <div className="sm:hidden flex items-center justify-between gap-3 p-3.5 bg-secondary/30 border border-border/80 rounded-2xl">
        <div className="flex flex-col">
          <span className="text-xs font-bold text-foreground">Ready to begin?</span>
          <span className="text-[10px] text-muted-foreground">{title.trim() ? "Tap create to initialize" : "Title required"}</span>
        </div>
        <button
          type="button"
          onClick={() => handleSubmit()}
          disabled={!title.trim() || isLoading}
          className="flex items-center gap-1.5 px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest bg-foreground text-background hover:bg-foreground/90 active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm cursor-pointer"
        >
          {isLoading ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Sparkles className="w-3 h-3 text-brand" />
          )}
          {isLoading ? "Creating..." : "Create"}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-6 lg:gap-14 items-start">
        
        {/* Cover Artwork Column: Compact on mobile, portrait book jacket on desktop */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-brand" /> Cover Artwork
            </label>
            {coverPreview && (
              <span className="text-[10px] text-brand font-bold uppercase tracking-wider">
                Ready
              </span>
            )}
          </div>
          
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleImageChange} 
            accept="image/jpeg, image/png, image/webp" 
            className="hidden" 
          />

          {/* Desktop Portrait Cover Jacket */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`group relative hidden lg:flex w-full aspect-[2/3] mx-auto rounded-2xl border-2 transition-all duration-300 flex-col items-center justify-center overflow-hidden cursor-pointer shadow-md ${
              isDragging
                ? "border-brand bg-brand/10 scale-[1.02]"
                : coverPreview
                  ? "border-border bg-card"
                  : "border-dashed border-border/80 bg-secondary/15 hover:border-brand/60 hover:bg-secondary/25"
            }`}
          >
            {coverPreview ? (
              <>
                <Image 
                  src={coverPreview} 
                  alt="Cover Preview" 
                  fill 
                  className="object-cover transition-transform duration-700 group-hover:scale-105" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-end p-5 text-center">
                  <span className="text-white text-[11px] font-bold uppercase tracking-widest bg-black/60 px-4 py-2 rounded-full backdrop-blur-md border border-white/20">
                    Change Image
                  </span>
                </div>
                <button
                  type="button" 
                  onClick={handleRemoveImage}
                  className="absolute top-3 right-3 p-2 bg-black/70 text-white rounded-full hover:bg-rose-500 transition-colors z-20 backdrop-blur-md cursor-pointer"
                  title="Remove Artwork"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center gap-3 p-6 text-center">
                <div className="p-4 rounded-2xl bg-secondary/40 border border-border/60 group-hover:scale-110 group-hover:bg-secondary transition-all duration-300">
                  <ImagePlus className="w-6 h-6 text-muted-foreground group-hover:text-brand transition-colors stroke-[1.5]" />
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-semibold text-foreground">
                    Upload Jacket Art
                  </span>
                  <span className="text-[11px] text-muted-foreground leading-snug">
                    Drag & drop or tap to browse
                  </span>
                  <span className="text-[10px] text-muted-foreground/70 mt-1 uppercase tracking-wider font-mono">
                    2:3 Portrait • Max 5MB
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Mobile Horizontal Cover Card */}
          <div
            onClick={() => fileInputRef.current?.click()}
            className={`lg:hidden flex items-center gap-4 p-3.5 rounded-2xl border-2 transition-all cursor-pointer shadow-sm ${
              coverPreview
                ? "border-border bg-card"
                : "border-dashed border-border/80 bg-secondary/15 hover:bg-secondary/25"
            }`}
          >
            <div className="relative w-16 h-22 rounded-xl bg-secondary/40 border border-border/60 shrink-0 overflow-hidden flex items-center justify-center">
              {coverPreview ? (
                <Image src={coverPreview} alt="Cover Preview" fill className="object-cover" />
              ) : (
                <ImagePlus className="w-6 h-6 text-brand stroke-[1.5]" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-sm font-semibold text-foreground block truncate">
                {coverPreview ? "Cover Artwork Added" : "Add Cover Artwork"}
              </span>
              <span className="text-xs text-muted-foreground block mt-0.5">
                {coverPreview ? "Tap to change image" : "Optional • 2:3 ratio (Max 5MB)"}
              </span>
            </div>
            {coverPreview && (
              <button
                type="button"
                onClick={handleRemoveImage}
                className="p-2 rounded-full text-muted-foreground hover:text-rose-500 hover:bg-secondary shrink-0 cursor-pointer"
                title="Remove Artwork"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <p className="hidden lg:block text-[11px] text-muted-foreground/70 italic text-left px-1">
            Tip: A portrait cover gives your novel presence in library and reader view.
          </p>
        </div>

        {/* Manuscript Details Column */}
        <div className="flex flex-col gap-6 sm:gap-8">
          
          {/* Manuscript Title */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
                Manuscript Title <span className="text-brand">*</span>
              </label>
              <span className="text-[10px] font-mono text-muted-foreground/60">
                {title.length > 0 ? `${title.length} chars` : "Required"}
              </span>
            </div>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. The Atlas of Forgotten Constellations"
              className="w-full bg-transparent border-b-2 border-border/70 pb-2.5 font-serif text-xl sm:text-3xl lg:text-4xl font-bold text-foreground focus:outline-none focus:border-brand transition-colors placeholder:text-muted-foreground/30 placeholder:font-serif"
              required
              autoFocus
            />
          </div>

          {/* Genre / Tags with Quick Chips */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                <Tag className="w-3.5 h-3.5 text-brand" /> Genre & Themes
              </label>
              <span className="text-[10px] text-muted-foreground/70">
                Click chips to toggle
              </span>
            </div>

            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="Fantasy, Sci-Fi, Gothic, Space Opera"
              className="w-full bg-transparent border-b border-border/70 pb-2 text-sm text-foreground focus:outline-none focus:border-foreground transition-colors placeholder:text-muted-foreground/40"
            />

            {/* Quick Genre Chips */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {GENRE_SUGGESTIONS.map((genre) => {
                const isSelected = currentTagsList.includes(genre);
                return (
                  <button
                    key={genre}
                    type="button"
                    onClick={() => toggleGenre(genre)}
                    className={`text-[11px] font-medium px-2.5 py-1.5 rounded-full transition-all duration-200 cursor-pointer flex items-center gap-1.5 active:scale-95 ${
                      isSelected
                        ? "bg-foreground text-background font-semibold shadow-sm"
                        : "bg-secondary/40 text-muted-foreground hover:bg-secondary hover:text-foreground border border-border/50"
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3 text-brand" />}
                    <span>{genre}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Target Word Count with Presets */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                <Target className="w-3.5 h-3.5 text-brand" /> Target Word Count Goal
              </label>
              <span className="text-[10px] font-mono text-brand font-bold">
                {parseInt(targetWords || "0", 10).toLocaleString()} words
              </span>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
              {WORD_COUNT_PRESETS.map((preset) => {
                const isSelected = targetWords === String(preset.words);
                return (
                  <button
                    key={preset.words}
                    type="button"
                    onClick={() => setTargetWords(String(preset.words))}
                    className={`flex flex-col items-center justify-center p-2 sm:p-2.5 rounded-xl border text-center transition-all cursor-pointer active:scale-95 ${
                      isSelected
                        ? "border-brand bg-brand/10 text-foreground font-bold shadow-sm"
                        : "border-border/60 bg-secondary/20 text-muted-foreground hover:border-border hover:bg-secondary/40 hover:text-foreground"
                    }`}
                  >
                    <span className="text-xs font-mono font-bold text-foreground">
                      {preset.desc}
                    </span>
                    <span className="text-[9px] sm:text-[10px] text-muted-foreground truncate w-full mt-0.5">
                      {preset.label}
                    </span>
                  </button>
                );
              })}
            </div>

            <input
              type="number"
              value={targetWords}
              onChange={(e) => setTargetWords(e.target.value)}
              placeholder="Or enter custom word count goal..."
              className="w-full bg-transparent border-b border-border/70 pb-2 text-sm font-mono text-foreground focus:outline-none focus:border-foreground transition-colors placeholder:text-muted-foreground/40 mt-1"
            />
          </div>

          {/* Synopsis & Premise */}
          <div className="flex flex-col gap-2">
            <label className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
              <AlignLeft className="w-3.5 h-3.5 text-brand" /> Story Premise & Synopsis
            </label>
            <textarea
              value={synopsis}
              onChange={(e) => setSynopsis(e.target.value)}
              placeholder="Set the scene: What is the core conflict, the world rules, or the central inciting incident?..."
              className="w-full bg-secondary/15 border border-border rounded-xl sm:rounded-2xl p-3.5 sm:p-4 font-serif text-sm sm:text-base leading-relaxed text-foreground focus:outline-none focus:border-foreground/80 transition-colors placeholder:text-muted-foreground/40 resize-none h-32 sm:h-40"
            />
          </div>

        </div>
      </div>

      {/* Form Action Footer (Rendered in-flow on both mobile and desktop) */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mt-8 pt-6 border-t border-border">
        <div className="hidden sm:flex items-center gap-2 text-xs text-muted-foreground">
          <span className="flex items-center gap-1 font-mono text-[11px] bg-secondary/50 px-2 py-1 rounded-md border border-border/50">
            <CornerDownLeft className="w-3 h-3" /> ⌘ / Ctrl + Enter
          </span>
          <span>to create manuscript</span>
        </div>

        <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => router.push("/library")}
            disabled={isLoading}
            className="flex-1 sm:flex-initial px-6 py-3.5 sm:py-2.5 rounded-full text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground hover:bg-secondary/40 transition-all disabled:opacity-50 cursor-pointer text-center"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!title.trim() || isLoading}
            className="flex-2 sm:flex-initial flex items-center justify-center gap-2 px-8 py-3.5 sm:py-3 rounded-full text-xs font-bold uppercase tracking-widest bg-foreground text-background hover:bg-foreground/90 active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-md cursor-pointer"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Sparkles className="w-3.5 h-3.5 text-brand" />
            )}
            {isUploadingImage ? "Uploading Artwork..." : isCreating ? "Creating Universe..." : "Create Manuscript"}
          </button>
        </div>
      </div>

      {/* Generous bottom spacer so content easily scrolls far above the mobile bottom bar */}
      <div className="h-40 sm:h-8 w-full shrink-0" aria-hidden="true" />

    </form>
  );
}