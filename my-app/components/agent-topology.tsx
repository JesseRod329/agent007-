"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, ZoomIn, ZoomOut, Maximize2 } from "lucide-react";

interface Node {
  id: string;
  name: string;
  type: "agent" | "hub" | "user";
  x: number;
  y: number;
  color: string;
  status: "online" | "busy" | "offline";
}

interface Edge {
  from: string;
  to: string;
  active: boolean;
  label?: string;
}

const nodes: Node[] = [
  { id: "hub", name: "Nexus Hub", type: "hub", x: 50, y: 50, color: "#3b82f6", status: "online" },
  { id: "user", name: "You", type: "user", x: 50, y: 85, color: "#fff", status: "online" },
  { id: "1", name: "Claude", type: "agent", x: 20, y: 25, color: "#f59e0b", status: "online" },
  { id: "2", name: "GPT-4", type: "agent", x: 50, y: 15, color: "#10b981", status: "busy" },
  { id: "3", name: "Gemini", type: "agent", x: 80, y: 25, color: "#8b5cf6", status: "online" },
  { id: "4", name: "Llama", type: "agent", x: 15, y: 55, color: "#ec4899", status: "offline" },
  { id: "5", name: "Mistral", type: "agent", x: 85, y: 55, color: "#06b6d4", status: "online" },
  { id: "6", name: "Coder", type: "agent", x: 30, y: 75, color: "#f97316", status: "busy" },
  { id: "7", name: "Analyst", type: "agent", x: 70, y: 75, color: "#14b8a6", status: "online" },
];

const edges: Edge[] = [
  { from: "hub", to: "1", active: true, label: "12ms" },
  { from: "hub", to: "2", active: true, label: "8ms" },
  { from: "hub", to: "3", active: true, label: "15ms" },
  { from: "hub", to: "4", active: false },
  { from: "hub", to: "5", active: true, label: "10ms" },
  { from: "hub", to: "6", active: true, label: "6ms" },
  { from: "hub", to: "7", active: true, label: "9ms" },
  { from: "user", to: "hub", active: true, label: "2ms" },
  { from: "1", to: "2", active: true },
  { from: "2", to: "3", active: false },
  { from: "6", to: "7", active: true },
];

