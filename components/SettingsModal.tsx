'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Settings, X, Server, Key, User, Link as LinkIcon, Cpu, ChevronDown, Building2 } from 'lucide-react';
import { useTheme } from './ThemeProvider';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Provider {
  id: string;
  name: string;
  baseUrl: string;
  apiKeyPrefix?: string;
}

const providers: Provider[] = [
  { id: 'openai', name: 'OpenAI', baseUrl: 'https://api.openai.com/v1', apiKeyPrefix: 'sk-' },
  { id: 'anthropic', name: 'Anthropic', baseUrl: 'https://api.anthropic.com', apiKeyPrefix: 'sk-ant-' },
  { id: 'google', name: 'Google (Gemini)', baseUrl: 'https://generativelanguage.googleapis.com/v1beta' },
  { id: 'deepseek', name: 'DeepSeek', baseUrl: 'https://api.deepseek.com/v1', apiKeyPrefix: 'sk-' },
  { id: 'xai', name: 'X.AI (Grok)', baseUrl: 'https://api.x.ai/v1', apiKeyPrefix: 'xai-' },
  { id: 'siliconflow', name: 'SiliconFlow', baseUrl: 'https://api.siliconflow.cn/v1', apiKeyPrefix: 'sk-' },
  { id: 'minimax', name: 'MiniMax', baseUrl: 'https://api.minimax.chat/v1', apiKeyPrefix: 'eyJhbG' },
  { id: 'custom', name: '自定义', baseUrl: '' },
];

