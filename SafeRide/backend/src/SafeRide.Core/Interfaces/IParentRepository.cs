using SafeRide.Core.Entities;
using System;
using System.Threading.Tasks;

namespace SafeRide.Core.Interfaces
{
    public interface IParentRepository : IRepository<Parent>
    {
        Task<Parent?> GetByEmailAsync(string email);
        new Task<Parent?> GetByIdAsync(Guid id);
        Task<bool> ExistsAsync(Guid id);
    }
}
