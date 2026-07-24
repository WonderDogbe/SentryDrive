"use client";

import { motion } from "framer-motion";

export default function AppPreview() {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.25, delay: 0.2, ease: "easeOut" }}
      className="w-full max-w-xl aspect-[4/3] rounded-lg border border-border bg-secondary flex items-center justify-center shadow-2xl overflow-hidden relative"
    >
      <img 
        src="/lightscreenshot.png" 
        alt="SentryDrive Preview" 
        className="w-full h-full object-cover" 
      />
    </motion.div>
  );
}
