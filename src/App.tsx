import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { StatsBar } from './components/StatsBar';
import { PostCard } from './components/PostCard';
import { PostDetailModal } from './components/PostDetailModal';
import { CreatePostModal } from './components/CreatePostModal';
import { SupabaseGuideModal } from './components/SupabaseGuideModal';
import { SupabaseConfigModal } from './components/SupabaseConfigModal';
import { Post, SupabaseConfig } from './types';
import { boardService } from './services/boardService';
import { getStoredSupabaseConfig } from './lib/supabase';
import { Terminal, Database, MessageSquare, Heart, RefreshCw, AlertCircle, PlusCircle } from 'lucide-react';

export const App: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [activeCategory, setActiveCategory] = useState('전체');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [config, setConfig] = useState<SupabaseConfig>({ url: '', anonKey: '', isConnected: false });

  // Modals state
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  // Load Supabase Config & Posts
  const loadPosts = async () => {
    setIsLoading(true);
    try {
      const { posts: fetchedPosts } = await boardService.fetchPosts(activeCategory, searchQuery);
      setPosts(fetchedPosts);
    } catch (err) {
      console.error('Error fetching posts:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setConfig(getStoredSupabaseConfig());
    loadPosts();
  }, [activeCategory, searchQuery]);

  const handleConfigUpdated = () => {
    setConfig(getStoredSupabaseConfig());
    loadPosts();
  };

  const handleLikePost = async (e: React.MouseEvent, postId: string) => {
    e.stopPropagation();
    const res = await boardService.toggleLikePost(postId);
    setPosts(prev =>
      prev.map(p => (p.id === postId ? { ...p, likes_count: res.likesCount, is_liked: res.isLiked } : p))
    );
  };

  const handlePostCreated = (newPost: Post) => {
    setPosts(prev => [newPost, ...prev]);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0c0d12] text-gray-100 font-sans selection:bg-[#3ecf8e] selection:text-black">
      
      {/* Header Bar */}
      <Header
        config={config}
        onOpenGuide={() => setIsGuideOpen(true)}
        onOpenConfig={() => setIsConfigOpen(true)}
        onOpenCreatePost={() => setIsCreatePostOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Banner & Filter Control */}
        <StatsBar
          activeCategory={activeCategory}
          onSelectCategory={setActiveCategory}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          totalPosts={posts.length}
        />

        {/* Loading Spinner */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <RefreshCw className="w-8 h-8 text-[#3ecf8e] animate-spin" />
            <p className="text-xs font-mono text-gray-400">최신 게시글 목록을 불러오는 중...</p>
          </div>
        ) : posts.length === 0 ? (
          /* Empty View */
          <div className="glass-panel rounded-3xl p-12 text-center border border-white/10 max-w-xl mx-auto my-12 space-y-4">
            <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-gray-400">
              <MessageSquare className="w-8 h-8 text-gray-500" />
            </div>
            <h3 className="text-xl font-bold text-white font-heading">조건에 일치하는 게시글이 없습니다</h3>
            <p className="text-xs text-gray-400">
              검색어를 변경하거나 첫 번째로 새로운 질문/프로젝트 공유 글을 작성해 보세요!
            </p>
            <button
              onClick={() => setIsCreatePostOpen(true)}
              className="px-5 py-2.5 rounded-xl bg-[#3ecf8e] text-black font-bold text-xs hover:bg-[#249f69] transition-all inline-flex items-center gap-2"
            >
              <PlusCircle className="w-4 h-4" />
              <span>지금 새 글 작성하기</span>
            </button>
          </div>
        ) : (
          /* Grid of Posts */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map(post => (
              <PostCard
                key={post.id}
                post={post}
                onSelect={setSelectedPost}
                onLike={handleLikePost}
              />
            ))}
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="glass-panel border-t border-white/10 py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-gray-300">Supabase DevPulse</span>
            <span>— Next-Gen Developer Community Board</span>
          </div>
          <div className="flex items-center space-x-4 font-mono">
            <button onClick={() => setIsGuideOpen(true)} className="hover:text-[#3ecf8e] transition-colors">
              Supabase MCP / CLI Docs
            </button>
            <button onClick={() => setIsConfigOpen(true)} className="hover:text-[#3ecf8e] transition-colors">
              DB Connection Setup
            </button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      {isGuideOpen && <SupabaseGuideModal onClose={() => setIsGuideOpen(false)} />}
      {isConfigOpen && (
        <SupabaseConfigModal
          config={config}
          onClose={() => setIsConfigOpen(false)}
          onSave={handleConfigUpdated}
        />
      )}
      {isCreatePostOpen && (
        <CreatePostModal
          onClose={() => setIsCreatePostOpen(false)}
          onPostCreated={handlePostCreated}
        />
      )}
      {selectedPost && (
        <PostDetailModal
          post={selectedPost}
          onClose={() => setSelectedPost(null)}
          onPostUpdated={loadPosts}
        />
      )}

    </div>
  );
};

export default App;
