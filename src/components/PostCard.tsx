import React from 'react';
import { Heart, MessageSquare, Eye, Tag, Calendar, User } from 'lucide-react';
import { Post } from '../types';

interface PostCardProps {
  post: Post;
  onSelect: (post: Post) => void;
  onLike: (e: React.MouseEvent, postId: string) => void;
}

const getCategoryColor = (category: string) => {
  switch (category) {
    case '기술연동':
      return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
    case '디자인':
      return 'bg-pink-500/10 text-pink-400 border-pink-500/30';
    case '자랑하기':
      return 'bg-purple-500/10 text-purple-400 border-purple-500/30';
    case 'Q&A':
      return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
    default:
      return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
  }
};

const formatDate = (isoString: string) => {
  try {
    const d = new Date(isoString);
    const now = new Date();
    const diffMin = Math.floor((now.getTime() - d.getTime()) / (1000 * 60));
    if (diffMin < 1) return '방금 전';
    if (diffMin < 60) return `${diffMin}분 전`;
    const diffHour = Math.floor(diffMin / 60);
    if (diffHour < 24) return `${diffHour}시간 전`;
    return d.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' });
  } catch (e) {
    return '최근';
  }
};

export const PostCard: React.FC<PostCardProps> = ({ post, onSelect, onLike }) => {
  return (
    <article
      onClick={() => onSelect(post)}
      className="group glass-panel glass-panel-hover rounded-2xl p-6 cursor-pointer flex flex-col justify-between relative overflow-hidden transition-all duration-300"
    >
      {/* Top Card Info */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getCategoryColor(post.category)}`}>
            {post.category}
          </span>
          <span className="text-[11px] text-gray-400 font-mono flex items-center gap-1">
            <Calendar className="w-3 h-3 text-gray-500" />
            {formatDate(post.created_at)}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold text-white group-hover:text-[#3ecf8e] transition-colors line-clamp-2 leading-snug mb-3 font-heading">
          {post.title}
        </h3>

        {/* Short Excerpt */}
        <p className="text-xs sm:text-sm text-gray-400 line-clamp-3 leading-relaxed mb-4 font-sans">
          {post.content.replace(/```[\s\S]*?```/g, '[코드 블록]').replace(/#+\s/g, '')}
        </p>

        {/* Thumbnail Preview if available */}
        {post.image_url && (
          <div className="mb-4 rounded-xl overflow-hidden max-h-48 border border-white/10 relative">
            <img
              src={post.image_url}
              alt={post.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
          </div>
        )}

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {post.tags.map((tag, idx) => (
              <span key={idx} className="text-[10px] px-2 py-0.5 rounded-md bg-white/5 text-gray-300 border border-white/5 font-mono">
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Footer Meta Details */}
      <div className="pt-4 border-t border-white/5 flex items-center justify-between mt-2">
        {/* Author Info */}
        <div className="flex items-center space-x-2.5">
          <img
            src={post.author_avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'}
            alt={post.author_name}
            className="w-7 h-7 rounded-full object-cover border border-[#3ecf8e]/30"
          />
          <div>
            <div className="text-xs font-medium text-gray-200">{post.author_name}</div>
            <div className="text-[10px] text-gray-500">{post.author_role || 'Dev Member'}</div>
          </div>
        </div>

        {/* Counters (Likes, Comments, Views) */}
        <div className="flex items-center space-x-3 text-xs text-gray-400">
          <button
            onClick={(e) => onLike(e, post.id)}
            className={`flex items-center space-x-1 px-2 py-1 rounded-md transition-all ${
              post.is_liked
                ? 'text-pink-400 bg-pink-500/10 border border-pink-500/20'
                : 'hover:text-pink-400 hover:bg-white/5'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${post.is_liked ? 'fill-pink-400' : ''}`} />
            <span className="font-mono">{post.likes_count}</span>
          </button>

          <div className="flex items-center space-x-1">
            <MessageSquare className="w-3.5 h-3.5 text-gray-400" />
            <span className="font-mono">{post.comments_count}</span>
          </div>

          <div className="flex items-center space-x-1 hidden sm:flex">
            <Eye className="w-3.5 h-3.5 text-gray-500" />
            <span className="font-mono text-[11px] text-gray-500">{post.views_count}</span>
          </div>
        </div>
      </div>
    </article>
  );
};
