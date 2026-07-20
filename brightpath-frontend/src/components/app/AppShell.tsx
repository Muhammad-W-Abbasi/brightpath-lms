import { ReactNode } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import PageContainer from "./PageContainer";
import type { NavKey } from "./Sidebar";

type AppShellProps = {
  activeSection: NavKey;
  onNavigate: (section: NavKey) => void;
  title: string;
  email: string;
  onLogout: () => void;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  children: ReactNode;
};

export default function AppShell({
  activeSection,
  onNavigate,
  title,
  email,
  onLogout,
  searchValue,
  onSearchChange,
  children,
}: AppShellProps) {
  return (
    <div className="min-h-screen bg-[#fafafa] text-[#18181b] flex">
      <Sidebar activeSection={activeSection} onNavigate={onNavigate} />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar
          title={title}
          email={email}
          activeSection={activeSection}
          onNavigate={onNavigate}
          onLogout={onLogout}
          searchValue={searchValue}
          onSearchChange={onSearchChange}
        />
        <PageContainer>{children}</PageContainer>
      </div>
    </div>
  );
}
