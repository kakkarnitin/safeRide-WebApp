using System.Collections.Generic;

namespace SafeRide.Core.Entities
{
    public class School
    {
        public int Id { get; set; }
        public required string Name { get; set; }
        public required string Address { get; set; }
        public bool IsActive { get; set; } = true;
        public DateTime CreatedDate { get; set; } = DateTime.UtcNow;
        public string? ContactEmail { get; set; }
        public string? ContactPhone { get; set; }
        public List<Parent> Parents { get; set; }
        public List<ParentSchoolEnrollment> ParentEnrollments { get; set; }

        public School()
        {
            Parents = new List<Parent>();
            ParentEnrollments = new List<ParentSchoolEnrollment>();
        }
    }
}