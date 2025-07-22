# AI Voice Assistant Web Application

A modern voice assistant web application built with React TypeScript, featuring direct OpenAI API integration for intelligent conversations.

## 🚀 Features

- **🎤 Voice Recognition**: Click to speak and get instant voice-to-text conversion
- **🔊 Text-to-Speech**: AI responses are automatically spoken aloud
- **💬 Modern Chat Interface**: Clean, WhatsApp-style messaging UI
- **📱 Fully Responsive**: Works perfectly on desktop, tablet, and mobile
- **⚡ Real-time Communication**: Direct API integration with OpenAI
- **🎨 Beautiful Design**: Modern gradient design with smooth animations

## 🛠️ Technology Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Web Speech API** for voice recognition and synthesis
- **OpenAI API** for intelligent responses
- **Lucide React** for beautiful icons
- **CSS3** with modern features (Grid, Flexbox, Animations)

## 📋 Prerequisites

- **Node.js** (v16 or higher)
- **OpenAI API Key**

## 🚀 Getting Started

### Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm run dev
   ```
   
   **Note:** Make sure to run this command from the project's root directory (not from the `backend/` subdirectory).

3. **Configure your OpenAI API key** in the application settings

## 🎯 Features

- 🎤 **Voice Recognition** - Click to speak, get instant transcription
- 🤖 **AI Responses** - Powered by OpenAI's GPT-4 for intelligent conversations
- 🔊 **Text-to-Speech** - Hear AI responses spoken naturally
- 📱 **Mobile Responsive** - Works perfectly on all devices
- ✨ **Smooth Animations** - Professional polish with subtle motion effects

## 🔧 API Integration

The application integrates directly with OpenAI's API for AI responses. The API key is configured in the source code, but for production use, you should:
1. Move the API key to environment variables
2. Implement proper API key management
3. Add rate limiting and error handling

## 🎤 Voice Commands

Try these voice commands:
- **Any question** - Get AI-powered responses

## 🛠️ Technology Stack

- **Frontend**: React + TypeScript + Vite
- **AI Integration**: OpenAI GPT-4 API
- **Speech**: Web Speech API for recognition and synthesis
- **Styling**: Modern CSS with animations and micro-interactions

## 🏗️ Project Structure

```
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

## 🎨 Customization

### Styling
- Modify `src/App.css` to change colors, fonts, and animations
- Update CSS custom properties for theme colors
- Adjust responsive breakpoints for different screen sizes

### AI Behavior
- Update the system prompt in the OpenAI API call
- Modify `max_tokens` for longer/shorter responses
- Customize the AI model and parameters

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

### Environment Variables
Set your OpenAI API key as an environment variable for production deployments.

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

2. **OpenAI API errors**
   - Ensure OpenAI API key is valid
   - Check API rate limits and usage

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
- React community
- Lucide for beautiful icons

---
