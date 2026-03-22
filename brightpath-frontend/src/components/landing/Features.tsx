import { Database, LayoutGrid, LockKeyhole } from "lucide-react";

const features = [
  {
    icon: LockKeyhole,
    title: "Secure authentication",
    description:
      "JWT-based stateless security with password hashing, protected routes, and production-ready access control.",
  },
  {
    icon: LayoutGrid,
    title: "Course management",
    description:
      "Instructor and student flows are both modeled, from course creation and enrollment to announcements and course participation.",
  },
  {
    icon: Database,
    title: "Production backend",
    description:
      "Spring Boot REST APIs backed by PostgreSQL and Flyway migrations to keep schema changes consistent across environments.",
  },
] as const;

export default function Features() {
  return (
    <section id="features" className="bg-[#faf8ff] py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <h2 className="text-3xl font-extrabold tracking-[-0.04em] text-[#131b2e] md:text-4xl">
            Built to model a real learning product
          </h2>
          <div className="mx-auto mt-4 h-1.5 w-20 rounded-full bg-[#3755c3]" />
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <article
                key={feature.title}
                className="group rounded-[24px] border border-[#dde1ff] bg-white p-8 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_70px_rgba(55,85,195,0.10)]"
              >
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#dde1ff]/50 text-[#3755c3] transition duration-300 group-hover:scale-110">
                  <Icon size={24} />
                </div>
                <h3 className="mb-3 text-xl font-bold text-[#131b2e]">{feature.title}</h3>
                <p className="leading-7 text-[#444653]">{feature.description}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
