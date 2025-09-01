FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS base
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*
WORKDIR /app
EXPOSE 5010

FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src
COPY ["EnergyMonitor.Api.csproj", "."]
RUN dotnet restore "EnergyMonitor.Api.csproj"
COPY . .
RUN dotnet build "EnergyMonitor.Api.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "EnergyMonitor.Api.csproj" -c Release -o /app/publish --no-restore

FROM base AS final
WORKDIR /app
RUN mkdir -p /app/logs && chmod 755 /app/logs
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "EnergyMonitor.Api.dll"]
