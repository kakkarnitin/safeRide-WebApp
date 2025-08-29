using System;

namespace SafeRide.Core.Entities
{
    public class RideOffer
    {
        public Guid Id { get; set; }
        public Guid ParentId { get; set; }
        public int SchoolId { get; set; }
        public School? School { get; set; }
        public DateTime OfferDate { get; set; }
        public string PickupLocation { get; set; }
        public string DropOffLocation { get; set; }
        public int AvailableSeats { get; set; }
        public bool IsActive { get; set; }

        public RideOffer(Guid parentId, int schoolId, DateTime offerDate, string pickupLocation, string dropOffLocation, int availableSeats)
        {
            Id = Guid.NewGuid();
            ParentId = parentId;
            SchoolId = schoolId;
            OfferDate = offerDate;
            PickupLocation = pickupLocation;
            DropOffLocation = dropOffLocation;
            AvailableSeats = availableSeats;
            IsActive = true;
        }

        public void DeactivateOffer()
        {
            IsActive = false;
        }
    }
}