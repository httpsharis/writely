"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { useSession, signIn, signOut } from "next-auth/react";
import Image from "next/image";
import {
  Moon, Sun, PenLine, BookMarked,
  Globe, User2, Settings, LogOut, BookOpen,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const NAV_LINKS = [
  { name: "Write",   href: "/",        icon: PenLine    },
  { name: "Library", href: "/library", icon: BookMarked },
  { name: "World",   href: "/world",   icon: Globe      },
];

export function Navbar() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const { data: session, status } = useSession();

  if (pathname === "/login") return null;

  return (
    <>
      {/* ── DESKTOP: floating pill in center ── */}
      <header className="hidden md:flex sticky top-4 z-50 w-full justify-center px-4 pointer-events-none">
        <nav
          className="flex items-center gap-1 pointer-events-auto
            bg-white/55 dark:bg-black/40
            backdrop-blur-xl
            border border-white/75 dark:border-white/10
            rounded-full px-1.5 py-1.5
            shadow-[0_4px_24px_rgba(0,0,0,0.08),0_1px_2px_rgba(0,0,0,0.04)]
            dark:shadow-[0_4px_24px_rgba(0,0,0,0.3)]"
        >
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-1.5 pl-2 pr-3 transition-opacity hover:opacity-60"
          >
            <div className="w-[26px] h-[26px] bg-[#0a0a0a] dark:bg-white rounded-full flex items-center justify-center">
              <PenLine className="w-3 h-3 text-white dark:text-[#0a0a0a]" strokeWidth={1.8} />
            </div>
            <span className="text-[14px] font-bold tracking-[-0.02em] text-[#0a0a0a] dark:text-white">
              Writely<span className="text-indigo-500">_</span>
            </span>
          </Link>

          {/* separator */}
          <div className="w-px h-4 bg-black/10 dark:bg-white/10 mx-1" />

          {/* Nav links */}
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`px-3.5 py-1.5 rounded-full text-[13px] font-medium tracking-[-0.01em] transition-all
                  ${isActive
                    ? "bg-black/[0.07] dark:bg-white/[0.1] text-[#0a0a0a] dark:text-white"
                    : "text-black/45 dark:text-white/45 hover:text-black/75 dark:hover:text-white/75 hover:bg-black/[0.05] dark:hover:bg-white/[0.05]"
                  }`}
              >
                {link.name}
              </Link>
            );
          })}

          {/* separator */}
          <div className="w-px h-4 bg-black/10 dark:bg-white/10 mx-1" />

          {/* Theme toggle */}
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="w-8 h-8 rounded-full flex items-center justify-center
              text-black/40 dark:text-white/40
              hover:bg-black/[0.06] dark:hover:bg-white/[0.06]
              hover:text-black/70 dark:hover:text-white/70 transition-all"
            aria-label="Toggle theme"
          >
            <Sun className="w-[15px] h-[15px] dark:hidden" strokeWidth={1.6} />
            <Moon className="w-[15px] h-[15px] hidden dark:block" strokeWidth={1.6} />
          </button>

          {/* Avatar */}
          <DropdownMenu>
            <DropdownMenuTrigger className="w-[30px] h-[30px] rounded-full overflow-hidden ml-0.5
              border border-black/10 dark:border-white/10
              hover:shadow-[0_0_0_3px_rgba(0,0,0,0.1)] dark:hover:shadow-[0_0_0_3px_rgba(255,255,255,0.1)]
              transition-all outline-none">
              {status === "authenticated" && session?.user?.image ? (
                <Image
                  src={session.user.image}
                  alt={session.user.name ?? "Profile"}
                  width={30} height={30}
                  className="object-cover w-full h-full"
                />
              ) : (
                <div className="w-full h-full bg-[#0a0a0a] dark:bg-white flex items-center justify-center">
                  <User2 className="w-3.5 h-3.5 text-white dark:text-[#0a0a0a]" strokeWidth={1.6} />
                </div>
              )}
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              sideOffset={10}
              className="w-52 bg-white/80 dark:bg-black/80
                backdrop-blur-xl
                border border-white/75 dark:border-white/10
                rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.12)] p-1.5"
            >
              {status === "authenticated" ? (
                <>
                  <DropdownMenuLabel className="font-normal px-2.5 py-2.5">
                    <p className="text-[13px] font-semibold text-[#0a0a0a] dark:text-white tracking-[-0.01em] leading-none">
                      {session.user?.name}
                    </p>
                    <p className="text-[11.5px] text-black/40 dark:text-white/40 mt-1">
                      {session.user?.email}
                    </p>
                  </DropdownMenuLabel>

                  <DropdownMenuSeparator className="bg-black/[0.07] dark:bg-white/[0.07] my-1" />

                  <DropdownMenuItem className="px-2.5 py-2 rounded-[10px] cursor-pointer gap-2.5
                    text-[13px] font-medium text-[#0a0a0a] dark:text-white
                    focus:bg-black/[0.05] dark:focus:bg-white/[0.05]">
                    <BookOpen className="w-[15px] h-[15px] text-black/40 dark:text-white/40" strokeWidth={1.6} />
                    Author profile
                  </DropdownMenuItem>

                  <DropdownMenuItem className="px-2.5 py-2 rounded-[10px] cursor-pointer gap-2.5
                    text-[13px] font-medium text-[#0a0a0a] dark:text-white
                    focus:bg-black/[0.05] dark:focus:bg-white/[0.05]">
                    <Settings className="w-[15px] h-[15px] text-black/40 dark:text-white/40" strokeWidth={1.6} />
                    Settings
                  </DropdownMenuItem>

                  <DropdownMenuSeparator className="bg-black/[0.07] dark:bg-white/[0.07] my-1" />

                  <DropdownMenuItem
                    onClick={() => signOut()}
                    className="px-2.5 py-2 rounded-[10px] cursor-pointer gap-2.5
                      text-[13px] font-medium text-red-600 dark:text-red-400
                      focus:bg-red-50 dark:focus:bg-red-950/30"
                  >
                    <LogOut className="w-[15px] h-[15px]" strokeWidth={1.6} />
                    Sign out
                  </DropdownMenuItem>
                </>
              ) : (
                <DropdownMenuItem
                  onClick={() => signIn("google")}
                  className="px-2.5 py-2 rounded-[10px] cursor-pointer gap-2.5
                    text-[13px] font-medium text-[#0a0a0a] dark:text-white
                    focus:bg-black/[0.05] dark:focus:bg-white/[0.05]"
                >
                  <User2 className="w-[15px] h-[15px] text-black/40 dark:text-white/40" strokeWidth={1.6} />
                  Sign in with Google
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>
      </header>

      {/* ── MOBILE: floating glass bottom bar ── */}
      <div className="md:hidden fixed bottom-3 left-3 right-3 z-50">
        <nav className="flex items-center justify-around
          bg-white/60 dark:bg-black/50
          backdrop-blur-xl
          border border-white/80 dark:border-white/10
          rounded-[24px] px-2 pt-2.5 pb-3.5
          shadow-[0_4px_20px_rgba(0,0,0,0.1)]
          dark:shadow-[0_4px_20px_rgba(0,0,0,0.4)]">

          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href;
            const Icon = link.icon;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`flex flex-col items-center gap-1 px-4 transition-colors
                  ${isActive
                    ? "text-[#0a0a0a] dark:text-white"
                    : "text-black/32 dark:text-white/32"
                  }`}
              >
                <Icon className="w-5 h-5" strokeWidth={isActive ? 2.2 : 1.5} />
                <span className="text-[10px] font-medium">{link.name}</span>
                <span className={`w-1 h-1 rounded-full bg-indigo-500 transition-opacity
                  ${isActive ? "opacity-100" : "opacity-0"}`}
                />
              </Link>
            );
          })}

          {/* Me tab */}
          <Link
            href="/me"
            className={`flex flex-col items-center gap-1 px-4 transition-colors
              ${pathname === "/me"
                ? "text-[#0a0a0a] dark:text-white"
                : "text-black/32 dark:text-white/32"
              }`}
          >
            {status === "authenticated" && session?.user?.image ? (
              <Image
                src={session.user.image}
                alt="Me"
                width={20} height={20}
                className={`rounded-full object-cover border
                  ${pathname === "/me" ? "border-[#0a0a0a] dark:border-white" : "border-black/20 dark:border-white/20"}`}
              />
            ) : (
              <User2 className="w-5 h-5" strokeWidth={pathname === "/me" ? 2.2 : 1.5} />
            )}
            <span className="text-[10px] font-medium">Me</span>
            <span className={`w-1 h-1 rounded-full bg-indigo-500 transition-opacity
              ${pathname === "/me" ? "opacity-100" : "opacity-0"}`}
            />
          </Link>
        </nav>
      </div>

      {/* bottom padding so content isn't hidden behind mobile bar */}
      <div className="md:hidden h-24" />
    </>
  );
}