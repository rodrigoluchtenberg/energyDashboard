using Microsoft.EntityFrameworkCore;
using EnergyMonitor.Models.Entities;

namespace EnergyMonitor.Data
{
    public class EnergyMonitorContext : DbContext
    {
        public EnergyMonitorContext(DbContextOptions<EnergyMonitorContext> options)
            : base(options)
        {
        }

        public DbSet<Aparelho> Aparelhos { get; set; }
        public DbSet<Leitura> Leituras { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Aparelho>(entity =>
            {
                entity.HasKey(e => e.AparelhoId);
                entity.Property(e => e.Nome).IsRequired().HasMaxLength(100);
                entity.Property(e => e.Tipo).IsRequired().HasMaxLength(50);
                entity.Property(e => e.ConsumoMedioWatts).HasColumnType("decimal(10,2)");
            });

            modelBuilder.Entity<Leitura>(entity =>
            {
                entity.HasKey(e => e.LeituraId);
                entity.Property(e => e.ConsumoAtualWatts).HasColumnType("decimal(10,2)");
                entity.Property(e => e.TensaoVolts).HasColumnType("decimal(6,2)");
                entity.Property(e => e.CorrenteAmperes).HasColumnType("decimal(8,3)");
                
                entity.HasOne(d => d.Aparelho)
                    .WithMany(p => p.Leituras)
                    .HasForeignKey(d => d.AparelhoId)
                    .OnDelete(DeleteBehavior.Cascade);
                    
                entity.HasIndex(e => e.AparelhoId);
                entity.HasIndex(e => e.Timestamp);
            });
        }
    }
}
