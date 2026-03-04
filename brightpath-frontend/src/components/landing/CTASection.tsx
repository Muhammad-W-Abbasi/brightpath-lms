import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function CTASection() {
  return (
    <section className="py-28 border-t border-[#e4e4e7]">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        viewport={{ once: true, margin: "-80px" }}
        className="max-w-xl mx-auto px-6 text-center"
      >
        <p className="font-mono text-xs uppercase tracking-widest text-[#71717a]">// ready</p>
        <h2 className="mt-4 text-3xl md:text-4xl font-semibold text-[#18181b] tracking-tight">
          Explore the platform.
        </h2>
        <p className="mt-4 text-base text-[#52525b] leading-relaxed">
          Sign in to BrightPath and explore the full LMS — course management,
          enrollment, progress tracking, and the admin dashboard.
        </p>

        <motion.div whileHover={{ scale: 1.01, y: -1 }} transition={{ duration: 0.2 }} className="mt-10">
          <Link
            to="/dashboard"
            className="h-11 px-8 rounded-lg bg-[#2563eb] text-white inline-flex items-center text-sm font-medium"
          >
            Sign in to BrightPath
          </Link>
        </motion.div>

        <p className="mt-5 font-mono text-xs text-[#a1a1aa]">
          Open source · Portfolio project · No account required for demo
        </p>
      </motion.div>
    </section>
  );
}
