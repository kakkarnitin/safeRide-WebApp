using System.ComponentModel.DataAnnotations;

namespace SafeRide.Api.DTOs.Rides
{
    public class RideOfferDto
    {
        public Guid Id { get; set; }
        public Guid ParentId { get; set; }
        
        [Required]
        public int SchoolId { get; set; }
        
        [Required]
        public DateTime OfferDate { get; set; }
        
        [Required]
        public string PickupLocation { get; set; } = string.Empty;
        
        [Required]
        public string DropOffLocation { get; set; } = string.Empty;
        
        [Range(1, 8)]
        public int AvailableSeats { get; set; }
        
        public bool IsActive { get; set; } = true;
    }
}
