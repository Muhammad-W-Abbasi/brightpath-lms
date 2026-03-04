import Sidebar from "./Sidebar";
import Header from "./Header";

function Layout({
  role,
  email,
  activeSection,
  onNavigate,
  onLogout,
  title,
  subtitle,
  children,
}) {
  return (
    <div className="bp-shell">
      <Sidebar
        role={role}can 
        activeSection={activeSection}
        onNavigate={onNavigate}
        onLogout={onLogout}
      />
      <div className="bp-main">
        <Header title={title} subtitle={subtitle} email={email} role={role} />
        <main className="bp-content">{children}</main>
      </div>
    </div>
  );
}

export default Layout;
