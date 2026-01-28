"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search, 
  Plus, 
  MoreHorizontal,
  Cpu,
  Activity,
  MessageSquare,
  Settings,
  Trash2,
  Edit,
  Play,
  Pause,
  ExternalLink,
  Filter,
  Grid3X3,
  List
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Agent {
  id: string;
  name: string;
  description: string;
  provider: string;
  model: string;
  status: "active" | "paused" | "error";
  color: string;
  messages: number;
  lastActive: string;
  role: string;
}

const agents: Agent[] = [
  {
    id: "1",
    name: "Claude Assistant",
    description: "General purpose conversational agent powered by Claude 3",
    provider: "Anthropic",
    model: "claude-3-opus-20240229",
    status: "active",
    color: "#f59e0b",
    messages: 15420,
    lastActive: "2 min ago",
    role: "Assistant",
  },
  {
    id: "2",
    name: "GPT-4 Planner",
    description: "Strategic planning and architecture design specialist",
    provider: "OpenAI",
    model: "gpt-4-turbo-preview",
    status: "active",
    color: "#10b981",
    messages: 8932,
    lastActive: "5 min ago",
    role: "Planner",
  },
  {
    id: "3",
    name: "Code Reviewer",
    description: "Code analysis and review agent with security focus",
    provider: "OpenAI",
    model: "gpt-4",
    status: "active",
    color: "#3b82f6",
    messages: 5671,
    lastActive: "1 hour ago",
    role: "Developer",
  },
  {
    id: "4",
    name: "Creative Gemini",
    description: "Creative writing and content generation specialist",
    provider: "Google",
    model: "gemini-pro",
    status: "paused",
    color: "#8b5cf6",
    messages: 3421,
    lastActive: "2 days ago",
    role: "Creative",
  },
  {
    id: "5",
    name: "Data Analyst",
    description: "Data processing and visualization agent",
    provider: "OpenAI",
    model: "gpt-4",
    status: "active",
    color: "#ec4899",
    messages: 7890,
    lastActive: "30 min ago",
    role: "Analyst",
  },
  {
    id: "6",
    name: "Llama Coder",
    description: "Open source coding assistant using Llama 3",
    provider: "Meta",
    model: "llama-3-70b",
    status: "error",
    color: "#06b6d4",
    messages: 1234,
    lastActive: "5 days ago",
    role: "Developer",
  },
];

const providers = ["All", "OpenAI", "Anthropic", "Google", "Meta", "Custom"];

