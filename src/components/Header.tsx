import React from 'react';
import { Database, Terminal, PlusCircle, Settings, ShieldCheck, Zap } from 'lucide-react';
import { SupabaseConfig } from '../types';

interface HeaderProps {
  config: SupabaseConfig;
  onOpenGuide: () => void;
  onOpenConfig: () => void;
  onOpenCreatePost: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  config,
  onOpenGuide,
  onOpenConfig,
  onOpenCreatePost
}) => {
  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-white/10 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Brand Logo */}
        <div className="flex items-center space-x-3 cursor-pointer group">
          <div className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br from-[#3ecf8e] to-[#10b981] p-0.5 shadow-lg shadow-[#3ecf8e]/20 group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-[#0b0c10] rounded-[10px] flex items-center justify-center">
              <Zap className="w-6 h-6 text-[#3ecf8e] fill-[#3ecf8e]/20 group-hover:rotate-12 transition-transform" />
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-bold tracking-tight text-white font-heading">
                Supabase <span className="text-[#3ecf8e]">DevPulse</span>
              </h1>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#3ecf8e]/10 text-[#3ecf8e] border border-[#3ecf8e]/30 font-mono uppercase tracking-wider">
                v2.0 MCP
              </span>
            </div>
            <p className="text-xs text-gray-400 font-sans hidden sm:block">
              글로벌 개발자를 위한 초고속 실시간 커뮤니티 게시판
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          
          {/* Connection Status Badge */}
          <button
            onClick={onOpenConfig}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${
              config.isConnected
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20'
                : 'bg-amber-500/10 border-amber-500/30 text-amber-400 hover:bg-amber-500/20'
            }`}
            title="클릭하여 내 Supabase 프로젝트 연동 설정"
          >
            <span className={`w-2 h-2 rounded-full ${config.isConnected ? 'bg-emerald-400 animate-ping' : 'bg-amber-400'}`}></span>
            <Database className="w-3.5 h-3.5" />
            <span className="hidden md:inline">
              {config.isConnected ? 'Supabase DB 연동됨' : '데모 모드 (내 DB 연결하기)'}
            </span>
          </button>

          {/* CLI & MCP Guide Button */}
          <button
            onClick={onOpenGuide}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-xs text-gray-300 hover:bg-white/10 hover:text-white transition-all font-mono"
          >
            <Terminal className="w-4 h-4 text-[#3ecf8e]" />
            <span className="hidden sm:inline">CLI / MCP 사용법</span>
          </button>

          {/* Config Settings Button */}
          <button
            onClick={onOpenConfig}
            className="p-2 rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-all"
            title="Supabase API 설정"
          >
            <Settings className="w-4 h-4" />
          </button>

          {/* Create Post Action */}
          <button
            onClick={onOpenCreatePost}
            className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#3ecf8e] to-[#249f69] text-black font-semibold text-xs sm:text-sm hover:shadow-lg hover:shadow-[#3ecf8e]/30 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <PlusCircle className="w-4 h-4 text-black stroke-[2.5]" />
            <span>새 글 작성</span>
          </button>

        </div>

      </div>
    </header>
  );
};
