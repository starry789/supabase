-- ========================================================
-- Supabase DevPulse Community Bulletin Board Schema
-- Run this script in your Supabase SQL Editor to set up tables!
-- ========================================================

-- 1. Create Posts Table
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

-- 2. Create Comments Table
CREATE TABLE IF NOT EXISTS public.comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  author_name TEXT NOT NULL,
  author_avatar TEXT,
  content TEXT NOT NULL,
  likes_count INT DEFAULT 0 NOT NULL
);

-- 3. Create Post Likes Table (Tracking per post)
CREATE TABLE IF NOT EXISTS public.likes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE NOT NULL,
  user_session_id TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  UNIQUE(post_id, user_session_id)
);

-- 4. Enable Row Level Security (RLS) & Public Read/Write Access Policies
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.likes ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Allow public read access on posts" ON public.posts FOR SELECT USING (true);
CREATE POLICY "Allow public insert access on posts" ON public.posts FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access on posts" ON public.posts FOR UPDATE USING (true);
CREATE POLICY "Allow public delete access on posts" ON public.posts FOR DELETE USING (true);

CREATE POLICY "Allow public read access on comments" ON public.comments FOR SELECT USING (true);
CREATE POLICY "Allow public insert access on comments" ON public.comments FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public read access on likes" ON public.likes FOR SELECT USING (true);
CREATE POLICY "Allow public insert access on likes" ON public.likes FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public delete access on likes" ON public.likes FOR DELETE USING (true);

-- 5. Insert Initial Sample Data
INSERT INTO public.posts (title, content, category, author_name, author_avatar, author_role, likes_count, comments_count, views_count, tags, image_url)
VALUES 
(
  '🚀 Supabase MCP Server와 Next.js 15 완벽 연동 가이드',
  '안녕하세요! 최근 Supabase에서 공식 발표한 MCP(Model Context Protocol) Server를 클로드 및 AI 에이전트와 연동하는 방법을 작성했습니다.\n\n### 주요 특징\n- Remote HTTP MCP 지원 (`https://mcp.supabase.com/mcp`)\n- OAuth 기반 인증 처리 자동화\n- 데이터베이스 스키마 실시간 조회 및 자동 쿼리 생성\n\n여러분의 프로젝트에도 MCP를 적용해보세요!',
  '기술연동',
  '김테크 (Tech Lead)',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
  'Supabase Expert',
  42,
  5,
  320,
  ARRAY['Supabase', 'MCP', 'AI', 'Next.js'],
  'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80'
),
(
  '🎨 2026년 다크 글래스모피즘 UI/UX 디자인 패턴 트렌드 분석',
  '최신 서구권 B2B 및 AI SaaS 제품들에서 보이는 다크모드 글래스모피즘(Glassmorphism) 설계 원칙을 공유합니다.\n\n1. **Glow Effects**: 네온 컬러 오버레이와 네거티브 엠비언트 라이트\n2. **Micro-Interactions**: 호버 시 스케일 변환과 그림자 확산\n3. **Typography**: Outfit & Inter 폰트 조합의 가독성 극대화',
  '디자인',
  '이지원 (UI Design Lead)',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
  'UI/UX Master',
  29,
  3,
  185,
  ARRAY['UIUX', 'CSS', 'Glassmorphism', 'Design'],
  'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80'
),
(
  '💡 슈파베이스 CLI로 로컬 도커 개발환경 3분만에 세팅하기',
  '로컬 개발 환경에서 Supabase를 Docker 스택으로 실행하는 유용한 팁입니다.\n\n```bash\nnpx supabase init\nnpx supabase start\n```\n\n명령어 두 줄로 PostgreSQL, Auth, Storage, Studio가 한 번에 뜹니다!',
  'Q&A',
  '박개발 (Backend Dev)',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
  'DevOps Enthu',
  18,
  2,
  140,
  ARRAY['CLI', 'Docker', 'PostgreSQL'],
  NULL
);
