using ChatApplication.Server.DataAccessLayer;
using ChatApplication.Server.Models.ChatDto;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Concurrent;

namespace ChatApplication.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ChatController : ControllerBase
    {
        private readonly ApplicationDbContext _chatcontext;
        private readonly UserManager<IdentityUser> _userManager;

        public ChatController(ApplicationDbContext context, UserManager<IdentityUser> userManager)
        {
            _chatcontext = context;
            _userManager = userManager;
        }

        [HttpPost("SendMessage")]
        public IActionResult SendMessage([FromBody] ChatMessage message)
        {
            message.Timestamp = DateTime.UtcNow;
            _chatcontext.ChatMessage.Add(message);
            _chatcontext.SaveChanges();

            return Ok("Message sent successfully");
        }

        [HttpGet("GetMessages/{receiverId}")]
        public async Task<IActionResult> GetMessages(string receiverId)
        {
            var messages = await _chatcontext.ChatMessage
                .Where(m => m.SenderId == receiverId || m.ReceiverId == receiverId)
                .OrderBy(m => m.Timestamp)
                .Select(m => new
                {
                    m.SenderId,
                    m.ReceiverId,
                    m.Content,
                    m.Timestamp,
                    m.IsRead
                })
                .ToListAsync();

            return Ok(messages);
        }

        [HttpPost("MarkAsRead/{messageId}")]
        public async Task<IActionResult> MarkAsRead(int messageId)
        {
            var message = await _chatcontext.ChatMessage.FindAsync(messageId);
            if (message == null) return NotFound();

            message.IsRead = true;
            await _chatcontext.SaveChangesAsync();

            return Ok();
        }
    }
}
