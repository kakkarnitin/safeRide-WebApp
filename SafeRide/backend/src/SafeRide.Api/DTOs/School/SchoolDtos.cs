using System.ComponentModel.DataAnnotations;

namespace SafeRide.Api.DTOs.School
{
    public class SchoolEnrollmentRequestDto
    {
        [Required]
        public int SchoolId { get; set; }
        
        [MaxLength(500)]
        public string? ParentNotes { get; set; }
    }

    public class SchoolEnrollmentResponseDto
    {
        public required string Id { get; set; }
        public int SchoolId { get; set; }
        public required string SchoolName { get; set; }
        public required string Status { get; set; }
        public DateTime RequestDate { get; set; }
        public DateTime? ApprovalDate { get; set; }
        public string? RejectionReason { get; set; }
        public string? ParentNotes { get; set; }
    }

    public class SchoolDto
    {
        public int Id { get; set; }
        public required string Name { get; set; }
        public required string Address { get; set; }
        public bool IsActive { get; set; }
        public string? ContactEmail { get; set; }
        public string? ContactPhone { get; set; }
    }

    public class EnrollmentApprovalDto
    {
        [Required]
        public required string EnrollmentId { get; set; }
        
        [Required]
        public bool Approve { get; set; }
        
        [MaxLength(500)]
        public string? AdminNotes { get; set; }
        
        [MaxLength(500)]
        public string? RejectionReason { get; set; }
    }

    public class CreateSchoolDto
    {
        [Required]
        [MaxLength(100)]
        public required string Name { get; set; }
        
        [Required]
        [MaxLength(200)]
        public required string Address { get; set; }
        
        [EmailAddress]
        [MaxLength(100)]
        public string? ContactEmail { get; set; }
        
        [Phone]
        [MaxLength(20)]
        public string? ContactPhone { get; set; }
    }
}
