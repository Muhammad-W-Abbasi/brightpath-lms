import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const navItems = [
  { label: "Features", href: "#features" },
  { label: "Architecture", href: "#architecture" },
  { label: "Roles", href: "#roles" },
  { label: "Demo", href: "#demo" },
] as const;

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "border-b border-white/10 bg-[rgba(15,23,42,0.78)] shadow-[0_18px_60px_rgba(15,23,42,0.24)] backdrop-blur-xl"
          : "bg-transparent"
      }`}
    >
      <nav className="mx-auto flex h-20 w-full max-w-7xl items-center justify-between px-6">
        <Link to="/" className="text-lg font-extrabold tracking-[-0.04em] text-white sm:text-xl">
          BrightPath LMS
        </Link>

        <div className="hidden items-center gap-8 text-sm font-medium text-slate-300 md:flex">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="transition-colors duration-200 hover:text-white"
            >
              {item.label}
            </a>
          ))}
        </div>

        <Link
          to="/dashboard"
          className="inline-flex items-center rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-slate-950 shadow-lg shadow-white/10 transition duration-200 hover:-translate-y-0.5 hover:bg-slate-100"
        >
          Try the demo
        </Link>
      </nav>
    </header>
  );
}
