using Microsoft.AspNetCore.Mvc;
using SafeRide.Core.Entities;
using SafeRide.Core.Interfaces;

namespace SafeRide.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AdminController : ControllerBase
{
    private readonly IRepository<Parent> _parentRepository;
    private readonly IEmailService _emailService;
    private readonly ILogger<AdminController> _logger;

    public AdminController(
        IRepository<Parent> parentRepository,
        IEmailService emailService,
        ILogger<AdminController> logger)
    {
        _parentRepository = parentRepository;
        _emailService = emailService;
        _logger = logger;
    }

    [HttpGet("pending-users")]
    public async Task<IActionResult> GetPendingUsers()
    {
        try
        {
            var pendingUsers = await _parentRepository.GetWhereAsync(p => p.VerificationStatus == VerificationStatus.Pending);
            var result = pendingUsers.Select(u => new
            {
                u.Id,
                Name = u.FullName,
                u.Email,
                u.PhoneNumber,
                u.VerificationStatus,
                RegisteredDate = u.Id // You might want to add a CreatedDate property to Parent entity
            });

            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving pending users");
            return StatusCode(500, "Internal server error");
        }
    }

    [HttpPost("approve-user/{userId}")]
    public async Task<IActionResult> ApproveUser(Guid userId, [FromBody] AdminActionRequest request)
    {
        try
        {
            var users = await _parentRepository.GetWhereAsync(p => p.Id == userId);
            var user = users.FirstOrDefault();

            if (user == null)
            {
                return NotFound("User not found");
            }

            user.VerificationStatus = request.IsApproved ? VerificationStatus.Verified : VerificationStatus.Rejected;
            user.IsVerified = request.IsApproved;

            await _parentRepository.UpdateAsync(user);

            // Send email notification to user
            await _emailService.SendApprovalNotificationAsync(user.Email, user.FullName, request.IsApproved);

            _logger.LogInformation("User {UserId} {Action} by admin", userId, request.IsApproved ? "approved" : "rejected");

            return Ok(new { message = $"User {(request.IsApproved ? "approved" : "rejected")} successfully" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error approving user {UserId}", userId);
            return StatusCode(500, "Internal server error");
        }
    }

    [HttpGet("enrollment-requests")]
    public async Task<IActionResult> GetPendingEnrollmentRequests()
    {
        try
        {
            var enrollmentRepository = HttpContext.RequestServices.GetService<IParentSchoolEnrollmentRepository>();
            if (enrollmentRepository == null)
            {
                return StatusCode(500, "Service not available");
            }

            var pendingEnrollments = await enrollmentRepository.GetWhereAsync(e => e.Status == EnrollmentStatus.Pending);
            var result = pendingEnrollments.Select(e => new
            {
                e.Id,
                e.ParentId,
                e.SchoolId,
                e.Status,
                e.RequestDate,
                e.ParentNotes,
                // You would typically join with Parent and School entities here
                // ParentName = e.Parent.Name,
                // SchoolName = e.School.Name
            });

            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving pending enrollment requests");
            return StatusCode(500, "Internal server error");
        }
    }
}

public class AdminActionRequest
{
    public bool IsApproved { get; set; }
    public string? Notes { get; set; }
}
