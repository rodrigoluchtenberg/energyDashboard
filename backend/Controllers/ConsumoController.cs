using Microsoft.AspNetCore.Mvc;
using EnergyMonitor.Business.Interfaces;
using EnergyMonitor.Services;

namespace EnergyMonitor.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Produces("application/json")]
    public class ConsumoController : ControllerBase
    {
        private readonly IAparelhoService _aparelhoService;
        private readonly IEstatisticasService _estatisticasService;
        private readonly ICacheService _cacheService;
        private readonly ILogger<ConsumoController> _logger;

        public ConsumoController(
            IAparelhoService aparelhoService, 
            IEstatisticasService estatisticasService,
            ICacheService cacheService,
            ILogger<ConsumoController> logger)
        {
            _aparelhoService = aparelhoService;
            _estatisticasService = estatisticasService;
            _cacheService = cacheService;
            _logger = logger;
        }

        [HttpGet("aparelhos")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<IActionResult> GetAparelhos()
        {
            try
            {
                const string cacheKey = "consumo_aparelhos_all";
                
                var cachedAparelhos = await _cacheService.GetAsync<object>(cacheKey);
                if (cachedAparelhos != null)
                {
                    Response.Headers.Add("X-Cache", "HIT");
                    return Ok(cachedAparelhos);
                }

                var aparelhos = await _aparelhoService.GetAllAsync();
                
                await _cacheService.SetAsync(cacheKey, aparelhos, TimeSpan.FromMinutes(5));
                
                Response.Headers.Add("X-Cache", "MISS");
                return Ok(aparelhos);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erro ao buscar aparelhos");
                return StatusCode(500, "Erro interno do servidor");
            }
        }

        [HttpGet("atual")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<IActionResult> GetConsumoAtual()
        {
            try
            {
                const string cacheKey = "consumo_atual_realtime";
                
                var cachedConsumo = await _cacheService.GetAsync<object>(cacheKey);
                if (cachedConsumo != null)
                {
                    Response.Headers.Add("X-Cache", "HIT");
                    return Ok(cachedConsumo);
                }

                var consumo = await _estatisticasService.GetConsumoRealtimeAsync();
                
                await _cacheService.SetAsync(cacheKey, consumo, TimeSpan.FromSeconds(30));
                
                Response.Headers.Add("X-Cache", "MISS");
                return Ok(consumo);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erro ao buscar consumo atual");
                return StatusCode(500, "Erro interno do servidor");
            }
        }

        [HttpGet("estatisticas")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<IActionResult> GetEstatisticas()
        {
            try
            {
                const string cacheKey = "consumo_estatisticas_gerais";
                
                var cachedEstatisticas = await _cacheService.GetAsync<object>(cacheKey);
                if (cachedEstatisticas != null)
                {
                    Response.Headers.Add("X-Cache", "HIT");
                    return Ok(cachedEstatisticas);
                }

                var estatisticas = await _estatisticasService.GetEstatisticasGeraisAsync();
                
                await _cacheService.SetAsync(cacheKey, estatisticas, TimeSpan.FromSeconds(30));
                
                Response.Headers.Add("X-Cache", "MISS");
                return Ok(estatisticas);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erro ao buscar estatísticas");
                return StatusCode(500, "Erro interno do servidor");
            }
        }
    }
}
