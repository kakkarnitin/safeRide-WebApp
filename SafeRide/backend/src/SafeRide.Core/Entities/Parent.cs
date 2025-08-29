using System;
using System.Collections.Generic;

namespace SafeRide.Core.Entities
{
    public class Parent
    {
        public Guid Id { get; set; }
        public required string FullName { get; set; }
        public required string Email { get; set; }
        public required string PhoneNumber { get; set; }
        public required string DrivingLicenseNumber { get; set; }
        public required string WorkingWithChildrenCardNumber { get; set; }
        public int CreditPoints { get; set; } = 5;
        public bool IsVerified { get; set; }
        public VerificationStatus VerificationStatus { get; set; } = VerificationStatus.Pending;
        public List<RideOffer> RideOffers { get; set; }
        public List<RideReservation> RideReservations { get; set; }
        public List<ParentSchoolEnrollment> SchoolEnrollments { get; set; }

        public Parent()
        {
            RideOffers = new List<RideOffer>();
            RideReservations = new List<RideReservation>();
            SchoolEnrollments = new List<ParentSchoolEnrollment>();
        }
    }
}