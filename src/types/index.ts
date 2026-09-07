export interface Post {
  id: string;
  created_at: string;
  title: string;
  content: string;
  category: '전체' | '기술연동' | '디자인' | '자유' | 'Q&A' | '자랑하기';
  author_name: string;
  author_avatar?: string;
  author_role?: string;
  likes_count: number;
  comments_count: number;
  views_count: number;
  tags?: string[];
  image_url?: string;
  is_liked?: boolean;
}

export interface Comment {
  id: string;
  post_id: string;
  created_at: string;
  author_name: string;
  author_avatar?: string;
  content: string;
  likes_count: number;
}

export interface SupabaseConfig {
  url: string;
  anonKey: string;
  isConnected: boolean;
}
