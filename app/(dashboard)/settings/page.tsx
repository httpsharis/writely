"use client";

import { useState } from "react";
import { User, Monitor, CreditCard, Upload } from "lucide-react";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("Account");

  return (
    <div className="max-w-[720px] mx-auto px-8 py-12 md:py-16 flex flex-col">
      
      {/* Page Header */}
      <div className="flex flex-col gap-2 mb-12">
        <h1 className="text-[32px] font-semibold tracking-tight text-[#1A1008] dark:text-[#F0EBE4] leading-none">
          Settings
        </h1>
        <p className="text-[14px] text-[#9C8870] dark:text-[#5C5652]">
          Manage your account, editor preferences, and subscription.
        </p>
      </div>

      {/* Editorial Tabs */}
      <div className="flex items-center gap-8 border-b border-[#E8E0D5] dark:border-[#242424] mb-10">
        {[
          { name: "Account", icon: User },
          { name: "Preferences", icon: Monitor },
          { name: "Billing", icon: CreditCard }
        ].map((tab) => (
          <button
            key={tab.name}
            onClick={() => setActiveTab(tab.name)}
            className={`pb-3 text-[12px] uppercase tracking-[0.1em] font-medium transition-colors relative flex items-center gap-2 ${
              activeTab === tab.name 
                ? "text-[#1A1008] dark:text-[#F0EBE4]" 
                : "text-[#9C8870] dark:text-[#5C5652] hover:text-[#1A1008] dark:hover:text-[#F0EBE4]"
            }`}
          >
            <tab.icon className="w-3.5 h-3.5 mb-0.5" />
            {tab.name}
            {activeTab === tab.name && (
              <div className="absolute bottom-[-1px] left-0 w-full h-[1px] bg-[#1A1008] dark:bg-[#F0EBE4]" />
            )}
          </button>
        ))}
      </div>

      {/* TAB CONTENT: ACCOUNT */}
      {activeTab === "Account" && (
        <div className="flex flex-col gap-10 animate-in fade-in duration-300">
          
          {/* Avatar Section */}
          <div className="flex flex-col gap-4">
            <span className="text-[10px] uppercase tracking-[0.1em] text-[#9C8870] dark:text-[#5C5652] font-semibold">
              Profile Picture
            </span>
            <div className="flex items-center gap-6">
              <img 
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=128&h=128&q=80" 
                alt="Elena Marsh" 
                className="w-16 h-16 rounded-full object-cover"
              />
              <button className="flex items-center gap-2 px-4 py-2 border border-[#E8E0D5] dark:border-[#242424] rounded-lg text-[12px] font-medium text-[#1A1008] dark:text-[#F0EBE4] hover:border-[#C8973F] dark:hover:border-[#C8973F] transition-colors bg-transparent">
                <Upload className="w-3.5 h-3.5" />
                Upload New
              </button>
              <button className="text-[12px] font-medium text-[#9C8870] dark:text-[#5C5652] hover:text-red-500 transition-colors">
                Remove
              </button>
            </div>
          </div>

          <hr className="border-t border-[#E8E0D5] dark:border-[#242424]" />

          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex flex-col gap-2">
              <label className="text-[10px] uppercase tracking-[0.1em] text-[#9C8870] dark:text-[#5C5652] font-semibold">
                Full Name
              </label>
              <input 
                type="text" 
                defaultValue="Elena Marsh"
                className="w-full bg-transparent border border-[#E8E0D5] dark:border-[#242424] rounded-lg px-4 py-2.5 text-[14px] text-[#1A1008] dark:text-[#F0EBE4] focus:outline-none focus:border-[#C8973F] dark:focus:border-[#C8973F] transition-colors"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[10px] uppercase tracking-[0.1em] text-[#9C8870] dark:text-[#5C5652] font-semibold">
                Email Address
              </label>
              <input 
                type="email" 
                defaultValue="elena.marsh@example.com"
                className="w-full bg-transparent border border-[#E8E0D5] dark:border-[#242424] rounded-lg px-4 py-2.5 text-[14px] text-[#1A1008] dark:text-[#F0EBE4] focus:outline-none focus:border-[#C8973F] dark:focus:border-[#C8973F] transition-colors"
              />
            </div>
          </div>

          {/* Action Button */}
          <div className="pt-2">
            <button className="px-6 py-2.5 bg-[#1A1008] dark:bg-[#F0EBE4] text-[#F5F0EB] dark:text-[#0D0D0D] rounded-lg text-[13px] font-medium hover:opacity-90 transition-opacity">
              Save Changes
            </button>
          </div>

          <hr className="border-t border-[#E8E0D5] dark:border-[#242424] mt-4" />

          {/* Danger Zone */}
          <div className="flex flex-col gap-2">
            <span className="text-[14px] font-medium text-red-500">Delete Account</span>
            <p className="text-[13px] text-[#9C8870] dark:text-[#5C5652] max-w-lg mb-2">
              Permanently delete your account, novels, characters, and settings. This action cannot be undone.
            </p>
            <button className="w-fit px-4 py-2 border border-red-500/30 text-red-500 rounded-lg text-[12px] font-medium hover:bg-red-500/10 transition-colors">
              Delete Account
            </button>
          </div>
        </div>
      )}

      {/* TAB CONTENT: PREFERENCES */}
      {activeTab === "Preferences" && (
        <div className="flex flex-col gap-10 animate-in fade-in duration-300">
          
          {/* Theme Selection */}
          <div className="flex flex-col gap-4">
            <span className="text-[10px] uppercase tracking-[0.1em] text-[#9C8870] dark:text-[#5C5652] font-semibold">
              Interface Theme
            </span>
            <div className="flex gap-4">
              {['Light', 'Dark', 'System'].map((theme) => (
                <button 
                  key={theme}
                  className="px-5 py-2.5 border border-[#E8E0D5] dark:border-[#242424] rounded-lg text-[13px] text-[#1A1008] dark:text-[#F0EBE4] hover:border-[#C8973F] dark:hover:border-[#C8973F] focus:border-[#C8973F] dark:focus:border-[#C8973F] transition-colors bg-transparent"
                >
                  {theme}
                </button>
              ))}
            </div>
          </div>

          <hr className="border-t border-[#E8E0D5] dark:border-[#242424]" />

          {/* Editor Typography */}
          <div className="flex flex-col gap-4">
            <span className="text-[10px] uppercase tracking-[0.1em] text-[#9C8870] dark:text-[#5C5652] font-semibold">
              Editor Typography
            </span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button className="flex flex-col items-start gap-2 p-4 border border-[#C8973F] rounded-lg bg-[#C8973F]/[0.02]">
                <span className="font-serif text-[18px] text-[#1A1008] dark:text-[#F0EBE4]">Lora (Serif)</span>
                <span className="text-[12px] text-[#9C8870] dark:text-[#5C5652]">Best for traditional manuscript feels.</span>
              </button>
              <button className="flex flex-col items-start gap-2 p-4 border border-[#E8E0D5] dark:border-[#242424] rounded-lg hover:border-[#C8973F]/50 transition-colors">
                <span className="font-sans text-[18px] text-[#1A1008] dark:text-[#F0EBE4]">Jakarta (Sans)</span>
                <span className="text-[12px] text-[#9C8870] dark:text-[#5C5652]">Clean, modern, and minimal.</span>
              </button>
            </div>
          </div>

        </div>
      )}

      {/* TAB CONTENT: BILLING */}
      {activeTab === "Billing" && (
        <div className="flex flex-col gap-8 animate-in fade-in duration-300">
          
          <div className="p-6 border border-[#E8E0D5] dark:border-[#242424] rounded-xl flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-1">
                <span className="text-[11px] uppercase tracking-[0.15em] text-[#C8973F] font-bold">
                  Current Plan
                </span>
                <span className="text-[24px] font-semibold tracking-tight text-[#1A1008] dark:text-[#F0EBE4]">
                  Writely Free
                </span>
              </div>
              <span className="text-[24px] font-serif italic text-[#9C8870] dark:text-[#5C5652]">
                $0 / mo
              </span>
            </div>
            
            <p className="text-[13px] text-[#9C8870] dark:text-[#5C5652] max-w-md">
              You are currently on the free tier. Upgrade to Writely Pro for unlimited novels, advanced worldbuilding tools, and cloud backups.
            </p>

            <div className="pt-4">
              <button className="px-6 py-2.5 bg-[#C8973F] text-white rounded-lg text-[13px] font-medium hover:bg-[#b08436] transition-colors">
                Upgrade to Pro
              </button>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}