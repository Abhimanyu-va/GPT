const express = require('express');
const cors = require('cors');
const { OpenAI } = require('openai');

const app = express();
const port = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: 'sk-proj-0W7UTSnEoJ8UVlJnwO1HT3BlbkFJW3V2wieIvVI7rMZNirBj'
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy', message: 'Voice Assistant API is running' });
});

// Chat endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'No message provided' });
    }

    const question = message.toLowerCase();
    
    // Handle browser commands
    if (question.includes('open youtube')) {
      return res.json({
        response: "Opening YouTube for you!",
        action: 'open_site',
        url: 'https://www.youtube.com'
      });
    }
    
    if (question.includes('open google')) {
      return res.json({
        response: "Opening Google for you!",
        action: 'open_site',
        url: 'https://www.google.com'
      });
    }
    
    if (question.includes('bye') || question.includes('goodbye')) {
      return res.json({
        response: "Goodbye! Have a great day!"
      });
    }

    // Get AI response
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: 'You are a helpful assistant. Keep responses concise and friendly.' },
        { role: 'user', content: message }
      ],
      max_tokens: 200
    });

    const response = completion.choices[0].message.content;
    
    res.json({ response });
    
  } catch (error) {
    console.error('Error processing request:', error);
    res.status(500).json({ 
      error: 'Server error: ' + error.message 
    });
  }
});

app.listen(port, () => {
  console.log(`Voice Assistant API server running at http://localhost:${port}`);
});