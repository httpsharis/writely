import { 
  LayoutDashboard, 
  Book, 
  Inbox, 
  Users, 
  Globe, 
  Search,
  Settings 
} from "lucide-react";

export interface NavItem {
  name: string;
  href: string;
  icon: React.ElementType;
  hasDot?: boolean; 
}

export const MAIN_NAV_LINKS: NavItem[] = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Projects", href: "/project", icon: Book, hasDot: true },
  { name: "Inbox", href: "/inbox", icon: Inbox },
  { name: "Characters", href: "/characters", icon: Users },
  { name: "World", href: "/world", icon: Globe },
  { name: "Search", href: "/search", icon: Search }
];

export const USER_MENU_LINKS: NavItem[] = [
  { name: "Settings", href: "/settings", icon: Settings },
];