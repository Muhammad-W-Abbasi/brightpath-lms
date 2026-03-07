import { motion } from "framer-motion";

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const },
  },
};

const layers = [
  ["React + TypeScript", "Component-driven UI with strict type safety"],
  ["Vite + Tailwind", "Fast builds, utility-first styling"],
  ["Spring Boot", "Opinionated Java backend with embedded Tomcat"],
  ["Spring Security", "JWT filter chain with stateless session config"],
  ["PostgreSQL", "Relational data with foreign key integrity"],
  ["REST API", "JSON over HTTP with versioned endpoints"],
] as const;

function Arrow({ label, delay }: { label: string; delay: number }) {
  return (
    <div className="flex flex-col items-center relative">
      <motion.div
        initial={{ opacity: 0, scaleY: 0 }}
        whileInView={{ opacity: 1, scaleY: 1 }}
        transition={{ duration: 0.45, delay, ease: "easeOut" }}
        viewport={{ once: true, margin: "-80px" }}
        className="flex flex-col items-center origin-top"
      >
        <div className="h-[78px] w-px bg-[#2563eb]/40" />
        <svg width="8" height="6" viewBox="0 0 8 6" className="-mt-px block" aria-hidden="true">
          <path d="M0.8 0.8L4 4.8L7.2 0.8" stroke="#2563eb" strokeOpacity="0.4" strokeLinecap="round" />
        </svg>
      </motion.div>
      <p className="absolute left-full top-6 pl-3 whitespace-nowrap font-mono text-[10px] tracking-[0.06em] text-[#71717a]">
        {label}
      </p>
    </div>
  );
}

export default function ArchitectureSection() {
  return (
    <section className="py-28 border-t border-[#e4e4e7]">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        variants={containerVariants}
        className="max-w-6xl mx-auto px-6"
      >
        <motion.p variants={itemVariants} className="font-mono text-xs uppercase tracking-widest text-[#71717a]">
          // architecture
        </motion.p>
        <motion.h2 variants={itemVariants} className="mt-4 text-3xl md:text-4xl font-semibold text-[#18181b]">
          Designed for production.
        </motion.h2>
        <motion.p variants={itemVariants} className="mt-4 text-base text-[#52525b] leading-relaxed max-w-2xl">
          The stack was chosen for clarity, not novelty. Every decision has a reason.
        </motion.p>

        <div className="mt-14 grid grid-cols-1 lg:grid-cols-2 gap-10">
          <motion.div variants={containerVariants} className="space-y-3">
            {layers.map(([name, description]) => (
              <motion.div
                key={name}
                variants={itemVariants}
                className="flex gap-4 border border-[#e4e4e7] rounded-lg bg-white p-4"
              >
                <span className="w-px bg-[#2563eb] opacity-30" />
                <div>
                  <p className="font-mono text-sm text-[#18181b]">{name}</p>
                  <p className="text-xs text-[#52525b] mt-1">{description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <motion.div variants={containerVariants} className="flex flex-col items-center justify-center mx-auto w-full max-w-md">
            <motion.div
              variants={itemVariants}
              className="w-48 text-center rounded-lg border border-[#e4e4e7] bg-white px-6 py-3 font-mono text-sm text-[#18181b]"
            >
              React UI
            </motion.div>

            <Arrow label="HTTP / JWT" delay={0.48} />

            <motion.div
              variants={itemVariants}
              className="w-48 text-center rounded-lg border border-[#e4e4e7] bg-white px-6 py-3 font-mono text-sm text-[#18181b]"
            >
              Spring Boot
            </motion.div>

            <Arrow label="JDBC" delay={0.62} />

            <motion.div
              variants={itemVariants}
              className="w-48 text-center rounded-lg border border-[#e4e4e7] bg-white px-6 py-3 font-mono text-sm text-[#18181b]"
            >
              PostgreSQL
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}