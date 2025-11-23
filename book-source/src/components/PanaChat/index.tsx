import React, { useState, useRef, useEffect } from 'react';
import './panaChat.css';

interface AssistantProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Message {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
  metadata?: {
    isInTone?: boolean;
    confidence?: number;
    sources?: Array<{ type: string; path?: string; title?: string }>;
    usedBrowserSearch?: boolean;
  };
}

interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}

// Determine API URL based on environment
const getApiBaseUrl = () => {
  // In browser environment, use window location or environment variable
  if (typeof window !== 'undefined') {
    // For production, use same origin or configured URL
    const envUrl = (window as any).__API_BASE_URL__;
    if (envUrl) return envUrl;
    
    // For development, use localhost
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      return 'http://localhost:3001';
    }
    
    // For production, assume API is on same origin or use relative path
    return '';
  }
  
  // Server-side fallback
  return process.env.API_BASE_URL || 'http://localhost:3001';
};

const API_BASE_URL = getApiBaseUrl();

// Storage utility functions
const STORAGE_KEY = 'panaChat_sessions';

const loadSessionsFromStorage = (): ChatSession[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];

    const sessions = JSON.parse(stored);
    // Convert date strings back to Date objects
    return sessions.map((session: any) => ({
      ...session,
      createdAt: new Date(session.createdAt),
      updatedAt: new Date(session.updatedAt),
      messages: session.messages.map((msg: any) => ({
        ...msg,
        timestamp: new Date(msg.timestamp)
      }))
    }));
  } catch (error) {
    console.error('Error loading chat sessions:', error);
    return [];
  }
};

const saveSessionsToStorage = (sessions: ChatSession[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
  } catch (error) {
    console.error('Error saving chat sessions:', error);
  }
};

