"use client";

import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export function ThemeToggle() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    // useEffect only runs on the client, so now we can safely show the UI
    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        // Return a blank placeholder of the exact same size to prevent layout shift
        return <div className="w-10 h-10" />;
    }

    return (
        <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="relative w-10 h-10 flex items-center justify-center rounded-full text-foreground/60 hover:text-foreground hover:bg-foreground/5 transition-colors overflow-hidden"
            aria-label="Toggle Theme"
        >
            {/* Sun icon rotates and shrinks away in dark mode */}
            <Sun className="w-4 h-4 absolute transition-all duration-300 scale-100 opacity-100 dark:-rotate-90 dark:scale-0 dark:opacity-0" />

            {/* Moon icon rotates and scales up in dark mode */}
            <Moon className="w-4 h-4 absolute transition-all duration-300 rotate-90 scale-0 opacity-0 dark:rotate-0 dark:scale-100 dark:opacity-100" />
        </button>
    );
}