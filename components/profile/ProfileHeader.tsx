import Image from "next/image";
import { Share2, Check } from "lucide-react";
import { useState } from "react";
import { UserProfile } from "@/redux/features/profile/profileApi";
import { User } from "@/types";
import { getAvatarUrl, getBannerUrl } from "@/lib/cloudinary";

export function ProfileHeader({ user, myProfile }: { user: User | null; myProfile?: UserProfile }) {
  const [copied, setCopied] = useState(false);

  const handleShare = () => {
    if (myProfile?.username) {
      navigator.clipboard.writeText(`${window.location.origin}/author/${myProfile.username}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } else {
      alert("Please set a username in Settings first!");
    }
  };

  return (
    <section className="relative mb-16 md:mb-20">
      <div className="h-48 md:h-64 w-full rounded-3xl md:rounded-4xl bg-gradient-to-r from-primary/20 via-purple-500/20 to-emerald-500/20 border border-border relative overflow-hidden group">
        {myProfile?.coverImageUrl ? (
          <Image 
            src={getBannerUrl(myProfile.coverImageUrl, 1200)} 
            alt="Cover" 
            fill 
            sizes="(max-width: 768px) 100vw, 1200px"
            className="object-cover opacity-80" 
          />
        ) : (
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-30 mix-blend-overlay"></div>
        )}
        
        <button 
          onClick={handleShare}
          className="absolute top-4 right-4 md:top-6 md:right-6 flex items-center gap-2 px-4 py-2 bg-black/40 hover:bg-black/60 border border-white/10 rounded-full text-white backdrop-blur-md transition-all z-10 cursor-pointer"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
          <span className="text-sm font-semibold">{copied ? "Copied Link" : "Share Profile"}</span>
        </button>
      </div>

      <div className="absolute -bottom-12 md:-bottom-16 left-6 md:left-10 flex items-end">
        <div className="relative flex h-24 w-24 md:h-32 md:w-32 items-center justify-center rounded-full bg-card border-4 md:border-8 border-background shadow-xl text-foreground overflow-hidden">
          {myProfile?.avatarUrl || user?.picture ? (
            <Image 
              src={getAvatarUrl((myProfile?.avatarUrl || user?.picture) as string, 256)} 
              alt="Profile" 
              width={128} 
              height={128}
              className="object-cover w-full h-full"
            />
          ) : (
            <span className="text-3xl md:text-5xl font-bold text-muted-foreground uppercase">
              {myProfile?.name?.charAt(0) || user?.name?.charAt(0) || "W"}
            </span>
          )}
        </div>
      </div>
    </section>
  );
}