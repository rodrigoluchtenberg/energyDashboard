using Microsoft.Extensions.Caching.Memory;

namespace EnergyMonitor.Services
{
    public interface ICacheService
    {
        Task<T?> GetAsync<T>(string key) where T : class;
        Task SetAsync<T>(string key, T value, TimeSpan? expiration = null) where T : class;
        Task RemoveAsync(string key);
        Task ClearAsync();
    }

    public class CacheService : ICacheService
    {
        private readonly IMemoryCache _cache;
        private readonly ILogger<CacheService> _logger;

        public CacheService(IMemoryCache cache, ILogger<CacheService> logger)
        {
            _cache = cache;
            _logger = logger;
        }

        public Task<T?> GetAsync<T>(string key) where T : class
        {
            try
            {
                if (_cache.TryGetValue(key, out T? value))
                {
                    _logger.LogInformation("Cache HIT: {Key}", key);
                    return Task.FromResult(value);
                }

                _logger.LogInformation("Cache MISS: {Key}", key);
                return Task.FromResult<T?>(null);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erro ao buscar cache: {Key}", key);
                return Task.FromResult<T?>(null);
            }
        }

        public Task SetAsync<T>(string key, T value, TimeSpan? expiration = null) where T : class
        {
            try
            {
                var options = new MemoryCacheEntryOptions
                {
                    AbsoluteExpirationRelativeToNow = expiration ?? TimeSpan.FromMinutes(5),
                    SlidingExpiration = TimeSpan.FromMinutes(1),
                    Size = 1
                };

                _cache.Set(key, value, options);
                _logger.LogInformation("Cache SET: {Key} por {Duration}min", 
                    key, options.AbsoluteExpirationRelativeToNow?.TotalMinutes);

                return Task.CompletedTask;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erro ao salvar cache: {Key}", key);
                return Task.CompletedTask;
            }
        }

        public Task RemoveAsync(string key)
        {
            try
            {
                _cache.Remove(key);
                _logger.LogInformation("Cache REMOVE: {Key}", key);
                return Task.CompletedTask;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erro ao remover cache: {Key}", key);
                return Task.CompletedTask;
            }
        }

        public Task ClearAsync()
        {
            try
            {
                if (_cache is MemoryCache memoryCache)
                {
                    memoryCache.Compact(1.0);
                }
                
                _logger.LogInformation("Cache CLEAR: Todos os itens removidos");
                return Task.CompletedTask;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erro ao limpar cache");
                return Task.CompletedTask;
            }
        }
    }
}
