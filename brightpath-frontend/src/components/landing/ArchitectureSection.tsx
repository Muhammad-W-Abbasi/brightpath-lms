import { Database, ShieldCheck } from "lucide-react";

const stack = ["Java", "Spring Boot", "React", "TypeScript", "PostgreSQL", "Flyway"] as const;

export default function ArchitectureSection() {
  return (
    <section id="architecture" className="bg-[#0f172a] py-24 text-white">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-20 text-center">
          <h2 className="text-3xl font-extrabold tracking-[-0.04em] md:text-5xl">
            Engineering decisions worth talking about
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-400">
            BrightPath models the kind of stack and separation of concerns you would expect in a real product, not a tutorial app.
          </p>
        </div>

        <div className="grid gap-16 lg:grid-cols-12 lg:items-start">
          <div className="lg:col-span-7">
            <div className="rounded-[32px] border border-slate-800 bg-slate-900/60 p-6 md:p-10">
              <div className="flex flex-col items-center gap-6">
                <div className="w-full max-w-md rounded-2xl border-l-4 border-[#3755c3] bg-slate-800 px-5 py-4 shadow-lg">
                  <h3 className="text-base font-bold text-[#dde1ff]">React + TypeScript</h3>
                  <p className="mt-1 text-[11px] font-medium uppercase tracking-[0.18em] text-slate-400">
                    Frontend application · Vite · Tailwind · Axios
                  </p>
                </div>
                <div className="h-10 w-px bg-slate-700" />
                <div className="w-full max-w-md rounded-2xl border-l-4 border-[#3755c3] bg-slate-800 px-5 py-4 shadow-lg">
                  <h3 className="text-base font-bold text-[#dde1ff]">Spring Boot REST API</h3>
                  <p className="mt-1 text-[11px] font-medium uppercase tracking-[0.18em] text-slate-400">
                    Java · Spring Security · JWT · RBAC
                  </p>
                </div>
                <div className="h-10 w-px bg-slate-700" />
                <div className="w-full max-w-md rounded-2xl border-l-4 border-[#3755c3] bg-slate-800 px-5 py-4 shadow-lg">
                  <h3 className="text-base font-bold text-[#dde1ff]">PostgreSQL</h3>
                  <p className="mt-1 text-[11px] font-medium uppercase tracking-[0.18em] text-slate-400">
                    Relational database · Flyway · JPA / Hibernate
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5">
            <h3 className="text-2xl font-bold">Tech Stack Maturity</h3>
            <div className="mb-16 mt-8 flex flex-wrap gap-3">
              {stack.map((item) => (
                <span
                  key={item}
                  className="rounded-xl border border-slate-700 bg-slate-800 px-5 py-3 text-sm font-medium text-slate-100"
                >
                  {item}
                </span>
              ))}
            </div>

            <div className="space-y-8">
              <div className="flex gap-5">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-[#3755c3]/20 text-[#dde1ff]">
                  <Database size={20} />
                </div>
                <div>
                  <h4 className="mb-2 text-xl font-bold">Flyway migrations</h4>
                  <p className="text-base leading-7 text-slate-400">
                    Versioned schema changes keep local, preview, and production environments aligned without manual database drift.
                  </p>
                </div>
              </div>

              <div className="flex gap-5">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-[#3755c3]/20 text-[#dde1ff]">
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <h4 className="mb-2 text-xl font-bold">Stateless security</h4>
                  <p className="text-base leading-7 text-slate-400">
                    JWT-backed auth and role-aware APIs make the system easier to scale while keeping access control explicit.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
