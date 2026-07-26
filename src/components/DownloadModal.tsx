"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Download, ShieldCheck, CheckCircle2, Terminal } from "lucide-react";

interface DownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// OS Specific Brand Icons
const WindowsIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 88 88" fill="currentColor">
    <path d="M0 12.402l35.687-4.86.016 34.423-35.67.203zm35.67 33.529l.028 34.453L0 75.541l.017-30.077zm4.326-39.066L88 0v41.212l-48.004.288zm48.004 38.835L88 88l-48.004-6.77.016-35.918z" />
  </svg>
);

const AppleIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 170 170" fill="currentColor">
    <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.34.13-9.13-1.9-14.37-6.08-3.38-2.74-7.25-7.39-11.61-13.94-6.3-9.4-11.04-19.86-14.2-31.39-3.17-11.53-4.75-22.37-4.75-32.5 0-14.65 3.7-26.68 11.1-36.08 7.4-9.4 16.64-14.18 27.72-14.34 4.8 0 10.02 1.25 15.67 3.75 5.65 2.5 9.48 3.75 11.5 3.75 1.7 0 5.61-1.34 11.73-4.02 6.12-2.68 11.45-3.9 16.01-3.66 11.63.68 20.9 4.97 27.81 12.87-10.45 6.35-15.54 15.22-15.27 26.62.27 9.07 3.7 16.66 10.29 22.77 6.59 6.11 14.44 9.58 23.55 10.41-2.45 7.15-5.65 14.35-9.61 21.6zM119.22 31.81c0-6.84 2.45-13.62 7.35-20.34 4.9-6.72 11.06-11.04 18.48-12.97.13 1.07.2 1.95.2 2.65 0 6.94-2.52 13.78-7.56 20.52-5.04 6.74-11.23 11.04-18.57 12.9-0.09-0.78-0.13-1.61-0.13-2.51 text-current stroke-0" />
  </svg>
);

export default function DownloadModal({ isOpen, onClose }: DownloadModalProps) {
  const [detectedOS, setDetectedOS] = useState<"windows" | "macOS" | "linux">("windows");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const ua = navigator.userAgent.toLowerCase();
      if (ua.includes("mac") || ua.includes("os x")) {
        setDetectedOS("macOS");
      } else if (ua.includes("linux") || ua.includes("ubuntu")) {
        setDetectedOS("linux");
      } else {
        setDetectedOS("windows");
      }
    }
  }, []);

  if (!isOpen) return null;

  const handleSelectPlatform = (platform: string) => {
    onClose();
    window.location.href = `/api/download/${encodeURIComponent(platform)}`;
  };

  const platformDefinitions = [
    {
      id: "windows",
      name: "Windows",
      badge: ".exe setup",
      desc: "Windows 10 & 11 (64-bit installer)",
      Icon: WindowsIcon,
    },
    {
      id: "macOS",
      name: "macOS",
      badge: ".dmg package",
      desc: "macOS 12.0+ (Apple Silicon & Intel)",
      Icon: AppleIcon,
    },
    {
      id: "linux",
      name: "Linux",
      badge: ".AppImage",
      desc: "Standalone binary for Ubuntu, Fedora & distros",
      Icon: Terminal,
    },
  ];

  // Re-order so detected OS is prioritized at the top
  const sortedPlatforms = [...platformDefinitions].sort((a, b) => {
    if (a.id === detectedOS) return -1;
    if (b.id === detectedOS) return 1;
    return 0;
  });

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-md overflow-hidden">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="relative w-full max-w-xl bg-white dark:bg-zinc-900 border border-slate-300 dark:border-zinc-700/80 rounded-2xl shadow-2xl p-5 sm:p-7 flex flex-col gap-6 overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-start justify-between pb-3 border-b border-slate-200 dark:border-zinc-800">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 rounded-lg bg-blue-100 dark:bg-blue-500/20 border border-blue-300 dark:border-blue-500/30 text-blue-800 dark:text-blue-400">
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

          {/* Platform Selection Cards - Blue Color Theme */}
          <div className="flex flex-col gap-3.5">
            {sortedPlatforms.map((p) => {
              const isDetected = p.id === detectedOS;
              return (
                <div
                  key={p.id}
                  onClick={() => handleSelectPlatform(p.id)}
                  className={`group relative flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-xl transition-all text-left cursor-pointer active:scale-[0.99] shadow-sm gap-3 overflow-hidden ${
                    isDetected
                      ? "bg-blue-500/10 dark:bg-blue-500/10 border-2 border-blue-600 dark:border-blue-500"
                      : "bg-slate-50 hover:bg-slate-100 dark:bg-zinc-800/90 dark:hover:bg-zinc-800 border border-slate-300 dark:border-zinc-700 hover:border-blue-600 dark:hover:border-blue-500"
                  }`}
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="p-3 rounded-lg bg-white dark:bg-zinc-900 border border-slate-300 dark:border-zinc-700 text-blue-700 dark:text-blue-400 group-hover:border-blue-500 transition-colors shadow-xs shrink-0">
                      <p.Icon className="w-6 h-6" />
                    </div>
                    <div className="flex flex-col gap-0.5 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-bold text-base sm:text-lg text-zinc-950 dark:text-white group-hover:text-blue-800 dark:group-hover:text-blue-300 transition-colors">
                          {p.name}
                        </span>
                        <span className="text-xs font-mono font-bold bg-blue-100 dark:bg-blue-500/20 text-blue-900 dark:text-blue-300 border border-blue-300 dark:border-blue-500/30 px-2 py-0.5 rounded-md">
                          {p.badge}
                        </span>
                        {isDetected && (
                          <span className="text-[10px] font-sans font-bold bg-blue-600 text-white px-2 py-0.5 rounded-full flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            Detected
                          </span>
                        )}
                      </div>
                      <span className="text-xs sm:text-sm font-medium text-zinc-700 dark:text-zinc-300 truncate">
                        {p.desc}
                      </span>
                    </div>
                  </div>

                  {/* Explicit Action Button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectPlatform(p.id);
                    }}
                    className={`font-bold px-3.5 py-2.5 rounded-xl text-xs sm:text-sm inline-flex items-center gap-2 shadow-md transition-all group-hover:scale-105 active:scale-95 cursor-pointer whitespace-nowrap shrink-0 self-end sm:self-center ${
                      isDetected
                        ? "bg-blue-600 hover:bg-blue-700 text-white"
                        : "bg-zinc-950 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-zinc-950"
                    }`}
                  >
                    <p.Icon className="w-4 h-4" />
                    <span>Download</span>
                  </button>
                </div>
              );
            })}
          </div>

          {/* Footer Note */}
          <div className="flex items-center justify-between text-xs font-medium text-zinc-700 dark:text-zinc-300 pt-3 border-t border-slate-200 dark:border-zinc-800">
            <span className="flex items-center gap-1.5 text-blue-800 dark:text-blue-400 font-bold">
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
