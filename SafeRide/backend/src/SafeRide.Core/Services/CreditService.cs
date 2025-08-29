using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using SafeRide.Core.Entities;
using SafeRide.Core.Interfaces;

namespace SafeRide.Core.Services
{
    public class CreditService : ICreditService
    {
        private readonly IRepository<Parent> _parentRepository;
        private readonly IRepository<CreditTransaction> _creditTransactionRepository;

        public CreditService(IRepository<Parent> parentRepository, IRepository<CreditTransaction> creditTransactionRepository)
        {
            _parentRepository = parentRepository;
            _creditTransactionRepository = creditTransactionRepository;
        }

        public async Task<int> GetCreditBalanceAsync(Guid parentId)
        {
            var parent = await _parentRepository.GetByIdAsync(parentId);
            return parent?.CreditPoints ?? 0;
        }

        public async Task<bool> AddCreditAsync(Guid parentId)
        {
            var parent = await _parentRepository.GetByIdAsync(parentId);
            if (parent == null || parent.CreditPoints >= 5)
            {
                return false;
            }

            parent.CreditPoints++;
            await _parentRepository.UpdateAsync(parent);

            var transaction = new CreditTransaction(parentId, 1, "Earned ride point");
            await _creditTransactionRepository.AddAsync(transaction);

            return true;
        }

        public async Task<bool> DeductCreditAsync(Guid parentId)
        {
            var parent = await _parentRepository.GetByIdAsync(parentId);
            if (parent == null || parent.CreditPoints <= 0)
            {
                return false;
            }

            parent.CreditPoints--;
            await _parentRepository.UpdateAsync(parent);

            var transaction = new CreditTransaction(parentId, -1, "Used ride point");
            await _creditTransactionRepository.AddAsync(transaction);

            return true;
        }

        public async Task<List<CreditTransaction>> GetTransactionHistoryAsync(Guid parentId)
        {
            var list = await _creditTransactionRepository.GetWhereAsync(t => t.ParentId == parentId);
            return list.ToList();
        }
    }
}