using EnergyMonitor.Models.Entities;

namespace EnergyMonitor.Repositories.Interfaces
{
    public interface ILeituraRepository
    {
        Task<IEnumerable<Leitura>> GetAllAsync();
        Task<IEnumerable<Leitura>> GetByAparelhoIdAsync(int aparelhoId);
        Task<IEnumerable<Leitura>> GetByDateRangeAsync(DateTime startDate, DateTime endDate);
        Task<IEnumerable<Leitura>> GetRecentAsync(int count = 100);
        Task<Leitura> CreateAsync(Leitura leitura);
        Task CreateBatchAsync(IEnumerable<Leitura> leituras);
        Task<decimal> GetAverageConsumptionAsync(int aparelhoId, DateTime startDate, DateTime endDate);
        Task<decimal> GetMaxConsumptionAsync(int aparelhoId, DateTime startDate, DateTime endDate);
    }
}
