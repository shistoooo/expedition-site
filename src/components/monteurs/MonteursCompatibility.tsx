"use client";

import { useSearchParams } from "next/navigation";
import CompatibilityBlock from "@/components/shared/CompatibilityBlock";

function parseTool(raw: string | null): "premiere" | "davinci" | "both" {
  if (raw === "premiere") return "premiere";
  if (raw === "davinci") return "davinci";
  return "both";
}

export default function MonteursCompatibility() {
  const searchParams = useSearchParams();
  const tool = parseTool(searchParams.get("tool"));
  return <CompatibilityBlock accent="purple" tool={tool} />;
}
