import React, { useState, useEffect } from "react";
import * as signalR from "@microsoft/signalr";
import axios from "axios";
import ChatRoom from "./ChatRoom";

const ChatApp = () => {
    const [connection, setConnection] = useState(null);
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        // Establish SignalR connection
        const newConnection = new signalR.HubConnectionBuilder()
            .withUrl("https://localhost:7002/chatHub") // Backend URL
            .withAutomaticReconnect()
            .build();

        setConnection(newConnection);

        newConnection.start()
            .then(() => {
                console.log("SignalR Connected");
                newConnection.on("ReceiveMessage", (sender, message) => {
                    setMessages((prevMessages) => [...prevMessages, { sender, message }]);
                });
            })
            .catch((err) => console.error("SignalR Connection Error: ", err));
    }, []);

    const sendMessage = (receiver, message) => {
        connection.invoke("SendMessageToUser", receiver, message)
            .catch((err) => console.error(err.toString()));
    };

    const fetchMessages = async () => {
        const response = await axios.get("https://localhost:7002/api/Chat/GetMessages");
        setMessages(response.data);
    };

    return (
        <div>
            <button onClick={fetchMessages}>Load Messages</button>
            <ChatRoom messages={messages} onSendMessage={sendMessage} />
        </div>
    );
};

export default ChatApp;
