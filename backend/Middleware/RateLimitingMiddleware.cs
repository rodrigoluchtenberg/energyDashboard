namespace EnergyMonitor.Middleware
{
    public class RateLimitingMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<RateLimitingMiddleware> _logger;
        private readonly Dictionary<string, (int count, DateTime resetTime)> _requestCounts = new();
        private readonly object _lock = new object();

        public RateLimitingMiddleware(RequestDelegate next, ILogger<RateLimitingMiddleware> logger)
        {
            _next = next;
            _logger = logger;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            var clientIp = context.Connection.RemoteIpAddress?.ToString() ?? "unknown";
            var now = DateTime.UtcNow;
            
            lock (_lock)
            {
                if (_requestCounts.TryGetValue(clientIp, out var info))
                {
                    if (now > info.resetTime)
                    {
                        _requestCounts[clientIp] = (1, now.AddMinutes(1));
                    }
                    else if (info.count >= 100)
                    {
                        _logger.LogWarning("Rate limit excedido para IP: {ClientIp}", clientIp);
                        context.Response.StatusCode = 429;
                        context.Response.ContentType = "application/json";
                        context.Response.WriteAsJsonAsync(new { error = "Muitas requisições. Tente novamente em 1 minuto." });
                        return;
                    }
                    else
                    {
                        _requestCounts[clientIp] = (info.count + 1, info.resetTime);
                    }
                }
                else
                {
                    _requestCounts[clientIp] = (1, now.AddMinutes(1));
                }
            }

            await _next(context);
        }
    }
}
