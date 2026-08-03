export default function PageBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-[2]" aria-hidden="true">
      {/* Subtle grid */}
      <div
        // `page-background-grid` : point d'accroche pour la DA TubeForge, qui
        // retrace cette grille en blanc. Le violet ci-dessous est écrit en dur,
        // donc hors de portée du remappage des variables Tailwind.
        className="page-background-grid absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(139,92,246,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,0.3) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />
      {/* Top glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-purple-600/8 rounded-full blur-[150px]" />
    </div>
  );
}
