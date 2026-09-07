import { Post, Comment } from '../types';
import { getSupabaseClient } from '../lib/supabase';

// Mock Initial Data for immediate stunning experience
const MOCK_POSTS_KEY = 'devpulse_mock_posts';
const MOCK_COMMENTS_KEY = 'devpulse_mock_comments';

const INITIAL_MOCK_POSTS: Post[] = [
  {
    id: 'p-1',
    created_at: new Date(Date.now() - 1000 * 60 * 35).toISOString(),
    title: '🚀 Supabase MCP Server와 Next.js 15 완벽 연동 가이드',
    content: `안녕하세요 개발자 여러분! 최근 Supabase에서 공식 발표한 **MCP(Model Context Protocol) Server**를 AI 에이전트 및 프로젝트와 연동하는 노하우를 공유합니다.

### 1. Remote HTTP MCP의 장점
- 별도의 토큰 노출 없이 \`https://mcp.supabase.com/mcp\` 서버 엔드포인트 연결
- 브라우저 OAuth를 통한 간편 로그인 처리
- 데이터베이스 스키마와 테이블 구조를 AI가 즉시 이해하고 타입 안전 쿼리 생성

### 2. 프로젝트 적용 예시 코드
\`\`\`json
{
  "mcpServers": {
    "supabase": {
      "type": "http",
      "url": "https://mcp.supabase.com/mcp"
    }
  }
}
\`\`\`

직접 커스텀 게시판 프로젝트에 적용하여 초고속 백엔드 서비스를 구축해 보세요!`,
    category: '기술연동',
    author_name: '김테크 (Tech Lead)',
    author_avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    author_role: 'Supabase Expert',
    likes_count: 42,
    comments_count: 5,
    views_count: 382,
    tags: ['Supabase', 'MCP', 'AI', 'Next.js'],
    image_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
    is_liked: false
  },
  {
    id: 'p-2',
    created_at: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    title: '🎨 2026년 다크 글래스모피즘 UI/UX 디자인 패턴 트렌드 분석',
    content: `글래스모피즘(Glassmorphic) 디자인 패턴이 2026년 들어 더욱 섬세하고 유기적인 형태로 진화하고 있습니다.

### 핵심 디자인 필살기
1. **Multi-layer Backdrop Blur**: 단일 블러 대신 12px ~ 24px의 겹침 레이어 활용
2. **Neon Glow Accent**: 네온 그린(#3ecf8e)과 인디고 바이올렛의 은은한 네거티브 빛 확산
3. **Responsive Micro-animations**: 카드 호버 시 Subtle Lift와 Border Glow 효과

개발자와 사용자 모두를 감탄하게 만드는 인터페이스의 비밀을 함께 살펴봅시다.`,
    category: '디자인',
    author_name: '이지원 (UI Design Lead)',
    author_avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    author_role: 'UI/UX Architect',
    likes_count: 29,
    comments_count: 3,
    views_count: 245,
    tags: ['UIUX', 'CSS', 'Glassmorphism', 'DesignSystem'],
    image_url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80',
    is_liked: true
  },
  {
    id: 'p-3',
    created_at: new Date(Date.now() - 1000 * 60 * 360).toISOString(),
    title: '💡 슈파베이스 CLI로 로컬 도커 개발환경 3분만에 세팅하기',
    content: `Supabase CLI를 사용하면 인터넷 연결 없이도 로컬 환경에 완전한 백엔드 스택을 실행할 수 있습니다.

\`\`\`bash
# 1. Supabase CLI 프로젝트 초기화
npx supabase init

# 2. 로컬 도커 컨테이너 스택 시작
npx supabase start
\`\`\`

실행 즉시 Local Studio, Auth Server, DB REST API가 \`http://localhost:54323\` 등에 할당됩니다.`,
    category: 'Q&A',
    author_name: '박개발 (Backend Dev)',
    author_avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
    author_role: 'DevOps & Backend',
    likes_count: 18,
    comments_count: 2,
    views_count: 190,
    tags: ['CLI', 'Docker', 'PostgreSQL'],
    image_url: undefined,
    is_liked: false
  },
  {
    id: 'p-4',
    created_at: new Date(Date.now() - 1000 * 60 * 720).toISOString(),
    title: '🔥 직접 만든 AI 자동화 에이전트 소스코드 및 구동 영상 공유합니다',
    content: `Supabase Realtime 데이터 변경 감지 기능과 LLM API를 연동하여 커뮤니티 답변 자동화 Bot을 만들어 보았습니다.
실시간으로 새 질문 글이 등록되면 웹훅(Webhook)이 실행되어 1초 만에 가이드 답변을 달아줍니다!`,
    category: '자랑하기',
    author_name: '최에이전트 (AI Engineer)',
    author_avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&q=80',
    author_role: 'Fullstack AI Dev',
    likes_count: 64,
    comments_count: 8,
    views_count: 512,
    tags: ['AI', 'Agent', 'Automation', 'Showcase'],
    image_url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80',
    is_liked: false
  }
];

