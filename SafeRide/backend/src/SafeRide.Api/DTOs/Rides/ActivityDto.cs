namespace SafeRide.Api.DTOs.Rides
{
    public class ActivityDto
    {
        public Guid Id { get; set; }
        public string Type { get; set; } = string.Empty; // "RideOffer", "RideReservation", "Credit"
        public string Description { get; set; } = string.Empty;
        public DateTime Date { get; set; }
        public string Status { get; set; } = string.Empty;
    }
}
