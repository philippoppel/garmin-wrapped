"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Lock, Mail, AlertCircle, CheckCircle2, Shield, ExternalLink, ChevronDown, ChevronUp, Calendar } from "lucide-react";

interface GarminLoginProps {
  onSuccess: (stats: any, previousYearStats?: any) => void;
  onError: (error: string) => void;
}

type LoginStatus = "idle" | "loading" | "success" | "error";

export default function GarminLogin({ onSuccess, onError }: GarminLoginProps) {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedYear, setSelectedYear] = useState(currentYear - 1); // Default to previous year
  const [status, setStatus] = useState<LoginStatus>("idle");
  const [error, setError] = useState("");
  const [progress, setProgress] = useState("");
  const [loadingStep, setLoadingStep] = useState(0);
  const [showSecurityInfo, setShowSecurityInfo] = useState(false);

  const totalSteps = 7;

  // Available years (last 5 years)
  const availableYears = Array.from({ length: 5 }, (_, i) => currentYear - i);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Bitte Email und Passwort eingeben");
      return;
    }

    setStatus("loading");
    setError("");
    setProgress("Verbinde mit Garmin Connect...");
    setLoadingStep(0);

    // Simulate progress steps while waiting for API
    const progressSteps = [
      { text: "Verbinde mit Garmin Connect...", duration: 1500 },
      { text: "Login erfolgreich...", duration: 2000 },
      { text: "Lade Aktivitäten...", duration: 3000 },
      { text: "Analysiere Trainingsdaten...", duration: 4000 },
      { text: "Berechne Statistiken...", duration: 5000 },
      { text: "Lade Wellness-Daten...", duration: 8000 },
      { text: "Fast fertig...", duration: 10000 },
    ];

    let stepIndex = 0;
    const progressInterval = setInterval(() => {
      if (stepIndex < progressSteps.length) {
        setProgress(progressSteps[stepIndex].text);
        setLoadingStep(stepIndex + 1);
        stepIndex++;
      }
    }, 5000);

    try {
      const response = await fetch("/api/garmin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, year: selectedYear }),
      });

      clearInterval(progressInterval);

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Verbindung fehlgeschlagen");
      }

      setLoadingStep(progressSteps.length);
      setProgress(`${data.activitiesCount} Aktivitäten gefunden!`);
      setStatus("success");

      // Wait a moment then call success handler
      setTimeout(() => {
        onSuccess(data.stats, data.previousYearStats);
      }, 1500);
    } catch (err: any) {
      clearInterval(progressInterval);
      setStatus("error");
      setError(err.message || "Verbindung fehlgeschlagen");
      onError(err.message);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-md mx-auto"
    >
      {/* Security Info Banner */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 bg-amber-500/10 border border-amber-500/20 rounded-xl p-4"
      >
        <div className="flex items-start gap-3">
          <Shield className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="text-amber-400 font-medium text-sm mb-1">
              Inoffizielle Integration
            </h3>
            <p className="text-white/60 text-xs leading-relaxed">
              Diese App ist nicht von Garmin autorisiert. Deine Zugangsdaten werden einmalig verwendet, um deine Aktivitäten abzurufen, und <strong className="text-white/80">niemals gespeichert</strong>.
            </p>

            <button
              type="button"
              onClick={() => setShowSecurityInfo(!showSecurityInfo)}
              className="flex items-center gap-1 text-amber-400 text-xs mt-2 hover:underline"
            >
              {showSecurityInfo ? (
                <>
                  <ChevronUp className="w-3 h-3" />
                  Weniger anzeigen
                </>
              ) : (
                <>
                  <ChevronDown className="w-3 h-3" />
                  Mehr zur Sicherheit
                </>
              )}
            </button>

            <AnimatePresence>
              {showSecurityInfo && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="mt-3 pt-3 border-t border-amber-500/20 space-y-2 text-xs text-white/50">
                    <p>• Deine Daten werden direkt von Garmin abgerufen</p>
                    <p>• Keine Speicherung auf unseren Servern</p>
                    <p>• Der Code ist Open Source und prüfbar</p>
                    <p>• Du kannst alternativ den CSV-Export nutzen</p>
                    <a
                      href="https://connect.garmin.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-garmin-blue hover:underline mt-2"
                    >
                      <ExternalLink className="w-3 h-3" />
                      Offizielle Garmin Connect Seite
                    </a>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email Input */}
        <div>
          <label className="block text-sm text-white/70 mb-2">
            Garmin Connect Email
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="deine@email.de"
              disabled={status === "loading"}
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-garmin-blue disabled:opacity-50"
            />
          </div>
        </div>

        {/* Password Input */}
        <div>
          <label className="block text-sm text-white/70 mb-2">
            Passwort
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              disabled={status === "loading"}
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-garmin-blue disabled:opacity-50"
            />
          </div>
        </div>

        {/* Year Selector */}
        <div>
          <label className="block text-sm text-white/70 mb-2">
            Jahr auswählen
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              disabled={status === "loading"}
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white focus:outline-none focus:border-garmin-blue disabled:opacity-50 appearance-none cursor-pointer"
            >
              {availableYears.map((year) => (
                <option key={year} value={year} className="bg-gray-800 text-white">
                  {year}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30 pointer-events-none" />
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 rounded-lg px-4 py-2"
          >
            <AlertCircle className="w-4 h-4" />
            {error}
          </motion.div>
        )}

        {/* Progress/Success Message */}
        {(status === "loading" || status === "success") && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`rounded-xl p-4 ${
              status === "success"
                ? "bg-green-500/10 border border-green-500/20"
                : "bg-garmin-blue/10 border border-garmin-blue/20"
            }`}
          >
            <div className="flex items-center gap-2 text-sm mb-3">
              {status === "loading" ? (
                <Loader2 className="w-4 h-4 animate-spin text-garmin-blue" />
              ) : (
                <CheckCircle2 className="w-4 h-4 text-green-400" />
              )}
              <span className={status === "success" ? "text-green-400" : "text-garmin-blue"}>
                {progress}
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
              <motion.div
                className={`h-full rounded-full ${
                  status === "success"
                    ? "bg-gradient-to-r from-green-400 to-emerald-400"
                    : "bg-gradient-to-r from-garmin-blue to-garmin-purple"
                }`}
                initial={{ width: "0%" }}
                animate={{
                  width: status === "success"
                    ? "100%"
                    : `${Math.min((loadingStep / totalSteps) * 100, 95)}%`
                }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
            </div>

            {status === "loading" && (
              <div className="flex justify-between mt-2 text-xs text-white/40">
                <span>Schritt {loadingStep} von {totalSteps}</span>
                <span>Bitte warten...</span>
              </div>
            )}
          </motion.div>
        )}

        {/* Submit Button */}
        <motion.button
          type="submit"
          disabled={status === "loading" || status === "success"}
          className="w-full py-3 bg-gradient-to-r from-garmin-blue to-garmin-purple text-white font-semibold rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
          whileHover={{ scale: status === "idle" ? 1.02 : 1 }}
          whileTap={{ scale: status === "idle" ? 0.98 : 1 }}
        >
          {status === "loading" ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Verbinde...
            </>
          ) : status === "success" ? (
            <>
              <CheckCircle2 className="w-5 h-5" />
              Verbunden!
            </>
          ) : (
            "Daten abrufen"
          )}
        </motion.button>
      </form>

      {/* Trust Indicators */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mt-6 flex items-center justify-center gap-4 text-white/30 text-xs"
      >
        <span className="flex items-center gap-1">
          <Lock className="w-3 h-3" />
          Verschlüsselte Verbindung
        </span>
        <span>•</span>
        <span>Keine Datenspeicherung</span>
      </motion.div>
    </motion.div>
  );
}
