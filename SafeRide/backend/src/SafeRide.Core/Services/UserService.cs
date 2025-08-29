using SafeRide.Core.Entities;
using SafeRide.Core.Interfaces;

namespace SafeRide.Core.Services
{
    public class UserService : IUserService
    {
        private readonly IRepository<Parent> _parentRepository;

        public UserService(IRepository<Parent> parentRepository)
        {
            _parentRepository = parentRepository;
        }

        public async Task<OperationResult> RegisterAsync(Parent parent)
        {
            try
            {
                parent.Id = Guid.NewGuid();
                parent.CreditPoints = 5;
                parent.IsVerified = false;
                parent.VerificationStatus = VerificationStatus.Pending;
                
                await _parentRepository.AddAsync(parent);
                
                return new OperationResult { Success = true };
            }
            catch (Exception ex)
            {
                return new OperationResult 
                { 
                    Success = false, 
                    Errors = new[] { ex.Message } 
                };
            }
        }

        public async Task<OperationResult> LoginAsync(string email, string password)
        {
            try
            {
                var parents = await _parentRepository.GetWhereAsync(p => p.Email == email);
                var parent = parents.FirstOrDefault();
                
                if (parent == null)
                {
                    return new OperationResult 
                    { 
                        Success = false, 
                        Errors = new[] { "Invalid email or password" } 
                    };
                }

                // In a real app, you'd verify password hash here
                // For now, just return success with a mock token
                return new OperationResult 
                { 
                    Success = true, 
                    Token = "mock-jwt-token-" + parent.Id,
                    User = parent
                };
            }
            catch (Exception ex)
            {
                return new OperationResult 
                { 
                    Success = false, 
                    Errors = new[] { ex.Message } 
                };
            }
        }
    }
}