const createNewSession = (): ChatSession => {
  return {
    id: `session-${Date.now()}`,
    title: 'New Chat',
    messages: [
      {
        id: '1',
        text: 'Hello! I\'m your AI Assistant. How can I help you today?',
        isBot: true,
        timestamp: new Date(),
      },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  };
};

const Assistant: React.FC<AssistantProps> = ({ isOpen, onClose }) => {
  // Chat session management
  const [chatSessions, setChatSessions] = useState<ChatSession[]>(() => {
    const stored = loadSessionsFromStorage();
    if (stored.length === 0) {
      const newSession = createNewSession();
      return [newSession];
    }
    return stored;
  });

  const [currentSessionId, setCurrentSessionId] = useState<string>(() => {
    const stored = loadSessionsFromStorage();
    return stored.length > 0 ? stored[0].id : `session-${Date.now()}`;
  });

  // Get current session
  const currentSession = chatSessions.find(s => s.id === currentSessionId) || chatSessions[0];
  const messages = currentSession?.messages || [];

  const [inputValue, setInputValue] = useState('');
  const [isMinimized, setIsMinimized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isVoiceSupported, setIsVoiceSupported] = useState(false);
  const [isProcessingVoice, setIsProcessingVoice] = useState(false);
  const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null);
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const recognitionRef = useRef<any>(null);
  const speechSynthesisRef = useRef<SpeechSynthesisUtterance | null>(null);
  const finalTranscriptRef = useRef<string>('');
  const interimTranscriptRef = useRef<string>('');
  const updateTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const appendModeRef = useRef<boolean>(false);
  const existingTextRef = useRef<string>('');

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Save sessions to storage whenever they change
  useEffect(() => {
    saveSessionsToStorage(chatSessions);
  }, [chatSessions]);

  // Helper function to update messages in current session
  const updateCurrentSessionMessages = (updater: (prev: Message[]) => Message[]) => {
    setChatSessions(prevSessions => {
      return prevSessions.map(session => {
        if (session.id === currentSessionId) {
          return {
            ...session,
            messages: updater(session.messages),
            updatedAt: new Date()
          };
        }
        return session;
      });
    });
  };

  // Helper function to auto-generate chat title from first user message
  const updateSessionTitle = (sessionId: string, firstUserMessage: string) => {
    setChatSessions(prevSessions => {
      return prevSessions.map(session => {
        if (session.id === sessionId && session.title === 'New Chat') {
          // Generate title from first 50 characters of first message
          const title = firstUserMessage.length > 50
            ? firstUserMessage.substring(0, 50) + '...'
            : firstUserMessage;
          return { ...session, title, updatedAt: new Date() };
        }
        return session;
      });
    });
  };

  // Session management functions
  const createNewChat = () => {
    const newSession = createNewSession();
    setChatSessions(prev => [newSession, ...prev]);
    setCurrentSessionId(newSession.id);
  };

  const switchToSession = (sessionId: string) => {
    setCurrentSessionId(sessionId);
  };

  const deleteSession = (sessionId: string) => {
    setChatSessions(prev => {
      const updated = prev.filter(s => s.id !== sessionId);
      // If we deleted the current session, switch to the first available
      if (sessionId === currentSessionId && updated.length > 0) {
        setCurrentSessionId(updated[0].id);
      }
      // If no sessions left, create a new one
      if (updated.length === 0) {
        const newSession = createNewSession();
        setCurrentSessionId(newSession.id);
        return [newSession];
      }
      return updated;
    });
  };

  const renameSession = (sessionId: string, newTitle: string) => {
    setChatSessions(prev => {
      return prev.map(session => {
        if (session.id === sessionId) {
          return { ...session, title: newTitle, updatedAt: new Date() };
        }
        return session;
      });
    });
  };


  useEffect(() => {
    if (isOpen && !isMinimized) {
      inputRef.current?.focus();
    }
  }, [isOpen, isMinimized]);

  // Initialize Web Speech API
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        setIsVoiceSupported(true);
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true; // Enable real-time interim results for dynamic typing effect
        
        // Language support: English and Roman Urdu
        // 'en-US' works well for both English and Roman Urdu (since Roman Urdu uses Latin script)
        // For better Urdu support, you can use 'ur-PK', but 'en-US' typically provides better recognition for Roman Urdu
        recognition.lang = 'en-US';

        recognition.onstart = () => {
          setIsListening(true);
          // Always preserve existing text when in append mode
          if (appendModeRef.current) {
            // Append mode: preserve existing text, don't clear input
            // Use existingTextRef which was set before starting (more reliable)
            if (!existingTextRef.current) {
              // Fallback: read from current input if ref wasn't set
              existingTextRef.current = inputValue.trim() || '';
            }
            finalTranscriptRef.current = '';
            interimTranscriptRef.current = '';
            // Don't clear input - keep existing text visible
            // Input value should remain unchanged
          } else {
            // New session: reset everything
            existingTextRef.current = '';
            finalTranscriptRef.current = '';
            interimTranscriptRef.current = '';
            setInputValue('');
          }
        };

        recognition.onresult = (event: any) => {
          // Clear any pending updates for immediate response
          if (updateTimeoutRef.current) {
            clearTimeout(updateTimeoutRef.current);
          }

          let interimTranscript = '';
          let newFinalTranscript = '';

          // Process all results from the current index
          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
              // This is a final result - add to final transcript
              newFinalTranscript += transcript + ' ';
            } else {
              // This is an interim result - update interim transcript
              interimTranscript += transcript;
            }
          }

          // Update final transcript if we have new final results
          if (newFinalTranscript) {
            finalTranscriptRef.current += newFinalTranscript;
            interimTranscriptRef.current = ''; // Clear interim when we get final
          }

          // Update interim transcript for real-time display
          if (interimTranscript) {
            interimTranscriptRef.current = interimTranscript;
          }

          // Update UI immediately for real-time feedback
          const newVoiceText = (finalTranscriptRef.current + interimTranscriptRef.current).trim();
          
          if (appendModeRef.current && existingTextRef.current) {
            // Append mode: combine existing + new voice text
            const displayText = (existingTextRef.current + ' ' + newVoiceText).trim();
            setInputValue(displayText);
          } else {
            // New session: show voice text only
            setInputValue(newVoiceText);
          }
        };

        recognition.onerror = (event: any) => {
          console.error('Speech recognition error:', event.error);
          setIsListening(false);
          
          if (event.error === 'no-speech') {
            // User stopped speaking - keep the final transcript, clear interim
            const finalText = finalTranscriptRef.current.trim();
            if (appendModeRef.current && existingTextRef.current) {
              setInputValue((existingTextRef.current + ' ' + finalText).trim());
            } else {
              setInputValue(finalText);
            }
            interimTranscriptRef.current = '';
          } else if (event.error === 'not-allowed') {
            alert('Microphone permission denied. Please enable microphone access.');
            // Clear everything on permission error
            appendModeRef.current = false;
            existingTextRef.current = '';
            finalTranscriptRef.current = '';
            interimTranscriptRef.current = '';
            setInputValue('');
          } else {
            // For other errors, keep what we have
            const finalText = finalTranscriptRef.current.trim();
            if (appendModeRef.current && existingTextRef.current) {
              setInputValue((existingTextRef.current + ' ' + finalText).trim());
            } else {
              setInputValue(finalText);
            }
            interimTranscriptRef.current = '';
          }
          
          // Reset append mode on error
          appendModeRef.current = false;
          existingTextRef.current = '';
        };

        recognition.onend = () => {
          setIsListening(false);
          setIsProcessingVoice(false);
          // Keep final transcribed text, clear interim
          const finalText = finalTranscriptRef.current.trim();
          
          if (appendModeRef.current && existingTextRef.current) {
            // Append mode: combine existing + new final text
            setInputValue((existingTextRef.current + ' ' + finalText).trim());
          } else if (finalText) {
            // New session: just set final text
            setInputValue(finalText);
          }
          
          // Reset for next session
          appendModeRef.current = false;
          existingTextRef.current = '';
          finalTranscriptRef.current = '';
          interimTranscriptRef.current = '';
          // User can now review and edit before manually clicking send
        };

        recognitionRef.current = recognition;
      }
    }

    // Cleanup
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current);
      }
    };
  }, []);

  // Listen for external messages (e.g., from Selection Toolbar Summary feature)
  useEffect(() => {
    const handleExternalMessage = (event: CustomEvent) => {
      const { message } = event.detail;

      // Set the input value with the external message
      setInputValue(message);

      // Open the chat if minimized
      setIsMinimized(false);

      // Auto-send the message after a brief delay to allow UI to update
      setTimeout(() => {
        // Create user message
        const userMessage: Message = {
          id: Date.now().toString(),
          text: message,
          isBot: false,
          timestamp: new Date(),
        };

        updateCurrentSessionMessages((prev) => [...prev, userMessage]);
        setInputValue('');
        setIsLoading(true);

        // Auto-generate title from first user message
        if (currentSession.messages.length === 1) {
          updateSessionTitle(currentSessionId, message);
        }

        // Add loading message
        const loadingMessageId = (Date.now() + 1).toString();
        const loadingMessage: Message = {
          id: loadingMessageId,
          text: '__LOADING__',
          isBot: true,
          timestamp: new Date(),
        };
        updateCurrentSessionMessages((prev) => [...prev, loadingMessage]);

        // Prepare conversation history
        const conversationHistory = messages
          .filter((msg) => msg.id !== '1')
          .slice(-10)
          .map((msg) => ({
            text: msg.text,
            isBot: msg.isBot,
          }));

        // Call API
        fetch(`${API_BASE_URL}/api/chat/message`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message,
            conversationHistory,
          }),
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error(`API error: ${response.statusText}`);
            }
            return response.json();
          })
          .then((data) => {
            updateCurrentSessionMessages((prev) => {
              const filtered = prev.filter((msg) => msg.id !== loadingMessageId);
              return [
                ...filtered,
                {
                  id: Date.now().toString(),
                  text: data.message,
                  isBot: true,
                  timestamp: new Date(),
                  metadata: {
                    isInTone: data.isInTone,
                    confidence: data.confidence,
                    sources: data.sources,
                    usedBrowserSearch: data.metadata?.usedBrowserSearch,
                  },
                },
              ];
            });
          })
          .catch((error) => {
            console.error('Error sending message:', error);
            updateCurrentSessionMessages((prev) => {
              const filtered = prev.filter((msg) => msg.id !== loadingMessageId);
              return [
                ...filtered,
                {
                  id: Date.now().toString(),
                  text: 'Sorry, I encountered an error. Please make sure the API server is running and try again.',
                  isBot: true,
                  timestamp: new Date(),
                },
              ];
            });
          })
          .finally(() => {
            setIsLoading(false);
          });
      }, 100);
    };

    window.addEventListener('openPanaChatWithMessage', handleExternalMessage as EventListener);

    return () => {
      window.removeEventListener('openPanaChatWithMessage', handleExternalMessage as EventListener);
    };
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    setIsProcessingVoice(false);

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      isBot: false,
      timestamp: new Date(),
    };

    updateCurrentSessionMessages((prev) => [...prev, userMessage]);
    const currentInput = inputValue;
    setInputValue('');

    // Reset textarea height after sending
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
    }

    setIsLoading(true);

    // Auto-generate title from first user message
    if (currentSession.messages.length === 1) {
      updateSessionTitle(currentSessionId, currentInput);
    }

    // Add loading message
    const loadingMessageId = (Date.now() + 1).toString();
    const loadingMessage: Message = {
      id: loadingMessageId,
      text: '__LOADING__',
      isBot: true,
      timestamp: new Date(),
    };
    updateCurrentSessionMessages((prev) => [...prev, loadingMessage]);

    try {
      // Prepare conversation history (last 10 messages, excluding initial greeting)
      const conversationHistory = messages
        .filter((msg) => msg.id !== '1') // Exclude initial greeting
        .slice(-10)
        .map((msg) => ({
          text: msg.text,
          isBot: msg.isBot,
        }));

      // Call API
      const response = await fetch(`${API_BASE_URL}/api/chat/message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: currentInput,
          conversationHistory,
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }

      const data = await response.json();

      // Remove loading message and add actual response
      updateCurrentSessionMessages((prev) => {
        const filtered = prev.filter((msg) => msg.id !== loadingMessageId);
        return [
          ...filtered,
          {
            id: Date.now().toString(),
            text: data.message,
            isBot: true,
            timestamp: new Date(),
            metadata: {
              isInTone: data.isInTone,
              confidence: data.confidence,
              sources: data.sources,
              usedBrowserSearch: data.metadata?.usedBrowserSearch,
            },
          },
        ];
      });
    } catch (error) {
      console.error('Error sending message:', error);

      // Remove loading message and add error message
      updateCurrentSessionMessages((prev) => {
        const filtered = prev.filter((msg) => msg.id !== loadingMessageId);
        return [
          ...filtered,
          {
            id: Date.now().toString(),
            text: 'Sorry, I encountered an error. Please make sure the API server is running and try again.',
            isBot: true,
            timestamp: new Date(),
          },
        ];
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleVoiceInput = (appendMode: boolean = false) => {
    if (!isVoiceSupported || !recognitionRef.current) {
      alert('Voice input is not supported in your browser. Please use Chrome or Edge.');
      return;
    }

    if (isListening) {
      // Stop listening - finalize any interim text
      recognitionRef.current.stop();
      setIsListening(false);
      // Ensure final text is preserved
      const finalText = finalTranscriptRef.current.trim();
      if (finalText) {
        if (appendMode && inputValue.trim()) {
          // Append to existing text
          setInputValue((prev) => (prev + ' ' + finalText).trim());
        } else {
          setInputValue(finalText);
        }
      }
    } else {
      // Start listening
      appendModeRef.current = appendMode;
      // Always capture current input state before starting
      if (appendMode) {
        // Append mode: preserve existing input - don't clear it
        const currentText = inputValue.trim();
        existingTextRef.current = currentText;
        // Keep the input value as-is, don't clear it
      } else {
        // Normal mode: reset everything
        existingTextRef.current = '';
      }
      try {
        recognitionRef.current.start();
      } catch (error) {
        console.error('Error starting voice recognition:', error);
        setIsListening(false);
        appendModeRef.current = false;
        existingTextRef.current = '';
        // If already started, try to stop it
        try {
          recognitionRef.current.stop();
        } catch (e) {
          // Ignore stop errors
        }
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);

    // Auto-resize textarea
    const textarea = e.target;
    textarea.style.height = 'auto';
    textarea.style.height = `${Math.min(textarea.scrollHeight, 150)}px`;

    // Stop voice recognition if user starts typing manually
    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
      // Preserve any final transcript, but allow manual editing
      finalTranscriptRef.current = newValue;
      interimTranscriptRef.current = '';
    }
  };

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  // Copy message text to clipboard
  const handleCopyText = async (text: string, messageId: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedMessageId(messageId);
      // Reset copied state after 2 seconds
      setTimeout(() => {
        setCopiedMessageId(null);
      }, 2000);
    } catch (error) {
      console.error('Failed to copy text:', error);
    }
  };

  // Text-to-speech functionality with natural, conversational voice
  const handleTextToSpeech = (text: string, messageId: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      alert('Text-to-speech is not supported in your browser.');
      return;
    }

    // If already speaking this message, stop it
    if (speakingMessageId === messageId) {
      window.speechSynthesis.cancel();
      setSpeakingMessageId(null);
      speechSynthesisRef.current = null;
      return;
    }

    // If speaking another message, stop it first
    if (speakingMessageId) {
      window.speechSynthesis.cancel();
    }

    // Process text to add natural pauses for better conversational flow
    const processTextForSpeech = (rawText: string): string => {
      let processed = rawText;

      // Add longer pauses after sentences (periods, exclamation, question marks)
      processed = processed.replace(/([.!?])\s+/g, '$1... ');

      // Add medium pauses after commas for natural breathing
      processed = processed.replace(/,\s+/g, ', ');

      // Add slight pauses after colons and semicolons
      processed = processed.replace(/([;:])\s+/g, '$1. ');

      return processed;
    };

    // Create speech synthesis utterance with processed text
    const utterance = new SpeechSynthesisUtterance(processTextForSpeech(text));

    // Get available voices and select a natural-sounding one
    const setNaturalVoice = () => {
      const voices = window.speechSynthesis.getVoices();

      // Preferred voices in order of naturalness
      const preferredVoices = [
        'Google US English',
        'Microsoft Zira - English (United States)',
        'Microsoft David - English (United States)',
        'Samantha',
        'Alex',
        'Karen',
        'Daniel',
        'Google UK English Female',
        'Google UK English Male',
      ];

      // Find the first available preferred voice
      let selectedVoice = null;
      for (const voiceName of preferredVoices) {
        selectedVoice = voices.find(voice => voice.name === voiceName);
        if (selectedVoice) break;
      }

      // Fallback: find any English voice that's not a default system voice
      if (!selectedVoice) {
        selectedVoice = voices.find(voice =>
          voice.lang.startsWith('en') && !voice.name.includes('Default')
        );
      }

      // Final fallback: use any English voice
      if (!selectedVoice) {
        selectedVoice = voices.find(voice => voice.lang.startsWith('en'));
      }

      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }
    };

    // Set voice (voices might load asynchronously)
    if (window.speechSynthesis.getVoices().length > 0) {
      setNaturalVoice();
    } else {
      window.speechSynthesis.onvoiceschanged = setNaturalVoice;
    }

    // Conversational speech parameters
    utterance.lang = 'en-US';
    utterance.rate = 0.95; // Slightly slower for clarity and naturalness
    utterance.pitch = 1.05; // Slightly higher pitch for friendliness
    utterance.volume = 1.0;

    utterance.onstart = () => {
      setSpeakingMessageId(messageId);
    };

    utterance.onend = () => {
      setSpeakingMessageId(null);
      speechSynthesisRef.current = null;
    };

    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event);
      setSpeakingMessageId(null);
      speechSynthesisRef.current = null;
    };

    speechSynthesisRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  // Cleanup speech synthesis on unmount
  useEffect(() => {
    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  if (!isOpen) return null;

  return (
    <div className={`pana-chat ${isMinimized ? 'pana-chat--minimized' : ''}`}>
      {/* Chat Header */}
      <div
        className="pana-chat__header"
        onClick={isMinimized ? toggleMinimize : undefined}
        style={isMinimized ? { cursor: 'pointer' } : undefined}
      >
        <div className="pana-chat__header-left">
          <div className="pana-chat__logo">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M3 3L8 3L8 21L3 21L3 3Z"
                fill="white"
              />
              <path
                d="M11 3L16 3L16 21L11 21L11 3Z"
                fill="white"
                fillOpacity="0.7"
              />
              <path
                d="M19 3L21 3L21 21L19 21L19 3Z"
                fill="white"
                fillOpacity="0.5"
              />
            </svg>
          </div>
          <h3 className="pana-chat__title">Assistant</h3>
        </div>
        <div className="pana-chat__header-actions">
          <button
            className="pana-chat__header-btn pana-chat__new-chat-btn"
            onClick={createNewChat}
            aria-label="New Chat"
            title="New Chat"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 5v14M5 12h14"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <button
            className="pana-chat__header-btn"
            onClick={(e) => {
              e.stopPropagation();
              toggleMinimize();
            }}
            aria-label={isMinimized ? 'Maximize' : 'Minimize'}
            title={isMinimized ? 'Maximize' : 'Minimize'}
          >
            {isMinimized ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path
                  d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path
                  d="M19 13H5"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </button>
          <button
            className="pana-chat__header-btn pana-chat__close-btn"
            onClick={onClose}
            aria-label="Close"
            title="Close"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path
                d="M18 6L6 18M6 6l12 12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Chat Body - Only visible when not minimized */}
      {!isMinimized && (
        <>
          <div className="pana-chat__body">
            <div className="pana-chat__messages">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`pana-chat__message ${
                    message.isBot ? 'pana-chat__message--bot' : 'pana-chat__message--user'
                  }`}
                >
                  <div className="pana-chat__message-wrapper">
                    <div className="pana-chat__message-text">
                      {message.text === '__LOADING__' ? (
                        <div className="pana-chat__loading">
                          <div className="pana-chat__loading-dot"></div>
                          <div className="pana-chat__loading-dot"></div>
                          <div className="pana-chat__loading-dot"></div>
                        </div>
                      ) : (
                        message.text
                      )}
                      {message.metadata && message.metadata.sources && message.metadata.sources.length > 0 && (
                        <div className="pana-chat__message-sources">
                          <div className="pana-chat__sources-label">Sources:</div>
                          {message.metadata.sources.map((source, idx) => (
                            <div key={idx} className="pana-chat__source-item">
                              {source.title || source.path || 'Project file'}
                            </div>
                          ))}
                        </div>
                      )}
                      {message.metadata && message.metadata.usedBrowserSearch && (
                        <div className="pana-chat__message-note">
                          <span className="pana-chat__note-icon">🌐</span>
                          Used external search to enhance answer
                        </div>
                      )}
                    </div>

                    {/* Action buttons - Copy and Text-to-Speech */}
                    {message.text !== '__LOADING__' && (
                      <div className="pana-chat__message-actions">
                        <button
                          className={`pana-chat__action-btn ${copiedMessageId === message.id ? 'pana-chat__action-btn--active' : ''}`}
                          onClick={() => handleCopyText(message.text, message.id)}
                          aria-label={copiedMessageId === message.id ? 'Copied!' : 'Copy message'}
                          title={copiedMessageId === message.id ? 'Copied!' : 'Copy message'}
                        >
                          {copiedMessageId === message.id ? (
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                              <path
                                d="M20 6L9 17l-5-5"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          ) : (
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                              <rect
                                x="9"
                                y="9"
                                width="13"
                                height="13"
                                rx="2"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                              <path
                                d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          )}
                        </button>
                        <button
                          className={`pana-chat__action-btn ${speakingMessageId === message.id ? 'pana-chat__action-btn--active' : ''}`}
                          onClick={() => handleTextToSpeech(message.text, message.id)}
                          aria-label={speakingMessageId === message.id ? 'Stop speaking' : 'Read aloud'}
                          title={speakingMessageId === message.id ? 'Stop speaking' : 'Read aloud'}
                        >
                          {speakingMessageId === message.id ? (
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                              <rect
                                x="6"
                                y="4"
                                width="4"
                                height="16"
                                rx="1"
                                fill="currentColor"
                              />
                              <rect
                                x="14"
                                y="4"
                                width="4"
                                height="16"
                                rx="1"
                                fill="currentColor"
                              />
                            </svg>
                          ) : (
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                              <path
                                d="M11 5L6 9H2v6h4l5 4V5z"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                              <path
                                d="M15.54 8.46a5 5 0 010 7.07M19.07 4.93a10 10 0 010 14.14"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Chat Footer */}
          <div className="pana-chat__footer">
            <div className="pana-chat__input-wrapper">
              <div className="pana-chat__input-container">
                <textarea
                  ref={inputRef}
                  className="pana-chat__input"
                  placeholder="Type your message"
                  value={inputValue}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyPress}
                  rows={1}
                />
                {/* Small mic button - appears when input has text, shows listening state */}
                {inputValue.trim() && isVoiceSupported && (
                  <button
                    className={`pana-chat__small-voice-btn ${isListening ? 'pana-chat__small-voice-btn--listening' : ''}`}
                    onClick={(e) => {
                      e.preventDefault();
                      handleVoiceInput(true); // Append mode
                    }}
                    disabled={isLoading}
                    aria-label={isListening ? 'Stop listening' : 'Continue voice input'}
                    title={isListening ? 'Stop listening' : 'Continue voice input'}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M12 1C10.34 1 9 2.34 9 4V11C9 12.66 10.34 14 12 14C13.66 14 15 12.66 15 11V4C15 2.34 13.66 1 12 1Z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M19 10V11C19 15.42 15.42 19 11 19H10M5 10V11C5 15.42 8.58 19 13 19M13 19V22M13 22H9"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                )}
              </div>
              {/* Show voice button when input is empty, send button when typing */}
              {!inputValue.trim() && isVoiceSupported ? (
                <button
                  className={`pana-chat__voice-btn ${isListening ? 'pana-chat__voice-btn--listening' : ''}`}
                  onClick={() => handleVoiceInput(false)}
                  disabled={isLoading}
                  aria-label={isListening ? 'Stop listening' : 'Start voice input'}
                  title={isListening ? 'Stop listening' : 'Start voice input'}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M12 1C10.34 1 9 2.34 9 4V11C9 12.66 10.34 14 12 14C13.66 14 15 12.66 15 11V4C15 2.34 13.66 1 12 1Z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M19 10V11C19 15.42 15.42 19 11 19H10M5 10V11C5 15.42 8.58 19 13 19M13 19V22M13 22H9"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              ) : (
                <button
                  className="pana-chat__send-btn"
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isLoading}
                  aria-label="Send message"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Assistant;
