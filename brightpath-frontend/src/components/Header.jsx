function getInitials(email = "") {
  const local = email.split("@")[0] || "";
  const parts = local.split(/[._-]/).filter(Boolean);
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  return local.slice(0, 2).toUpperCase() || "U";
}

function Header({ title, subtitle, email, role }) {
  return (
    <header className="bp-header">
      <div>
        <h1 className="bp-header-title">{title}</h1>
        {subtitle ? <p className="bp-header-subtitle">{subtitle}</p> : null}
      </div>
      <div className="bp-user-pill">
        <span className="bp-user-avatar">{getInitials(email)}</span>
        <span className="bp-user-email">{email}</span>
        <span className="bp-user-role">{role}</span>
      </div>
    </header>
  );
}

export default Header;
