"use client";

import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { 
  Send, 
  Bot, 
  User, 
  Sparkles,
  Plus,
  Settings,
  Share2,
  MoreVertical,
  Mic,
  Image as ImageIcon,
  Paperclip
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Message {
  id: string;
  agentId: string;
  agentName: string;
  agentColor: string;
  content: string;
  timestamp: Date;
  type: "message" | "action" | "thought";
}

interface Agent {
  id: string;
  name: string;
  role: string;
  color: string;
  status: "online" | "thinking" | "idle";
  avatar: string;
}

const agents: Agent[] = [
  { id: "1", name: "Claude", role: "Analyzer", color: "#f59e0b", status: "online", avatar: "CL" },
  { id: "2", name: "GPT-4", role: "Planner", color: "#10b981", status: "thinking", avatar: "GP" },
  { id: "3", name: "Gemini", role: "Creative", color: "#3b82f6", status: "online", avatar: "GM" },
  { id: "4", name: "Llama", role: "Coder", color: "#8b5cf6", status: "idle", avatar: "LL" },
];

const initialMessages: Message[] = [
  {
    id: "1",
    agentId: "1",
    agentName: "Claude",
    agentColor: "#f59e0b",
    content: "I've analyzed the project requirements. We need to design a scalable architecture.",
    timestamp: new Date(Date.now() - 1000 * 60 * 5),
    type: "message",
  },
  {
    id: "2",
    agentId: "2",
    agentName: "GPT-4",
    agentColor: "#10b981",
    content: "Agreed. I'll create a system design document with microservices architecture.",
    timestamp: new Date(Date.now() - 1000 * 60 * 4),
    type: "message",
  },
  {
    id: "3",
    agentId: "2",
    agentName: "GPT-4",
    agentColor: "#10b981",
    content: "Thinking about database schema and API endpoints...",
    timestamp: new Date(Date.now() - 1000 * 60 * 3),
    type: "thought",
  },
];

const responses = [
  "That's an interesting approach. Have we considered the edge cases?",
  "I can implement that. Should I start with the API layer?",
  "From a security perspective, we need to add rate limiting.",
  "Let me generate some test cases for this feature.",
  "The performance looks good based on my calculations.",
  "I think we should refactor this for better maintainability.",
  "Processing the requirements...",
  "Task completed! Moving to the next item.",
];

export default function MeetingPage() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [inputValue, setInputValue] = useState("");
  const [activeAgents, setActiveAgents] = useState<string[]>(["main"]);
  const [realAgents, setRealAgents] = useState<Agent[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("http://localhost:3001/api/agents")
      .then(res => res.json())
      .then(data => {
        const formatted = data.map((a: any) => ({
          id: a.id,
          name: a.identityName || a.id,
          role: "Autonomous Agent",
          color: "#facc15",
          status: "online",
          avatar: (a.identityEmoji || "🧧")
        }));
        setRealAgents(formatted);
      });
  }, []);

  const allAgents = [...realAgents, ...agents];

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // WebSocket for real-time agent responses
  useEffect(() => {
    const ws = new WebSocket("ws://localhost:3001");
    ws.onmessage = (e) => {
      const data = JSON.parse(e.data);
      if (data.type === 'neural-event' && data.kind === 'agent-response') {
        const agent = allAgents.find(a => a.id === data.agentId);
        const newMessage: Message = {
          id: Date.now().toString(),
          agentId: data.agentId,
          agentName: agent ? agent.name : data.agentId,
          agentColor: agent ? agent.color : "#facc15",
          content: data.text,
          timestamp: new Date(),
          type: "message",
        };
        setMessages((prev) => [...prev, newMessage]);
      }
    };
    return () => ws.close();
  }, [allAgents]);

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      agentId: "user",
      agentName: "You",
      agentColor: "#fff",
      content: inputValue,
      timestamp: new Date(),
      type: "message",
    };

    setMessages((prev) => [...prev, userMessage]);
    const messageToSend = inputValue;
    setInputValue("");

    // Orchestrate: Send to all active agents
    for (const agentId of activeAgents) {
       // Only send to real agents (the ones from Clawdbot)
       if (realAgents.some(a => a.id === agentId)) {
          fetch("http://localhost:3001/api/invoke", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ agentId, message: messageToSend })
          });
       }
    }
  };

  const toggleAgent = (agentId: string) => {
    setActiveAgents((prev) =>
      prev.includes(agentId)
        ? prev.filter((id) => id !== agentId)
        : [...prev, agentId]
    );
  };

  return (
    <div className="pt-20 pb-4 h-screen flex flex-col">
      <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex gap-6">
        {/* Main Chat Area */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex-1 flex flex-col"
        >
          <Card className="glass-card border-0 flex-1 flex flex-col">
            {/* Header */}
            <CardHeader className="border-b border-white/5 pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Agent Meeting Room</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {activeAgents.length} agents participating
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon">
                    <Share2 className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Settings className="w-4 h-4" />
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Clear History</DropdownMenuItem>
                      <DropdownMenuItem>Export Chat</DropdownMenuItem>
                      <DropdownMenuItem>Meeting Settings</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardHeader>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4" ref={scrollRef}>
              <div className="space-y-4">
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex gap-3 ${
                      message.agentId === "user" ? "flex-row-reverse" : ""
                    }`}
                  >
                    {message.agentId !== "user" ? (
                      <Avatar className="w-8 h-8 border-2" style={{ borderColor: message.agentColor }}>
                        <AvatarFallback 
                          className="text-xs font-bold"
                          style={{ backgroundColor: `${message.agentColor}20`, color: message.agentColor }}
                        >
                          {message.agentName.slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                    ) : (
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                          <User className="w-4 h-4" />
                        </AvatarFallback>
                      </Avatar>
                    )}
                    
                    <div className={`flex flex-col ${message.agentId === "user" ? "items-end" : ""}`}>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium">{message.agentName}</span>
                        <span className="text-xs text-muted-foreground">
                          {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </div>
                      <div
                        className={`max-w-md px-4 py-2.5 rounded-2xl text-sm ${
                          message.agentId === "user"
                            ? "bg-primary text-primary-foreground"
                            : message.type === "thought"
                            ? "bg-muted/50 text-muted-foreground italic"
                            : "glass-card"
                        }`}
                      >
                        {message.content}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </ScrollArea>

            {/* Input Area */}
            <CardContent className="border-t border-white/5 pt-4">
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="shrink-0">
                  <Paperclip className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" className="shrink-0">
                  <ImageIcon className="w-4 h-4" />
                </Button>
                <div className="relative flex-1">
                  <Input
                    placeholder="Type a message or @mention an agent..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                    className="pr-10 bg-muted/50 border-0"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-1 top-1/2 -translate-y-1/2"
                    onClick={handleSend}
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
                <Button variant="ghost" size="icon" className="shrink-0">
                  <Mic className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Sidebar - Participants */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="w-72 hidden lg:block"
        >
          <Card className="glass-card border-0 h-full">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Participants</CardTitle>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              {allAgents.map((agent) => (
                <div
                  key={agent.id}
                  className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-colors ${
                    activeAgents.includes(agent.id)
                      ? "bg-primary/10 border border-primary/20"
                      : "hover:bg-muted/50"
                  }`}
                  onClick={() => toggleAgent(agent.id)}
                >
                  <div className="relative">
                    <Avatar className="w-10 h-10">
                      <AvatarFallback
                        style={{ backgroundColor: `${agent.color}20`, color: agent.color }}
                        className="font-bold"
                      >
                        {agent.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <span
                      className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-background ${
                        agent.status === "online"
                          ? "bg-emerald-500"
                          : agent.status === "thinking"
                          ? "bg-amber-500 animate-pulse"
                          : "bg-slate-500"
                      }`}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{agent.name}</p>
                    <p className="text-xs text-muted-foreground">{agent.role}</p>
                  </div>
                  {activeAgents.includes(agent.id) && (
                    <div className="w-2 h-2 rounded-full bg-primary" />
                  )}
                </div>
              ))}

              <Separator className="my-4" />

              {/* Meeting Info */}
              <div className="space-y-3">
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Meeting Info
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Duration</span>
                    <span>23:45</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Messages</span>
                    <span>{messages.length}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Topic</span>
                    <span>Architecture</span>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="pt-4 space-y-2">
                <Button variant="outline" className="w-full gap-2">
                  <Bot className="w-4 h-4" />
                  Add Custom Agent
                </Button>
                <Button variant="outline" className="w-full gap-2">
                  <Share2 className="w-4 h-4" />
                  Invite Others
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
