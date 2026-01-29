"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Activity, 
  Cpu, 
  MessageSquare, 
  TrendingUp,
  Zap,
  Users,
  ArrowUpRight,
  ArrowDownRight,
  Clock
} from "lucide-react";
import { AgentTopology } from "@/components/agent-topology";
import { RecentActivity } from "@/components/recent-activity";
import { AgentStatusList } from "@/components/agent-status-list";

const metrics = [
  {
    title: "Active Agents",
    value: "24",
    change: "+3",
    trend: "up",
    icon: Cpu,
    color: "from-emerald-500 to-teal-500",
  },
  {
    title: "Messages/min",
    value: "1,284",
    change: "+12%",
    trend: "up",
    icon: MessageSquare,
    color: "from-blue-500 to-cyan-500",
  },
  {
    title: "Active Conversations",
    value: "8",
    change: "-1",
    trend: "down",
    icon: Users,
    color: "from-purple-500 to-pink-500",
  },
  {
    title: "Avg Response Time",
    value: "245ms",
    change: "-18ms",
    trend: "up",
    icon: Clock,
    color: "from-orange-500 to-red-500",
  },
];

export default function DashboardPage() {
  return (
    <div className="pt-24 pb-12 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <Badge variant="secondary" className="gap-1.5">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              Live
            </Badge>
          </div>
          <p className="text-muted-foreground">
            Monitor your agent network performance and activity
          </p>
        </motion.div>

        {/* Metrics Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {metrics.map((metric, index) => (
            <motion.div
              key={metric.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="glass-card border-0">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">{metric.title}</p>
                      <p className="text-2xl font-bold">{metric.value}</p>
                      <div className="flex items-center gap-1 mt-2">
                        {metric.trend === "up" ? (
                          <ArrowUpRight className="w-4 h-4 text-emerald-500" />
                        ) : (
                          <ArrowDownRight className="w-4 h-4 text-red-500" />
                        )}
                        <span className={`text-sm ${metric.trend === "up" ? "text-emerald-500" : "text-red-500"}`}>
                          {metric.change}
                        </span>
                      </div>
                    </div>
                    <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${metric.color} flex items-center justify-center`}>
                      <metric.icon className="w-5 h-5 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Agent Topology - Takes 2 columns */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-2"
          >
            <AgentTopology />
          </motion.div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* System Health */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Card className="glass-card border-0">
                <CardHeader>
                  <CardTitle className="text-base font-semibold flex items-center gap-2">
                    <Activity className="w-4 h-4 text-primary" />
                    System Health
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-muted-foreground">API Latency</span>
                      <span className="font-medium">45ms</span>
                    </div>
                    <Progress value={92} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-muted-foreground">Memory Usage</span>
                      <span className="font-medium">68%</span>
                    </div>
                    <Progress value={68} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-muted-foreground">Message Queue</span>
                      <span className="font-medium">1,234</span>
                    </div>
                    <Progress value={45} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Agent Status */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              <AgentStatusList />
            </motion.div>
          </div>
        </div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mt-6"
        >
          <RecentActivity />
        </motion.div>
      </div>
    </div>
  );
}
