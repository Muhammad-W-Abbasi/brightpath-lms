import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const ease = [0.16, 1, 0.3, 1] as const;

export default function Hero() {
  return (
    <section className="min-h-screen flex items-center pt-24">
      <div className="max-w-6xl mx-auto px-6 w-full text-center">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2, ease }}
          className="font-mono text-xs uppercase tracking-widest text-[#71717a]"
        >
          // learning management system
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3, ease }}
          className="mt-6 text-5xl md:text-6xl font-semibold tracking-tight text-[#18181b]"
        >
          BrightPath LMS
          <br />
          A learning platform engineered with{" "}
          <span className="relative inline-block">
            modern backend architecture
            <svg
              className="absolute -bottom-3 left-0 w-full h-4 pointer-events-none"
              viewBox="0 0 460 20"
              fill="none"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <motion.path
                d="M5 14C95 3 218 4 318 11C364 14 409 15 455 10"
                stroke="#2563eb"
                strokeWidth="2"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.6, delay: 0.55, ease: "easeOut" }}
              />
            </svg>
          </span>
          .
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.45, ease }}
          className="mt-6 text-base leading-relaxed text-[#52525b] max-w-2xl mx-auto"
        >
          BrightPath is a full-stack LMS built on Spring Boot and React — with
          JWT authentication, role-based access, audit logging, and a clean REST API.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6, ease }}
          className="mt-10 flex items-center justify-center gap-4"
        >
          <motion.div whileHover={{ scale: 1.01, y: -1 }} transition={{ duration: 0.2, ease }}>
            <Link
              to="/dashboard"
              className="h-11 px-6 rounded-lg bg-[#2563eb] text-white inline-flex items-center text-sm font-medium shadow-sm"
            >
              Enter the platform
            </Link>
          </motion.div>

          <motion.div whileHover={{ scale: 1.01, y: -1 }} transition={{ duration: 0.2, ease }}>
            <a
              href="https://github.com/Muhammad-W-Abbasi/brightpath-lms"
              target="_blank"
              rel="noreferrer"
              className="h-11 px-6 rounded-lg border border-[#e4e4e7] bg-white text-[#18181b] inline-flex items-center text-sm font-medium"
            >
              View source
            </a>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1.2, ease: "easeOut" }}
          className="mt-14 flex justify-center"
        >
          <div className="h-12 w-px bg-gradient-to-b from-[#2563eb] to-transparent" />
        </motion.div>
      </div>
    </section>
  );
}
