import { ReactNode } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import PageContainer from "./PageContainer";

type NavKey = "dashboard" | "courses" | "students" | "assignments" | "reports" | "settings";

type AppShellProps = {
  activeSection: NavKey;
  onNavigate: (section: NavKey) => void;
  title: string;
  email: string;
  onLogout: () => void;
  children: ReactNode;
};

export default function AppShell({
  activeSection,
  onNavigate,
  title,
  email,
  onLogout,
  children,
}: AppShellProps) {
  return (
    <div className="min-h-screen bg-[#fafafa] text-[#18181b] flex">
      <Sidebar activeSection={activeSection} onNavigate={onNavigate} />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar title={title} email={email} onLogout={onLogout} />
        <PageContainer>{children}</PageContainer>
      </div>
    </div>
  );
}
