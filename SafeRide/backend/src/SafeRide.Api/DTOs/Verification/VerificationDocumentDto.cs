namespace SafeRide.Api.DTOs.Verification
{
    public class VerificationDocumentDto
    {
        public Guid Id { get; set; }
        public Guid ParentId { get; set; }
        public string DocumentType { get; set; } = string.Empty;
        public string DocumentUrl { get; set; } = string.Empty;
        public DateTime UploadedDate { get; set; }
        public string Status { get; set; } = "Pending";
    }
}
