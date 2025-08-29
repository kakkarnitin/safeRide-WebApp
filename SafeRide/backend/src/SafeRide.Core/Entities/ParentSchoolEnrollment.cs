using System;

namespace SafeRide.Core.Entities
{
    public class ParentSchoolEnrollment
    {
        public Guid Id { get; set; }
        public Guid ParentId { get; set; }
        public Parent? Parent { get; set; }
        public int SchoolId { get; set; }
        public School? School { get; set; }
        public EnrollmentStatus Status { get; set; } = EnrollmentStatus.Pending;
        public DateTime RequestDate { get; set; } = DateTime.UtcNow;
        public DateTime? ApprovalDate { get; set; }
        public string? ApprovedBy { get; set; } // Admin who approved
        public string? RejectionReason { get; set; }
        public string? ParentNotes { get; set; } // Parent's enrollment request notes
        public string? AdminNotes { get; set; } // Admin's notes on the enrollment
    }

    public enum EnrollmentStatus
    {
        Pending = 0,
        Approved = 1,
        Rejected = 2,
        Suspended = 3
    }
}
