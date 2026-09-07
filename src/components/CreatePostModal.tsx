import React, { useState } from 'react';
import { X, Sparkles, Image, Tag, User, Layers, Code } from 'lucide-react';
import { Post } from '../types';
import { boardService } from '../services/boardService';

interface CreatePostModalProps {
  onClose: () => void;
  onPostCreated: (post: Post) => void;
}

const CATEGORIES: Post['category'][] = ['기술연동', '디자인', '자유', 'Q&A', '자랑하기'];

export const CreatePostModal: React.FC<CreatePostModalProps> = ({ onClose, onPostCreated }) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<Post['category']>('기술연동');
  const [authorName, setAuthorName] = useState('');
  const [authorRole, setAuthorRole] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    setIsSubmitting(true);
    setErrorMessage(null);
    try {
      const tags = tagsInput
        .split(',')
        .map(t => t.trim().replace(/^#/, ''))
        .filter(Boolean);

      const created = await boardService.createPost({
        title: title.trim(),
        category,
        author_name: authorName.trim() || '익명 개발자',
        author_role: authorRole.trim() || 'Dev Member',
        tags,
        image_url: imageUrl.trim() || undefined,
        content: content.trim()
      });

      onPostCreated(created);
      onClose();
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err?.message || '게시글 등록 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const insertSampleCode = () => {
    const codeSnippet = `\n\`\`\`typescript\n// Supabase Realtime Subscription Sample\nconst subscription = supabase\n  .channel('public:posts')\n  .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'posts' }, payload => {\n    console.log('New post added!', payload.new);\n  })\n  .subscribe();\n\`\`\`\n`;
    setContent(prev => prev + codeSnippet);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/80 backdrop-blur-md animate-fadeIn">
      
      <div 
        className="relative w-full max-w-2xl glass-panel border border-white/15 rounded-3xl shadow-2xl overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/10 bg-white/5">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-[#3ecf8e]" />
            <h2 className="text-xl font-bold text-white font-heading">새 커뮤니티 게시글 작성</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          
          {/* Title Input */}
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5">게시글 제목 *</label>
            <input
              type="text"
              required
              placeholder="예: Supabase MCP 연동 노하우 및 팁"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl glass-input text-sm focus:outline-none"
            />
          </div>

          {/* Category Select */}
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5">카테고리</label>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  type="button"
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`py-2 rounded-xl text-xs font-medium transition-all ${
                    category === cat
                      ? 'bg-[#3ecf8e] text-black font-bold shadow-md shadow-[#3ecf8e]/20'
                      : 'bg-white/5 text-gray-300 border border-white/5 hover:bg-white/10'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Author Name & Role */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">작성자 닉네임</label>
              <input
                type="text"
                placeholder="예: 김테크"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl glass-input text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">직함/소개</label>
              <input
                type="text"
                placeholder="예: Frontend Architect"
                value={authorRole}
                onChange={(e) => setAuthorRole(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl glass-input text-xs"
              />
            </div>
          </div>

          {/* Tags & Image URL */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">태그 (쉼표 구분)</label>
              <input
                type="text"
                placeholder="Supabase, React, MCP, CSS"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl glass-input text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">대표 이미지 URL (선택)</label>
              <input
                type="url"
                placeholder="https://images.unsplash.com/..."
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl glass-input text-xs"
              />
            </div>
          </div>

          {/* Content Area */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-gray-300">본문 내용 *</label>
              <button
                type="button"
                onClick={insertSampleCode}
                className="text-[11px] text-[#3ecf8e] hover:underline flex items-center gap-1 font-mono"
              >
                <Code className="w-3 h-3" /> 코드 블록 템플릿 삽입
              </button>
            </div>
            <textarea
              rows={8}
              required
              placeholder="내용을 자유롭게 작성해 주세요. 마크다운 스타일과 코드 블록( ``` )이 지원됩니다."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full px-4 py-3 rounded-xl glass-input text-xs sm:text-sm resize-none font-sans leading-relaxed"
            />
          </div>

          {/* Error Alert Box */}
          {errorMessage && (
            <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs space-y-1">
              <div className="font-bold flex items-center gap-1 text-rose-400">
                ⚠️ 슈파베이스 DB 저장 실패
              </div>
              <p>{errorMessage}</p>
              <div className="text-[11px] text-gray-400 pt-1 border-t border-rose-500/20">
                💡 <strong>원인 및 해결책:</strong><br/>
                1. 슈파베이스 대시보드의 SQL Editor에서 <code className="text-[#3ecf8e]">schema.sql</code> 쿼리를 실행하셨는지 확인하세요.<br/>
                2. Row Level Security(RLS) 정책이 켜진 경우 <code className="text-[#3ecf8e]">CREATE POLICY "Public insert posts" ON public.posts FOR INSERT WITH CHECK (true);</code> 정책 실행이 필요합니다.
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-white/5 text-gray-300 text-xs font-medium hover:bg-white/10"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !title.trim() || !content.trim()}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#3ecf8e] to-[#249f69] text-black font-bold text-xs sm:text-sm hover:shadow-lg hover:shadow-[#3ecf8e]/30 disabled:opacity-50 transition-all"
            >
              {isSubmitting ? '등록 중...' : '게시글 등록하기'}
            </button>
          </div>

        </form>

      </div>

    </div>
  );
};
