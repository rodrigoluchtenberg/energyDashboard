using Microsoft.AspNetCore.Mvc;
using EnergyMonitor.Business.Interfaces;
using EnergyMonitor.Models.DTOs;

namespace EnergyMonitor.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Produces("application/json")]
    public class AparelhosController : ControllerBase
    {
        private readonly IAparelhoService _aparelhoService;
        private readonly ILogger<AparelhosController> _logger;

        public AparelhosController(IAparelhoService aparelhoService, ILogger<AparelhosController> logger)
        {
            _aparelhoService = aparelhoService;
            _logger = logger;
        }

        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<IEnumerable<AparelhoDto>>> GetAll()
        {
            try
            {
                var aparelhos = await _aparelhoService.GetAllAsync();
                return Ok(aparelhos);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erro ao buscar aparelhos");
                return StatusCode(500, "Erro interno do servidor");
            }
        }

        [HttpGet("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<AparelhoDto>> GetById(int id)
        {
            try
            {
                var aparelho = await _aparelhoService.GetByIdAsync(id);
                
                if (aparelho == null)
                    return NotFound($"Aparelho com ID {id} não encontrado");

                return Ok(aparelho);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erro ao buscar aparelho {Id}", id);
                return StatusCode(500, "Erro interno do servidor");
            }
        }

        [HttpPost]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<AparelhoDto>> Create([FromBody] CreateAparelhoDto createDto)
        {
            try
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
                return CreatedAtAction(nameof(GetById), new { id = aparelho.Id }, aparelho);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erro ao criar aparelho");
                return StatusCode(500, "Erro interno do servidor");
            }
        }

        [HttpPut("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<AparelhoDto>> Update(int id, [FromBody] UpdateAparelhoDto updateDto)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var aparelho = await _aparelhoService.UpdateFromDtoAsync(id, updateDto);
                return Ok(aparelho);
            }
            catch (ArgumentException)
            {
                return NotFound($"Aparelho com ID {id} não encontrado");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erro ao atualizar aparelho {Id}", id);
                return StatusCode(500, "Erro interno do servidor");
            }
        }

        [HttpDelete("{id}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                await _aparelhoService.DeleteAsync(id);
                return NoContent();
            }
            catch (ArgumentException)
            {
                return NotFound($"Aparelho com ID {id} não encontrado");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erro ao deletar aparelho {Id}", id);
                return StatusCode(500, "Erro interno do servidor");
            }
        }
    }
}
