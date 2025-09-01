using EnergyMonitor.Models.Entities;

namespace EnergyMonitor.Repositories.Interfaces
{
    public interface IAparelhoRepository
    {
        Task<IEnumerable<Aparelho>> GetAllAsync();
        Task<Aparelho?> GetByIdAsync(int id);
        Task<Aparelho> CreateAsync(Aparelho aparelho);
        Task<Aparelho> UpdateAsync(Aparelho aparelho);
        Task DeleteAsync(int id);
        Task<bool> ExistsAsync(int id);
    }
}
