using EnergyMonitor.Data;
using EnergyMonitor.Models.Entities;
using EnergyMonitor.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace EnergyMonitor.Repositories.Implementations
{
    public class AparelhoRepository : IAparelhoRepository
    {
        private readonly EnergyMonitorContext _context;

        public AparelhoRepository(EnergyMonitorContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Aparelho>> GetAllAsync()
        {
            return await _context.Aparelhos
                .AsNoTracking()
                .ToListAsync();
        }

        public async Task<Aparelho?> GetByIdAsync(int id)
        {
            return await _context.Aparelhos
                .Include(a => a.Leituras)
                .FirstOrDefaultAsync(a => a.AparelhoId == id);
        }

        public async Task<Aparelho> CreateAsync(Aparelho aparelho)
        {
            _context.Aparelhos.Add(aparelho);
            await _context.SaveChangesAsync();
            return aparelho;
        }

        public async Task<Aparelho> UpdateAsync(Aparelho aparelho)
        {
            _context.Entry(aparelho).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return aparelho;
        }

        public async Task DeleteAsync(int id)
        {
            var aparelho = await _context.Aparelhos.FindAsync(id);
            if (aparelho != null)
            {
                _context.Aparelhos.Remove(aparelho);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<bool> ExistsAsync(int id)
        {
            return await _context.Aparelhos.AnyAsync(a => a.AparelhoId == id);
        }
    }
}
