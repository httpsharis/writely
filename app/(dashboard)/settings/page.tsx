"use client";

import {
  Moon,
  Type,
  Target,
  Download,
  Trash2,
  Maximize,
  LucideIcon,
} from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
// 👇 FIX 3: Removed toggleDarkMode from this import
import {
  toggleFocusMode,
  setDailyGoal,
  setEditorFont,
} from "@/redux/features/settings/settingsSlice";
import { useExportLibraryMutation } from "@/redux/features/exports/exportApi";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

// --- REUSABLE MICRO-COMPONENTS ---
function SectionHeader({ title }: { title: string }) {
  return (
    <h2 className="text-xs font-bold tracking-widest text-foreground uppercase flex items-center gap-4 pt-12 pb-6">
      {title}
      <span className="h-px flex-1 bg-border" />
    </h2>
  );
}

function SettingRow({
  icon: Icon,
  title,
  description,
  children,
  isDanger = false,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  children: React.ReactNode;
  isDanger?: boolean;
}) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 py-6 border-b border-border/50 group">
      <div className="flex items-start gap-4 md:gap-6">
        <div
          className={`flex items-center justify-center h-10 w-10 rounded-xl bg-secondary/30 shrink-0 transition-colors duration-300 ${isDanger ? "text-rose-500/80 group-hover:text-rose-500 group-hover:bg-rose-500/10" : "text-muted-foreground group-hover:text-brand group-hover:bg-secondary/50"}`}
        >
          <Icon className="w-5 h-5 stroke-[1.5]" />
        </div>
        <div className="flex flex-col gap-1">
          <h3
            className={`text-lg font-serif font-bold tracking-tight ${isDanger ? "text-rose-500" : "text-foreground"}`}
          >
            {title}
          </h3>
          <p className="text-xs md:text-sm text-muted-foreground font-medium max-w-md leading-relaxed">
            {description}
          </p>
        </div>
      </div>
      <div className="shrink-0 pl-14 md:pl-0">{children}</div>
    </div>
  );
}

function Toggle({
  enabled,
  onChange,
}: {
  enabled: boolean;
  onChange: () => void;
}) {
  return (
    <button
      onClick={onChange}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 focus:outline-none ${
        enabled ? "bg-foreground" : "bg-border"
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-background transition-transform duration-300 ${
          enabled ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  );
}

// --- MAIN PAGE COMPONENT ---
export default function SettingsPage() {
  const dispatch = useDispatch();

  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [exportLibrary, { isLoading: isExporting }] = useExportLibraryMutation();

  const { isFocusMode, dailyGoal, editorFont } = useSelector(
    (state: RootState) => state.settings,
  );

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="w-full max-w-4xl pb-24">
      {/* Page Header */}
      <header className="mb-8 md:mb-12 shrink-0">
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground leading-tight">
          Settings
        </h1>
        <p className="text-muted-foreground text-base md:text-lg font-medium mt-2">
          Configure your workspace and writing environment.
        </p>
      </header>

      <div className="flex flex-col">
        {/* --- SECTION 1: WRITING ENVIRONMENT --- */}
        <SectionHeader title="Writing Environment" />

        <SettingRow
          icon={Target}
          title="Daily Word Goal"
          description="Set your default daily target. This updates your dashboard milestones and tracking."
        >
          <div className="flex items-center gap-2 border border-border/50 rounded-lg px-3 py-1.5 focus-within:border-foreground/50 transition-colors">
            <input
              type="number"
              value={dailyGoal}
              onChange={(e) =>
                dispatch(setDailyGoal(Number(e.target.value) || 0))
              }
              className="w-16 bg-transparent text-sm font-bold text-foreground outline-none text-center"
            />
            <span className="text-xs uppercase tracking-widest text-muted-foreground font-bold">
              Words
            </span>
          </div>
        </SettingRow>

        <SettingRow
          icon={Maximize}
          title="Default Focus Mode"
          description="Automatically fade out the sidebar and formatting tools when you begin typing."
        >
          <Toggle
            enabled={isFocusMode}
            onChange={() => dispatch(toggleFocusMode())}
          />
        </SettingRow>

        {/* --- SECTION 2: APPEARANCE --- */}
        <SectionHeader title="Appearance" />

        <SettingRow
          icon={Moon}
          title="Dark Mode"
          description="Switch between light and dark themes to reduce eye strain during late-night writing sessions."
        >
          {mounted ? (
            // 2. Use resolvedTheme for both the check AND the toggle logic
            <Toggle
              enabled={resolvedTheme === "dark"}
              onChange={() =>
                setTheme(resolvedTheme === "dark" ? "light" : "dark")
              }
            />
          ) : (
            <div className="relative inline-flex h-6 w-11 items-center rounded-full bg-border opacity-50" />
          )}
        </SettingRow>

        <SettingRow
          icon={Type}
          title="Editor Typography"
          description="Choose the primary font family used in the writing canvas."
        >
          <div className="flex items-center gap-1 bg-secondary/20 p-1 rounded-lg border border-border/30">
            <button
              onClick={() => dispatch(setEditorFont("sans"))}
              className={`px-4 py-1.5 rounded-md text-xs font-bold uppercase tracking-widest transition-all ${
                editorFont === "sans"
                  ? "bg-foreground text-background shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Sans
            </button>
            <button
              onClick={() => dispatch(setEditorFont("serif"))}
              className={`px-4 py-1.5 rounded-md text-xs font-serif font-bold transition-all ${
                editorFont === "serif"
                  ? "bg-foreground text-background shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Serif
            </button>
          </div>
        </SettingRow>

        {/* --- SECTION 3: DATA & SECURITY --- */}
        <SectionHeader title="Data & Security" />

        <SettingRow
          icon={Download}
          title="Export Library"
          description="Download a complete backup of all your novels, chapters, and notes as a JSON file."
        >
          <button 
            disabled={isExporting}
            onClick={async () => {
              try {
                const blob = await exportLibrary().unwrap();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = `writely-backup-${new Date().toISOString().split("T")[0]}.json`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);
              } catch (e) {
                console.error("Failed to export library:", e);
                alert("Failed to export library.");
              }
            }}
          className="px-5 py-2 text-[10px] md:text-xs font-bold uppercase tracking-widest text-foreground border border-border/50 rounded-full hover:bg-foreground hover:text-background transition-all duration-300 disabled:opacity-50 flex items-center gap-2">
            {isExporting ? "Exporting..." : "Export Data"}
          </button>
        </SettingRow>

        <SettingRow
          icon={Trash2}
          title="Danger Zone"
          description="Permanently delete your account, novels, and all associated data. This action cannot be undone."
          isDanger={true}
        >
          <button className="px-5 py-2 text-[10px] md:text-xs font-bold uppercase tracking-widest text-rose-500 border border-rose-500/30 rounded-full hover:bg-rose-500 hover:text-white transition-all duration-300">
            Delete Account
          </button>
        </SettingRow>
      </div>
    </div>
  );
}
