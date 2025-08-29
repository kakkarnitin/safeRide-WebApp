using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using SafeRide.Core.Entities;

namespace SafeRide.Core.Interfaces
{
    public interface IRideService
    {
        Task<IEnumerable<RideOffer>> GetAvailableRidesAsync(DateTime date);
        Task<RideOffer> OfferRideAsync(RideOffer rideOffer);
        Task<RideReservation> ReserveSeatAsync(RideReservation reservation);
        Task<IEnumerable<RideReservation>> GetUserReservationsAsync(Guid userId);
    }
}