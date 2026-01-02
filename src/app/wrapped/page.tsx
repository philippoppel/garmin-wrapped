"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import html2canvas from "html2canvas";
import WrappedViewer from "@/components/WrappedViewer";
import { YearStats } from "@/lib/types/activity";

function parseStats(stored: string | null): YearStats | null {
  if (!stored) return null;

  try {
    const parsed = JSON.parse(stored);
    // Convert date strings back to Date objects
    if (parsed.records) {
      if (parsed.records.fastest5K?.date) {
        parsed.records.fastest5K.date = new Date(parsed.records.fastest5K.date);
      }
      if (parsed.records.fastest10K?.date) {
        parsed.records.fastest10K.date = new Date(parsed.records.fastest10K.date);
      }
      if (parsed.records.fastestHalfMarathon?.date) {
        parsed.records.fastestHalfMarathon.date = new Date(parsed.records.fastestHalfMarathon.date);
      }
      if (parsed.records.fastestMarathon?.date) {
        parsed.records.fastestMarathon.date = new Date(parsed.records.fastestMarathon.date);
      }
    }
    return parsed;
  } catch {
    return null;
  }
}

function getStats(): YearStats | null {
  if (typeof window === "undefined") return null;
  return parseStats(sessionStorage.getItem("garminWrappedStats"));
}

function getPreviousYearStats(): YearStats | null {
  if (typeof window === "undefined") return null;
  return parseStats(sessionStorage.getItem("garminWrappedPreviousYearStats"));
}

export default function WrappedPage() {
  const router = useRouter();
  const [stats, setStats] = useState<YearStats | null>(null);
  const [previousYearStats, setPreviousYearStats] = useState<YearStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    const loadedStats = getStats();
    if (!loadedStats) {
      router.push("/upload");
      return;
    }
    setStats(loadedStats);
    setPreviousYearStats(getPreviousYearStats());
    setIsLoading(false);
  }, [router]);

  const handleExport = useCallback(async () => {
    setIsExporting(true);

    try {
      // Find the final share card element (new) or summary card (fallback)
      const element = document.getElementById("final-share-card") || document.getElementById("summary-card");
      if (!element) {
        // If no specific element, capture the whole slide
        const slideElement = document.querySelector(".slide-container");
        if (!slideElement) return;

        const canvas = await html2canvas(slideElement as HTMLElement, {
          backgroundColor: "#0a0a1a",
          scale: 2,
          logging: false,
          useCORS: true,
        });

        downloadCanvas(canvas);
        return;
      }

      // Get parent container for better capture
      const container = element.closest(".slide-container") || element;

      const canvas = await html2canvas(container as HTMLElement, {
        backgroundColor: "#0a0a1a",
        scale: 2,
        logging: false,
        windowWidth: 500,
        windowHeight: 800,
        useCORS: true,
      });

      downloadCanvas(canvas);
    } catch (error) {
      console.error("Export error:", error);
    } finally {
      setIsExporting(false);
    }
  }, []);

  const downloadCanvas = (canvas: HTMLCanvasElement) => {
    const link = document.createElement("a");
    link.download = `garmin-wrapped-${stats?.year || 2024}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  const handleShare = useCallback(async () => {
    // Check if Web Share API is available
    if (!navigator.share) {
      // Fallback to export
      handleExport();
      return;
    }

    setIsExporting(true);

    try {
      const element = document.getElementById("final-share-card") || document.getElementById("summary-card");
      if (!element) return;

      const container = element.closest(".slide-container") || element;
      const canvas = await html2canvas(container as HTMLElement, {
        backgroundColor: "#0a0a1a",
        scale: 2,
        logging: false,
        useCORS: true,
      });

      // Convert canvas to blob
      const blob = await new Promise<Blob>((resolve) => {
        canvas.toBlob((b) => resolve(b!), "image/png");
      });

      const file = new File([blob], `garmin-wrapped-${stats?.year || 2024}.png`, {
        type: "image/png",
      });

      await navigator.share({
        title: `Mein Garmin Wrapped ${stats?.year || 2024}`,
        text: `Schau dir mein Sportjahr ${stats?.year || 2024} an! ${stats?.totalDistance ? Math.round(stats.totalDistance).toLocaleString("de-DE") + " km" : ""} - ${stats?.totalActivities || 0} Aktivitäten`,
        files: [file],
      });
    } catch (error) {
      // User cancelled or share failed, ignore
      console.log("Share cancelled or failed:", error);
    } finally {
      setIsExporting(false);
    }
  }, [stats, handleExport]);

  if (isLoading) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-white text-xl"
        >
          Laden...
        </motion.div>
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  return (
    <>
      <WrappedViewer
        stats={stats}
        previousYearStats={previousYearStats}
        onExport={handleExport}
        onShare={handleShare}
      />

      {/* Export overlay */}
      {isExporting && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="text-white text-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
              className="w-8 h-8 border-2 border-white border-t-transparent rounded-full mx-auto mb-4"
            />
            <p>Bild wird erstellt...</p>
          </div>
        </div>
      )}
    </>
  );
}
