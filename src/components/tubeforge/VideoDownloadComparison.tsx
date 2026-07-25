"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Clock, Zap, CheckCircle2, Layers } from "lucide-react";

const easeOutExpo: [number, number, number, number] = [0.16, 1, 0.3, 1];

// Durées réelles des deux captures d'écran (mêmes conditions, même vidéo cible
// "Demon Slayer trailer") — mesurées via ffprobe sur les fichiers sources, pas
// inventées. Servent au calcul du temps/pourcentage gagné même si les <video>
// n'ont pas encore fini de charger leurs métadonnées.
const CLASSIQUE_DURATION_S = 87.08;
const TUBEFORGE_DURATION_S = 33.9;
const SAVED_S = Math.round(CLASSIQUE_DURATION_S - TUBEFORGE_DURATION_S);
const SAVED_PCT = Math.round((1 - TUBEFORGE_DURATION_S / CLASSIQUE_DURATION_S) * 100);

// Les deux vidéos jouent 2x plus vite à l'écran (plus dynamique, moins long à
// regarder) — le chrono affiché reste basé sur currentTime, qui avance sur la
// vraie durée de la vidéo indépendamment du playbackRate, donc les chiffres
// montrés restent le vrai temps réel, seule la vitesse de LECTURE est doublée.
const PLAYBACK_RATE = 2;

// Projection à l'échelle d'un vrai montage — un projet avec des dizaines
// d'extraits accumule le même écart à chaque téléchargement.
const AT_SCALE_CLIPS = 100;
const atScaleSeconds = SAVED_S * AT_SCALE_CLIPS;

// Vannes qui défilent sur la vidéo "TubeForge + plugin" une fois qu'elle a
// fini — elle n'a plus rien à montrer, alors qu'à côté "classique" continue
// de tourner en clair. L'écart réel entre les deux (à 2x) dure ~26,6s ; à
// 3,2s/vanne il en faut au moins 9 pour ne JAMAIS répéter avant la fin de la
// classique — on en a 12 pour garder de la marge.
const WAIT_JOKES = [
  "Bon... c'est vachement long quand même.",
  "Comme on dit, le temps c'est de l'argent.",
  "Anecdote : cette phrase est popularisée par Benjamin Franklin, en 1748.",
  "Il n'avait clairement jamais attendu un téléchargement de vidéo, lui.",
  "Pendant ce temps, l'autre vidéo... toujours pas finie.",
  "On a le temps de refaire du café, littéralement.",
  "On pourrait presque regarder un épisode de série, à ce rythme.",
  "Bon, allez, ça va le faire.",
  "Ah bah enfin, on y est.",
  "On pourrait quasiment relire ce texte deux fois avant que ça finisse.",
  "Courage, la fin est proche. Enfin, on espère.",
  "Allez, encore un peu de patience.",
];

function formatTime(seconds: number): string {
  const s = Math.floor(seconds);
  const m = Math.floor(s / 60);
  const rem = s % 60;
  return `${m}:${String(rem).padStart(2, "0")}`;
}

function formatHoursMinutes(totalSeconds: number): string {
  const totalMinutes = Math.round(totalSeconds / 60);
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  if (h === 0) return `${m}min`;
  return m === 0 ? `${h}h` : `${h}h${String(m).padStart(2, "0")}`;
}

function WaitJoke() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setI((v) => (v + 1) % WAIT_JOKES.length), 3200);
    return () => clearInterval(id);
  }, []);
  return (
    <div className="absolute inset-0 z-10 flex items-center justify-center p-6 text-center">
      <motion.p
        key={i}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-white font-bold text-sm sm:text-base leading-snug drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]"
      >
        {WAIT_JOKES[i]}
      </motion.p>
    </div>
  );
}

