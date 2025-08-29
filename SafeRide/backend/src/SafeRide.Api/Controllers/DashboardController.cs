using Microsoft.AspNetCore.Mvc;
using SafeRide.Core.Entities;
using SafeRide.Core.Interfaces;
using SafeRide.Api.DTOs.Rides;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace SafeRide.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DashboardController : ControllerBase
    {
        private readonly IVerificationService _verificationService;
        private readonly IRideService _rideService;
        private readonly ICreditService _creditService;

        public DashboardController(IVerificationService verificationService, IRideService rideService, ICreditService creditService)
        {
            _verificationService = verificationService;
            _rideService = rideService;
            _creditService = creditService;
        }

        [HttpGet("activities")]
        public async Task<ActionResult<IEnumerable<ActivityDto>>> GetActivities()
        {
            // Mock activities for now - in real app, aggregate from various services
            var activities = new List<ActivityDto>
            {
                new ActivityDto
                {
                    Id = Guid.NewGuid(),
                    Type = "Credit",
                    Description = "Initial credit points assigned",
                    Date = DateTime.UtcNow.AddDays(-1),
                    Status = "Completed"
                }
            };
            return Ok(activities);
        }

        [HttpGet("credits")]
        public async Task<ActionResult<int>> GetCreditBalance()
        {
            // Mock parent ID - in real app, get from JWT token
            var mockParentId = Guid.NewGuid();
            var balance = await _creditService.GetCreditBalanceAsync(mockParentId);
            return Ok(balance);
        }

        [HttpPost("offer-ride")]
        public async Task<ActionResult> OfferRide([FromBody] RideOfferDto rideOfferDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var rideOffer = new RideOffer(
                rideOfferDto.ParentId,
                rideOfferDto.SchoolId,
                rideOfferDto.OfferDate,
                rideOfferDto.PickupLocation,
                rideOfferDto.DropOffLocation,
                rideOfferDto.AvailableSeats);

            await _rideService.OfferRideAsync(rideOffer);
            return CreatedAtAction(nameof(GetActivities), new { }, rideOfferDto);
        }

        [HttpPost("reserve-ride")]
        public async Task<ActionResult> ReserveRide([FromBody] RideReservationDto reservationDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var reservation = new RideReservation(
                reservationDto.ParentId,
                reservationDto.RideOfferId,
                reservationDto.NumberOfSeats);

            await _rideService.ReserveSeatAsync(reservation);
            return Ok();
        }
    }
}