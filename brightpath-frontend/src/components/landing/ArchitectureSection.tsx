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

          <motion.div variants={containerVariants} className="relative mx-auto w-full max-w-md h-[360px]">
            <motion.div
              variants={itemVariants}
              transition={{ duration: 0.4, delay: 0 }}
              className="absolute left-1/2 top-2 -translate-x-1/2 w-48 text-center rounded-lg border border-[#e4e4e7] bg-white px-6 py-3 font-mono text-sm text-[#18181b]"
            >
              React UI
            </motion.div>
            <motion.div
              variants={itemVariants}
              transition={{ duration: 0.4, delay: 0.15 }}
              className="absolute left-1/2 top-[140px] -translate-x-1/2 w-48 text-center rounded-lg border border-[#e4e4e7] bg-white px-6 py-3 font-mono text-sm text-[#18181b]"
            >
              Spring Boot
            </motion.div>
            <motion.div
              variants={itemVariants}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="absolute left-1/2 bottom-2 -translate-x-1/2 w-48 text-center rounded-lg border border-[#e4e4e7] bg-white px-6 py-3 font-mono text-sm text-[#18181b]"
            >
              PostgreSQL
            </motion.div>

            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 360 360" fill="none" aria-hidden="true">
              <motion.path
                d="M180 54V132"
                stroke="#2563eb"
                strokeWidth="1"
                strokeOpacity="0.4"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                transition={{ duration: 0.45, delay: 0.48, ease: "easeOut" }}
                viewport={{ once: true, margin: "-80px" }}
              />
              <motion.path
                d="M180 196V274"
                stroke="#2563eb"
                strokeWidth="1"
                strokeOpacity="0.4"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                transition={{ duration: 0.45, delay: 0.62, ease: "easeOut" }}
                viewport={{ once: true, margin: "-80px" }}
              />
              <motion.path
                d="M176 128L180 132L184 128"
                stroke="#2563eb"
                strokeWidth="1"
                strokeOpacity="0.4"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                transition={{ duration: 0.3, delay: 0.56, ease: "easeOut" }}
                viewport={{ once: true, margin: "-80px" }}
              />
              <motion.path
                d="M176 270L180 274L184 270"
                stroke="#2563eb"
                strokeWidth="1"
                strokeOpacity="0.4"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                transition={{ duration: 0.3, delay: 0.7, ease: "easeOut" }}
                viewport={{ once: true, margin: "-80px" }}
              />
              <text x="192" y="98" fill="#71717a" fontSize="10" fontFamily="monospace" letterSpacing="0.06em">
                HTTP / JWT
              </text>
              <text x="192" y="238" fill="#71717a" fontSize="10" fontFamily="monospace" letterSpacing="0.06em">
                JDBC
              </text>
            </svg>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
