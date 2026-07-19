import { useState } from "react";
import { User } from "@/types";
import { useUpdateProfileMutation } from "@/redux/features/auth/authApi";
import { Pencil, Check, X, Loader2 } from "lucide-react";

export function AuthorIdentity({ user }: { user: User | null }) {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || "");
  const [username, setUsername] = useState(user?.username || "");
  const [bio, setBio] = useState(user?.bio || "");

  const [updateProfile, { isLoading }] = useUpdateProfileMutation();

  const handleSave = async () => {
    try {
      await updateProfile({ name, username, bio }).unwrap();
      setIsEditing(false);
    } catch (err: any) {
      alert(err.data?.error || "Failed to update profile");
    }
  };

  const handleCancel = () => {
    setName(user?.name || "");
    setUsername(user?.username || "");
    setBio(user?.bio || "");
    setIsEditing(false);
  };

  if (!user) return null;

  const displayUsername = user.username ? `@${user.username}` : `@${user.name.split(' ').join('').toLowerCase()}`;

  if (isEditing) {
    return (
      <section className="px-2 md:px-4 mb-10 flex flex-col gap-4 animate-in fade-in">
        <div className="flex flex-col gap-1">
          <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Name</label>
          <input 
            type="text" 
            value={name} 
            onChange={e => setName(e.target.value)}
            className="w-full max-w-md bg-secondary/30 border border-border/50 rounded-lg px-4 py-2 focus:outline-none focus:ring-1 focus:ring-primary text-foreground"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Username</label>
          <div className="relative w-full max-w-md">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">@</span>
            <input 
              type="text" 
              value={username} 
              onChange={e => setUsername(e.target.value)}
              className="w-full bg-secondary/30 border border-border/50 rounded-lg pl-9 pr-4 py-2 focus:outline-none focus:ring-1 focus:ring-primary text-foreground"
            />
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Bio / Description</label>
          <textarea 
            value={bio} 
            onChange={e => setBio(e.target.value)}
            className="w-full max-w-2xl bg-secondary/30 border border-border/50 rounded-lg px-4 py-3 min-h-[120px] focus:outline-none focus:ring-1 focus:ring-primary text-foreground resize-y"
            placeholder="Tell the world about yourself..."
          />
        </div>

        <div className="flex items-center gap-3 mt-2">
          <button 
            onClick={handleSave} 
            disabled={isLoading}
            className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2 rounded-full font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
            Save Profile
          </button>
          <button 
            onClick={handleCancel}
            disabled={isLoading} 
            className="flex items-center gap-2 bg-secondary text-secondary-foreground px-6 py-2 rounded-full font-medium hover:bg-secondary/80 transition-colors"
          >
            <X className="w-4 h-4" />
            Cancel
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="px-2 md:px-4 mb-10 group relative w-fit">
      <button 
        onClick={() => setIsEditing(true)}
        className="absolute -right-12 top-2 p-2 rounded-full bg-secondary text-muted-foreground opacity-0 group-hover:opacity-100 hover:text-foreground transition-all duration-300"
      >
        <Pencil className="w-4 h-4" />
      </button>

      <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-1 pr-8">
        {user.name}
      </h1>
      <p className="text-base text-primary font-medium mb-4">
        {displayUsername}
      </p>
      {user.bio ? (
        <p className="text-sm md:text-base text-muted-foreground leading-relaxed max-w-2xl whitespace-pre-wrap">
          {user.bio}
        </p>
      ) : (
        <p className="text-sm md:text-base text-muted-foreground/60 italic leading-relaxed max-w-2xl">
          No description provided yet. Click the pencil icon to edit your profile.
        </p>
      )}
    </section>
  );
}