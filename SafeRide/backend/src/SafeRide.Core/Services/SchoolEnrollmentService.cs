using SafeRide.Core.Entities;
using SafeRide.Core.Interfaces;

namespace SafeRide.Core.Services
{
    public class SchoolEnrollmentService : ISchoolEnrollmentService
    {
        private readonly IParentSchoolEnrollmentRepository _enrollmentRepository;
        private readonly ISchoolRepository _schoolRepository;
        private readonly IParentRepository _parentRepository;

        public SchoolEnrollmentService(
            IParentSchoolEnrollmentRepository enrollmentRepository,
            ISchoolRepository schoolRepository,
            IParentRepository parentRepository)
        {
            _enrollmentRepository = enrollmentRepository;
            _schoolRepository = schoolRepository;
            _parentRepository = parentRepository;
        }

        public async Task<OperationResult> RequestEnrollmentAsync(Guid parentId, int schoolId, string? parentNotes)
        {
            try
            {
                // Check if parent exists
                var parents = await _parentRepository.GetWhereAsync(p => p.Id == parentId);
                var parent = parents.FirstOrDefault();
                if (parent == null)
                {
                    return new OperationResult { Success = false, Errors = new[] { "Parent not found" } };
                }

                // Check if school exists and is active
                var schools = await _schoolRepository.GetWhereAsync(s => s.Id == schoolId && s.IsActive);
                var school = schools.FirstOrDefault();
                if (school == null)
                {
                    return new OperationResult { Success = false, Errors = new[] { "School not found or not active" } };
                }

                // Check if enrollment already exists
                var existingEnrollment = await _enrollmentRepository.GetEnrollmentAsync(parentId, schoolId);
                if (existingEnrollment != null)
                {
                    return new OperationResult { Success = false, Errors = new[] { "Enrollment request already exists for this school" } };
                }

                // Create new enrollment request
                var enrollment = new ParentSchoolEnrollment
                {
                    Id = Guid.NewGuid(),
                    ParentId = parentId,
                    SchoolId = schoolId,
                    Status = EnrollmentStatus.Pending,
                    RequestDate = DateTime.UtcNow,
                    ParentNotes = parentNotes
                };

                await _enrollmentRepository.AddAsync(enrollment);

                return new OperationResult { Success = true };
            }
            catch (Exception)
            {
                return new OperationResult { Success = false, Errors = new[] { "Failed to submit enrollment request" } };
            }
        }

        public async Task<OperationResult> ApproveEnrollmentAsync(Guid enrollmentId, string approvedBy, string? adminNotes)
        {
            try
            {
                var enrollments = await _enrollmentRepository.GetWhereAsync(e => e.Id == enrollmentId);
                var enrollment = enrollments.FirstOrDefault();

                if (enrollment == null)
                {
                    return new OperationResult { Success = false, Errors = new[] { "Enrollment not found" } };
                }

                if (enrollment.Status != EnrollmentStatus.Pending)
                {
                    return new OperationResult { Success = false, Errors = new[] { "Enrollment is not in pending status" } };
                }

                enrollment.Status = EnrollmentStatus.Approved;
                enrollment.ApprovalDate = DateTime.UtcNow;
                enrollment.ApprovedBy = approvedBy;
                enrollment.AdminNotes = adminNotes;

                await _enrollmentRepository.UpdateAsync(enrollment);

                return new OperationResult { Success = true };
            }
            catch (Exception)
            {
                return new OperationResult { Success = false, Errors = new[] { "Failed to approve enrollment" } };
            }
        }

        public async Task<OperationResult> RejectEnrollmentAsync(Guid enrollmentId, string rejectedBy, string rejectionReason, string? adminNotes)
        {
            try
            {
                var enrollments = await _enrollmentRepository.GetWhereAsync(e => e.Id == enrollmentId);
                var enrollment = enrollments.FirstOrDefault();

                if (enrollment == null)
                {
                    return new OperationResult { Success = false, Errors = new[] { "Enrollment not found" } };
                }

                if (enrollment.Status != EnrollmentStatus.Pending)
                {
                    return new OperationResult { Success = false, Errors = new[] { "Enrollment is not in pending status" } };
                }

                enrollment.Status = EnrollmentStatus.Rejected;
                enrollment.RejectionReason = rejectionReason;
                enrollment.AdminNotes = adminNotes;
                enrollment.ApprovedBy = rejectedBy; // Track who made the decision

                await _enrollmentRepository.UpdateAsync(enrollment);

                return new OperationResult { Success = true };
            }
            catch (Exception)
            {
                return new OperationResult { Success = false, Errors = new[] { "Failed to reject enrollment" } };
            }
        }

        public async Task<IEnumerable<ParentSchoolEnrollment>> GetParentEnrollmentsAsync(Guid parentId)
        {
            return await _enrollmentRepository.GetParentEnrollmentsAsync(parentId);
        }

        public async Task<IEnumerable<ParentSchoolEnrollment>> GetPendingEnrollmentsAsync()
        {
            return await _enrollmentRepository.GetPendingEnrollmentsAsync();
        }

        public async Task<IEnumerable<School>> GetAvailableSchoolsAsync()
        {
            return await _schoolRepository.GetActiveSchoolsAsync();
        }

        public async Task<IEnumerable<School>> GetApprovedSchoolsForParentAsync(Guid parentId)
        {
            return await _enrollmentRepository.GetApprovedSchoolsForParentAsync(parentId);
        }

        public async Task<bool> IsParentApprovedForSchoolAsync(Guid parentId, int schoolId)
        {
            var enrollment = await _enrollmentRepository.GetEnrollmentAsync(parentId, schoolId);
            return enrollment?.Status == EnrollmentStatus.Approved;
        }
    }
}
