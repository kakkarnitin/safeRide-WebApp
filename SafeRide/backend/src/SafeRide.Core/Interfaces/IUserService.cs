using SafeRide.Core.Entities;

namespace SafeRide.Core.Interfaces
{
    public class OperationResult
    {
        public bool Success { get; set; }
        public string[] Errors { get; set; } = Array.Empty<string>();
        public string? Token { get; set; }
        public Parent? User { get; set; }
    }

    public interface IUserService
    {
        Task<OperationResult> RegisterAsync(Parent parent);
        Task<OperationResult> LoginAsync(string email, string password);
    }
}
