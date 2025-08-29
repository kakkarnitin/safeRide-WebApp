using Microsoft.AspNetCore.Mvc;
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
    }
}