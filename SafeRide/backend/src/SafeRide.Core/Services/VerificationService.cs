using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;
using SafeRide.Core.Entities;
using SafeRide.Core.Interfaces;

namespace SafeRide.Core.Services
{
    public class VerificationService : IVerificationService
    {
        private readonly IRepository<Parent> _parentRepository;
        private readonly IRepository<VerificationDocument> _documentRepository;

        public VerificationService(IRepository<Parent> parentRepository, IRepository<VerificationDocument> documentRepository)
        {
            _parentRepository = parentRepository;
            _documentRepository = documentRepository;
        }

        public async Task<bool> RegisterParentAsync(Parent parent, VerificationDocument document)
        {
            // Add parent first
            await _parentRepository.AddAsync(parent);
            
            // Add verification document
            document.ParentId = parent.Id;
            document.UploadedDate = DateTime.UtcNow;
            document.Status = VerificationStatus.Pending;
            
            await _documentRepository.AddAsync(document);
            return true;
        }

        public async Task<VerificationStatus> VerifyParentAsync(Guid parentId)
        {
            var parent = await _parentRepository.GetByIdAsync(parentId);
            if (parent == null) return VerificationStatus.Pending;

            // Get all documents for this parent
            var allDocuments = await _documentRepository.GetAllAsync();
            var parentDocuments = allDocuments.Where(d => d.ParentId == parentId).ToList();

            if (parentDocuments.Any() && parentDocuments.All(d => d.Status == VerificationStatus.Verified))
            {
                parent.IsVerified = true;
                parent.VerificationStatus = VerificationStatus.Verified;
                await _parentRepository.UpdateAsync(parent);
                return VerificationStatus.Verified;
            }

            return parent.VerificationStatus;
        }

        public async Task<VerificationStatus> GetVerificationStatusAsync(Guid parentId)
        {
            var parent = await _parentRepository.GetByIdAsync(parentId);
            return parent?.VerificationStatus ?? VerificationStatus.Pending;
        }

        public async Task<OperationResult> VerifyEmailAsync(string email)
        {
            var allParents = await _parentRepository.GetAllAsync();
            var parent = allParents.FirstOrDefault(p => p.Email == email);
            
            if (parent == null)
            {
                return new OperationResult { Success = false, Errors = new[] { "Parent not found" } };
            }

            // Simulate email verification
            return new OperationResult { Success = true };
        }
    }
}
