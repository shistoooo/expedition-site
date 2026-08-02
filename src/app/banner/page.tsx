import { Layers, Globe, Scissors } from "lucide-react";
import TubeForgeAppMockup from "@/components/mockups/TubeForgeAppMockup";

// Page bannière (hors nav/footer) pensée pour être SCREENSHOTÉE en image Discord.
// Cadre fixe 1280×960 (4:3), fond sombre, mockup réel à gauche + pitch à droite.
export const metadata = { robots: { index: false, follow: false } };

const FORGE = "bg-[linear-gradient(100deg,#ff6a1f,#ef3a24_38%,#8b3dff_100%)] bg-clip-text text-transparent";

const FEATURES = [
  { icon: Layers, title: "Direct dans ta timeline Premiere & DaVinci", desc: "La vidéo arrive dans ton montage, prête à couper. Ce que personne d'autre ne fait." },
  { icon: Globe, title: "Plus de 1 500 sites, un seul workflow", desc: "Vimeo, X, YouTube… où qu'elles soient, toujours pareil." },
  { icon: Scissors, title: "L'extrait exact, pas la vidéo entière", desc: "Sélectionne le passage, ne récupère que ça." },
];

export default function BannerPage() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#08070f] p-6">
      <div className="relative w-[1280px] h-[960px] shrink-0 overflow-hidden rounded-[24px] bg-[#08070f] border border-white/[0.06] flex">
        {/* nébuleuses */}
        <div className="absolute -top-[12%] left-0 w-[55%] h-[55%] rounded-full pointer-events-none" style={{ background: "radial-gradient(ellipse, rgba(139,61,255,0.16), transparent 70%)", filter: "blur(120px)" }} />
        <div className="absolute -bottom-[16%] -right-[4%] w-[55%] h-[55%] rounded-full pointer-events-none" style={{ background: "radial-gradient(ellipse, rgba(226,56,31,0.13), transparent 70%)", filter: "blur(120px)" }} />

        {/* gauche : mockup réel */}
        <div className="relative z-10 flex-[1.1] flex items-center justify-center p-12 border-r border-white/[0.05]">
          <div className="w-full max-w-[560px]">
            <TubeForgeAppMockup />
          </div>
        </div>

        {/* droite : pitch en grand */}
        <div className="relative z-10 flex-1 flex flex-col justify-center px-14 py-12">
          <p className="flex items-center gap-3 text-sm font-mono uppercase tracking-[0.18em] text-[#ef5a3a] mb-7">
            <span className="w-5 h-px bg-[#ef5a3a] inline-block" /> Vague 1 — Stable
          </p>
          <h1 className="text-[72px] leading-[0.95] font-black tracking-[-0.03em] text-white">
            Tube<span className={FORGE}>Forge</span>
          </h1>
          <p className="text-sm font-mono uppercase tracking-[0.08em] text-white/35 mt-4 mb-8">Du web à ta timeline, sans détour</p>

          <p className="text-[22px] leading-[1.5] text-white/70 mb-10">
            Récupère tes extraits depuis <span className="text-white font-medium">plus de 1 500 sites</span> et envoie-les <span className="text-white font-medium">directement dans Premiere Pro &amp; DaVinci Resolve</span>. Le bon passage, en pleine qualité, dans ta timeline.
          </p>

          <div className="space-y-6 mb-12">
            {FEATURES.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex gap-4">
                <div className="mt-0.5 w-11 h-11 rounded-xl bg-white/[0.05] border border-white/10 flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5 text-[#ff6a3a]" />
                </div>
                <div>
                  <p className="text-[19px] font-semibold text-white leading-tight">{title}</p>
                  <p className="text-[15px] text-white/45 leading-snug mt-1">{desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <span className="px-7 py-4 rounded-xl bg-white text-black font-bold text-[17px]">Commencer 14 jours gratuits →</span>
            <span className="px-6 py-4 rounded-xl bg-white/[0.06] border border-white/10 text-white font-semibold text-[17px]">Voir la démo →</span>
          </div>
        </div>
      </div>
    </div>
  );
}
