using System;

namespace SafeRide.Core.Entities
{
    public class VerificationDocument
    {
        public Guid Id { get; set; }
        public Guid ParentId { get; set; }
        public string DocumentType { get; set; } = string.Empty; // e.g., "Driving License", "Working with Children Card"
        public string DocumentUrl { get; set; } = string.Empty; // URL to the uploaded document
        public DateTime UploadedDate { get; set; }
        public VerificationStatus Status { get; set; } // Enum for verification status
    }
}