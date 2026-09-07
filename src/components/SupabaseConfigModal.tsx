import React, { useState, useEffect } from 'react';
import { X, Database, Key, CheckCircle2, AlertCircle, RefreshCw, Trash2, Zap } from 'lucide-react';
import { SupabaseConfig } from '../types';
import { getStoredSupabaseConfig, saveSupabaseConfig } from '../lib/supabase';

interface SupabaseConfigModalProps {
  config: SupabaseConfig;
  onClose: () => void;
  onSave: () => void;
}

export const SupabaseConfigModal: React.FC<SupabaseConfigModalProps> = ({
  config,
  onClose,
  onSave
}) => {
  const [url, setUrl] = useState('');
  const [anonKey, setAnonKey] = useState('');
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error' | null; text: string }>({
    type: null,
    text: ''
  });

  useEffect(() => {
    const current = getStoredSupabaseConfig();
    setUrl(current.url);
    setAnonKey(current.anonKey);
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim() || !anonKey.trim()) {
      setStatusMessage({ type: 'error', text: 'Supabase URL과 Anon Key를 모두 입력해주세요.' });
      return;
    }

    try {
      saveSupabaseConfig(url, anonKey);
      setStatusMessage({ type: 'success', text: 'Supabase 연동 정보가 성공적으로 저장되었습니다!' });
      setTimeout(() => {
        onSave();
        onClose();
      }, 1000);
    } catch (err) {
      setStatusMessage({ type: 'error', text: '설정 저장 중 오류가 발생했습니다.' });
    }
  };

  const handleClear = () => {
    saveSupabaseConfig('', '');
    setUrl('');
    setAnonKey('');
    setStatusMessage({ type: 'success', text: '데모 모드로 전환되었습니다.' });
    setTimeout(() => {
      onSave();
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/80 backdrop-blur-md animate-fadeIn">
      
      <div 
        className="relative w-full max-w-lg glass-panel border border-white/15 rounded-3xl shadow-2xl overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/10 bg-white/5">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white font-heading">
                내 Supabase 프로젝트 연동
              </h2>
              <p className="text-xs text-gray-400">
                Supabase Dashboard → Project Settings → API 정보 입력
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

        {/* Form Body */}
        <form onSubmit={handleSave} className="p-6 space-y-4">
          
          {/* URL Input */}
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5 flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5 text-[#3ecf8e]" /> Supabase Project URL *
            </label>
            <input
              type="url"
              required
              placeholder="https://your-project.supabase.co"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl glass-input text-xs sm:text-sm font-mono placeholder-gray-600 focus:outline-none"
            />
          </div>

          {/* Anon Key Input */}
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5 flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5 text-[#3ecf8e]" /> Supabase Anon Public Key *
            </label>
            <textarea
              rows={3}
              required
              placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
              value={anonKey}
              onChange={(e) => setAnonKey(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl glass-input text-xs font-mono placeholder-gray-600 resize-none focus:outline-none"
            />
          </div>

          {/* Status Feedback */}
          {statusMessage.type && (
            <div className={`p-3 rounded-xl border text-xs flex items-center gap-2 ${
              statusMessage.type === 'success'
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
            }`}>
              {statusMessage.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
              <span>{statusMessage.text}</span>
            </div>
          )}

          {/* Guidance Note */}
          <div className="p-3 rounded-xl bg-white/5 border border-white/5 text-[11px] text-gray-400 leading-relaxed">
            💡 입력된 URL과 키는 브라우저의 안전한 로컬 스토리지에만 저장됩니다. 슈파베이스 대시보드의 SQL Editor에서 전용 테이블 스키마를 미리 실행해 두어야 정상 동작합니다.
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={handleClear}
              className="px-3 py-2 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-medium hover:bg-rose-500/20 flex items-center gap-1.5 transition-all"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>데모 모드로 리셋</span>
            </button>

            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-white/5 text-gray-300 text-xs font-medium hover:bg-white/10"
              >
                취소
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#3ecf8e] to-[#249f69] text-black font-bold text-xs hover:shadow-lg hover:shadow-[#3ecf8e]/30 transition-all flex items-center gap-1.5"
              >
                <Zap className="w-4 h-4 text-black fill-black" />
                <span>연동 및 저장</span>
              </button>
            </div>
          </div>

        </form>

      </div>

    </div>
  );
};
