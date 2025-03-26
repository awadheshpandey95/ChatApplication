import React, { useState } from "react";
import MessageInput from "./MessageInput";
import MessageList from "./MessageList";

const ChatRoom = ({ messages, onSendMessage }) => {
    const [receiver, setReceiver] = useState("");

    const handleSendMessage = (message) => {
        onSendMessage(receiver, message);
    };

    return (
        <div>
            <input
                type="text"
                placeholder="Receiver ID"
                value={receiver}
                onChange={(e) => setReceiver(e.target.value)}
            />
            <MessageList messages={messages} />
            <MessageInput onSendMessage={handleSendMessage} />
        </div>
    );
};

export default ChatRoom;
