using System.ComponentModel.DataAnnotations;

namespace ChatApplication.Server.Models.UserDto
{
    public class UserOTP
    {
        [Key]
        public int Id { get; set; }
        public string Email { get; set; }
        public string OTP { get; set; }
        public DateTime ExpiryTime { get; set; }
    }
}
