import React from "react";

const MessageList = ({ messages }) => {
    return (
        <div>
            {messages.map((msg, index) => (
                <p key={index}>
                    <strong>{msg.sender}:</strong> {msg.message}
                </p>
            ))}
        </div>
    );
};

export default MessageList;

