using System;

namespace SafeRide.Core.Entities
{
    public class CreditTransaction
    {
        public Guid Id { get; set; }
        public Guid ParentId { get; set; }
        public DateTime TransactionDate { get; set; }
        public int PointsChanged { get; set; }
        public string Description { get; set; }

        public CreditTransaction(Guid parentId, int pointsChanged, string description)
        {
            Id = Guid.NewGuid();
            ParentId = parentId;
            TransactionDate = DateTime.UtcNow;
            PointsChanged = pointsChanged;
            Description = description;
        }
    }
}