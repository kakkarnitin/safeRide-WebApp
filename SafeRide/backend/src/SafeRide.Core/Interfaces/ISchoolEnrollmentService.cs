using SafeRide.Core.Entities;

namespace SafeRide.Core.Interfaces
{
    public interface ISchoolEnrollmentService
    {
        Task<OperationResult> RequestEnrollmentAsync(Guid parentId, int schoolId, string? parentNotes);
        Task<OperationResult> ApproveEnrollmentAsync(Guid enrollmentId, string approvedBy, string? adminNotes);
        Task<OperationResult> RejectEnrollmentAsync(Guid enrollmentId, string rejectedBy, string rejectionReason, string? adminNotes);
        Task<IEnumerable<ParentSchoolEnrollment>> GetParentEnrollmentsAsync(Guid parentId);
        Task<IEnumerable<ParentSchoolEnrollment>> GetPendingEnrollmentsAsync();
        Task<IEnumerable<School>> GetAvailableSchoolsAsync();
        Task<IEnumerable<School>> GetApprovedSchoolsForParentAsync(Guid parentId);
        Task<bool> IsParentApprovedForSchoolAsync(Guid parentId, int schoolId);
    }

    public class SchoolEnrollmentResult : OperationResult
    {
        public ParentSchoolEnrollment? Enrollment { get; set; }
    }
}
