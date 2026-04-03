# Debrief Backend Server

Node.js/Express backend server for the Debrief design brief analyzer application.

## Setup

1. **Install dependencies:**
   ```bash
   cd backend
   npm install
   ```

2. **Create `.env` file:**
   ```bash
   cp .env.example .env
   ```

3. **Add your API key:**
   - Get your Anthropic API key from [console.anthropic.com](https://console.anthropic.com)
   - Add it to `.env`:
     ```
     ANTHROPIC_API_KEY=sk-ant-...
     ```

## Running the Server

**Development mode** (with auto-reload):
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

The server will start on `http://localhost:3001`

## API Endpoints

### Health Check
```
GET /health
```

### Analyze Brief / Chat
```
POST /api/chat
Content-Type: application/json

{
  "message": "What are the key requirements?",
  "history": [],
  "files": [
    {
      "name": "brief.pdf",
      "content": "...file content..."
    }
  ]
}
```

### Summarize Text
```
POST /api/summarize
Content-Type: application/json

{
  "text": "Long text to summarize..."
}
```

### Generate Text
```
POST /api/generate
Content-Type: application/json

{
  "prompt": "What would you suggest for..."
}
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `ANTHROPIC_API_KEY` | Your Anthropic API key (required) |
| `PORT` | Server port (default: 3001) |
| `FRONTEND_URL` | Frontend URL for CORS (optional) |

## Deployment

### Vercel
1. Connect your GitHub repo to Vercel
2. Set `ANTHROPIC_API_KEY` in Environment Variables
3. Add build settings:
   - Build Command: `cd backend && npm install && npm start`
   - Output Directory: Not needed for backend

### Other Platforms
- Ensure `ANTHROPIC_API_KEY` is set as environment variable
- The server listens on the `PORT` environment variable (defaults to 3001)
