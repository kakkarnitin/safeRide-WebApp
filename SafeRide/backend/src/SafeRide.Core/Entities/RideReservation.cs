using System;

namespace SafeRide.Core.Entities
{
    public class RideReservation
    {
        public Guid Id { get; set; }
        public Guid ParentId { get; set; }
        public Guid RideOfferId { get; set; }
        public DateTime ReservationDate { get; set; }
        public int NumberOfSeats { get; set; }
        public string Status { get; set; } // e.g., "Reserved", "Cancelled", "Completed"

        public RideReservation(Guid parentId, Guid rideOfferId, int numberOfSeats)
        {
            Id = Guid.NewGuid();
            ParentId = parentId;
            RideOfferId = rideOfferId;
            ReservationDate = DateTime.UtcNow;
            NumberOfSeats = numberOfSeats;
            Status = "Reserved";
        }

        public void CancelReservation()
        {
            Status = "Cancelled";
        }

        public void CompleteReservation()
        {
            Status = "Completed";
        }
    }
}