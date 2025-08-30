# Email Configuration Guide for SafeRide

This guide explains how to configure email notifications for user registration and school enrollment requests.

## Email Service Features

- ✅ **User Registration Notifications**: Admins receive emails when new users register
- ✅ **School Enrollment Notifications**: Admins receive emails when parents request school enrollment
- ✅ **Approval Notifications**: Users receive emails when their accounts are approved/rejected

## Configuration Steps

### 1. Gmail Setup (Recommended for Development)

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate App Password**:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate password for "Mail"
   - Copy the 16-character password

### 2. Update Configuration Files

**For Development** - Update `appsettings.Development.json`:

```json
{
  "EmailSettings": {
    "SmtpServer": "smtp.gmail.com",
    "SmtpPort": "587",
    "SmtpUser": "your-gmail@gmail.com",
    "SmtpPassword": "your-16-char-app-password",
    "FromEmail": "noreply@saferide.com",
    "FromName": "SafeRide Dev",
    "AdminEmails": "admin@yourdomain.com,manager@yourdomain.com"
  },
  "AppSettings": {
    "AppUrl": "http://localhost:3003",
    "AdminPanelUrl": "http://localhost:3003/admin"
  }
}
```

**For Production** - Update `appsettings.json` or use environment variables:

```json
{
  "EmailSettings": {
    "SmtpServer": "smtp.sendgrid.net",
    "SmtpPort": "587",
    "SmtpUser": "apikey",
    "SmtpPassword": "your-sendgrid-api-key",
    "FromEmail": "noreply@saferide.com",
    "FromName": "SafeRide",
    "AdminEmails": "admin@saferide.com,support@saferide.com"
  },
  "AppSettings": {
    "AppUrl": "https://kakkarnitin.github.io/safeRide-WebApp",
    "AdminPanelUrl": "https://kakkarnitin.github.io/safeRide-WebApp/admin"
  }
}
```

### 3. Environment Variables (Alternative)

Instead of storing credentials in config files, use environment variables:

```bash
export EmailSettings__SmtpUser="your-email@gmail.com"
export EmailSettings__SmtpPassword="your-app-password"
export EmailSettings__AdminEmails="admin@yourdomain.com"
```

### 4. Azure App Service Configuration

For production deployment on Azure:

1. Go to Azure Portal → Your App Service
2. Configuration → Application settings
3. Add these settings:
   - `EmailSettings__SmtpUser`
   - `EmailSettings__SmtpPassword`
   - `EmailSettings__AdminEmails`

## Email Templates

The system includes professional HTML email templates for:

### User Registration Notification (to Admins)
- User details (name, email, ID)
- Registration timestamp
- Direct link to admin panel for approval

### School Enrollment Notification (to Admins)
- Parent details
- School information
- Request timestamp
- Direct link to admin panel for review

### Approval Notification (to Users)
- Welcome message for approved users
- Link to dashboard
- Professional branding

## Testing Email Configuration

### 1. Test User Registration
```bash
curl -X POST "http://localhost:5001/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Parent",
    "email": "test@example.com",
    "password": "TestPassword123",
    "phoneNumber": "+1234567890"
  }'
```

### 2. Test School Enrollment
```bash
curl -X POST "http://localhost:5001/api/schools/enroll" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your-jwt-token" \
  -d '{
    "schoolId": 1,
    "parentNotes": "My child needs safe transportation"
  }'
```

### 3. Check Admin Panel
- Navigate to `/admin` in your application
- View pending users and enrollment requests
- Test approval/rejection workflow

## Troubleshooting

### Common Issues

1. **SMTP Authentication Failed**
   - Verify app password is correctly generated
   - Check that 2FA is enabled on Gmail
   - Ensure no spaces in the app password

2. **Emails Not Received**
   - Check spam/junk folders
   - Verify admin email addresses are correct
   - Check application logs for error messages

3. **SSL/TLS Errors**
   - Ensure port 587 is used for Gmail
   - Verify `EnableSsl = true` in the email service

### Debug Logging

Add to `appsettings.Development.json`:

```json
{
  "Logging": {
    "LogLevel": {
      "SafeRide.Core.Services.EmailService": "Debug"
    }
  }
}
```

## Security Best Practices

1. **Never commit credentials** to version control
2. **Use app passwords** instead of account passwords
3. **Rotate credentials** regularly
4. **Use environment variables** in production
5. **Monitor email usage** for abuse

## Alternative Email Providers

### SendGrid (Production Recommended)
```json
{
  "SmtpServer": "smtp.sendgrid.net",
  "SmtpPort": "587",
  "SmtpUser": "apikey",
  "SmtpPassword": "your-sendgrid-api-key"
}
```

### Outlook/Hotmail
```json
{
  "SmtpServer": "smtp-mail.outlook.com",
  "SmtpPort": "587",
  "SmtpUser": "your-outlook@outlook.com",
  "SmtpPassword": "your-password"
}
```

### AWS SES
```json
{
  "SmtpServer": "email-smtp.us-east-1.amazonaws.com",
  "SmtpPort": "587",
  "SmtpUser": "your-aws-access-key",
  "SmtpPassword": "your-aws-secret-key"
}
```

## Admin Panel Integration

The system provides REST endpoints for admin operations:

- `GET /api/admin/pending-users` - List users awaiting approval
- `POST /api/admin/approve-user/{userId}` - Approve/reject user
- `GET /api/admin/enrollment-requests` - List pending enrollments

These can be integrated into the frontend admin panel for easy management.

## Support

If you encounter issues:
1. Check the application logs
2. Verify email configuration
3. Test with a simple email client
4. Review firewall/network settings
