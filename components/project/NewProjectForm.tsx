"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { ImagePlus, Target, AlignLeft, Tag, Loader2, X } from "lucide-react";
import Image from "next/image";
import { useCreateDocumentMutation } from "@/redux/features/documents/documentApi";
import { getErrorMessage } from "@/lib/getErrorMessage"; 
import { uploadToCloudinary } from "../../lib/uploadImage"; // 🟢 Clean import

export function NewProjectForm() {
  const router = useRouter();
  const [createDocument, { isLoading: isCreating, error }] = useCreateDocumentMutation();

  const [title, setTitle] = useState("");
  const [tags, setTags] = useState("");
  const [synopsis, setSynopsis] = useState("");
  const [targetWords, setTargetWords] = useState("");
  
  // Image Upload State
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle file selection and create a temporary URL for preview
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("File is too large. Max size is 5MB.");
        return;
      }
      setCoverFile(file);
      setCoverPreview(URL.createObjectURL(file));
    }
  };

  // Remove the selected image
  const handleRemoveImage = (e: React.MouseEvent) => {
    e.stopPropagation(); 
    setCoverFile(null);
    setCoverPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const parsedTarget = targetWords.trim() ? parseInt(targetWords, 10) : undefined;
    const finalTarget = parsedTarget !== undefined && !isNaN(parsedTarget) ? parsedTarget : undefined;

    try {
      let uploadedImageUrl = undefined;

      // 🟢 Use our abstracted utility function
      if (coverFile) {
        setIsUploadingImage(true);
        uploadedImageUrl = await uploadToCloudinary(coverFile);
        setIsUploadingImage(false);
      }

      // Submit JSON payload with the finalized image URL
      const response = await createDocument({
        title: title.trim(),
        type: "novel",
        tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
        targetWords: finalTarget,
        synopsis: synopsis.trim() || undefined,
        coverImage: uploadedImageUrl, 
      }).unwrap();

      router.push(`/project/${response.document._id}`);
    } catch (err) {
      console.error("Create document failed:", err);
      setIsUploadingImage(false); 
    }
  };

  const isLoading = isCreating || isUploadingImage;

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-10">
      <div className="flex flex-col md:flex-row gap-8 md:gap-12">
        {error && (
          <div className="p-3 text-sm font-medium text-rose-500 bg-rose-500/10 rounded-md border border-rose-500/20">
            {getErrorMessage(error)}
          </div>
        )}

        {/* Dynamic Cover Image Uploader */}
        <div className="flex flex-col gap-3 md:w-1/3 shrink-0">
          <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
            Cover Image
          </label>
          
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleImageChange} 
            accept="image/jpeg, image/png, image/webp" 
            className="hidden" 
          />

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="relative w-full aspect-[2/3] rounded-2xl border border-dashed border-border/60 hover:border-foreground/30 hover:bg-secondary/20 transition-all flex flex-col items-center justify-center gap-4 text-muted-foreground group overflow-hidden"
          >
            {coverPreview ? (
              <>
                <Image src={coverPreview} alt="Cover Preview" fill className="object-cover" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="text-white text-xs font-bold uppercase tracking-widest bg-black/50 px-4 py-2 rounded-full backdrop-blur-sm">Change Image</span>
                </div>
                <div 
                  onClick={handleRemoveImage}
                  className="absolute top-3 right-3 p-1.5 bg-black/50 text-white rounded-full hover:bg-rose-500 transition-colors z-10"
                >
                  <X className="w-4 h-4" />
                </div>
              </>
            ) : (
              <>
                <div className="p-4 rounded-xl bg-secondary/30 group-hover:bg-secondary transition-colors">
                  <ImagePlus className="w-5 h-5 group-hover:text-foreground transition-colors stroke-[1.5]" />
                </div>
                <div className="text-center">
                  <span className="text-sm font-medium text-foreground block">
                    Upload Cover
                  </span>
                  <span className="text-xs mt-1 block opacity-60">
                    JPEG, PNG up to 5MB
                  </span>
                </div>
              </>
            )}
          </button>
        </div>

        {/* Form Inputs */}
        <div className="flex flex-col gap-6 flex-grow">
          <div className="flex flex-col gap-3">
            <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
              Project Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="The Great American Novel"
              className="w-full bg-transparent border-b border-border/40 pb-2 text-xl font-medium focus:outline-none focus:border-foreground transition-colors placeholder:text-muted-foreground/50"
              required
            />
          </div>

          <div className="flex flex-col gap-3">
            <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
              <Tag className="w-3 h-3" /> Tags
            </label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="Fantasy, Sci-Fi, Romance (comma separated)"
              className="w-full bg-transparent border-b border-border/40 pb-2 text-sm focus:outline-none focus:border-foreground transition-colors placeholder:text-muted-foreground/50"
            />
          </div>

          <div className="flex flex-col gap-3">
            <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
              <Target className="w-3 h-3" /> Target Word Count
            </label>
            <input
              type="number"
              value={targetWords}
              onChange={(e) => setTargetWords(e.target.value)}
              placeholder="e.g. 50000"
              className="w-full bg-transparent border-b border-border/40 pb-2 text-sm focus:outline-none focus:border-foreground transition-colors placeholder:text-muted-foreground/50"
            />
          </div>

          <div className="flex flex-col gap-3">
            <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
              <AlignLeft className="w-3 h-3" /> Synopsis
            </label>
            <textarea
              value={synopsis}
              onChange={(e) => setSynopsis(e.target.value)}
              placeholder="A brief summary of your story..."
              className="w-full bg-transparent border border-border/40 rounded-lg p-3 text-sm focus:outline-none focus:border-foreground transition-colors placeholder:text-muted-foreground/50 resize-none h-32"
            />
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-end gap-4 mt-4 pt-6 border-t border-border/40">
        <button
          type="button"
          onClick={() => router.push("/project")}
          disabled={isLoading}
          className="px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-all disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={!title.trim() || isLoading}
          className="flex items-center gap-2 px-8 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest bg-foreground text-background hover:bg-foreground/90 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        >
          {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
          {isUploadingImage ? "Uploading Image..." : isCreating ? "Creating..." : "Create Project"}
        </button>
      </div>
    </form>
  );
}