using SafeRide.Core.Entities;

namespace SafeRide.Core.Interfaces
{
    public interface ISchoolRepository : IRepository<School>
    {
        Task<IEnumerable<School>> GetActiveSchoolsAsync();
        Task<School?> GetSchoolWithEnrollmentsAsync(int schoolId);
    }

    public interface IParentSchoolEnrollmentRepository : IRepository<ParentSchoolEnrollment>
    {
        Task<IEnumerable<ParentSchoolEnrollment>> GetParentEnrollmentsAsync(Guid parentId);
        Task<IEnumerable<ParentSchoolEnrollment>> GetSchoolEnrollmentsAsync(int schoolId);
        Task<ParentSchoolEnrollment?> GetEnrollmentAsync(Guid parentId, int schoolId);
        Task<IEnumerable<ParentSchoolEnrollment>> GetPendingEnrollmentsAsync();
        Task<IEnumerable<School>> GetApprovedSchoolsForParentAsync(Guid parentId);
    }
}
