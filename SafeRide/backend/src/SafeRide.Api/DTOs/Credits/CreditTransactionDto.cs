namespace SafeRide.Api.DTOs.Credits
{
    public class CreditTransactionDto
    {
        public Guid Id { get; set; }
        public Guid ParentId { get; set; }
        public DateTime TransactionDate { get; set; }
        public int PointsChanged { get; set; }
        public string Description { get; set; } = string.Empty;
    }
}
