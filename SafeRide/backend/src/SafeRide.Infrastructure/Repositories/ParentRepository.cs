using Microsoft.EntityFrameworkCore;
using SafeRide.Core.Entities;
using SafeRide.Core.Interfaces;
using SafeRide.Infrastructure.Data;
using System;
using System.Threading.Tasks;

namespace SafeRide.Infrastructure.Repositories
{
    public class ParentRepository : Repository<Parent>, IParentRepository
    {
        public ParentRepository(SafeRideDbContext context) : base(context)
        {
        }

        public async Task<Parent?> GetByEmailAsync(string email)
        {
            return await _context.Parents
                .Include(p => p.SchoolEnrollments)
                .ThenInclude(e => e.School)
                .FirstOrDefaultAsync(p => p.Email == email);
        }

        public new async Task<Parent?> GetByIdAsync(Guid id)
        {
            return await _context.Parents
                .Include(p => p.SchoolEnrollments)
                .ThenInclude(e => e.School)
                .FirstOrDefaultAsync(p => p.Id == id);
        }

        public async Task<bool> ExistsAsync(Guid id)
        {
            return await _context.Parents.AnyAsync(p => p.Id == id);
        }
    }
}
