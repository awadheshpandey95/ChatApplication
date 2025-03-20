import React, { useState, useEffect, useCallback } from "react";
import { HubConnectionBuilder } from "@microsoft/signalr";

// Custom hook for SignalR connection
const useSignalR = (url) => {
    const [connection, setConnection] = useState(null);

    useEffect(() => {
        const connect = new HubConnectionBuilder()
            .withUrl(url)
            .withAutomaticReconnect()
            .build();

        connect
            .start()
            .then(() => setConnection(connect))
            .catch((err) => console.error("Connection failed: ", err));

        return () => {
            connect.stop();
        };
    }, [url]);

    return connection;
};

const Chat = () => {
    const connection = useSignalR("https://localhost:7002/ChatHub");
    const [messages, setMessages] = useState([]);
    const [user, setUser] = useState("");
    const [message, setMessage] = useState("");

    useEffect(() => {
        if (connection) {
            const receiveMessage = (user, message) => {
                setMessages((prevMessages) => [...prevMessages, { user, message }]);
            };

            connection.on("ReceiveMessage", receiveMessage);

            return () => {
                connection.off("ReceiveMessage", receiveMessage);
            };
        }
    }, [connection]);

    const sendMessage = useCallback(async () => {
        if (connection && user.trim() && message.trim()) {
            try {
                await connection.send("SendMessage", user, message);
                setMessage("");
            } catch (err) {
                console.error("Error sending message: ", err);
            }
        }
    }, [connection, user, message]);

    return (
        <div style={{ maxWidth: "400px", margin: "0 auto", textAlign: "center" }}>
            <h2>Chat</h2>
            <div style={{ marginBottom: "10px" }}>
                <input
                    type="text"
                    placeholder="Name"
                    value={user}
                    onChange={(e) => setUser(e.target.value)}
                    style={{ width: "100%", marginBottom: "5px", padding: "8px" }}
                />
                <input
                    type="text"
                    placeholder="Message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    style={{ width: "100%", marginBottom: "5px", padding: "8px" }}
                />
                <button onClick={sendMessage} style={{ padding: "10px 20px" }}>
                    Send
                </button>
            </div>
            <div
                style={{
                    border: "1px solid #ccc",
                    padding: "10px",
                    height: "300px",
                    overflowY: "auto",
                    textAlign: "left",
                }}
            >
                {messages.map((msg, index) => (
                    <div key={index}>
                        <strong>{msg.user}:</strong> {msg.message}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Chat;
