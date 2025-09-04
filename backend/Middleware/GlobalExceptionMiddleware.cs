using Microsoft.Data.Sqlite;
using System.Data.Common;

namespace EnergyMonitor.Middleware
{
    public class GlobalExceptionMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<GlobalExceptionMiddleware> _logger;

        public GlobalExceptionMiddleware(RequestDelegate next, ILogger<GlobalExceptionMiddleware> logger)
        {
            _next = next;
            _logger = logger;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erro não tratado: {Path}", context.Request.Path);
                await HandleExceptionAsync(context, ex);
            }
        }

        private static async Task HandleExceptionAsync(HttpContext context, Exception ex)
        {
            context.Response.ContentType = "application/json";
            
            var response = ex switch
            {
                DbException => new { error = "Erro de banco de dados", code = "DB_ERROR" },
                ArgumentException => new { error = ex.Message, code = "VALIDATION_ERROR" },
                InvalidOperationException => new { error = ex.Message, code = "OPERATION_ERROR" },
                _ => new { error = "Erro interno do servidor", code = "INTERNAL_ERROR" }
            };

            context.Response.StatusCode = ex switch
            {
                DbException => 503,
                ArgumentException => 400,
                InvalidOperationException => 400,
                _ => 500
            };

            await context.Response.WriteAsJsonAsync(response);
        }
    }
}
