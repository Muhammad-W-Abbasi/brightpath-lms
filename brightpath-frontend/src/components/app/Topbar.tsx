import { Bell, LogOut, Settings, User } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type TopbarProps = {
  title: string;
  email: string;
  onLogout: () => void;
};

function getInitials(email: string) {
  const local = email.split("@")[0] || "U";
  const parts = local.split(/[._-]/).filter(Boolean);
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  return local.slice(0, 2).toUpperCase();
}

export default function Topbar({ title, email, onLogout }: TopbarProps) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function onDocumentClick(event: MouseEvent) {
      if (!menuRef.current) {
        return;
      }
      if (!menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", onDocumentClick);
    return () => document.removeEventListener("mousedown", onDocumentClick);
  }, []);

  return (
    <header className="h-14 bg-white border-b border-[#e4e4e7] flex items-center justify-between px-6">
      <h1 className="text-base font-semibold text-[#18181b]">{title}</h1>

      <div className="flex items-center gap-3">
        <input
          type="text"
          placeholder="Search"
          className="h-10 border border-[#e4e4e7] rounded-md px-3 bg-white text-sm text-[#18181b] focus:outline-none focus:ring-2 focus:ring-blue-500/20"
        />
        <button
          type="button"
          className="h-10 w-10 rounded-md border border-[#e4e4e7] bg-white hover:bg-gray-50 inline-flex items-center justify-center text-[#52525b]"
        >
          <Bell className="h-4 w-4" />
        </button>
        <div className="relative" ref={menuRef}>
          <button
            type="button"
            onClick={() => setOpen((prev) => !prev)}
            className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-medium"
          >
            {getInitials(email)}
          </button>

          {open ? (
            <div className="absolute right-0 mt-2 w-40 bg-white border border-[#e4e4e7] rounded-md shadow-lg z-20 py-1">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-[#18181b] hover:bg-gray-50"
              >
                <User className="w-4 h-4 text-[#52525b]" />
                Profile
              </button>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-[#18181b] hover:bg-gray-50"
              >
                <Settings className="w-4 h-4 text-[#52525b]" />
                Settings
              </button>
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
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
    </header>
  );
}
