import Image from "next/image";

export function ProfileHeader({ user }: { user: { name?: string; picture?: string | null } | null }) {
  return (
    <section className="relative mb-16 md:mb-20">
      <div className="h-32 md:h-48 w-full rounded-3xl md:rounded-4xl bg-gradient-to-r from-primary/20 via-purple-500/20 to-emerald-500/20 border border-border relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-30 mix-blend-overlay"></div>
      </div>

      <div className="absolute -bottom-12 md:-bottom-16 left-6 md:left-10 flex items-end">
        <div className="relative flex h-24 w-24 md:h-32 md:w-32 items-center justify-center rounded-full bg-card border-4 md:border-8 border-background shadow-xl text-foreground overflow-hidden">
          {user?.picture ? (
            <Image 
              src={user.picture} 
              alt="Profile" 
              width={128} height={128}
              className="object-cover w-full h-full"
              unoptimized 
            />
          ) : (
            <span className="text-3xl md:text-5xl font-bold text-muted-foreground uppercase">
              {user?.name?.charAt(0) || "W"}
            </span>
          )}
        </div>
      </div>
    </section>
  );
}