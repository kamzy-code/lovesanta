import {
  LuBookmark,
  LuClock,
  LuHouse,
  LuLayoutDashboard,
  LuSettings,
  LuUser,
} from "react-icons/lu";
import { type IconType } from "react-icons";
import { routes } from "~/lib/common/routes";

export const items = [
  {
    value: "dashboard",
    label: "Dashboard",
    icon: LuLayoutDashboard,
    secondary: [
      {
        value: "overview",
        label: "Overview",
      },
      { value: "profile", label: "Profile" },
    ],
  },
  {
    value: "history",
    icon: LuClock,
    label: "History",
    secondary: [
      { value: "recent", label: "Recent Activity" },
      { value: "archived", label: "Archived" },
    ],
  },
  {
    value: "favorites",
    icon: LuBookmark,
    label: "Favorites",
    secondary: [
      { value: "bookmarks", label: "Bookmarks" },
      { value: "saved-items", label: "Saved Items" },
    ],
  },
  {
    value: "settings",
    icon: LuSettings,
    label: "Settings",
    secondary: [
      { value: "account", label: "Account" },
      { value: "preferences", label: "Preferences" },
      { value: "security", label: "Security" },
    ],
  },
];

export const staticSecondaryNavItems: SecondaryNavItem[] = [
  {
    value: "overview",
    label: "Home",
    path: routes.home,
    icon: LuHouse,
  },
  { value: "profile", label: "Profile", path: routes.profile, icon: LuUser },
];

export type NavItem = (typeof items)[number];
export type SecondaryNavItem = NavItem["secondary"][number] & {
  path: string;
  icon: IconType;
};
