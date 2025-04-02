using ChatApplication.Server.DataAccessLayer;
using ChatApplication.Server.Helpers;
using ChatApplication.Server.Models.UserDto;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace ChatApplication.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AccountController : ControllerBase
    {
        private readonly UserManager<IdentityUser> _userManager;
        private readonly ApplicationDbContext _dbContext;
        private readonly TokenService _tokenService;
        private readonly EmailService _emailService;

        public AccountController(UserManager<IdentityUser> userManager,ApplicationDbContext dbContext,TokenService tokenService,EmailService emailService)
        {
            _userManager = userManager;
            _dbContext = dbContext;
            _tokenService = tokenService;
            _emailService = emailService;
        }

        [HttpPost("Signup")]
        public async Task<IActionResult> Signup(UserSignupDto uData)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(new { message = "Invalid data.", errors = ModelState });
                }

                // Check if the user already exists
                var existingUser = await _userManager.FindByEmailAsync(uData.Email);
                if (existingUser != null)
                {
                    return BadRequest(new { message = "User already registered with the same email address." });
                }

                var newUser = new ApplicationUser
                {
                    UserName = uData.UserName,
                    Email = uData.Email,
                    PhoneNumber = uData.PhoneNumber,
                    ProfilePicture = uData.ProfilePicture,
                    DateOfBirth = uData.DateOfBirth,
                    StatusMessage = uData.StatusMessage,
                    Address = uData.Address,
                    Country = uData.Country,
                    State = uData.State,
                    City = uData.City,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };

                // Create a new Identity user
                var newIdentityUser = new IdentityUser
                {
                    UserName = uData.Email,
                    Email = uData.Email,
                    PhoneNumber = uData.PhoneNumber,
                };

                // Save user to Identity and hash the password
                var result = await _userManager.CreateAsync(newIdentityUser, uData.Password);

                if (!result.Succeeded)
                {
                    return BadRequest(new
                    {
                        message = "User creation failed.",
                        errors = result.Errors.Select(e => e.Description)
                    });
                }

                // Save additional details into your custom ApplicationUser table
                _dbContext.ApplicationUser.Add(newUser);
                await _dbContext.SaveChangesAsync();

                return Ok(new { message = "User registered successfully." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An unexpected error occurred.", error = ex.Message });
            }
        }

        [HttpPost("VerifyOTP")]
        public async Task<IActionResult> VerifyOTP(VerifyOtpDto otpData)
        {
            try
            {
                var otpRecord = await _dbContext.UserOTP
                    .Where(o => o.Email == otpData.Email && o.OTP == otpData.OTP && o.ExpiryTime > DateTime.UtcNow)
                    .FirstOrDefaultAsync();

                if (otpRecord == null)
                {
                    return BadRequest(new { message = "Invalid or expired OTP." });
                }

                // OTP is valid, generate token
                var token = _tokenService.GenerateToken(otpData.Email);

                // Remove OTP after successful verification
                _dbContext.UserOTP.Remove(otpRecord);
                await _dbContext.SaveChangesAsync();

                return Ok(new { Token = token, message = "Verification successful." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An unexpected error occurred.", error = ex.Message });
            }
        }

        [HttpPost("Login")]
        public async Task<IActionResult> Login(UserLoginDto loginData)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(new { message = "Invalid input data.", errors = ModelState });
                }

                var user = await _userManager.FindByEmailAsync(loginData.Email);

                if (user == null)
                {
                    return Unauthorized(new { message = "Invalid credentials." });
                }

                var isPasswordValid = await _userManager.CheckPasswordAsync(user, loginData.Password);

                if (!isPasswordValid)
                {
                    return Unauthorized(new { message = "Invalid credentials." });
                }

                // Generate OTP
                string otp = _emailService.GenerateOTP();

                // Store OTP in the database temporarily
                var otpRecord = new UserOTP
                {
                    Email = loginData.Email,
                    OTP = otp,
                    ExpiryTime = DateTime.UtcNow.AddMinutes(5) // OTP expires in 5 minutes
                };

                await _emailService.SendEmailAsync(loginData.Email, "Your OTP Code", $"Your OTP code is: {otp}");

                // Save User OTP details into UserOTP table
                _dbContext.UserOTP.Add(otpRecord);
                await _dbContext.SaveChangesAsync();

                return Ok(new { message = "OTP sent to email. Please verify.", user });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error: {ex.Message}");
                return StatusCode(500, new { message = "An unexpected error occurred. Please try again later." });
            }
        }

        [HttpGet("GetAllUsers")]
        public async Task<IActionResult> GetAllUsers()
        {
            var users = await _userManager.Users
                .Select(u => new
                {
                    u.Id,
                    u.UserName,
                    u.Email
                })
                .ToListAsync();

            return Ok(users);
        }

        [HttpGet("GetUserById")]
        public IActionResult GetUserById(string Id)
        {
            var user =  _dbContext.ApplicationUser.Find(Guid.Parse(Id));

            return Ok(user);
        }


        [HttpPut("UpdateUser")]
        public async Task<IActionResult> UpdateUser(string Id, UserUpdateDto uData)
        {
            var user = await _userManager.FindByIdAsync(Id);
            if (user == null)
            {
                return NotFound("User not found.");
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Update only provided fields
            if (!string.IsNullOrWhiteSpace(uData.UserName))
                user.UserName = uData.UserName;

            if (!string.IsNullOrWhiteSpace(uData.PhoneNumber))
                user.PhoneNumber = uData.PhoneNumber;

            //if (!string.IsNullOrWhiteSpace(uData.ProfilePicture))
            //    user.ProfilePicture = uData.ProfilePicture;

            //if (uData.DateOfBirth.HasValue)
            //    user.DateOfBirth = uData.DateOfBirth;

            //if (!string.IsNullOrWhiteSpace(uData.StatusMessage))
            //    user.StatusMessage = uData.StatusMessage;

            //if (!string.IsNullOrWhiteSpace(uData.Address))
            //    user.Address = uData.Address;

            //if (!string.IsNullOrWhiteSpace(uData.Country))
            //    user.Country = uData.Country;

            //if (!string.IsNullOrWhiteSpace(uData.State))
            //    user.State = uData.State;

            //if (!string.IsNullOrWhiteSpace(uData.City))
            //    user.City = uData.City;

            //user.UpdatedAt = DateTime.UtcNow;

            var result = await _userManager.UpdateAsync(user);
            if (!result.Succeeded)
            {
                return BadRequest(result.Errors);
            }

            return Ok("User updated successfully.");
        }
    }
}