import { PenTool, Library, Globe, Settings, User, Search } from "lucide-react";

// We export this so any component in the app can use it
export const MAIN_NAV_LINKS = [
    {
        name: "Home",
        href: "/",
        icon: PenTool
    },
    {
        name: "Library",
        href: "/library",
        icon: Library
    },
    {
        name: "Universe",
        href: "/universe",
        icon: Globe
    },
    {
        name: "Search",
        href: "/search",
        icon: Search
    }
];

// You can even plan ahead for a user dropdown menu later!
export const USER_MENU_LINKS = [
    { name: "Profile", href: "/profile", icon: User },
    { name: "Settings", href: "/settings", icon: Settings },
];