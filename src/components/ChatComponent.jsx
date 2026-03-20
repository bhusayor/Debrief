import { useState } from 'react';
import useAI from '../hooks/useAI';
import './ChatComponent.css';

export function ChatComponent() {
  const { loading, error, chat, clearError } = useAI();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input;
    setInput('');

    // Add user message to chat
    setMessages((prev) => [...prev, { role: 'user', content: userMessage }]);

    try {
      // Call AI service
      const response = await chat(userMessage, messages);

      // Add AI response to chat
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: response.message },
      ]);
    } catch (err) {
      console.error('Failed to send message:', err);
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h2>AI Chat Assistant</h2>
        {error && <div className="error-banner">{error}</div>}
      </div>

      <div className="chat-messages">
        {messages.length === 0 ? (
          <div className="empty-state">
            <p>Start a conversation with the AI assistant</p>
          </div>
        ) : (
          messages.map((msg, idx) => (
            <div key={idx} className={`message ${msg.role}`}>
              <span className="role">{msg.role === 'user' ? 'You' : 'AI'}:</span>
              <p>{msg.content}</p>
            </div>
          ))
        )}
        {loading && (
          <div className="message assistant loading">
            <span className="loader"></span> Thinking...
          </div>
        )}
      </div>

      <form onSubmit={handleSendMessage} className="chat-input-form">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          disabled={loading}
          className="chat-input"
        />
        <button type="submit" disabled={loading || !input.trim()}>
          {loading ? 'Sending...' : 'Send'}
        </button>
        {error && (
          <button type="button" onClick={clearError} className="clear-error">
            ✕
          </button>
        )}
      </form>
    </div>
  );
}

export default ChatComponent;
