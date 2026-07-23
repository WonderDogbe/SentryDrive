"use client";

import { motion } from "framer-motion";

export default function AppPreview() {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.25, delay: 0.2, ease: "easeOut" }}
      className="w-full max-w-2xl aspect-[4/3] rounded-lg border border-border bg-secondary flex items-center justify-center shadow-2xl overflow-hidden relative"
    >
      <div className="absolute top-0 left-0 w-full h-10 border-b border-border bg-background flex items-center px-4 gap-2">
        <div className="w-3 h-3 rounded-full bg-red-500/50" />
        <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
        <div className="w-3 h-3 rounded-full bg-green-500/50" />
      </div>
      <p className="text-muted-foreground font-mono text-sm">App Preview Placeholder</p>
    </motion.div>
  );
}
