"use client";

import { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, FileText, AlertCircle, CheckCircle2, Loader2, X } from "lucide-react";
import { UploadState } from "@/lib/types/activity";

interface FileUploadProps {
  onFilesSelect: (files: File[]) => void;
  uploadState: UploadState;
  selectedFiles: File[];
  onRemoveFile: (index: number) => void;
  onStartAnalysis: () => void;
}

export default function FileUpload({
  onFilesSelect,
  uploadState,
  selectedFiles,
  onRemoveFile,
  onStartAnalysis,
}: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files).filter(
      (file) => file.name.endsWith(".csv")
    );
    if (files.length > 0) {
      onFilesSelect(files);
    }
  }, [onFilesSelect]);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      onFilesSelect(Array.from(files));
    }
    // Reset input
    e.target.value = "";
  };

  const statusIcons = {
    idle: <Upload className="w-12 h-12 text-garmin-blue" />,
    uploading: <Loader2 className="w-12 h-12 text-garmin-blue animate-spin" />,
    parsing: <Loader2 className="w-12 h-12 text-garmin-purple animate-spin" />,
    analyzing: <Loader2 className="w-12 h-12 text-garmin-orange animate-spin" />,
    complete: <CheckCircle2 className="w-12 h-12 text-green-500" />,
    error: <AlertCircle className="w-12 h-12 text-red-500" />,
  };

  const statusMessages = {
    idle: selectedFiles.length > 0 ? `${selectedFiles.length} Dateien ausgewählt` : "CSV-Dateien hochladen",
    uploading: "Dateien werden geladen...",
    parsing: "Daten werden verarbeitet...",
    analyzing: "Statistiken werden berechnet...",
    complete: `${uploadState.activitiesFound} Aktivitäten gefunden!`,
    error: uploadState.error || "Ein Fehler ist aufgetreten",
  };

  const isProcessing = ["uploading", "parsing", "analyzing"].includes(uploadState.status);

  return (
    <div className="w-full max-w-xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          multiple
          onChange={handleFileChange}
          className="hidden"
        />

        <motion.div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={uploadState.status === "idle" ? handleClick : undefined}
          className={`
            relative overflow-hidden rounded-2xl border-2 border-dashed p-8
            flex flex-col items-center justify-center gap-4
            transition-all duration-300 cursor-pointer
            ${isDragging
              ? "border-garmin-blue bg-garmin-blue/10"
              : uploadState.status === "error"
                ? "border-red-500/50 bg-red-500/5"
                : uploadState.status === "complete"
                  ? "border-green-500/50 bg-green-500/5"
                  : "border-white/20 bg-white/5 hover:border-garmin-blue/50 hover:bg-white/10"
            }
          `}
          whileHover={uploadState.status === "idle" ? { scale: 1.01 } : {}}
          whileTap={uploadState.status === "idle" ? { scale: 0.99 } : {}}
        >
          {/* Background gradient effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-garmin-blue/5 via-transparent to-garmin-purple/5 pointer-events-none" />

          <AnimatePresence mode="wait">
            <motion.div
              key={uploadState.status}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col items-center gap-4"
            >
              {statusIcons[uploadState.status]}

              <div className="text-center">
                <p className="text-lg font-medium text-white">
                  {statusMessages[uploadState.status]}
                </p>

                {uploadState.status === "idle" && selectedFiles.length === 0 && (
                  <p className="text-sm text-white/50 mt-2">
                    Drag & Drop oder klicken (mehrere Dateien möglich)
                  </p>
                )}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Progress bar */}
          {isProcessing && (
            <div className="w-full max-w-xs mt-4">
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-garmin-blue to-garmin-purple"
                  initial={{ width: 0 }}
                  animate={{ width: `${uploadState.progress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>
          )}
        </motion.div>

        {/* Selected files list */}
        {selectedFiles.length > 0 && uploadState.status === "idle" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 space-y-2"
          >
            {selectedFiles.map((file, index) => (
              <div
                key={`${file.name}-${index}`}
                className="flex items-center justify-between bg-white/5 rounded-lg px-4 py-2"
              >
                <div className="flex items-center gap-2 text-white/70">
                  <FileText className="w-4 h-4" />
                  <span className="text-sm truncate max-w-[200px]">{file.name}</span>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveFile(index);
                  }}
                  className="text-white/40 hover:text-white/70 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}

            <motion.button
              onClick={onStartAnalysis}
              className="w-full mt-4 py-3 bg-gradient-to-r from-garmin-blue to-garmin-purple text-white font-semibold rounded-xl hover:opacity-90 transition-opacity"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Wrapped erstellen 🚀
            </motion.button>
          </motion.div>
        )}
      </motion.div>

      {/* Instructions */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mt-8 text-center text-white/50 text-sm"
      >
        <p className="font-medium mb-2">So exportierst du deine Garmin-Daten:</p>
        <ol className="space-y-1 text-left max-w-md mx-auto">
          <li>1. Öffne <a href="https://connect.garmin.com/modern/reports/all" target="_blank" rel="noopener noreferrer" className="text-garmin-blue hover:underline">Garmin Connect Berichte</a></li>
          <li>2. Wähle "Dieses Jahr" als Zeitraum</li>
          <li>3. Klicke auf die 3 Punkte bei den Diagrammen</li>
          <li>4. Exportiere: <span className="text-white/70">Aktivitäten, Gesamtstrecke, Fortschrittsübersicht</span></li>
          <li>5. Lade alle CSV-Dateien hier hoch</li>
        </ol>
      </motion.div>
    </div>
  );
}
