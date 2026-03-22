import { MicVocal, School, CheckCircle2 } from "lucide-react";

const roles = [
  {
    title: "Instructor",
    subtitle: "Course Creation & Management",
    icon: MicVocal,
    iconClassName: "bg-[#3755c3] text-white shadow-[0_18px_40px_rgba(55,85,195,0.24)]",
    checkClassName: "text-[#3755c3]",
    items: [
      "Create and manage courses",
      "Generate join codes",
      "Manage student lists",
      "Post course announcements",
      "Assign and track student tasks",
    ],
  },
  {
    title: "Student",
    subtitle: "Learning Experience",
    icon: School,
    iconClassName: "bg-[#dae2fd] text-[#5c647a]",
    checkClassName: "text-[#565e74]",
    items: [
      "Join courses with a code",
      "View enrolled courses",
      "Complete instructor-assigned tasks",
      "Track personal completion status",
      "Access course announcements",
    ],
  },
] as const;

export default function RolesSection() {
  return (
    <section id="roles" className="bg-[#f9f8f5] py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-extrabold tracking-[-0.04em] text-[#131b2e] md:text-4xl">
            Designed for two distinct user experiences
          </h2>
        </div>

        <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-2">
          {roles.map((role) => {
            const Icon = role.icon;

            return (
              <article
                key={role.title}
                className="flex flex-col items-center rounded-[24px] border border-slate-200/60 bg-[#faf8ff] p-6 text-center shadow-sm md:p-8"
              >
                <div className={`mb-6 flex h-14 w-14 items-center justify-center rounded-full ${role.iconClassName}`}>
                  <Icon size={24} />
                </div>
                <h3 className="text-xl font-bold text-[#131b2e]">{role.title}</h3>
                <p className="mb-6 mt-1 text-xs font-medium uppercase tracking-[0.2em] text-[#5c647a]">
                  {role.subtitle}
                </p>

                <ul className="mx-auto w-full max-w-xs space-y-3 text-left">
                  {role.items.map((item) => (
                    <li key={item} className="flex items-center gap-2.5 text-sm text-[#444653]">
                      <CheckCircle2 size={18} className={role.checkClassName} />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
