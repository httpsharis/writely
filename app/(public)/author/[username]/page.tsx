"use client";

import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Twitter, Instagram, Globe, BookOpen, Heart, Eye } from "lucide-react";
import { useGetPublicProfileQuery } from "@/redux/features/profile/profileApi";

export default function PublicAuthorProfilePage() {
  const params = useParams();
  const router = useRouter();
  const username = params.username as string;

  const { data: profile, isLoading, error } = useGetPublicProfileQuery(username);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#131217]">
        <div className="h-6 w-6 animate-spin rounded-full border-t-2 border-[#c9975a]" />
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-[#131217] text-[#ede9e2]">
        <p className="mb-4 font-serif text-2xl">Author not found.</p>
        <button 
          onClick={() => router.back()} 
          className="text-xs font-bold uppercase tracking-widest text-[#948fa0] transition-colors hover:text-[#ede9e2]"
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
    <div className="min-h-screen bg-[#131217] font-sans text-[#ede9e2] antialiased pb-20">
      
      {/* Dynamic Cover Image Banner */}
      <div className="relative h-48 md:h-64 lg:h-80 w-full overflow-hidden bg-black/40">
        {profile.coverImageUrl ? (
          <Image 
            src={profile.coverImageUrl} 
            alt="Cover" 
            fill 
            className="object-cover opacity-60" 
            unoptimized 
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-r from-[#c9975a]/20 via-[#4f4336]/20 to-black/20" />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#131217]" />
        
        {/* Back Button */}
        <button 
          onClick={() => router.back()}
          className="absolute top-6 left-6 flex items-center justify-center w-10 h-10 rounded-full bg-black/40 border border-white/10 text-white/70 hover:text-white hover:bg-black/60 transition-all z-10 backdrop-blur-sm"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
      </div>

      <div className="mx-auto max-w-5xl px-6 md:px-12 -mt-16 relative z-10">
        
        {/* Author Identity Section */}
        <div className="flex flex-col md:flex-row gap-6 md:items-end mb-12">
          {/* Avatar */}
          <div className="relative w-32 h-32 md:w-40 md:h-40 shrink-0 rounded-2xl border-4 border-[#131217] bg-[#1a1920] shadow-2xl overflow-hidden flex items-center justify-center">
            {profile.avatarUrl ? (
              <Image src={profile.avatarUrl} alt={profile.name} fill className="object-cover" unoptimized />
            ) : (
              <span className="text-5xl font-serif text-[#948fa0] uppercase">{profile.name.charAt(0)}</span>
            )}
          </div>

          <div className="flex-1 pb-2">
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-[#ede9e2] mb-1">{profile.name}</h1>
            <p className="text-[#948fa0] text-sm font-medium tracking-wide">@{profile.username}</p>
          </div>

          {/* Social Links */}
          {(profile.socialLinks?.twitter || profile.socialLinks?.instagram || profile.socialLinks?.website) && (
            <div className="flex items-center gap-3 pb-3">
              {profile.socialLinks.twitter && (
                <a href={profile.socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-full bg-white/5 border border-white/5 text-[#948fa0] hover:text-[#c9975a] hover:border-[#c9975a]/30 transition-all">
                  <Twitter className="w-4 h-4" />
                </a>
              )}
              {profile.socialLinks.instagram && (
                <a href={profile.socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-full bg-white/5 border border-white/5 text-[#948fa0] hover:text-[#c9975a] hover:border-[#c9975a]/30 transition-all">
                  <Instagram className="w-4 h-4" />
                </a>
              )}
              {profile.socialLinks.website && (
                <a href={profile.socialLinks.website} target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-full bg-white/5 border border-white/5 text-[#948fa0] hover:text-[#c9975a] hover:border-[#c9975a]/30 transition-all">
                  <Globe className="w-4 h-4" />
                </a>
              )}
            </div>
          )}
        </div>

        {/* Bio & Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-16">
          <div className="lg:col-span-2">
            <h3 className="text-xs font-bold uppercase tracking-[0.15em] text-[#948fa0] mb-4">About the Author</h3>
            <p className="text-[#c2becd] text-base leading-relaxed whitespace-pre-wrap">
              {profile.bio || "This author hasn't written a bio yet."}
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <div className="p-5 rounded-2xl bg-[#1a1920] border border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-3 text-[#948fa0]">
                <BookOpen className="w-5 h-5 text-[#c9975a]" />
                <span className="text-sm font-medium">Published Works</span>
              </div>
              <span className="text-xl font-bold text-[#ede9e2]">{publishedWorks.length}</span>
            </div>
            
            <div className="p-5 rounded-2xl bg-[#1a1920] border border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-3 text-[#948fa0]">
                <Eye className="w-5 h-5 text-blue-400" />
                <span className="text-sm font-medium">Total Reads</span>
              </div>
              <span className="text-xl font-bold text-[#ede9e2]">{totalReads.toLocaleString()}</span>
            </div>

            <div className="p-5 rounded-2xl bg-[#1a1920] border border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-3 text-[#948fa0]">
                <Heart className="w-5 h-5 text-red-400" />
                <span className="text-sm font-medium">Total Likes</span>
              </div>
              <span className="text-xl font-bold text-[#ede9e2]">{totalLikes.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Portfolio Showcase */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-[0.15em] text-[#948fa0] mb-6 border-b border-white/10 pb-4">
            Published Works
          </h3>

          {publishedWorks.length === 0 ? (
            <div className="py-16 text-center rounded-3xl border border-dashed border-white/10 bg-[#1a1920]/50">
              <p className="text-[#948fa0]">No public works available yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {publishedWorks.map((work) => (
                <Link key={work._id} href={`/chapter/${work.slug}`} className="group block">
                  <div className="aspect-[2/3] w-full rounded-xl bg-[#1a1920] border border-white/5 overflow-hidden relative mb-3 shadow-lg transition-transform duration-300 group-hover:-translate-y-2 group-hover:shadow-2xl group-hover:border-[#c9975a]/30">
                    {work.coverImage ? (
                      <Image src={work.coverImage} alt={work.title} fill className="object-cover" unoptimized />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-[#1a1920] to-[#131217] flex items-center justify-center p-4 text-center">
                        <span className="text-[#948fa0] font-serif italic line-clamp-3 px-2">{work.title}</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                      <div className="flex items-center gap-1.5 text-white/90 text-xs font-bold">
                        <Heart className="w-3.5 h-3.5 fill-red-500 text-red-500" /> {work.likesCount || 0}
                      </div>
                    </div>
                  </div>
                  <h4 className="text-[#ede9e2] font-semibold text-sm line-clamp-1 group-hover:text-[#c9975a] transition-colors">{work.title}</h4>
                  <p className="text-[#5c5868] text-xs mt-1 uppercase tracking-wider font-bold">
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
