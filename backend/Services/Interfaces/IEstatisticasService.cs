using EnergyMonitor.Models.DTOs;

namespace EnergyMonitor.Services.Interfaces
{
    public interface IEstatisticasService
    {
        Task<EstatisticasDto> GetEstatisticasGeraisAsync();
        Task<IEnumerable<ConsumoRealtimeDto>> GetConsumoRealtimeAsync();
        void InvalidateCache();
    }
}
