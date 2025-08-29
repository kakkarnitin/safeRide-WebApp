FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS base
WORKDIR /app
EXPOSE 80

FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src
COPY ["backend/src/SafeRide.Api/SafeRide.Api.csproj", "SafeRide.Api/"]
COPY ["backend/src/SafeRide.Core/SafeRide.Core.csproj", "SafeRide.Core/"]
COPY ["backend/src/SafeRide.Infrastructure/SafeRide.Infrastructure.csproj", "SafeRide.Infrastructure/"]
RUN dotnet restore "SafeRide.Api/SafeRide.Api.csproj"
COPY . .
WORKDIR "/src/backend/src/SafeRide.Api"
RUN dotnet build "SafeRide.Api.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "SafeRide.Api.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "SafeRide.Api.dll"]