export function AgentTopology() {
  const [activeEdges, setActiveEdges] = useState<string[]>([]);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const interval = setInterval(() => {
      const randomEdge = edges[Math.floor(Math.random() * edges.length)];
      const key = `${randomEdge.from}-${randomEdge.to}`;
      setActiveEdges((prev) => {
        if (prev.includes(key)) {
          return prev.filter((k) => k !== key);
        }
        return [...prev.slice(-5), key];
      });
    }, 500);

    return () => clearInterval(interval);
  }, []);

  const getNodeById = (id: string) => nodes.find((n) => n.id === id);

  return (
    <Card className="glass-card border-0 h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-base font-semibold">Network Topology</CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Real-time view of your agent connections
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setScale(s => Math.min(s + 0.1, 1.5))}>
            <ZoomIn className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setScale(s => Math.max(s - 0.1, 0.5))}>
            <ZoomOut className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Maximize2 className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="relative w-full aspect-[16/10] bg-muted/30 rounded-xl overflow-hidden">
          {/* Grid Background */}
          <div className="absolute inset-0 bg-grid-dense opacity-30" />
          
          {/* SVG Network */}
          <svg 
            className="absolute inset-0 w-full h-full"
            style={{ transform: `scale(${scale})`, transformOrigin: 'center' }}
          >
            {/* Edges */}
            {edges.map((edge, i) => {
              const from = getNodeById(edge.from);
              const to = getNodeById(edge.to);
              if (!from || !to) return null;

              const isActive = edge.active && activeEdges.includes(`${edge.from}-${edge.to}`);
              const isHighlighted = hoveredNode && (hoveredNode === edge.from || hoveredNode === edge.to);

              return (
                <g key={i}>
                  <motion.line
                    x1={`${from.x}%`}
                    y1={`${from.y}%`}
                    x2={`${to.x}%`}
                    y2={`${to.y}%`}
                    stroke={isActive || isHighlighted ? "hsl(var(--primary))" : "rgba(148, 163, 184, 0.2)"}
                    strokeWidth={isActive || isHighlighted ? 2 : 1}
                    strokeDasharray={edge.active ? "0" : "5,5"}
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1, delay: i * 0.05 }}
                  />
                  {edge.label && (
                    <text
                      x={`${(from.x + to.x) / 2}%`}
                      y={`${(from.y + to.y) / 2}%`}
                      className="text-[10px] fill-muted-foreground"
                      textAnchor="middle"
                      dy="-5"
                    >
                      {edge.label}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>

          {/* Nodes */}
          {nodes.map((node, i) => (
            <motion.div
              key={node.id}
              className="absolute"
              style={{
                left: `${node.x}%`,
                top: `${node.y}%`,
              }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: i * 0.05, type: "spring" }}
              onMouseEnter={() => setHoveredNode(node.id)}
              onMouseLeave={() => setHoveredNode(null)}
            >
              <motion.div
                className="relative -translate-x-1/2 -translate-y-1/2 cursor-pointer"
                animate={{
                  scale: hoveredNode === node.id ? 1.15 : 1,
                }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                {/* Glow */}
                <div
                  className="absolute inset-0 rounded-full blur-xl opacity-40"
                  style={{ 
                    backgroundColor: node.color,
                    width: node.type === "hub" ? "60px" : "40px",
                    height: node.type === "hub" ? "60px" : "40px",
                    left: "50%",
                    top: "50%",
                    transform: "translate(-50%, -50%)"
                  }}
                />
                
                {/* Node */}
                <div
                  className={`relative rounded-full flex items-center justify-center ${
                    node.type === "hub" ? "w-14 h-14" : "w-10 h-10"
                  }`}
                  style={{ 
                    backgroundColor: `${node.color}20`,
                    border: `2px solid ${node.color}`,
                    boxShadow: `0 0 20px ${node.color}40`
                  }}
                >
                  <span 
                    className={`font-bold ${node.type === "hub" ? "text-sm" : "text-xs"}`}
                    style={{ color: node.color }}
                  >
                    {node.name.slice(0, 2)}
                  </span>
                </div>

                {/* Status */}
                <div
                  className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-background ${
                    node.status === "online"
                      ? "bg-emerald-500"
                      : node.status === "busy"
                      ? "bg-amber-500 animate-pulse"
                      : "bg-slate-500"
                  }`}
                />
              </motion.div>

              {/* Tooltip */}
              {hoveredNode === node.id && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute left-1/2 -translate-x-1/2 top-full mt-2 z-10"
                >
                  <div className="glass-card rounded-lg px-3 py-2 whitespace-nowrap">
                    <p className="font-semibold text-sm">{node.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="secondary" className="text-[10px]">
                        {node.type}
                      </Badge>
                      <span className={`text-[10px] ${
                        node.status === "online" ? "text-emerald-500" : 
                        node.status === "busy" ? "text-amber-500" : "text-slate-500"
                      }`}>
                        {node.status}
                      </span>
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          ))}

          {/* Data Packets */}
          {activeEdges.map((edgeKey) => {
            const [fromId, toId] = edgeKey.split("-");
            const from = getNodeById(fromId);
            const to = getNodeById(toId);
            if (!from || !to) return null;

            return (
              <motion.div
                key={edgeKey}
                className="absolute w-2 h-2 bg-primary rounded-full shadow-lg shadow-primary/50"
                initial={{
                  left: `${from.x}%`,
                  top: `${from.y}%`,
                }}
                animate={{
                  left: `${to.x}%`,
                  top: `${to.y}%`,
                }}
                transition={{
                  duration: 0.5,
                  ease: "easeInOut",
                }}
              />
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 mt-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-emerald-500" />
            <span>Online</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-amber-500" />
            <span>Busy</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-slate-500" />
            <span>Offline</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-0.5 bg-primary" />
            <span>Active</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-0.5 border-t border-dashed border-muted-foreground" />
            <span>Inactive</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
