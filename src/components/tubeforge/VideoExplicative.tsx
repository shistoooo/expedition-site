"use client";

/**
 * UNE VIDÉO DE DÉMONSTRATION — AFFICHE, PUIS LECTURE AU CLIC, AVEC LE SON.
 *
 * ⛔ POURQUOI PAS DE DÉMARRAGE AUTOMATIQUE.
 * Ce n'est pas un choix de goût : Chrome, Safari et Firefox refusent tous de
 * démarrer une vidéo sonore sans geste de l'utilisateur. Un `autoplay` sans
 * `mute` ne produit pas une vidéo qui parle, il produit une vidéo FIGÉE — donc
 * un rectangle noir au milieu de la page. Les deux seules options réelles sont
 * « démarre seule et muette » ou « démarre au clic, avec le son ».
 *
 * On prend la seconde : le clic est justement ce qui autorise le son.
 */

import { useState } from "react";
import { Play } from "lucide-react";
import DemoPlayer from "@/components/DemoPlayer";
import {
  type VideoDemo,
  videoDisponible,
  videoAffiches,
  videoLien,
} from "@/lib/videoDemo";

const AMBRE = "#ff6a1f";

type Props = {
  video: VideoDemo;
  /** Petit intitulé au-dessus du cadre. Rien = pas d'intitulé. */
  eyebrow?: string;
  titre?: string;
  sousTitre?: string;
  /** Renvoi vers une version plus longue, sous le cadre. */
  versionLongue?: VideoDemo;
  /**
   * La phrase qui donne envie de la regarder.
   *
   * Sans elle, le renvoi se réduisait à « Tout voir en détail (19 min) » —
   * une consigne de navigation, pas une raison de cliquer. Personne n'ouvre
   * dix-neuf minutes parce qu'on lui propose du « détail ».
   */
  versionLongueAccroche?: string;
  className?: string;
};

export default function VideoExplicative({
  video,
  eyebrow,
  titre,
  sousTitre,
  versionLongue,
  versionLongueAccroche,
  className = "",
}: Props) {
  const [lance, setLance] = useState(false);
  /**
   * Quelle affiche on tente. On descend d'un cran à chaque échec, et au-delà
   * de la dernière on n'affiche plus d'image du tout : le cadre sombre et le
   * bouton lecture suffisent, là où une image cassée fait « site en panne ».
   */
  const [rang, setRang] = useState(0);

  if (!videoDisponible(video)) return null;
  const affiches = videoAffiches(video);
  const affiche = rang < affiches.length ? affiches[rang] : null;

  return (
    <div className={className}>
      {(eyebrow || titre || sousTitre) && (
        <div className="text-center mb-6">
          {eyebrow && (
            <p className="text-xs font-mono uppercase tracking-widest mb-3" style={{ color: "rgba(255,106,31,0.75)" }}>
              {eyebrow}
            </p>
          )}
          {titre && <h2 className="text-2xl md:text-3xl font-black tracking-[-0.02em] mb-3">{titre}</h2>}
          {sousTitre && <p className="text-white/50 max-w-xl mx-auto leading-relaxed">{sousTitre}</p>}
        </div>
      )}

      <div
        className="relative w-full max-w-3xl mx-auto rounded-2xl overflow-hidden border border-white/10"
        style={{ aspectRatio: "16 / 9", background: "#0a0a12" }}
      >
        {lance ? (
          /* `vitesse={null}` : le lecteur impose 1,5× par défaut, ce qui convient
             à une démo de trente secondes et rend une explication pénible à suivre. */
          <DemoPlayer videoId={video.id} title={video.titre} autoplay avecSon vitesse={null} />
        ) : (
          <button
            onClick={() => setLance(true)}
            aria-label={`Lire la vidéo : ${video.titre}`}
            className="group absolute inset-0 w-full h-full flex items-center justify-center"
          >
            {affiche && (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={affiche}
                onError={() => setRang((r) => r + 1)}
                alt=""
                className="absolute inset-0 w-full h-full object-cover opacity-70 transition-opacity group-hover:opacity-85"
              />
            )}
            <span
              className="absolute inset-0"
              style={{ background: "linear-gradient(to top, rgba(0,0,0,0.55), transparent 60%)" }}
            />
            <span
              className="relative z-10 flex items-center justify-center w-16 h-16 rounded-full transition-transform group-hover:scale-105"
              style={{ background: AMBRE }}
            >
              <Play className="w-6 h-6 ml-0.5" fill="#0a0a0a" style={{ color: "#0a0a0a" }} />
            </span>
            {video.duree && (
              <span className="absolute bottom-4 right-4 z-10 px-2.5 py-1 rounded-md bg-black/70 text-xs font-mono text-white/80">
                {video.duree}
              </span>
            )}
          </button>
        )}
      </div>

      {versionLongue && videoDisponible(versionLongue) && (
        <div className="text-center mt-6 max-w-xl mx-auto">
          {versionLongueAccroche && (
            <p className="text-white/50 leading-relaxed mb-2">{versionLongueAccroche}</p>
          )}
          <a
            href={videoLien(versionLongue)}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-semibold hover:underline"
            style={{ color: AMBRE }}
          >
            Tout est dans la vidéo de {versionLongue.dureeLongue} →
          </a>
        </div>
      )}
    </div>
  );
}
