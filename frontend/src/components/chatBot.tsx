import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, Trash2, AlertCircle } from 'lucide-react';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  isError?: boolean;
}

interface QueryResponse {
  response?: string;
  answer?: string;
  reply?: string;
  message?: string;
}

interface ChatBotProps {
  endpoint?: string;
  title?: string;
  subtitle?: string;
  placeholder?: string;
  initialGreeting?: string;
  headers?: Record<string, string>;
}

export const ChatBot: React.FC<ChatBotProps> = ({
  endpoint = '/query',
  title = 'AI Assistant',
  subtitle = 'Connected to /query',
  placeholder = 'Type your message...',
  initialGreeting = 'Hello! How can I help you today?',
  headers = {},
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: 'welcome-msg',
      role: 'assistant',
      content: initialGreeting,
      timestamp: formatTime(new Date()),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  // Auto-scroll to newest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Auto-resize textarea height
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 140)}px`;
  }, [input]);

  /**
   * Sends the user's query and conversation history to the backend `/query` endpoint.
   */
  const sendQueryToBackend = async (
    queryText: string,
    history: ChatMessage[]
  ): Promise<string> => {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      body: JSON.stringify({
        query: queryText,
        history: history
          .filter((msg) => !msg.isError && msg.id !== 'welcome-msg')
          .map(({ role, content }) => ({ role, content })),
      }),
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => '');
      throw new Error(
        errorText || `Server responded with status ${response.status}`
      );
    }

    const data: QueryResponse | string = await response.json();

    if (typeof data === 'string') return data;

    const reply = data.response ?? data.answer ?? data.reply ?? data.message;
    if (!reply) {
      throw new Error(
        'Unexpected response format from backend. Expected { response | answer | reply | message }.'
      );
    }

    return reply;
  };

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;

    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: trimmed,
      timestamp: formatTime(new Date()),
    };

    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput('');
    setIsLoading(true);

    try {
      const botReply = await sendQueryToBackend(trimmed, updatedMessages);

      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: botReply,
          timestamp: formatTime(new Date()),
        },
      ]);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to connect to server.';

      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: errorMessage,
          timestamp: formatTime(new Date()),
          isError: true,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: 'welcome-msg',
        role: 'assistant',
        content: initialGreeting,
        timestamp: formatTime(new Date()),
      },
    ]);
  };

  return (
    <div className="flex h-[600px] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-5 py-3.5">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-sm">
            <Bot className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-slate-900">{title}</h2>
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              <span>{subtitle}</span>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={handleClearChat}
          title="Clear conversation"
          className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-200/70 hover:text-slate-700"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 space-y-4 overflow-y-auto bg-slate-50/40 p-5">
        {messages.map((msg) => {
          const isUser = msg.role === 'user';

          return (
            <div
              key={msg.id}
              className={`flex items-end gap-2.5 ${
                isUser ? 'flex-row-reverse' : 'flex-row'
              }`}
            >
              {/* Avatar */}
              <div
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                  isUser
                    ? 'bg-indigo-600 text-white'
                    : msg.isError
                    ? 'bg-red-100 text-red-600'
                    : 'border border-slate-200 bg-white text-indigo-600'
                }`}
              >
                {isUser ? (
                  <User className="h-4 w-4" />
                ) : msg.isError ? (
                  <AlertCircle className="h-4 w-4" />
                ) : (
                  <Bot className="h-4 w-4" />
                )}
              </div>

              {/* Message Bubble */}
              <div
                className={`flex max-w-[78%] flex-col ${
                  isUser ? 'items-end' : 'items-start'
                }`}
              >
                <div
                  className={`whitespace-pre-wrap rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-xs ${
                    isUser
                      ? 'rounded-br-xs bg-indigo-600 text-white'
                      : msg.isError
                      ? 'rounded-bl-xs border border-red-200 bg-red-50 text-red-800'
                      : 'rounded-bl-xs border border-slate-200 bg-white text-slate-800'
                  }`}
                >
                  {msg.content}
                </div>
                <span className="mt-1 px-1 text-[11px] text-slate-400">
                  {msg.timestamp}
                </span>
              </div>
            </div>
          );
        })}

        {/* Typing / Loading Indicator */}
        {isLoading && (
          <div className="flex items-end gap-2.5">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-indigo-600">
              <Bot className="h-4 w-4" />
            </div>
            <div className="flex items-center gap-2 rounded-2xl rounded-bl-xs border border-slate-200 bg-white px-4 py-3 text-sm text-slate-500 shadow-xs">
              <Loader2 className="h-4 w-4 animate-spin text-indigo-600" />
              <span>Thinking...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <form
        onSubmit={handleSendMessage}
        className="border-t border-slate-200 bg-white p-3.5"
      >
        <div className="flex items-end gap-2 rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 focus-within:border-indigo-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-indigo-500/20">
          <textarea
            ref={textareaRef}
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={isLoading}
            className="max-h-36 flex-1 resize-none bg-transparent py-1 text-sm text-slate-800 placeholder-slate-400 focus:outline-none disabled:opacity-60"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-600 text-white transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </form>
    </div>
  );
};

function formatTime(date: Date): string {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export default ChatBot;