const INITIAL_MOCK_COMMENTS: Record<string, Comment[]> = {
  'p-1': [
    {
      id: 'c-1',
      post_id: 'p-1',
      created_at: new Date(Date.now() - 1000 * 60 * 20).toISOString(),
      author_name: '정풀스택',
      author_avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
      content: '와 MCP 설정법 정말 명쾌하네요! 당장 제 클로드 코드 환경에 등록했습니다.',
      likes_count: 4
    },
    {
      id: 'c-2',
      post_id: 'p-1',
      created_at: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
      author_name: '한서버',
      author_avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=150&q=80',
      content: 'Remote MCP 사용 시 API Key 노출 염려가 없어서 보안 팀에서도 아주 좋아할 것 같습니다 ㅎㅎ',
      likes_count: 2
    }
  ]
};

// Helper for Mock Data
const getStoredMockPosts = (): Post[] => {
  const data = localStorage.getItem(MOCK_POSTS_KEY);
  if (data) {
    try { return JSON.parse(data); } catch (e) {}
  }
  localStorage.setItem(MOCK_POSTS_KEY, JSON.stringify(INITIAL_MOCK_POSTS));
  return INITIAL_MOCK_POSTS;
};

const saveMockPosts = (posts: Post[]) => {
  localStorage.setItem(MOCK_POSTS_KEY, JSON.stringify(posts));
};

const getStoredMockComments = (): Record<string, Comment[]> => {
  const data = localStorage.getItem(MOCK_COMMENTS_KEY);
  if (data) {
    try { return JSON.parse(data); } catch (e) {}
  }
  localStorage.setItem(MOCK_COMMENTS_KEY, JSON.stringify(INITIAL_MOCK_COMMENTS));
  return INITIAL_MOCK_COMMENTS;
};

const saveMockComments = (comments: Record<string, Comment[]>) => {
  localStorage.setItem(MOCK_COMMENTS_KEY, JSON.stringify(comments));
};

