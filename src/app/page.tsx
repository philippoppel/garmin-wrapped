"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Button from "@/components/ui/Button";
import { Activity, TrendingUp, Award, Share2, Shield, Zap, BarChart3, Clock, Mountain, Heart, ChevronDown } from "lucide-react";

// Animated background with particles
function AnimatedBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {/* Gradient orbs */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full blur-3xl opacity-30"
          style={{
            width: 300 + i * 100,
            height: 300 + i * 100,
            background: [
              "radial-gradient(circle, rgba(0,163,255,0.4) 0%, transparent 70%)",
              "radial-gradient(circle, rgba(138,43,226,0.3) 0%, transparent 70%)",
              "radial-gradient(circle, rgba(255,107,107,0.3) 0%, transparent 70%)",
              "radial-gradient(circle, rgba(78,205,196,0.3) 0%, transparent 70%)",
              "radial-gradient(circle, rgba(255,159,67,0.3) 0%, transparent 70%)",
            ][i],
            left: `${-10 + i * 25}%`,
            top: `${10 + (i % 3) * 30}%`,
          }}
          animate={{
            x: [0, 50, 0],
            y: [0, 30, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 10 + i * 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Floating particles */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={`particle-${i}`}
          className="absolute w-1 h-1 bg-white/20 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
        />
      ))}

      {/* Grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '50px 50px',
        }}
      />
    </div>
  );
}

// Animated Logo Component
function AnimatedLogo() {
  return (
    <motion.div
      className="relative w-20 h-20 mx-auto mb-6"
      initial={{ scale: 0, rotate: -180 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ type: "spring", duration: 1, bounce: 0.4 }}
    >
      {/* Outer ring - animated */}
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{
          background: "conic-gradient(from 0deg, #00a3ff, #8a2be2, #ff6b6b, #4ecdc4, #00a3ff)",
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
      />

      {/* Inner circle */}
      <div className="absolute inset-1 rounded-full bg-[#0a0a1a]" />

      {/* Icon container */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          animate={{
            y: [0, -3, 0],
          }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <svg viewBox="0 0 24 24" className="w-10 h-10 text-white" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            {/* Running figure stylized */}
            <motion.path
              d="M13 4a1 1 0 1 0 2 0 1 1 0 0 0-2 0"
              fill="currentColor"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5 }}
            />
            <motion.path
              d="M7 21l3-4"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            />
            <motion.path
              d="M16 21l-2-4"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ delay: 0.7, duration: 0.5 }}
            />
            <motion.path
              d="M12 17l-1-4 4-2-3-3 1-3"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ delay: 0.8, duration: 0.8 }}
            />
            <motion.path
              d="M6 12l2-1"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ delay: 1, duration: 0.3 }}
            />
          </svg>
        </motion.div>
      </div>

      {/* Pulse effect */}
      <motion.div
        className="absolute inset-0 rounded-full border-2 border-cyan-500/50"
        animate={{
          scale: [1, 1.5, 1.5],
          opacity: [0.5, 0, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeOut",
        }}
      />
    </motion.div>
  );
}

