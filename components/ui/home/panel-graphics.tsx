"use client";

import { motion } from "motion/react";

const PAPEL = "#EFE7D8";
const MUSTARD = "#E8A33D";
const RUST = "#C1443B";

export function MateriasGraphic() {
  const tabs = [
    { width: "78%", color: MUSTARD },
    { width: "60%", color: PAPEL },
    { width: "92%", color: RUST },
    { width: "45%", color: PAPEL },
  ];

  return (
    <div className="flex flex-col items-center gap-3">
      {tabs.map((tab, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.5, delay: i * 0.1, ease: "easeOut" }}
          style={{ width: tab.width, backgroundColor: tab.color }}
          className="h-10 rounded-full opacity-90"
        />
      ))}
    </div>
  );
}

export function TareasGraphic() {
  const rows = [true, false, true];

  return (
    <div className="flex flex-col gap-4">
      {rows.map((checked, i) => (
        <div key={i} className="flex items-center gap-4">
          <svg width="28" height="28" viewBox="0 0 28 28" className="shrink-0">
            <circle cx="14" cy="14" r="12" fill="none" stroke={PAPEL} strokeOpacity={0.3} strokeWidth="2" />
            {checked && (
              <motion.path
                d="M8 14.5l4 4 8-8"
                fill="none"
                stroke={MUSTARD}
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 + i * 0.15, ease: "easeInOut" }}
              />
            )}
          </svg>
          <motion.div
            initial={{ opacity: 0, x: -12 }}
            whileInView={{ opacity: checked ? 0.3 : 0.6, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.15 }}
            style={{ width: `${70 - i * 12}%` }}
            className="h-3 rounded-full bg-[#EFE7D8]"
          />
        </div>
      ))}
    </div>
  );
}

export function GruposGraphic() {
  const nodes = [
    { cx: 60, cy: 40 },
    { cx: 140, cy: 30 },
    { cx: 150, cy: 110 },
    { cx: 50, cy: 120 },
  ];
  const edges = [
    [0, 1],
    [1, 2],
    [2, 3],
    [3, 0],
    [0, 2],
  ];

  return (
    <svg viewBox="0 0 200 150" className="w-full max-w-[200px]">
      {edges.map(([a, b], i) => (
        <motion.line
          key={i}
          x1={nodes[a].cx}
          y1={nodes[a].cy}
          x2={nodes[b].cx}
          y2={nodes[b].cy}
          stroke={PAPEL}
          strokeOpacity={0.25}
          strokeWidth="1.5"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: i * 0.08 }}
        />
      ))}
      {nodes.map((node, i) => (
        <motion.circle
          key={i}
          cx={node.cx}
          cy={node.cy}
          r="14"
          fill={i === 0 ? MUSTARD : PAPEL}
          fillOpacity={i === 0 ? 1 : 0.85}
          initial={{ scale: 0, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.3 + i * 0.1, ease: "backOut" }}
        />
      ))}
    </svg>
  );
}