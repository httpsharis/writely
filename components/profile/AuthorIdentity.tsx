export function AuthorIdentity({ user }: { user: { name?: string } | null }) {
  // We will pull the real username from the DB later, for now we generate a fallback
  const fallbackUsername = user?.name ? `@${user.name.split(' ').join('').toLowerCase()}` : "@writer";

  return (
    <section className="px-2 md:px-4 mb-10">
      <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-1">
        {user?.name || "Author Name"}
      </h1>
      <p className="text-base text-primary font-medium mb-4">
        {fallbackUsername}
      </p>
      <p className="text-sm md:text-base text-muted-foreground leading-relaxed max-w-2xl">
        Fantasy and Sci-Fi author obsessed with intricate magic systems and morally gray characters. Currently drafting the first book in The Silent City series. 
      </p>
    </section>
  );
}