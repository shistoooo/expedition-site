"use client";

import { useEffect } from "react";
import { capturerParrainage } from "@/lib/parrainage";

/**
 * Capte `?ref=` sur n'importe quelle page où ce composant est monté.
 *
 * Monté dans le layout de `/tubeforge`, il rend le lien partenaire utilisable
 * sur la page produit : la personne voit ce qu'elle achète avant de payer, et
 * le code survit jusqu'au checkout.
 *
 * Ne rend rien, ne bloque rien, n'attend rien du réseau. En cas de stockage
 * indisponible la fonction appelée échoue en silence : une page qui refuse de
 * s'afficher parce qu'une attribution commerciale a raté serait un mauvais
 * échange.
 */
export default function CaptureParrainage() {
    useEffect(() => {
        capturerParrainage();
    }, []);
    return null;
}
