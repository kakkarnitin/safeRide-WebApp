using SafeRide.Core.Entities;
using SafeRide.Core.Interfaces;

namespace SafeRide.Core.Services
{
    public class UserService : IUserService
    {
        private readonly IRepository<Parent> _parentRepository;
        private readonly IEmailService _emailService;

        public UserService(IRepository<Parent> parentRepository, IEmailService emailService)
        {
            _parentRepository = parentRepository;
            _emailService = emailService;
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
                
                // Send email notification to admins
                _ = Task.Run(async () =>
                {
                    await _emailService.SendUserRegistrationNotificationAsync(
                        parent.Email, 
                        parent.FullName, 
                        parent.Id.ToString()
                    );
                });
                
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

        public async Task<OperationResult> AuthenticateOrCreateMicrosoftUserAsync(string email, string name, string microsoftId)
        {
            try
            {
                // First try to find by Microsoft ID
                var parents = await _parentRepository.GetWhereAsync(p => p.MicrosoftId == microsoftId);
                var existingParent = parents.FirstOrDefault();

                if (existingParent != null)
                {
                    // User exists with this Microsoft ID, return success
                    return new OperationResult 
                    { 
                        Success = true, 
                        Token = "mock-jwt-token-" + existingParent.Id,
                        User = existingParent
                    };
                }

                // Try to find by email (existing user linking Microsoft account)
                var emailParents = await _parentRepository.GetWhereAsync(p => p.Email == email);
                var emailParent = emailParents.FirstOrDefault();

                if (emailParent != null)
                {
                    // Link Microsoft ID to existing account
                    emailParent.MicrosoftId = microsoftId;
                    await _parentRepository.UpdateAsync(emailParent);
                    
                    return new OperationResult 
                    { 
                        Success = true, 
                        Token = "mock-jwt-token-" + emailParent.Id,
                        User = emailParent
                    };
                }

                // Create new user from Microsoft account
                var newParent = new Parent
                {
                    Id = Guid.NewGuid(),
                    FullName = name ?? "Microsoft User",
                    Email = email,
                    PhoneNumber = "", // Will need to be filled later
                    DrivingLicenseNumber = "", // Will need to be filled later
                    WorkingWithChildrenCardNumber = "", // Will need to be filled later
                    MicrosoftId = microsoftId,
                    CreditPoints = 5,
                    IsVerified = false, // Microsoft accounts still need document verification
                    VerificationStatus = VerificationStatus.Pending
                };

                await _parentRepository.AddAsync(newParent);
                
                return new OperationResult 
                { 
                    Success = true, 
                    Token = "mock-jwt-token-" + newParent.Id,
                    User = newParent
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

        public async Task<Parent?> GetByEmailAsync(string email)
        {
            try
            {
                var parents = await _parentRepository.GetWhereAsync(p => p.Email == email);
                return parents.FirstOrDefault();
            }
            catch
            {
                return null;
            }
        }

        public async Task<Parent?> GetByMicrosoftIdAsync(string microsoftId)
        {
            try
            {
                var parents = await _parentRepository.GetWhereAsync(p => p.MicrosoftId == microsoftId);
                return parents.FirstOrDefault();
            }
            catch
            {
                return null;
            }
        }
    }
}
