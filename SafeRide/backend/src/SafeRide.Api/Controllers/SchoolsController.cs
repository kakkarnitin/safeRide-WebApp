using Microsoft.AspNetCore.Mvc;
using SafeRide.Api.DTOs.School;
using SafeRide.Core.Interfaces;
using SafeRide.Core.Entities;

namespace SafeRide.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SchoolsController : ControllerBase
    {
        private readonly ISchoolEnrollmentService _enrollmentService;
        private readonly ISchoolRepository _schoolRepository;

        public SchoolsController(ISchoolEnrollmentService enrollmentService, ISchoolRepository schoolRepository)
        {
            _enrollmentService = enrollmentService;
            _schoolRepository = schoolRepository;
        }

        [HttpGet]
        public async Task<IActionResult> GetAvailableSchools()
        {
            try
            {
                var schools = await _schoolRepository.GetAllAsync();
                var schoolDtos = schools.Select(s => new SchoolDto
                {
                    Id = s.Id,
                    Name = s.Name,
                    Address = s.Address,
                    IsActive = s.IsActive,
                    ContactEmail = s.ContactEmail,
                    ContactPhone = s.ContactPhone
                });

                return Ok(schoolDtos);
            }
            catch (Exception)
            {
                return StatusCode(500, new { message = "Failed to retrieve schools" });
            }
        }

        [HttpPost]
        public async Task<IActionResult> CreateSchool([FromBody] CreateSchoolDto request)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var school = new SafeRide.Core.Entities.School
                {
                    Name = request.Name,
                    Address = request.Address,
                    ContactEmail = request.ContactEmail,
                    ContactPhone = request.ContactPhone,
                    IsActive = true,
                    CreatedDate = DateTime.UtcNow
                };

                await _schoolRepository.AddAsync(school);

                var response = new SchoolDto
                {
                    Id = school.Id,
                    Name = school.Name,
                    Address = school.Address,
                    IsActive = school.IsActive,
                    ContactEmail = school.ContactEmail,
                    ContactPhone = school.ContactPhone
                };

                return CreatedAtAction(nameof(GetAvailableSchools), new { id = school.Id }, response);
            }
            catch (Exception)
            {
                return StatusCode(500, new { message = "Failed to create school" });
            }
        }

        [HttpPost("enroll")]
        public async Task<IActionResult> RequestEnrollment([FromBody] SchoolEnrollmentRequestDto request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            try
            {
                // TODO: Get parent ID from JWT token when authentication is implemented
                var parentId = Guid.Parse("00000000-0000-0000-0000-000000000001"); // Mock for now
                
                var result = await _enrollmentService.RequestEnrollmentAsync(parentId, request.SchoolId, request.ParentNotes);
                
                if (!result.Success)
                    return BadRequest(new { errors = result.Errors });

                return Ok(new { message = "Enrollment request submitted successfully" });
            }
            catch (Exception)
            {
                return StatusCode(500, new { message = "Failed to submit enrollment request" });
            }
        }

        [HttpGet("my-enrollments")]
        public async Task<IActionResult> GetMyEnrollments()
        {
            try
            {
                // TODO: Get parent ID from JWT token when authentication is implemented
                var parentId = Guid.Parse("00000000-0000-0000-0000-000000000001"); // Mock for now
                
                var enrollments = await _enrollmentService.GetParentEnrollmentsAsync(parentId);
                var enrollmentDtos = enrollments.Select(e => new SchoolEnrollmentResponseDto
                {
                    Id = e.Id.ToString(),
                    SchoolId = e.SchoolId,
                    SchoolName = e.School?.Name ?? "Unknown School",
                    Status = e.Status.ToString(),
                    RequestDate = e.RequestDate,
                    ApprovalDate = e.ApprovalDate,
                    RejectionReason = e.RejectionReason,
                    ParentNotes = e.ParentNotes
                });

                return Ok(enrollmentDtos);
            }
            catch (Exception)
            {
                return StatusCode(500, new { message = "Failed to retrieve enrollments" });
            }
        }

        [HttpGet("approved-schools")]
        public async Task<IActionResult> GetApprovedSchools()
        {
            try
            {
                // TODO: Get parent ID from JWT token when authentication is implemented
                var parentId = Guid.Parse("00000000-0000-0000-0000-000000000001"); // Mock for now
                
                var schools = await _enrollmentService.GetApprovedSchoolsForParentAsync(parentId);
                var schoolDtos = schools.Select(s => new SchoolDto
                {
                    Id = s.Id,
                    Name = s.Name,
                    Address = s.Address,
                    IsActive = s.IsActive,
                    ContactEmail = s.ContactEmail,
                    ContactPhone = s.ContactPhone
                });

                return Ok(schoolDtos);
            }
            catch (Exception)
            {
                return StatusCode(500, new { message = "Failed to retrieve approved schools" });
            }
        }

        // Admin endpoints
        [HttpGet("pending-enrollments")]
        public async Task<IActionResult> GetPendingEnrollments()
        {
            try
            {
                var enrollments = await _enrollmentService.GetPendingEnrollmentsAsync();
                var enrollmentDtos = enrollments.Select(e => new
                {
                    Id = e.Id.ToString(),
                    ParentId = e.ParentId.ToString(),
                    ParentName = e.Parent?.FullName ?? "Unknown Parent",
                    ParentEmail = e.Parent?.Email ?? "Unknown Email",
                    SchoolId = e.SchoolId,
                    SchoolName = e.School?.Name ?? "Unknown School",
                    Status = e.Status.ToString(),
                    RequestDate = e.RequestDate,
                    ParentNotes = e.ParentNotes
                });

                return Ok(enrollmentDtos);
            }
            catch (Exception)
            {
                return StatusCode(500, new { message = "Failed to retrieve pending enrollments" });
            }
        }

        [HttpPost("approve-enrollment")]
        public async Task<IActionResult> ApproveEnrollment([FromBody] EnrollmentApprovalDto request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            try
            {
                var enrollmentId = Guid.Parse(request.EnrollmentId);
                // TODO: Get admin ID from JWT token when authentication is implemented
                var adminId = "admin@saferide.com"; // Mock for now

                OperationResult result;
                if (request.Approve)
                {
                    result = await _enrollmentService.ApproveEnrollmentAsync(enrollmentId, adminId, request.AdminNotes);
                }
                else
                {
                    if (string.IsNullOrEmpty(request.RejectionReason))
                    {
                        return BadRequest(new { message = "Rejection reason is required when rejecting enrollment" });
                    }
                    result = await _enrollmentService.RejectEnrollmentAsync(enrollmentId, adminId, request.RejectionReason, request.AdminNotes);
                }

                if (!result.Success)
                    return BadRequest(new { errors = result.Errors });

                var action = request.Approve ? "approved" : "rejected";
                return Ok(new { message = $"Enrollment {action} successfully" });
            }
            catch (Exception)
            {
                return StatusCode(500, new { message = "Failed to process enrollment approval" });
            }
        }
    }
}
