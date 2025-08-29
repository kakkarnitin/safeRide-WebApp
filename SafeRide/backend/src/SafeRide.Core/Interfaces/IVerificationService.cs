using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using SafeRide.Core.Entities;

namespace SafeRide.Core.Interfaces
{
    public interface IVerificationService
    {
        Task<bool> RegisterParentAsync(Parent parent, VerificationDocument document);
        Task<VerificationStatus> VerifyParentAsync(Guid parentId);
        Task<VerificationStatus> GetVerificationStatusAsync(Guid parentId);
        Task<OperationResult> VerifyEmailAsync(string email);
    }
}