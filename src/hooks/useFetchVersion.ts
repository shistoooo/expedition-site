import { useState, useEffect } from "react";

interface VersionData {
  download_url?: string;
  windows_download_url?: string;
  version?: string;
  critical?: boolean;
  message?: string;
}

export function useFetchVersion(appKey: string) {
  const [data, setData] = useState<VersionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    const fetchVersion = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_WORKER_URL}/downloads/version.json`,
          { cache: "no-store", signal: controller.signal }
        );
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const json = await response.json();
        setData(json[appKey] || null);
      } catch (err) {
        if (err instanceof Error && err.name !== "AbortError") {
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchVersion();
    return () => {
      clearTimeout(timeoutId);
      controller.abort();
    };
  }, [appKey]);

  return { data, loading, error };
}
