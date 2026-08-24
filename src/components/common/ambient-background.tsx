export function AmbientBackground() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div className="absolute -left-40 -top-40 h-[520px] w-[520px] animate-drift-slow rounded-full bg-brand/[0.10] blur-[120px]" />
      <div className="absolute -right-32 top-1/4 h-[420px] w-[420px] animate-drift rounded-full bg-brand-2/[0.10] blur-[110px]" />
      <div className="absolute bottom-0 left-1/3 h-[380px] w-[380px] animate-drift-slow rounded-full bg-brand/[0.06] blur-[100px]" />
      <div
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />
    </div>
  );
}
