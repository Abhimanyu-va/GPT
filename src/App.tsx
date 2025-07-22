import React, { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, Send, Bot, User, Volume2, VolumeX, Wifi, WifiOff } from 'lucide-react';
import './App.css';

interface Message {
  id: number;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechEnabled, setSpeechEnabled] = useState(true);
  const [isConnected, setIsConnected] = useState(true);
  const [messageCounter, setMessageCounter] = useState(0);
  
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize speech synthesis
    synthRef.current = window.speechSynthesis;

    // Initialize speech recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onstart = () => {
        setIsListening(true);
      };

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInputText(transcript);
        handleSendMessage(transcript);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };
    }

    // Add welcome message
    addMessage("Hello! I'm your AI voice assistant. Click the microphone to speak or type your message below.", false);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const addMessage = (text: string, isUser: boolean) => {
    setMessageCounter(prev => prev + 1);
    const newMessage: Message = {
      id: Date.now() + messageCounter,
      text,
      isUser,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const speak = (text: string) => {
    if (synthRef.current && speechEnabled) {
      // Stop any ongoing speech
      synthRef.current.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 0.8;
      
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      
      synthRef.current.speak(utterance);
    }
  };

  const handleSendMessage = async (message?: string) => {
    const textToSend = message || inputText.trim();
    if (!textToSend) return;

    addMessage(textToSend, true);
    setInputText('');
    setIsProcessing(true);

    try {
      // Check for browser commands
      const lowerInput = textToSend.toLowerCase();
      
      if (lowerInput.includes('open youtube')) {
        window.open('https://www.youtube.com', '_blank');
        const response = "Opening YouTube for you!";
        addMessage(response, false);
        speak(response);
        setIsProcessing(false);
        return;
      }

      if (lowerInput.includes('open google')) {
        window.open('https://www.google.com', '_blank');
        const response = "Opening Google for you!";
        addMessage(response, false);
        speak(response);
        setIsProcessing(false);
        return;
      }

      if (lowerInput.includes('bye') || lowerInput.includes('goodbye')) {
        const response = "Goodbye! Have a great day!";
        addMessage(response, false);
        speak(response);
        setIsProcessing(false);
        return;
      }

      // Call OpenAI API
      const response = await fetch('http://localhost:5000/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: textToSend
        })
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const data = await response.json();
      const aiResponse = data.response;
      
      addMessage(aiResponse, false);
      speak(aiResponse);
      setIsConnected(true);
    } catch (error) {
      console.error('Error processing request:', error);
      const errorMessage = "Sorry, I encountered an error processing your request. Please check your API key or try again.";
      addMessage(errorMessage, false);
      speak(errorMessage);
      setIsConnected(false);
    }

    setIsProcessing(false);
  };

  const startListening = () => {
    if (recognitionRef.current && !isListening && !isProcessing) {
      recognitionRef.current.start();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
  };

  const toggleSpeech = () => {
    setSpeechEnabled(!speechEnabled);
    if (synthRef.current && !speechEnabled) {
      synthRef.current.cancel();
      setIsSpeaking(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="app">
      {/* Header */}
      <header className="app-header">
        <div className="header-content">
          <div className="header-title">
            <Bot className="header-icon" />
            <h1>AI Voice Assistant</h1>
          </div>
          <div className="header-controls">
            <div className={`connection-status ${isConnected ? 'connected' : 'disconnected'}`}>
              <div className="status-dot"></div>
              <span>{isConnected ? 'Connected' : 'Disconnected'}</span>
            </div>
            <button
              className={`control-btn ${speechEnabled ? 'active' : ''}`}
              onClick={toggleSpeech}
              title={speechEnabled ? 'Disable speech' : 'Enable speech'}
            >
              {speechEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
            </button>
          </div>
        </div>
      </header>

      {/* Chat Container */}
      <div className="chat-container">
        <div className="messages">
          {messages.map((message) => (
            <div key={message.id} className={`message ${message.isUser ? 'user' : 'bot'}`}>
              <div className="message-avatar">
                {message.isUser ? <User size={20} /> : <Bot size={20} />}
              </div>
              <div className="message-content">
                <div className="message-text">{message.text}</div>
                <div className="message-time">
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          ))}
          
          {isProcessing && (
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

        {/* Input Container */}
        <div className="input-container">
          <div className="input-wrapper">
            <textarea
              className="message-input"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message or click the microphone to speak..."
              disabled={isProcessing}
              rows={1}
            />
            <div className="input-controls">
              <button
                className={`mic-btn ${isListening ? 'listening' : ''} ${isSpeaking ? 'speaking' : ''}`}
                onClick={isListening ? stopListening : startListening}
                disabled={isProcessing}
                title={isListening ? 'Stop listening' : 'Start voice input'}
              >
                {isListening ? <MicOff size={20} /> : <Mic size={20} />}
              </button>
              <button
                className="send-btn"
                onClick={() => handleSendMessage()}
                disabled={!inputText.trim() || isProcessing}
                title="Send message"
              >
                <Send size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;