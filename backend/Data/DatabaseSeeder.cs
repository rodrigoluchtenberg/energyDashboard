using EnergyMonitor.Models.Entities;
using Microsoft.EntityFrameworkCore;

namespace EnergyMonitor.Data
{
    public static class DatabaseSeeder
    {
        public static async Task SeedAsync(EnergyMonitorContext context)
        {
            if (await context.Aparelhos.AnyAsync())
            {
                return;
            }

            var aparelhos = new List<Aparelho>
            {
                new Aparelho { Nome = "Geladeira", Tipo = "Eletrodoméstico", ConsumoMedioWatts = 150m },
                new Aparelho { Nome = "TV", Tipo = "Entretenimento", ConsumoMedioWatts = 80m },
                new Aparelho { Nome = "Computador", Tipo = "Tecnologia", ConsumoMedioWatts = 120m },
                new Aparelho { Nome = "Ar Condicionado", Tipo = "Climatização", ConsumoMedioWatts = 2000m },
                new Aparelho { Nome = "Máquina de Lavar", Tipo = "Eletrodoméstico", ConsumoMedioWatts = 500m },
                new Aparelho { Nome = "Microondas", Tipo = "Eletrodoméstico", ConsumoMedioWatts = 1200m },
                new Aparelho { Nome = "Iluminação LED", Tipo = "Iluminação", ConsumoMedioWatts = 100m }
            };

            await context.Aparelhos.AddRangeAsync(aparelhos);
            await context.SaveChangesAsync();
            
            Console.WriteLine($"✅ {aparelhos.Count} aparelhos adicionados ao banco!");
        }
    }
}
