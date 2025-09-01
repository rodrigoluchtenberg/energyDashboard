using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EnergyMonitor.Models.Entities
{
    [Table("Aparelhos")]
    public class Aparelho
    {
        [Key]
        public int AparelhoId { get; set; }
        
        [Required]
        [StringLength(100)]
        public string Nome { get; set; } = string.Empty;
        
        [Required]
        [StringLength(50)]
        public string Tipo { get; set; } = string.Empty;
        
        [Column(TypeName = "decimal(10,2)")]
        public decimal ConsumoMedioWatts { get; set; }
        
        public virtual ICollection<Leitura> Leituras { get; set; } = new List<Leitura>();
    }
}
