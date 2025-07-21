# AI Voice Assistant Web Application

A modern, full-stack voice assistant application that combines a React TypeScript frontend with a Python Flask backend, powered by OpenAI's GPT-4.

## 🚀 Features

- **🎤 Voice Recognition**: Click to speak and get instant voice-to-text conversion
- **🔊 Text-to-Speech**: AI responses are automatically spoken aloud
- **💬 Modern Chat Interface**: Clean, WhatsApp-style messaging UI
- **🌐 Browser Commands**: Voice commands to open websites (YouTube, Google, etc.)
- **📱 Fully Responsive**: Works perfectly on desktop, tablet, and mobile
- **⚡ Real-time Communication**: Instant responses via REST API
- **🎨 Beautiful Design**: Modern gradient design with smooth animations
- **🔄 Offline Mode**: Fallback functionality when backend is unavailable

## 🛠️ Technology Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Web Speech API** for voice recognition and synthesis
- **Axios** for HTTP requests
- **Lucide React** for beautiful icons
- **CSS3** with modern features (Grid, Flexbox, Animations)

### Backend
- **Python Flask** web framework
- **OpenAI GPT-4** for intelligent responses
- **Flask-CORS** for cross-origin requests
- **Threading** for non-blocking browser operations

## 📋 Prerequisites

- **Node.js** (v16 or higher)
- **Python** (v3.8 or higher)
- **OpenAI API Key**

## 🚀 Quick Start

### 1. Install Frontend Dependencies
```bash
npm install
```

### 2. Install Python Dependencies
```bash
pip install flask flask-cors openai
```

### 3. Set Up OpenAI API Key
Update the API key in `backend/app.py`:
```python
api_data = 'your-openai-api-key-here'
```

### 4. Start the Backend Server
```bash
cd backend
python app.py
```
The Flask server will start on `http://localhost:5000`

### 5. Start the Frontend Development Server
```bash
npm run dev
```
The React app will start on `http://localhost:5173`

## 🎯 Usage

### Voice Commands
- **"Open YouTube"** - Opens YouTube in a new tab
- **"Open Google"** - Opens Google in a new tab
- **"Bye" or "Goodbye"** - Ends the conversation
- **Any other question** - Gets an AI response from GPT-4

### Interface Controls
- **🎤 Microphone Button**: Click to start/stop voice input
- **📤 Send Button**: Send typed messages
- **🔊 Speaker Toggle**: Enable/disable text-to-speech
- **Connection Status**: Shows API connection status

## 🏗️ Project Structure

```
├── backend/
│   └── app.py              # Flask API server
├── src/
│   ├── App.tsx             # Main React component
│   ├── App.css             # Styles and animations
│   ├── types/
│   │   └── speech.d.ts     # TypeScript definitions
│   └── main.tsx            # React entry point
├── index.html              # HTML template
├── package.json            # Node.js dependencies
└── README.md              # This file
```

## 🔧 API Endpoints

### `POST /api/chat`
Send a message to the AI assistant
```json
{
  "message": "Hello, how are you?"
}
```

**Response:**
```json
{
  "response": "I'm doing great! How can I help you today?",
  "action": null,
  "url": null
}
```

### `GET /api/health`
Check API server status
```json
{
  "status": "healthy",
  "message": "Voice Assistant API is running"
}
```

## 🎨 Customization

### Styling
- Modify `src/App.css` to change colors, fonts, and animations
- Update CSS custom properties for theme colors
- Adjust responsive breakpoints for different screen sizes

### AI Behavior
- Update the system prompt in `backend/app.py`
- Modify `max_tokens` for longer/shorter responses
- Add custom command handlers in the Flask route

### Voice Settings
- Adjust speech synthesis rate, pitch, and volume in `App.tsx`
- Change recognition language in the SpeechRecognition setup
- Customize voice feedback and error handling

## 🚀 Deployment

### Frontend (Netlify/Vercel)
```bash
npm run build
# Deploy the 'dist' folder
```

### Backend (Heroku/Railway)
1. Add `requirements.txt`:
```
flask
flask-cors
openai
```

2. Add `Procfile`:
```
web: python backend/app.py
```

3. Set environment variables for the OpenAI API key

## 🔒 Security Notes

- **Never commit API keys** to version control
- Use environment variables for sensitive data in production
- Implement rate limiting for the API endpoints
- Add authentication for production deployments

## 🐛 Troubleshooting

### Common Issues

1. **Microphone not working**
   - Ensure HTTPS or localhost for Web Speech API
   - Check browser permissions for microphone access

2. **API connection failed**
   - Verify Flask server is running on port 5000
   - Check CORS configuration
   - Ensure OpenAI API key is valid

3. **Speech synthesis not working**
   - Check browser compatibility
   - Verify audio permissions
   - Test with different browsers

## 📱 Browser Compatibility

- **Chrome/Edge**: Full support (recommended)
- **Firefox**: Limited speech recognition support
- **Safari**: Partial support
- **Mobile browsers**: Varies by platform

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- OpenAI for the GPT-4 API
- Web Speech API for voice capabilities
- React and Flask communities
- Lucide for beautiful icons

---

**Built with ❤️ using React, TypeScript, Python, and OpenAI GPT-4**