// Feature Card Component
function FeatureCard({ icon, title, description, color, delay }: {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.5 }}
      whileHover={{ y: -5, scale: 1.02 }}
      className="relative group"
    >
      {/* Glow on hover */}
      <div className={`absolute -inset-1 rounded-2xl bg-gradient-to-r ${color} opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500`} />

      <div className="relative bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 group-hover:border-white/20 transition-colors h-full">
        <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform`}>
          {icon}
        </div>
        <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
        <p className="text-white/50 text-sm leading-relaxed">{description}</p>
      </div>
    </motion.div>
  );
}

// Step Component for How It Works
function StepCard({ number, title, description, delay }: {
  number: number;
  title: string;
  description: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.5 }}
      className="flex gap-4"
    >
      <div className="flex-shrink-0">
        <motion.div
          className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold text-xl"
          whileHover={{ scale: 1.1, rotate: 5 }}
        >
          {number}
        </motion.div>
      </div>
      <div>
        <h3 className="text-lg font-bold text-white mb-1">{title}</h3>
        <p className="text-white/50 text-sm">{description}</p>
      </div>
    </motion.div>
  );
}

export default function Home() {
  const features = [
    {
      icon: <Activity className="w-7 h-7" />,
      title: "Alle Sportarten",
      description: "Laufen, Radfahren, Schwimmen, Wandern, Krafttraining und mehr - alle auf einen Blick vereint.",
      color: "from-cyan-500 to-blue-600",
    },
    {
      icon: <BarChart3 className="w-7 h-7" />,
      title: "Statistiken",
      description: "Entdecke deinen aktivsten Monat, besten Wochentag und vergleiche dich mit anderen Athleten.",
      color: "from-purple-500 to-pink-600",
    },
    {
      icon: <Award className="w-7 h-7" />,
      title: "Achievements",
      description: "Verdiene Badges für deine Leistungen - von Rare bis Legendary. Sammle sie alle!",
      color: "from-amber-500 to-orange-600",
    },
    {
      icon: <TrendingUp className="w-7 h-7" />,
      title: "Jahresvergleich",
      description: "Sieh wie du dich im Vergleich zum Vorjahr verbessert hast. Deine Entwicklung visualisiert.",
      color: "from-green-500 to-emerald-600",
    },
    {
      icon: <Heart className="w-7 h-7" />,
      title: "Wellness & Recovery",
      description: "Schlaf-Score, HRV, Body Battery - deine Regeneration im Überblick.",
      color: "from-red-500 to-pink-600",
    },
    {
      icon: <Share2 className="w-7 h-7" />,
      title: "Fun Facts & Sharing",
      description: "Lustige Fakten über dein Jahr + Share Cards für Instagram Stories.",
      color: "from-indigo-500 to-purple-600",
    },
  ];

  const stats = [
    { icon: <Mountain className="w-5 h-5" />, value: "Höhenmeter", label: "Eiffelturm-Vergleich" },
    { icon: <Clock className="w-5 h-5" />, value: "Stunden", label: "Netflix-Staffeln" },
    { icon: <Zap className="w-5 h-5" />, value: "Kalorien", label: "Burger verdient" },
    { icon: <Activity className="w-5 h-5" />, value: "Distanz", label: "Mond-Prozent" },
  ];

  return (
    <main className="min-h-screen bg-[#0a0a1a] overflow-hidden">
      <AnimatedBackground />

      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-4 py-20">
        <div className="relative z-10 text-center max-w-4xl mx-auto">
          {/* Animated Logo */}
          <AnimatedLogo />

          {/* Brand Name */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="mb-2"
          >
            <h1 className="text-6xl md:text-8xl font-black tracking-tight">
              <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
                GWRAP
              </span>
            </h1>
          </motion.div>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="text-xl md:text-2xl text-white/40 mb-2 font-light tracking-wide"
          >
            Dein Jahr in Bewegung
          </motion.p>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="text-base md:text-lg text-white/60 mb-10 max-w-xl mx-auto"
          >
            Der ultimative Jahresrückblick für deine Garmin-Aktivitäten.
            Spotify Wrapped, aber für Athleten.
          </motion.p>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="mb-8"
          >
            <Link href="/upload">
              <motion.button
                className="group relative px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl font-bold text-lg text-white shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-shadow"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="flex items-center gap-2">
                  Jetzt starten
                  <motion.span
                    animate={{ x: [0, 5, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                  >
                    →
                  </motion.span>
                </span>

                {/* Shine effect */}
                <motion.div
                  className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: "100%" }}
                  transition={{ duration: 0.6 }}
                />
              </motion.button>
            </Link>
          </motion.div>

          {/* Trust badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.5 }}
            className="flex flex-wrap justify-center gap-4 text-white/30 text-sm"
          >
            <span className="flex items-center gap-1">
              <Shield className="w-4 h-4" />
              100% Privat
            </span>
            <span>•</span>
            <span>Keine Anmeldung</span>
            <span>•</span>
            <span>Komplett kostenlos</span>
          </motion.div>

          {/* Fun Facts Preview */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.8 }}
            className="mt-16"
          >
            <p className="text-white/40 text-sm mb-4">Entdecke Fun Facts wie:</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {stats.map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.4 + i * 0.1, duration: 0.4 }}
                  whileHover={{ scale: 1.05, y: -2 }}
                  className="bg-white/5 backdrop-blur-sm rounded-xl p-3 border border-white/10"
                >
                  <div className="flex items-center justify-center gap-2 text-white/70 mb-1">
                    {stat.icon}
                    <span className="text-sm font-medium">{stat.value}</span>
                  </div>
                  <div className="text-xs text-white/40">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="absolute bottom-8"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="text-white/20 flex flex-col items-center gap-2 cursor-pointer"
            onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
          >
            <span className="text-xs">Mehr entdecken</span>
            <ChevronDown className="w-5 h-5" />
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <motion.span
              className="inline-block px-4 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-sm font-medium mb-4"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
            >
              Features
            </motion.span>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
              Alles was du brauchst
            </h2>
            <p className="text-white/50 max-w-xl mx-auto">
              Von Statistiken über Achievements bis zu teilbaren Fun Facts
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <FeatureCard
                key={feature.title}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                color={feature.color}
                delay={i * 0.1}
              />
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="relative z-10 py-24 px-4 bg-gradient-to-b from-transparent via-white/[0.02] to-transparent">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <motion.span
              className="inline-block px-4 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-sm font-medium mb-4"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
            >
              So funktioniert's
            </motion.span>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
              In 3 einfachen Schritten
            </h2>
          </motion.div>

          <div className="space-y-8">
            <StepCard
              number={1}
              title="Mit Garmin anmelden"
              description="Gib deine Garmin Connect Zugangsdaten ein. Deine Daten werden nur lokal verarbeitet und niemals gespeichert."
              delay={0}
            />
            <motion.div
              initial={{ scaleY: 0 }}
              whileInView={{ scaleY: 1 }}
              viewport={{ once: true }}
              className="w-0.5 h-8 bg-gradient-to-b from-cyan-500 to-purple-500 ml-6 origin-top"
            />
            <StepCard
              number={2}
              title="Jahr auswählen"
              description="Wähle das Jahr für deinen Rückblick. Du kannst auch mehrere Jahre vergleichen."
              delay={0.2}
            />
            <motion.div
              initial={{ scaleY: 0 }}
              whileInView={{ scaleY: 1 }}
              viewport={{ once: true }}
              className="w-0.5 h-8 bg-gradient-to-b from-purple-500 to-pink-500 ml-6 origin-top"
            />
            <StepCard
              number={3}
              title="Staunen & Teilen"
              description="Erlebe deinen persönlichen Jahresrückblick mit epischen Animationen und teile ihn auf Social Media."
              delay={0.4}
            />
          </div>

          {/* Second CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Link href="/upload">
              <Button size="lg" variant="secondary" className="text-lg">
                Los geht's →
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Privacy Section */}
      <section className="relative z-10 py-24 px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto"
        >
          <div className="relative">
            {/* Glow */}
            <div className="absolute -inset-4 bg-gradient-to-r from-green-500/20 via-emerald-500/20 to-green-500/20 rounded-3xl blur-2xl" />

            <div className="relative bg-white/5 backdrop-blur-sm rounded-3xl p-8 md:p-12 border border-white/10 text-center">
              <motion.div
                className="text-6xl mb-6"
                animate={{
                  rotateY: [0, 360],
                }}
                transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
              >
                🔒
              </motion.div>
              <h3 className="text-3xl font-bold text-white mb-4">100% Privatsphäre</h3>
              <p className="text-white/60 text-lg mb-6 max-w-lg mx-auto">
                Deine Daten werden ausschließlich in deinem Browser verarbeitet.
                Wir speichern nichts auf unseren Servern. Alles bleibt bei dir.
              </p>
              <div className="flex flex-wrap justify-center gap-4 text-sm">
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 text-green-400 border border-green-500/20">
                  <Shield className="w-4 h-4" />
                  Keine Datenspeicherung
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 text-green-400 border border-green-500/20">
                  <Zap className="w-4 h-4" />
                  Lokale Verarbeitung
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Final CTA Section */}
      <section className="relative z-10 py-24 px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto text-center"
        >
          <motion.h2
            className="text-4xl md:text-5xl font-black text-white mb-6"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            Bereit für deinen
            <br />
            <span className="bg-gradient-to-r from-cyan-400 to-purple-600 bg-clip-text text-transparent">
              Jahresrückblick?
            </span>
          </motion.h2>
          <p className="text-white/50 mb-8">
            Erstelle jetzt deinen persönlichen GWRAP in weniger als 2 Minuten.
          </p>
          <Link href="/upload">
            <motion.button
              className="px-10 py-5 bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 rounded-2xl font-bold text-xl text-white shadow-lg shadow-purple-500/25"
              whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(139, 92, 246, 0.3)" }}
              whileTap={{ scale: 0.98 }}
            >
              Jetzt GWRAP erstellen
            </motion.button>
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-8 px-4 border-t border-white/10">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-cyan-500 to-purple-600 flex items-center justify-center">
                <Activity className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-white">GWRAP</span>
              <span className="text-white/30 text-sm">2024</span>
            </div>

            {/* Links */}
            <div className="text-white/30 text-sm text-center md:text-right">
              <p>Nicht offiziell mit Garmin verbunden</p>
              <p className="mt-1">Made with ❤️ for athletes</p>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
