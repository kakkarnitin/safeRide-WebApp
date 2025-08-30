using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Identity.Web;
using SafeRide.Core.Interfaces;
using SafeRide.Core.Services;
using SafeRide.Infrastructure.Data;
using SafeRide.Infrastructure.Repositories;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddAutoMapper(typeof(Program));

// Add Entity Framework with environment-specific database
var useSqlite = builder.Configuration.GetValue<bool>("UseSQLite");
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection") 
    ?? "Data Source=saferide.db";

if (useSqlite || builder.Environment.IsDevelopment())
{
    // Use SQLite for development or when explicitly configured
    builder.Services.AddDbContext<SafeRideDbContext>(options =>
        options.UseSqlite(connectionString));
}
else
{
    // Production: Use PostgreSQL only if SQLite is not specified
    builder.Services.AddDbContext<SafeRideDbContext>(options =>
        options.UseNpgsql(connectionString));
}

// Register repositories and services
builder.Services.AddScoped(typeof(IRepository<>), typeof(GenericRepository<>));
builder.Services.AddScoped<IParentRepository, ParentRepository>();
builder.Services.AddScoped<ISchoolRepository, SchoolRepository>();
builder.Services.AddScoped<IParentSchoolEnrollmentRepository, ParentSchoolEnrollmentRepository>();
builder.Services.AddScoped<ISchoolEnrollmentService, SchoolEnrollmentService>();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IVerificationService, VerificationService>();
builder.Services.AddScoped<IRideService, RideService>();
builder.Services.AddScoped<ICreditService, CreditService>();
builder.Services.AddScoped<IEmailService, EmailService>();

// Configure Microsoft Authentication
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddMicrosoftIdentityWebApi(builder.Configuration.GetSection("AzureAd"));

// Add authorization
builder.Services.AddAuthorization();

// Configure CORS for frontend
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        if (builder.Environment.IsDevelopment())
        {
            policy.WithOrigins("http://localhost:5173", "http://localhost:3000", "http://localhost:3001")
                  .AllowAnyMethod()
                  .AllowAnyHeader()
                  .AllowCredentials();
        }
        else
        {
            // Production CORS - allow Azure Static Web Apps and Container Instance
            var allowedOrigins = builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>() 
                ?? new[] { 
                    "https://calm-stone-0187f440f.2.azurestaticapps.net",
                    "https://kakkarnitin.github.io"
                };
            
            policy.WithOrigins(allowedOrigins)
                  .AllowAnyMethod()
                  .AllowAnyHeader()
                  .AllowCredentials();
        }
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
// Enable Swagger in both development and production for API documentation
app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "SafeRide API v1");
    if (!app.Environment.IsDevelopment())
    {
        c.RoutePrefix = "swagger"; // Serve at /swagger in production
    }
});

app.UseCors("AllowFrontend");

// Only use HTTPS redirection in production with HTTPS support
if (app.Environment.IsProduction() && !builder.Configuration.GetValue<bool>("DisableHttpsRedirection"))
{
    app.UseHttpsRedirection();
}

app.UseAuthentication();
app.UseAuthorization();

// Add health check endpoint
app.MapGet("/api/health", () => Results.Ok(new { 
    status = "healthy", 
    timestamp = DateTime.UtcNow,
    environment = app.Environment.EnvironmentName 
}));

app.MapControllers();

// Ensure database is created
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<SafeRideDbContext>();
    context.Database.EnsureCreated();
    
    // Seed test data
    if (!context.Parents.Any())
    {
        var testParent = new SafeRide.Core.Entities.Parent
        {
            Id = Guid.Parse("00000000-0000-0000-0000-000000000001"),
            FullName = "Test Parent",
            Email = "test@example.com",
            PhoneNumber = "0400000000",
            DrivingLicenseNumber = "DL123456789",
            WorkingWithChildrenCardNumber = "WCC987654321",
            CreditPoints = 5,
            IsVerified = true,
            VerificationStatus = SafeRide.Core.Entities.VerificationStatus.Verified
        };
        
        context.Parents.Add(testParent);
        context.SaveChanges();
    }
}

app.Run();