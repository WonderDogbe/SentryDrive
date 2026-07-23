"use client";

import { motion } from "framer-motion";

export default function Hero() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="flex flex-col gap-6"
    >
      <div className="inline-flex w-fit items-center rounded-full border border-border px-3 py-1 text-xs font-medium text-muted-foreground">
        Version 1.0 • Windows • Offline
      </div>
      <h1 className="text-4xl lg:text-5xl font-semibold tracking-tight leading-tight">
        Protect What Matters.<br/>
        <span className="text-muted-foreground">Clean What Doesn't.</span>
      </h1>
      <p className="text-lg text-muted-foreground">
        SecureVault is an offline-first premium tool to protect your files and clean up the rest. Built for speed and simplicity.
      </p>
      <div className="flex flex-wrap gap-4 mt-2">
        <button className="bg-foreground text-background px-6 py-3 rounded-md font-medium hover:bg-foreground/90 transition-colors active:scale-[0.98]">
          Download Now
        </button>
        <button className="bg-secondary text-secondary-foreground border border-border px-6 py-3 rounded-md font-medium hover:bg-secondary/80 transition-colors active:scale-[0.98]">
          Learn More
        </button>
      </div>
    </motion.div>
  );
}
