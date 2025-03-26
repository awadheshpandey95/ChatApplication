using Microsoft.AspNetCore.SignalR;

namespace ChatApplication.Server.Hubs
{
    public class ChatHub : Hub
    {
        // Send message to a specific user
        public async Task SendMessageToUser(string userId, string message)
        {
            await Clients.User(userId).SendAsync("ReceiveMessage", Context.User.Identity.Name, message);
        }

        // Send message to a group
        public async Task SendMessageToGroup(string groupName, string message)
        {
            await Clients.Group(groupName).SendAsync("ReceiveGroupMessage", Context.User.Identity.Name, message);
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
    }
}