// app/page.js
"use client";
import { useState, useRef, useEffect } from 'react';

export default function Home() {
    const [messages, setMessages] = useState([
        { role: 'assistant', content: 'Hello! I\'m NexBot, How can I assist you today?' }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    // Auto-scroll to bottom of messages
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Focus input on load
    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;
        const userMessage = { role: 'user', content: input };
        setMessages(prev => [...prev, userMessage]);
        setIsLoading(true);
        try {
            const response = await fetch('http://localhost:8000/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(
                    {
                        "messages": [
                          { "role": "user", "content": input}
                        ]
                      }
                )
            });
            const data = await response.json();
            console.log(data);
            const responseMessage = { role: 'assistant', content: data.reply };
            setMessages(prev => [...prev, responseMessage]);
        }
        catch (error) {
            console.error('Error:', error);
        }
        setInput('');
        setIsLoading(false);
    };

    return (
        <main className="flex h-[93svh] flex-col bg-gray-50">

            <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8">
                <div className="container mx-auto max-w-4xl">
                    <div className="space-y-6">
                        {messages.map((message, index) => (
                            <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-3xl rounded-lg p-4 ${message.role === 'user'
                                        ? 'bg-blue-100 text-gray-900'
                                        : 'bg-white border border-gray-200 text-gray-800'
                                    }`}>
                                    <div className="whitespace-pre-wrap">{message.content}</div>
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="max-w-3xl rounded-lg bg-white p-4 border border-gray-200">
                                    <div className="flex space-x-2">
                                        <div className="h-2 w-2 rounded-full bg-gray-400 animate-pulse"></div>
                                        <div className="h-2 w-2 rounded-full bg-gray-400 animate-pulse delay-100"></div>
                                        <div className="h-2 w-2 rounded-full bg-gray-400 animate-pulse delay-200"></div>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                </div>
            </div>

            <footer className="border-t border-gray-200 bg-white p-4">
                <div className="container mx-auto max-w-4xl">
                    <form onSubmit={handleSubmit} className="flex items-center gap-2">
                        <input
                            ref={inputRef}
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Message Claude..."
                            className="flex-1 rounded-lg border border-gray-300 p-3 focus:border-blue-500 focus:outline-none"
                            disabled={isLoading}
                        />
                        <button
                            type="submit"
                            disabled={!input.trim() || isLoading}
                            className="rounded-lg bg-blue-600 px-4 py-3 font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                        >
                            Send
                        </button>
                    </form>
                </div>
            </footer>
        </main>
    );
}