using Microsoft.AspNetCore.Mvc;
using SafeRide.Core.Interfaces;
using SafeRide.Core.Entities;
using SafeRide.Api.DTOs.Verification;
using System.Threading.Tasks;

namespace SafeRide.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class VerificationController : ControllerBase
    {
        private readonly IVerificationService _verificationService;

        public VerificationController(IVerificationService verificationService)
        {
            _verificationService = verificationService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> RegisterParent([FromBody] VerificationDocumentDto documentDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var parent = new Parent()
            {
                Id = Guid.NewGuid(),
                FullName = "Demo Parent",
                Email = "demo@example.com",
                PhoneNumber = "0400000000",
                DrivingLicenseNumber = "DL123456",
                WorkingWithChildrenCardNumber = "WCC123456"
            };
            var document = new VerificationDocument
            {
                Id = Guid.NewGuid(),
                ParentId = documentDto.ParentId,
                DocumentType = documentDto.DocumentType,
                DocumentUrl = documentDto.DocumentUrl,
                UploadedDate = DateTime.UtcNow,
                Status = VerificationStatus.Pending
            };

            var result = await _verificationService.RegisterParentAsync(parent, document);
            return Ok(new { success = result });
        }

        [HttpGet("status/{parentId}")]
        public async Task<IActionResult> GetVerificationStatus(Guid parentId)
        {
            try
            {
                var status = await _verificationService.GetVerificationStatusAsync(parentId);
                return Ok(new { status = status.ToString() });
            }
            catch
            {
                return NotFound();
            }
        }

        [HttpPost("verify/{parentId}")]
        public async Task<IActionResult> VerifyParent(Guid parentId)
        {
            try
            {
                var status = await _verificationService.VerifyParentAsync(parentId);
                return Ok(new { status = status.ToString() });
            }
            catch
            {
                return NotFound();
            }
        }
    }
}