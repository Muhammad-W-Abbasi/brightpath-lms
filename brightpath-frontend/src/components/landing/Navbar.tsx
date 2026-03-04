import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? "backdrop-blur-md bg-[#fafafa]/80 border-b border-[#e4e4e7]"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="inline-flex items-center gap-2 text-[#18181b] text-sm font-semibold">
          <span className="h-2 w-2 rounded-[2px] bg-[#2563eb]" />
          BrightPath
        </Link>

        <div className="flex items-center gap-2">
          <Link
            to="/dashboard"
            className="h-8 px-4 text-sm inline-flex items-center rounded-md border border-[#e4e4e7] bg-white text-[#18181b] hover:bg-[#f4f4f5] transition-colors"
          >
            Sign in
          </Link>
          <Link
            to="/dashboard"
            className="h-8 px-4 text-sm inline-flex items-center rounded-md bg-[#2563eb] text-white hover:bg-[#1d4ed8] transition-colors"
          >
            Get started
          </Link>
        </div>
      </div>
    </header>
  );
}
