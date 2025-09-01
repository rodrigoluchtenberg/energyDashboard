using EnergyMonitor.Models.DTOs;

namespace EnergyMonitor.Business.Interfaces
{
    public interface IEstatisticasService
    {
        Task<EstatisticasDto> GetEstatisticasGeraisAsync();
        Task<IEnumerable<ConsumoRealtimeDto>> GetConsumoRealtimeAsync();
    }
}
