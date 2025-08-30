using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Identity.Web;
using System.Security.Claims;
using SafeRide.Api.DTOs.Auth;
using SafeRide.Core.Interfaces;
using SafeRide.Core.Entities;
using System.Threading.Tasks;

namespace SafeRide.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IVerificationService _verificationService;
        private readonly IUserService _userService;

        public AuthController(IVerificationService verificationService, IUserService userService)
        {
            _verificationService = verificationService;
            _userService = userService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDto registerDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var parent = new Parent
            {
                FullName = registerDto.Name,
                Email = registerDto.Email,
                PhoneNumber = registerDto.PhoneNumber,
                DrivingLicenseNumber = registerDto.DrivingLicense,
                WorkingWithChildrenCardNumber = registerDto.WorkingWithChildrenCard
            };

            var result = await _userService.RegisterAsync(parent);
            if (!result.Success)
                return BadRequest(result.Errors);

            return Ok(new { Message = "Registration successful. Please verify your documents." });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto loginDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var result = await _userService.LoginAsync(loginDto.Email, loginDto.Password);
            if (!result.Success)
                return Unauthorized(result.Errors);

            return Ok(new { 
                Token = result.Token,
                User = new {
                    Id = result.User.Id.ToString(),
                    Email = result.User.Email,
                    Name = result.User.FullName,
                    IsVerified = result.User.IsVerified
                }
            });
        }

        [HttpGet("verify/{email}")]
        public async Task<IActionResult> VerifyEmail(string email)
        {
            var result = await _verificationService.VerifyEmailAsync(email);
            if (!result.Success)
                return NotFound(result.Errors);

            return Ok(new { Message = "Email verified successfully." });
        }

        [HttpPost("microsoft")]
        [Authorize]
        public async Task<IActionResult> MicrosoftAuth()
        {
            try
            {
                // Get user information from Microsoft token claims
                var email = User.FindFirst(ClaimTypes.Email)?.Value 
                    ?? User.FindFirst("preferred_username")?.Value
                    ?? User.FindFirst("upn")?.Value;
                
                var name = User.FindFirst(ClaimTypes.Name)?.Value 
                    ?? User.FindFirst("name")?.Value
                    ?? "Microsoft User"; // Default name if not provided
                
                var objectId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value 
                    ?? User.FindFirst("sub")?.Value
                    ?? User.FindFirst("oid")?.Value;

                if (string.IsNullOrEmpty(email) || string.IsNullOrEmpty(objectId))
                {
                    return BadRequest(new { Message = "Invalid Microsoft token - missing email or user ID" });
                }

                // Check if user exists or create new one
                var result = await _userService.AuthenticateOrCreateMicrosoftUserAsync(email, name, objectId);
                
                if (!result.Success)
                    return BadRequest(result.Errors);

                return Ok(new { 
                    Token = result.Token,
                    User = new {
                        Id = result.User.Id.ToString(),
                        Email = result.User.Email,
                        Name = result.User.FullName,
                        IsVerified = result.User.IsVerified,
                        Provider = "Microsoft"
                    }
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "Authentication failed", Error = ex.Message });
            }
        }

        [HttpGet("profile")]
        [Authorize]
        public async Task<IActionResult> GetProfile()
        {
            try
            {
                var email = User.FindFirst(ClaimTypes.Email)?.Value 
                    ?? User.FindFirst("preferred_username")?.Value
                    ?? User.FindFirst("upn")?.Value;

                if (string.IsNullOrEmpty(email))
                {
                    return BadRequest(new { Message = "Invalid token - missing email" });
                }

                var user = await _userService.GetByEmailAsync(email);
                if (user == null)
                {
                    return NotFound(new { Message = "User not found" });
                }

                return Ok(new {
                    Id = user.Id.ToString(),
                    Email = user.Email,
                    Name = user.FullName,
                    PhoneNumber = user.PhoneNumber,
                    IsVerified = user.IsVerified,
                    CreditPoints = user.CreditPoints,
                    VerificationStatus = user.VerificationStatus.ToString()
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "Failed to get profile", Error = ex.Message });
            }
        }
    }
}