using System.ComponentModel.DataAnnotations;

namespace ChatApplication.Server.Models.UserDto
{
    public class UserUpdateDto
    {
        [MaxLength(250)]
        public string? UserName { get; set; } = string.Empty;

        [MaxLength(10)]
        public string? PhoneNumber { get; set; }

        [MaxLength(50)]
        public string? Gender { get; set; }

        [MaxLength(500)]
        public string? ProfilePicture { get; set; }

        [DataType(DataType.Date)]
        public DateTime? DateOfBirth { get; set; }

        [MaxLength(250)]
        public string? StatusMessage { get; set; }

        [MaxLength(250)]
        public string? Address { get; set; }

        [MaxLength(50)]
        public string? Country { get; set; }

        [MaxLength(50)]
        public string? State { get; set; }

        [MaxLength(50)]
        public string? City { get; set; }

        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }
}
