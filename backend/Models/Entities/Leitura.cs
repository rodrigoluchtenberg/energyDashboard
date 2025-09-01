using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EnergyMonitor.Models.Entities
{
    [Table("Leituras")]
    public class Leitura
    {
        [Key]
        public int LeituraId { get; set; }
        
        [Required]
        public int AparelhoId { get; set; }
        
        [Required]
        public DateTime Timestamp { get; set; }
        
        [Column(TypeName = "decimal(10,2)")]
        public decimal ConsumoAtualWatts { get; set; }
        
        [Column(TypeName = "decimal(6,2)")]
        public decimal TensaoVolts { get; set; }
        
        [Column(TypeName = "decimal(8,3)")]
        public decimal CorrenteAmperes { get; set; }
        
        [ForeignKey(nameof(AparelhoId))]
        public virtual Aparelho Aparelho { get; set; } = null!;
    }
}
