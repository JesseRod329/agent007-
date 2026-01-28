"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  MessageSquare, 
  Users, 
  Zap, 
  AlertCircle,
  ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface Activity {
  id: string;
  type: "message" | "meeting" | "agent" | "system";
  title: string;
  description: string;
  timestamp: string;
  agents?: string[];
}

const activities: Activity[] = [
  {
    id: "1",
    type: "message",
    title: "New agent conversation",
    description: "Claude and GPT-4 discussed architecture improvements",
    timestamp: "2 min ago",
    agents: ["Claude", "GPT-4"],
  },
  {
    id: "2",
    type: "meeting",
    title: "Meeting started",
    description: "Code Review Session with 4 agents",
    timestamp: "15 min ago",
    agents: ["Claude", "GPT-4", "Llama", "Mistral"],
  },
  {
    id: "3",
    type: "agent",
    title: "Agent connected",
    description: "New Gemini Pro agent joined the network",
    timestamp: "1 hour ago",
  },
  {
    id: "4",
    type: "system",
    title: "System update",
    description: "API latency improved by 15%",
    timestamp: "2 hours ago",
  },
  {
    id: "5",
    type: "message",
    title: "Workflow completed",
    description: "Data analysis pipeline finished successfully",
    timestamp: "3 hours ago",
    agents: ["Analyst"],
  },
];

const typeConfig = {
  message: { icon: MessageSquare, color: "bg-blue-500", label: "Message" },
  meeting: { icon: Users, color: "bg-purple-500", label: "Meeting" },
  agent: { icon: Zap, color: "bg-emerald-500", label: "Agent" },
  system: { icon: AlertCircle, color: "bg-amber-500", label: "System" },
};

export function RecentActivity() {
  return (
    <Card className="glass-card border-0">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-base font-semibold">Recent Activity</CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Latest events from your agent network
          </p>
        </div>
        <Button variant="ghost" size="sm" className="gap-1">
          View All
          <ArrowRight className="w-4 h-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity, index) => {
            const config = typeConfig[activity.type];
            const Icon = config.icon;

            return (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start gap-4 p-3 rounded-xl hover:bg-muted/50 transition-colors group"
              >
                <div className={`w-10 h-10 rounded-lg ${config.color} bg-opacity-20 flex items-center justify-center shrink-0`}>
                  <Icon className={`w-5 h-5 ${config.color.replace('bg-', 'text-')}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium text-sm">{activity.title}</h4>
                    <Badge variant="secondary" className="text-[10px]">
                      {config.label}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-1">
                    {activity.description}
                  </p>
                  {activity.agents && (
                    <div className="flex items-center gap-1 mt-2">
                      <span className="text-xs text-muted-foreground">Agents:</span>
                      <div className="flex items-center gap-1">
                        {activity.agents.map((agent) => (
                          <span 
                            key={agent}
                            className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary"
                          >
                            {agent}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                <span className="text-xs text-muted-foreground shrink-0">
                  {activity.timestamp}
                </span>
              </motion.div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
