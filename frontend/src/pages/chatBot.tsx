import React, { useState, useRef, useEffect } from 'react';

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

interface SendQueryPayload {
  message: string;
  query: string;
  history: ChatMessage[];
}

export interface ChatBotPageProps {
  endpoint?: string;
  title?: string;
  subtitle?: string;
  placeholder?: string;
  initialGreeting?: string;
  headers?: Record<string, string>;
  storageKey?: string;
  onNavigate?: (rawTarget: string) => void;
}

export const ChatBotPage: React.FC<ChatBotPageProps> = ({
  endpoint = 'https://konexio-connect-360.onrender.com/query',
  title = 'AI Assistant',
  subtitle = 'Connected to /query',
  placeholder = 'Type your message...',
  initialGreeting = 'Hello! How can I help you today?',
  headers = {},
  storageKey = 'chatbot_session_history',
}) => {
  const messagesContainerRef = useRef<HTMLDivElement | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // Ignore
    }
    return [
      {
        id: 'welcome-msg',
        role: 'assistant',
        content: initialGreeting,
        timestamp: formatTime(new Date()),
      },
    ];
  });

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const textareaRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(messages));
    } catch {
      // Ignore
    }
  }, [messages, storageKey]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const sendQueryToBackend = async ({
    message,
    query,
    history,
  }: SendQueryPayload): Promise<string> => {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      body: JSON.stringify({
        message,
        query,
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
      const botReply = await sendQueryToBackend({
        message: trimmed,
        query: trimmed,
        history: updatedMessages,
      });

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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
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
    localStorage.removeItem(storageKey);
  };

  useEffect(() => {
    const el = messagesContainerRef.current;
    if (el) {
      el.scrollTop = el.scrollHeight;
    }
  }, [messages, isLoading]);

  return (
    <div className="chatbot-page-wrapper">
      {/* Header */}
      <div className="chatbot-page-header">
        <div className="chatbot-title-area">
          <div className="chatbot-avatar-sm">🤖</div>
          <div>
            <h1>{title}</h1>
            <span>{subtitle}</span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleClearChat}
          className="chatbot-clear-btn"
        >
          Clear Chat
        </button>
      </div>

      {/* Messages */}
      <div className="chatbot-page-messages" ref={messagesContainerRef}>
        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={msg.id}
              className={`chatbot-message-row ${
                isUser ? 'user-row' : 'bot-row'
              }`}
            >
              <div
                className={`chatbot-bubble ${
                  isUser
                    ? 'user-bubble'
                    : msg.isError
                    ? 'error-bubble'
                    : 'bot-bubble'
                }`}
              >
                {msg.content}
              </div>
              <span className="chatbot-time">{msg.timestamp}</span>
            </div>
          );
        })}

        {isLoading && (
          <div className="chatbot-message-row bot-row">
            <div className="chatbot-bubble bot-bubble">Thinking...</div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSendMessage} className="chatbot-page-input-area">
        <div className='send-box'>
          <input
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
  
          className='input-box'
        />

        <button type="submit" disabled={!input.trim() || isLoading} className='chatbot-input-area-button'>
          Send
        </button>
        </div>
        
      </form>
    </div>
  );
};

function formatTime(date: Date): string {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export default ChatBotPage;