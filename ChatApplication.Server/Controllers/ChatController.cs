using Microsoft.AspNetCore.Mvc;
using System.Collections.Concurrent;

namespace ChatApplication.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ChatController : ControllerBase
    {
        private static readonly ConcurrentBag<string> messages = new();

        [HttpGet]
        public ActionResult<IEnumerable<string>> GetMessages()
        {
            return Ok(messages);
        }

        [HttpPost]
        public ActionResult SendMessage([FromBody] string message)
        {
            if (string.IsNullOrWhiteSpace(message))
            {
                return BadRequest("Message cannot be empty.");
            }

            messages.Add(message);
            return Ok();
        }
    }
}
