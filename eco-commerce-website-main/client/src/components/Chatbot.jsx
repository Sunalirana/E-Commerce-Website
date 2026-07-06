import React, { useState } from 'react';

function Chatbot() {
  const [messages, setMessages] = useState([{ from: 'bot', text: 'Hi! How can I help you?' }]);
  const [input, setInput] = useState('');

  function sendMessage() {
    setMessages([...messages, { from: 'user', text: input }]);
    // Basic sample reply logic
    if (input.toLowerCase().includes('return')) {
      setMessages(msgs => [...msgs, { from: 'bot', text: "You can return products within 30 days." }]);
    } else {
      setMessages(msgs => [...msgs, { from: 'bot', text: "I'm here to help! Please ask another question." }]);
    }
    setInput('');
  }

  return (
    <div className="chatbot">
      <div className="messages">
        {messages.map((msg, idx) => (
          <div key={idx} className={msg.from}>{msg.text}</div>
        ))}
      </div>
      <input value={input} onChange={e => setInput(e.target.value)} placeholder="Ask something..." />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}
export default Chatbot;
