import 'dotenv/config';
import app from './api/index.js';

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`🚀 Debrief backend server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
});

