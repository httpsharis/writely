"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { 
  User, 
  Type, 
  Palette, 
  Bell, 
  Shield, 
  LogOut,
  ChevronRight
} from "lucide-react";

export default function SettingsPage() {
  const [isMounted, setIsMounted] = useState(false);
  const [activeTab, setActiveTab] = useState("account");
  const user = useSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    const timer = setTimeout(() => setIsMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  if (!isMounted) return null;

  const tabs = [
    { id: "account", label: "Account", icon: User },
    { id: "editor", label: "Editor Preferences", icon: Type },
    { id: "appearance", label: "Appearance", icon: Palette },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "security", label: "Security", icon: Shield },
  ];

  return (
    <div className="max-w-6xl mx-auto flex flex-col h-auto md:h-full w-full animate-in fade-in duration-700 pb-32 md:pb-8 px-4 md:px-8">
      
      {/* HEADER */}
      <header className="shrink-0 mb-8 pt-8 md:pt-12">
        <h1 className="text-3xl md:text-[40px] font-bold tracking-tight text-white mb-2 leading-tight">
          Settings
        </h1>
        <p className="text-[#828A9F] text-[15px] md:text-[17px] font-medium">
          Manage your account and app preferences.
        </p>
      </header>

      {/* MAIN CONTENT WRAPPER - Split Layout on Desktop */}
      <div className="flex flex-col md:flex-row gap-8 md:gap-12 flex-1 md:min-h-0">
        
        {/* LEFT COLUMN: Navigation Tabs */}
        <nav className="shrink-0 w-full md:w-64 flex md:flex-col gap-2 overflow-x-auto md:overflow-visible custom-scrollbar pb-2 md:pb-0">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-3 px-4 py-3 md:py-3.5 rounded-[16px] transition-all duration-300 whitespace-nowrap text-left ${
                activeTab === tab.id 
                  ? "bg-[#535CE8]/10 text-[#535CE8] font-semibold" 
                  : "text-[#828A9F] hover:bg-[#171926] hover:text-white font-medium"
              }`}
            >
              <tab.icon className={`w-5 h-5 ${activeTab === tab.id ? "stroke-[2]" : "stroke-[1.5]"}`} />
              <span className="text-[14px]">{tab.label}</span>
            </button>
          ))}
          
          <div className="hidden md:block h-px w-full bg-white/5 my-2" />
          
          <button className="hidden md:flex items-center gap-3 px-4 py-3 rounded-[16px] text-[#EF4444] hover:bg-[#EF4444]/10 transition-all duration-300 font-medium text-left">
            <LogOut className="w-5 h-5 stroke-[1.5]" />
            <span className="text-[14px]">Sign Out</span>
          </button>
        </nav>

        {/* RIGHT COLUMN: Active Tab Content */}
        <div className="flex-1 md:overflow-y-auto custom-scrollbar md:pr-4">
          
          {/* ACCOUNT SETTINGS PANEL */}
          {activeTab === "account" && (
            <div className="flex flex-col gap-8 animate-in fade-in zoom-in-95 duration-300">
              
              {/* Profile Card */}
              <section className="p-6 md:p-8 rounded-[24px] bg-[#171926] border border-white/5 flex flex-col sm:flex-row items-center sm:items-start gap-6">
                <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-[#292D41] text-white text-3xl font-bold">
                  {user?.name?.charAt(0) || "W"}
                </div>
                <div className="flex-1 text-center sm:text-left">
                  <h3 className="text-[20px] font-semibold text-white mb-1">Avatar & Profile</h3>
                  <p className="text-[14px] text-[#828A9F] mb-4 max-w-sm">
                    Upload a picture to make your profile stand out across your shared manuscripts.
                  </p>
                  <div className="flex justify-center sm:justify-start gap-3">
                    <button className="px-4 py-2 rounded-xl bg-white text-black font-semibold text-[13px] hover:bg-gray-100 transition-colors">
                      Upload Image
                    </button>
                    <button className="px-4 py-2 rounded-xl bg-[#292D41] text-white font-semibold text-[13px] hover:bg-[#32364E] transition-colors">
                      Remove
                    </button>
                  </div>
                </div>
              </section>

              {/* Personal Info Form */}
              <section className="flex flex-col gap-4">
                <h3 className="text-[16px] font-bold tracking-[0.1em] text-white uppercase ml-1">
                  Personal Information
                </h3>
                <div className="p-6 md:p-8 rounded-[24px] bg-[#171926] border border-white/5 flex flex-col gap-5">
                  <div className="flex flex-col gap-2">
                    <label className="text-[13px] font-medium text-[#828A9F] pl-1">Full Name</label>
                    <input 
                      type="text" 
                      defaultValue={user?.name || ""}
                      className="w-full h-12 bg-[#0B0D14] border border-white/5 focus:border-[#535CE8]/50 rounded-[16px] px-4 text-[14px] text-white outline-none transition-all"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[13px] font-medium text-[#828A9F] pl-1">Email Address</label>
                    <input 
                      type="email" 
                      defaultValue={user?.email || ""}
                      className="w-full h-12 bg-[#0B0D14] border border-white/5 focus:border-[#535CE8]/50 rounded-[16px] px-4 text-[14px] text-white outline-none transition-all"
                    />
                  </div>
                  <div className="pt-2">
                    <button className="px-5 py-2.5 rounded-xl bg-[#535CE8] text-white font-semibold text-[14px] hover:bg-[#6069F0] transition-colors">
                      Save Changes
                    </button>
                  </div>
                </div>
              </section>
            </div>
          )}

          {/* EDITOR PREFERENCES PANEL */}
          {activeTab === "editor" && (
            <div className="flex flex-col gap-8 animate-in fade-in zoom-in-95 duration-300">
              <section className="flex flex-col gap-4">
                <h3 className="text-[16px] font-bold tracking-[0.1em] text-white uppercase ml-1">
                  Writing Experience
                </h3>
                <div className="flex flex-col gap-2 rounded-[24px] bg-[#171926] border border-white/5 p-2">
                  
                  <button className="flex items-center justify-between p-4 rounded-[16px] hover:bg-[#1F2333] transition-colors text-left group">
                    <div>
                      <h4 className="text-[15px] font-semibold text-white mb-0.5">Default Font</h4>
                      <p className="text-[13px] text-[#828A9F]">Choose between Serif (classic) or Sans-Serif (modern).</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-[14px] text-[#535CE8] font-medium">Serif</span>
                      <ChevronRight className="w-5 h-5 text-[#828A9F] group-hover:text-white transition-colors" />
                    </div>
                  </button>

                  <div className="h-px w-full bg-white/5" />

                  <button className="flex items-center justify-between p-4 rounded-[16px] hover:bg-[#1F2333] transition-colors text-left group">
                    <div>
                      <h4 className="text-[15px] font-semibold text-white mb-0.5">Typewriter Mode</h4>
                      <p className="text-[13px] text-[#828A9F]">Keeps the active line in the center of the screen.</p>
                    </div>
                    <div className="h-6 w-11 rounded-full bg-[#535CE8] relative transition-colors">
                      <div className="absolute right-1 top-1 h-4 w-4 rounded-full bg-white shadow-sm" />
                    </div>
                  </button>

                  <div className="h-px w-full bg-white/5" />

                  <button className="flex items-center justify-between p-4 rounded-[16px] hover:bg-[#1F2333] transition-colors text-left group">
                    <div>
                      <h4 className="text-[15px] font-semibold text-white mb-0.5">Auto-Save</h4>
                      <p className="text-[13px] text-[#828A9F]">Automatically save drafts to the cloud.</p>
                    </div>
                    <div className="h-6 w-11 rounded-full bg-[#535CE8] relative transition-colors">
                      <div className="absolute right-1 top-1 h-4 w-4 rounded-full bg-white shadow-sm" />
                    </div>
                  </button>

                </div>
              </section>
            </div>
          )}

          {/* Fallback for unbuilt tabs */}
          {["appearance", "notifications", "security"].includes(activeTab) && (
            <div className="flex flex-col items-center justify-center h-64 text-center animate-in fade-in zoom-in-95 duration-300">
              <Palette className="w-12 h-12 text-[#828A9F] mb-4 opacity-50" />
              <h3 className="text-[18px] font-semibold text-white mb-2">Coming Soon</h3>
              <p className="text-[14px] text-[#828A9F] max-w-sm">
                The {activeTab} settings panel is currently under construction.
              </p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}