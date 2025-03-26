using ChatApplication.Server.DataAccessLayer;
using ChatApplication.Server.Models.ChatDto;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Concurrent;

namespace ChatApplication.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ChatController : ControllerBase
    {
        private readonly ApplicationDbContext _chatcontext;

        public ChatController(ApplicationDbContext dbContext)
        {
            _chatcontext = dbContext;
        }

        [HttpPost("SendMessage")]
        public IActionResult SendMessage([FromBody] ChatMessage message)
        {
            message.Timestamp = DateTime.UtcNow;
            _chatcontext.ChatMessage.Add(message);
            _chatcontext.SaveChanges();

            return Ok("Message sent successfully");
        }

        [HttpGet("GetMessages")]
        public IActionResult GetMessages()
        {
            var messages = _chatcontext.ChatMessage.OrderBy(m => m.Timestamp).ToList();
            return Ok(messages);
        }
    }
}
