using EnergyMonitor.Models.DTOs;

namespace EnergyMonitor.Business.Interfaces
{
    public interface IAparelhoService
    {
        Task<IEnumerable<AparelhoDto>> GetAllAsync();
        Task<AparelhoDto?> GetByIdAsync(int id);
        Task<AparelhoDto> CreateAsync(AparelhoDto aparelhoDto);
        Task<AparelhoDto> UpdateAsync(int id, AparelhoDto aparelhoDto);
        Task<AparelhoDto> CreateFromDtoAsync(CreateAparelhoDto createDto);
        Task<AparelhoDto> UpdateFromDtoAsync(int id, UpdateAparelhoDto updateDto);
        Task DeleteAsync(int id);
    }
}
