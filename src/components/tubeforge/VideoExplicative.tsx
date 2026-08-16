"use client";

/**
 * LA VIDÉO EXPLICATIVE — AFFICHE PUIS LECTURE AU CLIC, AVEC LE SON.
 *
 * ⛔ POURQUOI PAS DE DÉMARRAGE AUTOMATIQUE.
 * Ce n'est pas un choix de goût : Chrome, Safari et Firefox refusent tous de
 * démarrer une vidéo sonore sans geste de l'utilisateur. Un `autoplay` sans
 * `mute` ne produit pas une vidéo qui parle, il produit une vidéo FIGÉE — donc
 * un rectangle noir au milieu de la page. Les seules options réelles sont
 * « démarre seule et muette » ou « démarre au clic, avec le son ».
 *
 * On prend la seconde : le clic est justement ce qui autorise le son. La
 * personne voit une image d'accroche, clique, et la vidéo part comme prévu.
 */

import { useState } from "react";
import { Play } from "lucide-react";
import DemoPlayer from "@/components/DemoPlayer";
import {
  VIDEO_TUBEFORGE_ID,
  VIDEO_TUBEFORGE_TITRE,
  VIDEO_TUBEFORGE_DUREE,
  videoDemoDisponible,
  videoDemoAffiche,
  videoDemoAfficheRepli,
} from "@/lib/videoDemo";

const AMBRE = "#ff6a1f";

type Props = {
  /** Petit intitulé au-dessus du cadre. Rien = pas d'intitulé. */
  eyebrow?: string;
  titre?: string;
  sousTitre?: string;
  className?: string;
};

export default function VideoExplicative({ eyebrow, titre, sousTitre, className = "" }: Props) {
  const [lance, setLance] = useState(false);
  const [afficheKo, setAfficheKo] = useState(false);

  // Tant que l'identifiant n'est pas renseigné, on ne rend RIEN : un lecteur
  // vide ou un « Video unavailable » au milieu d'une page de vente ferait plus
  // de mal que l'absence de section.
  if (!videoDemoDisponible()) return null;

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

      <div className="relative w-full max-w-3xl mx-auto rounded-2xl overflow-hidden border border-white/10 bg-black"
           style={{ aspectRatio: "16 / 9" }}>
        {lance ? (
          /* `vitesse={null}` : le lecteur impose 1,5× par défaut, ce qui convient
             à une démo de trente secondes et rend une explication incompréhensible. */
          <DemoPlayer
            videoId={VIDEO_TUBEFORGE_ID}
            title={VIDEO_TUBEFORGE_TITRE}
            autoplay
            avecSon
            vitesse={null}
          />
        ) : (
          <button
            onClick={() => setLance(true)}
            aria-label={`Lire la vidéo : ${VIDEO_TUBEFORGE_TITRE}`}
            className="group absolute inset-0 w-full h-full flex items-center justify-center"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={afficheKo ? videoDemoAfficheRepli() : videoDemoAffiche()}
              onError={() => setAfficheKo(true)}
              alt=""
              className="absolute inset-0 w-full h-full object-cover opacity-70 transition-opacity group-hover:opacity-85"
            />
            <span className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.6), transparent 60%)" }} />
            <span className="relative z-10 flex items-center justify-center w-16 h-16 rounded-full transition-transform group-hover:scale-105"
                  style={{ background: AMBRE }}>
              <Play className="w-6 h-6 ml-0.5" fill="#0a0a0a" style={{ color: "#0a0a0a" }} />
            </span>
            {VIDEO_TUBEFORGE_DUREE && (
              <span className="absolute bottom-4 right-4 z-10 px-2.5 py-1 rounded-md bg-black/70 text-xs font-mono text-white/80">
                {VIDEO_TUBEFORGE_DUREE}
              </span>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
