using Microsoft.EntityFrameworkCore;
using EnergyMonitor.Data;
using EnergyMonitor.Hubs;
using EnergyMonitor.Services;
using EnergyMonitor.Repositories.Interfaces;
using EnergyMonitor.Repositories.Implementations;
using EnergyMonitor.Business.Interfaces;
using EnergyMonitor.Business.Implementations;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<EnergyMonitorContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection") ?? 
    "Data Source=energy_monitor.db", sqliteOptions => {
        sqliteOptions.CommandTimeout(5);
    }).EnableSensitiveDataLogging(false)
      .EnableServiceProviderCaching()
      .ConfigureWarnings(warnings => warnings.Ignore(Microsoft.EntityFrameworkCore.Diagnostics.CoreEventId.SensitiveDataLoggingEnabledWarning)));

builder.Services.AddSignalR();

builder.Services.AddScoped<IAparelhoRepository, AparelhoRepository>();
builder.Services.AddScoped<ILeituraRepository, LeituraRepository>();

builder.Services.AddScoped<IAparelhoService, AparelhoService>();
builder.Services.AddScoped<IEstatisticasService, EstatisticasService>();
builder.Services.AddSingleton<ICacheService, CacheService>();

builder.Services.AddControllers();
builder.Services.AddLogging();
builder.Services.AddMemoryCache();

builder.Services.AddResponseCompression(options =>
{
    options.EnableForHttps = true;
});

builder.Services.AddMemoryCache(options =>
{
    options.SizeLimit = 100;
    options.CompactionPercentage = 0.25;
});

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.WithOrigins("http://localhost:3000", "http://localhost:3001")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new() { 
        Title = "Energy Monitor API", 
        Version = "v1",
        Description = "API para monitoramento de consumo de energia em tempo real"
    });
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "Energy Monitor API V1");
        c.RoutePrefix = string.Empty;
    });
}
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<EnergyMonitorContext>();
    
    context.Database.EnsureCreated();
    await DatabaseSeeder.SeedAsync(context);
    DbOptimizations.ApplyOptimizations(context);
    
    Console.WriteLine("Banco de dados otimizado e pronto!");
}

app.UseMiddleware<EnergyMonitor.Middleware.GlobalExceptionMiddleware>();
app.UseMiddleware<EnergyMonitor.Middleware.RequestLoggingMiddleware>();
app.UseMiddleware<EnergyMonitor.Middleware.CacheValidationMiddleware>();
app.UseMiddleware<EnergyMonitor.Middleware.RateLimitingMiddleware>();

app.UseCors();
app.UseResponseCompression();
app.UseHttpsRedirection();
app.MapControllers();
app.MapHub<EnergyMonitorHub>("/energyhub");

app.Run();
