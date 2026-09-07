import React, { useState, useEffect } from 'react';
import { X, Heart, MessageSquare, Send, Calendar, Share2, Bookmark, Check } from 'lucide-react';
import { Post, Comment } from '../types';
import { boardService } from '../services/boardService';

interface PostDetailModalProps {
  post: Post | null;
  onClose: () => void;
  onPostUpdated: () => void;
}

export const PostDetailModal: React.FC<PostDetailModalProps> = ({
  post,
  onClose,
  onPostUpdated
}) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentText, setCommentText] = useState('');
  const [commentAuthor, setCommentAuthor] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLiked, setIsLiked] = useState(post?.is_liked || false);
  const [likesCount, setLikesCount] = useState(post?.likes_count || 0);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (post) {
      setIsLiked(post.is_liked || false);
      setLikesCount(post.likes_count);
      boardService.fetchComments(post.id).then(setComments);
    }
  }, [post]);

  if (!post) return null;

  const handleLike = async () => {
    const res = await boardService.toggleLikePost(post.id);
    setLikesCount(res.likesCount);
    setIsLiked(res.isLiked);
    onPostUpdated();
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    setIsSubmitting(true);
    try {
      const newComment = await boardService.addComment(post.id, commentAuthor || '익명 개발자', commentText);
      setComments(prev => [...prev, newComment]);
      setCommentText('');
      onPostUpdated();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Basic Markdown-like renderer for code blocks and bold text
  const renderFormattedContent = (content: string) => {
    const parts = content.split(/(```[\s\S]*?```)/g);
    return parts.map((part, index) => {
      if (part.startsWith('```')) {
        const lines = part.slice(3, -3).trim().split('\n');
        const lang = lines[0].match(/^[a-zA-Z0-9_-]+$/) ? lines[0] : '';
        const code = lang ? lines.slice(1).join('\n') : lines.join('\n');
        return (
          <div key={index} className="my-4 rounded-xl overflow-hidden border border-white/10 bg-[#090a0f]">
            {lang && (
              <div className="bg-white/5 px-4 py-1.5 border-b border-white/5 text-[11px] font-mono text-gray-400">
                {lang}
              </div>
            )}
            <pre className="p-4 text-xs font-mono text-emerald-300 overflow-x-auto leading-relaxed">
              <code>{code}</code>
            </pre>
          </div>
        );
      }
      return (
        <p key={index} className="whitespace-pre-wrap leading-relaxed text-gray-300 text-sm sm:text-base my-3">
          {part}
        </p>
      );
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/80 backdrop-blur-md animate-fadeIn">
      
      {/* Modal Container */}
      <div 
        className="relative w-full max-w-4xl glass-panel border border-white/15 rounded-3xl shadow-2xl overflow-hidden my-8 max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/10 bg-white/5 sticky top-0 z-10 backdrop-blur-md">
          <div className="flex items-center space-x-3">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#3ecf8e]/10 border border-[#3ecf8e]/30 text-[#3ecf8e]">
              {post.category}
            </span>
            <span className="text-xs text-gray-400 font-mono hidden sm:inline">
              {new Date(post.created_at).toLocaleString('ko-KR')}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleShare}
              className="p-2 rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:text-white hover:bg-white/10 transition-all flex items-center space-x-1 text-xs"
            >
              {copied ? <Check className="w-4 h-4 text-[#3ecf8e]" /> : <Share2 className="w-4 h-4" />}
              <span className="hidden sm:inline">{copied ? '복사됨' : '공유'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 flex-1">
          
          {/* Post Title */}
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-heading leading-tight">
            {post.title}
          </h1>

          {/* Author Profile Card */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5">
            <div className="flex items-center space-x-3">
              <img
                src={post.author_avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'}
                alt={post.author_name}
                className="w-10 h-10 rounded-full object-cover border-2 border-[#3ecf8e]/40"
              />
              <div>
                <div className="text-sm font-semibold text-white">{post.author_name}</div>
                <div className="text-xs text-[#3ecf8e]">{post.author_role || 'Dev Member'}</div>
              </div>
            </div>

            <button
              onClick={handleLike}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl border text-sm font-semibold transition-all ${
                isLiked
                  ? 'bg-pink-500/20 border-pink-500/40 text-pink-400 shadow-lg shadow-pink-500/10'
                  : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10'
              }`}
            >
              <Heart className={`w-4 h-4 ${isLiked ? 'fill-pink-400 text-pink-400' : ''}`} />
              <span className="font-mono">{likesCount}</span>
            </button>
          </div>

          {/* Post Hero Image if present */}
          {post.image_url && (
            <div className="rounded-2xl overflow-hidden border border-white/10 max-h-96">
              <img src={post.image_url} alt={post.title} className="w-full h-full object-cover" />
            </div>
          )}

          {/* Post Main Body Content */}
          <div className="prose prose-invert max-w-none">
            {renderFormattedContent(post.content)}
          </div>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-4 border-t border-white/10">
              {post.tags.map((tag, idx) => (
                <span key={idx} className="px-3 py-1 rounded-lg bg-white/5 text-gray-300 text-xs font-mono border border-white/10">
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Comments Section */}
          <div className="pt-8 border-t border-white/10 space-y-6">
            <div className="flex items-center space-x-2 text-lg font-bold text-white font-heading">
              <MessageSquare className="w-5 h-5 text-[#3ecf8e]" />
              <span>댓글 ({comments.length})</span>
            </div>

            {/* Comment Form */}
            <form onSubmit={handleAddComment} className="space-y-3 bg-black/40 p-4 rounded-2xl border border-white/10">
              <div className="flex gap-3">
                <input
                  type="text"
                  placeholder="작성자 이름 (기본값: 익명 개발자)"
                  value={commentAuthor}
                  onChange={(e) => setCommentAuthor(e.target.value)}
                  className="w-1/3 px-3 py-2 rounded-xl glass-input text-xs"
                />
              </div>
              <div className="flex gap-2">
                <textarea
                  rows={2}
                  placeholder="댓글을 작성해 주세요... (응원의 메시지와 추가 질문)"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl glass-input text-xs sm:text-sm resize-none"
                  required
                />
                <button
                  type="submit"
                  disabled={isSubmitting || !commentText.trim()}
                  className="px-4 py-2 rounded-xl bg-[#3ecf8e] text-black font-semibold text-xs hover:bg-[#249f69] transition-all disabled:opacity-50 flex items-center justify-center self-end"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </form>

            {/* Comments List */}
            <div className="space-y-3">
              {comments.length === 0 ? (
                <div className="text-center py-6 text-xs text-gray-500 font-mono">
                  아직 작성된 댓글이 없습니다. 첫 번째 댓글을 남겨보세요!
                </div>
              ) : (
                comments.map((c) => (
                  <div key={c.id} className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center space-x-2">
                        <img
                          src={c.author_avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'}
                          alt={c.author_name}
                          className="w-6 h-6 rounded-full object-cover"
                        />
                        <span className="font-medium text-white">{c.author_name}</span>
                      </div>
                      <span className="text-[10px] text-gray-500 font-mono">
                        {new Date(c.created_at).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-300 pl-8 leading-relaxed">
                      {c.content}
                    </p>
                  </div>
                ))
              )}
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};
