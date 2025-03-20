using System.ComponentModel.DataAnnotations;

namespace ChatApplication.Server.Models.Entities
{
    public class UserInfo
    {
        [Key]
        public Guid Id { get; set; }

        [Required(ErrorMessage = "Username is required.")]
        [MaxLength(50, ErrorMessage = "Username length cannot exceed 50 characters.")]
        public string UserName { get; set; } = string.Empty;

        [Required(ErrorMessage = "Email is required.")]
        [EmailAddress(ErrorMessage = "Invalid email address format.")]
        public string Email { get; set; } = string.Empty;

        [Required(ErrorMessage = "Password is required.")]
        [MaxLength(50, ErrorMessage = "Password length cannot exceed 50 characters.")]
        public string Password { get; set; } = string.Empty;

        [MaxLength(10, ErrorMessage = "Phone number length cannot exceed 10 digits.")]
        public string? PhoneNumber { get; set; }

        [MaxLength(250, ErrorMessage = "Profile picture URL length cannot exceed 250 characters.")]
        public string? ProfilePictureUrl { get; set; }

        [DataType(DataType.Date)]
        public DateTime? DateOfBirth { get; set; }

        [MaxLength(150, ErrorMessage = "Status message length cannot exceed 150 characters.")]
        public string? StatusMessage { get; set; }

        [MaxLength(250, ErrorMessage = "Address length cannot exceed 250 characters.")]
        public string? Address { get; set; }

        [MaxLength(50, ErrorMessage = "Country length cannot exceed 50 characters.")]
        public string? Country { get; set; }

        [MaxLength(50, ErrorMessage = "State length cannot exceed 50 characters.")]
        public string? State { get; set; }

        [MaxLength(50, ErrorMessage = "City length cannot exceed 50 characters.")]
        public string? City { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        [MaxLength(50, ErrorMessage = "Gender length cannot exceed 50 characters.")]
        public string Gender { get; set; }
    }
}

