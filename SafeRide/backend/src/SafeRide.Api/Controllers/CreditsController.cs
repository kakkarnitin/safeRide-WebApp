using Microsoft.AspNetCore.Mvc;
using SafeRide.Core.Interfaces;
using SafeRide.Core.Entities;
using System.Threading.Tasks;
using System;

namespace SafeRide.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CreditsController : ControllerBase
    {
        private readonly ICreditService _creditService;

        public CreditsController(ICreditService creditService)
        {
            _creditService = creditService;
        }

        [HttpGet("{parentId}")]
        public async Task<ActionResult<int>> GetCreditBalance(Guid parentId)
        {
            var balance = await _creditService.GetCreditBalanceAsync(parentId);
            return Ok(balance);
        }

        [HttpPost("add/{parentId}")]
        public async Task<ActionResult> AddCredit(Guid parentId)
        {
            var result = await _creditService.AddCreditAsync(parentId);
            return result ? Ok() : BadRequest();
        }

        [HttpPost("deduct/{parentId}")]
        public async Task<ActionResult> DeductCredit(Guid parentId)
        {
            var result = await _creditService.DeductCreditAsync(parentId);
            return result ? Ok() : BadRequest();
        }

        [HttpGet("history/{parentId}")]
        public async Task<ActionResult> GetTransactionHistory(Guid parentId)
        {
            var history = await _creditService.GetTransactionHistoryAsync(parentId);
            return Ok(history);
        }
    }
}