import React from 'react';
import { Search, Sparkles, Filter, MessageSquare, ThumbsUp, Layers } from 'lucide-react';

interface StatsBarProps {
  activeCategory: string;
  onSelectCategory: (cat: string) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  totalPosts: number;
}

const CATEGORIES = ['전체', '기술연동', '디자인', '자유', 'Q&A', '자랑하기'];

export const StatsBar: React.FC<StatsBarProps> = ({
  activeCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  totalPosts
}) => {
  return (
    <div className="space-y-6 mb-8">
      
      {/* Hero Banner Banner */}
      <div className="relative overflow-hidden rounded-2xl glass-panel p-6 sm:p-8 border border-white/10 shadow-2xl">
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-[#3ecf8e]/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -left-16 -bottom-16 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#3ecf8e]/10 border border-[#3ecf8e]/20 text-[#3ecf8e] text-xs font-mono">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Real-time Post & MCP Powered</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-heading">
              개발자 소통 공간 & 백엔드 실시간 놀이터
            </h2>
            <p className="text-sm text-gray-300 leading-relaxed">
              Supabase 클라이언트와 연동되어 지식 공유, 질문, 프로젝트 자랑이 자유롭게 이루어집니다. 
              상단의 <span className="text-[#3ecf8e] font-semibold">CLI/MCP 가이드</span>를 참고하여 나만의 Supabase를 연동해 보세요!
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center space-x-4 bg-black/40 p-4 rounded-xl border border-white/5 backdrop-blur-md self-start md:self-auto">
            <div className="text-center px-3 border-r border-white/10">
              <div className="text-xl font-bold text-white font-mono">{totalPosts}</div>
              <div className="text-[11px] text-gray-400">등록 게시글</div>
            </div>
            <div className="text-center px-3 border-r border-white/10">
              <div className="text-xl font-bold text-[#3ecf8e] font-mono">100%</div>
              <div className="text-[11px] text-gray-400">실시간 연동</div>
            </div>
            <div className="text-center px-3">
              <div className="text-xl font-bold text-purple-400 font-mono">MCP Ready</div>
              <div className="text-[11px] text-gray-400">AI 에이전트 지원</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Row */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        
        {/* Category Pills */}
        <div className="flex items-center space-x-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 scrollbar-none">
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => onSelectCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-[#3ecf8e] text-black font-semibold shadow-lg shadow-[#3ecf8e]/20 scale-105'
                    : 'bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white border border-white/5'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Search Input Box */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="제목, 내용, 태그 검색..."
            className="w-full pl-10 pr-4 py-2 rounded-xl glass-input text-xs sm:text-sm placeholder-gray-500 focus:outline-none transition-all"
          />
        </div>

      </div>

    </div>
  );
};
