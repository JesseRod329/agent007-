"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Agent {
  id: string;
  name: string;
  status: "online" | "thinking" | "busy" | "offline";
  color: string;
  lastMessage: string;
  messagesPerMin: number;
}

const agents: Agent[] = [
  { id: "1", name: "Claude", status: "online", color: "#f59e0b", lastMessage: "2s ago", messagesPerMin: 45 },
  { id: "2", name: "GPT-4", status: "thinking", color: "#10b981", lastMessage: "1s ago", messagesPerMin: 38 },
  { id: "3", name: "Gemini", status: "online", color: "#3b82f6", lastMessage: "5s ago", messagesPerMin: 32 },
  { id: "4", name: "Llama", status: "offline", color: "#8b5cf6", lastMessage: "2h ago", messagesPerMin: 0 },
  { id: "5", name: "Mistral", status: "busy", color: "#ec4899", lastMessage: "3s ago", messagesPerMin: 28 },
  { id: "6", name: "Coder", status: "online", color: "#06b6d4", lastMessage: "1s ago", messagesPerMin: 52 },
  { id: "7", name: "Analyst", status: "online", color: "#14b8a6", lastMessage: "4s ago", messagesPerMin: 41 },
];

const statusConfig = {
  online: { color: "bg-emerald-500", label: "Online" },
  thinking: { color: "bg-amber-500 animate-pulse", label: "Thinking" },
  busy: { color: "bg-blue-500", label: "Busy" },
  offline: { color: "bg-slate-500", label: "Offline" },
};

export function AgentStatusList() {
  return (
    <Card className="glass-card border-0">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold">Agent Status</CardTitle>
          <Badge variant="secondary" className="text-xs">
            {agents.filter(a => a.status !== "offline").length}/{agents.length} Active
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[300px] px-6">
          <div className="space-y-3 pb-6">
            {agents.map((agent, index) => {
              const status = statusConfig[agent.status];
              
              return (
                <motion.div
                  key={agent.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="relative">
                    <Avatar className="w-9 h-9">
                      <AvatarFallback
                        style={{ backgroundColor: `${agent.color}20`, color: agent.color }}
                        className="text-xs font-bold"
                      >
                        {agent.name.slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <span className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-background ${status.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-sm">{agent.name}</span>
                      <span className="text-xs text-muted-foreground">{agent.lastMessage}</span>
                    </div>
                    <div className="flex items-center justify-between mt-0.5">
                      <span className={`text-xs ${
                        agent.status === "online" ? "text-emerald-500" :
                        agent.status === "thinking" ? "text-amber-500" :
                        agent.status === "busy" ? "text-blue-500" :
                        "text-slate-500"
                      }`}>
                        {status.label}
                      </span>
                      {agent.messagesPerMin > 0 && (
                        <span className="text-xs text-muted-foreground">
                          {agent.messagesPerMin} msg/min
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
