export default function Footer() {
  return (
    <footer className="bg-[#283044] py-12">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-8 text-sm tracking-wide md:flex-row">
        <div className="text-center text-lg font-bold text-[#faf8ff] md:text-left">
          BrightPath LMS - Built by Muhammad Wamiq Abbasi
        </div>
        <div className="flex items-center gap-8">
          <a
            href="https://github.com/Muhammad-W-Abbasi/brightpath-lms"
            target="_blank"
            rel="noreferrer"
            className="text-[#faf8ff]/60 transition duration-200 hover:text-white"
          >
            GitHub
          </a>
          <a href="mailto:instructor@brightpath.com" className="text-[#faf8ff]/60 transition duration-200 hover:text-white">
            Demo access
          </a>
        </div>
      </div>
    </footer>
  );
}
