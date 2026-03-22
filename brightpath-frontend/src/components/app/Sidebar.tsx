import {
  LayoutDashboard,
  BookOpen,
  Users,
  ClipboardCheck,
  BarChart3,
  Settings,
} from "lucide-react";
import { ComponentType } from "react";

type NavKey = "dashboard" | "courses" | "students" | "assignments" | "reports" | "settings";

type SidebarProps = {
  activeSection: NavKey;
  onNavigate: (section: NavKey) => void;
};

const navItems: { key: NavKey; label: string; icon: ComponentType<{ className?: string }> }[] = [
  { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { key: "courses", label: "Courses", icon: BookOpen },
  { key: "students", label: "Students", icon: Users },
  { key: "assignments", label: "Assignments", icon: ClipboardCheck },
  { key: "reports", label: "Reports", icon: BarChart3 },
  { key: "settings", label: "Settings", icon: Settings },
];

export default function Sidebar({ activeSection, onNavigate }: SidebarProps) {
  return (
    <aside className="w-64 bg-white border-r border-[#e4e4e7] hidden md:flex md:flex-col">
      <div className="h-14 px-5 border-b border-[#e4e4e7] flex items-center">
        <p className="text-sm font-semibold text-[#18181b]">BrightPath LMS</p>
      </div>

      <nav className="p-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = activeSection === item.key;

          return (
            <button
              key={item.key}
              type="button"
              onClick={() => onNavigate(item.key)}
              className={`w-full flex items-center gap-3 px-4 py-2 rounded-md text-sm transition-colors ${
                active
                  ? "bg-blue-50 text-blue-600"
                  : "text-[#52525b] hover:bg-[#f8f9fb]"
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
