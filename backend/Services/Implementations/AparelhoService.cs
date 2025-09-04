using EnergyMonitor.Services.Interfaces;
using EnergyMonitor.Models.DTOs;
using EnergyMonitor.Models.Entities;
using EnergyMonitor.Repositories.Interfaces;

namespace EnergyMonitor.Services.Implementations
{
    public class AparelhoService : IAparelhoService
    {
        private readonly IAparelhoRepository _aparelhoRepository;
        private readonly ILogger<AparelhoService> _logger;

        public AparelhoService(IAparelhoRepository aparelhoRepository, ILogger<AparelhoService> logger)
        {
            _aparelhoRepository = aparelhoRepository;
            _logger = logger;
        }

        public async Task<IEnumerable<AparelhoDto>> GetAllAsync()
        {
            var aparelhos = await _aparelhoRepository.GetAllAsync();
            return aparelhos.Select(MapToDto);
        }

        public async Task<AparelhoDto?> GetByIdAsync(int id)
        {
            var aparelho = await _aparelhoRepository.GetByIdAsync(id);
            return aparelho != null ? MapToDto(aparelho) : null;
        }

        public async Task<AparelhoDto> CreateAsync(AparelhoDto aparelhoDto)
        {
            var aparelho = MapToEntity(aparelhoDto);
            var created = await _aparelhoRepository.CreateAsync(aparelho);
            
            _logger.LogInformation("Aparelho criado: {Nome} - {Tipo}", created.Nome, created.Tipo);
            
            return MapToDto(created);
        }

        public async Task<AparelhoDto> UpdateAsync(int id, AparelhoDto aparelhoDto)
        {
            var existingAparelho = await _aparelhoRepository.GetByIdAsync(id);
            if (existingAparelho == null)
            {
                throw new ArgumentException($"Aparelho com ID {id} não encontrado");
            }

            existingAparelho.Nome = aparelhoDto.Nome;
            existingAparelho.Tipo = aparelhoDto.Tipo;
            existingAparelho.ConsumoMedioWatts = (decimal)aparelhoDto.ConsumoMedio;

            var updated = await _aparelhoRepository.UpdateAsync(existingAparelho);
            
            _logger.LogInformation("Aparelho atualizado: {Id} - {Nome}", updated.AparelhoId, updated.Nome);
            
            return MapToDto(updated);
        }

        public async Task<AparelhoDto> CreateFromDtoAsync(CreateAparelhoDto createDto)
        {
            var aparelho = new Aparelho
            {
                Nome = createDto.Nome,
                Tipo = "Aparelho",
                ConsumoMedioWatts = (decimal)createDto.ConsumoMedio
            };

            var created = await _aparelhoRepository.CreateAsync(aparelho);
            
            _logger.LogInformation("Aparelho criado: {Nome} - {Tipo}", created.Nome, created.Tipo);
            
            return MapToDto(created);
        }

        public async Task<AparelhoDto> UpdateFromDtoAsync(int id, UpdateAparelhoDto updateDto)
        {
            var existingAparelho = await _aparelhoRepository.GetByIdAsync(id);
            if (existingAparelho == null)
            {
                throw new ArgumentException($"Aparelho com ID {id} não encontrado");
            }

            existingAparelho.Nome = updateDto.Nome;
            existingAparelho.ConsumoMedioWatts = (decimal)updateDto.ConsumoMedio;

            var updated = await _aparelhoRepository.UpdateAsync(existingAparelho);
            
            _logger.LogInformation("Aparelho atualizado: {Id} - {Nome}", updated.AparelhoId, updated.Nome);
            
            return MapToDto(updated);
        }

        public async Task DeleteAsync(int id)
        {
            var exists = await _aparelhoRepository.ExistsAsync(id);
            if (!exists)
            {
                throw new ArgumentException($"Aparelho com ID {id} não encontrado");
            }

            await _aparelhoRepository.DeleteAsync(id);
            
            _logger.LogInformation("Aparelho deletado: {Id}", id);
        }

        private static AparelhoDto MapToDto(Aparelho aparelho)
        {
            return new AparelhoDto
            {
                Id = aparelho.AparelhoId,
                Nome = aparelho.Nome,
                Tipo = aparelho.Tipo,
                ConsumoMedio = (double)aparelho.ConsumoMedioWatts,
                Ativo = true,
                UltimaLeitura = aparelho.Leituras?.OrderByDescending(l => l.Timestamp).FirstOrDefault()?.Timestamp ?? DateTime.MinValue
            };
        }

        private static Aparelho MapToEntity(AparelhoDto dto)
        {
            return new Aparelho
            {
                Nome = dto.Nome,
                Tipo = dto.Tipo,
                ConsumoMedioWatts = (decimal)dto.ConsumoMedio
            };
        }
    }
}
