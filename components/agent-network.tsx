"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";

interface Agent {
  id: string;
  name: string;
  type: string;
  status: "online" | "thinking" | "busy";
  x: number;
  y: number;
  color: string;
}

interface Connection {
  from: string;
  to: string;
  active: boolean;
}

const agents: Agent[] = [
  { id: "1", name: "GPT-4", type: "OpenAI", status: "online", x: 50, y: 20, color: "#10b981" },
  { id: "2", name: "Claude", type: "Anthropic", status: "thinking", x: 80, y: 50, color: "#f59e0b" },
  { id: "3", name: "Gemini", type: "Google", status: "online", x: 50, y: 80, color: "#3b82f6" },
  { id: "4", name: "Llama", type: "Meta", status: "busy", x: 20, y: 50, color: "#8b5cf6" },
  { id: "5", name: "Mistral", type: "Mistral", status: "online", x: 35, y: 35, color: "#ec4899" },
  { id: "6", name: "Coder", type: "Custom", status: "thinking", x: 65, y: 65, color: "#06b6d4" },
];

const connections: Connection[] = [
  { from: "1", to: "2", active: true },
  { from: "2", to: "3", active: false },
  { from: "3", to: "4", active: true },
  { from: "4", to: "1", active: true },
  { from: "5", to: "1", active: false },
  { from: "5", to: "6", active: true },
  { from: "6", to: "3", active: false },
  { from: "2", to: "6", active: true },
];

export function AgentNetwork() {
  const [activeConnections, setActiveConnections] = useState<string[]>([]);
  const [hoveredAgent, setHoveredAgent] = useState<string | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      const randomConn = connections[Math.floor(Math.random() * connections.length)];
      setActiveConnections((prev) => {
        const key = `${randomConn.from}-${randomConn.to}`;
        if (prev.includes(key)) {
          return prev.filter((k) => k !== key);
        }
        return [...prev, key];
      });
    }, 800);

    return () => clearInterval(interval);
  }, []);

  const getAgentById = (id: string) => agents.find((a) => a.id === id);

  return (
    <div className="relative w-full aspect-square max-w-lg mx-auto">
      {/* Background Glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-purple-500/10 rounded-3xl blur-2xl" />
      
      {/* Card Container */}
      <div className="relative glass-card rounded-3xl p-6 h-full">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-sm">Live Agent Network</h3>
          <Badge variant="secondary" className="text-xs">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-1.5 animate-pulse" />
            {agents.filter((a) => a.status === "online").length} Active
          </Badge>
        </div>

        {/* Network Visualization */}
        <div className="relative w-full aspect-square">
          <svg className="absolute inset-0 w-full h-full">
            {/* Connections */}
            {connections.map((conn, i) => {
              const from = getAgentById(conn.from);
              const to = getAgentById(conn.to);
              if (!from || !to) return null;

              const isActive = activeConnections.includes(`${conn.from}-${conn.to}`);
              const isHovered = hoveredAgent && (hoveredAgent === conn.from || hoveredAgent === conn.to);

              return (
                <motion.line
                  key={i}
                  x1={`${from.x}%`}
                  y1={`${from.y}%`}
                  x2={`${to.x}%`}
                  y2={`${to.y}%`}
                  stroke={isActive || isHovered ? "hsl(var(--primary))" : "rgba(148, 163, 184, 0.2)"}
                  strokeWidth={isActive || isHovered ? 2 : 1}
                  initial={{ pathLength: 0 }}
                  animate={{ 
                    pathLength: 1,
                    opacity: isActive ? 1 : 0.3
                  }}
                  transition={{ 
                    pathLength: { duration: 1, delay: i * 0.1 },
                    opacity: { duration: 0.3 }
                  }}
                />
              );
            })}
          </svg>

          {/* Agents */}
          {agents.map((agent, i) => (
            <motion.div
              key={agent.id}
              className="absolute"
              style={{
                left: `${agent.x}%`,
                top: `${agent.y}%`,
              }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: i * 0.1, type: "spring" }}
              onMouseEnter={() => setHoveredAgent(agent.id)}
              onMouseLeave={() => setHoveredAgent(null)}
            >
              <motion.div
                className="relative -translate-x-1/2 -translate-y-1/2 cursor-pointer"
                animate={{
                  scale: hoveredAgent === agent.id ? 1.2 : 1,
                }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                {/* Glow Effect */}
                <div
                  className="absolute inset-0 rounded-full blur-lg opacity-50"
                  style={{ backgroundColor: agent.color }}
                />
                
                {/* Agent Node */}
                <div
                  className="relative w-12 h-12 rounded-full flex items-center justify-center"
                  style={{ 
                    backgroundColor: `${agent.color}20`,
                    border: `2px solid ${agent.color}`,
                    boxShadow: `0 0 20px ${agent.color}40`
                  }}
                >
                  <span className="text-xs font-bold" style={{ color: agent.color }}>
                    {agent.name.slice(0, 2)}
                  </span>
                </div>

                {/* Status Indicator */}
                <div
                  className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-background ${
                    agent.status === "online"
                      ? "bg-emerald-500"
                      : agent.status === "thinking"
                      ? "bg-amber-500 animate-pulse"
                      : "bg-blue-500"
                  }`}
                />
              </motion.div>

              {/* Tooltip */}
              {hoveredAgent === agent.id && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute left-1/2 -translate-x-1/2 top-full mt-2 z-10"
                >
                  <div className="glass-card rounded-lg px-3 py-2 whitespace-nowrap">
                    <p className="font-semibold text-sm">{agent.name}</p>
                    <p className="text-xs text-muted-foreground">{agent.type}</p>
                  </div>
                </motion.div>
              )}
            </motion.div>
          ))}

          {/* Data Packets Animation */}
          {activeConnections.map((connKey) => {
            const [fromId, toId] = connKey.split("-");
            const from = getAgentById(fromId);
            const to = getAgentById(toId);
            if (!from || !to) return null;

            return (
              <motion.div
                key={connKey}
                className="absolute w-2 h-2 bg-primary rounded-full"
                initial={{
                  left: `${from.x}%`,
                  top: `${from.y}%`,
                }}
                animate={{
                  left: `${to.x}%`,
                  top: `${to.y}%`,
                }}
                transition={{
                  duration: 0.8,
                  ease: "easeInOut",
                }}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
