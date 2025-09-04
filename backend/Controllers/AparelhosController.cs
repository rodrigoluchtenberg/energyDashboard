using Microsoft.AspNetCore.Mvc;
using EnergyMonitor.Business.Interfaces;
using EnergyMonitor.Models.DTOs;
using EnergyMonitor.Services;

namespace EnergyMonitor.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Produces("application/json")]
    public class AparelhosController : ControllerBase
    {
        private readonly IAparelhoService _aparelhoService;
        private readonly IEstatisticasService _estatisticasService;
        private readonly ICacheService _cacheService;
        private readonly ILogger<AparelhosController> _logger;

        public AparelhosController(
            IAparelhoService aparelhoService, 
            IEstatisticasService estatisticasService,
            ICacheService cacheService, 
            ILogger<AparelhosController> logger)
        {
            _aparelhoService = aparelhoService;
            _estatisticasService = estatisticasService;
            _cacheService = cacheService;
            _logger = logger;
        }

        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<IEnumerable<AparelhoDto>>> GetAll()
        {
            var aparelhos = await _aparelhoService.GetAllAsync();
            return Ok(aparelhos);
        }

        [HttpGet("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<AparelhoDto>> GetById(int id)
        {
            var aparelho = await _aparelhoService.GetByIdAsync(id);
            
            if (aparelho == null)
                return NotFound($"Aparelho com ID {id} não encontrado");

            return Ok(aparelho);
        }

        [HttpPost]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<AparelhoDto>> Create([FromBody] CreateAparelhoDto createDto)
        {
            _logger.LogInformation("Recebido CreateAparelhoDto: Nome={Nome}, ConsumoMedio={ConsumoMedio}", 
                createDto?.Nome, createDto?.ConsumoMedio);

            if (!ModelState.IsValid)
            {
                _logger.LogWarning("ModelState inválido: {Errors}", 
                    string.Join(", ", ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage)));
                return BadRequest(ModelState);
            }

            var aparelho = await _aparelhoService.CreateFromDtoAsync(createDto);
            
            await _cacheService.RemoveAsync("consumo_aparelhos_all");
            await _cacheService.RemoveAsync("consumo_atual_realtime");
            await _cacheService.RemoveAsync("consumo_estatisticas_gerais");
            _estatisticasService.InvalidateCache();
            
            _logger.LogInformation("Aparelho criado e cache invalidado: {Nome}", aparelho.Nome);
            
            return CreatedAtAction(nameof(GetById), new { id = aparelho.Id }, aparelho);
        }

        [HttpPut("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<AparelhoDto>> Update(int id, [FromBody] UpdateAparelhoDto updateDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var aparelho = await _aparelhoService.UpdateFromDtoAsync(id, updateDto);
            
            await _cacheService.RemoveAsync("consumo_aparelhos_all");
            await _cacheService.RemoveAsync("consumo_atual_realtime");
            await _cacheService.RemoveAsync("consumo_estatisticas_gerais");
            _estatisticasService.InvalidateCache();
            
            _logger.LogInformation("Aparelho {Id} atualizado e cache invalidado", id);
            
            return Ok(aparelho);
        }

        [HttpDelete("{id}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> Delete(int id)
        {
            await _aparelhoService.DeleteAsync(id);
            
            await _cacheService.RemoveAsync("consumo_aparelhos_all");
            await _cacheService.RemoveAsync("consumo_atual_realtime");
            await _cacheService.RemoveAsync("consumo_estatisticas_gerais");
            _estatisticasService.InvalidateCache();
            
            _logger.LogInformation("Aparelho {Id} deletado e cache invalidado", id);
            
            return NoContent();
        }
    }
}
