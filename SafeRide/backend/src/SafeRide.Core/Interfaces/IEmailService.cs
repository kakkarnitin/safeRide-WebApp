namespace SafeRide.Core.Interfaces;

public interface IEmailService
{
    Task SendUserRegistrationNotificationAsync(string userEmail, string userName, string userId);
    Task SendSchoolEnrollmentNotificationAsync(string parentEmail, string parentName, string schoolName, string enrollmentId);
    Task SendApprovalNotificationAsync(string userEmail, string userName, bool isApproved);
}
