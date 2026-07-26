"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Monitor, Download, ShieldCheck } from "lucide-react";

interface DownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DownloadModal({ isOpen, onClose }: DownloadModalProps) {
  if (!isOpen) return null;

  const handleSelectPlatform = (platform: string) => {
    onClose();
    window.location.href = `/api/download/${encodeURIComponent(platform)}`;
  };

  const platforms = [
    {
      id: "windows",
      name: "Windows",
      badge: ".exe setup",
      desc: "Windows 10 & 11 (64-bit installer)",
    },
    {
      id: "macOS",
      name: "macOS",
      badge: ".dmg package",
      desc: "macOS 12.0+ (Apple Silicon & Intel)",
    },
    {
      id: "linux",
      name: "Linux",
      badge: ".AppImage",
      desc: "Standalone binary for Ubuntu, Fedora, Arch & distros",
    },
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="relative w-full max-w-lg bg-white dark:bg-zinc-900 border border-slate-300 dark:border-zinc-700/80 rounded-2xl shadow-2xl p-6 sm:p-7 flex flex-col gap-6"
        >
          {/* Header */}
          <div className="flex items-start justify-between pb-3 border-b border-slate-200 dark:border-zinc-800">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 rounded-lg bg-emerald-100 dark:bg-emerald-500/20 border border-emerald-300 dark:border-emerald-500/30 text-emerald-800 dark:text-emerald-400">
                  <Download className="w-5 h-5" />
                </div>
                <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-zinc-950 dark:text-white">
                  Select Operating System
                </h2>
              </div>
              <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mt-1">
                Choose your platform to start downloading SentryDrive installer.
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-zinc-700 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white p-2 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 border border-slate-300 dark:border-zinc-700 transition-colors cursor-pointer"
              type="button"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Platform Selection List with Prominent Download Buttons */}
          <div className="flex flex-col gap-3.5">
            {platforms.map((p) => (
              <div
                key={p.id}
                onClick={() => handleSelectPlatform(p.id)}
                className="group relative flex items-center justify-between p-4 rounded-xl bg-slate-50 hover:bg-slate-100 dark:bg-zinc-800/90 dark:hover:bg-zinc-800 border border-slate-300 dark:border-zinc-700 hover:border-emerald-600 dark:hover:border-emerald-500 transition-all text-left cursor-pointer active:scale-[0.99] shadow-sm"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-white dark:bg-zinc-900 border border-slate-300 dark:border-zinc-700 text-emerald-700 dark:text-emerald-400 group-hover:border-emerald-500 transition-colors shadow-xs">
                    <Monitor className="w-6 h-6" />
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <div className="flex items-center gap-2.5">
                      <span className="font-bold text-base sm:text-lg text-zinc-950 dark:text-white group-hover:text-emerald-800 dark:group-hover:text-emerald-300 transition-colors">
                        {p.name}
                      </span>
                      <span className="text-xs font-mono font-bold bg-emerald-100 dark:bg-emerald-500/20 text-emerald-900 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-500/30 px-2 py-0.5 rounded-md">
                        {p.badge}
                      </span>
                    </div>
                    <span className="text-xs sm:text-sm font-medium text-zinc-700 dark:text-zinc-300">
                      {p.desc}
                    </span>
                  </div>
                </div>

                {/* Explicit Download Action Button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelectPlatform(p.id);
                  }}
                  className="bg-zinc-950 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-zinc-950 font-bold px-3.5 py-2 rounded-lg text-xs sm:text-sm inline-flex items-center gap-1.5 shadow-sm transition-transform group-hover:scale-105 active:scale-95 cursor-pointer whitespace-nowrap"
                >
                  <Download className="w-4 h-4" />
                  <span>Download</span>
                </button>
              </div>
            ))}
          </div>

          {/* Footer Note */}
          <div className="flex items-center justify-between text-xs font-medium text-zinc-700 dark:text-zinc-300 pt-3 border-t border-slate-200 dark:border-zinc-800">
            <span className="flex items-center gap-1.5 text-emerald-800 dark:text-emerald-400 font-bold">
              <ShieldCheck className="w-4 h-4" />
              Verified Official Installer
            </span>
            <span className="font-mono text-zinc-900 dark:text-zinc-200 font-bold bg-slate-100 dark:bg-zinc-800 px-2.5 py-1 rounded-md border border-slate-300 dark:border-zinc-700">
              v0.4.0 Latest
            </span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
