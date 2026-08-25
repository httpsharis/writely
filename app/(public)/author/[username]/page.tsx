"use client";

import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Twitter, Instagram, Globe, BookOpen, Heart, Eye } from "lucide-react";
import { useGetPublicProfileQuery } from "@/redux/features/profile/profileApi";
import { getAvatarUrl, getBannerUrl, getBookCoverUrl } from "@/lib/cloudinary";

export default function PublicAuthorProfilePage() {
  const params = useParams();
  const router = useRouter();
  const username = params.username as string;

  const { data: profile, isLoading, error } = useGetPublicProfileQuery(username);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="h-6 w-6 animate-spin rounded-full border-t-2 border-brand" />
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-background text-foreground">
        <p className="mb-4 font-serif text-2xl">Author not found.</p>
        <button 
          onClick={() => router.back()} 
          className="text-xs font-bold uppercase tracking-widest text-muted-foreground transition-colors hover:text-foreground cursor-pointer"
        >
          Go Back
        </button>
      </div>
    );
  }

  const { publishedWorks = [] } = profile;

  // Aggregate simple stats to show the readers
  const totalReads = publishedWorks.reduce((acc, work) => acc + (work.viewsCount || 0), 0);
  const totalLikes = publishedWorks.reduce((acc, work) => acc + (work.likesCount || 0), 0);

  return (
    <div className="min-h-screen bg-background font-sans text-foreground antialiased pb-20">
      
      {/* Dynamic Cover Image Banner */}
      <div className="relative h-48 md:h-64 lg:h-80 w-full overflow-hidden bg-black/40">
        {profile.coverImageUrl ? (
          <Image 
            src={getBannerUrl(profile.coverImageUrl, 1400)} 
            alt="Cover" 
            fill 
            sizes="100vw"
            className="object-cover opacity-60" 
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-r from-brand/20 via-primary/20 to-black/20" />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background" />
        
        {/* Back Button */}
        <button 
          onClick={() => router.back()}
          className="absolute top-6 left-6 flex items-center justify-center w-10 h-10 rounded-full bg-black/40 border border-white/10 text-white/70 hover:text-white hover:bg-black/60 transition-all z-10 backdrop-blur-sm cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
      </div>

      <div className="mx-auto max-w-5xl px-6 md:px-12 -mt-16 relative z-10">
        
        {/* Author Identity Section */}
        <div className="flex flex-col md:flex-row gap-6 md:items-end mb-12">
          {/* Avatar */}
          <div className="relative w-32 h-32 md:w-40 md:h-40 shrink-0 rounded-2xl border-4 border-background bg-card shadow-2xl overflow-hidden flex items-center justify-center">
            {profile.avatarUrl ? (
              <Image 
                src={getAvatarUrl(profile.avatarUrl, 320)} 
                alt={profile.name} 
                fill 
                sizes="(max-width: 768px) 128px, 160px"
                className="object-cover" 
              />
            ) : (
              <span className="text-5xl font-serif text-muted-foreground uppercase">{profile.name.charAt(0)}</span>
            )}
          </div>

          <div className="flex-1 pb-2">
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-1">{profile.name}</h1>
            <p className="text-muted-foreground text-sm font-medium tracking-wide">@{profile.username}</p>
          </div>

          {/* Social Links */}
          {(profile.socialLinks?.twitter || profile.socialLinks?.instagram || profile.socialLinks?.website) && (
            <div className="flex items-center gap-3 pb-3">
              {profile.socialLinks.twitter && (
                <a href={profile.socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-full bg-secondary/40 border border-border text-muted-foreground hover:text-brand hover:border-brand/30 transition-all">
                  <Twitter className="w-4 h-4" />
                </a>
              )}
              {profile.socialLinks.instagram && (
                <a href={profile.socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-full bg-secondary/40 border border-border text-muted-foreground hover:text-brand hover:border-brand/30 transition-all">
                  <Instagram className="w-4 h-4" />
                </a>
              )}
              {profile.socialLinks.website && (
                <a href={profile.socialLinks.website} target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-full bg-secondary/40 border border-border text-muted-foreground hover:text-brand hover:border-brand/30 transition-all">
                  <Globe className="w-4 h-4" />
                </a>
              )}
            </div>
          )}
        </div>

        {/* Bio & Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 mb-16">
          <div className="lg:col-span-2">
            <h3 className="text-xs font-bold uppercase tracking-[0.15em] text-muted-foreground mb-4">About the Author</h3>
            <p className="text-foreground/90 font-serif text-base leading-relaxed whitespace-pre-wrap">
              {profile.bio || "This author hasn't written a bio yet."}
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <div className="p-5 rounded-2xl bg-card border border-border flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-3 text-muted-foreground">
                <BookOpen className="w-5 h-5 text-brand" />
                <span className="text-sm font-medium">Published Works</span>
              </div>
              <span className="text-xl font-bold text-foreground font-mono">{publishedWorks.length}</span>
            </div>
            
            <div className="p-5 rounded-2xl bg-card border border-border flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-3 text-muted-foreground">
                <Eye className="w-5 h-5 text-sky-500" />
                <span className="text-sm font-medium">Total Reads</span>
              </div>
              <span className="text-xl font-bold text-foreground font-mono">{totalReads.toLocaleString()}</span>
            </div>

            <div className="p-5 rounded-2xl bg-card border border-border flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-3 text-muted-foreground">
                <Heart className="w-5 h-5 text-rose-500" />
                <span className="text-sm font-medium">Total Likes</span>
              </div>
              <span className="text-xl font-bold text-foreground font-mono">{totalLikes.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Portfolio Showcase */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-[0.15em] text-muted-foreground mb-6 border-b border-border pb-4">
            Published Works
          </h3>

          {publishedWorks.length === 0 ? (
            <div className="py-16 text-center rounded-3xl border border-dashed border-border bg-secondary/10">
              <p className="text-muted-foreground font-serif italic">No public works available yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {publishedWorks.map((work) => (
                <Link key={work._id} href={`/chapter/${work.slug}`} className="group block">
                  <div className="aspect-[2/3] w-full rounded-2xl bg-secondary/20 border border-border overflow-hidden relative mb-3 shadow-md transition-all duration-300 group-hover:-translate-y-1.5 group-hover:shadow-xl group-hover:border-brand/40">
                    {work.coverImage ? (
                      <Image 
                        src={getBookCoverUrl(work.coverImage, 400)} 
                        alt={work.title} 
                        fill 
                        sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105" 
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-card to-secondary/30 flex items-center justify-center p-4 text-center">
                        <span className="text-muted-foreground font-serif italic text-sm line-clamp-3 px-2">{work.title}</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                      <div className="flex items-center gap-1.5 text-white text-xs font-bold">
                        <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" /> {work.likesCount || 0}
                      </div>
                    </div>
                  </div>
                  <h4 className="text-foreground font-medium text-sm line-clamp-1 group-hover:text-brand transition-colors font-serif">{work.title}</h4>
                  <p className="text-muted-foreground text-[10px] mt-1 uppercase tracking-wider font-bold">
                    {work.genre?.[0] || "Fiction"}
                  </p>
                </Link>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
