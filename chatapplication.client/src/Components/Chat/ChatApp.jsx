import React, { useState, useEffect, useCallback } from "react";
import { FiMoreVertical, FiSearch, FiPaperclip, FiMic } from 'react-icons/fi';
import { IoMdSend } from 'react-icons/io';
import * as signalR from "@microsoft/signalr";
import axios from "axios";
import './ChatApp.css';

const ChatApp = () => {
    const [currentUserEmail, setCurrentUserEmail] = useState("");
    const [connection, setConnection] = useState(null);
    const [users, setUsers] = useState([]);
    const [activeChat, setActiveChat] = useState(null);
    const [chatMessages, setChatMessages] = useState([]);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Fetch all users with error handling
    const fetchAllUsers = useCallback(async () => {
        debugger
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get('https://localhost:7002/api/Account/GetAllUsers', {
                headers: { 
                    'Content-Type': 'application/json'
                }
            });
            if (response.status === 200) {
                setUsers(response.data);
            }
        } catch (error) {
            console.error('Error fetching users:', error);
            setError("Failed to load users. Please try again.");
        } finally {
            setLoading(false);
        }
    }, []);

    // Fetch messages for a specific user
    const fetchMessages = useCallback(async (receiverId) => {
        debugger
        if (!receiverId) return;
        
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(`https://localhost:7002/api/Chat/GetMessages/${receiverId}`);
            setChatMessages(response.data);
        } catch (error) {
            console.error("Error fetching messages:", error);
            setError("Failed to load messages. Please try again.");
        } finally {
            setLoading(false);
        }
    }, []);

    // Send message function
    const sendMessage = useCallback(async (receiverId, messageContent) => {
        debugger
        if (!connection || !receiverId || !messageContent.trim()) return;

        try {
            await connection.invoke("SendMessageToUser", receiverId, messageContent);
            
            // Optimistically update UI
            const newMessage = {
                sender: currentUserEmail,
                receiver: receiverId,
                message: messageContent,
                timestamp: new Date().toISOString()
            };
            
            setChatMessages(prev => [...prev, newMessage]);
            setMessage("");
        } catch (err) {
            console.error("Error sending message:", err);
            setError("Failed to send message. Please try again.");
        }
    }, [connection, currentUserEmail]);

    // Handle send message action
    const handleSendMessage = useCallback(() => {
        debugger
        if (message.trim() && activeChat) {
            sendMessage(activeChat, message);
        }
    }, [message, activeChat, sendMessage]);

    // Initialize SignalR connection
    useEffect(() => {
        const email = sessionStorage.getItem("EmailId");
        if (email) {
            setCurrentUserEmail(email);
        }

        const newConnection = new signalR.HubConnectionBuilder()
            .withUrl("https://localhost:7002/chatHub")
            .withAutomaticReconnect()
            .configureLogging(signalR.LogLevel.Information)
            .build();

        setConnection(newConnection);

        newConnection.start()
            .then(() => {
                console.log("SignalR Connected");
                
                // Set up message receiver
                newConnection.on("ReceiveMessage", (sender, message) => {
                    if (sender === activeChat) {
                        setChatMessages(prev => [...prev, {
                            sender,
                            message,
                            timestamp: new Date().toISOString()
                        }]);
                    }
                });
            })
            .catch(err => {
                console.error("SignalR Connection Error:", err);
                setError("Connection error. Please refresh the page.");
            });

        fetchAllUsers();

        return () => {
            if (newConnection) {
                newConnection.stop();
            }
        };
    }, [fetchAllUsers]);

    // Fetch messages when active chat changes
    useEffect(() => {
        if (activeChat) {
            fetchMessages(activeChat);
        }
    }, [activeChat, fetchMessages]);

    // Get active user's name
    const getActiveUserName = () => {
        const user = users.find(u => u.id === activeChat);
        return user ? user.userName : 'Unknown User';
    };

    return (
        <div className="chat-app">
            <div className="chat-sidebar">
                <div className="sidebar-header">
                    <div className="current-user">
                        <div>{currentUserEmail || "Loading..."}</div>
                    </div>
                    <div className="sidebar-actions">
                        <FiMoreVertical className="icon" />
                    </div>
                </div>

                <div className="search-container">
                    <div className="search-box">
                        <FiSearch className="search-icon" />
                        <input 
                            type="text" 
                            placeholder="Search or start new chat" 
                            disabled={loading}
                        />
                    </div>
                </div>

                {error && <div className="error-message">{error}</div>}

                <div className="chat-list">
                    {loading ? (
                        <div className="loading">Loading users...</div>
                    ) : (
                        users.map(user => (
                            <div
                                key={user.id}
                                className={`chat-item ${activeChat === user.id ? 'active' : ''}`}
                                onClick={() => setActiveChat(user.id)}
                            >
                                <div className="user-avatar">
                                    <img 
                                        src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.userName)}&background=random`} 
                                        alt={user.userName}
                                    />
                                </div>
                                <div className="chat-info">
                                    <div className="chat-name">{user.userName}</div>
                                    <div className="chat-email">{user.email}</div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            <div className="chat-main">
                {activeChat ? (
                    <>
                        <div className="chat-header">
                            <div className="chat-user">
                                <div className="user-avatar">
                                    <img 
                                        src={`https://ui-avatars.com/api/?name=${encodeURIComponent(getActiveUserName())}&background=random`} 
                                        alt={getActiveUserName()}
                                    />
                                </div>
                                <div className="user-info">
                                    <div className="user-name">
                                        {getActiveUserName()}
                                    </div>
                                    <div className="user-status">
                                        {connection && connection.connectionId ? "online" : "offline"}
                                    </div>
                                </div>
                            </div>
                            <div className="chat-actions">
                                <FiSearch className="icon" />
                                <FiMoreVertical className="icon" />
                            </div>
                        </div>
                        
                        <div className="messages-container">
                            {loading ? (
                                <div className="loading">Loading messages...</div>
                            ) : chatMessages.length > 0 ? (
                                chatMessages.map((msg, index) => (
                                    <div 
                                        key={`${msg.timestamp || index}`} 
                                        className={`message ${msg.sender === currentUserEmail ? 'sent' : 'received'}`}
                                    >
                                        <div className="message-content">
                                            <div className="message-text">{msg.message}</div>
                                            <div className="message-time">
                                                {msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString() : ''}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="no-messages-yet">No messages yet. Start the conversation!</p>
                            )}
                        </div>

                        <div className="message-input">
                            <div className="input-actions">
                                <FiPaperclip className="icon" />
                            </div>
                            <input
                                type="text"
                                placeholder="Type a message"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                disabled={!connection || loading}
                            />
                            <div className="send-actions">
                                {message ? (
                                    <IoMdSend 
                                        className="icon send" 
                                        onClick={handleSendMessage}
                                        disabled={!connection || loading}
                                    />
                                ) : (
                                    <FiMic className="icon" />
                                )}
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="no-chat-selected">
                        <p>Select a user to start chatting</p>
                        {!connection && (
                            <p className="connection-warning">Connecting to chat server...</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ChatApp;