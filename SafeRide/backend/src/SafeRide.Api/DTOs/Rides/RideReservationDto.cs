namespace SafeRide.Api.DTOs.Rides
{
    public class RideReservationDto
    {
        public Guid Id { get; set; }
        public Guid ParentId { get; set; }
        public Guid RideOfferId { get; set; }
        public DateTime ReservationDate { get; set; }
        public int NumberOfSeats { get; set; }
        public string Status { get; set; } = "Reserved";
    }
}
