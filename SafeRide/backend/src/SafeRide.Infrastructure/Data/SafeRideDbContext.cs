using Microsoft.EntityFrameworkCore;
using SafeRide.Core.Entities;

namespace SafeRide.Infrastructure.Data
{
    public class SafeRideDbContext : DbContext
    {
        public SafeRideDbContext(DbContextOptions<SafeRideDbContext> options) : base(options)
        {
        }

        public DbSet<Parent> Parents { get; set; }
        public DbSet<RideOffer> RideOffers { get; set; }
        public DbSet<RideReservation> RideReservations { get; set; }
        public DbSet<VerificationDocument> VerificationDocuments { get; set; }
        public DbSet<School> Schools { get; set; }
        public DbSet<CreditTransaction> CreditTransactions { get; set; }
        public DbSet<ParentSchoolEnrollment> ParentSchoolEnrollments { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Add configurations for entities here if needed
            base.OnModelCreating(modelBuilder);
        }
    }
}