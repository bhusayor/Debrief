import express from 'express';
import cors from 'cors';
import Anthropic from '@anthropic-ai/sdk';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Initialize Anthropic client
const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Chat endpoint - analyze briefs with optional file context
app.post('/api/chat', async (req, res) => {
  try {
    const { message, history = [], files = [] } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Build conversation history for Claude
    const messages = [];

    // Add file context if files provided
    if (files && files.length > 0) {
      const fileContext = files
        .map((f) => `[File: ${f.name}]\n${f.content}`)
        .join('\n\n---\n\n');

      messages.push({
        role: 'user',
        content: `Here are some uploaded files for context:\n\n${fileContext}\n\nNow, please help with this: ${message}`,
      });
    } else {
      messages.push({
        role: 'user',
        content: message,
      });
    }

    // Add conversation history
    if (history && history.length > 0) {
      const historyMessages = history.map((msg) => ({
        role: msg.role || 'user',
        content: msg.content || msg.message || '',
      }));
      messages.unshift(...historyMessages);
    }

    // Call Claude API
    const response = await client.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 2048,
      system: `You are a design brief analyzer. Your role is to:
1. Analyze project briefs and extract key insights
2. Help users understand project scope and requirements
3. Identify potential challenges and opportunities
4. Provide actionable recommendations
5. When files are provided, analyze their content and use it as context for your responses

Be concise, clear, and professional. Format responses with clear sections and bullet points where appropriate.`,
      messages,
    });

    const assistantMessage =
      response.content[0].type === 'text' ? response.content[0].text : '';

    res.json({
      message: assistantMessage,
      usage: {
        input_tokens: response.usage.input_tokens,
        output_tokens: response.usage.output_tokens,
      },
    });
  } catch (error) {
    console.error('Chat API error:', error);
    res.status(500).json({
      error: error.message || 'Failed to process chat request',
    });
  }
});

// Summarize endpoint
app.post('/api/summarize', async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }

    const response = await client.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: `Please provide a concise summary of the following text:\n\n${text}`,
        },
      ],
    });

    const summary =
      response.content[0].type === 'text' ? response.content[0].text : '';

    res.json({
      summary,
      usage: {
        input_tokens: response.usage.input_tokens,
        output_tokens: response.usage.output_tokens,
      },
    });
  } catch (error) {
    console.error('Summarize API error:', error);
    res.status(500).json({
      error: error.message || 'Failed to summarize text',
    });
  }
});

// Generate endpoint
app.post('/api/generate', async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const response = await client.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 2048,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    const generated =
      response.content[0].type === 'text' ? response.content[0].text : '';

    res.json({
      generated,
      usage: {
        input_tokens: response.usage.input_tokens,
        output_tokens: response.usage.output_tokens,
      },
    });
  } catch (error) {
    console.error('Generate API error:', error);
    res.status(500).json({
      error: error.message || 'Failed to generate text',
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    error: 'Internal server error',
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Debrief backend server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
});
