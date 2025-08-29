using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using SafeRide.Core.Entities;

namespace SafeRide.Core.Interfaces
{
    public interface ICreditService
    {
        Task<int> GetCreditBalanceAsync(Guid parentId);
        Task<bool> AddCreditAsync(Guid parentId);
        Task<bool> DeductCreditAsync(Guid parentId);
        Task<List<CreditTransaction>> GetTransactionHistoryAsync(Guid parentId);
    }
}