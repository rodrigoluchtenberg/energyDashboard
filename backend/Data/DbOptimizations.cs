using Microsoft.EntityFrameworkCore;
using EnergyMonitor.Data;

namespace EnergyMonitor.Data
{
    public static class DbOptimizations
    {
        public static void ApplyOptimizations(EnergyMonitorContext context)
        {
            context.Database.ExecuteSqlRaw(@"
                CREATE INDEX IF NOT EXISTS idx_leituras_aparelho_id 
                ON Leituras(AparelhoId);
                
                CREATE INDEX IF NOT EXISTS idx_leituras_timestamp 
                ON Leituras(Timestamp DESC);
                
                CREATE INDEX IF NOT EXISTS idx_leituras_aparelho_timestamp 
                ON Leituras(AparelhoId, Timestamp DESC);
                
                PRAGMA journal_mode=WAL;
                PRAGMA synchronous=NORMAL;
                PRAGMA cache_size=10000;
                PRAGMA temp_store=MEMORY;
            ");
        }
    }
}