export default function AgentsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProvider, setSelectedProvider] = useState("All");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [realAgents, setRealAgents] = useState<any[]>([]);

  useEffect(() => {
    fetch("http://localhost:3007/api/agents")
      .then(res => res.json())
      .then(data => {
        const formatted = data.map((a: any) => ({
          id: a.id,
          name: a.identityName || a.id,
          description: `Clawdbot Agent in ${a.workspace}`,
          provider: "Clawdbot",
          model: a.model,
          status: "active",
          color: "#facc15",
          messages: 0,
          lastActive: "Just now",
          role: "Autonomous Agent"
        }));
        setRealAgents(formatted);
      });
  }, []);

  const allAgents = [...realAgents, ...agents];

  const filteredAgents = allAgents.filter((agent) => {
    const matchesSearch = agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         agent.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesProvider = selectedProvider === "All" || agent.provider === selectedProvider;
    return matchesSearch && matchesProvider;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-emerald-500";
      case "paused": return "bg-amber-500";
      case "error": return "bg-red-500";
      default: return "bg-slate-500";
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active": return "default";
      case "paused": return "secondary";
      case "error": return "destructive";
      default: return "secondary";
    }
  };

  return (
    <div className="pt-24 pb-12 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8"
        >
          <div>
            <h1 className="text-3xl font-bold mb-1">Agents</h1>
            <p className="text-muted-foreground">
              Manage and configure your AI agent workforce
            </p>
          </div>
          <Button onClick={() => setIsCreateDialogOpen(true)} className="gap-2">
            <Plus className="w-4 h-4" />
            Create Agent
          </Button>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col sm:flex-row gap-4 mb-8"
        >
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search agents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-muted/50 border-0"
            />
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 bg-muted/50 rounded-lg p-1">
              <Button
                variant={viewMode === "grid" ? "secondary" : "ghost"}
                size="icon"
                className="h-8 w-8"
                onClick={() => setViewMode("grid")}
              >
                <Grid3X3 className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "secondary" : "ghost"}
                size="icon"
                className="h-8 w-8"
                onClick={() => setViewMode("list")}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <Filter className="w-4 h-4" />
                  {selectedProvider}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {providers.map((provider) => (
                  <DropdownMenuItem
                    key={provider}
                    onClick={() => setSelectedProvider(provider)}
                  >
                    {provider}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </motion.div>

        {/* Agents Grid/List */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className={viewMode === "grid" 
            ? "grid md:grid-cols-2 lg:grid-cols-3 gap-4" 
            : "space-y-4"
          }
        >
          {filteredAgents.map((agent, index) => (
            <motion.div
              key={agent.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className={`glass-card border-0 hover:border-primary/20 transition-colors group ${
                viewMode === "list" ? "flex flex-row items-center" : ""
              }`}>
                <CardHeader className={`${viewMode === "list" ? "flex-row items-center gap-4 pb-0 flex-1" : ""}`}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <Avatar className="w-12 h-12">
                          <AvatarFallback
                            style={{ backgroundColor: `${agent.color}20`, color: agent.color }}
                            className="font-bold text-lg"
                          >
                            {agent.name.split(" ").map(n => n[0]).join("")}
                          </AvatarFallback>
                        </Avatar>
                        <span className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-background ${getStatusColor(agent.status)}`} />
                      </div>
                      <div>
                        <CardTitle className="text-base font-semibold">{agent.name}</CardTitle>
                        <CardDescription className="text-xs">{agent.provider} • {agent.model}</CardDescription>
                      </div>
                    </div>
                    {viewMode === "grid" && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem className="gap-2">
                            <Edit className="w-4 h-4" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem className="gap-2">
                            <Settings className="w-4 h-4" /> Configure
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          {agent.status === "active" ? (
                            <DropdownMenuItem className="gap-2">
                              <Pause className="w-4 h-4" /> Pause
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem className="gap-2">
                              <Play className="w-4 h-4" /> Resume
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem className="gap-2 text-destructive">
                            <Trash2 className="w-4 h-4" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </div>
                </CardHeader>
                
                <CardContent className={`${viewMode === "list" ? "flex items-center gap-8 py-0" : "pt-4"}`}>
                  {viewMode === "grid" && (
                    <>
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                        {agent.description}
                      </p>
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1.5 text-muted-foreground">
                            <MessageSquare className="w-4 h-4" />
                            <span>{agent.messages.toLocaleString()}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-muted-foreground">
                            <Activity className="w-4 h-4" />
                            <span>{agent.lastActive}</span>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                  
                  {viewMode === "list" && (
                    <>
                      <div className="flex items-center gap-6 flex-1">
                        <div className="flex items-center gap-1.5 text-muted-foreground text-sm">
                          <MessageSquare className="w-4 h-4" />
                          <span>{agent.messages.toLocaleString()} messages</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-muted-foreground text-sm">
                          <Activity className="w-4 h-4" />
                          <span>{agent.lastActive}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={getStatusBadge(agent.status) as any}>
                          {agent.status}
                        </Badge>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Create Agent Dialog */}
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogContent className="glass-card border-white/10 sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Create New Agent</DialogTitle>
              <DialogDescription>
                Configure a new AI agent to join your network
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Agent Name</Label>
                <Input id="name" placeholder="e.g., Research Assistant" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input id="description" placeholder="What does this agent do?" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Provider</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select provider" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="openai">OpenAI</SelectItem>
                      <SelectItem value="anthropic">Anthropic</SelectItem>
                      <SelectItem value="google">Google</SelectItem>
                      <SelectItem value="custom">Custom</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Model</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select model" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="gpt-4">GPT-4</SelectItem>
                      <SelectItem value="claude-3">Claude 3</SelectItem>
                      <SelectItem value="gemini">Gemini Pro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => setIsCreateDialogOpen(false)}>
                Create Agent
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
