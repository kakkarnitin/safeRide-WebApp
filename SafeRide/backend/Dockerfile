# Multi-stage Dockerfile for SafeRide API
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS base
WORKDIR /app
EXPOSE 80

# Install SQLite and curl for health checks
RUN apt-get update && apt-get install -y sqlite3 curl && rm -rf /var/lib/apt/lists/*

FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

# Copy project files for better dependency caching
COPY ["src/SafeRide.Api/SafeRide.Api.csproj", "src/SafeRide.Api/"]
COPY ["src/SafeRide.Core/SafeRide.Core.csproj", "src/SafeRide.Core/"]
COPY ["src/SafeRide.Infrastructure/SafeRide.Infrastructure.csproj", "src/SafeRide.Infrastructure/"]

# Restore dependencies
RUN dotnet restore "src/SafeRide.Api/SafeRide.Api.csproj"

# Copy all source code
COPY . .

# Build and publish the application
WORKDIR "/src/src/SafeRide.Api"
RUN dotnet build "SafeRide.Api.csproj" -c Release -o /app/build
RUN dotnet publish "SafeRide.Api.csproj" -c Release -o /app/publish --no-restore

FROM base AS final
WORKDIR /app
COPY --from=build /app/publish .

# Create data directory for SQLite database
RUN mkdir -p /data

# Set production environment variables
ENV ASPNETCORE_ENVIRONMENT=Production
ENV ASPNETCORE_URLS=http://+:80
ENV ConnectionStrings__DefaultConnection="Data Source=/data/saferide.db"
ENV UseSQLite=true

# Add health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:80/api/health || exit 1

ENTRYPOINT ["dotnet", "SafeRide.Api.dll"]
