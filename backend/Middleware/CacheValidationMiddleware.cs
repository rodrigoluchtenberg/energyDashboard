using EnergyMonitor.Services;

namespace EnergyMonitor.Middleware
{
    public class CacheValidationMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ICacheService _cacheService;
        private readonly ILogger<CacheValidationMiddleware> _logger;

        public CacheValidationMiddleware(RequestDelegate next, ICacheService cacheService, ILogger<CacheValidationMiddleware> logger)
        {
            _next = next;
            _cacheService = cacheService;
            _logger = logger;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            if (context.Request.Path.StartsWithSegments("/api/consumo"))
            {
                try
                {
                    await _cacheService.GetAsync<object>("health_check");
                    context.Response.Headers.Add("X-Cache-Status", "UP");
                }
                catch (Exception ex)
                {
                    _logger.LogWarning(ex, "Cache não está funcionando corretamente");
                    context.Response.Headers.Add("X-Cache-Status", "DOWN");
                }
            }

            await _next(context);
        }
    }
}
