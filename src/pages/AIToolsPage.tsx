import { useTheme } from "@/contexts/ThemeContext";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ArrowUpRight,  Code,  Terminal, Brain } from "lucide-react";
import { motion } from "framer-motion";

type AITool = {
  name: string;
  description: string;
  url: string;
  logo: string;
  accent: string;
  category: string;
};

export function AIToolsPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const codingAI: AITool[] = [
    {
      name: "ChatGPT",
      description: "OpenAI's conversational AI for coding & research",
      url: "https://chat.openai.com",
      logo: "/logos/chatgpt.png",
      accent: "#fafafa",
      category: "Coding"
    },
    {
      name: "Kimi AI",
      description: "Advanced AI assistant for analysis & coding",
      url: "https://kimi.moonshot.cn",
      logo: "/logos/kimi.png",
      accent: "#ffffff",
      category: "Coding"
    },
    {
      name: "GitHub Copilot",
      description: "AI pair programmer for code completion",
      url: "https://github.com/copilot",
      logo: "/logos/github.png",
      accent: "#ffffff",
      category: "Coding"
    },
    {
      name: "Claude",
      description: "Anthropic's AI for coding and analysis",
      url: "https://claude.ai",
      logo: "/logos/claude.png",
      accent: "#D97706",
      category: "Coding"
    },
    {
      name: "Codeium",
      description: "Free AI coding assistant & autocomplete",
      url: "https://codeium.com",
      logo: "/logos/codeium.png",
      accent: "#ffffff",
      category: "Coding"
    },
    {
      name: "Tabnine",
      description: "AI code completion for all languages",
      url: "https://tabnine.com",
      logo: "/logos/tabnine.png",
      accent: "#ff0000",
      category: "Coding"
    },
  ];

  const researchAI: AITool[] = [
    {
      name: "DeepSeek",
      description: "AI for airdrop screening & crypto research",
      url: "https://deepseek.com",
      logo: "/logos/deepseek.png",
      accent: "#265ee0",
      category: "Research"
    },
    {
      name: "Perplexity",
      description: "AI search engine for research",
      url: "https://perplexity.ai",
      logo: "/logos/perplexity.png",
      accent: "#225e37",
      category: "Research"
    },
    {
      name: "Phind",
      description: "AI search for developers Soon",
      url: "https://phind.com",
      logo: "/logos/phind.png",
      accent: "#10B981",
      category: "Research"
    },
    {
      name: "You.com",
      description: "AI search with privacy focus",
      url: "https://you.com",
      logo: "/logos/you.png",
      accent: "#bfa2f1",
      category: "Research"
    },
  ];

  const agentAI: AITool[] = [
    {
      name: "AutoGPT",
      description: "Autonomous AI agent for tasks",
      url: "https://agpt.co",
      logo: "/logos/autogpt.png",
      accent: "#00D4AA",
      category: "Agent"
    },
    {
      name: "BabyAGI",
      description: "Task-driven autonomous agent",
      url: "https://github.com/yoheinakajima/babyagi",
      logo: "/logos/babyagi.png",
      accent: "#9dfdff",
      category: "Agent"
    },
    {
      name: "CrewAI",
      description: "Multi-agent AI system Soon",
      url: "https://crewai.io",
      logo: "/logos/crewai.png",
      accent: "#8B5CF6",
      category: "Agent"
    },
    {
      name: "LangChain",
      description: "Framework for AI applications",
      url: "https://langchain.com",
      logo: "/logos/langchain.png",
      accent: "#86cef4",
      category: "Agent"
    },
  ];

  const handleClick = (url: string) => {
    window.open(url, "_blank");
  };

  const renderToolCard = (tool: AITool, index: number) => (
    <motion.div
      key={tool.name}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      onClick={() => handleClick(tool.url)}
      style={{
        borderLeft: `3px solid ${tool.accent}` }}
      className={`
        macos-premium-card relative p-4 overflow-hidden group
        transition-all duration-300 ease-out cursor-pointer
        transform hover:-translate-y-0.5 hover:shadow-lg
        ${isDark
          ? "bg-[#161B22] border-[#1F2937] hover:border-[#1F2937]"
          : "bg-white border-[#E5E7EB] hover:border-[#E5E7EB]"}
      `}
    >
      {/* Glow effect */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-lg"
        style={{
          background: `linear-gradient(135deg, ${tool.accent}08 0%, transparent 50%)`
        }}
      />

      <div className="relative z-10 flex items-center gap-3">
        {/* Icon/Logo */}
        <div
          className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-110 ${
            isDark ? "bg-[#0B0F14]" : "bg-[#F3F4F6]"
          }`}
        >
          <img
            src={tool.logo}
            alt={tool.name}
            className="w-6 h-6 object-contain"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              target.parentElement!.innerHTML = `<div class="w-6 h-6 rounded-full" style="background: ${tool.accent}"></div>`;
            }}
          />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-0.5">
            <h3
              className={`font-bold text-sm truncate ${
                isDark ? "text-[#E5E7EB]" : "text-[#111827]"
              }`}
            >
              {tool.name}
            </h3>
            <ArrowUpRight 
              className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 flex-shrink-0 ml-2"
              style={{ color: tool.accent }}
            />
          </div>
          
          <p className={`text-xs truncate ${isDark ? "text-[#6B7280]" : "text-[#6B7280]"}`}>
            {tool.description}
          </p>
        </div>
      </div>

      {/* Bottom accent line */}
      <div 
        className="absolute bottom-0 left-0 h-[2px] w-0 group-hover:w-full transition-all duration-500"
        style={{ background: tool.accent }}
      />
    </motion.div>
  );

  return (
    <DashboardLayout>
      <div className="macos-root macos-page-shell">
        {/* Header */}
        <div className="macos-page-header macos-animate-up">
          <div className="macos-page-kicker">
            <Brain className="h-3.5 w-3.5" />
            AI Stack
          </div>
          <h1 className="macos-page-title">AI Tools</h1>
          <p className="macos-page-subtitle">
            AI assistants untuk coding, research, dan eksplorasi Web3 dengan bahasa visual macOS yang lebih premium.
          </p>
        </div>

        {/* Coding AI */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
              <Code className="w-4 h-4 text-purple-500" />
            </div>
            <h2 className={`text-xs font-mono font-bold tracking-widest uppercase ${
              isDark ? "text-[#00FF88]" : "text-[#10B981]"
            }`}>
              Coding & Development
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4">
            {codingAI.map((tool, index) => renderToolCard(tool, index))}
          </div>
        </div>

        {/* Research AI */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <Brain className="w-4 h-4 text-blue-500" />
            </div>
            <h2 className={`text-xs font-mono font-bold tracking-widest uppercase ${
              isDark ? "text-[#00FF88]" : "text-[#10B981]"
            }`}>
              Research & Analysis
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4">
            {researchAI.map((tool, index) => renderToolCard(tool, index + codingAI.length))}
            
            {/* Fill empty slots */}
            <div className="macos-empty-state min-h-[80px] flex items-center justify-center p-4">
              <span className={`text-xs font-mono ${isDark ? 'text-[#6B7280]' : 'text-[#9CA3AF]'}`}>
                More tools coming soon
              </span>
            </div>
            
            <div className="macos-empty-state min-h-[80px] flex items-center justify-center p-4">
              <span className={`text-xs font-mono ${isDark ? 'text-[#6B7280]' : 'text-[#9CA3AF]'}`}>
                More tools coming soon
              </span>
            </div>
          </div>
        </div>

        {/* AI Agents */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center">
              <Terminal className="w-4 h-4 text-green-500" />
            </div>
            <h2 className={`text-xs font-mono font-bold tracking-widest uppercase ${
              isDark ? "text-[#00FF88]" : "text-[#10B981]"
            }`}>
              AI Agents
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4">
            {agentAI.map((tool, index) => renderToolCard(tool, index + codingAI.length + researchAI.length))}
            
            {/* Fill empty slots */}
            <div className="macos-empty-state min-h-[80px] flex items-center justify-center p-4">
              <span className={`text-xs font-mono ${isDark ? 'text-[#6B7280]' : 'text-[#9CA3AF]'}`}>
                More tools coming soon
              </span>
            </div>
            
            <div className="macos-empty-state min-h-[80px] flex items-center justify-center p-4">
              <span className={`text-xs font-mono ${isDark ? 'text-[#6B7280]' : 'text-[#9CA3AF]'}`}>
                More tools coming soon
              </span>
            </div>
            
            <div className="macos-empty-state min-h-[80px] flex items-center justify-center p-4">
              <span className={`text-xs font-mono ${isDark ? 'text-[#6B7280]' : 'text-[#9CA3AF]'}`}>
                More tools coming soon
              </span>
            </div>
            
            <div className="macos-empty-state min-h-[80px] flex items-center justify-center p-4">
              <span className={`text-xs font-mono ${isDark ? 'text-[#6B7280]' : 'text-[#9CA3AF]'}`}>
                More tools coming soon
              </span>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
