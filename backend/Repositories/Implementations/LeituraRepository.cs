using EnergyMonitor.Data;
using EnergyMonitor.Models.Entities;
using EnergyMonitor.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace EnergyMonitor.Repositories.Implementations
{
    public class LeituraRepository : ILeituraRepository
    {
        private readonly EnergyMonitorContext _context;

        public LeituraRepository(EnergyMonitorContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Leitura>> GetAllAsync()
        {
            return await _context.Leituras
                .Include(l => l.Aparelho)
                .OrderByDescending(l => l.Timestamp)
                .ToListAsync();
        }

        public async Task<IEnumerable<Leitura>> GetByAparelhoIdAsync(int aparelhoId)
        {
            return await _context.Leituras
                .Include(l => l.Aparelho)
                .Where(l => l.AparelhoId == aparelhoId)
                .OrderByDescending(l => l.Timestamp)
                .ToListAsync();
        }

        public async Task<IEnumerable<Leitura>> GetByDateRangeAsync(DateTime startDate, DateTime endDate)
        {
            return await _context.Leituras
                .Include(l => l.Aparelho)
                .Where(l => l.Timestamp >= startDate && l.Timestamp <= endDate)
                .OrderByDescending(l => l.Timestamp)
                .ToListAsync();
        }

        public async Task<IEnumerable<Leitura>> GetRecentAsync(int count = 100)
        {
            return await _context.Leituras
                .Include(l => l.Aparelho)
                .OrderByDescending(l => l.Timestamp)
                .Take(count)
                .ToListAsync();
        }

        public async Task<Leitura> CreateAsync(Leitura leitura)
        {
            _context.Leituras.Add(leitura);
            await _context.SaveChangesAsync();
            return leitura;
        }

        public async Task CreateBatchAsync(IEnumerable<Leitura> leituras)
        {
            _context.Leituras.AddRange(leituras);
            await _context.SaveChangesAsync();
        }

        public async Task<decimal> GetAverageConsumptionAsync(int aparelhoId, DateTime startDate, DateTime endDate)
        {
            var leituras = await _context.Leituras
                .Where(l => l.AparelhoId == aparelhoId && 
                           l.Timestamp >= startDate && 
                           l.Timestamp <= endDate)
                .ToListAsync();

            return leituras.Any() ? leituras.Average(l => l.ConsumoAtualWatts) : 0;
        }

        public async Task<decimal> GetMaxConsumptionAsync(int aparelhoId, DateTime startDate, DateTime endDate)
        {
            var leituras = await _context.Leituras
                .Where(l => l.AparelhoId == aparelhoId && 
                           l.Timestamp >= startDate && 
                           l.Timestamp <= endDate)
                .ToListAsync();

            return leituras.Any() ? leituras.Max(l => l.ConsumoAtualWatts) : 0;
        }
    }
}
