using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using SafeRide.Core.Entities;
using SafeRide.Core.Interfaces;

namespace SafeRide.Core.Services
{
    public class RideService : IRideService
    {
        private readonly IRepository<RideOffer> _rideOfferRepository;
        private readonly IRepository<RideReservation> _rideReservationRepository;

        public RideService(IRepository<RideOffer> rideOfferRepository, IRepository<RideReservation> rideReservationRepository)
        {
            _rideOfferRepository = rideOfferRepository;
            _rideReservationRepository = rideReservationRepository;
        }

        public async Task<IEnumerable<RideOffer>> GetAvailableRidesAsync(DateTime date)
        {
            return await _rideOfferRepository.GetWhereAsync(ride => ride.OfferDate.Date == date.Date && ride.AvailableSeats > 0 && ride.IsActive);
        }

        public async Task<RideOffer> OfferRideAsync(RideOffer rideOffer)
        {
            await _rideOfferRepository.AddAsync(rideOffer);
            return rideOffer;
        }

    public async Task<RideReservation> ReserveSeatAsync(RideReservation reservation)
        {
            var rideOffer = await _rideOfferRepository.GetByIdAsync(reservation.RideOfferId);
            if (rideOffer == null || rideOffer.AvailableSeats <= 0)
            {
                throw new InvalidOperationException("Ride offer not available.");
            }

            rideOffer.AvailableSeats--;
            await _rideOfferRepository.UpdateAsync(rideOffer);
            await _rideReservationRepository.AddAsync(reservation);
            return reservation;
        }

        public async Task<IEnumerable<RideReservation>> GetUserReservationsAsync(Guid userId)
        {
            return await _rideReservationRepository.GetWhereAsync(reservation => reservation.ParentId == userId);
        }
    }
}