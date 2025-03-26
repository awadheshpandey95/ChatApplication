namespace ChatApplication.Server.Models.ChatDto
{
    public class ChatMessage
    {
        public int Id { get; set; }
        public string Sender { get; set; }
        public string Receiver { get; set; } // For personal chat
        public string GroupName { get; set; } // For group chat
        public string Message { get; set; }
        public DateTime Timestamp { get; set; } = DateTime.UtcNow;
    }
}