// Board API Service Functions
export const boardService = {
  // Fetch All Posts
  async fetchPosts(category: string = '전체', search: string = ''): Promise<{ posts: Post[]; isLiveSupabase: boolean }> {
    const supabase = getSupabaseClient();

    if (supabase) {
      try {
        let query = supabase.from('posts').select('*').order('created_at', { ascending: false });
        if (category !== '전체') {
          query = query.eq('category', category);
        }
        const { data, error } = await query;
        if (error) {
          console.error('Supabase fetch posts error:', error);
          // If table doesn't exist or RLS policy fails, return empty list or throw
          if (error.code === '42P01') {
            console.warn('posts 테이블이 생성되지 않았습니다. schema.sql 실행이 필요합니다.');
          }
          return { posts: [], isLiveSupabase: true };
        }
        if (data) {
          let posts: Post[] = data.map((item: any) => ({
            ...item,
            category: item.category || '일반'
          }));

          if (search.trim()) {
            const q = search.toLowerCase();
            posts = posts.filter(p => p.title.toLowerCase().includes(q) || p.content.toLowerCase().includes(q));
          }

          return { posts, isLiveSupabase: true };
        }
      } catch (err) {
        console.error('Supabase fetch error:', err);
      }
    }

    // Local Mock Fallback
    let posts = getStoredMockPosts();
    if (category !== '전체') {
      posts = posts.filter(p => p.category === category);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      posts = posts.filter(p => p.title.toLowerCase().includes(q) || p.content.toLowerCase().includes(q));
    }
    return { posts, isLiveSupabase: false };
  },

  // Create Post
  async createPost(postData: Omit<Post, 'id' | 'created_at' | 'likes_count' | 'comments_count' | 'views_count'>): Promise<Post> {
    const supabase = getSupabaseClient();

    if (supabase) {
      const payload = {
        title: postData.title,
        content: postData.content,
        category: postData.category,
        author_name: postData.author_name || '익명 개발자',
        author_avatar: postData.author_avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
        author_role: postData.author_role || 'Dev Member',
        tags: postData.tags || [],
        image_url: postData.image_url || null
      };

      const { data, error } = await supabase
        .from('posts')
        .insert([payload])
        .select()
        .single();

      if (error) {
        console.error('Supabase DB Insert Error:', error);
        throw new Error(
          `Supabase DB 저장 실패: ${error.message} (${error.code || 'RLS/테이블 확인 필요'})`
        );
      }

      if (data) {
        return data as Post;
      }
    }

    // Local Mock Creation (only if Supabase client is not configured)
    const newPost: Post = {
      ...postData,
      id: `p-${Date.now()}`,
      created_at: new Date().toISOString(),
      author_avatar: postData.author_avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
      likes_count: 0,
      comments_count: 0,
      views_count: 1,
      is_liked: false
    };

    const currentPosts = getStoredMockPosts();
    const updated = [newPost, ...currentPosts];
    saveMockPosts(updated);
    return newPost;
  },

  // Toggle Like Post
  async toggleLikePost(postId: string): Promise<{ likesCount: number; isLiked: boolean }> {
    const supabase = getSupabaseClient();

    if (supabase) {
      try {
        const { data: post } = await supabase.from('posts').select('likes_count').eq('id', postId).single();
        if (post) {
          const newLikes = (post.likes_count || 0) + 1;
          await supabase.from('posts').update({ likes_count: newLikes }).eq('id', postId);
          return { likesCount: newLikes, isLiked: true };
        }
      } catch (err) {
        console.warn('Supabase like failed', err);
      }
    }

    // Mock
    const posts = getStoredMockPosts();
    const target = posts.find(p => p.id === postId);
    if (target) {
      target.is_liked = !target.is_liked;
      target.likes_count += target.is_liked ? 1 : -1;
      saveMockPosts(posts);
      return { likesCount: target.likes_count, isLiked: Boolean(target.is_liked) };
    }
    return { likesCount: 0, isLiked: false };
  },

  // Fetch Comments for a Post
  async fetchComments(postId: string): Promise<Comment[]> {
    const supabase = getSupabaseClient();

    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('comments')
          .select('*')
          .eq('post_id', postId)
          .order('created_at', { ascending: true });

        if (!error && data) {
          return data as Comment[];
        }
      } catch (err) {
        console.warn('Supabase fetch comments failed', err);
      }
    }

    const commentsMap = getStoredMockComments();
    return commentsMap[postId] || [];
  },

  // Add Comment to Post
  async addComment(postId: string, authorName: string, content: string): Promise<Comment> {
    const supabase = getSupabaseClient();

    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('comments')
          .insert([
            {
              post_id: postId,
              author_name: authorName || '익명 주니어',
              author_avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
              content: content.trim()
            }
          ])
          .select()
          .single();

        if (!error && data) {
          // Increment comments count on post
          const { data: post } = await supabase.from('posts').select('comments_count').eq('id', postId).single();
          if (post) {
            await supabase.from('posts').update({ comments_count: (post.comments_count || 0) + 1 }).eq('id', postId);
          }
          return data as Comment;
        }
      } catch (err) {
        console.warn('Supabase add comment failed', err);
      }
    }

    // Mock Add Comment
    const newComment: Comment = {
      id: `c-${Date.now()}`,
      post_id: postId,
      created_at: new Date().toISOString(),
      author_name: authorName || '익명 주니어',
      author_avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      content: content.trim(),
      likes_count: 0
    };

    const commentsMap = getStoredMockComments();
    const list = commentsMap[postId] || [];
    commentsMap[postId] = [...list, newComment];
    saveMockComments(commentsMap);

    // Update Post comment count
    const posts = getStoredMockPosts();
    const post = posts.find(p => p.id === postId);
    if (post) {
      post.comments_count += 1;
      saveMockPosts(posts);
    }

    return newComment;
  }
};
