using System.ComponentModel.DataAnnotations;

namespace SafeRide.Api.DTOs.Auth
{
    public class RegisterDto
    {
        [Required]
        public string Name { get; set; } = string.Empty;
        
        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;
        
        [Required]
        public string Password { get; set; } = string.Empty;
        
        [Required]
        public string DrivingLicense { get; set; } = string.Empty;
        
        [Required]
        public string WorkingWithChildrenCard { get; set; } = string.Empty;
        
        [Required]
        public string PhoneNumber { get; set; } = string.Empty;
    }
}
