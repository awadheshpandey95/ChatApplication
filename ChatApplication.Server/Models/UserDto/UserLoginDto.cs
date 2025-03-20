using System.ComponentModel.DataAnnotations;

namespace ChatApplication.Server.Models.UserDto
{
    public class UserLoginDto
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        [Required]
        [MaxLength(50)]
        public string Password { get; set; } = string.Empty;
    }

}
