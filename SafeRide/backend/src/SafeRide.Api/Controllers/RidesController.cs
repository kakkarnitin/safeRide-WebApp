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
    public class RidesController : ControllerBase
    {
        private readonly IRideService _rideService;

        public RidesController(IRideService rideService)
        {
            _rideService = rideService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<RideOfferDto>>> GetAvailableRides()
        {
            var rides = await _rideService.GetAvailableRidesAsync(DateTime.Today);
            var rideDtos = rides.Select(r => new RideOfferDto
            {
                Id = r.Id,
                ParentId = r.ParentId,
                OfferDate = r.OfferDate,
                PickupLocation = r.PickupLocation,
                DropOffLocation = r.DropOffLocation,
                AvailableSeats = r.AvailableSeats,
                IsActive = r.IsActive
            });
            return Ok(rideDtos);
        }

        [HttpPost]
        public async Task<ActionResult<RideOfferDto>> OfferRide([FromBody] RideOfferDto rideOfferDto)
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

            var createdRide = await _rideService.OfferRideAsync(rideOffer);
            return CreatedAtAction(nameof(GetAvailableRides), new { id = createdRide.Id }, rideOfferDto);
        }

        [HttpPost("{rideId}/reserve")]
        public async Task<ActionResult> ReserveRide(Guid rideId)
        {
            var reservation = new RideReservation(Guid.NewGuid(), rideId, 1);
            var result = await _rideService.ReserveSeatAsync(reservation);
            return NoContent();
        }

        [HttpDelete("{rideId}/cancel")]
        public async Task<ActionResult> CancelRide(Guid rideId)
        {
            // In a real app, implement cancellation logic
            return NoContent();
        }
    }
}