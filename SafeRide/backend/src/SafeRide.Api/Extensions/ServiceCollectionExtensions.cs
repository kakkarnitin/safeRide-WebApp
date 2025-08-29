using Microsoft.Extensions.DependencyInjection;

namespace SafeRide.Api.Extensions
{
    public static class ServiceCollectionExtensions
    {
        public static IServiceCollection AddApplicationServices(this IServiceCollection services)
        {
            // Register application services here
            // Example: services.AddScoped<IYourService, YourService>();

            return services;
        }

        public static IServiceCollection AddInfrastructureServices(this IServiceCollection services)
        {
            // Register infrastructure services here
            // Example: services.AddScoped<IYourRepository, YourRepository>();

            return services;
        }

        public static IServiceCollection AddVerificationServices(this IServiceCollection services)
        {
            // Register verification services here
            // Example: services.AddScoped<IVerificationService, VerificationService>();

            return services;
        }

        public static IServiceCollection AddRideServices(this IServiceCollection services)
        {
            // Register ride services here
            // Example: services.AddScoped<IRideService, RideService>();

            return services;
        }

        public static IServiceCollection AddCreditServices(this IServiceCollection services)
        {
            // Register credit services here
            // Example: services.AddScoped<ICreditService, CreditService>();

            return services;
        }
    }
}