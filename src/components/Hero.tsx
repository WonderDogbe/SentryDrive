"use client";

import { motion } from "framer-motion";
import DownloadButton from "./DownloadButton";

const GithubIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg
    className={className}
    fill="currentColor"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <path
      fillRule="evenodd"
      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
      clipRule="evenodd"
    />
  </svg>
);

export default function Hero() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="flex flex-col gap-6"
    >
      <div className="inline-flex w-fit items-center rounded-full border border-border px-3 py-1 text-xs font-medium text-muted-foreground">
        Version 0.2.0 • Cross-Platform • Offline
      </div>
      <h1 className="text-4xl lg:text-5xl font-semibold tracking-tight leading-tight">
        Protect What Matters.<br/>
        <span className="text-muted-foreground">Clean What Doesn't.</span>
      </h1>
      <p className="text-lg text-muted-foreground">
        SentryDrive is an offline-first premium tool to protect your files and clean up the rest. Built for speed and simplicity.
      </p>
      <div className="flex flex-wrap gap-4 mt-2">
        <DownloadButton className="bg-foreground text-background px-6 py-3 rounded-md font-medium hover:bg-foreground/90 transition-colors active:scale-[0.98]">
          Download Now
        </DownloadButton>
        <a 
          href="https://github.com/christliebdela/SentryDrive" 
          target="_blank"
          rel="noopener noreferrer"
          className="bg-secondary text-secondary-foreground border border-border px-6 py-3 rounded-md font-medium hover:bg-secondary/80 transition-colors active:scale-[0.98] inline-flex items-center justify-center gap-2"
        >
          <GithubIcon className="w-4 h-4" />
          <span>GitHub</span>
        </a>
      </div>
    </motion.div>
  );
}
