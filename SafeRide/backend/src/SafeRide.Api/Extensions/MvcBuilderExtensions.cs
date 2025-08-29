using Microsoft.Extensions.DependencyInjection;
using Microsoft.AspNetCore.Mvc;

namespace SafeRide.Api.Extensions
{
    public static class MvcBuilderExtensions
    {
        public static IMvcBuilder AddCustomMvc(this IMvcBuilder builder)
        {
            // Add custom configurations for MVC here
            builder.AddJsonOptions(options =>
            {
                options.JsonSerializerOptions.PropertyNamingPolicy = null; // Preserve property names
            });

            return builder;
        }
    }
}