using Microsoft.EntityFrameworkCore;
using SafeRide.Core.Entities;
using SafeRide.Core.Interfaces;
using SafeRide.Infrastructure.Data;

namespace SafeRide.Infrastructure.Repositories
{
    public class SchoolRepository : Repository<School>, ISchoolRepository
    {
        public SchoolRepository(SafeRideDbContext context) : base(context) { }

        public async Task<IEnumerable<School>> GetActiveSchoolsAsync()
        {
            return await _context.Schools
                .Where(s => s.IsActive)
                .OrderBy(s => s.Name)
                .ToListAsync();
        }

        public async Task<School?> GetSchoolWithEnrollmentsAsync(int schoolId)
        {
            return await _context.Schools
                .Include(s => s.ParentEnrollments)
                .ThenInclude(e => e.Parent)
                .FirstOrDefaultAsync(s => s.Id == schoolId);
        }
    }

    public class ParentSchoolEnrollmentRepository : Repository<ParentSchoolEnrollment>, IParentSchoolEnrollmentRepository
    {
        public ParentSchoolEnrollmentRepository(SafeRideDbContext context) : base(context) { }

        public async Task<IEnumerable<ParentSchoolEnrollment>> GetParentEnrollmentsAsync(Guid parentId)
        {
            return await _context.ParentSchoolEnrollments
                .Include(e => e.School)
                .Where(e => e.ParentId == parentId)
                .OrderByDescending(e => e.RequestDate)
                .ToListAsync();
        }

        public async Task<IEnumerable<ParentSchoolEnrollment>> GetSchoolEnrollmentsAsync(int schoolId)
        {
            return await _context.ParentSchoolEnrollments
                .Include(e => e.Parent)
                .Where(e => e.SchoolId == schoolId)
                .OrderByDescending(e => e.RequestDate)
                .ToListAsync();
        }

        public async Task<ParentSchoolEnrollment?> GetEnrollmentAsync(Guid parentId, int schoolId)
        {
            return await _context.ParentSchoolEnrollments
                .Include(e => e.School)
                .FirstOrDefaultAsync(e => e.ParentId == parentId && e.SchoolId == schoolId);
        }

        public async Task<IEnumerable<ParentSchoolEnrollment>> GetPendingEnrollmentsAsync()
        {
            return await _context.ParentSchoolEnrollments
                .Include(e => e.Parent)
                .Include(e => e.School)
                .Where(e => e.Status == EnrollmentStatus.Pending)
                .OrderBy(e => e.RequestDate)
                .ToListAsync();
        }

        public async Task<IEnumerable<School>> GetApprovedSchoolsForParentAsync(Guid parentId)
        {
            return await _context.ParentSchoolEnrollments
                .Include(e => e.School)
                .Where(e => e.ParentId == parentId && e.Status == EnrollmentStatus.Approved && e.School != null)
                .Select(e => e.School!)
                .ToListAsync();
        }
    }
}
