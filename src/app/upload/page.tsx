"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Upload, Key } from "lucide-react";
import Link from "next/link";
import FileUpload from "@/components/FileUpload";
import GarminLogin from "@/components/GarminLogin";
import { UploadState, YearStats } from "@/lib/types/activity";
import { parseDashboardFiles } from "@/lib/parsers/dashboardParser";

// Store stats in sessionStorage for the wrapped page
function storeStats(stats: YearStats, previousYearStats?: YearStats | null) {
  if (typeof window !== "undefined") {
    sessionStorage.setItem("garminWrappedStats", JSON.stringify(stats));
    if (previousYearStats) {
      sessionStorage.setItem("garminWrappedPreviousYearStats", JSON.stringify(previousYearStats));
    } else {
      sessionStorage.removeItem("garminWrappedPreviousYearStats");
    }
  }
}

type UploadMethod = "auto" | "manual";

export default function UploadPage() {
  const router = useRouter();
  const [method, setMethod] = useState<UploadMethod>("auto");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploadState, setUploadState] = useState<UploadState>({
    status: "idle",
    progress: 0,
  });

  // Handle successful Garmin login
  const handleGarminSuccess = useCallback((stats: any, previousYearStats?: any) => {
    storeStats(stats, previousYearStats);
    router.push("/wrapped");
  }, [router]);

  const handleGarminError = useCallback((error: string) => {
    console.error("Garmin error:", error);
  }, []);

  // CSV Upload handlers
  const handleFilesSelect = useCallback((newFiles: File[]) => {
    setSelectedFiles((prev) => {
      const existingNames = new Set(prev.map((f) => f.name));
      const uniqueNew = newFiles.filter((f) => !existingNames.has(f.name));
      return [...prev, ...uniqueNew];
    });
  }, []);

  const handleRemoveFile = useCallback((index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const handleStartAnalysis = useCallback(async () => {
    if (selectedFiles.length === 0) return;

    setUploadState({
      status: "uploading",
      progress: 10,
      fileName: `${selectedFiles.length} Dateien`,
    });

    try {
      await new Promise((resolve) => setTimeout(resolve, 300));
      setUploadState((prev) => ({ ...prev, status: "parsing", progress: 40 }));

      const { stats } = await parseDashboardFiles(selectedFiles);

      if (stats.totalActivities === 0) {
        setUploadState({
          status: "error",
          progress: 0,
          error: "Keine Aktivitätsdaten gefunden.",
          fileName: `${selectedFiles.length} Dateien`,
        });
        return;
      }

      setUploadState((prev) => ({
        ...prev,
        status: "analyzing",
        progress: 70,
        activitiesFound: stats.totalActivities,
      }));

      await new Promise((resolve) => setTimeout(resolve, 500));

      setUploadState((prev) => ({
        ...prev,
        status: "complete",
        progress: 100,
      }));

      storeStats(stats);

      setTimeout(() => {
        router.push("/wrapped");
      }, 1000);
    } catch (error) {
      console.error("Error processing files:", error);
      setUploadState({
        status: "error",
        progress: 0,
        error: error instanceof Error ? error.message : "Fehler beim Verarbeiten",
        fileName: `${selectedFiles.length} Dateien`,
      });
    }
  }, [selectedFiles, router]);

  return (
    <main className="min-h-screen gradient-bg flex flex-col">
      {/* Header */}
      <header className="p-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-white/50 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Zurück</span>
        </Link>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Verbinde dein Garmin
          </h1>
          <p className="text-white/50 max-w-md mx-auto">
            Wähle wie du deine Daten laden möchtest
          </p>
        </motion.div>

        {/* Method Toggle */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex gap-2 mb-8 p-1 bg-white/5 rounded-xl"
        >
          <button
            onClick={() => setMethod("auto")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
              method === "auto"
                ? "bg-gradient-to-r from-garmin-blue to-garmin-purple text-white"
                : "text-white/50 hover:text-white"
            }`}
          >
            <Key className="w-4 h-4" />
            Automatisch
          </button>
          <button
            onClick={() => setMethod("manual")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
              method === "manual"
                ? "bg-gradient-to-r from-garmin-blue to-garmin-purple text-white"
                : "text-white/50 hover:text-white"
            }`}
          >
            <Upload className="w-4 h-4" />
            CSV Upload
          </button>
        </motion.div>

        {/* Content based on method */}
        <motion.div
          key={method}
          initial={{ opacity: 0, x: method === "auto" ? -20 : 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-xl"
        >
          {method === "auto" ? (
            <div>
              <GarminLogin
                onSuccess={handleGarminSuccess}
                onError={handleGarminError}
              />

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-8 text-center"
              >
                <p className="text-white/30 text-sm mb-2">
                  Funktioniert nicht?
                </p>
                <button
                  onClick={() => setMethod("manual")}
                  className="text-garmin-blue hover:underline text-sm"
                >
                  CSV-Dateien manuell hochladen →
                </button>
              </motion.div>
            </div>
          ) : (
            <div>
              <FileUpload
                onFilesSelect={handleFilesSelect}
                uploadState={uploadState}
                selectedFiles={selectedFiles}
                onRemoveFile={handleRemoveFile}
                onStartAnalysis={handleStartAnalysis}
              />

              {uploadState.status === "error" && (
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  onClick={() => {
                    setUploadState({ status: "idle", progress: 0 });
                    setSelectedFiles([]);
                  }}
                  className="mt-6 text-garmin-blue hover:underline block mx-auto"
                >
                  Erneut versuchen
                </motion.button>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </main>
  );
}
