import { ContainerScroll } from "../ui/container-scroll-animation";

export default function ProductPreview() {
  return (
    <ContainerScroll
      titleComponent={
        <>
          <p className="font-mono text-xs uppercase tracking-widest text-[#71717a]">// product</p>
          <h2 className="mt-4 text-3xl md:text-4xl font-semibold text-[#18181b] tracking-tight">
            Clean interfaces. Real data.
          </h2>
          <p className="mt-4 text-base leading-relaxed text-[#52525b] max-w-2xl mx-auto">
            BrightPath surfaces the state of your LMS in one place: course health,
            enrollment, completion metrics, and operational visibility.
          </p>
        </>
      }
    >
      <div className="h-full w-full bg-white">
        <div className="h-10 border-b border-[#e4e4e7] bg-[#f8f9fb] px-4 flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-[#ef4444]" />
            <span className="h-3 w-3 rounded-full bg-[#f59e0b]" />
            <span className="h-3 w-3 rounded-full bg-[#22c55e]" />
          </div>
          <div className="ml-2 h-6 rounded-md border border-[#e4e4e7] bg-white px-3 flex items-center font-mono text-xs text-[#71717a]">
            brightpath.local/dashboard
          </div>
        </div>

        <div className="grid grid-cols-[190px_1fr] h-[calc(100%-2.5rem)]">
          <aside className="border-r border-[#e4e4e7] bg-[#f8f9fb] p-4">
            <p className="font-mono text-[11px] uppercase tracking-widest text-[#71717a] mb-3">Navigation</p>
            <ul className="space-y-2 text-sm text-[#52525b]">
              <li className="rounded-md bg-white border border-[#e4e4e7] px-3 py-2 text-[#18181b]">Dashboard</li>
              <li className="rounded-md px-3 py-2">Courses</li>
              <li className="rounded-md px-3 py-2">Students</li>
              <li className="rounded-md px-3 py-2">Assignments</li>
              <li className="rounded-md px-3 py-2">Reports</li>
              <li className="rounded-md px-3 py-2">Settings</li>
            </ul>
          </aside>

          <div className="p-6 overflow-hidden">
            <div className="grid grid-cols-4 gap-3">
              {[
                ["12", "Courses"],
                ["284", "Enrollments"],
                ["94%", "Completion"],
                ["18", "Active Students"],
              ].map(([value, label]) => (
                <div key={label} className="rounded-lg border border-[#e4e4e7] bg-[#f8f9fb] p-4">
                  <p className="text-2xl font-semibold text-[#18181b]">{value}</p>
                  <p className="mt-1 font-mono text-xs uppercase tracking-wider text-[#71717a]">{label}</p>
                </div>
              ))}
            </div>

            <div className="mt-5 rounded-lg border border-[#e4e4e7] overflow-hidden">
              <div className="grid grid-cols-4 bg-[#f8f9fb] text-[#71717a] font-mono text-xs uppercase tracking-wider px-4 py-3">
                <span>Course Name</span>
                <span>Instructor</span>
                <span>Students</span>
                <span>Completion</span>
              </div>
              {[
                ["Intro to React", "A. Khan", "46", "96%"],
                ["Spring Boot Fundamentals", "M. Singh", "38", "91%"],
                ["Database Design", "R. Patel", "29", "88%"],
                ["Algorithms 101", "S. Chen", "33", "93%"],
              ].map((row) => (
                <div
                  key={row[0]}
                  className="grid grid-cols-4 px-4 py-3 border-t border-[#e4e4e7] text-sm text-[#52525b] bg-white"
                >
                  <span className="text-[#18181b]">{row[0]}</span>
                  <span>{row[1]}</span>
                  <span>{row[2]}</span>
                  <span>{row[3]}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </ContainerScroll>
  );
}