export default function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [selectedProvider, setSelectedProvider] = useState<string>('openai');
  const [baseURL, setBaseURL] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [modelName, setModelName] = useState('');
  const [isProviderDropdownOpen, setIsProviderDropdownOpen] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedProvider = localStorage.getItem('ai-tutor-provider');
      const storedBaseURL = localStorage.getItem('ai-tutor-base-url');
      const storedApiKey = localStorage.getItem('ai-tutor-api-key');
      const storedModelName = localStorage.getItem('ai-tutor-model-name');

      if (storedProvider) setSelectedProvider(storedProvider);
      if (storedBaseURL) setBaseURL(storedBaseURL);
      if (storedApiKey) setApiKey(storedApiKey);
      if (storedModelName) setModelName(storedModelName);
    }
  }, [isOpen]);

  useEffect(() => {
    if (selectedProvider !== 'custom') {
      const provider = providers.find(p => p.id === selectedProvider);
      if (provider) {
        setBaseURL(provider.baseUrl);
      }
    }
  }, [selectedProvider]);

  const handleSave = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('ai-tutor-provider', selectedProvider);
      localStorage.setItem('ai-tutor-base-url', baseURL.trim());
      localStorage.setItem('ai-tutor-api-key', apiKey.trim());
      localStorage.setItem('ai-tutor-model-name', modelName.trim());
    }
    onClose();
  };

  const currentProvider = providers.find(p => p.id === selectedProvider);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ backdropFilter: 'blur(0px)' }}
            animate={{ backdropFilter: 'blur(12px)' }}
            exit={{ backdropFilter: 'blur(0px)' }}
            className={`absolute inset-0 ${isDark ? 'bg-black/60' : 'bg-slate-900/40'}`}
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            className={`relative w-full max-w-lg p-6 sm:p-8 rounded-3xl backdrop-blur-2xl border shadow-2xl overflow-hidden ${
              isDark
                ? 'bg-black/80 border-cyan-500/30 shadow-[0_0_40px_rgba(0,255,255,0.15)]'
                : 'bg-white/90 border-purple-300/40 shadow-[0_0_40px_rgba(168,85,247,0.15)]'
            }`}
          >
            <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 blur-[60px] opacity-40 mix-blend-screen pointer-events-none ${
              isDark ? 'bg-cyan-500/30' : 'bg-purple-400/30'
            }`} />

            <div className="flex items-center justify-between mb-8 relative z-10">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-xl ${isDark ? 'bg-cyan-500/10 text-cyan-400' : 'bg-purple-500/10 text-purple-600'}`}>
                  <Settings className="w-5 h-5" />
                </div>
                <h2 className={`text-xl font-bold tracking-wide font-sans ${isDark ? 'text-white' : 'text-slate-800'}`}>
                  系统设置 <span className={`text-xs font-mono ml-2 tracking-widest ${isDark ? 'text-cyan-400/50' : 'text-purple-500/60'}`}>SYSTEM SETTINGS</span>
                </h2>
              </div>
              <button
                onClick={onClose}
                className={`p-2 rounded-xl transition-colors ${
                  isDark ? 'hover:bg-white/10 text-gray-400 hover:text-white' : 'hover:bg-slate-200 text-slate-500 hover:text-slate-800'
                }`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-6 relative z-10">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className={`text-sm font-bold tracking-widest uppercase ${isDark ? 'text-gray-300' : 'text-slate-700'}`}>API 接口配置</span>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2 relative">
                    <label className={`text-xs font-mono flex items-center gap-2 ${isDark ? 'text-cyan-400/80' : 'text-purple-600/80'}`}>
                      <Building2 className="w-3.5 h-3.5" />
                      选择服务商
                    </label>
                    <button
                      onClick={() => setIsProviderDropdownOpen(!isProviderDropdownOpen)}
                      className={`w-full px-4 py-2.5 rounded-xl border text-sm font-sans text-left transition-all focus:outline-none flex items-center justify-between ${
                        isDark
                          ? 'bg-black/50 border-cyan-500/30 hover:border-cyan-400 text-gray-200'
                          : 'bg-white/50 border-purple-300/50 hover:border-purple-400 text-slate-800'
                      }`}
                    >
                      <span>{currentProvider?.name}</span>
                      <ChevronDown className={`w-4 h-4 transition-transform ${isProviderDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>

                    <AnimatePresence>
                      {isProviderDropdownOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: -10, height: 0 }}
                          animate={{ opacity: 1, y: 0, height: 'auto' }}
                          exit={{ opacity: 0, y: -10, height: 0 }}
                          className="absolute top-full left-0 right-0 mt-2 z-20 rounded-xl border overflow-hidden"
                          style={{ backgroundColor: isDark ? 'rgba(0,0,0,0.95)' : 'rgba(255,255,255,0.98)' }}
                        >
                          {providers.map((provider) => (
                            <button
                              key={provider.id}
                              onClick={() => {
                                setSelectedProvider(provider.id);
                                setIsProviderDropdownOpen(false);
                              }}
                              className={`w-full px-4 py-2.5 text-left text-sm transition-colors ${
                                selectedProvider === provider.id
                                  ? (isDark ? 'bg-cyan-500/20 text-cyan-300' : 'bg-purple-100 text-purple-700')
                                  : (isDark ? 'hover:bg-white/5 text-gray-300' : 'hover:bg-slate-100 text-slate-700')
                              }`}
                            >
                              {provider.name}
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <div className="space-y-2">
                    <label className={`text-xs font-mono flex items-center gap-2 ${isDark ? 'text-cyan-400/80' : 'text-purple-600/80'}`}>
                      <Server className="w-3.5 h-3.5" />
                      Base URL
                    </label>
                    <input
                      type="text"
                      value={baseURL}
                      onChange={(e) => setBaseURL(e.target.value)}
                      placeholder={selectedProvider === 'custom' ? 'https://api.example.com/v1' : currentProvider?.baseUrl}
                      className={`w-full px-4 py-2.5 rounded-xl border text-sm font-sans transition-all focus:outline-none ${
                        isDark
                          ? 'bg-black/50 border-cyan-500/30 focus:border-cyan-400 text-gray-200 placeholder:text-gray-600 focus:shadow-[0_0_15px_rgba(0,255,255,0.15)]'
                          : 'bg-white/50 border-purple-300/50 focus:border-purple-400 text-slate-800 placeholder:text-slate-400 focus:shadow-[0_0_15px_rgba(168,85,247,0.15)]'
                      }`}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className={`text-xs font-mono flex items-center gap-2 ${isDark ? 'text-cyan-400/80' : 'text-purple-600/80'}`}>
                      <Key className="w-3.5 h-3.5" />
                      API Key
                    </label>
                    <input
                      type="password"
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      placeholder={currentProvider?.apiKeyPrefix || 'sk-...'}
                      className={`w-full px-4 py-2.5 rounded-xl border text-sm font-sans transition-all focus:outline-none ${
                        isDark
                          ? 'bg-black/50 border-cyan-500/30 focus:border-cyan-400 text-gray-200 placeholder:text-gray-600 focus:shadow-[0_0_15px_rgba(0,255,255,0.15)]'
                          : 'bg-white/50 border-purple-300/50 focus:border-purple-400 text-slate-800 placeholder:text-slate-400 focus:shadow-[0_0_15px_rgba(168,85,247,0.15)]'
                      }`}
                    />
                  </div>

                  {selectedProvider === 'custom' && (
                    <div className="space-y-2">
                      <label className={`text-xs font-mono flex items-center gap-2 ${isDark ? 'text-cyan-400/80' : 'text-purple-600/80'}`}>
                        <Cpu className="w-3.5 h-3.5" />
                        模型名称
                      </label>
                      <input
                        type="text"
                        value={modelName}
                        onChange={(e) => setModelName(e.target.value)}
                        placeholder="例如：gpt-5.2、gemini-2.0-flash"
                        className={`w-full px-4 py-2.5 rounded-xl border text-sm font-sans transition-all focus:outline-none ${
                          isDark
                            ? 'bg-black/50 border-cyan-500/30 focus:border-cyan-400 text-gray-200 placeholder:text-gray-600 focus:shadow-[0_0_15px_rgba(0,255,255,0.15)]'
                            : 'bg-white/50 border-purple-300/50 focus:border-purple-400 text-slate-800 placeholder:text-slate-400 focus:shadow-[0_0_15px_rgba(168,85,247,0.15)]'
                        }`}
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className={`h-px w-full ${isDark ? 'bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent' : 'bg-gradient-to-r from-transparent via-purple-500/20 to-transparent'}`} />

              <div className="space-y-4">
                <span className={`text-sm font-bold tracking-widest uppercase ${isDark ? 'text-gray-300' : 'text-slate-700'}`}>关于</span>
                
                <div className={`p-4 rounded-2xl border flex flex-col gap-3 ${
                  isDark ? 'bg-cyan-950/10 border-cyan-500/20' : 'bg-purple-50/50 border-purple-200'
                }`}>
                  <div className={`flex items-center gap-3 text-sm ${isDark ? 'text-gray-300' : 'text-slate-700'}`}>
                    <User className={`w-4 h-4 ${isDark ? 'text-cyan-400' : 'text-purple-600'}`} />
                    <span>作者：许家乐</span>
                  </div>
                  <a 
                    href="https://space.bilibili.com/694979371" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className={`flex items-center gap-3 text-sm transition-colors group ${isDark ? 'hover:text-cyan-300 text-gray-300' : 'hover:text-purple-700 text-slate-700'}`}
                  >
                    <LinkIcon className={`w-4 h-4 transition-transform group-hover:scale-110 ${isDark ? 'text-cyan-400' : 'text-purple-600'}`} />
                    <span className="underline underline-offset-4 decoration-dashed decoration-current/30 group-hover:decoration-current">去 Bilibili 关注作者</span>
                  </a>
                  <div className={`flex items-center gap-3 text-sm ${isDark ? 'text-gray-300' : 'text-slate-700'}`}>
                    <Cpu className={`w-4 h-4 ${isDark ? 'text-cyan-400' : 'text-purple-600'}`} />
                    <span>本网站由 Gemini 和 MiniMax 共同编写</span>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <motion.button
                  onClick={handleSave}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                  className={`w-full py-3 rounded-xl font-mono text-sm tracking-widest uppercase border overflow-hidden relative ${
                    isDark
                      ? 'bg-black/50 text-cyan-300 border-cyan-500/50 hover:border-cyan-400'
                      : 'bg-white/80 text-purple-700 border-purple-300/80 hover:border-purple-500'
                  }`}
                >
                  <div className={`absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300 ${
                    isDark ? 'bg-gradient-to-r from-cyan-500/20 via-cyan-400/10 to-cyan-500/20' : 'bg-gradient-to-r from-purple-500/15 via-purple-400/10 to-purple-500/15'
                  }`} />
                  <span className="relative z-10">保存设置 / SAVE</span>
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}