using System.Net;
using System.Net.Mail;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using SafeRide.Core.Interfaces;

namespace SafeRide.Core.Services;

public class EmailService : IEmailService
{
    private readonly IConfiguration _configuration;
    private readonly ILogger<EmailService> _logger;

    public EmailService(IConfiguration configuration, ILogger<EmailService> logger)
    {
        _configuration = configuration;
        _logger = logger;
    }

    public async Task SendUserRegistrationNotificationAsync(string userEmail, string userName, string userId)
    {
        var adminEmails = GetAdminEmails();
        var subject = "[SafeRide] New User Registration - Approval Required";
        var body = $@"
            <h2>New User Registration</h2>
            <p>A new user has registered on SafeRide and requires approval:</p>
            <ul>
                <li><strong>Name:</strong> {userName}</li>
                <li><strong>Email:</strong> {userEmail}</li>
                <li><strong>User ID:</strong> {userId}</li>
                <li><strong>Registration Date:</strong> {DateTime.UtcNow:yyyy-MM-dd HH:mm:ss} UTC</li>
            </ul>
            <p>Please review and approve this user in the SafeRide admin panel.</p>
            <p><a href=""{GetAdminPanelUrl()}/users/{userId}"">Review User</a></p>
        ";

        foreach (var adminEmail in adminEmails)
        {
            await SendEmailAsync(adminEmail, subject, body);
        }
    }

    public async Task SendSchoolEnrollmentNotificationAsync(string parentEmail, string parentName, string schoolName, string enrollmentId)
    {
        var adminEmails = GetAdminEmails();
        var subject = "[SafeRide] New School Enrollment Request";
        var body = $@"
            <h2>New School Enrollment Request</h2>
            <p>A parent has requested enrollment for their child:</p>
            <ul>
                <li><strong>Parent Name:</strong> {parentName}</li>
                <li><strong>Parent Email:</strong> {parentEmail}</li>
                <li><strong>School:</strong> {schoolName}</li>
                <li><strong>Enrollment ID:</strong> {enrollmentId}</li>
                <li><strong>Request Date:</strong> {DateTime.UtcNow:yyyy-MM-dd HH:mm:ss} UTC</li>
            </ul>
            <p>Please review and process this enrollment request in the SafeRide admin panel.</p>
            <p><a href=""{GetAdminPanelUrl()}/enrollments/{enrollmentId}"">Review Enrollment</a></p>
        ";

        foreach (var adminEmail in adminEmails)
        {
            await SendEmailAsync(adminEmail, subject, body);
        }
    }

    public async Task SendApprovalNotificationAsync(string userEmail, string userName, bool isApproved)
    {
        var subject = isApproved 
            ? "[SafeRide] Account Approved - Welcome!" 
            : "[SafeRide] Account Registration Update";
            
        var body = isApproved 
            ? $@"
                <h2>Welcome to SafeRide, {userName}!</h2>
                <p>Your account has been approved and you can now access all SafeRide features.</p>
                <p><a href=""{GetAppUrl()}/dashboard"">Login to SafeRide</a></p>
                <p>Thank you for joining our community!</p>
            "
            : $@"
                <h2>SafeRide Registration Update</h2>
                <p>Hello {userName},</p>
                <p>Thank you for your interest in SafeRide. Unfortunately, we are unable to approve your account at this time.</p>
                <p>If you have questions, please contact our support team.</p>
            ";

        await SendEmailAsync(userEmail, subject, body);
    }

    private async Task SendEmailAsync(string toEmail, string subject, string htmlBody)
    {
        try
        {
            var smtpSettings = _configuration.GetSection("EmailSettings");
            var smtpServer = smtpSettings["SmtpServer"];
            var smtpPort = int.Parse(smtpSettings["SmtpPort"] ?? "587");
            var smtpUser = smtpSettings["SmtpUser"];
            var smtpPassword = smtpSettings["SmtpPassword"];
            var fromEmail = smtpSettings["FromEmail"];
            var fromName = smtpSettings["FromName"] ?? "SafeRide";

            using var client = new SmtpClient(smtpServer, smtpPort);
            client.Credentials = new NetworkCredential(smtpUser, smtpPassword);
            client.EnableSsl = true;

            var mailMessage = new MailMessage
            {
                From = new MailAddress(fromEmail ?? "noreply@saferide.com", fromName),
                Subject = subject,
                Body = htmlBody,
                IsBodyHtml = true
            };

            mailMessage.To.Add(toEmail);

            await client.SendMailAsync(mailMessage);
            _logger.LogInformation("Email sent successfully to {Email}", toEmail);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to send email to {Email}", toEmail);
            // Don't throw - email failures shouldn't break the main flow
        }
    }

    private List<string> GetAdminEmails()
    {
        var adminEmailsConfig = _configuration["EmailSettings:AdminEmails"];
        if (string.IsNullOrEmpty(adminEmailsConfig))
        {
            return new List<string> { "admin@saferide.com" }; // Default fallback
        }

        return adminEmailsConfig.Split(',', StringSplitOptions.RemoveEmptyEntries)
            .Select(email => email.Trim())
            .ToList();
    }

    private string GetAdminPanelUrl()
    {
        return _configuration["AppSettings:AdminPanelUrl"] ?? "http://localhost:3003/admin";
    }

    private string GetAppUrl()
    {
        return _configuration["AppSettings:AppUrl"] ?? "http://localhost:3003";
    }
}
