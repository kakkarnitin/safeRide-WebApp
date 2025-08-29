namespace SafeRide.Api.DTOs.Auth
{
    public class ParentDto
    {
        public Guid Id { get; set; }
        public string FullName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string PhoneNumber { get; set; } = string.Empty;
        public string DrivingLicenseNumber { get; set; } = string.Empty;
        public string WorkingWithChildrenCardNumber { get; set; } = string.Empty;
        public int CreditPoints { get; set; }
        public bool IsVerified { get; set; }
    }
}
