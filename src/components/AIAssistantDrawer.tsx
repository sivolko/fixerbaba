import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Send, Sparkles, AlertTriangle, Lightbulb, PackagePlus, ArrowRight, User, ShieldCheck } from 'lucide-react';
import { ChatMessage, ServiceItem } from '../types';

interface AIAssistantDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onAddServiceById: (id: string) => void;
  servicesInventory: ServiceItem[];
}

export default function AIAssistantDrawer({
  isOpen,
  onClose,
  onAddServiceById,
  servicesInventory
}: AIAssistantDrawerProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'assistant',
      text: "Hello! I am Baba, your virtual diagnostic companion. Tell me what is going wrong with your iPhone, smartphone, MacBook, iPad, or smartwatch (e.g., 'My iPhone display shows green lines' or 'My MacBook battery states service recommended'). Let's troubleshoot!",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userText = inputMessage;
    const userMsgId = 'usr-' + Math.random().toString();
    const userMsg: ChatMessage = {
      id: userMsgId,
      sender: 'user',
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setIsTyping(true);

    try {
      const response = await fetch('/api/diagnose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ problem: userText })
      });
      
      const diagnosis = await response.json();
      
      // Build a smart text response based on Gemini diagnostics
      const textResponse = `I've analyzed your description. This looks like a ${diagnosis.problemType}. Estimated severity: ${diagnosis.severity.toUpperCase()}. ${diagnosis.diagnosisExplanation}`;

      const aiMsg: ChatMessage = {
        id: 'ai-' + Math.random().toString(),
        sender: 'assistant',
        text: textResponse,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        recommendations: diagnosis
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      console.error('Error fetching diagnosis:', err);
      // Fallback
      const errorMsg: ChatMessage = {
        id: 'ai-err-' + Math.random().toString(),
        sender: 'assistant',
        text: "I faced a mild connection delay. Please ensure you are connected to the internet, or type/explain in different words.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const getSeverityColor = (sev: string) => {
    switch (sev) {
      case 'critical':
        return 'text-red-500 bg-red-500/10 border-red-500/20';
      case 'high':
        return 'text-orange-500 bg-orange-500/10 border-orange-500/20';
      case 'medium':
        return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
      default:
        return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-neutral-900 z-50 cursor-pointer"
          />

          {/* Drawer Wrapper */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 26, stiffness: 220 }}
            className="fixed top-0 right-0 h-full w-full sm:max-w-md bg-bento-card hover:border-neutral-350 text-bento-text shadow-2xl z-50 flex flex-col border-l border-bento-border transition-colors"
          >
            {/* Dark Premium Apple-style Header */}
            <div className="p-5 bg-neutral-950 text-white flex items-center justify-between shadow-md">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-amber-500 rounded-xl text-neutral-900 shadow-sm animate-pulse flex items-center justify-center">
                  <Sparkles className="w-5 h-5 fill-current" />
                </div>
                <div>
                  <h3 className="font-bold text-sm tracking-tight font-display text-white">
                    Baba Diagnostic AI
                  </h3>
                  <div className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full inline-block animate-ping" />
                    <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">
                      Powered by Gemini 3.5
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 hover:bg-neutral-800 rounded-lg text-neutral-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Explanatory trust banner */}
            <div className="px-5 py-2.5 bg-bento-bg border-b border-bento-border flex items-center gap-1.5 text-[10px] text-bento-sub font-medium transition-colors">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>Explain any issue. Baba automatically matches services &amp; immediate safety guidance.</span>
            </div>

            {/* Messages Screen */}
            <div className="flex-1 p-5 overflow-y-auto space-y-4">
              {messages.map((msg) => (
                <div key={msg.id} className="space-y-1">
                  <div className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] rounded-2xl p-4 text-xs font-medium leading-relaxed shadow-xs ${
                      msg.sender === 'user'
                        ? 'bg-neutral-950 text-neutral-50 rounded-br-none border border-neutral-800'
                        : 'bg-white text-neutral-800 dark:bg-neutral-900 dark:text-neutral-100 border border-bento-border rounded-bl-none'
                    }`}>
                      {msg.text}
                      
                      {/* Recommendations Attachment inside AI Response */}
                      {msg.sender === 'assistant' && msg.recommendations && (
                        <div className="mt-4 border-t border-bento-border/60 pt-3 space-y-3">
                          {/* Severity and Problem Type tag */}
                          <div className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-[10px] font-bold uppercase tracking-wide ${getSeverityColor(msg.recommendations.severity)}`}>
                            <AlertTriangle className="w-3.5 h-3.5" />
                            <span>{msg.recommendations.problemType} • {msg.recommendations.severity} severity</span>
                          </div>

                          {/* Advice List */}
                          <div className="space-y-1.5 bg-bento-bg p-3 rounded-xl border border-bento-border">
                            <span className="text-[10px] uppercase tracking-wider font-extrabold text-bento-sub flex items-center gap-1">
                              <Lightbulb className="w-3 h-3 text-amber-500" /> Immediate Home Actions
                            </span>
                            <ul className="list-disc pl-3 text-[10px] text-bento-text/90 space-y-1 font-medium leading-relaxed">
                              {msg.recommendations.advice.map((adv: string, idx: number) => (
                                <li key={idx}>{adv}</li>
                              ))}
                            </ul>
                          </div>

                          {/* Add Recommended Service Buttons directly */}
                          <div className="space-y-2">
                            <span className="text-[10px] uppercase tracking-wider font-extrabold text-bento-sub block px-1">
                              Recommended Fixes (Add to Cart in 1-Click)
                            </span>
                            {msg.recommendations.suggestedServiceIds.map((srvId: string) => {
                              const srv = servicesInventory.find((s) => s.id === srvId);
                              if (!srv) return null;
                              return (
                                <button
                                  key={srv.id}
                                  onClick={() => {
                                    onAddServiceById(srv.id);
                                    // Append success feedback in chat
                                    const successMsg: ChatMessage = {
                                      id: 'succ-' + Math.random(),
                                      sender: 'assistant',
                                      text: `Added "${srv.name}" to your quote request list! You can view your selections in the quote panel at any time.`,
                                      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                                    };
                                    setMessages((prev) => [...prev, successMsg]);
                                  }}
                                  className="w-full p-2.5 bg-amber-500 hover:bg-amber-600 text-neutral-900 rounded-xl flex items-center justify-between text-[11px] font-bold transition-all hover:scale-[1.02] active:scale-95 shadow-xs cursor-pointer"
                                >
                                  <span className="flex items-center gap-1.5">
                                    <PackagePlus className="w-4 h-4" />
                                    <span>{srv.name}</span>
                                  </span>
                                  <ArrowRight className="w-3.5 h-3.5" />
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <span className={`text-[9px] text-bento-sub font-bold block ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
                    {msg.timestamp}
                  </span>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white text-neutral-800 dark:bg-neutral-900 dark:text-neutral-400 border border-bento-border rounded-2xl rounded-bl-none p-4 text-xs flex items-center gap-1.5 shadow-xs font-semibold">
                    <span className="w-1.5 h-1.5 bg-neutral-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                    <span className="w-1.5 h-1.5 bg-neutral-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                    <span className="w-1.5 h-1.5 bg-neutral-400 rounded-full animate-bounce" />
                    <span>Baba is diagnosing...</span>
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Bottom Keyboard Entry */}
            <form onSubmit={handleSendMessage} className="p-4 border-t border-bento-border bg-bento-card flex gap-2 transition-colors">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Describe issue (e.g., 'iPhone screen cracked')..."
                className="flex-1 p-3 bg-bento-bg border border-bento-border rounded-xl text-xs text-bento-text placeholder-neutral-400 focus:outline-none focus:border-bento-blue transition-all font-medium"
              />
              <button
                type="submit"
                disabled={!inputMessage.trim()}
                className="p-3 bg-bento-blue text-white rounded-xl hover:bg-bento-blue-hover disabled:opacity-40 disabled:hover:bg-bento-blue transition-colors cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
