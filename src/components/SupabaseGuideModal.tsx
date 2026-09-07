import React, { useState } from 'react';
import { X, Terminal, Cpu, Database, Copy, Check, ExternalLink, ShieldCheck, Zap } from 'lucide-react';

interface SupabaseGuideModalProps {
  onClose: () => void;
}

export const SupabaseGuideModal: React.FC<SupabaseGuideModalProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'mcp' | 'cli' | 'sql'>('mcp');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const mcpConfigRemote = `{
  "mcpServers": {
    "supabase": {
      "type": "http",
      "url": "https://mcp.supabase.com/mcp"
    }
  }
}`;

  const mcpConfigLocal = `{
  "mcpServers": {
    "supabase": {
      "command": "npx",
      "args": [
        "-y",
        "@supabase/mcp-server-supabase@latest",
        "--access-token",
        "YOUR_SUPABASE_ACCESS_TOKEN"
      ]
    }
  }
}`;

  const cliCommands = `# 1. 프로젝트에 Supabase CLI 설치 (개발 의존성 추천)
npm install supabase --save-dev

# 2. Supabase 계정 로그인
npx supabase login

# 3. 로컬 프로젝트 Supabase 설정 초기화
npx supabase init

# 4. Docker 기반 로컬 Supabase 백엔드 개발 서버 시작
npx supabase start

# 5. 내 원격 Supabase 프로젝트와 로컬 프로젝트 연결
npx supabase link --project-ref <YOUR_PROJECT_ID>

# 6. DB 마이그레이션 적용 및 스키마 푸시
npx supabase db push

# 7. DB 스키마로부터 TypeScript 타입 자동 생성
npx supabase gen types typescript --project-id <YOUR_PROJECT_ID> > src/types/supabase.ts`;

  const sqlScript = `-- 1. Posts Table
CREATE TABLE IF NOT EXISTS public.posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT '일반',
  author_name TEXT NOT NULL DEFAULT '익명 개발자',
  author_avatar TEXT,
  author_role TEXT DEFAULT 'Dev Member',
  likes_count INT DEFAULT 0 NOT NULL,
  comments_count INT DEFAULT 0 NOT NULL,
  views_count INT DEFAULT 0 NOT NULL,
  tags TEXT[] DEFAULT '{}',
  image_url TEXT
);

-- 2. Comments Table
CREATE TABLE IF NOT EXISTS public.comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  author_name TEXT NOT NULL,
  author_avatar TEXT,
  content TEXT NOT NULL,
  likes_count INT DEFAULT 0 NOT NULL
);

-- 3. Enable RLS and Read/Write Policies
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read posts" ON public.posts FOR SELECT USING (true);
CREATE POLICY "Public insert posts" ON public.posts FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update posts" ON public.posts FOR UPDATE USING (true);
CREATE POLICY "Public read comments" ON public.comments FOR SELECT USING (true);
CREATE POLICY "Public insert comments" ON public.comments FOR INSERT WITH CHECK (true);`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/80 backdrop-blur-md animate-fadeIn">
      
      <div 
        className="relative w-full max-w-4xl glass-panel border border-white/15 rounded-3xl shadow-2xl overflow-hidden my-8 max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/10 bg-white/5">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-[#3ecf8e]/10 border border-[#3ecf8e]/30 text-[#3ecf8e]">
              <Terminal className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white font-heading">
                Supabase MCP & CLI 완벽 가이드
              </h2>
              <p className="text-xs text-gray-400">
                AI 에이전트 연동(MCP)과 백엔드 마이그레이션(CLI) 사용법
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-white/10 bg-black/40 px-6">
          <button
            onClick={() => setActiveTab('mcp')}
            className={`flex items-center space-x-2 py-3 px-4 text-xs font-semibold border-b-2 transition-all ${
              activeTab === 'mcp'
                ? 'border-[#3ecf8e] text-[#3ecf8e]'
                : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            <Cpu className="w-4 h-4" />
            <span>1. Supabase MCP 설정</span>
          </button>

          <button
            onClick={() => setActiveTab('cli')}
            className={`flex items-center space-x-2 py-3 px-4 text-xs font-semibold border-b-2 transition-all ${
              activeTab === 'cli'
                ? 'border-[#3ecf8e] text-[#3ecf8e]'
                : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            <Terminal className="w-4 h-4" />
            <span>2. Supabase CLI 사용법</span>
          </button>

          <button
            onClick={() => setActiveTab('sql')}
            className={`flex items-center space-x-2 py-3 px-4 text-xs font-semibold border-b-2 transition-all ${
              activeTab === 'sql'
                ? 'border-[#3ecf8e] text-[#3ecf8e]'
                : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            <Database className="w-4 h-4" />
            <span>3. DB 테이블 스키마 SQL</span>
          </button>
        </div>

        {/* Modal Scroll Content */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 flex-1">
          
          {/* TAB 1: MCP Server */}
          {activeTab === 'mcp' && (
            <div className="space-y-6">
              <div className="bg-[#3ecf8e]/10 border border-[#3ecf8e]/20 p-4 rounded-2xl">
                <h3 className="text-sm font-bold text-[#3ecf8e] flex items-center gap-2 mb-1">
                  <Zap className="w-4 h-4" /> Supabase Model Context Protocol (MCP) 서버란?
                </h3>
                <p className="text-xs text-gray-300 leading-relaxed">
                  Supabase MCP를 설정하면 클로드(Claude)나 에이전트가 내 슈파베이스 DB 스키마를 직접 조회하고 SQL을 작성하거나 데이터를 관리할 수 있도록 해줍니다.
                </p>
              </div>

              {/* Remote HTTP MCP */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-white font-mono text-[#3ecf8e]">
                    [추천] Remote HTTP MCP 설정 (.mcp.json 또는 클라이언트 설정)
                  </h4>
                  <button
                    onClick={() => copyToClipboard(mcpConfigRemote, 'mcpRemote')}
                    className="flex items-center space-x-1 text-[11px] text-gray-400 hover:text-white font-mono"
                  >
                    {copiedCode === 'mcpRemote' ? <Check className="w-3.5 h-3.5 text-[#3ecf8e]" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedCode === 'mcpRemote' ? '복사됨!' : '코드 복사'}</span>
                  </button>
                </div>
                <pre className="p-4 rounded-xl bg-[#090a0f] border border-white/10 text-xs font-mono text-emerald-300 overflow-x-auto">
                  <code>{mcpConfigRemote}</code>
                </pre>
                <p className="text-[11px] text-gray-400">
                  * Remote HTTP MCP는 별도의 Access Token 관리 없이 브라우저 인증으로 동작하므로 가장 편리하고 안전합니다.
                </p>
              </div>

              {/* Local stdio MCP */}
              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-white font-mono text-purple-400">
                    [대안] Local stdio MCP (npx 기반)
                  </h4>
                  <button
                    onClick={() => copyToClipboard(mcpConfigLocal, 'mcpLocal')}
                    className="flex items-center space-x-1 text-[11px] text-gray-400 hover:text-white font-mono"
                  >
                    {copiedCode === 'mcpLocal' ? <Check className="w-3.5 h-3.5 text-[#3ecf8e]" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedCode === 'mcpLocal' ? '복사됨!' : '코드 복사'}</span>
                  </button>
                </div>
                <pre className="p-4 rounded-xl bg-[#090a0f] border border-white/10 text-xs font-mono text-purple-300 overflow-x-auto">
                  <code>{mcpConfigLocal}</code>
                </pre>
              </div>
            </div>
          )}

          {/* TAB 2: CLI Guide */}
          {activeTab === 'cli' && (
            <div className="space-y-6">
              <div className="bg-white/5 border border-white/10 p-4 rounded-2xl">
                <h3 className="text-sm font-bold text-white mb-1">
                  Supabase CLI 명령어 사용 순서
                </h3>
                <p className="text-xs text-gray-300">
                  Supabase CLI를 이용해 로컬 도커 환경 구축부터 원격 프로젝트 동기화까지 한 번에 실행할 수 있습니다.
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#3ecf8e] font-mono">CLI 터미널 명령어</span>
                  <button
                    onClick={() => copyToClipboard(cliCommands, 'cliCmd')}
                    className="flex items-center space-x-1 text-[11px] text-gray-400 hover:text-white font-mono"
                  >
                    {copiedCode === 'cliCmd' ? <Check className="w-3.5 h-3.5 text-[#3ecf8e]" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedCode === 'cliCmd' ? '복사됨!' : '전체 복사'}</span>
                  </button>
                </div>
                <pre className="p-4 rounded-xl bg-[#090a0f] border border-white/10 text-xs font-mono text-gray-200 overflow-x-auto leading-relaxed">
                  <code>{cliCommands}</code>
                </pre>
              </div>

              <div className="text-xs text-gray-400 space-y-1 bg-black/40 p-4 rounded-xl border border-white/5">
                <div className="font-semibold text-white">💡 팁: Windows 환경에서의 설치 권장사항</div>
                <div>• 프로젝트 내부 설치: <code className="text-[#3ecf8e]">npm install supabase --save-dev</code> 후 <code className="text-[#3ecf8e]">npx supabase</code> 사용</div>
                <div>• 전역 설치 (Scoop): <code className="text-[#3ecf8e]">scoop bucket add supabase https://github.com/supabase/scoop-bucket.git</code> 그리고 <code className="text-[#3ecf8e]">scoop install supabase</code></div>
              </div>
            </div>
          )}

          {/* TAB 3: SQL Schema */}
          {activeTab === 'sql' && (
            <div className="space-y-6">
              <div className="bg-[#3ecf8e]/10 border border-[#3ecf8e]/20 p-4 rounded-2xl flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-[#3ecf8e] mb-1">
                    게시판 DB 자동 생성 SQL 쿼리
                  </h3>
                  <p className="text-xs text-gray-300">
                    Supabase 대시보드 → SQL Editor에 붙여넣고 Run을 누르면 테이블과 보안 정책이 자동 세팅됩니다!
                  </p>
                </div>
                <button
                  onClick={() => copyToClipboard(sqlScript, 'sqlScript')}
                  className="px-3 py-1.5 rounded-xl bg-[#3ecf8e] text-black font-bold text-xs flex items-center space-x-1 shadow-md hover:bg-[#249f69]"
                >
                  {copiedCode === 'sqlScript' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedCode === 'sqlScript' ? '복사 완료' : 'SQL 복사'}</span>
                </button>
              </div>

              <pre className="p-4 rounded-xl bg-[#090a0f] border border-white/10 text-xs font-mono text-emerald-300 overflow-x-auto leading-relaxed max-h-96">
                <code>{sqlScript}</code>
              </pre>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 px-6 border-t border-white/10 bg-white/5 flex items-center justify-between">
          <span className="text-xs text-gray-400">
            도움이 필요하신가요? 내 Supabase 프로젝트 설정에서 URL과 Anon Key를 바로 입력해보세요.
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-white/10 text-white text-xs font-semibold hover:bg-white/20 transition-all"
          >
            닫기
          </button>
        </div>

      </div>

    </div>
  );
};
