import { useState, useRef, useEffect } from 'react';
import { Send, Trash2, Bot, User } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import { getAIResponse } from '../utils/chatEngine';

const suggestions = [
  'What is a variable?',
  'How to study effectively?',
  'Explain derivatives',
  'What is an array?',
  'Exam preparation tips',
  'How to stay focused?',
];

export default function ChatPage() {
  const { chatHistory, addChatMessage, clearChat } = useData();
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEnd = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    messagesEnd.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, isTyping]);

  const sendMessage = async (text) => {
    const msg = text || input.trim();
    if (!msg) return;

    addChatMessage({ role: 'user', content: msg });
    setInput('');
    setIsTyping(true);

    // Simulate AI thinking delay
    setTimeout(() => {
      const response = getAIResponse(msg);
      addChatMessage({ role: 'bot', content: response });
      setIsTyping(false);
    }, 600 + Math.random() * 800);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Simple markdown-like rendering for chat messages
  const renderContent = (content) => {
    const parts = content.split(/(```[\s\S]*?```|\*\*.*?\*\*|\n)/g);
    return parts.map((part, i) => {
      if (part.startsWith('```') && part.endsWith('```')) {
        const code = part.slice(3, -3).replace(/^\w+\n/, '');
        return <pre key={i} style={{ background: 'var(--bg-primary)', padding: '10px 14px', borderRadius: 'var(--radius-sm)', fontSize: '0.8rem', overflow: 'auto', margin: '8px 0', fontFamily: 'monospace' }}>{code}</pre>;
      }
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i}>{part.slice(2, -2)}</strong>;
      }
      if (part === '\n') return <br key={i} />;
      return <span key={i}>{part}</span>;
    });
  };

  return (
    <div className="chat-container">
      {chatHistory.length === 0 && (
        <div style={{ textAlign: 'center', padding: '40px 20px' }}>
          <div style={{ fontSize: '3rem', marginBottom: 12 }}>🤖</div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: 8 }}>Hi! I'm your AI Study Tutor</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', maxWidth: 400, margin: '0 auto 20px' }}>
            Ask me about programming, math, study tips, or any academic topic. I'll give you clear, beginner-friendly explanations!
          </p>
          <div className="chat-suggestions" style={{ justifyContent: 'center' }}>
            {suggestions.map(s => (
              <button key={s} className="chat-suggestion" onClick={() => sendMessage(s)}>{s}</button>
            ))}
          </div>
        </div>
      )}

      <div className="chat-messages">
        {chatHistory.map(msg => (
          <div key={msg.id} className={`chat-msg ${msg.role}`}>
            <div className="chat-msg-avatar">
              {msg.role === 'bot' ? <Bot size={16} /> : <User size={16} />}
            </div>
            <div className="chat-msg-bubble">
              {renderContent(msg.content)}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="chat-msg bot">
            <div className="chat-msg-avatar"><Bot size={16} /></div>
            <div className="chat-msg-bubble">
              <div className="typing-indicator">
                <div className="typing-dot" />
                <div className="typing-dot" />
                <div className="typing-dot" />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEnd} />
      </div>

      <div className="chat-input-area">
        <input
          ref={inputRef}
          className="form-input"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask a question..."
          disabled={isTyping}
        />
        <button className="btn btn-primary" onClick={() => sendMessage()} disabled={isTyping || !input.trim()}>
          <Send size={16} />
        </button>
        {chatHistory.length > 0 && (
          <button className="btn btn-ghost btn-icon" onClick={clearChat} title="Clear chat">
            <Trash2 size={16} />
          </button>
        )}
      </div>
    </div>
  );
}
