"use client";

import { Lock, HardDriveDownload, Trash2, Cpu, Laptop, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

const featureList = [
  { icon: Lock, label: "Encrypted Vault" },
  { icon: HardDriveDownload, label: "Drag & Drop" },
  { icon: Trash2, label: "Smart Cleanup" },
  { icon: Cpu, label: "Built with Rust" },
  { icon: Laptop, label: "Works Offline" },
  { icon: ShieldCheck, label: "Zero Telemetry" },
];

export default function Features() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: 0.1, ease: "easeOut" }}
      className="grid grid-cols-2 lg:grid-cols-3 gap-y-6 gap-x-4"
    >
      {featureList.map((feature, idx) => (
        <div key={idx} className="flex items-center gap-3">
          <div className="flex items-center justify-center w-8 h-8 rounded-md bg-secondary border border-border text-foreground">
            <feature.icon className="w-4 h-4" />
          </div>
          <span className="text-sm font-medium text-muted-foreground">{feature.label}</span>
        </div>
      ))}
    </motion.div>
  );
}
