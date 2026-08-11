export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-canvas px-4">
      <div className="w-full max-w-sm">
        <div className="mb-6 text-center">
          <h1 className="text-lg font-semibold text-white">AI Meeting Autopsy</h1>
          <p className="text-xs text-muted">Analyze. Diagnose. Improve.</p>
        </div>
        {children}
      </div>
    </div>
  );
}
