import React, { useState, useRef, useEffect } from 'react';

function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hi! I'm EcoBot, your sustainable shopping assistant. How can I help you today?",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Predefined responses for the AI chatbot
  const getAIResponse = (userMessage) => {
    const message = userMessage.toLowerCase();
    
    // Website information responses
    if (message.includes('about') || message.includes('company')) {
      return "EcoStore is India's leading sustainable e-commerce platform. We offer eco-friendly products ranging from traditional items like copper bottles and khadi clothing to modern sustainable alternatives. Our mission is to make sustainable living accessible and affordable for everyone.";
    }
    
    if (message.includes('shipping') || message.includes('delivery')) {
      return "We offer free shipping on orders above ₹4,000. Standard delivery takes 3-5 business days. We use eco-friendly packaging and carbon-neutral delivery options wherever possible.";
    }
    
    if (message.includes('return') || message.includes('refund')) {
      return "We have a 30-day return policy for all products. Items must be in original condition. Refunds are processed within 5-7 business days. We also offer exchanges for different sizes or colors.";
    }
    
    if (message.includes('payment') || message.includes('pay')) {
      return "We accept all major payment methods including UPI, credit/debit cards, net banking, and digital wallets. All transactions are secured with 256-bit SSL encryption.";
    }
    
    if (message.includes('product') || message.includes('item')) {
      return "We have over 30 eco-friendly products including copper water bottles, bamboo items, organic clothing, solar gadgets, and traditional Indian crafts. All products are carefully curated for sustainability and quality.";
    }
    
    if (message.includes('price') || message.includes('cost') || message.includes('₹')) {
      return "Our products range from ₹299 to ₹7,499. We offer competitive pricing on all sustainable products. Check out our loyalty program to earn points and get discounts on future purchases!";
    }
    
    if (message.includes('loyalty') || message.includes('points') || message.includes('reward')) {
      return "Our loyalty program gives you 1 point for every rupee spent. You can redeem points for discounts, free shipping, eco-boxes, or even plant trees! Bronze, Silver, Gold, and Platinum tiers offer increasing benefits.";
    }
    
    if (message.includes('eco') || message.includes('sustainable') || message.includes('environment')) {
      return "Sustainability is at our core! Our products help reduce plastic waste, support local artisans, and promote eco-friendly living. We track your environmental impact - CO₂ saved, eco products purchased, and trees planted through our platform.";
    }
    
    if (message.includes('contact') || message.includes('support') || message.includes('help')) {
      return "You can reach our customer support at support@ecostore.com or call +91-1234567890. We're available 24/7 to help with any questions about orders, products, or sustainability tips!";
    }
    
    if (message.includes('account') || message.includes('profile') || message.includes('login')) {
      return "Create an account to track orders, earn loyalty points, save favorites, and get personalized recommendations. Your profile also shows your eco-impact and sustainability achievements!";
    }
    
    if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
      return "Hello! Welcome to EcoStore! I'm here to help you find sustainable products and answer any questions about our eco-friendly marketplace. What would you like to know?";
    }
    
    if (message.includes('thank') || message.includes('thanks')) {
      return "You're welcome! I'm always here to help you on your sustainable shopping journey. Feel free to ask me anything about our products or services anytime! 🌱";
    }
    
    // Default response
    return "I'd be happy to help! I can answer questions about our products, shipping, returns, payments, loyalty program, sustainability initiatives, and more. What specific information are you looking for?";
  };

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: inputText,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // Simulate AI thinking time
    setTimeout(() => {
      const botResponse = {
        id: Date.now() + 1,
        text: getAIResponse(inputText),
        sender: 'bot',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000); // Random delay between 1-2 seconds
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const quickQuestions = [
    "What products do you sell?",
    "How does shipping work?",
    "Tell me about loyalty points",
    "What's your return policy?",
    "How do I track my environmental impact?"
  ];

  const handleQuickQuestion = (question) => {
    setInputText(question);
    setTimeout(() => handleSendMessage(), 100);
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <div className={`chat-toggle ${isOpen ? 'open' : ''}`} onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? (
          <i className="fas fa-times"></i>
        ) : (
          <>
            <i className="fas fa-robot"></i>
            <div className="chat-notification">
              <span>Ask me anything!</span>
            </div>
          </>
        )}
      </div>

      {/* Chat Window */}
      {isOpen && (
        <div className="chat-window">
          <div className="chat-header">
            <div className="bot-info">
              <div className="bot-avatar">
                <i className="fas fa-robot"></i>
              </div>
              <div className="bot-details">
                <h4>EcoBot</h4>
                <span className="status">
                  <div className="status-dot"></div>
                  Online
                </span>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="close-chat">
              <i className="fas fa-times"></i>
            </button>
          </div>

          <div className="chat-messages">
            {messages.map(message => (
              <div key={message.id} className={`message ${message.sender}`}>
                <div className="message-content">
                  <p>{message.text}</p>
                  <span className="timestamp">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="message bot">
                <div className="message-content typing">
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

          {messages.length === 1 && (
            <div className="quick-questions">
              <p>Quick questions:</p>
              <div className="questions-grid">
                {quickQuestions.map((question, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickQuestion(question)}
                    className="quick-question"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="chat-input">
            <div className="input-container">
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything about EcoStore..."
                rows="1"
                className="message-input"
              />
              <button 
                onClick={handleSendMessage}
                disabled={!inputText.trim()}
                className="send-button"
              >
                <i className="fas fa-paper-plane"></i>
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .chat-toggle {
          position: fixed;
          bottom: 2rem;
          right: 2rem;
          width: 60px;
          height: 60px;
          background: linear-gradient(135deg, #00b894, #00a085);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          box-shadow: 0 8px 25px rgba(0, 184, 148, 0.3);
          transition: all 0.3s ease;
          z-index: 1000;
          color: white;
          font-size: 1.5rem;
        }

        .chat-toggle:hover {
          transform: scale(1.1);
          box-shadow: 0 12px 35px rgba(0, 184, 148, 0.4);
        }

        .chat-toggle.open {
          background: #e74c3c;
        }

        .chat-notification {
          position: absolute;
          bottom: 70px;
          right: 0;
          background: white;
          padding: 0.5rem 1rem;
          border-radius: 20px;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
          white-space: nowrap;
          color: var(--text-primary);
          font-size: 0.875rem;
          font-weight: 500;
          animation: bounce 2s infinite;
        }

        .chat-notification::after {
          content: '';
          position: absolute;
          top: 100%;
          right: 20px;
          border: 8px solid transparent;
          border-top-color: white;
        }

        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-10px); }
          60% { transform: translateY(-5px); }
        }

        .chat-window {
          position: fixed;
          bottom: 2rem;
          right: 2rem;
          width: 400px;
          height: 600px;
          background: white;
          border-radius: 1rem;
          box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
          display: flex;
          flex-direction: column;
          z-index: 999;
          overflow: hidden;
        }

        .chat-header {
          background: linear-gradient(135deg, #00b894, #00a085);
          color: white;
          padding: 1rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .bot-info {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .bot-avatar {
          width: 40px;
          height: 40px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.25rem;
        }

        .bot-details h4 {
          margin: 0;
          font-size: 1.125rem;
          font-weight: 600;
        }

        .status {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.875rem;
          opacity: 0.9;
        }

        .status-dot {
          width: 8px;
          height: 8px;
          background: #2ecc71;
          border-radius: 50%;
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.5; }
          100% { opacity: 1; }
        }

        .close-chat {
          background: none;
          border: none;
          color: white;
          font-size: 1.25rem;
          cursor: pointer;
          padding: 0.5rem;
          border-radius: 0.25rem;
          transition: background 0.2s;
        }

        .close-chat:hover {
          background: rgba(255, 255, 255, 0.1);
        }

        .chat-messages {
          flex: 1;
          padding: 1rem;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .message {
          display: flex;
        }

        .message.user {
          justify-content: flex-end;
        }

        .message.bot {
          justify-content: flex-start;
        }

        .message-content {
          max-width: 80%;
          padding: 0.75rem 1rem;
          border-radius: 1rem;
          position: relative;
        }

        .message.user .message-content {
          background: var(--primary-color);
          color: white;
          border-bottom-right-radius: 0.25rem;
        }

        .message.bot .message-content {
          background: #f1f3f4;
          color: var(--text-primary);
          border-bottom-left-radius: 0.25rem;
        }

        .message-content p {
          margin: 0 0 0.25rem 0;
          line-height: 1.4;
        }

        .timestamp {
          font-size: 0.75rem;
          opacity: 0.7;
        }

        .typing-indicator {
          display: flex;
          gap: 0.25rem;
          padding: 0.5rem 0;
        }

        .typing-indicator span {
          width: 8px;
          height: 8px;
          background: #bbb;
          border-radius: 50%;
          animation: typing 1.4s infinite ease-in-out;
        }

        .typing-indicator span:nth-child(1) { animation-delay: -0.32s; }
        .typing-indicator span:nth-child(2) { animation-delay: -0.16s; }

        @keyframes typing {
          0%, 80%, 100% { transform: scale(0); }
          40% { transform: scale(1); }
        }

        .quick-questions {
          padding: 1rem;
          border-top: 1px solid #e5e7eb;
          background: #f9fafb;
        }

        .quick-questions p {
          margin: 0 0 0.75rem 0;
          font-size: 0.875rem;
          font-weight: 500;
          color: var(--text-secondary);
        }

        .questions-grid {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .quick-question {
          background: white;
          border: 1px solid #e5e7eb;
          padding: 0.5rem 0.75rem;
          border-radius: 0.5rem;
          cursor: pointer;
          font-size: 0.875rem;
          text-align: left;
          transition: all 0.2s;
          color: var(--text-primary);
        }

        .quick-question:hover {
          background: var(--primary-color);
          color: white;
          border-color: var(--primary-color);
        }

        .chat-input {
          padding: 1rem;
          border-top: 1px solid #e5e7eb;
          background: white;
        }

        .input-container {
          display: flex;
          gap: 0.75rem;
          align-items: flex-end;
        }

        .message-input {
          flex: 1;
          border: 1px solid #e5e7eb;
          border-radius: 1rem;
          padding: 0.75rem 1rem;
          resize: none;
          font-family: inherit;
          font-size: 0.875rem;
          max-height: 100px;
          min-height: 40px;
        }

        .message-input:focus {
          outline: none;
          border-color: var(--primary-color);
        }

        .send-button {
          background: var(--primary-color);
          color: white;
          border: none;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
        }

        .send-button:hover:not(:disabled) {
          background: var(--primary-dark);
          transform: scale(1.05);
        }

        .send-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        @media (max-width: 768px) {
          .chat-window {
            width: calc(100vw - 2rem);
            height: calc(100vh - 4rem);
            bottom: 1rem;
            right: 1rem;
            left: 1rem;
          }

          .chat-toggle {
            bottom: 1rem;
            right: 1rem;
          }

          .chat-notification {
            display: none;
          }
        }
      `}</style>
    </>
  );
}

export default AIChatbot;
