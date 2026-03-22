import { Link } from "react-router-dom";
import { ArrowRight, BookOpen, FolderKanban, GraduationCap, LayoutDashboard, Settings, Users } from "lucide-react";

const stats = [
  "Spring Boot backend",
  "PostgreSQL database",
  "Deployed on Render and Netlify",
] as const;

const courses = [
  {
    icon: BookOpen,
    iconClassName: "bg-indigo-500/20 text-indigo-300",
    title: "COMP 101: Java Basics",
    meta: "45 students • Updated 2h ago",
  },
  {
    icon: GraduationCap,
    iconClassName: "bg-emerald-500/20 text-emerald-300",
    title: "MATH 202: Calculus II",
    meta: "32 students • Updated 1d ago",
  },
] as const;

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-[#0f172a] pb-20 pt-32 md:pb-32 md:pt-44">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-[-12%] top-[-10%] h-80 w-80 rounded-full bg-[#3755c3] opacity-30 blur-[140px]" />
        <div className="absolute bottom-[-12%] right-[-8%] h-96 w-96 rounded-full bg-[#b8c4ff] opacity-20 blur-[160px]" />
      </div>

      <div className="relative z-10 mx-auto grid max-w-7xl gap-16 px-6 lg:grid-cols-[minmax(0,1.02fr)_minmax(0,0.98fr)] lg:items-center">
        <div className="space-y-8">
          <span className="inline-flex rounded-full border border-[#b8c4ff]/30 bg-[#dde1ff]/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.22em] text-[#dde1ff]">
            Full-stack portfolio project
          </span>

          <div className="space-y-6">
            <h1 className="max-w-4xl text-5xl font-extrabold leading-[1.05] tracking-[-0.05em] text-white md:text-7xl">
              A learning management system built for{" "}
              <span className="text-[#b8c4ff]">real workflows</span>
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-slate-300 md:text-xl">
              BrightPath is a full-stack LMS built with React and Spring Boot,
              featuring JWT authentication, role-based access, secure REST APIs,
              and production-minded deployment.
            </p>
          </div>

          <div className="flex flex-wrap gap-4">
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 rounded-2xl bg-white px-8 py-4 text-base font-bold text-slate-950 shadow-xl shadow-white/10 transition duration-200 hover:-translate-y-0.5 hover:bg-slate-100"
            >
              Launch demo
              <ArrowRight size={18} />
            </Link>
            <a
              href="https://github.com/Muhammad-W-Abbasi/brightpath-lms"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center rounded-2xl border border-slate-700 px-8 py-4 text-base font-bold text-white transition duration-200 hover:bg-slate-800"
            >
              View source on GitHub
            </a>
          </div>

          <div className="flex flex-wrap gap-x-8 gap-y-4 border-t border-slate-800 pt-8 text-sm font-medium text-slate-400">
            {stats.map((item) => (
              <div key={item} className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#b8c4ff]" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="group relative">
          <div className="absolute -inset-1 rounded-[28px] bg-gradient-to-r from-[#3755c3] to-[#b8c4ff] opacity-25 blur-xl transition duration-700 group-hover:opacity-40" />
          <div className="relative aspect-[4/3] overflow-hidden rounded-[24px] border border-slate-700 bg-slate-900 shadow-2xl">
            <div className="flex h-10 items-center gap-3 border-b border-slate-700 bg-slate-800 px-4">
              <div className="flex gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-red-400/60" />
                <span className="h-2.5 w-2.5 rounded-full bg-amber-400/60" />
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/60" />
              </div>
              <div className="mx-auto flex max-w-md flex-1 items-center rounded-md bg-slate-950/60 px-3 py-1 text-[10px] text-slate-400">
                brightpath-lms.netlify.app
              </div>
            </div>

            <div className="flex h-[calc(100%-2.5rem)] overflow-hidden">
              <aside className="hidden w-40 flex-col gap-4 border-r border-slate-800 bg-[#0f172a] p-4 sm:flex">
                <div className="space-y-1 text-[10px]">
                  <div className="flex items-center gap-2 rounded bg-[#3755c3]/15 p-2 text-[#dde1ff]">
                    <LayoutDashboard size={14} />
                    Dashboard
                  </div>
                  <div className="flex items-center gap-2 rounded p-2 text-slate-400">
                    <BookOpen size={14} />
                    Courses
                  </div>
                  <div className="flex items-center gap-2 rounded p-2 text-slate-400">
                    <Users size={14} />
                    Students
                  </div>
                  <div className="flex items-center gap-2 rounded p-2 text-slate-400">
                    <FolderKanban size={14} />
                    Assignments
                  </div>
                  <div className="flex items-center gap-2 rounded p-2 text-slate-400">
                    <Settings size={14} />
                    Settings
                  </div>
                </div>
              </aside>

              <div className="flex-1 space-y-6 bg-slate-900 p-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-bold text-white">Overview</h2>
                  <span className="rounded-full bg-[#dde1ff]/10 px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.2em] text-[#dde1ff]">
                    Instructor
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  {[
                    ["12", "Active courses"],
                    ["1,240", "Enrolled students"],
                    ["8", "Pending tasks"],
                  ].map(([value, label]) => (
                    <div
                      key={label}
                      className="rounded-lg border border-slate-700/60 bg-slate-800 p-3"
                    >
                      <div className="text-[9px] uppercase tracking-[0.16em] text-slate-400">
                        {label}
                      </div>
                      <div className="mt-1 text-sm font-bold text-white">{value}</div>
                    </div>
                  ))}
                </div>

                <div className="space-y-3">
                  {courses.map((course) => {
                    const Icon = course.icon;
                    return (
                      <div
                        key={course.title}
                        className="flex items-center gap-4 rounded-lg border border-slate-700/40 bg-slate-800/50 p-3"
                      >
                        <div
                          className={`flex h-10 w-10 items-center justify-center rounded ${course.iconClassName}`}
                        >
                          <Icon size={18} />
                        </div>
                        <div>
                          <div className="text-[11px] font-bold text-white">{course.title}</div>
                          <div className="text-[9px] text-slate-500">{course.meta}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
