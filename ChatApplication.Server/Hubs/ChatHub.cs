using Microsoft.AspNetCore.SignalR;

namespace ChatApplication.Server.Hubs
{
    public class ChatHub : Hub
    {
        // Send message to a specific user
        public async Task SendMessageToUser(string receiverId, string message)
        {
            var senderId = Context.UserIdentifier;
            await Clients.User(receiverId).SendAsync("ReceiveMessage", senderId, message);
        }

        // Send message to a group
        public async Task SendMessageToGroup(string groupName, string message)
        {
            var senderId = Context.UserIdentifier;
            await Clients.Group(groupName).SendAsync("ReceiveGroupMessage", senderId, message);
        }

        // Join a group
        public async Task JoinGroup(string groupName)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, groupName);
        }

        // Leave a group
        public async Task LeaveGroup(string groupName)
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, groupName);
        }

        public override async Task OnConnectedAsync()
        {
            await Clients.User(Context.UserIdentifier).SendAsync("UserConnected", Context.UserIdentifier);
            await base.OnConnectedAsync();
        }

        public override async Task OnDisconnectedAsync(Exception exception)
        {
            await Clients.User(Context.UserIdentifier).SendAsync("UserDisconnected", Context.UserIdentifier);
            await base.OnDisconnectedAsync(exception);
        }
    }
}