function VideoPanel({
  src,
  width,
  height,
  load,
  label,
  icon: Icon,
  accent,
  shouldPlay,
  onReady,
  onEnded,
  onTimeUpdate,
  currentTime,
  ended,
  mocked,
}: {
  src: string;
  width: number;
  height: number;
  load: boolean;
  label: string;
  icon: typeof Clock;
  accent: string;
  shouldPlay: boolean;
  onReady: () => void;
  onEnded: () => void;
  onTimeUpdate: (t: number) => void;
  currentTime: number;
  ended: boolean;
  mocked?: boolean;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const firedReady = useRef(false);

  const markReady = () => {
    if (!firedReady.current) {
      firedReady.current = true;
      onReady();
    }
  };

  // Filet de sécurité : si la vidéo est servie depuis le cache, elle peut
  // atteindre readyState >= 3 (assez de data pour jouer) AVANT que React
  // n'ait attaché le listener onCanPlay — l'évènement natif part alors dans
  // le vide et onReady ne se déclenche jamais. On vérifie donc aussi l'état
  // directement au montage.
  useEffect(() => {
    const el = videoRef.current;
    if (el && el.readyState >= 3) markReady();
  }, []);

  // Ne démarre QUE quand le parent donne le feu vert (shouldPlay), une fois
  // que les DEUX vidéos ont chargé — évite qu'une vidéo plus légère parte
  // avant l'autre. Pas de tableau de dépendances : se réaffirme à CHAQUE
  // rendu (relance si un hoquet de buffering l'a mise en pause) — IMPORTANT :
  // ne relance jamais si la vidéo est réellement `ended` (sinon elle boucle
  // au lieu de s'arrêter sur "Terminé", bug déjà vécu).
  useEffect(() => {
    const el = videoRef.current;
    if (!el || !shouldPlay) return;
    el.playbackRate = PLAYBACK_RATE;
    if (el.paused && !el.ended) void el.play().catch(() => {});
  }, [shouldPlay]);

  return (
    <div
      className="relative rounded-2xl overflow-hidden border w-full sm:flex-1 sm:min-w-0"
      style={{ borderColor: ended ? accent : "rgba(255,255,255,0.1)" }}
    >
      {/* Hauteur fixe, largeur automatique selon le vrai ratio de CHAQUE
          vidéo (pas de cadre 16:9 générique forcé) — donc pas de bande noire
          à masquer, et rien n'est étiré/cropé au-delà du recadrage déjà fait
          sur les fichiers sources. */}
      {/* Lazy-load : la source n'est attachée (et donc téléchargée) qu'une fois
          la section proche du viewport (`load`). `aspectRatio` réserve la hauteur
          AVANT le chargement → zéro layout shift (CLS) quand la vidéo arrive. */}
      <video
        ref={videoRef}
        src={load ? src : undefined}
        muted
        playsInline
        preload={load ? "auto" : "none"}
        onCanPlay={markReady}
        onEnded={onEnded}
        onTimeUpdate={(e) => onTimeUpdate(e.currentTarget.currentTime)}
        style={{ aspectRatio: `${width} / ${height}` }}
        className={`block w-full h-auto transition-[filter] duration-500 ${mocked ? "blur-md brightness-50" : ""}`}
      />
      {mocked && <WaitJoke />}
      <div
        className="absolute top-3 left-3 flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold"
        style={{ background: "rgba(6,5,26,0.85)", color: accent, border: `1px solid ${accent}55` }}
      >
        <Icon className="w-3.5 h-3.5" />
        {label}
      </div>
      <div
        className="absolute top-3 right-3 px-3 py-1.5 rounded-lg text-sm font-black tabular-nums"
        style={{ background: "rgba(6,5,26,0.85)", color: "#fff" }}
      >
        {formatTime(currentTime)}
      </div>
      {ended && (
        <div
          className="absolute bottom-3 left-3 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold"
          style={{ background: accent, color: "#06051a" }}
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          Terminé
        </div>
      )}
    </div>
  );
}

export default function VideoDownloadComparison() {
  const [classiqueTime, setClassiqueTime] = useState(0);
  const [pluginTime, setPluginTime] = useState(0);
  const [classiqueEnded, setClassiqueEnded] = useState(false);
  const [pluginEnded, setPluginEnded] = useState(false);
  const [readyCount, setReadyCount] = useState(0);

  // Les deux vidéos ne démarrent qu'une fois TOUTES LES DEUX chargées —
  // sinon la plus légère (tubeforge-plugin, ~450Ko) part avant l'autre
  // (~2Mo) et la course n'est plus juste.
  const bothReady = readyCount >= 2;
  const handleReady = () => setReadyCount((c) => c + 1);

  // Lazy-load : on ne déclenche le téléchargement des ~2,3 Mo de vidéo que
  // lorsque la section approche du viewport (marge 400px). Sur desktop la démo
  // est quasi au-dessus de la ligne de flottaison → charge tout de suite ; sur
  // mobile (démo sous le hero) un visiteur qui rebondit ne télécharge rien.
  const rootRef = useRef<HTMLDivElement>(null);
  const shouldLoad = useInView(rootRef, { once: true, margin: "400px 0px" });

  return (
    <div ref={rootRef} className="w-full">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: easeOutExpo }}
        className="text-center mb-10"
      >
        <h2 className="text-4xl md:text-6xl font-black tracking-[-0.02em]">
          Imagine le temps que <span style={{ color: "#ff6a1f" }}>tu gagnerais</span>
        </h2>
        <p className="mt-4 text-base md:text-lg text-white/50">
          Voici le test : la même vidéo, la même connexion.
        </p>
      </motion.div>

      {/* Un SEUL cadre englobant les deux vidéos, avec le temps gagné en badge
          central qui sert de séparateur — on lit tout de suite « comparaison ». */}
      <div
        className="max-w-6xl mx-auto rounded-2xl border p-4 sm:p-5"
        style={{ borderColor: "rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.02)" }}
      >
        <div className="relative flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-5">
          <VideoPanel
            src="/tubeforge/dl-classique.mp4"
            width={1280}
            height={836}
            load={shouldLoad}
            label="NoTube"
            icon={Clock}
            accent="#a1a1aa"
            shouldPlay={bothReady}
            onReady={handleReady}
            onEnded={() => setClassiqueEnded(true)}
            onTimeUpdate={setClassiqueTime}
            currentTime={classiqueTime}
            ended={classiqueEnded}
          />

          {/* Le chiffre-choc est ACCROCHÉ au panneau TubeForge (coin bas-droit),
              pas flottant au centre : le 61 % appartient à TubeForge. */}
          <div className="relative w-full sm:flex-1 sm:min-w-0">
            <VideoPanel
              src="/tubeforge/tubeforge-plugin.mp4"
              width={1280}
              height={830}
              load={shouldLoad}
              label="TubeForge + plugin"
              icon={Zap}
              accent="#ff6a1f"
              shouldPlay={bothReady}
              onReady={handleReady}
              onEnded={() => setPluginEnded(true)}
              onTimeUpdate={setPluginTime}
              currentTime={pluginTime}
              ended={pluginEnded}
              mocked={pluginEnded && !classiqueEnded}
            />
            <div
              className="absolute -bottom-4 -right-2 sm:-bottom-6 sm:-right-3 z-20 rounded-2xl px-4 py-2.5 sm:px-5 sm:py-3 text-center"
              style={{ background: "rgba(6,5,26,0.94)", border: "1px solid rgba(255,106,31,0.45)" }}
            >
              <span className="block text-4xl sm:text-5xl md:text-6xl font-black leading-[0.9] tracking-[-0.03em]" style={{ color: "#ff6a1f" }}>
                {SAVED_PCT}%
              </span>
              <span className="mt-1.5 block text-[11px] sm:text-xs font-mono uppercase tracking-widest text-white/60">
                plus vite
              </span>
            </div>
          </div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.35, ease: easeOutExpo }}
        className="mt-6 max-w-2xl mx-auto rounded-xl border p-5 text-center flex items-center justify-center gap-3"
        style={{ borderColor: "rgba(255,106,31,0.25)", background: "rgba(255,106,31,0.05)" }}
      >
        <Layers className="w-5 h-5 shrink-0" style={{ color: "#ff6a1f" }} />
        <p className="text-sm text-white/60">
          À l&apos;échelle d&apos;un montage de <span className="text-white/85 font-semibold">{AT_SCALE_CLIPS} extraits</span>,
          ça fait <span className="font-black" style={{ color: "#ff6a1f" }}>{formatHoursMinutes(atScaleSeconds)}</span> de
          temps de téléchargement en moins.
        </p>
      </motion.div>
    </div>
  );
}
