function LoadingScreen() {
  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] flex items-center justify-center">
      <div className="flex items-center gap-3 rounded-lg border border-[#e4e4e7] bg-white px-5 py-4 shadow-sm">
        <span
          className="h-4 w-4 rounded-full border-2 border-[#93c5fd] border-t-[#2563eb] animate-spin"
          aria-hidden="true"
        />
        <p className="text-sm text-[#52525b]">Checking session...</p>
      </div>
    </div>
  );
}

export default LoadingScreen;
