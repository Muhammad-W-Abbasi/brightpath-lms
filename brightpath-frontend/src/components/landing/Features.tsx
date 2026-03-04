import { motion } from "framer-motion";
import { Shield, Users, FileClock, Waypoints, Gauge, Lock } from "lucide-react";

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

const features = [
  {
    icon: Shield,
    title: "JWT Authentication",
    description:
      "Stateless auth with refresh token rotation and secure HttpOnly cookie delivery.",
  },
  {
    icon: Users,
    title: "Role-Based Access",
    description:
      "Granular RBAC with admin, instructor, and student roles enforced at the API layer.",
  },
  {
    icon: FileClock,
    title: "Audit Logging",
    description:
      "Every mutation is timestamped and attributed. Full trail for compliance review.",
  },
  {
    icon: Waypoints,
    title: "REST API Design",
    description:
      "Consistent resource naming, pagination, and error envelopes across all endpoints.",
  },
  {
    icon: Gauge,
    title: "Rate Limiting",
    description:
      "Per-user rate limits with token bucket algorithm. Resistant to burst abuse.",
  },
  {
    icon: Lock,
    title: "Secure Headers",
    description:
      "CORS policy, HSTS, CSP, and X-Frame-Options configured on every response.",
  },
];

export default function Features() {
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
          // capabilities
        </motion.p>
        <motion.h2 variants={itemVariants} className="mt-4 text-3xl md:text-4xl font-semibold text-[#18181b]">
          Built with the right defaults.
        </motion.h2>
        <motion.p variants={itemVariants} className="mt-4 text-base text-[#52525b] leading-relaxed max-w-2xl">
          No shortcuts. Every layer — auth, API design, data modeling — was engineered deliberately.
        </motion.p>

        <motion.div variants={containerVariants} className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <motion.article
                key={feature.title}
                variants={itemVariants}
                whileHover={{ y: -2, boxShadow: "0 10px 20px rgba(24,24,27,0.06)" }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                className="bg-[#f8f9fb] border border-[#e4e4e7] rounded-xl p-6"
              >
                <Icon size={18} className="text-[#2563eb]" />
                <h3 className="text-lg font-medium text-[#18181b] mt-4">{feature.title}</h3>
                <p className="text-sm text-[#52525b] mt-2 leading-relaxed">{feature.description}</p>
              </motion.article>
            );
          })}
        </motion.div>
      </motion.div>
    </section>
  );
}
