/**
 * AI Service - Handles all API calls to Claude/OpenAI
 * Never expose API keys in frontend - use backend proxy instead
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

export const aiService = {
  async chat(message, conversationHistory = []) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          history: conversationHistory,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || `API error: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Chat API error:', error);
      throw error;
    }
  },

  async summarize(text) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/summarize`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        throw new Error(`Failed to summarize: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Summarize API error:', error);
      throw error;
    }
  },

  async generateText(prompt) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        throw new Error(`Failed to generate text: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Generate API error:', error);
      throw error;
    }
  },
};

export default aiService;
