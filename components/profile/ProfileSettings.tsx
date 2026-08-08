import { useState, useEffect } from "react";
import { UserProfile, useUpdateMyProfileMutation } from "@/redux/features/profile/profileApi";
import { Loader2, Save } from "lucide-react";

export function ProfileSettings({ profile }: { profile?: UserProfile }) {
  const [updateProfile, { isLoading }] = useUpdateMyProfileMutation();
  
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    bio: "",
    coverImageUrl: "",
    twitter: "",
    instagram: "",
    website: "",
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || "",
        username: profile.username || "",
        bio: profile.bio || "",
        coverImageUrl: profile.coverImageUrl || "",
        twitter: profile.socialLinks?.twitter || "",
        instagram: profile.socialLinks?.instagram || "",
        website: profile.socialLinks?.website || "",
      });
    }
  }, [profile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateProfile({
        name: formData.name,
        username: formData.username,
        bio: formData.bio,
        coverImageUrl: formData.coverImageUrl,
        socialLinks: {
          twitter: formData.twitter,
          instagram: formData.instagram,
          website: formData.website,
        }
      }).unwrap();
    } catch (err) {
      console.error("Failed to update profile", err);
      alert("Failed to update profile. Username might be taken.");
    }
  };

  return (
    <div className="bg-card border border-border rounded-3xl p-6 md:p-8 shadow-sm">
      <h2 className="text-xl font-bold text-foreground mb-6">Profile Settings</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Display Name</label>
            <input 
              type="text" 
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full bg-secondary/30 border border-border/50 rounded-lg px-4 py-2 text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Username</label>
            <input 
              type="text" 
              value={formData.username}
              onChange={(e) => setFormData({...formData, username: e.target.value})}
              className="w-full bg-secondary/30 border border-border/50 rounded-lg px-4 py-2 text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Cover Image URL</label>
          <input 
            type="url" 
            value={formData.coverImageUrl}
            onChange={(e) => setFormData({...formData, coverImageUrl: e.target.value})}
            placeholder="https://example.com/image.jpg"
            className="w-full bg-secondary/30 border border-border/50 rounded-lg px-4 py-2 text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          />
          <p className="text-xs text-muted-foreground">Used as the banner on your public author profile.</p>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Author Bio</label>
          <textarea 
            value={formData.bio}
            onChange={(e) => setFormData({...formData, bio: e.target.value})}
            className="w-full bg-secondary/30 border border-border/50 rounded-lg px-4 py-3 min-h-[120px] text-foreground focus:outline-none focus:ring-1 focus:ring-primary resize-y"
            placeholder="Tell your readers about yourself..."
          />
        </div>

        <div className="pt-4 border-t border-border">
          <h3 className="text-sm font-bold text-foreground mb-4">Social Links</h3>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="w-24 text-xs font-bold text-muted-foreground uppercase">Twitter</span>
              <input 
                type="url" 
                value={formData.twitter}
                onChange={(e) => setFormData({...formData, twitter: e.target.value})}
                placeholder="https://twitter.com/yourhandle"
                className="flex-1 bg-secondary/30 border border-border/50 rounded-lg px-4 py-2 text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <div className="flex items-center gap-3">
              <span className="w-24 text-xs font-bold text-muted-foreground uppercase">Instagram</span>
              <input 
                type="url" 
                value={formData.instagram}
                onChange={(e) => setFormData({...formData, instagram: e.target.value})}
                placeholder="https://instagram.com/yourhandle"
                className="flex-1 bg-secondary/30 border border-border/50 rounded-lg px-4 py-2 text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <div className="flex items-center gap-3">
              <span className="w-24 text-xs font-bold text-muted-foreground uppercase">Website</span>
              <input 
                type="url" 
                value={formData.website}
                onChange={(e) => setFormData({...formData, website: e.target.value})}
                placeholder="https://yourwebsite.com"
                className="flex-1 bg-secondary/30 border border-border/50 rounded-lg px-4 py-2 text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>
        </div>

        <button 
          type="submit"
          disabled={isLoading}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2.5 rounded-full font-bold hover:bg-primary/90 transition-colors disabled:opacity-50 mt-6"
        >
          {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Save Settings
        </button>
      </form>
    </div>
  );
}
