import { Link } from "react-router-dom";

export default function CTASection() {
  return (
    <section id="demo" className="relative overflow-hidden bg-[#0f172a] py-24">
      <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-[#3755c3]/20 blur-[100px]" />
      <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-[#dde1ff]/20 blur-[100px]" />

      <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
        <h2 className="text-4xl font-extrabold tracking-[-0.04em] text-white md:text-5xl">
          See it running in production
        </h2>
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-400">
          Explore the complete BrightPath workflow through the live demo, then choose a demo role directly from the sign-in screen.
        </p>

        <div className="mx-auto mb-12 mt-12 max-w-3xl rounded-[28px] border border-slate-700/50 bg-slate-800/35 p-8 text-left shadow-[0_30px_80px_rgba(15,23,42,0.28)] backdrop-blur-md">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="max-w-xl">
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#b8c4ff]">
                Live product walkthrough
              </p>
              <h3 className="mt-3 text-2xl font-bold tracking-[-0.03em] text-white">
                Launch the app and choose your demo role inside the sign-in flow
              </h3>
              <p className="mt-3 text-sm leading-7 text-slate-300">
                Step into BrightPath through a guided demo entry point built to showcase both sides of the platform.
              </p>
            </div>

            <div className="flex flex-wrap gap-3 md:max-w-[16rem] md:justify-end">
              <span className="rounded-full border border-slate-600 bg-slate-900/50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-300">
                Instructor flow
              </span>
              <span className="rounded-full border border-slate-600 bg-slate-900/50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-300">
                Student flow
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <Link
            to="/dashboard"
            className="inline-flex w-full items-center justify-center rounded-[20px] bg-white px-12 py-5 text-xl font-bold text-slate-950 shadow-2xl shadow-white/10 transition duration-200 hover:scale-[1.02] md:w-auto"
          >
            Launch BrightPath Demo
          </Link>
          <div>
            <a
              href="https://github.com/Muhammad-W-Abbasi/brightpath-lms"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 font-medium text-slate-400 transition-colors hover:text-white"
            >
              View source on GitHub
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
