const baseItems = [
  { key: "dashboard", label: "Dashboard" },
  { key: "my-courses", label: "My Courses" },
  { key: "join-course", label: "Join Course" },
];

function Sidebar({ role, activeSection, onNavigate, onLogout }) {
  const isInstructor = role === "INSTRUCTOR" || role === "ADMIN";
  const items = isInstructor
    ? [...baseItems, { key: "create-course", label: "Create Course" }]
    : baseItems;

  return (
    <aside className="bp-sidebar">
      <div className="bp-brand">
        <p className="bp-brand-mark">
          <span
            aria-hidden="true"
            className="inline-block h-2 w-2 rounded-[2px] bg-[#2563eb] mr-2 align-middle"
          />
          BrightPath LMS
        </p>
      </div>

      <nav className="bp-nav">
        {items.map((item) => (
          <button
            key={item.key}
            type="button"
            className={`bp-nav-item ${activeSection === item.key ? "is-active" : ""}`}
            onClick={() => onNavigate(item.key)}
          >
            {item.label}
          </button>
        ))}
      </nav>

      <button type="button" className="bp-logout-btn" onClick={onLogout}>
        Logout
      </button>
    </aside>
  );
}

export default Sidebar;
