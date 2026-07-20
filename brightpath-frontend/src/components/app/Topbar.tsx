import { Bell, LogOut, Menu, Settings, User, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { navItems, type NavKey } from "./Sidebar";

type TopbarProps = {
  title: string;
  email: string;
  activeSection: NavKey;
  onNavigate: (section: NavKey) => void;
  onLogout: () => void;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
};

function getInitials(email: string) {
  const local = email.split("@")[0] || "U";
  const parts = local.split(/[._-]/).filter(Boolean);
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  return local.slice(0, 2).toUpperCase();
}

export default function Topbar({
  title,
  email,
  activeSection,
  onNavigate,
  onLogout,
  searchValue = "",
  onSearchChange,
}: TopbarProps) {
  const [accountOpen, setAccountOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function onDocumentClick(event: MouseEvent) {
      if (!menuRef.current) {
        return;
      }
      if (!menuRef.current.contains(event.target as Node)) {
        setAccountOpen(false);
      }
    }

    document.addEventListener("mousedown", onDocumentClick);
    return () => document.removeEventListener("mousedown", onDocumentClick);
  }, []);

  return (
    <header className="relative min-h-14 bg-white border-b border-[#e4e4e7] flex items-center justify-between gap-3 px-4 sm:px-6">
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          onClick={() => setMobileNavOpen((prev) => !prev)}
          className="md:hidden h-10 w-10 rounded-md border border-[#e4e4e7] bg-white hover:bg-gray-50 inline-flex items-center justify-center text-[#52525b]"
          aria-label={mobileNavOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={mobileNavOpen}
        >
          {mobileNavOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </button>
        <h1 className="truncate text-base font-semibold text-[#18181b]">{title}</h1>
      </div>

      <div className="flex min-w-0 items-center gap-2 sm:gap-3">
        <input
          type="text"
          placeholder={onSearchChange ? "Search courses and tasks" : "Search unavailable"}
          aria-label={onSearchChange ? "Search courses and tasks" : "Search unavailable"}
          title={onSearchChange ? "Search loaded courses and course tasks." : "Search is not available on this page yet."}
          value={searchValue}
          onChange={(event) => onSearchChange?.(event.target.value)}
          disabled={!onSearchChange}
          className={`hidden h-10 w-52 border border-[#e4e4e7] rounded-md px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 sm:block ${
            onSearchChange
              ? "bg-white text-[#18181b]"
              : "bg-[#f4f4f5] text-[#71717a] disabled:cursor-not-allowed"
          }`}
        />
        <button
          type="button"
          className="h-10 w-10 rounded-md border border-[#e4e4e7] bg-[#f4f4f5] inline-flex items-center justify-center text-[#71717a] disabled:cursor-not-allowed"
          aria-label="Notifications coming soon"
          title="Notifications will be available after the notification center is implemented."
          disabled
        >
          <Bell className="h-4 w-4" />
        </button>
        <div className="relative" ref={menuRef}>
          <button
            type="button"
            onClick={() => setAccountOpen((prev) => !prev)}
            className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-medium"
            aria-label="Open account menu"
            aria-expanded={accountOpen}
          >
            {getInitials(email)}
          </button>

          {accountOpen ? (
            <div className="absolute right-0 mt-2 w-40 bg-white border border-[#e4e4e7] rounded-md shadow-lg z-20 py-1">
              <button
                type="button"
                onClick={() => undefined}
                disabled
                title="Profile editing will be available after profile preferences are implemented."
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-[#71717a] disabled:cursor-not-allowed"
              >
                <User className="w-4 h-4 text-[#52525b]" />
                Profile soon
              </button>
              <button
                type="button"
                onClick={() => {
                  setAccountOpen(false);
                  onNavigate("settings");
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-[#18181b] hover:bg-gray-50"
              >
                <Settings className="w-4 h-4 text-[#52525b]" />
                Settings
              </button>
              <button
                type="button"
                onClick={() => {
                  setAccountOpen(false);
                  onLogout();
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-[#18181b] hover:bg-gray-50"
              >
                <LogOut className="w-4 h-4 text-[#52525b]" />
                Logout
              </button>
            </div>
          ) : null}
        </div>
      </div>

      {mobileNavOpen ? (
        <div className="absolute left-0 right-0 top-full z-30 border-b border-[#e4e4e7] bg-white p-3 shadow-lg md:hidden">
          <nav className="grid gap-1" aria-label="Mobile navigation">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = activeSection === item.key;
              return (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => {
                    onNavigate(item.key);
                    setMobileNavOpen(false);
                  }}
                  className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors ${
                    active ? "bg-blue-50 text-blue-600" : "text-[#52525b] hover:bg-[#f8f9fb]"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      ) : null}
    </header>
  );
}
