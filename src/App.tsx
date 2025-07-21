import React, { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, Send, Volume2, VolumeX, MessageCircle, Bot, User } from 'lucide-react';
import axios from 'axios';
import './App.css';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  abort(): void;
  onstart: ((this: SpeechRecognition, ev: Event) => any) | null;
  onend: ((this: SpeechRecognition, ev: Event) => any) | null;
  onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null;
  onerror: ((this: SpeechRecognition, ev: Event) => any) | null;
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}

const API_BASE_URL = 'http://localhost:5000/api';

// OpenAI API integration (client-side)
const OPENAI_API_KEY = 'sk-proj-0W7UTSnEoJ8UVlJnwO1HT3BlbkFJW3V2wieIvVI7rMZNirBj';

const getAIResponse = async (message: string): Promise<string> => {
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: 'You are a helpful assistant. Keep responses concise and friendly.' },
          { role: 'user', content: message }
        ],
        max_tokens: 200
      })
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('OpenAI API error:', error);
    return "I'm sorry, I'm having trouble connecting to my AI service right now. Please try again later.";
  }
};

function App() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! I'm your AI voice assistant. You can speak to me or type your questions. Try saying 'Open YouTube' or 'Open Google'!",
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [apiConnected, setApiConnected] = useState(false);

  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize speech synthesis
    if ('speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;
    }

    // Initialize speech recognition
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onstart = () => {
        setIsListening(true);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
        const transcript = event.results[0][0].transcript;
        setInputText(transcript);
        handleSendMessage(transcript);
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event);
        setIsListening(false);
      };
    }

    // Check API connection
    checkApiConnection();

    // Scroll to bottom
    scrollToBottom();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const checkApiConnection = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/health`, { timeout: 5000 });
      setApiConnected(response.data.status === 'healthy');
    } catch (error) {
      console.error('API connection failed:', error);
      setApiConnected(false);
    }
  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      try {
        recognitionRef.current.start();
      } catch (error) {
        console.error('Error starting speech recognition:', error);
      }
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
  };

  const handleSendMessage = async (messageText?: string) => {
    const text = messageText || inputText.trim();
    if (!text) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      if (!apiConnected) {
        // Fallback responses when API is not connected
        const fallbackResponse = getFallbackResponse(text.toLowerCase());
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: fallbackResponse,
          isUser: false,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, botMessage]);
        speak(fallbackResponse);
      } else {
        // Send to Python backend
        const response = await axios.post(`${API_BASE_URL}/chat`, {
          message: text
        }, { timeout: 10000 });

        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: response.data.response,
          isUser: false,
          timestamp: new Date()
        };

        setMessages(prev => [...prev, botMessage]);
        speak(response.data.response);

        // Handle browser actions
        if (response.data.action === 'open_site' && response.data.url) {
          setTimeout(() => {
            window.open(response.data.url, '_blank');
          }, 1000);
        }
      }
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "Sorry, I'm having trouble connecting to the server. Please make sure the Python backend is running on port 5000.",
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
      speak("Sorry, I'm having connection issues.");
    } finally {
      setIsLoading(false);
    }
  };

  const getFallbackResponse = (text: string): string => {
    if (text.includes('open youtube')) {
      setTimeout(() => window.open('https://www.youtube.com', '_blank'), 1000);
      return "Opening YouTube for you!";
    }
    if (text.includes('open google')) {
      setTimeout(() => window.open('https://www.google.com', '_blank'), 1000);
      return "Opening Google for you!";
    }
    if (text.includes('bye') || text.includes('goodbye')) {
      return "Goodbye! Have a great day!";
    }
    return "I'm running in offline mode. Please start the Python backend server to get AI responses. I can still help you open websites!";
  };

  const toggleSpeech = () => {
    setSpeechEnabled(!speechEnabled);
    if (isSpeaking && synthRef.current) {
      synthRef.current.cancel();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <div className="header-title">
            <MessageCircle className="header-icon" />
            <h1>AI Voice Assistant</h1>
          </div>
          <div className="header-controls">
            <div className={`connection-status ${apiConnected ? 'connected' : 'disconnected'}`}>
              <div className="status-dot"></div>
              {apiConnected ? 'API Connected' : 'Offline Mode'}
            </div>
            <button
              onClick={toggleSpeech}
              className={`control-btn ${speechEnabled ? 'active' : ''}`}
              title={speechEnabled ? 'Disable speech' : 'Enable speech'}
            >
              {speechEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
            </button>
          </div>
        </div>
      </header>

      <main className="chat-container">
        <div className="messages">
          {messages.map((message) => (
            <div key={message.id} className={`message ${message.isUser ? 'user' : 'bot'}`}>
              <div className="message-avatar">
                {message.isUser ? <User size={20} /> : <Bot size={20} />}
              </div>
              <div className="message-content">
                <div className="message-text">{message.text}</div>
                <div className="message-time">{formatTime(message.timestamp)}</div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="message bot">
              <div className="message-avatar">
                <Bot size={20} />
              </div>
              <div className="message-content">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="input-container">
          <div className="input-wrapper">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Type your message or click the mic to speak..."
              disabled={isLoading}
              className="message-input"
            />
            <div className="input-controls">
              <button
                onClick={isListening ? stopListening : startListening}
                className={`mic-btn ${isListening ? 'listening' : ''} ${isSpeaking ? 'speaking' : ''}`}
                disabled={isLoading}
                title={isListening ? 'Stop listening' : 'Start voice input'}
              >
                {isListening ? <MicOff size={20} /> : <Mic size={20} />}
              </button>
              <button
                onClick={() => handleSendMessage()}
                disabled={!inputText.trim() || isLoading}
                className="send-btn"
                title="Send message"
              >
                <Send size={20} />
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;